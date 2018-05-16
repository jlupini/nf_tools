###
#    NF HIGHLIGHT LAYER COLLECTION
#
#    A collection of NF Highlight Layers
#
###
NFHighlightLayerCollection = (layerArr) ->
  NFLayerCollection.call(this, layerArr)
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection" unless theLayer instanceof NFHighlightLayer

  @
# Instance Methods
NFHighlightLayerCollection:: = Object.assign new NFLayerCollection(),
  getInfo: ->
    infoString = "NFHighlightLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"
  addNFLayer: (newLayer) ->
    @addNFHighlightLayer(newLayer)
  addNFHighlightLayer: (newLayer) ->
    if newLayer instanceof NFHighlightLayer
      @layers.push newLayer
    else
      throw "addNFHighlightLayer() can only be used to add NFHighlightLayers to an NFHighlightLayerCollection"
  addAVLayer: (newLayer) ->
    if newLayer instanceof AVLayer
      @layers.push new NFHighlightLayer(newLayer)
    else
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection"
  # Overrides the function in NFLayerCollection
  onlyContainsPageLayers: ->
    return false
  # Checks to see if any highlights in the collection share the same name
  duplicateNames: ->
    nameArr = []
    nameArr.push theLayer.name for theLayer in @layers
    return NF.Util.hasDuplicates(nameArr)
  disconnectHighlights: ->
    highlight.disconnect() for highlight in @layers
  bubbleUpHighlights: ->
    highlight.bubbleUp() for highlight in @layers
# Class Methods
NFHighlightLayerCollection = Object.assign NFHighlightLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFHighlightLayer(layer)
    return new NFHighlightLayerCollection newArray
