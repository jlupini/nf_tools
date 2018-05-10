`#include "lib/extendscript.prototypes.js"`
NF = app.NF ? {}

# enums
NF.Util.PageTurn =
  FLIPPEDUP: 100
  FLIPPEDDOWN: 200
  TURNING: 300
  NOPAGETURN: 400
  BROKEN: 500

NF.Util.AnimationType =
  SLIDE: 100
  FADE: 200

NF.Util.Position =
  TOP: 100
  RIGHT: 200
  BOTTOM: 300
  LEFT: 400

NF.Util.Direction =
  IN: 100
  OUT: 200

NF.Util.EaseFunction =
  LINEAR: 100
  PAGESLIDEEASE: 150
  # EASEINSINE: 200
  # EASEOUTSINE: 250
  # EASEINOUTSINE: 275
  # EASEINQUAD: 300
  # EASEOUTQUAD: 350
  # EASEINOUTQUAD: 375
  # EASEINQUINT: 400
  # EASEOUTQUINT: 250
  # EASEINOUTQUINT: 275


# Utility Functions

# Looks for an item globally in the project
NF.Util.findItem = (itemName) ->
  i = 1
  while i <= app.project.items.length
    thisItem = app.project.items[i]
    if thisItem.name == itemName
      return thisItem
    i++
  null

# Returns true if a given AVLayer is a highlight layer
NF.Util.isHighlightLayer = (theLayer) ->
  return theLayer instanceof ShapeLayer and theLayer.Effects.property(1)?.matchName is "AV_Highlighter"

# Given a string with the name of an item to find and it's parent folder, findItemIn returns the folderItem, or null of none is found.
NF.Util.findItemIn = (itemName, sourceFolderItem) ->
  i = 1
  while i <= sourceFolderItem.numItems
    if sourceFolderItem.item(i).name == itemName
      return sourceFolderItem.item(i)
    i++
  null

