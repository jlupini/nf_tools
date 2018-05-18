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
  effects: ->
    return @layer.Effects
  getEffectWithName: (effectName) ->
    return @layer.Effects.property(effectName)

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
  Sets the layer's parent to the zoomer if this layer is in an NFPartComp
  @memberof NFLayer
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer or null
  ###
  setZoomer: ->
    zoomer = @containingComp().getZoomer()
    @setParent zoomer if zoomer?
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

  ###*
  Moves this layer's index to immediately after the provided target layer
  @memberof NFLayer
  @returns {Property} Marker property
  ###
  markers: ->
    return @layer.property("Marker")

  ###*
  Sets the given property's expression and adds In and Out markers (if not already on the layer) for in and out transitions. Overrides previous expressions
  @memberof NFLayer
  @returns {NFLayer} self
  @param {Object} options - an object with the chosen equations and in/out values. Equations found in easingEquations.coffee
  @param {Property} options.property - the property to use for the in/outs. required
  @param {float} options.length - the length of the transition. Default 2.0
  @param {string} options.startEquation - the equation to use for the in transition of the property.
  @param {string} options.endEquation - the equation to use for the out transition of the property.
  @param {any | Array} options.startValue - the value for this property at its inPoint. If the property is multidimensional, this should be an array of that many dimensions. Can also pass a slider property.
  @param {any | Array} options.endValue - the value for this property at its outPoint. If the property is multidimensional, this should be an array of that many dimensions. Can also pass a slider property.
  @throws Throws error if not given at least a start or end equation and value
  @throws Throws error if the start or end values given are the wrong number of dimensions for this property
  ###
  addInOutMarkersForProperty: (options) ->
    throw "Invalid property" unless options.property? and options.property instanceof Property
    unless (options.startEquation? and options.startValue?) or (options.endEquation? and options.endValue?)
      throw "Can't run makeEasedInOutFromMarkers() without at least a start or end equation and value"

    # Make sure the given vales are the right number of dimensions
    shouldFail = no
    if options.property.value instanceof Array
      if options.startValue?
        unless options.startValue instanceof Array and options.startValue.length is options.property.value.length
          shouldFail = yes
      if options.endValue?
        unless options.endValue instanceof Array and options.endValue.length is options.property.value.length
          shouldFail = yes
    else
      shouldFail = yes if options.startValue? and options.startValue instanceof Array
      shouldFail = yes if options.endValue? and options.endValue instanceof Array
    throw "Given start or end value type doesn't match property value" if shouldFail

    options.length ?= 2.0
    inComm = "NF In"
    outComm = "NF Out"

    # Find and/or add markers
    markers = @markers()
    inMarker = outMarker = null
    try
      inMarker = markers.keyValue(inComm)
    catch e
    try
      outMarker = markers.keyValue(outComm)
    catch e

    if options.startValue?
      markers.setValueAtTime @layer.inPoint + options.length, new MarkerValue(inComm) unless inMarker?
    else if inMarker?
      @layer.removeMarker(inComm)

    if options.endValue?
      markers.setValueAtTime @layer.outPoint - options.length, new MarkerValue(outComm) unless outMarker?
    else if outMarker?
      @layer.removeMarker(outComm)

    # Create and add the expression to the property
    fileText = NF.Util.readFile "expressions/marker-animation-main-function.js"
    fileText = NF.Util.fixLineBreaks(fileText)
    expression = fileText

    if options.startEquation?
      expression = "var startEquationString = '#{options.startEquation}';\n" + expression
      if options.startValue instanceof Array
        inValueString = "["
        for idx in [0..options.startValue.length-1]
          element = options.startValue[idx]
          if element instanceof Property
            inValueString += options.startValue[idx].expressionStringForValue()
          else
            inValueString += options.startValue[idx]
          inValueString += "," if idx < options.startValue.length-1
        inValueString += "]"
      else if options.startValue instanceof Property
        inValueString = options.startValue.expressionStringForValue()
      else
        inValueString = options.startValue
      expression = "var inValue = #{inValueString};\n" + expression

    if options.endEquation?
      expression = "var endEquationString = '#{options.endEquation}';\n" + expression
      if options.endValue instanceof Array
        outValueString = "["
        for idx in [0..options.endValue.length-1]
          element = options.endValue[idx]
          if element instanceof Property
            outValueString += options.endValue[idx].expressionStringForValue()
          else
            outValueString += options.endValue[idx]
          outValueString += "," if idx < options.endValue.length-1
        outValueString += "]"
      else if options.endValue instanceof Property
        outValueString = options.endValue.expressionStringForValue()
      else
        outValueString = options.endValue
      expression = "var outValue = #{outValueString};\n" + expression

    throw "Can't set expression on this property" unless options.property.canSetExpression
    options.property.expression = expression

    @

  ###*
  Creates and returns a slider effect on the layer
  @memberof NFLayer
  @param {string} name - the slider name
  @param {float} value - the initial value of the slider
  @returns {Property} the slider property
  ###
  addSlider: (name, value) ->
    slider = @effects().addProperty("ADBE Slider Control")
    slider.slider.setValue(value)
    slider.name = name
    return slider

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
