###
#    NF IMAGE LAYER
#
#    (Subclass of NFLayer)
#
###
class NFImageLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFImageLayer: '#{@layer.name}'"
