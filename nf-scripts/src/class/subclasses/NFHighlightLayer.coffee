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
      throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect"
    @
  getInfo: ->
    return "NFHighlightLayer: '#{@name}'"

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
    if @isBubbled()
      expression = @highlighterEffect().property("Spacing").expression
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression)
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression)
      comp = NF.Util.findItem compName
      if comp?
        layer = comp.layer layerName
        return connectedPageLayer = new NFPageLayer(layer) if layer?
    return connectedPageLayer

  ###*
  Returns the NFPageComp this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPageComp} the containing page item for the highlight
  ###
  getPageComp: ->
    return new NFPageComp(@layer.containingComp)

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
      effect = connectedPageLayer.getEffectWithName(effectName)
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
      for property in NF.Util.highlighterProperties
        expression = @highlighterEffect().property(property).expression
        @highlighterEffect().property(property).expression = expression.replace(new RegExp(" NFPage", 'g'), " [+]")
    @

  ###*
  Attempt to clear expresssion errors
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
  ###
  resetExpressionErrors: ->
    if @isBubbled()
      for property in NF.Util.highlighterProperties
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
    return theLayer instanceof ShapeLayer and theLayer.Effects.property(1)?.matchName is "AV_Highlighter"
