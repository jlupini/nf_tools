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
    throw "Not a valid paper parent" unless @paperParent instanceof NFPaperParentLayer
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
  Gets all the NFPageLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFPageLayerCollection} the page layers
  ###
  getPages: ->
    allChildren = @getChildren()
    pageChildren = new NFPageLayerCollection()
    for layer in allChildren.layers
      pageChildren.addLayer layer if layer instanceof NFPageLayer
    return pageChildren

  ###*
  Returns whether a given highlight is in one of the group's layers
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
  ###
  containsHighlight: (highlight) ->
    for pageLayer in @getPages().layers
      for testHighlight in pageLayer.highlights().layers
        return true if testHighlight.is highlight
    return false

  ###*
  Returns the containing NFComp
  @memberof NFPaperLayerGroup
  @returns {NFComp} the containing comp
  ###
  containingComp: ->
    return @paperParent.containingComp()

  ###*
  Animates the parent layer starting at the given time such that a given
  highlight is visible and centered in frame, via the page parent layer.
  Always adds keyframes. Will NOT add page layers and will throw an
  error if the given highlight is not in this group already. use NFPartComp's
  animateToHighlight() instead to perform all the page addition,
  pageturns, etc.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {Object} model - The options
  @param {NFHighlightLayer} model.highlight - The highlight to move to
  @param {float} [model.time=The current time] - The time to start the
  movement at
  @param {float} [model.duration=3.0] - The duration of the move
  @param {float} [model.duration=3.0] - The duration of the move
  @throws Throws error if not given a NFHighlightLayer as model.highlight
  ###
  moveToHighlight: (model) ->
    throw "\nInvalid highlight" unless model?.highlight instanceof NFHighlightLayer and @containsHighlight(model.highlight)
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
    pageLayer = @getPages().layerWithHighlight model.highlight

    keyframeTimes = [model.time, model.time + model.duration]

    scaleFactor = pageLayer.getScaleFactorToFrameUpHighlight
      highlight: model.highlight
      time: keyframeTimes[1]
      maxScale: model.maxScale
      fillPercentage: model.fillPercentage

    initialScale = scaleProp.valueAtTime model.time, false
    targetScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor]
    keyframeScales = [scaleProp.valueAtTime(model.time, false), targetScale]
    scaleProp.setValuesAtTimes keyframeTimes, keyframeScales

    positionDelta = pageLayer.getPositionDeltaToFrameUpHighlight
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
    @paperParent.setParent originalParent
    @containingComp().setTime(originalTime)

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
    for layer in layersToGather.layers
      layersAboveGroup.addLayer layer if layer.index() < @paperParent.index()
      layersBelowGroup.addLayer layer if layer.index() > childLayers.getBottommostLayer().index()

    # For the layers in this collection above the group
    while layersAboveGroup.count() > 0
      # starting with the bottommost and working up, move each one just below the parent
      bottomLayer = layersAboveGroup.getBottommostLayer()
      bottomLayer.moveAfter @paperParent
      layersAboveGroup.remove bottomLayer
    # for the layers in this coll below the group
    while layersBelowGroup.count() > 0
      # starting with the toppest and workingdown, move each one just below the bottomest layer in the group
      topLayer = layersBelowGroup.getTopmostLayer()
      topLayer.moveAfter childLayers.getBottommostLayer()
      layersBelowGroup.remove topLayer

      layersToGather.setParents(@paperParent) if shouldParent
    @
