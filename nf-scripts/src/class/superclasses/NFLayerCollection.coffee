###*
Creates a new NFLayerCollection from an array of [NFLayers]{@link NFLayer}
@class NFLayerCollection
@classdesc NF Wrapper object for a Array that contains NFLayers
@param {Array} layerArr - the array with [NFLayers]{@link NFLayer} to initialize the collection with
@property {Array} layers - the array of [NFLayers]{@link NFLayer} in the collection
@throws Will throw an error if array contains non-{@link NFLayer} objects
###
class NFLayerCollection extends Array
  constructor: (layerArr) ->
    # TODO: accept an array of AVLayers here as well
    @layers = layerArr ? []
    if layerArr?
      for theLayer in layerArr
        throw "You can only add NFLayers to an NFLayerCollection" unless theLayer instanceof NFLayer
    @
  # MARK: Instance Methods
  getInfo: ->
    infoString = "NFLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"

  ###*
  Adds an NFLayer to this collection
  @memberof NFLayerCollection
  @param {NFLayer} newLayer - the layer to add
  @returns {NFLayerCollection} self
  ###
  addNFLayer: (newLayer) ->
    if newLayer instanceof NFLayer
      @layers.push newLayer
    else
      throw "You can only add NFLayers to an NFLayerCollection"
    @

  ###*
  Returns true if the collection only contains NFPageLayers and no other types of NFLayers
  @memberof NFLayerCollection
  @returns {boolean} if the layers in this collection are all {@link NFPageLayer} objects
  ###
  onlyContainsPageLayers: ->
    for theLayer in @layers
      return false unless theLayer instanceof NFPageLayer
    return true

  ###*
  Returns true if the layers in the collection are all in the same comp
  @memberof NFLayerCollection
  @returns {boolean} if the layers in this collection are all in the same containing comp
  ###
  inSameComp: ->
    return true if @isEmpty()
    testID = @layers[0].containingComp().id
    for layer in @layers
      return false if layer.containingComp().id isnt testID
    return true

  ###*
  Returns the containing comp for the layers, or null if #inSameComp is false
  @memberof NFLayerCollection
  @returns {NFComp | null} the containing comp
  ###
  containingComp: ->
    if @inSameComp() and not @isEmpty()
      return @layers[0].containingComp()
    return null

  ###*
  Returns a new NFPageLayerCollection from this collection. Only call if you know
  this collection only contains NFPageLayers
  @memberof NFLayerCollection
  @returns {NFPageLayerCollection} the new collection
  ###
  getPageLayerCollection: ->
    return new NFPageLayerCollection @layers

  ###*
  Shortcut to access the number of layers in the collection
  @memberof NFLayerCollection
  @returns {int} the number of layers in the collection
  ###
  count: ->
    return @layers.length

  ###*
  True if the collection is empty
  @memberof NFLayerCollection
  @returns {boolean} whether or not the collection is empty
  ###
  isEmpty: ->
    return @count() is 0

  ###*
  Removes a given layer from this collection
  @memberof NFLayerCollection
  @returns {NFLayerCollection} self
  @param {NFLayer} layerToRemove the layer to be removed
  @throws Throws an error if the layers couldn't be found in this collection
  ###
  remove: (layerToRemove) ->
    # Get the index of the layer to remove
    for i in [0..@count()-1]
      layer = @layers[i]
      if layer.sameLayerAs layerToRemove
        @layers.splice(i, 1)
        return @
    throw "Couldn't find layer to remove"

  ###*
  Gets the topmost NFLayer in this collection
  @memberof NFLayerCollection
  @returns {NFLayer | null} the topmost layer or null if empty
  @throws Throws an error if the layers are in different comps
  ###
  getTopmostLayer: ->
    return null if @isEmpty()
    throw "Can't get topmost layer of layers in different comps" unless @inSameComp()
    topmostLayer = @layers[0]
    for layer in @layers
      topmostLayer = layer if layer.layer.index < topmostLayer.layer.index
    return topmostLayer

  ###*
  Gets the bottommost NFLayer in this collection
  @memberof NFLayerCollection
  @returns {NFLayer | null} the bottommost layer or null if empty
  @throws Throws an error if the layers are in different comps
  ###
  getBottommostLayer: ->
    return null if @isEmpty()
    throw "Can't get bottommost layer of layers in different comps" unless @inSameComp()
    bottommostLayer = @layers[0]
    for layer in @layers
      bottommostLayer = layer if layer.layer.index > bottommostLayer.layer.index
    return bottommostLayer

  ###*
  Sets all member layers' parents to a given {@link NFLayer} or null
  @memberof NFLayerCollection
  @param {NFLayer | null} newParent - the new parent for the member layers
  @returns {NFLayerCollection} self
  ###
  setParents: (newParent) ->
    unless @isEmpty()
      for layer in @layers
        layer.setParent(newParent)
    return @

  ###*
  Creates a new null parent to all the layers in the collection, positioned above the one with the lowest index. Will override previous parenting.
  @memberof NFLayerCollection
  @returns {NFLayer} the new null NFLayer
  ###
  nullify: ->
    throw "Cannot nullify layers in different compositions at the same time" unless @inSameComp()
    throw "Cannot nullify without a given layer" if @isEmpty()
    newNull = @containingComp().addNull()
    @setParents(newNull)
    newNull.moveBefore @getTopmostLayer().layer
    return newNull


NFLayerCollection = Object.assign NFLayerCollection,

  ###*
  Class Method which returns a new NFLayerCollection from an array of AVLayers
  @memberof NFLayerCollection
  @returns {NFLayerCollection} the new layer collection
  @throws Throw error if the given array doesn't contain only AVLayers
  ###
  collectionFromAVLayerArray: (arr) ->
    newArray = for layer in arr
      throw "Cannot run collectionFromAVLayerArray() because not all layers provided are AVLayers" unless NFLayer.isAVLayer layer
      newLayer = new NFLayer(layer)
      newLayer.getSpecializedLayer()
    return new NFLayerCollection newArray
