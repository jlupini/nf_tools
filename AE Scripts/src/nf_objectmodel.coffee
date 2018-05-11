NF = app.NF ? {}

###
#    DECLARE CLASSES
###

###
#    NF LAYER
#
###
NF.Models.NFLayer = (layer) ->
  @layer = layer
  @
NF.Models.NFLayer::isPageLayer = ->
  return NF.Models.NFPageLayer.isPageLayer(@layer)
NF.Models.NFLayer::isHighlightLayer = ->
  return NF.Models.NFHighlightLayer.isHighlightLayer(@layer)
NF.Models.NFLayer::getSpecializedLayer = ->
  # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers, and Paper Parent Layers (YES)
  if @isPageLayer()
    return new NF.Models.NFPageLayer @layer
  else if @isHighlightLayer()
    return new NF.Model.NFHighlightLayer @layer
  else
    return @
NF.Models.NFLayer::getInfo = ->
  return "NFLayer: '#{@layer.name}'"
# Returns true if the layer has a null parent
NF.Models.NFLayer::hasNullParent = ->
  if @layer.parent?
    return @layer.parent.nullLayer
  return false
# Class Methods
# Returns true if the given AVLayer is a comp layer
NF.Models.NFLayer.isCompLayer = (theLayer) ->
  return theLayer instanceof AVLayer and theLayer.source instanceof CompItem

###
#    NF PAGE LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFPageLayer = (layer) ->
  NF.Models.NFLayer.call(this, layer)
  throw "Cannot create an NFPageLayer from a layer without a source" unless layer.source?
  @pageItem = new NF.Models.NFPageItem layer.source
  @
NF.Models.NFPageLayer:: = new NF.Models.NFLayer()
NF.Models.NFPageLayer::getInfo = ->
  return "NFPageLayer: '#{@layer.name}'"
NF.Models.NFPageLayer::getEffectWithName = (effectName) ->
  return @layer.Effects.property(effectName)
# Returns NFHighlightLayerCollection of all highlights in this page
NF.Models.NFPageLayer::highlights = ->
  return @pageItem.highlights()

# Class Methods
# Returns true if the given AVLayer is a Page Layer
NF.Models.NFPageLayer.isPageLayer = (theLayer) ->
  return NF.Models.NFLayer.isCompLayer(theLayer) and theLayer.source.name.indexOf("NFPage") >= 0

###
#    NF IMAGE LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFImageLayer = (layer) ->
  NF.Models.NFLayer.call(this, layer)
  @
NF.Models.NFImageLayer:: = new NF.Models.NFLayer()
NF.Models.NFImageLayer::getInfo = ->
  return "NFImageLayer: '#{@layer.name}'"


###
#    NF GAUSSY LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFGaussyLayer = (layer) ->
  NF.Models.NFLayer.call(this, layer)
  @
NF.Models.NFGaussyLayer:: = new NF.Models.NFLayer()
NF.Models.NFGaussyLayer::getInfo = ->
  return "NFGaussyLayer: '#{@layer.name}'"


###
#    NF EMPHASIS LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFEmphasisLayer = (layer) ->
  NF.Models.NFLayer.call(this, layer)
  @
NF.Models.NFEmphasisLayer:: = new NF.Models.NFLayer()
NF.Models.NFEmphasisLayer::getInfo = ->
  return "NFEmphasisLayer: '#{@layer.name}'"


###
#    NF HIGHLIGHT LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFHighlightLayer = (layer) ->
  NF.Models.NFLayer.call(this, layer)
  unless NF.Models.NFHighlightLayer.isHighlightLayer(@layer)
    throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect"
  @name = @layer.name
  @bubbled = @highlighterEffect().property("Spacing").expressionEnabled
  @broken = @highlighterEffect().property("Spacing").expressionError isnt ""
  @containingPageLayer = null
  @
NF.Models.NFHighlightLayer:: = new NF.Models.NFLayer()
NF.Models.NFHighlightLayer::getInfo = ->
  return "NFHighlightLayer: '#{@name}'"
# Returns the AV Highlighter effect
NF.Models.NFHighlightLayer::highlighterEffect = ->
  return @layer.Effects.property("AV_Highlighter")
