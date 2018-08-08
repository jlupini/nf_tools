###*
Creates a new NFHighlightControlLayer from a given AVLayer
@class NFHighlightControlLayer
@classdesc Subclass of {@link NFLayer} for a highlight control layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@property {NFHighlightLayer} highlight - the highlight this layer controls
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a highlight control
###
class NFHighlightControlLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    unless NFHighlightControlLayer.isHighlightControlLayer(@layer)
      throw new Error "NF Highlight Control Layer is invalid and the wrapper class cannot be created"
    @
  toString: ->
    return "NFHighlightControlLayer: '#{@layer.name}'"

  ###*
  Returns the AV Highlighter effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Highlighter Property on the control layer
  ###
  highlighterEffect: ->
    return @layer.Effects.property("AV_Highlighter")

  ###*
  Returns the AV Highlight Control effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Highlighter Control property on the control layer
  ###
  highlightControlEffect: ->
    return @layer.Effects.property("AV_Highlight_Control")

  ###*
  Returns the AV Spotlight effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Spotlight property on the control layer
  ###
  spotlightEffect: ->
    return @layer.Effects.property("AV_Spotlight")

NFHighlightControlLayer = Object.assign NFHighlightControlLayer,

  ###*
  Returns the name for a control layer for a given PDF Number and highlight
  @memberof NFHighlightControlLayer
  @returns {String} the appropriate name
  ###
  nameForPDFNumberAndHighlight: (num, highlight) ->
    return "#{num} - #{highlight.layer.name} Highlight Control"

  ###*
  Returns whether or not the given AVLayer is a valid Highlight Control Layer
  @memberof NFHighlightControlLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid highlight layer
  ###
  isHighlightControlLayer: (theLayer) ->
    return theLayer.nullLayer and theLayer.name.indexOf("Highlight Control") >= 0

  ###*
  Creates a new NFHighlightControlLayer for the given page, at the given time,
  for the given highlight
  @memberof NFHighlightControlLayer
  @param {Object} model - the model
  @param {NFPaperLayerGroup} model.group - the layer group
  @param {NFHighlightLayer} model.highlight - the highlight
  @param {float} model.time - the start time for the control
  @returns {NFHighlightControlLayer} the new control layer
  ###
  newHighlightControlLayer: (model) ->
    throw new Error "Missing parameters" unless model?.group? and model.highlight?

    # Create the control layer
    partComp = model.group.containingComp()
    controlLayer = partComp.addNull()
    controlLayer.layer.name = NFHighlightControlLayer.nameForPDFNumberAndHighlight model.group.getPDFNumber(), model.highlight
    controlLayer = new NFHighlightControlLayer controlLayer

    existingControlLayers = model.group.getControlLayers()
    if existingControlLayers.isEmpty()
      controlLayer.moveAfter model.group.paperParent
    else
      controlLayer.moveBefore existingControlLayers.getTopmostLayer()

    controlLayer.layer.startTime = model.time ? partComp.getTime()
    controlLayer.layer.endTime = controlLayer.layer.startTime + 5
    controlLayer.setParent model.group.paperParent

    effects = controlLayer.effects()

    # Add the highlighter effect
    highlighterEffect = effects.addProperty "AV_Highlighter"
    highlighterEffect.name = model.highlight.layer.name

    # Add the control effect
    controlEffect = effects.addProperty "AV_Highlight_Control"
    controlEffect.name = "Highlight Control"
    controlEffect.property("Endless").setValue true

    # Add the spotlight markers
    controlLayer.addMarker
      comment: "Spotlight"
      time: controlLayer.layer.startTime + 1
      duration: 10

    return controlLayer
