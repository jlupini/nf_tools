###*
Creates a new NFReferencePageLayer from a given AVLayer
@class NFReferencePageLayer
@classdesc Subclass of {@link NFPageLayer} for a reference page layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFPageLayer
@throws Will throw an error if not given an AVLayer with a source (aka a comp layer)
###
class NFReferencePageLayer extends NFPageLayer
  constructor: (layer) ->
    NFPageLayer.call(this, layer)
    @
  # MARK: Instance Methods
  toString: ->
    return "NFReferencePageLayer: '#{@$.name}'"

  ###*
  Provides an object to be easily converted to JSON for the CEP Panel
  @memberof NFReferencePageLayer
  @returns {Object} the CEP Panel object
  ###
  simplify: ->
    obj = NFPageLayer.prototype.simplify.call @
    obj.class = "NFReferencePageLayer"
    return obj

  ###*
  returns the pagelayer being referenced at the given (default current) time
  @memberof NFReferencePageLayer
  @returns {NFPageLayer} the referenced page layer or null
  ###
  referencedPageLayer: (time) ->
    time = if time? then time else @containingComp().getTime()

    # Find the target page for this ref page
    searchString = @getPageBaseName()
    targetPageLayers = @containingComp().searchLayers searchString
    targetPageLayer = null
    targetPageLayers.forEach (layer) =>
      targetPageLayer = layer if layer.isActiveAtTime time

    return targetPageLayer

  ###*
  returns the source layer being this ref layer shows at the given (default current) time
  @memberof NFReferencePageLayer
  @returns {NFLayer} the source layer or null
  ###
  referencedSourceLayer: ->
    # Source Layer Name...
    re = /\<(.*?)\>/
    searchString = re.exec(@getName())[1]

    targetPageLayer = @getPageComp().layerWithName searchString

    return targetPageLayer

  ###*
  Sets the marker-based animation to show the layer
  @memberof NFReferencePageLayer
  @returns {NFReferencePageLayer} self
  ###
  animateIn: (duration = 1) ->
    @addInOutMarkersForProperty
      property: @transform "Scale"
      startEquation: EasingEquation.quart.out
      startValue: [0, 0, 0]
      length: duration
    @addInOutMarkersForProperty
      property: @transform "Opacity"
      startEquation: EasingEquation.quart.out
      startValue: 0
      length: duration

    @

  ###*
  Sets the marker-based animation to hide the layer
  @memberof NFReferencePageLayer
  @returns {NFReferencePageLayer} self
  ###
  animateOut: (duration = 1) ->
    @addInOutMarkersForProperty
      property: @transform "Scale"
      endEquation: EasingEquation.quart.in
      endValue: [0, 0, 0]
      length: duration
    @addInOutMarkersForProperty
      property: @transform "Opacity"
      endEquation: EasingEquation.quart.in
      endValue: 0
      length: duration

    @

  ###*
  Returns the flightpath layer for this layer
  @memberof NFReferencePageLayer
  @returns {NFLayer} the flightpath layer
  ###
  flightPath: ->
    fpLayer = null
    matchLayers = @containingComp().searchLayers @getName()
    matchLayers.forEach (layer) =>
      fpLayer = layer if layer.getName().indexOf "FlightPath" >= 0
    return fpLayer

  ###*
  Expands the ref layer to show another given highlight layer
  @memberof NFReferencePageLayer
  @param {Object} model
  @param {NFHighlightLayer} model.layer
  @returns {NFReferencePageLayer} self
  ###
  expandTo: (model) ->
    target = model.layer

    # Frame up that baby
    activeHighlightRect = @referencedSourceLayer().sourceRect()
    expandedRect = target.sourceRect().combineWith activeHighlightRect

    currTime = @containingComp().getTime()
    @containingComp().setTime(currTime) unless @containingComp().getTime() is currTime
    keyIn = currTime - model.duration/2
    keyOut = currTime + model.duration/2

    scaleProp = @transform("Scale")
    newScale = @getAbsoluteScaleToFrameUp
      rect: @relativeRect expandedRect
      fillPercentage: 75
      maxScale: 100

    scaleProp.setValuesAtTimes [keyIn, keyOut], [scaleProp.valueAtTime(currTime, yes), [newScale, newScale]]
    scaleProp.easyEaseKeyTimes
      keyTimes: [keyIn, keyOut]

    # Make a mask over the text
    highlightThickness = target.highlighterEffect().property("Thickness").value
    paddedExpandedRect =
      left: expandedRect.left
      top: expandedRect.top - (highlightThickness/2)
      width: expandedRect.width
      height: expandedRect.height + highlightThickness

    mask = @mask().property(1)
    mask.maskShape.setValuesAtTimes [keyIn, keyOut], [mask.maskShape.valueAtTime(currTime, yes), NFTools.shapeFromRect(paddedExpandedRect)]
    mask.maskShape.easyEaseKeyTimes
      keyTimes: [keyIn, keyOut]

    @

# Class Methods
NFReferencePageLayer = Object.assign NFReferencePageLayer,

  ###*
  Returns true if the given AVLayer is a Reference Page Layer
  @memberof NFReferencePageLayer
  @param {AVLayer} theLayer - the layer to test
  @returns {boolean} if the given layer is a page layer
  ###
  isReferencePageLayer: (theLayer) ->
    return NFLayer.isCompLayer(theLayer) and theLayer.source.name.indexOf("NFPage") >= 0 and theLayer.name.indexOf('[ref]') >= 0
