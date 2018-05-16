###
#    NF PAGE LAYER
#
#    (Subclass of NFLayer)
#
###
NFPageLayer = (layer) ->
  NFLayer.call(this, layer)
  throw "Cannot create an NFPageLayer from a layer without a source" unless layer.source?
  @pageItem = new NFPageItem layer.source
  @
# Initialize the prototype as a new instance of the superclass, then add instance methods
# Instance Methods
NFPageLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFPageLayer: '#{@layer.name}'"
  # Returns the paper parent layer. If the parent exists but is not attached, this will not return it.
  getPaperParentLayer: ->
    if @layer.parent?
      return new NFPaperParentLayer(@layer.parent)
    else
      return null
  effects: ->
    return @layer.Effects
  getEffectWithName: (effectName) ->
    return @layer.Effects.property(effectName)
  # Returns NFHighlightLayerCollection of all highlights in this page
  highlights: ->
    return @pageItem.highlights()
  # Returns NFHighlightLayerCollection of all highlights bubbled onto this page layer
  bubbledHighlights: ->
    bubbledHighlights = highlight if highlight.bubbled and highlight.connectedPageLayer.sameLayerAs(@) for highlight in @highlights().layers
    return new NFHighlightLayerCollection(bubbledHighlights)
  # Returns whether or not the page has been initted with the below methods
  isInitted: ->
    return @layer.name.indexOf "[+]"
  # Changes the page name to mark the page layer as initted, and updates bubbled highlights
  markInitted: ->
    unless @isInitted()
      @layer.name.replace " NFPage", " [+]"
      if @bubbledHighlights.count() > 0
        for highlight in @bubbledHighlights.layers
          highlight.fixExpressionAfterInit()
  # Adds the non-transform init properties (dropshadow, motion blur, etc)
  init: ->
    @layer.motionBlur = true
    @setDropShadow()
    @markInitted()
  # Sets the drop shadow for the layer
  setDropShadow: ->
    shadowProp = @effects().property('ADBE Drop Shadow') ? @effects().addProperty('ADBE Drop Shadow')
    shadowProp.property('Opacity').setValue(191.25)
    shadowProp.property('Direction').setValue(0)
    shadowProp.property('Distance').setValue(20)
    shadowProp.property('Softness').setValue(300)
  # Adds the transform init properties (size, position)
  initTransforms: ->
    @setInitSize()
    @setInitPosition()
  # Sets the size of the layer to the Init size. Returns false and doesn't set size if there are existing keyframes
  setInitSize: ->
    return false if @layer.property('Transform').property('Scale').numKeys > 0
    @layer.property('Transform').property('Scale').setValue [50,50,50]
    return true
  # Sets the position of the layer to the Init position. Returns false and doesn't set position if there are existing keyframes
  setInitPosition: ->
    if @layer.property('Transform').property('Position').numKeys > 0
      return false
    else
      layerHeight = @layer.height
      oldPosition = @layer.property('Transform').property('Position').value
      newPosition = oldPosition
      newPosition[1] = layerHeight / 4
      @layer.property('Transform').property('Position').setValue(newPosition)
    return true
  # Returns the PDF number as a String
  getPDFNumber: ->
    @pageItem.getPDFNumber()
  # Returns the page number as a String
  getPageNumber: ->
    @pageItem.getPageNumber()
  # Returns the containing NFPartComp
  containingComp: ->
    return new NFComp @layer.containingComp
# Class Methods
NFPageLayer = Object.assign NFPageLayer,
  # Returns true if the given AVLayer is a Page Layer
  isPageLayer: (theLayer) ->
    return NFLayer.isCompLayer(theLayer) and theLayer.source.name.indexOf("NFPage") >= 0
