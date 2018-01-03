`#include "lib/extendscript.prototypes.js"`
nf = {}

# enums
nf.PageTurn =
  FLIPPEDUP: 100
  FLIPPEDDOWN: 200
  TURNING: 300
  NOPAGETURN: 400
  BROKEN: 500

# Utility Functions
nf.pageTreeForPaper = (sourceLayer) ->

  @layerObj = (layerName) ->
    ->
      app.project.activeItem.layers.byName layerName

  pageParent = nf.pageParent sourceLayer
  allLayers = app.project.activeItem.layers
  tree =
    name: pageParent.name
    index: pageParent.index
    layer: @layerObj pageParent.name
    pages: []

  i = 1
  while i <= allLayers.length
    testLayer = allLayers[i]
    if testLayer.parent is pageParent and nf.isCompLayer testLayer
      pageObject = 
        name: testLayer.name
        index: testLayer.index
        layer: @layerObj testLayer.name
        active: false
        highlights: nf.sourceRectsForHighlightsInTargetLayer testLayer, nf.isTitlePage(testLayer)
      tree.pages.push pageObject
    i++

  activePageIndex = nf.activePageIndexInArray tree.pages
  if activePageIndex?
    tree.pages[activePageIndex].active = true 
    tree.activePage = tree.pages[activePageIndex].layer()
  tree

nf.isTitlePage = (testLayer) ->
  # FIXME: This is a little hacky
  tests = ['pg01', 'pg1', 'page1', 'page01']
  isTitlePage = false
  for test in tests
    isTitlePage = true if testLayer.name.indexOf(test) isnt -1
  isTitlePage

nf.activePageIndexInArray = (pages) ->
  activePage = null
  activePageIndex = null
  i = 0
  while i < pages.length
    page = pages[i]
    pageLayer = page.layer()
    if pageLayer.active and (nf.pageTurnStatus(pageLayer) is nf.PageTurn.FLIPPEDDOWN or nf.pageTurnStatus(pageLayer) is nf.PageTurn.NOPAGETURN)
      if not activePage? or page.index < activePage.index
        activePage = page
        activePageIndex = i
    i++

  return activePageIndex

nf.pageLayerCanBeActive = (pageLayer) ->
  return pageLayer.active and (nf.pageTurnStatus(pageLayer) is nf.PageTurn.FLIPPEDDOWN or nf.pageTurnStatus(pageLayer) is nf.PageTurn.NOPAGETURN)

###
Turn a page, with a duration in seconds, starting at a given time, optionally flipping down to reveal instead of flippingUp
Current state of the page's fold will override a given flipUp value if there is already a pageTurn Effect
###
nf.turnPageAtTime = (page, duration = 1.5, time = null, flipUp = true) ->
  if not nf.isCompLayer page
    return alert "Cannot turn page on a non-comp layer"

  startTime = time ? app.project.activeItem.time
  endTime = startTime + duration
  startStatus = nf.pageTurnStatus page, startTime
  endStatus = nf.pageTurnStatus page, endTime

  # Check if already turning
  if startStatus is nf.PageTurn.TURNING or endStatus is nf.PageTurn.TURNING
    return alert "Page is already turning at specified time"
  if startStatus is nf.PageTurn.BROKEN
    return alert "Page Turn keyframes seem broken..."

  # Check if no effect set up already
  if startStatus is nf.PageTurn.NOPAGETURN
    nf.addPageTurnEffects page

  # Set the Properties
  pageSize =
    width: page.source.width
    height: page.source.height
  downPosition = [pageSize.width, pageSize.height]
  upPosition = [-pageSize.width, -pageSize.height]
  positions = [downPosition, upPosition]

  if startStatus is nf.PageTurn.FLIPPEDUP
    flipUp = false
  else if startStatus is nf.PageTurn.FLIPPEDDOWN
    flipUp = true

  positions.reverse() if not flipUp

  times = [startTime, endTime]

  foldPosition = page.effect("CC Page Turn").property("Fold Position")
  foldPosition.setValuesAtTimes times, positions

  nf.setSymmetricalTemporalEasingOnlyForProperties foldPosition, times, null, null, true

# Adds the effects for a pageturn to a layer annd sets some defaults
nf.addPageTurnEffects = (page) ->
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
Given a layer, returns the nf.PageTurn enum
###
nf.pageTurnStatus = (pageLayer, time = null) ->
  time = time ? app.project.activeItem.time
  pageTurnEffect = pageLayer.effect("CC Page Turn")
  foldPositionProperty = pageTurnEffect?.property("Fold Position")
  foldPosition = foldPositionProperty?.value
  threshold = 3840
  if not pageTurnEffect?
    return nf.PageTurn.NOPAGETURN
  else if foldPosition[0] >= threshold
    return nf.PageTurn.FLIPPEDDOWN
  else if foldPosition[0] <= threshold * -1
    return nf.PageTurn.FLIPPEDUP
  else if foldPositionProperty.numKeys isnt 0
    # FIXME: There may be more things that could mean this is broken
    return nf.PageTurn.TURNING
  else
    return nf.PageTurn.BROKEN

