###*
Creates a new NFPaperLayerGroup from an NFPaperParentLayer
@class NFPaperLayerGroup
@classdesc An object that manages and manipulates a group of layers that are part of the same PDF
@param {NFPaperParentLayer} paperParent - the NFPaperParentLayer to create the group with
@property {NFPaperParentLayer} paperParent - the NFPaperParentLayer for the group
@throws Will throw an error if not created with a valid NFPaperParentLayer object
###
class NFPaperLayerGroup
  constructor: (paperParent) ->
    @paperParent = paperParent
    throw new Error "Not a valid paper parent" unless @paperParent instanceof NFPaperParentLayer
  toString: ->
    # FIXME: Write this function
    return "NFPaperLayerGroup: #{@paperParent.layer.name}"

  ###*
  Gets all the NFLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the layers
  ###
  getChildren: ->
    return @paperParent.getChildren()

  ###*
  Returns the PDF Number
  @memberof NFPaperLayerGroup
  @returns {String} the pdf number
  ###
  getPDFNumber: ->
    children = @getChildren()
    for layer in children.layers
      return layer.getPDFNumber() if layer instanceof NFPageLayer
    return null


  ###*
  Gets all the NFPageLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFPageLayerCollection} the page layers
  ###
  getPages: ->
    allChildren = @getChildren()
    pageChildren = new NFPageLayerCollection()
    allChildren.forEach (layer) =>
      pageChildren.add layer if layer instanceof NFPageLayer
    return pageChildren

  ###*
  Gets all the NFHighlightControlLayer in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the control layers
  ###
  getControlLayers: ->
    allChildren = @getChildren()
    controlChildren = new NFLayerCollection()
    allChildren.forEach (layer) =>
      controlChildren.add layer if layer instanceof NFHighlightControlLayer
    return controlChildren

  ###*
  Returns whether a given highlight is in one of the group's layers
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
  ###
  containsHighlight: (highlight) ->
    foundHighlight = false
    @getPages().forEach (pageLayer) =>
      pageLayer.highlights().forEach (testHighlight) =>
        foundHighlight = true if testHighlight.is highlight
    return foundHighlight

  ###*
  Returns the containing NFComp
  @memberof NFPaperLayerGroup
  @returns {NFComp} the containing comp
  ###
  containingComp: ->
    return @paperParent.containingComp()

  ###*
  Returns the spotlight layer if it exists
  @memberof NFPaperLayerGroup
  @returns {NFSpotlightLayer | null} the spotlight layer
  ###
  getSpotlight: ->
    return @containingComp().layerWithName NFSpotlightLayer.nameForPDFNumber(@getPDFNumber())

  ###*
  Adds a spotlight for the given highlight.
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight to spotlight
  @returns {NFSpotlightLayer} the spotlight layer
  ###
  addSpotlight: (highlight) ->
    throw new Error "Must provide a highlight to create a spotlight" unless highlight instanceof NFHighlightLayer

    spotlightLayer = @getSpotlight()

    unless spotlightLayer?
      NFSpotlightLayer.newSpotlightLayer(@)

  ###*
  Bubbles up given highlights or highlight to this comp by creating an
  NFHighlightControlLayer.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {NFHighlightLayer | NFHighlightLayerCollection} highlightsToBubble - the highlights to bubble up
  @param {float} [time] - the time to create the control layer at
  @throws Throw error if any highlight choices are connected and not broken,
  so you should have disconnected them first
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
  ###
  bubbleUp: (highlightsToBubble, time) ->
    # If given a single highlight, wrap it.
    if highlightsToBubble instanceof NFHighlightLayer
      highlightsToBubble = new NFHighlightLayerCollection([highlightsToBubble])

    unless highlightsToBubble.isEmpty()
      highlightsToBubble.forEach (highlight) =>

        unless highlight.canBubbleUp()
          throw new Error "Cannot bubble highlight if already connected and not broken. Disconnect first"

        # Make sure the highlight is in a page in the group
        highlightIsInGroup = no
        @getPages().forEach (pageInGroup) =>
          if pageInGroup.getPageComp().is highlight.getPageComp()
            highlightIsInGroup = yes
        unless highlightIsInGroup
          throw new Error "Cannot bubble highlight because it is not in this group!"

        sourceEffect = highlight.highlighterEffect()

        targetComp = @containingComp()

        controlLayer = NFHighlightControlLayer.newHighlightControlLayer
          group: @
          highlight: highlight
          time: time ? null

        highlighterEffect = controlLayer.highlighterEffect()

        # Iterate through the properties and connect each one
        for highlighterProperty in NFHighlightLayer.highlighterProperties
          sourceValue = sourceEffect.property(highlighterProperty).value
          highlighterEffect.property(highlighterProperty).setValue(sourceValue)

          # Opacity needs a special expression since it's tied to the position
          # of the control layer
          if highlighterProperty is "Opacity"
            propExpressionName = "highlight-opacity-expression"
          else
            propExpressionName = "highlight-property-expression"

          sourceExpression = NFTools.readExpression propExpressionName,
            TARGET_COMP_NAME: targetComp.comp.name
            CONTROL_LAYER_NAME: controlLayer.layer.name
            PAGE_BASE_NAME: highlight.getPageComp().getPageBaseName()
            HIGHLIGHT_NAME: highlight.getName()
            HIGHLIGHTER_PROPERTY: highlighterProperty

          sourceEffect.property(highlighterProperty).expression = sourceExpression

        # Add a spotlight layer if one doesn't exist, and track the new highlight
        spotlightLayer = @getSpotlight() ? @addSpotlight(highlight)
        spotlightLayer.trackHighlight highlight
    @

  ###*
  Animates the parent layer starting at the given time such that a given
  highlight is visible and centered in frame, via the page parent layer.
  Always adds keyframes. Will NOT add page layers and will throw an
  error if the given highlight is not in this group already. use NFPartComp's
  animateTo() instead to perform all the page addition,
  pageturns, etc.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {Object} model - The options
  @param {NFHighlightLayer} model.highlight - The highlight to move to
  @param {float} [model.time=The current time] - The time to start the
  movement at
  @param {float} [model.duration=3.0] - The duration of the move
  @param {float} [model.maxScale=115] - The maximum a page will scale in this move
  @param {float} [model.fillPercentage=85] - the percentage of the width of the
  comp the highlight should fill
  @throws Throws error if not given a NFHighlightLayer as model.highlight
  ###
  moveToHighlight: (model) ->
    throw new Error "\nInvalid highlight" unless model?.highlight instanceof NFHighlightLayer and @containsHighlight(model.highlight)
    model =
      highlight: model.highlight
      time: model.time ? @containingComp().getTime()
      duration: model.duration ? 3.0
      maxScale: model.maxScale ? 115
      fillPercentage: model.fillPercentage ? 85

    positionProp = @paperParent.transform().position
    scaleProp = @paperParent.transform().scale

    # Move the time to the target time and unparent
    originalTime = @containingComp().getTime()
    @containingComp().setTime model.time

    originalParent = @paperParent.getParent()
    @paperParent.setParent null

    # Move to the Highlight
    possibleLayers = @getPages().layersWithHighlight model.highlight
    activePageLayer = null
    possibleLayers.forEach (theLayer) =>
      activePageLayer = theLayer if theLayer.isActiveAtTime model.time

    keyframeTimes = [model.time, model.time + model.duration]

    scaleFactor = activePageLayer.getScaleFactorToFrameUpHighlight
      highlight: model.highlight
      time: keyframeTimes[1]
      maxScale: model.maxScale
      fillPercentage: model.fillPercentage

    initialScale = scaleProp.valueAtTime model.time, false
    targetScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor]
    keyframeScales = [scaleProp.valueAtTime(model.time, false), targetScale]
    scaleProp.setValuesAtTimes keyframeTimes, keyframeScales

    positionDelta = activePageLayer.getPositionDeltaToFrameUpHighlight
      highlight: model.highlight
      time: keyframeTimes[1]
    initialPosition = positionProp.valueAtTime model.time, false
    targetPosition = [initialPosition[0] + positionDelta[0], initialPosition[1] + positionDelta[1]]
    keyframePositions = [positionProp.valueAtTime(model.time, false), targetPosition]
    positionProp.setValuesAtTimes keyframeTimes, keyframePositions

    scaleProp.easyEaseKeyTimes
      keyTimes: keyframeTimes
    positionProp.easyEaseKeyTimes
      keyTimes: keyframeTimes

    # Restore the original parent and comp time
    @containingComp().setTime(originalTime)
    @paperParent.setParent originalParent

    @


  ###*
  Moves the given layers into the group and parents if indicated. Layers below
  the bottommost layer in the group will go at the bottom, and layers above the
  parent will go immediately below it.
  @memberof NFPaperLayerGroup
  @param {NFLayerCollection} layersToGather - the layers to gather up
  @param {boolean} [shouldParent=true] - whether or not to parent the new layers
  to the paper parent
  @returns {NFPaperLayerGroup} self
  ###
  gatherLayers: (layersToGather, shouldParent = yes) ->
    childLayers = @getChildren()

    layersAboveGroup = new NFLayerCollection()
    layersBelowGroup = new NFLayerCollection()
    layersToGather.forEach (layer) =>
      layersAboveGroup.add layer if layer.index() < @paperParent.index()
      layersBelowGroup.add layer if layer.index() > childLayers.getBottommostLayer().index()

    # For the layers in this collection above the group
    while layersAboveGroup.count() > 0
      controlLayers = @getControlLayers()
      if controlLayers.isEmpty()
        layerAbove = @paperParent
      else
        layerAbove = controlLayers.getBottommostLayer()

      # starting with the bottommost and working up, move each one just below the lowest control layer
      bottomLayer = layersAboveGroup.getBottommostLayer()
      bottomLayer.moveAfter layerAbove
      layersAboveGroup.remove bottomLayer
    # for the layers in this coll below the group
    while layersBelowGroup.count() > 0
      # starting with the toppest and workingdown, move each one just below the bottomest layer in the group
      topLayer = layersBelowGroup.getTopmostLayer()
      topLayer.moveAfter childLayers.getBottommostLayer()
      layersBelowGroup.remove topLayer

      layersToGather.setParents(@paperParent) if shouldParent
    @
