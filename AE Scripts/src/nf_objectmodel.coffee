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
  return @isCompLayer() and @layer.source.name.indexOf("NFPage") >= 0
NF.Models.NFLayer::isCompLayer = ->
  return @layer instanceof AVLayer and @layer.source instanceof CompItem
NF.Models.NFLayer::getSpecializedLayer = ->
  # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers, and Paper Parent Layers (YES)
  if @isPageLayer()
    return new NF.Models.NFPageLayer @layer
  else
    return @
NF.Models.NFLayer::getInfo = ->
  return "NFLayer: #{@layer.name}"


###
#    NF PAGE LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFPageLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NFPageLayer:: = new NFLayer()
NF.Models.NFPageLayer::getInfo = ->
  return "NFPageLayer: #{@layer.name}"


###
#    NF IMAGE LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFImageLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NF.Models.NFImageLayer:: = new NFLayer()
NF.Models.NFImageLayer::getInfo = ->
  return "NFImageLayer: #{@layer.name}"


###
#    NF GAUSSY LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFGaussyLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NF.Models.NFGaussyLayer:: = new NF.Models.NFLayer()
NF.Models.NFGaussyLayer::getInfo = ->
  return "NFGaussyLayer: #{@layer.name}"


###
#    NF EMPHASIS LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFEmphasisLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NF.Models.NFEmphasisLayer:: = new NF.Models.NFLayer()
NF.Models.NFEmphasisLayer::getInfo = ->
  return "NFEmphasisLayer: #{@layer.name}"


###
#    NF HIGHLIGHT LAYER
#
#    (inherits from NFLayer)
#
###
NF.Models.NFHighlightLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NF.Models.NFHighlightLayer:: = new NF.Models.NFLayer()
NF.Models.NFHighlightLayer::getInfo = ->
  return "NFHighlightLayer: #{@layer.name}"


###
#    NF PAPER PARENT LAYER
#
#    (inherits from NFLayer)
###
NF.Models.NFPaperParentLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NF.Models.NFPaperParentLayer:: = new NF.Models.NFLayer()
# Returns an array of child NFLayers
NF.Models.NFPaperParentLayer::getInfo = ->
  return "NFPaperParentLayer: #{@layer.name}"
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
#    NF PAGE ITEM
#
#    The composition page item
#
###
NF.Models.NFPageItem = (item) ->
  @item = item
  @
NF.Models.NFPageItem::getInfo = ->
  return "NFPageItem: #{@item.name}"




testFunction = ->
  $.writeln('\n\nRunning...')

  selectedLayer = NF.mainComp.selectedLayers[0]
  parentLayer = new NF.Models.NFPaperParentLayer selectedLayer

  children = parentLayer.getChildren()

  i = 0
  while i < children.length
    $.writeln children[i].getInfo()
    i++


testFunction()

# Put everything we changed back into app.NF
app.NF = Object.assign app.NF, NF