# Animates a page in or out with specified params
NF.Util.animatePage = (model) ->

  # FIXME: Move all this ew stuff to a generalized thing
  ew_getPathToEasingFolder = ->
    folderObj = new Folder(new File($.fileName).parent.fsName + '/lib/' + "easingExpressions")
    folderObj

  ew_readFile = (filename) ->
    the_code = undefined
    easing_folder = ew_getPathToEasingFolder()
    file_handle = new File(easing_folder.fsName + '/' + filename)
    if !file_handle.exists
      throw new Error('I can\'t find this file: \'' + filename + '\'. \n\nI looked in here: \'' + easing_folder.fsName + '\'. \n\nPlease refer to the installation guide and try installing again, or go to:\n\nhttp://aescripts.com/ease-and-wizz/\n\nfor more info.')
    try
      file_handle.open 'r'
      the_code = file_handle.read()
    catch e
      throw new Error('I couldn\'t read the easing equation file: ' + e)
    finally
      file_handle.close()
    the_code

  ew_setProps = (selectedProperties, expressionCode) ->
    # selectedProperties = app.project.activeItem.selectedProperties
    numOfChangedProperties = 0
    currentProperty = undefined
    i = undefined
    # retain the whitespace
    expressionCode = expressionCode.replace(/\n\n/g, '\n \n')
    i = 0
    while i < selectedProperties.length
      currentProperty = selectedProperties[i]
      if currentProperty.numKeys >= 2 and currentProperty.canSetExpression
        # don't do anything if we can't set an expression
        # likewise if there aren't at least two keyframes
        currentProperty.expression = expressionCode
        numOfChangedProperties += 1
      i += 1
    # easingType = ease_and_wizz.easingList.selection.text
    # clearOutput()
    # if numOfChangedProperties == 1
    #   writeLn 'Applied "' + easingType + '" to 1 property.'
    # else
    #   writeLn 'Applied "' + easingType + '" to ' + numOfChangedProperties + ' properties.'
    return

  return null unless model.page?
  model =
    page: model.page
    type: model.type ? NF.Util.AnimationType.SLIDE
    position: model.position ? NF.Util.Position.RIGHT
    direction: model.direction ? NF.Util.Direction.IN
    duration: model.duration ? 1
    easeFunction: model.easeFunction ? NF.Util.EaseFunction.LINEAR
    shadowBuffer: model.shadowBuffer ? 350

  if model.direction is NF.Util.Direction.IN
    duration = model.duration
    inPoint = model.page.inPoint
    outPoint = model.page.outPoint
  else
    # NOTE: IN and OUT points are REVERSED in this case. Be careful.
    duration = model.duration * -1
    inPoint = model.page.outPoint
    outPoint = model.page.inPoint

  if model.type is NF.Util.AnimationType.SLIDE

    positionProperty = model.page.transform.position
    oldPosition = positionProperty.value

    rect = NF.Util.sourceRectToComp(model.page, inPoint)
    mainComp = app.project.activeItem

    rect =
      top: rect.top
      left: rect.left
      right: rect.left + rect.width
      bottom: rect.top + rect.height
      width: rect.width
      height: rect.height

    if model.position is NF.Util.Position.RIGHT
      # How far to the right do we need to move the page to get it off that side?
      # To do that, rect.left >= to mainComp.width
      diffX = mainComp.width - rect.left + model.shadowBuffer
      diffY = 0
    else if model.position is NF.Util.Position.LEFT
      # need to make rect.right <= 0
      diffX = 0 - rect.right - model.shadowBuffer
      diffY = 0
    else if model.position is NF.Util.Position.TOP
      # need to make rect.bottom <= 0
      diffY = 0 - rect.bottom - model.shadowBuffer
      diffX = 0
    else
      # BOTTOM, so need to make rect.top >= mainComp.height
      diffY = mainComp.height - rect.top + model.shadowBuffer
      diffX = 0

    newPosition = [oldPosition[0] + diffX, oldPosition[1] + diffY, oldPosition[2]]
    positionProperty.setValuesAtTimes [inPoint, inPoint + model.duration], [newPosition, oldPosition]

    inKeyIdx = positionProperty.nearestKeyIndex inPoint
    outKeyIdx = positionProperty.nearestKeyIndex outPoint

    # Easing
    unless model.easeFunction is NF.Util.EaseFunction.LINEAR
      # FIXME: Add all the other eases and make this one right.... maybe gotta do spatial?
      if model.easeFunction is NF.Util.EaseFunction.PAGESLIDEEASE
        # easeIn1 = new KeyframeEase(0, 50)
        # easeOut1 = new KeyframeEase(0.75, 85)
        # easeIn2 = new KeyframeEase(0, 100)
        # easeOut2 = new KeyframeEase(0, 0.1)
        # positionProperty.setTemporalEaseAtKey inKeyIdx, [easeIn1], [easeOut1]
        # positionProperty.setTemporalEaseAtKey outKeyIdx, [easeIn2], [easeOut2]

        easingEquation = ew_readFile("quint-out-easeandwizz-start-only.txt")
        ew_setProps [positionProperty], easingEquation

  else if model.type is NF.Util.AnimationType.FADE
    # FIXME: Handle this case
    return null

NF.Util.pageTreeForPaper = (sourceLayer) ->

  @layerObj = (layerName) ->
    ->
      app.project.activeItem.layers.byName layerName

  pageParent = NF.Util.pageParent sourceLayer
  allLayers = app.project.activeItem.layers
  tree =
    name: pageParent.name
    index: pageParent.index
    layer: @layerObj pageParent.name
    pages: []

  i = 1
  while i <= allLayers.length
    testLayer = allLayers[i]
    if testLayer.parent is pageParent and NF.Util.isCompLayer testLayer
      pageObject =
        name: testLayer.name
        index: testLayer.index
        layer: @layerObj testLayer.name
        active: false
        highlights: NF.Util.sourceRectsForHighlightsInTargetLayer testLayer, NF.Util.isTitlePage(testLayer)
      tree.pages.push pageObject
    i++

  activePageIndex = NF.Util.activePageIndexInArray tree.pages
  if activePageIndex?
    tree.pages[activePageIndex].active = true
    tree.activePage = tree.pages[activePageIndex].layer()
  tree

NF.Util.isTitlePage = (testLayer) ->
  # FIXME: This is a little hacky
  tests = ['pg01', 'pg1', 'page1', 'page01']
  isTitlePage = false
  for test in tests
    isTitlePage = true if testLayer.name.indexOf(test) isnt -1
  isTitlePage