# Returns the NFPageLayer that this highlight is bubbled up to
NF.Models.NFHighlightLayer::connectedPageLayer = ->
  if @bubbled
    expression = @highlighterEffect().property("Spacing").expression
    compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression)
    layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression)
    comp = NF.Util.findItem compName
    if comp?
      layer = comp.layer layerName
      return new NF.Models.NFPageLayer(layer) if layer?
  return null
# Returns the Bubbled Up AV Highlighter effect on a page layer
NF.Models.NFHighlightLayer::connectedPageLayerHighlighterEffect = ->
  connectedPageLayer = @connectedPageLayer()
  if connectedPageLayer?
    expression = @highlighterEffect().property("Spacing").expression
    effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression)
    effect = connectedPageLayer.getEffectWithName(effectName)
    return effect
  return null
# Disconnects bubbleups in this highlight layer
NF.Models.NFHighlightLayer::disconnect = ->
  effect = @highlighterEffect()
  propertyCount = effect?.numProperties
  for i in [1..propertyCount]
    property = effect.property(i)
    property.expression = ""
# Class Methods
NF.Models.NFHighlightLayer.isHighlightLayer = (theLayer) ->
  return theLayer instanceof ShapeLayer and theLayer.Effects.property(1)?.matchName is "AV_Highlighter"

###
#    NF PAPER PARENT LAYER
#
#    (inherits from NFLayer)
###
NF.Models.NFPaperParentLayer = (layer) ->
  NF.Models.NFLayer.call(this, layer)
  @
NF.Models.NFPaperParentLayer:: = new NF.Models.NFLayer()
# Returns an array of child NFLayers
NF.Models.NFPaperParentLayer::getInfo = ->
  return "NFPaperParentLayer: '#{@layer.name}'"
NF.Models.NFPaperParentLayer::getChildren = ->
  # Look for all layers in the comp this layer is in whose parents are this layer
  allLayers = @layer.containingComp.layers
  childLayers = []

  i = 1
  while i <= allLayers.length
    testLayer = new NF.Models.NFLayer allLayers[i]

    # If this layer is the parent...
    if testLayer.layer.parent is @layer

      # Convert to page, image or gaussy if it's a specialized layer
      testLayer = testLayer.getSpecializedLayer()
      childLayers.push testLayer
    i++

  return childLayers

###
#    NF LAYER COLLECTION
#
#    A collection of NF Layers
#
###
NF.Models.NFLayerCollection = (layerArr) ->
  @layers = layerArr ? []
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFLayers to an NFLayerCollection" unless theLayer instanceof NF.Models.NFLayer
  @
NF.Models.NFLayerCollection::getInfo = ->
  infoString = "NFLayerCollection: ["
  for theLayer in @layers
    infoString += theLayer.getInfo() + ", "
  infoString += "]"
NF.Models.NFLayerCollection::addNFLayer = (newLayer) ->
  if newLayer instanceof NF.Models.NFLayer
    @layers.push newLayer
  else
    throw "You can only add NFLayers to an NFLayerCollection"
# Returns NFHighlightLayerCollection of all highlights in all pages in the collection
NF.Models.NFLayerCollection::highlights = ->
  highlightArray = []
  containingLayerArray = []
  for theLayer in @layers
    if theLayer instanceof NF.Models.NFPageLayer
      # Get the layer's NFPageItem
      for highlight in theLayer.highlights().layers
        highlightArray.push highlight
        containingLayerArray.push theLayer
  highlights = new NF.Models.NFHighlightLayerCollection(highlightArray)
  for i in [0..highlights.count()-1]
    highlights.layers[i].containingPageLayer = containingLayerArray[i]
  return highlights
# Returns true if the collection only contains NFPageLayers and no other types of NFLayers
NF.Models.NFLayerCollection::onlyContainsPageLayers = ->
  for theLayer in @layers
    return false unless theLayer instanceof NF.Models.NFPageLayer
  return true
NF.Models.NFLayerCollection::count = ->
  return @layers.length
# Class Methods
# Returns a new instance from an array of AVLayers
NF.Models.NFLayerCollection.collectionFromAVLayerArray = (arr) ->
  # FIXME: Should throw error if each layer isnt an AVLayer
  newArray = for layer in arr
    newLayer = new NF.Models.NFLayer(layer)
    newLayer.getSpecializedLayer()
  return new NF.Models.NFLayerCollection newArray


