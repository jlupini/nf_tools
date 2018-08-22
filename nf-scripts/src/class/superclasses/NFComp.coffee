###*
Creates a new NFComp and sets its comp property.
@class NFComp
@classdesc NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFComp
@property {String} name - the name of the comp
@property {String} id - the comp's ID
@param {CompItem | NFComp} comp - the CompItem for this NFComp
@throws Will throw an error if not given a valid CompItem at initialization
###
class NFComp extends NFObject
  constructor: (comp) ->
    NFObject.call(this)
    if comp instanceof CompItem
      item = comp
    else if comp instanceof NFComp
      item = comp.comp
    else
      throw new Error "Cannot create an NFComp without a valid CompItem or NFComp"
    @comp = item
    @
  toString: ->
    return "NFComp: '#{@name}'"

  ###*
  Gets the comp's name
  @memberof NFComp
  @returns {String} The comp's name
  ###
  getName: ->
    return @comp.name

  ###*
  Gets the comp's unique ID
  @memberof NFComp
  @returns {String} The comp's ID
  ###
  getID: ->
    return @comp.id

  ###*
  Checks to see if two NFComps have the same ID
  @memberof NFComp
  @param {NFComp} testComp - the comp to compare
  @returns {boolean} if they're referrring to the same object
  @throws Throws error if testComp is not an NFComp or subclass
  ###
  is: (testComp) ->
    throw new Error "Can't compare an NFComp to a different type of object" unless testComp instanceof NFComp
    return @getID() is testComp.getID()

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
    @selectedLayers().forEach (layer) =>
      selectedPageLayers.add(layer) if layer instanceof NFPageLayer
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
    @allLayers().forEach (layer) =>
      activeLayers.add layer if layer.isActive()

    @setTime originalTime if originalTime?
    return activeLayers

  ###*
  # Returns the first NFLayer in this comp with the layer name given or null
  # if none found. Use #layersWithName if there's the possibility of multiple
  # layers with the given name.
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
  # Returns an NFLayerCollection with the NFLayers in this comp with the layer
  # name given or null if none found
  # @memberof NFComp
  # @param {string} name - The search layer's name
  # @returns {NFLayerCollection} The found layers
  ###
  layersWithName: (name) ->
    foundLayers = new NFLayerCollection
    @allLayers().forEach (layer) =>
      foundLayers.add layer if layer.getName() is name
    return foundLayers

  ###*
  # Returns an NFLayerCollection with the NFLayers in this comp that contain
  # the searchString in their name
  # @memberof NFComp
  # @param {string} searchString - The search string
  # @returns {NFLayerCollection} The found layers
  ###
  searchLayers: (searchString) ->
    foundLayers = new NFLayerCollection
    @allLayers().forEach (layer) =>
      foundLayers.add layer if layer.getName().indexOf(searchString) >= 0
    return foundLayers

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
  Gets the center point of the comp
  @memberof NFComp
  @returns {Point} the center point
  ###
  centerPoint: ->
    return [@comp.width / 2, @comp.height / 2]

  ###*
  # Creates and returns a new null layer in this comp
  # @memberof NFComp
  # @returns {NFLayer} The newly created null layer
  ###
  addNull: ->
    return new NFLayer @comp.layers.addNull()

  ###*
  Creates and returns a new solid layer in this comp
  @memberof NFComp
  @param {Object} model
  @param {float[]} model.color - the solid color. Three-value array of floats
  from 0.0-1.0 in the form [R, G, B]
  @param {String} [model.name="New Solid"] - the solid name.
  @param {float} [model.width=compWidth] - the width
  @param {float} [model.height=compHeight] - the height
  @returns {NFLayer} The newly created solid layer
  ###
  addSolid: (model) ->
    model =
      color: model.color ? throw new Error "Solids need a color"
      name: model.name ? "New Solid"
      width: model.width ? @comp.width
      height: model.height ? @comp.height
    solidAVLayer = @comp.layers.addSolid(model.color, model.name, model.width, model.height, 1)
    return NFLayer.getSpecializedLayerFromAVLayer solidAVLayer

  ###*
  Creates and returns a new text layer in this comp
  @memberof NFComp
  @param {Object} model
  @param {String} [model.text=""]
  @param {float} [model.time=currTime] - the start time of the layer
  @param {float} [model.duration=remainderOfComp] - the duration of the layer
  @param {NFLayer} [model.below] - the layer to put this layer below
  @param {NFLayer} [model.above] - the layer to put this layer above
  @param {int} [model.at=0] - the index to put this layer
  @param {boolean} [model.applyFill=yes]
  @param {boolean} [model.applyStroke=no]
  @param {float} [model.fontSize=24]
  @param {float[]} [model.fillColor=[0,0,0]]
  @param {ParagraphJustification} [model.justification=ParagraphJustification.LEFT_JUSTIFY]
  @param {String} [model.font="Avenir Next"]
  @returns {NFLayer} The newly created text layer
  ###
  addTextLayer: (model) ->
    model.time ?= @getTime()
    model =
      time: model.time
      duration: model.duration ? @comp.duration - model.time
      below: model.below
      above: model.above
      at: model.at
      applyFill: model.applyFill ? yes
      applyStroke: model.applyStroke ? no
      fontSize: model.fontSize ? 24
      text: model.text ? ""
      fillColor: model.fillColor ? [0,0,0]
      justification: model.justification ? ParagraphJustification.LEFT_JUSTIFY
      font: model.font ? 'Avenir Next'

    throw new Error "model.above must be an NFLayer" if model.above? and not model.above instanceof NFLayer
    throw new Error "model.below must be an NFLayer" if model.below? and not model.below instanceof NFLayer
    index = 0
    tooManyIndices = no
    if model.above? and model.above instanceof NFLayer
      tooManyIndices = yes if model.below? or model.at?
      if model.above.containingComp().is @
        index = model.above.index() - 1
      else
        throw new Error "Cannot insert layer above a layer not in this comp"
    else if model.below? and model.below instanceof NFLayer
      tooManyIndices = yes if model.above? or model.at?
      if model.below.containingComp().is @
        index = model.below.index()
      else
        throw new Error "Cannot insert layer below a layer not in this comp"
    else if model.at?
      tooManyIndices = yes if model.above? or model.below?
      index = model.at
    throw new Error "Can only provide one of .above, .below, or .at when inserting text layer" if tooManyIndices


    textAVLayer = @comp.layers.addText new TextDocument model.text
    textDocProp = textAVLayer.property("ADBE Text Properties").property("ADBE Text Document")
    textDoc = textDocProp.value

    textDoc.applyFill = model.applyFill
    textDoc.fillColor = model.fillColor
    textDoc.applyStroke = model.applyStroke
    textDoc.font = model.font
    textDoc.fontSize = model.fontSize
    textDoc.justification = model.justification

    textDocProp.setValue textDoc

    textAVLayer.moveBefore @comp.layers[index+2] unless index is 0
    textAVLayer.startTime = model.time


    return new NFLayer textAVLayer

  ###*
  Inserts a layer into the comp at a given index at the current time. Returns
  the new layer
  @memberof NFComp
  @returns {NFLayer} the new layer
  @param {Object} model - the parameters
  @param {NFComp} model.comp - the comp to insert
  @param {NFLayer} [model.above] - the layer to insert the page above. Can use
  only one of .above, .below or .at
  @param {NFLayer} [model.below] - the layer to insert the page below. Can use
  only one of .above, .below or .at
  @param {int} [model.at=0] - the index to insert the page at. Can use only
  one of .above, .below or .at
  @param {float} [model.time=Current Time] - the time to insert the comp at
  @throws Throw error if given values for more than one of .above, .below,
  and .at
  ###
  insertComp: (model) ->
    throw new Error "No comp to insert" unless model.comp? and model.comp instanceof NFComp
    throw new Error "model.above must be an NFLayer" if model.above? and not model.above instanceof NFLayer
    throw new Error "model.below must be an NFLayer" if model.below? and not model.below instanceof NFLayer
    index = 0
    tooManyIndices = no
    if model.above? and model.above instanceof NFLayer
      tooManyIndices = yes if model.below? or model.at?
      if model.above.containingComp().is @
        index = model.above.index() - 1
      else
        throw new Error "Cannot insert layer above a layer not in this comp"
    else if model.below? and model.below instanceof NFLayer
      tooManyIndices = yes if model.above? or model.at?
      if model.below.containingComp().is @
        index = model.below.index()
      else
        throw new Error "Cannot insert layer below a layer not in this comp"
    else if model.at?
      tooManyIndices = yes if model.above? or model.below?
      index = model.at

    throw new Error "Can only provide one of .above, .below, or .at when inserting page" if tooManyIndices

    # Gonna do some work with AV Layers
    newAVLayer = @comp.layers.add(model.comp.comp)
    newAVLayer.startTime = model.time ? @getTime()
    # Note: we're doing moveBefore with index + 2 to account for both
    #       the new layer that's been added AND the obnoxious 1-indexing
    #       of adobe's LayerCollections
    newAVLayer.moveBefore @comp.layers[index+2] unless index is 0

    # Convert back to an NFLayer for the return
    return NFLayer.getSpecializedLayerFromAVLayer newAVLayer

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

    return new NFComp comp

  TOP: 100
  LEFT: 200
  BOTTOM: 300
  RIGHT: 400
  AUTO: 500
