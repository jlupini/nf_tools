###
#    NF EMPHASIS LAYER
#
#    (Subclass of NFLayer)
#
###
class NFEmphasisLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFEmphasisLayer: '#{@layer.name}'"