###
#    NF HIGHLIGHT LAYER COLLECTION
#
#    A collection of NF Highlight Layers
#
###
NF.Models.NFHighlightLayerCollection = (layerArr) ->
  NF.Models.NFLayerCollection.call(this, layerArr)
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection" unless theLayer instanceof NF.Models.NFHighlightLayer

  @
NF.Models.NFHighlightLayerCollection:: = new NF.Models.NFLayerCollection()
NF.Models.NFHighlightLayerCollection::getInfo = ->
  infoString = "NFHighlightLayerCollection: ["
  for theLayer in @layers
    infoString += theLayer.getInfo() + ", "
  infoString += "]"
NF.Models.NFHighlightLayerCollection::addNFLayer = (newLayer) ->
  @addNFHighlightLayer(newLayer)
NF.Models.NFHighlightLayerCollection::addNFHighlightLayer = (newLayer) ->
  if newLayer instanceof NF.Models.NFHighlightLayer
    @layers.push newLayer
  else
    throw "addNFHighlightLayer() can only be used to add NFHighlightLayers to an NFHighlightLayerCollection"
NF.Models.NFHighlightLayerCollection::addAVLayer = (newLayer) ->
  # FIXME: Should throw error if newLayer is not AVLayer
  if true #newLayer instanceof NF.Models.NFHighlightLayer
    @layers.push new NF.Models.NFHighlightLayer(newLayer)
  else
    throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection"
# Overrides the function in NFLayerCollection
NF.Models.NFHighlightLayerCollection::onlyContainsPageLayers = ->
  return false
# Overrides the function in NFLayerCollection. Just returns self because faster
NF.Models.NFHighlightLayerCollection::highlights = ->
  @
# Checks to see if any highlights in the collection share the same name
NF.Models.NFHighlightLayerCollection::duplicateNames = ->
  nameArr = []
  nameArr.push theLayer.name for theLayer in @layers
  return NF.Util.hasDuplicates(nameArr)
# Class Methods
# Returns a new instance from an array of AVLayers
NF.Models.NFHighlightLayerCollection.collectionFromAVLayerArray = (arr) ->
  # FIXME: Should throw error if each layer isnt an AVLayer
  newArray = for layer in arr
    newLayer = new NF.Models.NFHighlightLayer(layer)
  return new NF.Models.NFHighlightLayerCollection newArray




###
#    NF PAGE ITEM
#
#    The composition page item
#
###
NF.Models.NFPageItem = (item) ->
  @item = item
  @
NF.Models.NFPageItem::getInfo = ->
  return "NFPageItem: '#{@item.name}'"
NF.Models.NFPageItem::highlights = ->
  # We're working with AVLayers here
  sourceLayers = NF.Util.collectionToArray(@item.layers)
  highlightLayers = new NF.Models.NFHighlightLayerCollection()
  for theLayer in sourceLayers
    if NF.Models.NFHighlightLayer.isHighlightLayer(theLayer)
      highlightLayers.addAVLayer(theLayer)
  return highlightLayers

###
#    NF PDF
#
#    A collection of Page Items
#
###
NF.Models.NFPDF = (pageArr) ->
  @pages = pageArr
  @
NF.Models.NFPDF::getInfo = ->
  # FIXME: Write this function
  return "NFPDF: 'FIXME'"
NF.Models.NFPDF::addNFPageItem = (newPage) ->
  if newPage instanceof NF.Models.NFPageItem
    @layers.push newPage
  else
    throw "You can only add NFPageItems to an NFPDF"

# testFunction = ->
#   $.writeln('\n\nRunning...')
#
#   selectedLayer = NF.mainComp.selectedLayers[0]
#   parentLayer = new NF.Models.NFPaperParentLayer selectedLayer
#
#   children = parentLayer.getChildren()
#
#   i = 0
#   while i < children.length
#     $.writeln children[i].getInfo()
#     i++
#
#
# testFunction()

# Put everything we changed back into app.NF
app.NF = Object.assign app.NF, NF
