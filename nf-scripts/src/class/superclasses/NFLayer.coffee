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
    if layer.isAVLayer()
      @layer = layer
    else if layer instanceof NFLayer
      @layer  = layer.layer
    else
      throw "Can only create a new NFLayer with a valid AVLayer or NFLayer object"
    @layer = layer
    @

  # MARK: Instance Methods
  toString: ->
    return "NFLayer: '#{@layer.name}'"

  ###*
  Returns the name of the layer
  @memberof NFLayer
  @returns {string} the layer name
  ###
  getName: ->
    return @layer.name

  ###*
  Checks if this layer is a valid page Layer
  @memberof NFLayer
  @returns {boolean} if this is a valid page layer
  ###
  isPageLayer: ->
    return NFPageLayer.isPageLayer(@layer)

  ###*
  Checks if this layer is an AVLayer and ALWAYS RETURNS FALSE
  @memberof NFLayer
  @returns {boolean} if this is a valid AVLayer... so no.
  ###
  isAVLayer: ->
    return no

  ###*
  Checks if this layer is a null layer
  @memberof NFLayer
  @returns {boolean} if this is a null layer
  ###
  isNullLayer: ->
    return @layer.nullLayer

  ###*
  Checks if this layer is active
  @memberof NFLayer
  @returns {boolean} if this is an active layer
  ###
  isActive: ->
    return @layer.active

  ###*
  Checks if this layer is a valid highlight layer
  @memberof NFLayer
  @returns {boolean} if this is a valid highlight layer
  ###
  isHighlightLayer: ->
    return NFHighlightLayer.isHighlightLayer(@layer)

  ###*
  Checks if this layer is a valid paper parent layer
  @memberof NFLayer
  @returns {boolean} if this is a valid paper parent layer
  ###
  isPaperParentLayer: ->
    return NFPaperParentLayer.isPaperParentLayer(@layer)

  ###*
  Returns a new layer of a specialized type for the contents of this layer
  @memberof NFLayer
  @returns {NFPageLayer | NFHighlightLayer | NFPaperParentLayer | NFLayer} the specialized layer or self if no specialized layer options
  ###
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

  ###*
  Shorthand for the layer's index
  @memberof NFLayer
  @returns {int} the layer's index
  ###
  index: ->
    return @layer.index

  ###*
  Returns true if the layer has a null parent
  @memberof NFLayer
  @returns {boolean} Whether this layer has a parent which is a null layer
  ###
  hasNullParent: ->
    if @layer.parent?
      return @layer.parent.nullLayer
    return false

  ###*
  Returns the effects Property for the layer
  @memberof NFLayer
  @returns {Property} the effects property
  ###
  effects: ->
    return @layer.Effects

  ###*
  Returns the effect property with a given name, only one level under Effects.
  Uses `Effects.property(effectName)``
  @memberof NFLayer
  @param {string} effectName - the name of the effect to look for
  @returns {Property | null} the property or null if not found
  ###
  getEffectWithName: (effectName) ->
    return @layer.Effects.property(effectName)

  ###*
  Returns the root property on the layer with the given name. Saves you a `.layer`
  when accessing in other classes
  @memberof NFLayer
  @param {string} propName - the name of the property to return
  @returns {Property | null} the property or null if not found
  ###
  property: (propName) ->
    return @layer.property(propName)

  ###*
  Checks to see if a given NFLayer's layer is the same as this one's
  For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  @memberof NFLayer
  @returns {boolean} Whether both layers are the same layer
  ###
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
  Returns an NFLayerCollection of child layers of this layer as specialized layers
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
    if newParent.isAVLayer()
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

  ###*
  Class Method: Returns a new Specialized NFLayer from an AVLayer
  @memberof NFLayer
  @param {AVLayer} theLayer - the AVLayer to use
  @returns {NFLayer | NFHighlightLayer | NFPageLayer | NFEmphasisLayer | NFGaussyLayer | NFImageLayer} the specialized layer
  ###
  getSpecializedLayerFromAVLayer: (theLayer) ->
    throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer" unless theLayer.isAVLayer()
    tmpLayer = new NFLayer theLayer
    return tmpLayer.getSpecializedLayer()

  ###*
  Class Method: Returns true if the given AVLayer is a comp layer
  @memberof NFLayer
  @param {AVLayer} theLayer - the AVLayer to check
  @returns {boolean} whether or not the AVLayer is a comp
  ###
  isCompLayer: (theLayer) ->
    return theLayer.isAVLayer() and theLayer.source instanceof CompItem
