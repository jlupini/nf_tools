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

  ###*
  Start tracking a highlight
  @memberof NFSpotlightLayer
  @param {NFHighlightLayer} highlight - the new highlight to track
  @throw Throws error if highlight is already being tracked
  @returns {NFSpotlightLayer} self
  ###
  trackHighlight: (highlight) ->
    throw new Error "Highlight invalid to track" unless highlight instanceof NFHighlightLayer
    throw new Error "Already tracking highlight" if @mask().property(highlight.getName())?

    # Get the expression for the mask shape
    fileText = NFTools.readFile "expressions/spotlight-mask-expression.js"
    expression = fileText.replace "TARGET_PAGE", highlight.getPageComp().getPageBaseName()
    expression = expression.replace "COMP_NAME", highlight.getPageComp().name
    expression = expression.replace "HIGHLIGHT_LAYER_NAME", highlight.getName()
    expression = expression.replace "HIGHLIGHT_CONTROL_LAYER_NAME", highlight.getControlLayer().getName()
    expression = expression.replace "HIGHLIGHT_CONTROL_HIGHLIGHT_EFFECT_NAME", highlight.getName()

    # Setup the mask
    newMask = @mask().addProperty "Mask"
    newMask.name = highlight.getName()
    newMask.maskShape.expression = expression
    newMask.maskMode = MaskMode.SUBTRACT
    newMask.maskFeather.setValue [80, 80]
    newMask.maskExpansion.setValue 45

    # Get the expression for the opacity
    fileText = NFTools.readFile "expressions/spotlight-mask-opacity-expression.js"
    expression = fileText.replace "ON_VALUE", "100"
    expression = expression.replace "HIGHLIGHT_CONTROL_LAYER_NAME", highlight.getControlLayer().getName()

    newMask.maskOpacity.expression = expression

    @

  ###*
  Stop tracking a highlight
  @memberof NFSpotlightLayer
  @param {NFHighlightLayer} the highlight to stop tracking
  @returns {NFSpotlightLayer} self
  ###
  stopTrackingHighlight: (highlight) ->
    throw new Error "Highlight invalid to stop tracking" unless highlight instanceof NFHighlightLayer

    existingMask = @mask().property highlight.getName()
    if existingMask?
      existingMask.remove()
    else
      throw new Error "Can't stop tracking highlight because it's not currently being tracked"

    @


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

    # Set up the dummy mask
    # Setup the mask
    newMask = spotlightLayer.mask().addProperty "Mask"
    newMask.name = "Dummy"
    newMask.maskShape.expression = "ori = [0, 0];createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);"
    newMask.maskMode = MaskMode.SUBTRACT
    newMask.maskOpacity.setValue 35

    return spotlightLayer
