###*
Creates a new NFHighlightLayerCollection from a given array of NFHighlightLayers
@class NFHighlightLayerCollection
@classdesc Subclass of {@link NFLayerCollection} for highlight layers
@param {NFHighlightLayer[]} layerArr - array of layers to use
@property {NFHighlightLayer[]} layers - array of layers
@extends NFLayerCollection
@throws Will throw an error if the array does not contain valid highlight layers
###
class NFHighlightLayerCollection extends NFLayerCollection
  constructor: (layerArr) ->
    NFLayerCollection.call(@, layerArr)
    if layerArr?
      for theLayer in layerArr
        throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection" unless theLayer instanceof NFHighlightLayer

    @
  getInfo: ->
    infoString = "NFHighlightLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"

  ###*
  Adds an NFHighlightLayer or AVLayer to this collection
  @memberof NFHighlightLayerCollection
  @param {NFHighlightLayer | AVLayer} newLayer - the layer to add to this collection
  @override
  @returns {NFHighlightLayerCollection} self
  @throws Throws error if not given an NFHighlightLayer or valid highlight AVLayer (ShapeLayer)
  ###
  addLayer: (newLayer) ->
    if NFLayer.isAVLayer newLayer
      @layers.push new NFHighlightLayer(newLayer)
    else if newLayer instanceof NFHighlightLayer
      @layers.push newLayer
    else
      throw "addLayer() can only be used to add AVLayers or NFHighlightLayers to an NFHighlightLayerCollection"
    @

  ###*
  Always returns false since this object cannot contain page layers
  @memberof NFHighlightLayerCollection
  @override
  @returns {boolean} false
  ###
  onlyContainsPageLayers: ->
    return false

  ###*
  Checks to see if any highlights in the collection share the same name
  @memberof NFHighlightLayerCollection
  @returns {boolean} whether or not any highlights in the collection share the same name
  ###
  duplicateNames: ->
    nameArr = []
    nameArr.push theLayer.name for theLayer in @layers
    return NF.Util.hasDuplicates(nameArr)

  ###*
  Disconnect all highlights in all layers
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
  ###
  disconnectHighlights: ->
    highlight.disconnect() for highlight in @layers
    @

  ###*
  Bubble up all highlights to their respective layers.
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
  @throws Throws error if any highlight is already bubbled up (so use #disconnectHighlights first)
  ###
  bubbleUpHighlights: ->
    highlight.bubbleUp() for highlight in @layers
    @

  ###*
  Reset expression error status for all highlights. This is to be called after #fixExpressionAfterInit.
  Because of the way AE handles scripting, if a script breaks an expression, then even if it fixes it,
  the expression error will be there when the script finishes. This just clears that. If there's still
  an expression error after the script finishes, that'll still appear.
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
  ###
  resetExpressionErrors: ->
    highlight.resetExpressionErrors() for highlight in @layers
    @

  ###*
  Updates the expressions on highlights to account for the new name of the layer after being
  initialized. Call #resetExpressionErrors after this to prevent incorrect error warnings.
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
  ###
  fixExpressionsAfterInit: ->
    highlight.fixExpressionAfterInit() for highlight in @layers

# Class Methods
NFHighlightLayerCollection = Object.assign NFHighlightLayerCollection,

  ###*
  Returns a new instance from an array of AVLayers/ShapeLayers
  @memberof NFHighlightLayerCollection
  @param {ShapeLayer[]} arr - the array of ShapeLayers
  @returns {NFHighlightLayerCollection} the new instance
  ###
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFHighlightLayer(layer)
    return new NFHighlightLayerCollection newArray
