###*
Creates a new NFSpotlightLayer from a given AVLayer
@class NFSpotlightLayer
@classdesc Subclass of {@link NFLayer} for a spotlight layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFSpotlightLayer extends NFLayer

  constructor: (layer) ->
    NFLayer.call(this, layer)
    unless NFSpotlightLayer.isSpotlightLayer(@layer)
      throw new Error "NF Spotlight Layer is invalid and the wrapper class cannot be created"
    @

  toString: ->
    return "NFSpotlightLayer: '#{@layer.name}'"

NFSpotlightLayer = Object.assign NFSpotlightLayer,

  ###*
  Returns whether or not the given AVLayer is a valid Spotlight Layer
  @memberof NFSpotlightLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid spotlight layer
  ###
  isSpotlightLayer: (theLayer) ->
    return theLayer.isAVLayer() and theLayer.source?.mainSource instanceof SolidSource

  ###*
  Returns the name for a spotlight layer for a given PDF Number
  @memberof NFSpotlightLayer
  @returns {String} the appropriate name
  ###
  nameForPDFNumber: (num) ->
    return num + " - Spotlight"

  ###*
  Creates a new Spotlight layer for the given NFPaperLayerGroup
  @memberof NFSpotlightLayer
  @param {NFPaperLayerGroup} group - the paper layer group
  @returns {NFSpotlightLayer} the new spotlight layer
  ###
  newSpotlightLayer: (group) ->
    throw new Error "group must be an NFPaperLayerGroup" unless group instanceof NFPaperLayerGroup

    existingSpot = group.getSpotlight()
    return existingSpot if existingSpot?

    props =
      color: [0.0078, 0, 0.1216]
      name: NFSpotlightLayer.nameForPDFNumber group.getPDFNumber()
      width: group.containingComp().comp.width
      height: group.containingComp().comp.height
      pixelAspect: 1

    newSolidAVLayer = group.containingComp().comp.layers.addSolid props.color, props.name, props.width, props.height, props.pixelAspect

    spotlightLayer = new NFSpotlightLayer newSolidAVLayer

    controlLayers = group.getControlLayers()
    if controlLayers.isEmpty()
      spotlightLayer.moveAfter group.paperParent
    else
      spotlightLayer.moveBefore controlLayers.getTopmostLayer()

    spotlightLayer.layer.startTime = group.getPages().getEarliestLayer().layer.inPoint

    currTime = spotlightLayer.containingComp().getTime()
    spotlightLayer.containingComp().setTime spotlightLayer.layer.startTime
    spotlightLayer.setParent group.paperParent
    spotlightLayer.containingComp().setTime currTime

    return spotlightLayer
