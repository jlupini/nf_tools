###*
Creates a new NFPageLayerCollection from a given array of NFPageLayers
@class NFPageLayerCollection
@classdesc Subclass of {@link NFLayer} for the parent null layer of a group of page layers from the same PDF
@param {NFPageLayer[]} layerArr - array of layers to use
@property {NFPageLayer[]} layers - array of layers
@extends NFLayerCollection
@throws Will throw an error if the array does not contain valid page layers
###
class NFPageLayerCollection extends NFLayerCollection
  constructor: (layerArr) ->
    NFLayerCollection.call(@, layerArr)
    if @layers?
      for theLayer in @layers
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

  ###*
  Creates a new {@link NFPaperParentLayer} from this collection
  @memberof NFPageLayerCollection
  @returns {NFPaperParentLayer} the new Paper Parent layer
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
  ###
  newPaperParentLayer: ->
    throw "Can't create a paper parent layer with no target layers" if @isEmpty()
    throw "Can't create a single paper parent layer for page layers from different PDFs" unless @fromSamePDF()
    newPaperParent = new NFPaperParentLayer(@nullify()).setName()
    return newPaperParent

  ###*
  Checks for an existing valid paper parent layer for these pages. Sets it as
  the parent if it exists, otherwise creates a new one.
  @memberof NFPageLayerCollection
  @returns {NFPaperParentLayer} the paper parent layer
  @param {boolean} [shouldMove] - whether or not the layers should move below their parent
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
  ###
  assignPaperParentLayer: (shouldMove = no) ->
    throw "Can't create a paper parent layer with no target layers" if @isEmpty()
    throw "Can't create a single paper parent layer for page layers from different PDFs" unless @fromSamePDF()
    paperParentLayer = @layers[0].findPaperParentLayer()
    if paperParentLayer?
      
      # FIXME: Add a new class NFPaperLayerGroup here and do the manipulation necessary
      if shouldMove
        paperLayerGroup = paperParentLayer.getChildren()

        layersAboveGroup = new NFLayerCollection()
        layersBelowGroup = new NFLayerCollection()
        for layer in @layers
          layersAboveGroup.addNFLayer layer if layer.index() < paperParentLayer.index()
          layersBelowGroup.addNFLayer layer if layer.index() > paperParentLayer.index()

        # For the layers in this collection above the group
        while layersAboveGroup.count() > 0
          # starting with the bottommost and working up, move each one just below the parent
          bottomLayer = layersAboveGroup.getBottommostLayer()
          bottomLayer.moveAfter paperParentLayer
          layersAboveGroup.remove bottomLayer
        # for the layers in this coll below the group
        while layersBelowGroup.count() > 0
          # starting with the toppest and workingdown, move each one just below the bottomest layer in the group
          topLayer = layersBelowGroup.getTopmostLayer()
          topLayer.moveAfter paperLayerGroup.getBottommostLayer()
          layersBelowGroup.remove topLayer

      @setParents(paperParentLayer)
    else
      paperParentLayer = @newPaperParentLayer()

    return paperParentLayer
# Class Methods
NFPageLayerCollection = Object.assign NFPageLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFLayer(layer)
      newLayer.getSpecializedLayer()
    return new NFPageLayerCollection newArray
