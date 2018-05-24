###*
Creates a new NFComp and sets its comp property.
@class NFComp
@classdesc NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFComp
@param {CompItem | NFComp} comp - the CompItem for this NFComp
@throws Will throw an error if not given a valid CompItem at initialization
###
class NFComp
  constructor: (comp) ->
    if comp instanceof CompItem
      item = comp
    else if comp instanceof NFComp
      item = comp.comp
    else
      throw "Cannot create an NFComp without a valid CompItem or NFComp"
    @comp = item
    # FIXME: These should NOT be properties since they should never be changed here
    @name = @comp?.name
    @id = @comp?.id
    @
  toString: ->
    return "NFComp: '#{@name}'"

  ###*
  Checks to see if two NFComps have the same ID
  @memberof NFComp
  @param {NFComp} testComp - the comp to compare
  @returns {boolean} if they're referrring to the same object
  @throws Throws error if testComp is not an NFComp or subclass
  ###
  is: (testComp) ->
    throw "Can't compare an NFComp to a different type of object" unless testComp instanceof NFComp
    return @id is testComp.id

  ###*
  Gets the selected layers in this comp
  @memberof NFComp
  @returns {NFLayerCollection} collection of the selected layers in the comp
  ###
  selectedLayers: ->
    return new NFLayerCollection @comp.selectedLayers

  ###*
  Gets all the layers in this comp
  @memberof NFComp
  @returns {NFLayerCollection} collection of the layers in the comp
  ###
  allLayers: ->
    return new NFLayerCollection @comp.layers

  ###*
  Gets the selected pages in this comp
  @memberof NFComp
  @returns {NFPageLayerCollection} collection of the selected NFPageLayers in the comp
  ###
  selectedPageLayers: ->
    selectedPageLayers = new NFPageLayerCollection
    for layer in @selectedLayers().layers
      selectedPageLayers.addLayer(layer) if layer instanceof NFPageLayer
    return selectedPageLayers

  ###*
  Gets the active NFLayers at a time (or current time by default).
  @memberof NFComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFLayerCollection} The active layers or null if none active
  ###
  activeLayers: (time) ->
    # Set the current time to the test time, but we'll need to set it back later.
    if time?
      originalTime = @getTime()
      @setTime(time)

    activeLayers = new NFLayerCollection
    for layer in @allLayers().layers
      activeLayers.addLayer layer if layer.isActive()

    @setTime originalTime if originalTime?
    return activeLayers

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
      return foundLayer.getSpecializedLayer()
    return null

  ###*
  Gets the Zoomer layer
  @memberof NFComp
  @returns {NFLayer | null} The zoomer NFLayer or null if it doesn't exist
  ###
  getZoomer: ->
    zoomer = @layerWithName 'Zoomer'
    return zoomer

  ###*
  Sets the comp time
  @memberof NFComp
  @param {float} newTime - the new time
  @returns {NFComp} self
  ###
  setTime: (newTime) ->
    @comp.time = newTime
    @

  ###*
  Gets the comp time
  @memberof NFComp
  @returns {float} the time
  ###
  getTime: (newTime) ->
    return @comp.time

  ###*
  # Creates and returns a new null layer in this comp
  # @memberof NFComp
  # @returns {NFLayer} The newly created null layer
  ###
  addNull: ->
    return @comp.layers.addNull()

# Class Methods
NFComp = Object.assign NFComp,

  ###*
  # Returns a new NFComp, or a NFPartComp or NFPageComp if suitable
  # @memberof NFComp
  # @param {NFComp | CompItem}
  # @returns {NFComp | NFPageComp | NFPartComp} The new comp
  ###
  specializedComp: (comp) ->
    try
      return new NFPageComp comp
    try
      return new NFPartComp comp

    return new NFComp
