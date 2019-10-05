$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"
$.evalFile File($.fileName).path + "/NFIcon.jsx"
_ = {}
EDGE_PADDING = 80
BOTTOM_PADDING = 150

panelTest = this

openScript = (targetScript) ->
  start_folder = new Folder(new File($.fileName).parent.fsName)
  scriptFile = new File(start_folder.fsName + "/#{targetScript}")
  $.evalFile scriptFile.fullName

importPDFAnnotationData = ->
  NFPDFManager.importAnnotationData()

loadAutoHighlightDataIntoView = (treeView) ->
  treeView.removeAll()

  contentTree = {}


  activeComp = NFProject.activeComp()
  annotationData = NFPDFManager.getAnnotationDataForPageComp activeComp
  return alert "No PDF Annotation Data Found\nTry the Import button below first" unless annotationData?
  for annotation in annotationData

    thisNode = treeView.add 'item', annotation.cleanName
    thisNode.data = annotation
    if annotation.expand?
      thisNode.image = NFIcon.tree.expand
    else if annotation.cleanName.indexOf("Highlight") > -1
      thisNode.image = NFIcon.tree.highlight
    else
      thisNode.image = NFIcon.tree.star


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
    thisPDFNode.data = NFPDF.fromPDFNumber key

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

  # Tabs
  tPanel = panel.add ("tabbedpanel")
  tPanel.alignment = ['fill','fill']
  tPanel.alignChildren = ["fill", "fill"]

  # Prep Tab
  prepTab = tPanel.add("tab", undefined, "Highlight Importer")
  prepTab.alignment = ['fill','fill']
  prepTab.alignChildren = "fill"

  buttonPrepPanel = prepTab.add 'panel', undefined, undefined, {borderStyle:'none'}
  buttonPrepPanel.alignment = ['fill','fill']
  buttonPrepPanel.alignChildren = 'left'
  buttonPrepPanel.margins.top = 16

  treePrepView = buttonPrepPanel.add 'treeview', undefined #[0, 0, 250, 150]
  treePrepView.preferredSize = [220, 250]
  treePrepView.alignment = ['fill','fill']

  buttonPrepGroup = buttonPrepPanel.add 'group', undefined
  buttonPrepGroup.maximumSize = [200,50]

  addPrepButton = buttonPrepGroup.add('iconbutton', undefined, NFIcon.button.add)
  addPrepButton.onClick = (w) ->
    choice = treePrepView.selection?.data

    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "NF Selector"

    targetComp = NFProject.activeComp()

    # Actually add the shapes and stuff
    annotationLayer = targetComp.addShapeLayer()
    annotationLayer.addRectangle
      fillColor: choice.color
      rect: choice.rect

    annotationLayer.transform().scale.setValue targetComp?.getPDFLayer().transform().scale.value

    if choice.lineCount is 0
      annotationLayer.transform("Opacity").setValue 20
      annotationLayer.setName "Imported PDF Shape: #{choice.cleanName}"
    else
      for key, testColor of NFHighlightLayer.COLOR
        newColor = testColor if choice.colorName.indexOf(testColor.str) >= 0

      # Create the highlight effect
      targetComp.createHighlight
        shapeLayer: annotationLayer
        lines: choice.lineCount
        name: choice.cleanName
        color: newColor

      annotationLayer.remove()

    app.endUndoGroup()

  customPrepButton = buttonPrepGroup.add('iconbutton', undefined, NFIcon.button.path)
  customPrepButton.onClick = (w) ->
    selectedLayer = NFProject.selectedLayers()?.get(0)
    return alert "No Valid Shape Layer Selected" unless selectedLayer? and selectedLayer instanceof NFShapeLayer
    lineCount = parseInt prompt('How many initial highlight lines would you like to create?')
    # Create the highlight effect
    newName = selectedLayer.getName().replace("Imported PDF Shape: ", "")
    for key, testColor of NFHighlightLayer.COLOR
      newColor = testColor if newName.indexOf(testColor.str) >= 0
    selectedLayer.containingComp().createHighlight
      shapeLayer: selectedLayer
      lines: lineCount
      name: newName
      color: newColor ? NFHighlightLayer.COLOR.YELLOW


    selectedLayer.remove()

  refreshPrepButton = buttonPrepGroup.add('iconbutton', undefined, NFIcon.button.refresh)
  refreshPrepButton.onClick = (w) ->
    loadAutoHighlightDataIntoView treePrepView

    @active = false

  importPrepButton = buttonPrepGroup.add('iconbutton', undefined, NFIcon.button.import)
  importPrepButton.onClick = (w) ->
    alert "Importing Auto Highlight Data\nThis can take a little while, so be patient."
    result = importPDFAnnotationData()
    if result
      alert "Success\nNow hit the refresh button with a PDF Comp active."
    else
      alert "Failed\nLook for annotationData.json file in the PDF Pages directory"
    @active = false


  # Animate Tab
  animateTab = tPanel.add("tab", undefined, "Animator")
  animateTab.alignChildren = "fill"
  animateTab.alignment = ['fill','fill']

  buttonPanel = animateTab.add 'panel', undefined, undefined, {borderStyle:'none'}
  buttonPanel.alignment = ['fill','fill']
  buttonPanel.alignChildren = 'left'
  buttonPanel.margins.top = 16

  treeView = buttonPanel.add 'treeview', undefined #[0, 0, 250, 150]
  treeView.preferredSize = [220, 250]
  treeView.alignment = ['fill','fill']


  buttonGroup = buttonPanel.add 'group', undefined
  buttonGroup.maximumSize = [300,50]

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
    else if pickedShape or pickedHighlight
      choicePage = choice.containingComp()
    else throw new Error "Looks like you picked something, but we can't figure out what it is. Hit the refresh button and try again"

    # First, bring in a continuous version of the page.
    thisPart = NFProject.activeComp()
    throw new Error "This operation can only be performed in a part comp." unless thisPart instanceof NFPartComp

    currTime = thisPart.getTime()

    # FIXME: Don't insert a new page if there's already a perfectly good one there ya dummy

    # Check if this page already exists or not.
    layersForPage = thisPart.layersForPage choicePage

    targetPageLayer = null
    startTime = null
    unless layersForPage.isEmpty()
      layersForPage.forEach (layer) =>
        startTime = layer.layer.startTime
        targetPageLayer = layer if layer.isActive()

    # FIXME: All the positioning stuff fails if there's already a version of the
    # group that's been used for old-style page tracking

    # Check for expand animation
    shouldExpand = no
    bgSolid = null
    if targetPageLayer? and pickedHighlight and choice.getName().indexOf("Expand") >= 0
      # First, make sure we actually wanna do this. Is there an active ref that this expands the highlight of?
      refLayers = thisPart.searchLayers("[ref]")
      unless refLayers.isEmpty()
        activeRefs = new NFLayerCollection()
        refLayers.forEach (ref) =>
          if ref.isActive()
            if ref.getName().indexOf("Backing") < 0
              activeRefs.add ref
            else
              bgSolid = ref
        if activeRefs.count() > 1
          return alert "Error\nCan't animate an expand if multiple matching refs are active"
        else if activeRefs.count() is 1
          refLayer = activeRefs.get(0)
          refTargetName = refLayer.getName().match(/\<(.*?)\>/)[1]
          if choice.getName().indexOf(refTargetName) >= 0
            shouldExpand = yes
            keyIn = currTime - 0.5
            keyOut = currTime + 0.5


    if not targetPageLayer?
      # Insert the page
      newPageLayer = thisPart.insertPage
        page: choicePage
        continuous: yes
      if startTime?
        newPageLayer.layer.startTime = startTime
        newPageLayer.layer.inPoint = currTime
      group = newPageLayer.getPaperLayerGroup()
      newPageLayer.transform('Scale').setValue [23,23,23]
      newPageLayer.transform('Position').setValue [1560, -150]
      newPageLayer.effect('Drop Shadow').enabled = no if newPageLayer.effect('Drop Shadow')?
      targetPageLayer = newPageLayer


    if pickedHighlight or pickedShape

      unless shouldExpand
        # Duplicate and convert to reference layer
        refLayer = targetPageLayer.duplicateAsReferenceLayer()

        baseName = "#{refLayer.getName()} <#{choice.getName()}>"

        # Unique naming
        layersWithName = refLayer.containingComp().searchLayers baseName, yes, "Backing"
        alphabet = 'abcdefghijklmnopqrstuvwxyz'.split ''
        refLayer.layer.name = "#{baseName} {#{alphabet[layersWithName.count()]}}"

        positionProp = refLayer.transform("Position")
        scaleProp = refLayer.transform("Scale")

        positionProp.expression = "" unless newPageLayer?
        if positionProp.numKeys > 0
          for idx in [positionProp.numKeys..1]
            positionProp.removeKey idx
        if scaleProp.numKeys > 0
          for idx in [scaleProp.numKeys..1]
            scaleProp.removeKey idx

      # Frame up that baby
      choiceRect = choice.sourceRect()
      if shouldExpand
        activeRefComp = new NFPageComp refLayer.layer.source
        activeHighlight = activeRefComp.layerWithName refTargetName
        activeHighlightRect = activeHighlight.sourceRect()
        choiceRect = choiceRect.combineWith activeHighlightRect
      thisPart.setTime(currTime) unless thisPart.getTime() is currTime

      scaleProp = refLayer.transform("Scale")
      newScale = refLayer.getAbsoluteScaleToFrameUp
        rect: refLayer.relativeRect choiceRect
        fillPercentage: 75
        maxScale: 100

      if shouldExpand
        scaleProp.setValuesAtTimes [keyIn, keyOut], [scaleProp.valueAtTime(currTime, yes), [newScale, newScale]]
        scaleProp.easyEaseKeyTimes
          keyTimes: [keyIn, keyOut]
      else
        scaleProp.setValue [newScale, newScale]

      positionProp = refLayer.transform("Position")
      newPosition = refLayer.getAbsolutePositionToFrameUp
        rect: refLayer.relativeRect choiceRect
        preventFalloff: no

      if shouldExpand
        positionProp.setValuesAtTimes [keyIn, keyOut], [positionProp.valueAtTime(currTime, yes), newPosition]
        positionProp.easyEaseKeyTimes
          keyTimes: [keyIn, keyOut]
      else
        positionProp.setValue newPosition


      # Make a mask over the text
      highlightThickness = if pickedHighlight then choice.highlighterEffect().property("Thickness").value else 0
      paddedChoiceRect =
        left: choiceRect.left
        top: choiceRect.top - (highlightThickness/2)
        width: choiceRect.width
        height: choiceRect.height + highlightThickness
      if shouldExpand
        mask = refLayer.mask().property(1)
        mask.maskShape.setValuesAtTimes [keyIn, keyOut], [mask.maskShape.valueAtTime(currTime, yes), NFTools.shapeFromRect(paddedChoiceRect)]
        mask.maskShape.easyEaseKeyTimes
          keyTimes: [keyIn, keyOut]
      else
        newMask = refLayer.mask().addProperty "Mask"
        newMask.maskShape.setValue NFTools.shapeFromRect(paddedChoiceRect)
        newMask.maskFeather.setValue [20,20]
        newMask.maskExpansion.setValue 3
        refLayer.effect("Drop Shadow").remove()
        refLayer.effects().addProperty("ADBE Brightness & Contrast 2").property("Contrast").setValue(99)
        refLayer.layer.blendingMode = BlendingMode.DARKEN

      # Create a white BG box and attach it to the ref layer
      unless shouldExpand
        bgSolid = thisPart.addSolid
          color: [1,1,1]
          name: "Backing for '#{refLayer.layer.name}'"
        bgSolid.transform("Opacity").setValue 90
        bgSolid.layer.motionBlur = true
        bgSolid.setShy yes

        newMask = bgSolid.mask().addProperty "Mask"
        newMask.maskShape.expression = NFTools.readExpression "backing-mask-expression",
          TARGET_LAYER_NAME: refLayer.getName()
          EDGE_PADDING: EDGE_PADDING
        #newMask.maskExpansion.setValue 24
        bgSolid.transform("Opacity").expression = NFTools.readExpression "backing-opacity-expression",
          TARGET_LAYER_NAME: refLayer.getName()
        shadowProp = bgSolid.addDropShadow()

      # Move the whole thing to the bottom of the screen
      if shouldExpand
        anchorValues = refLayer.getCenterAnchorPointValue(yes, keyOut)
        anchorProp = refLayer.transform "Anchor Point"
        anchorProp.setValuesAtTimes [keyIn, keyOut], [anchorProp.valueAtTime(keyIn, yes), anchorValues[1]]
        anchorProp.easyEaseKeyTimes
          keyTimes: [keyIn, keyOut]
        relRect = refLayer.relativeRect paddedChoiceRect, keyOut
      else
        relRect = refLayer.relativeRect paddedChoiceRect
      boxBottom = relRect.top + relRect.height + (EDGE_PADDING / 4)
      compBottom = thisPart.comp.height
      delta = compBottom - boxBottom

      if shouldExpand
        refPosition = positionProp.valueAtTime keyOut, yes
        positionProp.setValuesAtTimes [keyIn, keyOut], [positionProp.valueAtTime(keyIn, yes), [refPosition[0], refPosition[1] + delta - BOTTOM_PADDING]]
        positionProp.easyEaseKeyTimes
          keyTimes: [keyIn, keyOut]
      else
        refPosition = positionProp.value
        positionProp.setValue [refPosition[0], refPosition[1] + delta - BOTTOM_PADDING]

      # Add the HCL
      group = targetPageLayer.getPaperLayerGroup()
      return alert "No group and null found for the target page layer (#{targetPageLayer.getName()}). Try deleting it and adding again before running." unless group?
      group.assignControlLayer(choice, null, no) if pickedHighlight
      unless newPageLayer?
        layerAbove = targetPageLayer.getPaperLayerGroup().getControlLayers().getBottommostLayer() ? targetPageLayer.getPaperLayerGroup().paperParent
        refLayer.moveAfter layerAbove
        unless shouldExpand
          refLayer.layer.inPoint = thisPart.getTime()

      # Animate In
      unless shouldExpand
        refLayer.centerAnchorPoint()
        refLayer.removeNFMarkers()
        refLayer.addInOutMarkersForProperty
          property: refLayer.transform "Scale"
          startEquation: EasingEquation.quart.out
          startValue: [0, 0, 0]
          length: 1
        refLayer.addInOutMarkersForProperty
          property: refLayer.transform "Opacity"
          startEquation: EasingEquation.quart.out
          startValue: 0
          length: 1

        bgSolid.moveAfter refLayer

      group.gatherLayers(new NFLayerCollection([targetPageLayer, refLayer, bgSolid]), false)
      if pickedHighlight
        controlLayer = choice.getControlLayer()
        controlLayer.removeSpotlights()


    else if pickedPage
      # Position it onscreen and slide it in.
      targetPageLayer.transform('Position').setValue [439, 202]
      targetPageLayer.slideIn()

      # Show the citation
      targetPageLayer.getPaperLayerGroup().getCitationLayer().show()

      # Move the target layer below the greenscreen
      gsLayer = thisPart.greenscreenLayer()
      targetPageLayer.moveAfter gsLayer if gsLayer?

    @active = false
    app.endUndoGroup()

  linkButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.link)
  linkButton.onClick = (w) ->
    choice = treeView.selection?.data

    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "NF Selector"

    pickedHighlight = choice instanceof NFHighlightLayer
    return alert "Must select a highlight layer" unless pickedHighlight

    # make sure the PDF group exists here to link to
    thisPart = NFProject.activeComp()
    return alert "This operation can only be performed in a part comp." unless thisPart instanceof NFPartComp
    group = thisPart.groupFromPDF(choice.getPDF())
    return alert "Can't find this PDF's group (##{choice.getPDFNumber()}) in this part"  unless group?

    group.assignControlLayer(choice, null, no)

    controlLayer = choice.getControlLayer()
    controlLayer.removeSpotlights()


  goButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.play)
  goButton.onClick = (w) ->
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

  hideButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.hide)
  hideButton.onClick = (w) ->
    app.beginUndoGroup "Hide Element (via NF Selector)"

    partComp = NFProject.activeComp()
    return alert "Can only do this in a part comp" unless partComp instanceof NFPartComp
    time = partComp.getTime()

    # Get selected layer
    selectedLayers = NFProject.selectedLayers()
    if selectedLayers.count() isnt 1
      return alert "Wrong number of selected layers. Please select a single layer and run again"
    else
      selectedLayer = selectedLayers.get(0)

      # Switch the selected layer to the relevant parent if we've clicked the control layer
      if selectedLayer instanceof NFHighlightControlLayer
        group = new NFPaperLayerGroup selectedLayer.getParent()
        refLayers = group.getChildren().searchLayers("[ref]").searchLayers(selectedLayer.highlightName())
        if refLayers.count() isnt 1
          return alert "I couldn't find the layers to trim. Try selecting only the ref layer and trying again"
        selectedLayer = refLayers.get(0)

      if selectedLayer instanceof NFPageLayer
        # If the layer is a visible, initted page layer, and is active at the moment
        if selectedLayer.getName().indexOf("[+]") >= 0 and partComp.getRect().intersectsWith(selectedLayer.sourceRect(time))
          if selectedLayer.layer.outPoint >= time
            selectedLayer.layer.outPoint = time
            selectedLayer.slideOut()
        else if selectedLayer.getName().indexOf("[ref]") >= 0
          # Let's get all the layers that are children of this layer and end them here too
          layersToTrim = selectedLayer.getChildren().add selectedLayer

          # Find and add the control layer
          highlightName = selectedLayer.getName().match(/\<(.*?)\>/)[1]
          pdfNumber = selectedLayer.getPDFNumber()
          controlLayers = partComp.searchLayers NFHighlightControlLayer.nameForPDFNumberAndHighlight pdfNumber, highlightName
          unless controlLayers.count() is 0
            controlLayers.forEach (cLayer) =>
              layersToTrim.add cLayer

          # Find and add any offscreen page layers
          matchingPageLayers = partComp.layersForPage(selectedLayer.getPageComp())
          unless matchingPageLayers.count() is 0
            matchingPageLayers.forEach (pLayer) =>
              # Add these layers if they aren't inside the visible area
              layersToTrim.add pLayer unless partComp.getRect().intersectsWith(pLayer.sourceRect(time))

          layersToTrim.forEach (layer) =>
            layer.layer.outPoint = time

          selectedLayer.addInOutMarkersForProperty
            property: selectedLayer.transform "Scale"
            endEquation: EasingEquation.quart.in
            endValue: [0, 0, 0]
            length: 1
          selectedLayer.addInOutMarkersForProperty
            property: selectedLayer.transform "Opacity"
            endEquation: EasingEquation.quart.in
            endValue: 0
            length: 1

        else throw new Error "Something's wrong with this layer's name..."


    app.endUndoGroup()

  citeButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.book)
  citeButton.onClick = (w) ->
    choice = treeView.selection?.data
    return alert "Invalid Selection!" unless choice?
    app.beginUndoGroup "Add Citation (via NF Selector)"

    if choice instanceof NFPDF
      thisPart = NFProject.activeComp()

      # If the PDF already has a paperParentLayer in this comp
      parentLayer = thisPart.layerWithName(choice.getName())
      if parentLayer?
        group = parentLayer.getGroup()
      else
        nullLayer = thisPart.addSolid
          color: [1,0,0.7]
          width: 10
          height: 10
        nullLayer.layer.enabled = no

        nullLayer.setName NFPaperParentLayer.getPaperParentNameForObject(choice)
        paperParentLayer = new NFPaperParentLayer(nullLayer)
        group = new NFPaperLayerGroup paperParentLayer

      citationLayer = group.assignCitationLayer()
      citationLayer.show()


    else alert "Error\nMake sure you've selected a PDF to cite, or try
                refreshing the Selector Panel"

    app.endUndoGroup()


  refreshButton = buttonGroup.add('iconbutton', undefined, NFIcon.button.refresh)
  refreshButton.onClick = (w) ->
    loadContentIntoView treeView
    treeView.notify()
    @active = false

  visGroup = buttonPanel.add 'group', undefined
  visGroup.maximumSize = [300,50]

  circle = visGroup.add('iconbutton', undefined, NFIcon.button.circle)
  circle.onClick = (w) ->
    app.beginUndoGroup "Unshy all (NF Selector)"

    NFProject.activeComp().allLayers().forEach (layer) =>
      layer.setShy no unless layer.getName().indexOf("Backing for") >= 0

    NFProject.activeComp().comp.hideShyLayers = yes

    app.endUndoGroup()

  looseFocus = visGroup.add('iconbutton', undefined, NFIcon.button.looseFocus)
  looseFocus.onClick = (w) ->
    app.beginUndoGroup "Loose Focus (NF Selector)"

    activeComp = NFProject.activeComp()
    activeLayers = activeComp.activeLayers()
    return alert "No layers active!" if activeLayers.isEmpty()

    looseLayers = new NFLayerCollection
    activeLayers.forEach (layer) =>
      looseLayers.add layer unless layer instanceof NFCitationLayer or layer.getName().indexOf("Backing for") >= 0
      looseLayers.add layer.getChildren(yes) unless layer.is activeComp.greenscreenLayer()

      # Add members in PDF group if we can find one
      if layer instanceof NFPageLayer
        group = layer.getPaperLayerGroup()
        looseLayers.add group.getMembers()
        looseLayers.add group.paperParent

    activeComp.allLayers().forEach (layer) =>
      layer.setShy not looseLayers.containsLayer(layer)

    activeComp.comp.hideShyLayers = yes

    app.endUndoGroup()

  tightFocus = visGroup.add('iconbutton', undefined, NFIcon.button.tightFocus)
  tightFocus.onClick = (w) ->
    app.beginUndoGroup "Tight Focus (NF Selector)"

    activeComp = NFProject.activeComp()
    activeLayers = activeComp.activeLayers()
    return alert "No layers active!" if activeLayers.isEmpty()

    tightLayers = new NFLayerCollection
    activeLayers.forEach (layer) =>
      tightLayers.add layer unless layer instanceof NFCitationLayer or layer.getName().indexOf("Backing for") >= 0
      if layer instanceof NFPageLayer
        group = layer.getPaperLayerGroup()
        tightLayers.add group.paperParent
        tightLayers.add group.getCitationLayer()

        time = activeComp.getTime()
        group.getControlLayers().forEach (control) =>
          tightLayers.add control if control.layer.inPoint <= time and control.layer.outPoint >= time

    activeComp.allLayers().forEach (layer) =>
      layer.setShy not tightLayers.containsLayer(layer)

    activeComp.comp.hideShyLayers = yes

    app.endUndoGroup()


  # Layout + Resize handling
  panel.layout.layout(true)
  panel.layout.resize()
  tPanel.selection = animateTab

  panel.onResizing = panel.onResize = ->
    @layout.resize()
    return

  unless _.isUIPanel
    panel.center()
    panel.show()

  return panel

main()
