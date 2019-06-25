`#include "runtimeLibraries.jsx"`
_ = {}
PADDING = 80

panelTest = this

openScript = (targetScript) ->
  start_folder = new Folder(new File($.fileName).parent.fsName)
  scriptFile = new File(start_folder.fsName + "/#{targetScript}")
  script = "#include '#{scriptFile.fullName}'"
  eval script

loadContentIntoView = (treeView) ->
  treeView.removeAll()

  # Make an object with all the PDFs
  contentTree = {}
  allPageComps = NFProject.allPageComps()
  for pageComp in allPageComps
    pdfNumber = pageComp.getPDFNumber()

    contentTree[pdfNumber] = [] unless contentTree[pdfNumber]?
    contentTree[pdfNumber].push pageComp

  for key of contentTree
    thisPDFNode = treeView.add 'node', "PDF #{key}"

    pageCompArr = contentTree[key]
    # pdfTree = contentTree[key]
    # for pageKey of pdfTree
    for pageComp in pageCompArr
      pageHighlights = pageComp.highlights()
      pageNumber = pageComp.getPageNumber()
      if pageHighlights.isEmpty()
        thisPageNode = thisPDFNode.add 'item', "Page #{pageNumber}"
        thisPageNode.data = pageComp
      else
        thisPageNode = thisPDFNode.add 'node', "Page #{pageNumber}"
        thisPageNode.data = pageComp

        pageHighlights.forEach (highlight) =>
          thisHighlightItem = thisPageNode.add 'item', highlight.layer.name
          thisHighlightItem.data = highlight

        thisPageNode.expanded = no

    thisPDFNode.expanded = no

main = ->
  _.panel = getPanelUI()