NF.Util.activePageIndexInArray = (pages) ->
  activePage = null
  activePageIndex = null
  i = 0
  while i < pages.length
    page = pages[i]
    pageLayer = page.layer()
    if pageLayer.active and (NF.Util.pageTurnStatus(pageLayer) is NF.Util.PageTurn.FLIPPEDDOWN or NF.Util.pageTurnStatus(pageLayer) is NF.Util.PageTurn.NOPAGETURN)
      if not activePage? or page.index < activePage.index
        activePage = page
        activePageIndex = i
    i++

  return activePageIndex

NF.Util.pageLayerCanBeActive = (pageLayer) ->
  return pageLayer.active and (NF.Util.pageTurnStatus(pageLayer) is NF.Util.PageTurn.FLIPPEDDOWN or NF.Util.pageTurnStatus(pageLayer) is NF.Util.PageTurn.NOPAGETURN)

###
Turn a page, with a duration in seconds, starting at a given time, optionally flipping down to reveal instead of flippingUp
Current state of the page's fold will override a given flipUp value if there is already a pageTurn Effect
###
NF.Util.turnPageAtTime = (page, duration = 1.5, time = null, flipUp = true) ->
  if not NF.Util.isCompLayer page
    return alert "Cannot turn page on a non-comp layer"

  startTime = time ? app.project.activeItem.time
  endTime = startTime + duration
  startStatus = NF.Util.pageTurnStatus page, startTime
  endStatus = NF.Util.pageTurnStatus page, endTime

  # Check if already turning
  if startStatus is NF.Util.PageTurn.TURNING or endStatus is NF.Util.PageTurn.TURNING
    return alert "Page is already turning at specified time"
  if startStatus is NF.Util.PageTurn.BROKEN
    return alert "Page Turn keyframes seem broken..."

  # Check if no effect set up already
  if startStatus is NF.Util.PageTurn.NOPAGETURN
    NF.Util.addPageTurnEffects page

  # Set the Properties
  pageSize =
    width: page.source.width
    height: page.source.height
  downPosition = [pageSize.width, pageSize.height]
  upPosition = [-pageSize.width, -pageSize.height]
  positions = [downPosition, upPosition]

  if startStatus is NF.Util.PageTurn.FLIPPEDUP
    flipUp = false
  else if startStatus is NF.Util.PageTurn.FLIPPEDDOWN
    flipUp = true

  positions.reverse() if not flipUp

  times = [startTime, endTime]

  foldPosition = page.effect("CC Page Turn").property("Fold Position")
  foldPosition.setValuesAtTimes times, positions

  NF.Util.setSymmetricalTemporalEasingOnlyForProperties foldPosition, times, null, null, true

# Adds the effects for a pageturn to a layer annd sets some defaults
NF.Util.addPageTurnEffects = (page) ->
  forceMotionBlurMatchName = "CC Force Motion Blur"
  dropShadowMatchName = "ADBE Drop Shadow"
  pageTurnMatchName = "CC Page Turn"

  pageTurnEffect = page.effect(pageTurnMatchName)
  if not pageTurnEffect?
    pageTurnEffect = page.Effects.addProperty pageTurnMatchName
    pageTurnEffect.property("Fold Radius").setValue 500

  forceMotionBlurEffect = page.effect(forceMotionBlurMatchName)
  if not forceMotionBlurEffect?
    forceMotionBlurEffect = page.Effects.addProperty forceMotionBlurMatchName
    forceMotionBlurEffect.property("Override Shutter Angle").setValue 0

  dropShadowEffect = page.effect(dropShadowMatchName)
  dropShadowEffect.remove() if dropShadowEffect?
  dropShadowEffect = page.Effects.addProperty dropShadowMatchName
  dropShadowEffect.property("Opacity").setValue 0.75 * 255
  dropShadowEffect.property("Direction").setValue 125
  dropShadowEffect.property("Distance").setValue 20
  dropShadowEffect.property("Softness").setValue 300

  page

###
Given a layer, returns the NF.Util.PageTurn enum
###
NF.Util.pageTurnStatus = (pageLayer, time = null) ->
  time = time ? app.project.activeItem.time
  pageTurnEffect = pageLayer.effect("CC Page Turn")
  foldPositionProperty = pageTurnEffect?.property("Fold Position")
  foldPosition = foldPositionProperty?.value
  threshold = 3840
  if not pageTurnEffect?
    return NF.Util.PageTurn.NOPAGETURN
  else if foldPosition[0] >= threshold
    return NF.Util.PageTurn.FLIPPEDDOWN
  else if foldPosition[0] <= threshold * -1
    return NF.Util.PageTurn.FLIPPEDUP
  else if foldPositionProperty.numKeys isnt 0
    # FIXME: There may be more things that could mean this is broken
    return NF.Util.PageTurn.TURNING
  else
    return NF.Util.PageTurn.BROKEN

