###
#    NF Comp
#
#    A composition
#
###
class NFComp
  constructor: (comp) ->
    # FIXME: Check to make sure we've been given a valid comp and throw error if not
    @comp = comp
    @name = @comp?.name
    @id = @comp?.id
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFComp: '#{@name}'"
  selectedLayers: ->
    return NFLayerCollection.collectionFromAVLayerArray @comp.selectedLayers
  # Throws an error if there are non-page layers selected
  selectedPageLayers: ->
    selectedPageLayers = new NFPageLayerCollection
    for layer in @selectedLayers().layers
      selectedPageLayers.addNFPageLayer(layer) if layer instanceof NFPageLayer
    return selectedPageLayers
  layerWithName: (name) ->
    theLayer = @comp.layers?.byName(name)
    if theLayer?
      foundLayer = new NFLayer(theLayer)
      foundLayer = foundLayer.getSpecializedLayer()
    return null
