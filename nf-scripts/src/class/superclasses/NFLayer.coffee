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
      throw new Error "Can only create a new NFLayer with a valid AVLayer or NFLayer object"
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
  Checks if this layer is active
  @memberof NFLayer
  @param {float} time - the time to check at
  @returns {boolean} if this is an active layer
  ###
  isActiveAtTime: (time) ->
    currentTime = @containingComp().getTime()
    @containingComp().setTime time
    isActive = @isActive()
    @containingComp().setTime currentTime
    return isActive

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
  Returns the transform Property for the layer
  @memberof NFLayer
  @returns {Property} the transform property
  ###
  transform: ->
    return @layer.transform

  ###*
  Returns the effect property with a given name, only one level under Effects.
  Uses `Effects.property(effectName)``
  @memberof NFLayer
  @param {string} effectName - the name of the effect to look for
  @returns {Property | null} the property or null if not found
  ###
  effect: (effectName) ->
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
  is: (testLayer) ->
    return no unless testLayer?
    return @layer.index == testLayer.layer.index and @layer.containingComp.id == testLayer.layer.containingComp.id

  ###*
  Returns the containing NFComp
  @memberof NFLayer
  @returns {NFComp} the containing comp
  ###
  containingComp: ->
    return  NFComp.specializedComp @layer.containingComp

  ###*
  Creates a new null parent to this layer, positioned above it. Will override previous parenting.
  @memberof NFLayer
  @returns {NFLayer} the new null NFLayer
  ###
  nullify: ->
    newNull = @containingComp().addNull()
    @setParent newNull
    newNull.moveBefore @
    return newNull

  ###*
  Returns an NFLayerCollection of child layers of this layer as specialized layers
  @memberof NFLayer
  @returns {NFLayerCollection} the collection of child layers
  @param {boolean} [recursive=no] - whether to look recursively (to include)
  children of children.
  ###
  getChildren: (recursive) ->
    # Look for all layers in the comp this layer is in whose parents are this layer
    # NOTE: We're working with AVLayers
    recursive = no unless recursive?
    allLayers = @containingComp().comp.layers.toArr()
    childLayers = []

    for theLayer in allLayers
      testLayer = new NFLayer theLayer
      if testLayer.layer.parent is @layer
        testLayer = testLayer.getSpecializedLayer()
        childLayers.push testLayer
        if recursive
          for recLayer in testLayer.getChildren(yes).layers
            childLayers.push recLayer

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
    if not newParent?
      @layer.parent = null
    else if newParent.isAVLayer()
      @layer.parent = newParent
    else if newParent instanceof NFLayer
      @layer.parent = newParent?.layer
    else
      throw new Error "Can only set an NFLayer's parent to another NFLayer or AVLayer"
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
    throw new Error "Can't run moveBefore on a non-NFLayer" unless targetLayer instanceof NFLayer
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
    throw new Error "Can't run moveAfter on a non-NFLayer" unless targetLayer instanceof NFLayer
    @layer.moveAfter targetLayer.layer
    return @

  ###*
  Returns the marker Property
  @memberof NFLayer
  @returns {Property} Marker property
  ###
  markers: ->
    return @layer.property("Marker")

  ###*
  Returns the layer's absolute scale, which is the scale of the layer if it had
  no parent.
  @memberof NFLayer
  @returns {float} The absolute scale
  ###
  getAbsoluteScale: ->
  	layerParent = @layer.parent
  	@layer.parent = null
  	absoluteScale = @transform().scale.value
  	@layer.parent = layerParent
  	absoluteScale

  ###*
  Sets the given property's expression and adds In and Out markers (if not
  already on the layer) for in and out transitions. Does NOT override existing
  expressions and marker-driven in/outs
  @memberof NFLayer
  @returns {NFLayer} self
  @param {Object} options - an object with the chosen equations and in/out
  values. Equations found in easingEquations.coffee
  @param {Property} options.property - the property to use for the in/outs.
  required
  @param {float} [options.length=2.0] - the length of the transition. Default 2.0
  @param {string} [options.startEquation=NF.Util.easingEquations.out_quint] - the equation to use for the in
  transition of the property.
  @param {string} [options.endEquation=NF.Util.easingEquations.in_quint] - the equation to use for the out
  transition of the property.
  @param {any | Array} [options.startValue] - the value for this property
  at its inPoint. If the property is multidimensional, this should be an
  array of that many dimensions. Can also pass a slider property.
  @param {any | Array} [options.endValue] - the value for this property at
  its outPoint. If the property is multidimensional, this should be an
  array of that many dimensions. Can also pass a slider property.
  @throws Throws error if not given at least a start or end equation and value
  @throws Throws error if the start or end values given are the wrong
  number of dimensions for this property
  ###
  addInOutMarkersForProperty: (options) ->
    # FIXME: Pickup here and find a way to let this method add a new marker for
    # say the out position to an existing in position one...
    throw new Error "Invalid property" unless options.property? and options.property instanceof Property
    throw new Error "Can't set expression on this property" unless options.property.canSetExpression
    unless options.startValue? or options.endValue?
      throw new Error "Can't run makeEasedInOutFromMarkers() without at least a start or end value"

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
    throw new Error "Given start or end value type doesn't match property value" if shouldFail

    options.length ?= 2.0
    options.startEquation ?= NF.Util.easingEquations.out_quint
    options.endEquation ?= NF.Util.easingEquations.in_quint

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

    # Add the in and/or out markers if given a start/end value
    if options.startValue?
      markers.setValueAtTime @layer.inPoint + options.length, new MarkerValue(inComm) unless inMarker?
    if options.endValue?
      markers.setValueAtTime @layer.outPoint - options.length, new MarkerValue(outComm) unless outMarker?

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

    options.property.expression = expression

    @

  ###*
  Returns the time in the layer's containing comp of the in marker on the layer,
  or null if there's no in marker
  @memberof NFLayer
  @returns {float | null} the in time
  ###
  getInMarkerTime: ->
    try
      return @markers().keyTime("NF In")
    return null

  ###*
  Returns the time in the layer's containing comp of the out marker on the
  layer, or null if there's no out marker
  @memberof NFLayer
  @returns {float | null} the in time
  ###
  getOutMarkerTime: ->
    try
      return @markers().keyTime("NF Out")
    return null

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

  ###*
  Removes the layer from its parent comp
  @memberof NFLayer
  @returns {null} null
  ###
  remove: ->
    @layer.remove()
    return null

  ###*
  Moves startTime of a layer without moving the inPoint such that the inPoint
  is the given time in the layer's composition
  @memberof NFLayer
  @returns {NFLayer} self
  ###
  beginAt: (time) ->
    @layer.startTime = @layer.inPoint-time
    @layer.inPoint = @layer.startTime + time
    @

  ###*
  Returns the time in the layer's page comp that this layer ends.
  @memberof NFLayer
  @returns {float} the result
  ###
  internalEndTime: ->
    @layer.outPoint - @layer.startTime

  ###*
  Returns the time in the layer's page comp that this layer starts.
  @memberof NFLayer
  @returns {float} the result
  ###
  internalStartTime: ->
    @layer.inPoint - @layer.startTime

  ###*
  Uses a null hack to get the source Rect of the layer in it's containing comp.
  Optional time parameter
  @memberof NFLayer
  @param {float} [time=Current time] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .hight, .top
  ###
  sourceRect: (time) ->
    compTime = @containingComp().getTime()
    time = time ? compTime
    tempNull = @containingComp().addNull()
    # This line stops the mainComp time from jumping forward.
    # @containingComp().setTime compTime

    expressionBase = "rect = thisComp.layer(#{@index()}).sourceRectAtTime(time);"
    tempNull.transform().position.expression = expressionBase + "thisComp.layer(#{@index()}).toComp([rect.left, rect.top])"
    topLeftPoint = tempNull.transform().position.valueAtTime time, false
    tempNull.transform().position.expression = expressionBase + "thisComp.layer(#{@index()}).toComp([rect.left + rect.width, rect.top + rect.height])"
    bottomRightPoint = tempNull.transform().position.valueAtTime time, false
    tempNull.remove()
    rect =
      left: topLeftPoint[0]
      top: topLeftPoint[1]
      width: bottomRightPoint[0] - topLeftPoint[0]
      height: bottomRightPoint[1] - topLeftPoint[1]

  ###*
  Returns a rect object in this layer's containing comp that matches
  a given rect in this layer
  @memberof NFLayer
  @param {Rect} rect - the rect with .left, .top, .width, and .height values
  @param {float} [targetTime=Current Time] - the optional time of the
  containing comp to check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .height and .top values
  ###
  relativeRect: (rect, targetTime = null) ->
    throw new Error "Missing values on the rect" unless rect.left? and rect.top? and rect.width? and rect.height?
    topLeftPoint = @relativePoint [rect.left, rect.top], targetTime
    bottomRightPoint = @relativePoint [rect.left + rect.width, rect.top + rect.height], targetTime
    newRect =
      left: topLeftPoint[0]
      top: topLeftPoint[1]
      width: bottomRightPoint[0] - topLeftPoint[0]
      height: bottomRightPoint[1] - topLeftPoint[1]

  ###*
  Uses a null hack to get a point in this layer's containing comp that matches
  a given point on this layer
  @memberof NFLayer
  @param {Point} sourcePoint - the point to use
  @param {float} [targetTime=Current Time] - the optional time of the
  containing comp to check at. Default is the current time of the containingComp.
  @returns {Point} the resulting Point
  ###
  relativePoint: (sourcePoint, targetTime = null) ->
    targetTime = targetTime ? @containingComp().getTime()

    tempNull = @containingComp().addNull()
    tempNull.transform().position.expression = "a = thisComp.layer(#{@layer.index}).toComp([#{sourcePoint[0]}, #{sourcePoint[1]}]);\na"

    newPoint = tempNull.transform().position.valueAtTime targetTime, false

    tempNull.remove()
    newPoint

# Class Methods
NFLayer = Object.assign NFLayer,

  ###*
  Class Method: Returns a new Specialized NFLayer from an AVLayer
  @memberof NFLayer
  @param {AVLayer} theLayer - the AVLayer to use
  @returns {NFLayer | NFHighlightLayer | NFPageLayer | NFEmphasisLayer | NFGaussyLayer | NFImageLayer} the specialized layer
  ###
  getSpecializedLayerFromAVLayer: (theLayer) ->
    throw new Error "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer" unless theLayer.isAVLayer()
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