# Returns true if given layer is a comp
NF.Util.isCompLayer = (testLayer) ->
  return testLayer instanceof AVLayer and testLayer.source instanceof CompItem

NF.Util.pageParent = (selectedLayer) ->
  return selectedLayer if selectedLayer.nullLayer
  return selectedLayer.parent if selectedLayer.parent?.nullLayer
  return null

# Disconnects ALL highlight controls in a given layer or array of highlight layers
NF.Util.disconnectBubbleupsInLayers = (layers, names = null) ->
  if not BE.isArray layers
    layers = [layers]

  bubbleupLayers = []
  for theLayer in layers
    if NF.Util.isCompLayer theLayer
        bubbleupLayers = bubbleupLayers.concat NF.Util.collectionToArray theLayer.source.layers
    else
      bubbleupLayers.push theLayer

  for theLayer in bubbleupLayers
    if not names? or names.indexOf(theLayer.name) > -1
      effect = theLayer.effect("AV_Highlighter")
      propertyCount = effect?.numProperties
      i = 1
      while i < propertyCount and effect?
        property = effect.property i
        property.expression = ""
        i++

  layers

# Adds Temporal easing (and removes spatial easing) for an array of properties, an array of key indexes, as well as an ease type and weight.
# Keys can be delivered as indexes or times. If
NF.Util.setSymmetricalTemporalEasingOnlyForProperties = (theProperties, keys, easeType = null, easeWeight = null, keysAsTimes = false) ->
  if theProperties instanceof Array and keys instanceof Array
    return -1 if theProperties.length isnt keys.length

  singleKey = null
  singleProperty = null
  if theProperties instanceof Array and keys not instanceof Array
    singleKey = keys
  if keys instanceof Array and theProperties not instanceof Array
    singleProperty = theProperties

  if not easeType?
    easeType = NF.Util.easeType ? KeyframeInterpolationType.BEZIER
  if not easeWeight?
    easeWeight = NF.Util.easeWeight ? 33

  i = 0
  length = if singleProperty? then keys.length else theProperties.length
  while i < length
    theProperty = if singleProperty? then singleProperty else theProperties[i]
    keyItem = if singleKey? then singleKey else keys[i]
    key = if keysAsTimes then theProperty.nearestKeyIndex keyItem else keyItem
    theProperty.setInterpolationTypeAtKey key, easeType, easeType
    ease = new KeyframeEase 0, easeWeight

    temporalEaseArray = [ease]
    if theProperty.propertyValueType is PropertyValueType.TwoD
      temporalEaseArray = [ease, ease]
    else if theProperty.propertyValueType is PropertyValueType.ThreeD
      temporalEaseArray = [ease, ease, ease]

    theProperty.setTemporalEaseAtKey key, temporalEaseArray

    spatialEaseArray = null
    if theProperty.propertyValueType is PropertyValueType.TwoD_SPATIAL
      spatialEaseArray = [0,0]
    else if theProperty.propertyValueType is PropertyValueType.ThreeD_SPATIAL
      spatialEaseArray = [0,0,0]

    theProperty.setSpatialTangentsAtKey key, spatialEaseArray if spatialEaseArray?

    i++

NF.Util.collectionToArray = (collection) ->
  arr = []
  i = 1
  while i <= collection.length
    arr.push collection[i]
    i++
  return arr

# Just a shortcut
NF.Util.toArr = (collection) ->
  return NF.Util.collectionToArray collection

NF.Util.capitalizeFirstLetter = (string) ->
  string.charAt(0).toUpperCase() + string.slice(1)

# true if variable exists, is a string, and has a length greater than zero
NF.Util.isNonEmptyString = (unknownVariable) ->
  if (((typeof unknownVariable != "undefined") && (typeof unknownVariable.valueOf() == "string")) && (unknownVariable.length > 0))
    return true
  return false

