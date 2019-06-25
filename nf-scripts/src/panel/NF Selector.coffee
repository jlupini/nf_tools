`#include "runtimeLibraries.jsx"`
`#include "NFIcon.jsx"`
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
    thisPDFNode.image = NFIcon.tree.pdf

    pageCompArr = contentTree[key]
    # pdfTree = contentTree[key]
    # for pageKey of pdfTree
    for pageComp in pageCompArr
      # Collect only the shape layers
      pageLayers = pageComp.allLayers()
      shapeLayers = new NFLayerCollection
      pageLayers.forEach (layer) =>
        shapeLayers.add layer if layer.layer instanceof ShapeLayer
      pageNumber = pageComp.getPageNumber()

      if shapeLayers.isEmpty()
        thisPageNode = thisPDFNode.add 'item', "Page #{pageNumber}"
        thisPageNode.data = pageComp
        thisPageNode.image = NFIcon.tree.page
      else
        thisPageNode = thisPDFNode.add 'node', "Page #{pageNumber}"
        thisPageNode.data = pageComp
        thisPageNode.image = NFIcon.tree.page

        shapeLayers.forEach (shapeLayer) =>
          if shapeLayer instanceof NFHighlightLayer
            itemName = shapeLayer.layer.name + " (HL)"
            icon = NFIcon.tree.highlight
          else
            itemName = shapeLayer.layer.name + " (Shape)"
            icon = NFIcon.tree.star
          thisShapeItem = thisPageNode.add 'item', itemName
          thisShapeItem.data = shapeLayer
          thisShapeItem.image = icon

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

  addButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.add)
  addButton.onClick = (w) ->
    choice = treeView.selection?.data

    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "NF Selector"

    pickedHighlight = choice instanceof NFHighlightLayer
    pickedShape = choice instanceof NFLayer and not pickedHighlight
    pickedPage = choice instanceof NFPageComp

    if pickedPage
      choicePage = choice
    else
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

    # FIXME: All the positioning stuff fails if there's already a version of the
    # group that's been used for normal page tracking


    if not targetPageLayer?
      # Insert the page
      newPageLayer = thisPart.insertPage
        page: choicePage
        continuous: yes
      group = newPageLayer.getPaperLayerGroup()
      group.setConnectionToZoomer
        connected: no
      newPageLayer.transform('Scale').setValue [20,20,20]
      newPageLayer.transform('Position').setValue [1560, -150]
      targetPageLayer = newPageLayer


    if pickedHighlight or pickedShape
      # Duplicate and convert to reference layer
      refLayer = targetPageLayer.duplicateAsReferenceLayer()
      refLayer.layer.name = "#{refLayer.getName()} (#{choice.getName()})"

      # Frame up that baby
      currTime = thisPart.getTime()
      choiceRect = choice.sourceRect()
      thisPart.setTime(currTime) unless thisPart.getTime() is currTime

      # FIXME: Allow multiple selections so you can show expands too and frame they up together with a 'combineRects' function
      scaleFactor = refLayer.getScaleFactorToFrameUp
        # highlight: if pickedHighlight then choice else null
        rect: refLayer.relativeRect choiceRect
      scaleProp = refLayer.transform "Scale"
      oldScale = scaleProp.value
      newScale = oldScale[0] * scaleFactor
      scaleProp.setValue [newScale, newScale]

      positionDelta = refLayer.getPositionDeltaToFrameUp
        # highlight: if pickedHighlight then choice else null
        rect: refLayer.relativeRect choiceRect
      positionProp = refLayer.transform "Position"
      oldPosition = positionProp.value
      newPosition = [oldPosition[0] + positionDelta[0], oldPosition[1] + positionDelta[1]]
      positionProp.setValue newPosition

      # Make a mask over the text
      highlightThickness = if pickedHighlight then choice.highlighterEffect().property("Thickness").value else 0
      paddedChoiceRect =
        left: choiceRect.left
        top: choiceRect.top - (highlightThickness/2)
        width: choiceRect.width
        height: choiceRect.height + highlightThickness
      newMask = refLayer.mask().addProperty "Mask"
      newMask.maskShape.setValue NFTools.shapeFromRect(paddedChoiceRect)
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
      bgSolid.transform("Opacity").setValue 90
      bgSolid.layer.motionBlur = true
      relRect = refLayer.relativeRect paddedChoiceRect
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
      group.assignControlLayer choice if pickedHighlight
      unless newPageLayer?
        layerAbove = targetPageLayer.getPaperLayerGroup().getControlLayers().getBottommostLayer() ? targetPageLayer.getPaperLayerGroup().paperParent
        refLayer.moveAfter layerAbove
        refLayer.layer.inPoint = thisPart.getTime()
        refLayer.transform("Position").expression = ""
        refLayer.removeNFMarkers()
      bgSolid.moveAfter refLayer

      group.gatherLayers(new NFLayerCollection([targetPageLayer, refLayer, bgSolid]), false)
      if pickedHighlight
        controlLayer = choice.getControlLayer()
        controlLayer.removeSpotlights()


    else if pickedPage
      # Position it onscreen and slide it in.
      targetPageLayer.transform('Position').setValue [525, -150]
      targetPageLayer.slideIn()

      # Show the citation
      targetPageLayer.getPaperLayerGroup().getCitationLayer().show()

    @active = false
    app.endUndoGroup()

  linkButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.link)
  linkButton.onClick = (w)  ->
    choice = treeView.selection?.data

    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "NF Selector"

    pickedHighlight = choice instanceof NFHighlightLayer
    return alert "Must select a highlight layer" unless pickedHighlight

    # make sure the PDF group exists here to link to
    thisPart = NFProject.activeComp()
    return alert "This operation can only be performed in a part comp." unless thisPart instanceof NFPartComp
    group = thisPart.groupFromPDF(choice.getPDF())
    return alert "Can't find this PDF's group (##{choice.getPDFNumber()}) in this part"

    group.assignControlLayer(choice)


  goButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.play)
  goButton.onClick = (w)  ->
    choice = treeView.selection?.data

    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "NF Selector"

    pickedHighlight = choice instanceof NFHighlightLayer
    pickedShape = choice instanceof NFLayer and not pickedHighlight
    pickedPage = choice instanceof NFPageComp

    return alert "Invalid Selection\nCan't go to a shape yet. Jesse should add this at some point..." if pickedShape

    if pickedPage
      choicePage = choice
    else
      choicePage = choice.containingComp()

    # Find the dict instruction
    if pickedPage
      dictObject = NFLayoutInstructionDict.showTitle
    else if choice.getName().indexOf("Expand") >= 0
      dictObject = NFLayoutInstructionExpand
      expandLookString = choice.getName()
    else
      for key of NFLayoutInstructionDict
        option = NFLayoutInstructionDict[key]
        if option.look? and option.look is choice.getName()
          dictObject = option
    return alert "Create a valid instruction from the selection" unless dictObject?

    instruction = new NFLayoutInstruction
      pdf: choicePage.getPDFNumber()
      instruction: dictObject
      expandLookString: expandLookString ? null
    result = NFProject.layoutSingleInstruction instruction

  refreshButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.refresh)
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
