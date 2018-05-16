###*
Creates a new NFLayer from a given AVLayer
@class NFLayer
@classdesc NF Wrapper object for an AVLayer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer (in which case we use it's AVLayer)
@property {AVLayer} layer - the wrapped AVLayer
@throws Will throw an error if not given a valid AVLayer object
###
class NFLayer
  constructor: (layer) ->
    if NFLayer.isAVLayer layer
      @layer = layer
    else if layer instanceof NFLayer
      @layer  = layer.layer
    else
      throw "Can only create a new NFLayer with a valid AVLayer or NFLayer object"
    @layer = layer
    @
  # MARK: Instance Methods
  isPageLayer: ->
    return NFPageLayer.isPageLayer(@layer)
  isNullLayer: ->
    return @layer.nullLayer
  isHighlightLayer: ->
    return NFHighlightLayer.isHighlightLayer(@layer)
  isPaperParentLayer: ->
    return NFPaperParentLayer.isPaperParentLayer(@layer)
  getSpecializedLayer: ->
    # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers
    if @isPageLayer()
      return new NFPageLayer @layer
    else if @isHighlightLayer()
      return new NFHighlightLayer @layer
    else if @isPaperParentLayer()
      return new NFPaperParentLayer @layer
    else
      return @
  getInfo: ->
    return "NFLayer: '#{@layer.name}'"
  # Returns true if the layer has a null parent
  hasNullParent: ->
    if @layer.parent?
      return @layer.parent.nullLayer
    return false

  # Checks to see if a given NFLayer's layer is the same as this one's
  # For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  sameLayerAs: (testLayer) ->
    return no unless testLayer?
    return @layer.index == testLayer.layer.index and @layer.containingComp.id == testLayer.layer.containingComp.id

  ###*
  Returns the containing NFComp
  @memberof NFLayer
  @returns {NFComp} the containing comp
  ###
  containingComp: ->
    return new NFComp @layer.containingComp

  ###*
  Returns an NFLayerCollection of child layers of this layer
  @memberof NFLayer
  @returns {NFLayerCollection} the collection of child layers
  ###
  getChildren: ->
    # Look for all layers in the comp this layer is in whose parents are this layer
    # NOTE: We're working with AVLayers
    allLayers = @containingComp().comp.layers.toArr()
    childLayers = []

    for theLayer in allLayers
      testLayer = new NFLayer theLayer
      if testLayer.layer.parent is @layer
        testLayer = testLayer.getSpecializedLayer()
        childLayers.push testLayer

    return new NFLayerCollection childLayers

  ###*
  Gets the layer's parent NFLayer, if any
  @memberof NFLayer
  @returns {NFLayer | null} the parent layer, or null if no parent
  ###
  getParent: ->
    return new NFLayer(@layer.parent) if @layer.parent?
    return null

  ###*
  Sets the layer's parent to a given NFLayer
  @memberof NFLayer
  @param {NFLayer | AVLayer | null} newParent - the new parent NFLayer or AVLayer for this layer. Null to set no parent
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer or null
  ###
  setParent: (newParent) ->
    if NFLayer.isAVLayer(newParent)
      @layer.parent = newParent
    else if newParent instanceof NFLayer
      @layer.parent = newParent?.layer
    else
      throw "Can only set an NFLayer's parent to another NFLayer or AVLayer" unless newParent instanceof NFLayer
    return @

  ###*
  Moves this layer's index to immediately before the provided target layer
  @memberof NFLayer
  @param {NFLayer} targetLayer - the layer to move this layer before
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer
  ###
  moveBefore: (targetLayer) ->
    throw "Can't run moveBefore on a non-NFLayer" unless targetLayer instanceof NFLayer
    @layer.moveBefore targetLayer.layer
    return @

  ###*
  Moves this layer's index to immediately after the provided target layer
  @memberof NFLayer
  @param {NFLayer} targetLayer - the layer to move this layer after
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer
  ###
  moveAfter: (targetLayer) ->
    throw "Can't run moveAfter on a non-NFLayer" unless targetLayer instanceof NFLayer
    @layer.moveAfter targetLayer.layer
    return @

# Class Methods
NFLayer = Object.assign NFLayer,
  # Returns a new Specialized NFLayer from an AVLayer
  getSpecializedLayerFromAVLayer: (theLayer) ->
    throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer" unless NFLayer.isAVLayer theLayer
    tmpLayer = new NFLayer theLayer
    return tmpLayer.getSpecializedLayer()
  # Returns true if the given AVLayer is a comp layer
  isCompLayer: (theLayer) ->
    return NFLayer.isAVLayer(theLayer) and theLayer.source instanceof CompItem

  ###*
  Returns whether or not a given Layer is an AVLayer or one of its subclasses. This is because Layer objects don't play nice with `instanceof`
  @memberof NFLayer
  @param {Layer} layer - the Layer to check
  @returns {boolean} the result
  ###
  isAVLayer: (layer) ->
    return layer instanceof AVLayer or layer instanceof ShapeLayer or layer instanceof TextLayer