# Returns an expression that adjusts a property based on markers. Default property values are zero
#
# model =
#   layer (Required. Either a layer name or layer object)
#   duration?: (if this is missing, defaults to 30 frames)
#     value? (in frames)
#     effect? (this needs to be a string)
#     subEffect?(this needs to be a string)
#   valueA?:
#     value?
#     effect? (this needs to be a string)
#     subEffect? (this needs to be a string)
#   valueB?:
#     value?
#     effect? (this needs to be a string)
#     subEffect? (this needs to be a string)
# FIXME: Check for if effects are actual effects or strings
NF.Util.markerDrivenExpression = (model) ->
  term = ";\n"
  defaults =
    duration: "30"
    valueA: "0"
    valueB: "0"
    subEffect: "Slider"

  # Returns the expression to access a property given a key to a value in the model
  generalValueExpression = (key) ->
    subModel = model[key]
    expressionString = ""
    if subModel?
      if subModel.value?
        expressionString += subModel.value
      else if subModel.effect?
        if NF.Util.isNonEmptyString(subModel.effect)
          effectName = subModel.effect
        else
          effectName = subModel.effect.name
        if subModel.subEffect?
          if NF.Util.isNonEmptyString(subModel.subEffect)
            subEffectName = subModel.subEffect
          else
            subEffectName = subModel.subEffect.name
        else
          subEffectName = defaults.subEffect
        expressionString += "thisComp.layer(\"#{layerName}\").effect(\"#{effectName}\")(\"#{subEffectName}\")"
      else
        expressionString += defaults[key]
    else
      expressionString += defaults[key]
    expressionString += term
    return expressionString

  unless model.layer? and model.duration?
    return alert "Error\nNo layer or duration specified in NF.Util.markerDrivenExpression!"

  # Get the layer name from the layer object if it's not a string
  if NF.Util.isNonEmptyString(model.layer)
    layerName = model.layer
  else
    layerName = model.layer.name

  durationString = generalValueExpression "duration"
  valueAString = generalValueExpression "valueA"
  valueBString = generalValueExpression "valueB"

  trimString = "if (thisComp.layer(\"#{layerName}\").marker.numKeys > 0) {\n
                    d = #{durationString}
                    m = thisComp.layer(\"#{layerName}\").marker.nearestKey(time);\n
                    t = m.time;\n
                    valueA = #{valueAString}
                    valueB = #{valueBString}
                    \n
                    if (m.index%2) {\n
                      // For all in markers\n
                      ease(time,t,t+d*thisComp.frameDuration,valueA,valueB)\n
                    } else {\n
                      // For all out markers\n
                      ease(time,t,t-d*thisComp.frameDuration,valueB,valueA)\n
                    }\n
                } else {\n
                  value\n
                }"

  return trimString

# Returns an array where each item is an object containing position data for each highlight in the target page layer
NF.Util.sourceRectsForHighlightsInTargetLayer = (targetLayer, includeTitlePage = false) ->
  sourceCompLayers = targetLayer.source?.layers
  return null if not sourceCompLayers?
  sourceHighlightLayers = []
  sourceHighlightRects = {}
  i = 1
  while i <= sourceCompLayers.length
    theLayer = sourceCompLayers[i]
    if theLayer.Effects.numProperties > 0
      if NF.Util.isHighlightLayer(theLayer)

        sourceHighlightLayers.push theLayer

        layerParent = theLayer.parent
        theLayer.parent = null
        sourceHighlightRects[theLayer.name] = NF.Util.sourceRectToComp theLayer
        sourceHighlightRects[theLayer.name].padding = theLayer.Effects.property(1).property("Thickness").value or 0
        sourceHighlightRects[theLayer.name].name = theLayer.name
        sourceHighlightRects[theLayer.name].bubbled = theLayer.Effects.property("AV_Highlighter").property("Spacing").expressionEnabled
        sourceHighlightRects[theLayer.name].broken = theLayer.Effects.property("AV_Highlighter").property("Spacing").expressionError
        theLayer.parent = layerParent
    i++

  if includeTitlePage
    sourceHighlightRects["Title Page"] =
      left: 0
      top: 0
      width: targetLayer.source.width
      height: 1080
      padding: 0
      name: "Title Page"

  sourceHighlightRects