# Returns true if given layer is a comp
nf.isCompLayer = (testLayer) ->
  return testLayer instanceof AVLayer and testLayer.source instanceof CompItem

nf.pageParent = (selectedLayer) ->
  return selectedLayer if selectedLayer.nullLayer
  return selectedLayer.parent if selectedLayer.parent?.nullLayer
  return null

# Disconnects ALL highlight controls in a given layer or array of highlight layers
nf.disconnectBubbleupsInLayers = (layers, names = null) ->
  if not BE.isArray layers
    layers = [layers]

  bubbleupLayers = []
  for theLayer in layers
    if nf.isCompLayer theLayer
        bubbleupLayers = bubbleupLayers.concat nf.layerCollectionToArray theLayer.source.layers
    else
      bubbleupLayers.push theLayer

  for theLayer in bubbleupLayers
    if not names? or names.indexOf(theLayer.name) > -1 or (names.indexOf(theLayer.containingComp.name) > -1 and theLayer.name.indexOf("Annotation") > -1)
      effect = theLayer.effect("AV_Highlighter") or theLayer.effect("Guide Layer")
      propertyCount = effect?.numProperties
      i = 1
      while i < propertyCount and effect?
        property = effect.property i
        property.expression = ""
        i++

  layers

# Adds Temporal easing (and removes spatial easing) for an array of properties, an array of key indexes, as well as an ease type and weight.
# Keys can be delivered as indexes or times. If 
nf.setSymmetricalTemporalEasingOnlyForProperties = (theProperties, keys, easeType = null, easeWeight = null, keysAsTimes = false) ->
  if theProperties instanceof Array and keys instanceof Array
    return -1 if theProperties.length isnt keys.length

  singleKey = null
  singleProperty = null
  if theProperties instanceof Array and keys not instanceof Array
    singleKey = keys
  if keys instanceof Array and theProperties not instanceof Array
    singleProperty = theProperties

  if not easeType?
    easeType = nf.easeType ? KeyframeInterpolationType.BEZIER
  if not easeWeight?
    easeWeight = nf.easeWeight ? 33

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

nf.layerCollectionToArray = (layerCollection) ->
  arr = []
  i = 1
  while i <= layerCollection.length
    arr.push layerCollection[i]
    i++
  return arr

nf.capitalizeFirstLetter = (string) ->
  string.charAt(0).toUpperCase() + string.slice(1)

# true if variable exists, is a string, and has a length greater than zero
nf.isNonEmptyString = (unknownVariable) ->
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
nf.markerDrivenExpression = (model) ->
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
        if nf.isNonEmptyString(subModel.effect)
          effectName = subModel.effect
        else
          effectName = subModel.effect.name
        if subModel.subEffect?
          if nf.isNonEmptyString(subModel.subEffect)
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
    return alert "Error\nNo layer or duration specified in nf.markerDrivenExpression!"

  # Get the layer name from the layer object if it's not a string
  if nf.isNonEmptyString(model.layer)
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
nf.sourceRectsForHighlightsInTargetLayer = (targetLayer, includeTitlePage = false) ->
  sourceCompLayers = targetLayer.source?.layers
  return null if not sourceCompLayers?
  sourceHighlightLayers = []
  sourceHighlightRects = {}
  i = 1
  while i <= sourceCompLayers.length
    theLayer = sourceCompLayers[i]
    if theLayer.Effects.numProperties > 0
      if theLayer instanceof ShapeLayer and theLayer.Effects.property(1).matchName is "AV_Highlighter"
        sourceHighlightLayers.push theLayer

        layerParent = theLayer.parent
        theLayer.parent = null
        sourceHighlightRects[theLayer.name] = nf.sourceRectToComp theLayer
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
nf.sourceRectToComp = (layer, targetTime = null, keepNull = false) ->
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

nf.rectRelativeToComp = (rect, layer, targetTime = null) ->
  topLeftPoint = nf.pointRelativeToComp [rect.left, rect.top], layer, targetTime
  bottomRightPoint = nf.pointRelativeToComp [rect.left + rect.width, rect.top + rect.height], layer, targetTime
  newRect =
    left: topLeftPoint[0]
    top: topLeftPoint[1]
    width: bottomRightPoint[0] - topLeftPoint[0]
    height: bottomRightPoint[1] - topLeftPoint[1]

