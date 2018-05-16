###
#    NF LAYER COLLECTION
#
#    A collection of NF Layers
#
###
NFLayerCollection = (layerArr) ->
  @layers = layerArr ? []
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFLayers to an NFLayerCollection" unless theLayer instanceof NFLayer
  @
NFLayerCollection:: = Object.assign NFLayerCollection::,
  getInfo: ->
    infoString = "NFLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"
  addNFLayer: (newLayer) ->
    if newLayer instanceof NFLayer
      @layers.push newLayer
    else
      throw "You can only add NFLayers to an NFLayerCollection"
  # Returns true if the collection only contains NFPageLayers and no other types of NFLayers
  onlyContainsPageLayers: ->
    for theLayer in @layers
      return false unless theLayer instanceof NFPageLayer
    return true
  # Returns true if the layers in the collection are all in the same comp
  inSameComp: ->
    return true if @isEmpty()
    testID = @layers[0].containingComp().id
    for layer in @layers
      return false if layer.containingComp().id isnt testID
    return true
  # Returns the containing comp for the layers, or null if inSameComp() is false
  containingComp: ->
    if @inSameComp() and not @isEmpty()
      return @layers[0].containingComp()
    return false
  getPageLayerCollection: ->
    return new NFPageLayerCollection @layers
  # Shortcut to access the number of layers in the collection
  count: ->
    return @layers.length
  # Returns true if the collection is empty
  isEmpty: ->
    return @count() is 0
  # Creates a new null parent to all the layers, positioned above the one with the lowest index. Will override previous parenting
  nullify: ->
    throw "Cannot nullify layers in different compositions at the same time" unless @inSameComp()
    throw "Cannot nullify without a given layer" if @isEmpty()
    newNull = @containingComp.addNull()
    # FIXME: PICKUP: here and add addNull() to NFComp

    # newNull = _.mainComp.layers.addNull()
  	# newNull.name = nullName
  	# newNull.moveBefore topmostLayer(selectedLayers)
  	# thisLayer = undefined
  	# #$.write("new null: "+ newNull.name + "\n");
  	# i = 1
  	# while i <= selectedLayers.length
  	# 	thisLayer = selectedLayers[i - 1]
  	# 	thisLayer.parent = newNull
  	# 	i++
  	# newNull

# Class Methods
NFLayerCollection = Object.assign NFLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFLayer(layer)
      newLayer.getSpecializedLayer()
    return new NFLayerCollection newArray