# Returns the panel if we're a UI panel, and creates a new Window if not
getPanelUI = ->
  # NOTE: This could potentially cause a bug where the panel doesnt show up. Keep an eye on it
  return _.panel if _.panel?

  panel = undefined

  # check if this Obj is a panel (run from Window menu)
  if panelTest instanceof Panel
    # is a panel (called from Window menu)
    panel = panelTest
    _.isUIPanel = yes
  else
    # not a panel (called from File > Scripts > Run)
    # FIXME: This may not work dimensions-wise. Need to come back & fix
    panelType = if _.debug then "dialog" else "palette"
    panel = new Window("dialog", "NF Tools")
    _.isUIPanel = no

  panel.alignChildren = 'left'

  buttonPanel = panel.add 'panel', undefined, 'Selector', {borderStyle:'none'}
  buttonPanel.alignment = ['fill','fill']
  buttonPanel.alignChildren = 'left'
  buttonPanel.margins.top = 16

  treeView = buttonPanel.add 'treeview', undefined #[0, 0, 250, 150]
  treeView.preferredSize = [220, 250]
  treeView.alignment = ['fill','fill']

  loadContentIntoView treeView

  buttonGroup = buttonPanel.add 'group', undefined
  buttonGroup.maximumSize = [200,50]

  goButton = buttonGroup.add('button', undefined, 'Show')
  goButton.onClick = (w) ->
    choice = treeView.selection?.data

    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "NF Selector"

    pickedHighlight = choice instanceof NFHighlightLayer
    pickedPage = choice instanceof NFPageComp

    if pickedPage
      choicePage = choice
    else if pickedHighlight
      choicePage = choice.containingComp()

    # First, bring in a continuous version of the page.
    thisPart = NFProject.activeComp()
    throw new Error "This operation can only be performed in a part comp." unless thisPart instanceof NFPartComp

    # FIXME: Don't insert a new page if there's already a perfectly good one there ya dummy
    # Check if this page already exists or not.
    layersForPage = thisPart.layersForPage choicePage

    targetPageLayer = null
    unless layersForPage.isEmpty()
      layersForPage.forEach (layer) =>
        targetPageLayer = layer if layer.isActive()


    if not targetPageLayer?
      newPageLayer = thisPart.insertPage
        page: choicePage
        continuous: yes
      group = newPageLayer.getPaperLayerGroup()
      group.setConnectionToZoomer
        connected: no
      newPageLayer.transform('Scale').setValue [20,20,20]
      newPageLayer.transform('Position').setValue [1560, -150]
      targetPageLayer = newPageLayer

    if pickedHighlight
      # Duplicate and convert to reference layer
      refLayer = targetPageLayer.duplicateAsReferenceLayer()
      refLayer.layer.name = "#{refLayer.getName()} (#{choice.getName()})"
      unless newPageLayer?
        refLayer.moveAfter targetPageLayer.getPaperLayerGroup().getControlLayers().getBottommostLayer()
        refLayer.layer.inPoint = thisPart.getTime()
        refLayer.transform("Position").expression = ""
        refLayer.removeNFMarkers()

      # Frame up that baby
      # FIXME: Allow multiple selections so you can show expands too and frame they up together with a 'combineRects' function
      scaleFactor = refLayer.getScaleFactorToFrameUp
        highlight: choice
      scaleProp = refLayer.transform "Scale"
      oldScale = scaleProp.value
      newScale = oldScale[0] * scaleFactor
      scaleProp.setValue [newScale, newScale]

      positionDelta = refLayer.getPositionDeltaToFrameUp
        highlight: choice
      positionProp = refLayer.transform "Position"
      oldPosition = positionProp.value
      newPosition = [oldPosition[0] + positionDelta[0], oldPosition[1] + positionDelta[1]]
      positionProp.setValue newPosition

      # Make a mask over the text
      currTime = thisPart.getTime()
      highlightRect = choice.sourceRect()
      thisPart.setTime(currTime) unless thisPart.getTime() is currTime
      highlightThickness = choice.highlighterEffect().property("Thickness").value
      paddedHighlightRect =
        left: highlightRect.left
        top: highlightRect.top - (highlightThickness/2)
        width: highlightRect.width
        height: highlightRect.height + highlightThickness
      newMask = refLayer.mask().addProperty "Mask"
      newMask.maskShape.setValue NFTools.shapeFromRect(paddedHighlightRect)
      newMask.maskFeather.setValue [20,20]
      newMask.maskExpansion.setValue 3
      refLayer.effect("Drop Shadow").remove()
      refLayer.effects().addProperty("ADBE Brightness & Contrast 2").property("Contrast").setValue(99)
      refLayer.layer.blendingMode = BlendingMode.DARKEN

      # Create a white BG box and attach it to the ref layer
      bgSolid = thisPart.addSolid
        color: [1,1,1]
        name: "^ Backing"
      bgSolid.layer.inPoint = currTime
      bgSolid.moveAfter refLayer
      bgSolid.transform("Opacity").setValue 90
      relRect = refLayer.relativeRect paddedHighlightRect
      paddedRelRect =
        left: relRect.left - (PADDING / 2)
        top: relRect.top - (PADDING / 4)
        width: relRect.width + PADDING
        height: relRect.height + (PADDING / 2)
      newMask = bgSolid.mask().addProperty "Mask"
      newMask.maskShape.setValue NFTools.shapeFromRect(paddedRelRect)
      bgSolid.setParent refLayer
      bgSolid.transform("Opacity").expression = NFTools.readExpression "backing-opacity-expression"
      shadowProp = bgSolid.effects().addProperty('ADBE Drop Shadow')
      shadowProp.property('Opacity').setValue(76.5)
      shadowProp.property('Direction').setValue(152)
      shadowProp.property('Distance').setValue(20)
      shadowProp.property('Softness').setValue(100)

      # Move the whole thing to the bottom of the screen
      boxBottom = paddedRelRect.top + paddedRelRect.height
      compBottom = thisPart.comp.height
      delta = compBottom - boxBottom
      refPosition = refLayer.transform("Position").value
      refLayer.transform("Position").setValue [refPosition[0], refPosition[1] + delta - PADDING]

      # Add the HCL
      group = targetPageLayer.getPaperLayerGroup()
      group.assignControlLayer choice
      group.gatherLayers(new NFLayerCollection([targetPageLayer, refLayer, bgSolid]), false)
      controlLayer = choice.getControlLayer()
      controlLayer.removeSpotlights()


    else if pickedPage
      # Position it onscreen and slide it in.
      targetPageLayer.transform('Position').setValue [525, -150]
      targetPageLayer.slideIn()


    # FIXME: Rock that citation

    @active = false
    app.endUndoGroup()

  refreshButton = buttonGroup.add('button', undefined, 'Refresh')
  refreshButton.onClick = (w) ->
    loadContentIntoView treeView
    @active = false

  # Layout + Resize handling
  panel.layout.layout(true)
  panel.layout.resize()

  panel.onResizing = panel.onResize = ->
    @layout.resize()
    return

  unless _.isUIPanel
    panel.center()
    panel.show()

  return panel

main()
