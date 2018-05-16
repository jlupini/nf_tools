###
#    NF PAPER PARENT LAYER
#
#    (inherits from NFLayer)
###
NFPaperParentLayer = (layer) ->
  NFLayer.call(this, layer)
  throw "Can only create a NFPaperParentLayer from a null layer" unless @layer.nullLayer
  @
# Instance Methods
NFPaperParentLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFPaperParentLayer: '#{@layer.name}'"
  # Returns an array of child NFLayers
  getChildren: ->
    # Look for all layers in the comp this layer is in whose parents are this layer
    allLayers = @layer.containingComp.layers
    childLayers = []

    i = 1
    while i <= allLayers.length
      testLayer = new NFLayer allLayers[i]

      # If this layer is the parent...
      if testLayer.layer.parent is @layer

        # Convert to page, image or gaussy if it's a specialized layer
        testLayer = testLayer.getSpecializedLayer()
        childLayers.push testLayer
      i++

    return childLayers
# Class Methods
NFPaperParentLayer = Object.assign NFPaperParentLayer,
  # Tests an AV layer to see if it can be a paper parent Layer
  isPaperParentLayer: (layer) ->
    return layer.nullLayer and layer.name.indexOf 'PDF' >= 0
  # Returns the name string for the paper parent for a given layer
  getPaperParentNameForPageLayer: (pageLayer) ->
    return 'PDF ' + pageLayer.getPDFNumber()
  # Returns the paperParentLayer for a given page layer
  getPaperParentLayerForPageLayers: (pageLayer) ->
    paperParent = pageLayer.getPaperParentLayer()
    unless paperParent?
      paperParent = pageLayer.containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(pageLayer))
    return paperParent
  # Creates a new paperParentLayer for a given collection of Page Layers
  newPaperParentLayerForPageLayers: (pageLayers) ->
    throw "Can't create a paper parent layer with no target layers" unless pageLayers? and pageLayers.count() > 0
    throw "Can only create a new paper parent layer from a NFPageLayerCollection" unless pageLayers instanceof NFPageLayerCollection
    throw "Can't create a single paper parent layer for page layers from different PDFs" unless pageLayers.fromSamePDF()
    # FIXME: Pickup in NFLayerCollection.nullify() - this is for NFPageLayerCollection's method connectToParents()
    name  = NFPaperParentLayer.getPaperParentNameForPageLayer pageLayer
