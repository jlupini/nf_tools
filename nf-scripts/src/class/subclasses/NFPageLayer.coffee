###*
Creates a new NFPageLayer from a given AVLayer
@class NFPageLayer
@classdesc Subclass of {@link NFLayer} for a page layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a source (aka a comp layer)
###
class NFPageLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    throw "Cannot create an NFPageLayer from a layer without a source" unless layer.source?
    @pageItem = new NFPageItem layer.source
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFPageLayer: '#{@layer.name}'"

  ###*
  Returns a connected paper parent layer. Not to be confused with {@link NFPageLayer#findPaperParentLayer} which will return a non-connected one
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
  ###
  getPaperParentLayer: ->
    if @layer.parent?
      return new NFPaperParentLayer(@layer.parent)
    else
      return null

  ###*
  Returns the paperParentLayer for this layer, if it exists, REGARDLESS OF WHETHER ITS CONNECTED. Not to be confused with {@link NFPageLayer#getPaperParentLayer}
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
  ###
  findPaperParentLayer: ->
    paperParent = @getPaperParentLayer()
    unless paperParent?
      paperParent = @containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(@))
    return paperParent

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
# Class Methods
NFPageLayer = Object.assign NFPageLayer,
  # Returns true if the given AVLayer is a Page Layer
  isPageLayer: (theLayer) ->
    return NFLayer.isCompLayer(theLayer) and theLayer.source.name.indexOf("NFPage") >= 0