# Uses a null hack to get the sourceRect of a layer relative to the comp. A targetTime passed in will
# be the time of the comp the LAYER is in. Default is the mainCompTime
# The Null hack seems to move the time of the maincomp sometimes so we need to keep it in line
NF.Util.sourceRectToComp = (layer, targetTime = null, keepNull = false) ->
  mainCompTime = app.project.activeItem.time
  targetTime = targetTime ? mainCompTime
  tempNull = layer.containingComp.layers.addNull()
  # This line stops the mainComp time from jumping forward.
  app.project.activeItem.time = mainCompTime
  expressionBase = "rect = thisComp.layer(#{layer.index}).sourceRectAtTime(time);"
  tempNull.transform.position.expression = expressionBase + "thisComp.layer(#{layer.index}).toComp([rect.left, rect.top])"
  topLeftPoint = tempNull.transform.position.valueAtTime targetTime, false
  tempNull.transform.position.expression = expressionBase + "thisComp.layer(#{layer.index}).toComp([rect.left + rect.width, rect.top + rect.height])"
  bottomRightPoint = tempNull.transform.position.valueAtTime targetTime, false
  tempNull.remove() unless keepNull
  rect =
    left: topLeftPoint[0]
    top: topLeftPoint[1]
    width: bottomRightPoint[0] - topLeftPoint[0]
    height: bottomRightPoint[1] - topLeftPoint[1]

NF.Util.rectRelativeToComp = (rect, layer, targetTime = null) ->
  topLeftPoint = NF.Util.pointRelativeToComp [rect.left, rect.top], layer, targetTime
  bottomRightPoint = NF.Util.pointRelativeToComp [rect.left + rect.width, rect.top + rect.height], layer, targetTime
  newRect =
    left: topLeftPoint[0]
    top: topLeftPoint[1]
    width: bottomRightPoint[0] - topLeftPoint[0]
    height: bottomRightPoint[1] - topLeftPoint[1]

# Returns a point on a layer relative to the containing comp, optionally at a given time
NF.Util.pointRelativeToComp = (sourcePoint, layer, targetTime = null) ->
  targetTime = targetTime ? app.project.activeItem.time
  tempNull = NF.Util.nullAtPointRelativeToComp sourcePoint, layer
  newPoint = tempNull.transform.position.valueAtTime targetTime, false
  tempNull.remove()
  newPoint

# Creates and returns a null object with no parent, at the same coordinates in a comp as the
# supplied point on a given layer.
NF.Util.nullAtPointRelativeToComp = (sourcePoint, layer) ->
  targetTime = targetTime ? app.project.activeItem.time
  # FIXME: This may cause the time to jump forward, similarly to in sourceRectToComp. Need to investigate further
  tempNull = layer.containingComp.layers.addNull()
  tempNull.transform.position.expression = "a = thisComp.layer(#{layer.index}).toComp([#{sourcePoint[0]}, #{sourcePoint[1]}]);
                                            a"
  tempNull

NF.Util.toKeys = (dict) ->
  allKeys = []
  for key of dict
    allKeys.push key
  allKeys

# Returns an array of verticies needed to draw a shape or mask from the source rect of a highlight layer
NF.Util.verticiesFromSourceRect = (rect) ->
  v =
    topLeft: [rect.left, rect.top]
    topRight: [rect.left + rect.width, rect.top]
    bottomRight: [rect.left + rect.width, rect.top + rect.height]
    bottomLeft: [rect.left, rect.top + rect.height]
  return [v.topLeft, v.bottomLeft, v.bottomRight, v.topRight]

