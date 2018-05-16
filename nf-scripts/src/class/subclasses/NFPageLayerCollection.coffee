###
#    NF PAGE LAYER COLLECTION
#
#    A collection of NF Page Layers
#
###
class NFPageLayerCollection extends NFLayerCollection
  constructor: (layerArr) ->
    NFLayerCollection.call(@, layerArr)
    if layerArr?
      for theLayer in layerArr
        throw "You can only add NFPageLayers to an NFPageLayerCollection" unless theLayer instanceof NFPageLayer

    @
  # MARK: Instance Methods
  getInfo: ->
    infoString = "NFPageLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"
  addNFLayer: (newLayer) ->
    @addNFPageLayer(newLayer)
  addNFPageLayer: (newLayer) ->
    if newLayer instanceof NFPageLayer
      @layers.push newLayer
    else
      throw "addNFPageLayer() can only be used to add NFPageLayers to an NFPageLayerCollection"
  addAVLayer: (newLayer) ->
    if NFLayer.isAVLayer newLayer
      @layers.push new NFPageLayer(newLayer)
    else
      throw "addAVLayer() can only be used to add AVLayers to an NFPageLayerCollection"
  # Returns NFHighlightLayerCollection of all highlights in all pages in the collection
  highlights: ->
    highlightArray = []
    containingLayerArray = []
    for theLayer in @layers
      if theLayer instanceof NFPageLayer
        # Get the layer's NFPageItem
        for highlight in theLayer.highlights().layers
          highlightArray.push highlight
          containingLayerArray.push theLayer
    highlights = new NFHighlightLayerCollection(highlightArray)
    return highlights if highlights.isEmpty()
    for i in [0..highlights.count()-1]
      highlights.layers[i].containingPageLayer = containingLayerArray[i]
    return highlights
  # Returns true if the collection only contains pages from the same PDF
  fromSamePDF: ->
    return true if @count() is 0
    testNumber = @layers[0].getPDFNumber()
    for layer in @layers
      return false if layer.getPDFNumber() isnt testNumber
    return true
  # Overrides the function in NFLayerCollection
  onlyContainsPageLayers: ->
    return true
  initLayers: ->
    page.init() for page in @layers
  initLayerTransforms: ->
    page.initTransforms() for page in @layers
# Class Methods
NFPageLayerCollection = Object.assign NFPageLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFLayer(layer)
      newLayer.getSpecializedLayer()
    return new NFPageLayerCollection newArray
