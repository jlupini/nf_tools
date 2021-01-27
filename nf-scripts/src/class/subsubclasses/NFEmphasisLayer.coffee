###*
Creates a new NFEmphasisLayer from a given AVLayer
@class NFEmphasisLayer
@classdesc Subclass of {@link NFLayer} for an emphasis layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFEmphasisLayer extends NFShapeLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  toString: ->
    return "NFEmphasisLayer: '#{@$.name}'"

  ###*
  Provides an object to be easily converted to JSON for the CEP Panel
  @memberof NFEmphasisLayer
  @returns {Object} the CEP Panel object
  ###
  simplify: ->
    obj = NFLayer.prototype.simplify.call @
    obj.class = "NFEmphasisLayer"
    return obj


NFEmphasisLayer = Object.assign NFEmphasisLayer,

  ###*
  Returns the name to use for an emphasis layer on the given layer
  @memberof NFEmphasisLayer
  @param {NFLayer} the layer to check for
  @returns {String} the name
  ###
  nameForLayer: (theLayer) ->
    return "#{theLayer.getName()} - Emphasis"

  ###*
  Returns whether or not the given AVLayer is a valid Emphasis Layer
  @memberof NFEmphasisLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid emphasis layer
  ###
  isEmphasisLayer: (theLayer) ->
    return theLayer.name.indexOf("Emphasis") >= 0 and theLayer instanceof ShapeLayer
