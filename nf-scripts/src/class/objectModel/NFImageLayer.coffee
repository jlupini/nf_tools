###
#    NF IMAGE LAYER
#
#    (Subclass of NFLayer)
#
###
NFImageLayer = (layer) ->
  NFLayer.call(this, layer)
  @
# Instance Methods
NFImageLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFImageLayer: '#{@layer.name}'"
