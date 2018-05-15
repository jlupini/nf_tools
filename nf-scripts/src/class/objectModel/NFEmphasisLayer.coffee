###
#    NF EMPHASIS LAYER
#
#    (Subclass of NFLayer)
#
###
NFEmphasisLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NFEmphasisLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFEmphasisLayer: '#{@layer.name}'"
