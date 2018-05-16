###*
Creates a new NFPaperParentLayer from a given null AVLayer
@class NFPaperParentLayer
@classdesc Subclass of {@link NFLayer} for the parent null layer of a group of page layers from the same PDF
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer that's a null layer or an NFLayer with a similar layer property
###
class NFPaperParentLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    throw "Can only create a NFPaperParentLayer from a null layer" unless @layer.nullLayer
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFPaperParentLayer: '#{@layer.name}'"

  ###*
  Sets the name of this paper parent layer to the correct name.
  @memberof NFPaperParentLayer
  @returns {NFPaperParentLayer} self
  @throws Throws error if there are no child layers
  ###
  setName: ->
    children = @getChildren()
    throw "Cannot set paper parent layer name because it has no child layers" if children.isEmpty()
    newName = 'PDF ' + children.layers[0].getPDFNumber()
    @layer.name = newName
    return @

# Class Methods
NFPaperParentLayer = Object.assign NFPaperParentLayer,
  # Tests an AV layer to see if it can be a paper parent Layer
  isPaperParentLayer: (layer) ->
    return layer.nullLayer and layer.name.indexOf 'PDF' >= 0
  # Returns the name string for the paper parent for a given layer
  getPaperParentNameForPageLayer: (pageLayer) ->

  # Returns the paperParentLayer for a given page layer
  getPaperParentLayerForPageLayers: (pageLayer) ->
    paperParent = pageLayer.getPaperParentLayer()
    unless paperParent?
      paperParent = pageLayer.containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(pageLayer))
    return paperParent
