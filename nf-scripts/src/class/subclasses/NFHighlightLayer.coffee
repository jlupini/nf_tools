###*
Creates a new NFHighlightLayer from a given AVLayer
@class NFHighlightLayer
@classdesc Subclass of {@link NFLayer} for a highlight layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a highlight
###
class NFHighlightLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    unless NFHighlightLayer.isHighlightLayer(@$)
      throw new Error "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect"
    @
  toString: ->
    return "NFHighlightLayer: '#{@$.name}'"

  ###*
  Provides an object to be easily converted to JSON for the CEP Panel
  @memberof NFHighlightLayer
  @returns {Object} the CEP Panel object
  ###
  simplify: ->
    obj = NFLayer.prototype.simplify.call @
    obj.class = "NFHighlightLayer"
    return obj

  ###*
  Returns whether this highlight is bubbled up or not
  @memberof NFHighlightLayer
  @returns {boolean} if the highlight is bubbled up
  ###
  isBubbled: ->
    return @highlighterEffect().property("Spacing").expressionEnabled

  ###*
  Returns whether this highlight is has a broken expression
  @memberof NFHighlightLayer
  @returns {boolean} if the highlight has a broken expression
  ###
  isBroken: ->
    return @highlighterEffect().property("Spacing").expressionError isnt ""

  ###*
  Returns the connected NFHighlightControlLayer if it exists
  @memberof NFHighlightLayer
  @returns {NFHighlightControlLayer | null} the control layer or null
  ###
  getControlLayer: ->

    argumentOfPropertyFromExpression = (property, expression) ->
      propertyIndex = expression.indexOf(property + "(")
      if propertyIndex > 0
      	# The +1 is to account for the Open bracket
        startIdx = propertyIndex + property.length + 1
        result = expression.slice(startIdx)
        endIdx = result.indexOf(")")
        result = result.substr(0, endIdx)
        return result.stripQuotes()
      return null

    if @isBubbled()
      expression = @highlighterEffect().property("Spacing").expression
      compName = argumentOfPropertyFromExpression("comp", expression)
      layerName = argumentOfPropertyFromExpression("layer", expression)
      comp = new NFComp NFProject.findItem(compName)

      # This is to deal with the possibility that there are two layers with the
      # same name in the comp...
      if comp?
        possibleLayers = comp.layersWithName layerName
        if possibleLayers.isEmpty()
          return null
        else
          return possibleLayers.get 0

  ###*
  Returns an array of Spotlight mask Properties that reference this layer
  @memberof NFHighlightLayer
  @returns {Property[]} a potentially empty array of spotlight
  mask Property objects
  ###
  getSpotlightMasks: ->
    folder = NFProject.findItem "Parts"
    items = NFProject.searchItems("Part", folder)
    spotlightLayers = new NFLayerCollection

    for item in items
      part = new NFPartComp item
      spotlightLayer = part.layerWithName NFSpotlightLayer.nameForPDFNumber(@getPDFNumber())
      spotlightLayers.add spotlightLayer if spotlightLayer?

    if spotlightLayers.isEmpty()
      return []
    else
      targetMasks = []
      spotlightLayers.forEach (spotlight) =>
        possibleMask = spotlight.mask @getName()
        targetMasks.push possibleMask if possibleMask?
      return targetMasks

  ###*
  Returns the NFPageComp this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPageComp} the containing page item for the highlight
  ###
  getPageComp: ->
    return new NFPageComp(@$.containingComp)

  ###*
  Returns the NFPDF this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPDF} the PDF
  ###
  getPDF: ->
    return NFPDF.fromPDFNumber @getPDFNumber()

  ###*
  Returns the PDF number for the containing comp
  @memberof NFHighlightLayer
  @returns {String} the PDF number
  ###
  getPDFNumber: ->
    return @containingComp().getPDFNumber()

  ###*
  Returns the AV Highlighter effect
  @memberof NFHighlightLayer
  @returns {Property} the AV Highlighter Property for this highlight
  ###
  highlighterEffect: ->
    return @$.Effects.property("AV_Highlighter")


  ###*
  Returns true if the highlight can be bubbled up. In other words, true if not currently bubbled up
  unless it's also broken
  @memberof NFHighlightLayer
  @returns {boolean} whether the highlight can be bubbled up
  ###
  canBubbleUp: ->
    return (not @isBubbled()) or @isBroken()

  ###*
  Fixes the expression after initting if the page layer name changed and there was already an existing expression
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
  ###
  fixExpressionAfterInit: ->
    if @isBubbled()
      for property in NFHighlightLayer.highlighterProperties
        expression = @highlighterEffect().property(property).expression
        @highlighterEffect().property(property).expression = expression.replace(new RegExp(" NFPage", 'g'), " [+]")
    @

  ###*
  Fixes the expression after initting if the page layer name changed and there was already an existing expression
  @memberof NFHighlightLayer
  @param {String} diffLetter - the letter to add
  @returns {NFHighlightLayer} self
  ###
  fixExpressionWithDiffLetter: (diffLetter) ->
    if @isBubbled()
      for property in NFHighlightLayer.highlighterProperties
        expression = @highlighterEffect().property(property).expression
        replString = " [+] (#{diffLetter})\""
        @highlighterEffect().property(property).expression = expression.replace(" [+]\"", replString).replace(" [+]\"", replString)
    @

  ###*
  Attempt to clear expresssion errors
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
  ###
  resetExpressionErrors: ->
    if @isBubbled()
      for property in NFHighlightLayer.highlighterProperties
        expression = @highlighterEffect().property(property).expression
        @highlighterEffect().property(property).expression = ""
        @highlighterEffect().property(property).expression = expression
    @

  ###*
  Disconnects bubbleups in this highlight layer
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
  ###
  disconnect: ->
    # Remove the control layer if it exists
    @getControlLayer()?.remove()

    # Remove any referencing spotlight masks if they exist
    masks = @getSpotlightMasks()
    mask.remove() for mask in masks

    effect = @highlighterEffect()
    propertyCount = effect?.numProperties
    for i in [1..propertyCount]
      property = effect.property(i)
      property.expression = ""

    @

NFHighlightLayer = Object.assign NFHighlightLayer,

  ###*
  Returns whether or not the given AVLayer is a valid Highlight Layer
  @memberof NFHighlightLayer
  @returns {boolean} whether the AV layer is a valid highlight layer
  ###
  isHighlightLayer: (theLayer) ->
    return theLayer instanceof ShapeLayer and theLayer.Effects.numProperties > 0 and theLayer.Effects.property(1)?.matchName is "AV_Highlighter"

  ###*
  Colors in the AV Highlighter Dropdown
  @memberof NFHighlightLayer
  ###
  COLOR:
    YELLOW:
      str: "Yellow"
      idx: 1
    BLUE:
      str: "Blue"
      idx: 2
    PURPLE:
      str: "Purple"
      idx: 3
    GREEN:
      str: "Green"
      idx: 4
    PINK:
      str: "Pink"
      idx: 5
    ORANGE:
      str: "Orange"
      idx: 6
    RED:
      str: "Red"
      idx: 7

  ###*
  Properties in the AV Highlighter effect
  @memberof NFHighlightLayer
  ###
  highlighterProperties: [
    'Spacing'
    'Thickness'
    'Start Offset'
    'Completion'
    'Offset'
    'Opacity'
    'Highlight Colour'
    'End Offset'
  ]
