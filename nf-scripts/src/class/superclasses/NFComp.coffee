###*
Creates a new NFComp and sets its comp property.
@class NFComp
@classdesc NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFComp
@param {CompItem} comp - the CompItem for this NFComp
@throws Will throw an error if not given a valid CompItem at initialization
###
class NFComp
  constructor: (comp) ->
    throw "Cannot create an NFComp without a valid CompItem" unless comp instanceof CompItem
    # FIXME: Check to make sure we've been given a valid comp and throw error if not
    @comp = comp
    # FIXME: These should NOT be properties since they should never be changed here
    @name = @comp?.name
    @id = @comp?.id
    @

  ###*
  Returns a string representation of the object
  @memberof NFComp
  @returns {string} string representation of the object
  ###
  getInfo: ->
    return "NFComp: '#{@name}'"

  ###*
  Gets the selected layers in this comp
  @memberof NFComp
  @returns {NFLayerCollection} collection of the selected layers in the comp
  ###
  selectedLayers: ->
    return NFLayerCollection.collectionFromAVLayerArray @comp.selectedLayers

  ###*
  Gets the selected pages in this comp
  @memberof NFComp
  @returns {NFPageLayerCollection} collection of the selected NFPageLayers in the comp
  ###
  selectedPageLayers: ->
    selectedPageLayers = new NFPageLayerCollection
    for layer in @selectedLayers().layers
      selectedPageLayers.addNFPageLayer(layer) if layer instanceof NFPageLayer
    return selectedPageLayers

  ###*
  # Returns the NFLayer in this comp with the layer name given or null if none found
  # @memberof NFComp
  # @param {string} name - The search layer's name
  # @returns {NFLayer|null} The found layer or null
  ###
  layerWithName: (name) ->
    theLayer = @comp.layers?.byName(name)
    if theLayer?
      foundLayer = new NFLayer(theLayer)
      foundLayer = foundLayer.getSpecializedLayer()
    return null

  ###*
  # Creates and returns a new null layer in this comp
  # @memberof NFComp
  # @returns {NFLayer} The newly created null layer
  ###
  addNull: ->
    return @comp.layers.addNull()