NF.Util.trimExpression = (thisLine, numberOfLines) ->
  trimString = "slider_val = effect(\"AV Highlighter\")(\"Completion\") / 10;
                start_offset = effect(\"AV Highlighter\")(\"Start Offset\");
                end_offset = effect(\"AV Highlighter\")(\"End Offset\");

                line_count = #{numberOfLines};
                this_line = #{thisLine};
                total_points = line_count * 100;
                gross_points = total_points - start_offset - end_offset;
                points_per_line = gross_points/line_count*100;
                total_percent = (slider_val / 100 * gross_points + start_offset) / total_points * 100;
                min_percent = 100/line_count*(this_line-1);
                max_percent = 100/line_count*this_line;

                if (total_percent <= min_percent)
                  {0;}
                else if ( total_percent >= max_percent )
                  { 100; }
                else
                  { (total_percent - min_percent) / (max_percent - min_percent) * 100; }"

# Deprecate soon - Upgrades highlight layers up to v0.80
# Returns the highlight layer
NF.Util.upgradeHighlightLayer = (highlightLayer) ->
  lineCount = highlightLayer.property("Contents").numProperties
  i = lineCount
  lineNumber = 1
  while i >= 1
    thisLine = highlightLayer.property("Contents").property(i)
    trimProperty = thisLine.property('Contents').property('Trim Paths 1').property('End')
    trimProperty.expression = NF.Util.trimExpression(lineNumber, lineCount)

    # If the last line is partially complete, convert it to full completion with an end offset
    if lineNumber is lineCount
      if 100 > trimProperty.value > 0
        endOffset = 100 - trimProperty.value
        completionControl = highlightLayer.property("Effects").property("AV Highlighter").property("Completion")
        endOffsetControl = highlightLayer.property("Effects").property("AV Highlighter").property("End Offset")
        if completionControl.expressionEnabled is no
          completionControl.setValue 1000
          endOffsetControl.setValue endOffset

    i--
    lineNumber++

  return highlightLayer

NF.Util.fixTrimExpressionsForHighlightLayer = (highlightLayer) ->
  lineCount = highlightLayer.property("Contents").numProperties
  i = lineCount
  lineNumber = 1
  while i >= 1
    thisLine = highlightLayer.property("Contents").property(i)
    trimProperty = thisLine.property('Contents').property('Trim Paths 1').property('End')
    trimProperty.expression = NF.Util.trimExpression(lineNumber, lineCount)

    i--
    lineNumber++

# Bubble up the highlights in given layers.
# By default, will bubble all unconnected highlights in the layers given.
# Optional array of names of relevant highlights to bubble up. Will disconnect
# and override any connected layers among those provided
NF.Util.bubbleUpHighlights = (pagesToBubble, choices = null) ->
  mainComp = app.project.activeItem
  i = pagesToBubble.length - 1
  while i >= 0
    targetLayer = pagesToBubble[i]
    targetComp = targetLayer.source

    # Look in selected comp
    # Grab Array of highlight layers
    layersInPageComp = targetComp.layers
    highlightLayersInPageComp = []

    k = layersInPageComp.length
    while k >= 1
      testLayer = layersInPageComp[k]
      if testLayer.property('Effects').property('AV Highlighter')
        firstShapeIndex = testLayer.property("Contents").numProperties
        testExpression = testLayer.property("Contents").property(firstShapeIndex).property("Contents").property("Trim Paths 1").property("End").expression

        # Upgrade to the 'End Offset' pseudo effect version if necessary
        NF.Util.upgradeHighlightLayer testLayer if testExpression.indexOf('end_offset') < 0

        highlightLayersInPageComp.push testLayer
      k--
    # Create layer Controls
    effects = targetLayer.Effects
    j = highlightLayersInPageComp.length - 1
    while j >= 0

      sourceHighlighterEffect = highlightLayersInPageComp[j].property('Effects').property('AV Highlighter')
      # Only continue if it's not already hooked up to another parent comp and we weren't given choices
      shouldBubble = no
      if choices?
        shouldBubble = choices.indexOf(highlightLayersInPageComp[j].name) >= 0
      else
        shouldBubble = !sourceHighlighterEffect.property('Completion').expressionEnabled

      if shouldBubble
        targetHighlighterEffect = effects.addProperty('AV_Highlighter')
        newName = highlightLayersInPageComp[j].name + ' Highlighter'
        targetHighlighterEffect.name = newName

        # Iterate through the properties and connect each one
        highlighterProperties = [
          'Spacing'
          'Thickness'
          'Start Offset'
          'Completion'
          'Offset'
          'Opacity'
          'Highlight Colour'
          'End Offset'
        ]
        l = highlighterProperties.length - 1
        while l >= 0
          highlighterProperty = highlighterProperties[l]
          sourceHighlighterPropertyValue = sourceHighlighterEffect.property(highlighterProperty).value
          targetHighlighterEffect.property(highlighterProperty).setValue sourceHighlighterPropertyValue
          sourceExpression = ''
          sourceExpression += 'var offsetTime = comp("' + mainComp.name + '").layer("' + targetLayer.name + '").startTime;'
          sourceExpression += 'comp("' + mainComp.name + '").layer("' + targetLayer.name + '").effect("' + newName + '")("' + highlighterProperty + '")'
          sourceExpression += '.valueAtTime(time+offsetTime)'
          sourceHighlighterEffect.property(highlighterProperty).expression = sourceExpression
          l--
      j--
    i--
  return

# Add functions to app.NF
app.NF = Object.assign app.NF, NF
