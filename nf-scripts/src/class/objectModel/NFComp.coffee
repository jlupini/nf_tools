###
#    NF Comp
#
#    A composition
#
###
NFComp = (comp) ->
  # FIXME: Check to make sure we've been given a valid comp and throw error if not
  throw "Can't create an NFComp without a given comp" unless comp?
  @comp = comp
  @name = @comp.name
  @id = @comp.id
  @
# Instance Methods
NFComp:: = Object.assign NFComp::,
  getInfo: ->
    return "NFComp: '#{@name}'"
  selectedLayers: ->
    return NFLayerCollection.collectionFromAVLayerArray @comp.selectedLayers
  # Throws an error if there are non-page layers selected
  selectedPageLayers: ->
    selectedPageLayers = new NFPageLayerCollection
    for layer in @selectedLayers()
      selectedPageLayers.addNFPageLayer layer if layer instanceOf NFPageLayer
    return selectedPageLayers
  layerWithName: (name) ->
    theLayer = @comp.layers?.byName(name)
    if theLayer?
      foundLayer = new NFLayer(theLayer)
      foundLayer = foundLayer.getSpecializedLayer()
    return null
