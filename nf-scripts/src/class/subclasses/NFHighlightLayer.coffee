###
#    NF HIGHLIGHT LAYER
#
#    (inherits from NFLayer)
#
###
NFHighlightLayer = (layer) ->
  NFLayer.call(this, layer)
  unless NFHighlightLayer.isHighlightLayer(@layer)
    throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect"
  @updateProperties()
  @
# Instance Methods
NFHighlightLayer:: = Object.assign new NFLayer(),
  # Updates values of all Properties. Run after changing anything that buggers these up
  updateProperties: ->
    @name = @layer.name
    @bubbled = @highlighterEffect().property("Spacing").expressionEnabled
    @broken = @highlighterEffect().property("Spacing").expressionError isnt ""

    # The NFPageLayer this highlight was found in.
    # Should be set by any function that looks inside NFPageLayers for highlights and returns the highlights
    # Is required to bubble up
    @containingPageLayer ?= null
    # The NFPageLayer this highlight is bubbled up to
    @connectedPageLayer = null
    if @bubbled
      expression = @highlighterEffect().property("Spacing").expression
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression)
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression)
      comp = NF.Util.findItem compName
      if comp?
        layer = comp.layer layerName
        @connectedPageLayer = new NFPageLayer(layer) if layer?
  getInfo: ->
    return "NFHighlightLayer: '#{@name}'"
  # Returns the NFPageItem this highlight lives in
  getPageItem: ->
    return new NFPageItem(@layer.containingComp)
  # Returns the AV Highlighter effect
  highlighterEffect: ->
    return @layer.Effects.property("AV_Highlighter")
  # Returns the Bubbled Up AV Highlighter effect on a page layer
  connectedPageLayerHighlighterEffect: ->
    if @connectedPageLayer?
      expression = @highlighterEffect().property("Spacing").expression
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression)
      effect = @connectedPageLayer.getEffectWithName(effectName)
      return effect
    return null
  # Returns true if the highlight can be bubbled up
  canBubbleUp: ->
    return not ((@bubbled and not @broken) or not @containingPageLayer?)
  # Bubbles up highlight to the containingPageLayer
  # Will throw an error if there's no containingPageLayer or if (@bubbled and not @broken)
  bubbleUp: ->
    if @bubbled and not @broken
      throw "Cannot bubble highlight if already connected and not broken. Disconnect first"
    unless @containingPageLayer?
      throw "Cannot bubble highlight without a containingPageLayer"

    targetPageLayerEffects = @containingPageLayer.effects()
    sourceEffect = @highlighterEffect()

    targetHighlighterEffect = targetPageLayerEffects.addProperty('AV_Highlighter')
    targetHighlighterEffect.name = @name

    targetComp = @containingPageLayer.layer.containingComp

    # Iterate through the properties and connect each one
    for highlighterProperty in NF.Util.highlighterProperties
      sourceValue = sourceEffect.property(highlighterProperty).value
      targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue)
      sourceExpression = "var offsetTime = comp(\"#{targetComp.name}\").layer(\"#{@containingPageLayer.layer.name}\").startTime;
                          comp(\"#{targetComp.name}\").layer(\"#{@containingPageLayer.layer.name}\").effect(\"#{@name}\")(\"#{highlighterProperty}\").valueAtTime(time+offsetTime)"
      sourceEffect.property(highlighterProperty).expression = sourceExpression

      @updateProperties()
  # Fixes the expression after initting if the page layer name changed and there was already an existing expression
  fixExpressionAfterInit: ->
    if @bubbled
      for property in NF.Util.highlighterProperties
        expression = @highlighterEffect.property(property).expression
        @highlighterEffect.property(property).expression = expression.replace " NFPage", " [+]"
  # Disconnects bubbleups in this highlight layer
  disconnect: ->
    # Remove the bubbled up AV Highlighter Effect if it exists
    @connectedPageLayerHighlighterEffect()?.remove()
    effect = @highlighterEffect()
    propertyCount = effect?.numProperties
    for i in [1..propertyCount]
      property = effect.property(i)
      property.expression = ""
    @updateProperties()
# Class Methods
NFHighlightLayer = Object.assign NFHighlightLayer,
  # Returns whether or not the given AVLayer is a valid Highlight Layer
  isHighlightLayer: (theLayer) ->
    return theLayer instanceof ShapeLayer and theLayer.Effects.property(1)?.matchName is "AV_Highlighter"
