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
    unless NFHighlightLayer.isHighlightLayer(@layer)
      throw new Error "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect"
    @
  toString: ->
    return "NFHighlightLayer: '#{@layer.name}'"

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
  Returns the connected NFPageLayer if it exists
  @memberof NFHighlightLayer
  @returns {NFPageLayer | null} the connectedPageLayer or null
  ###
  getConnectedPageLayer: ->
    # FIXME: This fucks up if there are two layers with the same name in the comp
    if @isBubbled()
      expression = @highlighterEffect().property("Spacing").expression
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression)
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression)
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression)
      comp = new NFComp NF.Util.findItem(compName)


      # This is to deal with the possibility that there are two layers with the
      # same name in the comp...
      if comp?
        possibleLayers = comp.layersWithName layerName
        if possibleLayers.isEmpty()
          return null
        else if possibleLayers.count() is 1
          return possibleLayers.get 0
        else
          foundLayer = null
          possibleLayers.forEach (theLayer) =>
            foundLayer = theLayer if theLayer.effect(effectName)?
          return foundLayer

  ###*
  Returns the NFPageComp this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPageComp} the containing page item for the highlight
  ###
  getPageComp: ->
    return new NFPageComp(@layer.containingComp)

  ###*
  Returns the NFPDF this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPDF} the PDF
  ###
  getPDF: ->
    return NFPDF.fromPDFNumber @containingComp().getPDFNumber()

  ###*
  Returns the AV Highlighter effect
  @memberof NFHighlightLayer
  @returns {Property} the AV Highlighter Property for this highlight
  ###
  highlighterEffect: ->
    return @layer.Effects.property("AV_Highlighter")

  ###*
  Returns the Bubbled Up AV Highlighter effect on a page layer
  @memberof NFHighlightLayer
  @returns {Property | null} the AV_Highlighter Property on an NFPageLayer if connected, null if not
  ###
  connectedPageLayerHighlighterEffect: ->
    connectedPageLayer = @getConnectedPageLayer()
    if connectedPageLayer?
      expression = @highlighterEffect().property("Spacing").expression
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression)
      effect = connectedPageLayer.effect(effectName)
      return effect
    return null

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
    # Remove the bubbled up AV Highlighter Effect if it exists
    @connectedPageLayerHighlighterEffect()?.remove()
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
