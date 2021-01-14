###*
Creates a new NFLayer from a given AVLayer
@class NFLayer
@classdesc NF Wrapper object for an AVLayer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer (in which case we use it's AVLayer)
@property {AVLayer} $ - the wrapped AVLayer
@throws Will throw an error if not given a valid AVLayer object
###
class NFLayer extends NFObject
  constructor: (layer) ->
    NFObject.call(this)
    if layer.isAVLayer()
      @$ = layer
    else if layer instanceof NFLayer
      @$  = layer.$
    else
      throw new Error "Can only create a new NFLayer with a valid AVLayer or NFLayer object"
    @

  ###*
  Provides an object to be easily converted to JSON for the CEP Panel
  @memberof NFLayer
  @returns {Object} the CEP Panel object
  ###
  simplify: ->
    obj =
      class: "NFLayer"
      name: @getName()
      index: @index()
      isActiveNow: @isActiveAtTime()
      inPoint: @$.inPoint
      outPoint: @$.outPoint
      containingComp: @containingComp().simplify()
    return obj

  ###*
  Returns the aeq.Layer object
  @memberof NFLayer
  @returns {aeq.Layer} the aequery layer
  ###
  aeq: ->
    return new aeq.Layer @$

  # MARK: Instance Methods
  toString: ->
    return "NFLayer: '#{@$.name}'"

  ###*
  Returns the name of the layer
  @memberof NFLayer
  @returns {string} the layer name
  ###
  getName: ->
    return @$.name

  ###*
  Sets the name of the layer
  @memberof NFLayer
  @param {String} newName - the new layer name
  @returns {NFLayer} self
  ###
  setName: (newName) ->
    @$.name = newName
    return @

  ###*
  Sets the shy state of the layer
  @memberof NFLayer
  @param {boolean} state - the new layer shy state
  @returns {NFLayer} self
  ###
  setShy: (state) ->
    @$.shy = state
    return @

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
    return @$.nullLayer

  ###*
  Checks if this layer is active
  @memberof NFLayer
  @returns {boolean} if this is an active layer
  ###
  isActive: ->
    return @$.active

  ###*
  Checks if this layer is active
  @memberof NFLayer
  @param {float} [time] - the time to check at
  @returns {boolean} if this is an active layer, null if the time is < 0
  ###
  isActiveAtTime: (time) ->
    currentTime = @getCompTime()
    time = time ? currentTime
    if time >= 0
      @setCompTime time
      isActive = @isActive()
      @setCompTime currentTime
      return isActive
    else return null

  ###*
  Checks if this layer is both active and is on screen (rect is partially within comp bounds)
  @memberof NFLayer
  @param {float} [time] = the time to check at
  @returns {boolean} if this is an on screen and active layer
  ###
  isOnScreen: (time) ->
    return no unless @isActive()
    currentTime = @getCompTime()
    time = time ? currentTime
    sourceRect = @sourceRect time
    @setCompTime currentTime
    return sourceRect.intersectsWith @containingComp().getRect()

  ###*
  Shortcut for this.containingComp().getTime()
  @memberof NFLayer
  @returns {float} the containing comp's time
  ###
  getCompTime: ->
    return @containingComp().getTime()

  ###*
  Shortcut for this.containingComp().setTime(time)
  @memberof NFLayer
  @param {float} time - the time to set it top
  @returns {NFLayer} self
  ###
  setCompTime: (time) ->
    @containingComp().setTime time
    return @

  isHighlightLayer: ->
    return NFHighlightLayer.isHighlightLayer(@$)
  isPaperParentLayer: ->
    return NFPaperParentLayer.isPaperParentLayer(@$)
  isHighlightControlLayer: ->
    return NFHighlightControlLayer.isHighlightControlLayer(@$)
  isSpotlightLayer: ->
    return NFSpotlightLayer.isSpotlightLayer(@$)
  isCitationLayer: ->
    return NFCitationLayer.isCitationLayer(@$)
  isPageLayer: ->
    return NFPageLayer.isPageLayer(@$)
  isGaussyLayer: ->
    return NFGaussyLayer.isGaussyLayer(@$)
  isEmphasisLayer: ->
    return NFEmphasisLayer.isEmphasisLayer(@$)
  isShapeLayer: ->
    return NFShapeLayer.isShapeLayer(@$)
  isReferencePageLayer: ->
    return NFReferencePageLayer.isReferencePageLayer(@$)

  ###*
  Returns a new layer of a specialized type for the contents of this layer
  @memberof NFLayer
  @returns {NFPageLayer | NFHighlightLayer | NFPaperParentLayer | NFLayer} the specialized layer or self if no specialized layer options
  ###
  getSpecializedLayer: ->
    # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers\
    if @isReferencePageLayer()
      return new NFReferencePageLayer @$
    else if @isPageLayer()
      return new NFPageLayer @$
    else if @isHighlightLayer()
      return new NFHighlightLayer @$
    else if @isPaperParentLayer()
      return new NFPaperParentLayer @$
    else if @isHighlightControlLayer()
      return new NFHighlightControlLayer @$
    else if @isSpotlightLayer()
      return new NFSpotlightLayer @$
    else if @isCitationLayer()
      return new NFCitationLayer @$
    else if @isGaussyLayer()
      return new NFGaussyLayer @$
    else if @isEmphasisLayer()
      return new NFEmphasisLayer @$
    else if @isShapeLayer()
      return new NFShapeLayer @$
    else
      return @

  ###*
  Shorthand for the layer's index
  @memberof NFLayer
  @returns {int} the layer's index
  ###
  index: ->
    return @$.index

  ###*
  Returns true if the layer has a null parent
  @memberof NFLayer
  @returns {boolean} Whether this layer has a parent which is a null layer
  ###
  hasNullParent: ->
    if @$.parent?
      return @$.parent.nullLayer
    return false

  ###*
  Returns the effects Property for the layer
  @memberof NFLayer
  @returns {Property} the effects property
  ###
  effects: ->
    return @$.Effects

  ###*
  Returns the mask Property for the layer, or a given mask if provided
  @memberof NFLayer
  @param {String} [maskName] - the mask name
  @returns {Property | null} the mask property or null if not found
  ###
  mask: (maskName) ->
    if maskName?
      mask = @$.mask maskName
      if mask?
        return mask
      else
        return null
    else
      return @$.mask

  ###*
  Returns the transform Property for the layer. Can optionally specify a root
  transform property like "Position" or "Scale" and return that property instead
  @memberof NFLayer
  @param {String} [prop] - the optional name of a root transform property to return.
  @returns {Property} the transform property
  ###
  transform: (prop) ->
    if prop?
      return @$.transform.property(prop)
    else
      return @$.transform

  ###*
  Returns the effect property with a given name, only one level under Effects.
  Uses `Effects.property(effectName)``
  @memberof NFLayer
  @param {string} effectName - the name of the effect to look for
  @returns {Property | null} the property or null if not found
  ###
  effect: (effectName) ->
    return @$.Effects.property(effectName)

  ###*
  Returns the root property on the layer with the given name. Saves you a `.layer`
  when accessing in other classes
  @memberof NFLayer
  @param {string} propName - the name of the property to return
  @returns {Property | null} the property or null if not found
  ###
  property: (propName) ->
    return @$.property(propName)

  ###*
  Checks to see if a given NFLayer's layer is the same as this one's
  For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  @memberof NFLayer
  @returns {boolean} Whether both layers are the same layer
  ###
  is: (testLayer) ->
    return no unless testLayer?
    return @$.index == testLayer.$.index and @$.containingComp.id == testLayer.$.containingComp.id

  ###*
  Shorthand for the inverse of #is
  @memberof NFLayer
  @returns {boolean} True if the two layers are not the same
  ###
  isnt: (testLayer) ->
    return not @is testLayer

  ###*
  Returns the containing NFComp
  @memberof NFLayer
  @returns {NFComp} the containing comp
  ###
  containingComp: ->
    return  NFComp.specializedComp @$.containingComp

  ###*
  Fades in using markers
  @memberof NFLayer
  @returns {NFLayer} self
  @param {float} [length=1.0] - the length of the transition
  ###
  fadeIn: (length) ->
    length ?= 1.0
    @addInOutMarkersForProperty
      property: @transform("Opacity")
      startEquation: EasingEquation.linear
      startValue: 0
      length: length
    @

  ###*
  Fades out using markers
  @memberof NFLayer
  @param {float} [length=1.0] - the length of the transition
  @returns {NFLayer} self
  ###
  fadeOut: (length) ->
    length ?= 1.0
    @addInOutMarkersForProperty
      property: @transform("Opacity")
      endEquation: EasingEquation.linear
      endValue: 0
      length: length
    @

  ###*
  Creates a new null parent to this layer, positioned above it. Will override previous parenting.
  @memberof NFLayer
  @param {float[]} [color] - an optional color. If a value is provided here,
  a solid will be made instead of a null. Three numbers from 0-1
  @returns {NFLayer} the new null NFLayer
  ###
  nullify: (color) ->
    if color?
      newNull = @containingComp().addSolid
        color: color
        width: 10
        height: 10
      newNull.$.enabled = no
    else
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
    allLayers = @containingComp().$.layers.toArr()
    childLayers = []

    for theLayer in allLayers
      testLayer = new NFLayer theLayer
      if testLayer.$.parent is @$
        testLayer = testLayer.getSpecializedLayer()
        childLayers.push testLayer
        if recursive
          testLayer.getChildren(yes).forEach (recLayer) =>
            childLayers.push recLayer

    return new NFLayerCollection childLayers

  ###*
  Gets the layer's parent NFLayer, if any
  @memberof NFLayer
  @returns {NFLayer | null} the parent layer, or null if no parent
  ###
  getParent: ->
    return new NFLayer(@$.parent).getSpecializedLayer() if @$.parent?
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
      @$.parent = null
    else if newParent.isAVLayer()
      @$.parent = newParent
    else if newParent instanceof NFLayer
      @$.parent = newParent?.$
    else
      throw new Error "Can only set an NFLayer's parent to another NFLayer or AVLayer"
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
    @$.moveBefore targetLayer.$
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
    @$.moveAfter targetLayer.$
    return @

  ###*
  Returns the marker Property
  @memberof NFLayer
  @returns {Property} Marker property
  ###
  markers: ->
    return @$.property("Marker")

  ###*
  Adds a marker at a given time.
  @memberof NFLayer
  @param {Object} model
  @param {String} model.comment - the marker comment
  @param {float} [model.duration=0] - the duration
  @param {float} model.time - the time to add the marker
  @throw Throws error if marker already exists at given time
  @returns {Property} The marker property
  ###
  addMarker: (model) ->
    unless model?.comment? and model.time?
      throw new Error "Invalid properties for new marker"

    markers = @markers()

    # Check time for existing marker
    if markers.numKeys > 0
      nearestMarkerIdx = markers.nearestKeyIndex model.time
      nearestMarkerTime = markers.keyTime nearestMarkerIdx
      throw new Error "Already marker at this time" if nearestMarkerTime is model.time

    markerValue = new MarkerValue(model.comment)
    markerValue.duration = model.duration if model.duration?
    markers.setValueAtTime model.time, markerValue
    markers

  ###*
  Adds an emphasis layer to this layer
  @memberof NFLayer
  @returns {NFEmphasisLayer} The new emphasis layer
  ###
  addEmphasisLayer: () ->
    emphLayer = @containingComp().addShapeLayer()
    emphLayer.setName NFEmphasisLayer.nameForLayer(@)
    emphLayer.setParent(@).moveBefore(@)
    emphLayer.$.inPoint = @$.inPoint
    emphLayer.$.outPoint = @$.outPoint
    return emphLayer

  ###*
  Returns the layer's absolute scale, which is the scale of the layer if it had
  no parent.
  @memberof NFLayer
  @returns {float} The absolute scale
  ###
  getAbsoluteScale: ->
  	layerParent = @$.parent
  	@$.parent = null
  	absoluteScale = @transform().scale.value
  	@$.parent = layerParent
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
  @param {string} [options.startEquation=EasingEquation.quint.out] - the equation to use for the in
  transition of the property.
  @param {string} [options.endEquation=EasingEquation.quint.in] - the equation to use for the out
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
    options.startEquation ?= EasingEquation.quint.out
    options.endEquation ?= EasingEquation.quint.in

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
    if options.startValue? and not inMarker?
      @addMarker
        time: @$.inPoint + options.length
        comment: inComm
    if options.endValue? and not outMarker?
      @addMarker
        time: @$.outPoint - options.length
        comment: outComm

    # Get our base expression. If there's an existing expression with an in or
    # out value declared, we want to preserve that value UNLESS we were just
    # given a replacement for it
    prevExpression = options.property.expression
    alreadyContainsInValue = prevExpression.indexOf("var inValue") >= 0
    alreadyContainsOutValue = prevExpression.indexOf("var outValue") >= 0

    shouldPreserveInValue = not options.startValue? and alreadyContainsInValue
    shouldPreserveOutValue = not options.endValue? and alreadyContainsOutValue

    if shouldPreserveInValue or shouldPreserveOutValue
      expression = prevExpression
    else
      expression = NFTools.readExpression "marker-animation-main-function"


    # Update and add the expression to the property
    if options.startValue?
      expression = "var startEquationFunc = #{options.startEquation}\n" + expression
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

    if options.endValue?
      expression = "var endEquationFunc = #{options.endEquation}\n" + expression
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
  Removes the NF in and out markers.
  @memberof NFLayer
  @returns {NFLayer} self
  ###
  removeNFMarkers: ->
    inMarkerTime = @getInMarkerTime()
    outMarkerTime = @getOutMarkerTime()
    if inMarkerTime?
      @markers().removeKey @markers().nearestKeyIndex(inMarkerTime)
    if outMarkerTime?
      @markers().removeKey @markers().nearestKeyIndex(outMarkerTime)

    # Remove the expressions
    # FIXME: Make this actually crawl the properties properly instead of just
    #        checking a few possibilities
    props = ["Scale", "Position", "Opacity"]
    for prop in props
      @transform(prop).expression = "" if @transform(prop).expression.indexOf("easeAndWizz()") >= 0
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
    @$.remove()
    return null

  ###*
  Duplicates the current layer immediately above it
  @memberof NFLayer
  @returns {NFLayer} the new layer
  ###
  duplicate: ->
    return NFLayer.getSpecializedLayerFromAVLayer @$.duplicate()

  ###*
  Moves startTime of a layer without moving the inPoint such that the inPoint
  is the given time in the layer's composition
  @memberof NFLayer
  @param {float} time
  @returns {NFLayer} self
  ###
  beginAt: (time) ->
    @$.startTime = @$.inPoint-time
    @$.inPoint = @$.startTime + time
    @

  ###*
  Returns the time in the layer's page comp that this layer ends.
  @memberof NFLayer
  @returns {float} the result
  ###
  internalEndTime: ->
    @$.outPoint - @$.startTime

  ###*
  Returns the time in the layer's page comp that this layer starts.
  @memberof NFLayer
  @returns {float} the result
  ###
  internalStartTime: ->
    @$.inPoint - @$.startTime


  ###*
  Uses a null hack to get the source Rect of the layer in it's containing comp.
  Optional time parameter. WARNING: This method is very likely to cause the time
  of whatever comp you're working with to jump around. It's strongly recommended
  to save and restore the current time of the comp you're working in before
  and after calling this. That happens when you're in a time-sensitive comp
  (like a part comp) and you end up calling this function (even through other)
  functions.
  @memberof NFLayer
  @param {float} [time=Current time] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Rect} the rect object
  ###
  sourceRect: (time) ->
    compTime = @containingComp().getTime()
    time = time ? compTime
    tempNull = @containingComp().addNull()

    expressionBase = "rect = thisComp.layer(#{@index()}).sourceRectAtTime(time);"
    tempNull.transform().position.expression = expressionBase + "thisComp.layer(#{@index()}).toComp([rect.left, rect.top])"
    topLeftPoint = tempNull.transform().position.valueAtTime time, false
    tempNull.transform().position.expression = expressionBase + "thisComp.layer(#{@index()}).toComp([rect.left + rect.width, rect.top + rect.height])"
    bottomRightPoint = tempNull.transform().position.valueAtTime time, false
    tempNull.remove()
    rect = new Rect
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
    newRect = new Rect
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
    tempNull.transform().position.expression = "a = thisComp.layer(#{@$.index}).toComp([#{sourcePoint[0]}, #{sourcePoint[1]}]);\na"

    newPoint = tempNull.transform().position.valueAtTime targetTime, false

    tempNull.remove()
    newPoint

  ###*
  Uses a null hack to get the center point of this layer in it's containing comp
  @memberof NFLayer
  @param {float} [targetTime=Current Time] - the optional time of the
  containing comp to check at. Default is the current time of the containingComp.
  @returns {Point} the resulting Point
  ###
  relativeCenterPoint: (targetTime = null) ->
    sourceRect = @sourceRect(targetTime)
    return sourceRect.centerPoint()

  ###*
  Returns the value to achieve centerAnchorPoint
  @memberof NFLayer
  @param {boolean} [useMasks=yes] whether to look at masks to narrow the size and shape of layer.
  @param {float} [atTime = currentTime] the time to center the anchor point at (in case scale changes)
  @param {boolean} [preExpression = no] whether to look at the value and ignore the calculated expression value
  @returns {Array} the new position and anchor point values
  ###
  getCenterAnchorPointValue: (useMasks = yes, atTime, preExpression = no) ->
    atTime ?= @containingComp().getTime()
    parent = @getParent()
    @setParent null

    if useMasks and @mask().numProperties > 0
      combinedRect = null
      for i in [1..@mask().numProperties]
        mask = @mask().property(i)
        maskRect = NFTools.rectFromShape(mask.property(1).valueAtTime(atTime, preExpression))
        if combinedRect?
          combinedRect = combinedRect.combineWith maskRect
        else
          combinedRect = maskRect

      combinedRelativeRect = @relativeRect combinedRect, atTime
      sourceRect = @sourceRect atTime

      finalRect = sourceRect.rectFromIntersect(combinedRelativeRect)
      centerPoint = finalRect.centerPoint()

    else
      centerPoint = @relativeCenterPoint()

    anchorProp = @transform "Anchor Point"
    positionProp = @transform "Position"
    scaleProp = @transform "Scale"

    oldAnchor = anchorProp.valueAtTime atTime, preExpression
    oldPosition = positionProp.valueAtTime atTime, preExpression

    if scaleProp.value[0] is 0 or scaleProp.value[1] is 0
      throw new Error "Can't center anchor point when scale is 0"

    pDeltaX = (centerPoint[0] - oldPosition[0]) / (scaleProp.value[0]/100)
    pDeltaY = (centerPoint[1] - oldPosition[1]) / (scaleProp.value[1]/100)
    newAnchor = [oldAnchor[0] + pDeltaX, oldAnchor[1] + pDeltaY]

    @setParent parent

    return [centerPoint, newAnchor]

  ###*
  Moves the anchor point of a layer to it's sourceRect's center without changing
  the layer's position in the comp. Optionally, can use masks to make anchor point
  more accurate
  @memberof NFLayer
  @param {boolean} [useMasks=yes] whether to look at masks to narrow the size and shape of layer.
  @param {float} [atTime = currentTime] the time to center the anchor point at (in case scale changes)
  @param {boolean} [preExpression = no] whether to look at the value and ignore the calculated expression value
  @returns {NFLayer} self
  ###
  centerAnchorPoint: (useMasks = yes, atTime, preExpression = no) ->
    targetValues = @getCenterAnchorPointValue useMasks, atTime, preExpression

    parent = @getParent()
    @setParent null

    anchorProp = @transform "Anchor Point"
    positionProp = @transform "Position"

    positionProp.setValue targetValues[0]
    anchorProp.setValue targetValues[1]

    @setParent parent
    @

  ###*
  Moves the anchor point of a layer to a given point without changing
  the layer's position in the comp.
  @memberof NFLayer
  @param {float[]} the point to move the anchor point to, in the COMP space
  @returns {NFLayer} self
  ###
  panBehindTo: (newPoint) ->
    parent = @getParent()
    @setParent null

    anchorProp = @transform "Anchor Point"
    positionProp = @transform "Position"
    scaleProp = @transform "Scale"

    # Get the point in the layer space...
    relAnchorPoint = @relativePoint anchorProp.value

    pDeltaX = (newPoint[0] - relAnchorPoint[0]) / (scaleProp.value[0]/100)
    pDeltaY = (newPoint[1] - relAnchorPoint[1]) / (scaleProp.value[1]/100)

    positionProp.setValue [positionProp.value[0] + pDeltaX, positionProp.value[1] + pDeltaY]
    anchorProp.setValue [anchorProp.value[0] + pDeltaX, anchorProp.value[1] + pDeltaY]

    @setParent parent
    @

  ###*
  Adds a drop shadow to the layer with the given properties
  @memberof NFLayer
  @param {Object} [model=null] data model
  @param {float} [model.opacity=76.5] opacity
  @param {float} [model.direction=152] direction
  @param {float} [model.distance=20] distance
  @param {float} [model.softness=100] softness
  @returns {Property} the drop shadow property
  ###
  addDropShadow: (model) ->
    shadowProp = @effects().addProperty('ADBE Drop Shadow')
    shadowProp.property('Opacity').setValue model?.opacity ? 76.5
    shadowProp.property('Direction').setValue model?.direction ? 152
    shadowProp.property('Distance').setValue model?.distance ? 20
    shadowProp.property('Softness').setValue model?.softness ? 100
    return shadowProp

  ###*
  Animates a set of properties on the layer
  @memberof NFLayer
  @returns {NFLayer} self
  @param {Object} [model=null] data model
  @param {float} model.time
  @param {float} model.duration
  @param {Array} model.properties
  @param {Array} model.values
  ###
  animateProperties: (model) ->
    # model =
    #   time: x
    #   duration: x
    #   properties: []
    #   values: []

    for property, i in model.properties
      beginValue = property.valueAtTime model.time, false
      endValue = model.values[i]

      keyframeTimes = [model.time, model.time + model.duration]
      keyframeValues = [beginValue, endValue]

      property.setValuesAtTimes keyframeTimes, keyframeValues

      property.easyEaseKeyTimes
        keyTimes: keyframeTimes


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
