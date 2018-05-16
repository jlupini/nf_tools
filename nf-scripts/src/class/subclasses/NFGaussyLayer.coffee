###
#    NF GAUSSY LAYER
#
#    (Subclass of NFLayer)
#
###
class NFGaussyLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFGaussyLayer: '#{@layer.name}'"