# Returns a point on a layer relative to the containing comp, optionally at a given time
nf.pointRelativeToComp = (sourcePoint, layer, targetTime = null) ->
  targetTime = targetTime ? app.project.activeItem.time
  tempNull = nf.nullAtPointRelativeToComp sourcePoint, layer
  newPoint = tempNull.transform.position.valueAtTime targetTime, false
  tempNull.remove()
  newPoint

# Creates and returns a null object with no parent, at the same coordinates in a comp as the
# supplied point on a given layer.
nf.nullAtPointRelativeToComp = (sourcePoint, layer) ->
  targetTime = targetTime ? app.project.activeItem.time
  # FIXME: This may cause the time to jump forward, similarly to in sourceRectToComp. Need to investigate further
  tempNull = layer.containingComp.layers.addNull()
  tempNull.transform.position.expression = "a = thisComp.layer(#{layer.index}).toComp([#{sourcePoint[0]}, #{sourcePoint[1]}]);
                                            a"
  tempNull

nf.toKeys = (dict) ->
  allKeys = []
  for key of dict
    allKeys.push key
  allKeys

# Returns an array of verticies needed to draw a shape or mask from the source rect of a highlight layer
nf.verticiesFromSourceRect = (rect) ->
  v =
    topLeft: [rect.left, rect.top]
    topRight: [rect.left + rect.width, rect.top]
    bottomRight: [rect.left + rect.width, rect.top + rect.height]
    bottomLeft: [rect.left, rect.top + rect.height]
  return [v.topLeft, v.bottomLeft, v.bottomRight, v.topRight]

nf.trimExpression = (thisLine, numberOfLines) ->
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
nf.upgradeHighlightLayer = (highlightLayer) ->
  lineCount = highlightLayer.property("Contents").numProperties
  i = lineCount
  lineNumber = 1
  while i >= 1
    thisLine = highlightLayer.property("Contents").property(i)
    trimProperty = thisLine.property('Contents').property('Trim Paths 1').property('End')
    trimProperty.expression = nf.trimExpression(lineNumber, lineCount)

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

nf.fixTrimExpressionsForHighlightLayer = (highlightLayer) ->
  lineCount = highlightLayer.property("Contents").numProperties
  i = lineCount
  lineNumber = 1
  while i >= 1
    thisLine = highlightLayer.property("Contents").property(i)
    trimProperty = thisLine.property('Contents').property('Trim Paths 1').property('End')
    trimProperty.expression = nf.trimExpression(lineNumber, lineCount)

    i--
    lineNumber++

nf.bubbleUpGuideLayers = (pagesToBubble, choices = null) ->
  mainComp = app.project.activeItem
  i = pagesToBubble.length - 1
  while i >= 0
    targetLayer = pagesToBubble[i]
    targetComp = targetLayer.source
    # Look in selected comp
    # Grab guide layer
    layersInPageComp = targetComp.layers
    guideLayer = layersInPageComp.byName('Annotation Guide')
    if guideLayer
      childGuideCheckbox = guideLayer.property('Effects').property('Guide Layer').property('Checkbox')
      # FIXME: Make it so that the guide layer is visible if ANY of the parent layers have this enabled
      # (basically take out this if statement and add to the existing expression each time you pageinit in a different place) (I don't know if this will work...)
      shouldBubble = no
      if choices?
        shouldBubble = choices.indexOf(targetLayer.name) >= 0
      else
        shouldBubble = !childGuideCheckbox.expressionEnabled 

      if shouldBubble
        # Add checkbox to targetLayer
        effects = targetLayer.Effects
        checkbox = effects.addProperty('ADBE Checkbox Control')
        checkboxName = 'Guide Layer'
        checkbox.name = checkboxName
        # Set checkbox to match current opacity
        # If guide layer is hidden, set the opacity to be 0
        newValue = undefined
        if !guideLayer.enabled
          guideLayer.enabled = true
          newValue = false
        else
          newValue = childGuideCheckbox.value
        checkbox.property('Checkbox').setValue newValue
        # Set childCheckbox expression on guide layer
        sourceExpression = 'comp("' + mainComp.name + '").layer("' + targetLayer.name + '").effect("' + checkboxName + '")("Checkbox")*60'
        childGuideCheckbox.expression = sourceExpression
    i--
  return

# Bubble up the highlights in given layers.
# By default, will bubble all unconnected highlights in the layers given.
# Optional array of names of relevant highlights to bubble up. Will disconnect
# and override any connected layers among those provided
nf.bubbleUpHighlights = (pagesToBubble, choices = null) ->
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
        nf.upgradeHighlightLayer testLayer if testExpression.indexOf('end_offset') < 0

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

# Add functions to app.nf
app.nf = nf