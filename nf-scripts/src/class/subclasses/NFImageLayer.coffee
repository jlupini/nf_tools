###*
Creates a new NFImageLayer from a given AVLayer
@class NFImageLayer
@classdesc Subclass of {@link NFLayer} for an image layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFImageLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  # MARK: Instance Methods
  toString: ->
    return "NFImageLayer: '#{@$.name}'"
