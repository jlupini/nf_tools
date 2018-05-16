###
#    NF GAUSSY LAYER
#
#    (Subclass of NFLayer)
#
###
NFGaussyLayer = (layer) ->
  NFLayer.call(this, layer)
  @
# Instance Methods
NFGaussyLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFGaussyLayer: '#{@layer.name}'"
