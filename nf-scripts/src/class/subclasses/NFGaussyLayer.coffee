###*
Creates a new NFGaussyLayer from a given AVLayer
@class NFGaussyLayer
@classdesc Subclass of {@link NFLayer} for a gaussy layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFGaussyLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  toString: ->
    return "NFGaussyLayer: '#{@layer.name}'"


NFGaussyLayer = Object.assign NFGaussyLayer,

  ###*
  Returns whether or not the given AVLayer is a valid Gaussy Layer
  @memberof NFGaussyLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid gaussy layer
  ###
  isGaussyLayer: (theLayer) ->
    return theLayer.name.indexOf("Gaussy") >= 0
