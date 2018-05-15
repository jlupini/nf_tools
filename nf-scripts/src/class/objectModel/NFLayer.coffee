###
#    NF LAYER
#
###
NFLayer = (layer) ->
  @layer = layer
  @
# Instance Methods
NFLayer:: = Object.assign NFLayer::,
  isPageLayer: ->
    return NFPageLayer.isPageLayer(@layer)
  isNullLayer: ->
    return @layer.nullLayer
  isHighlightLayer: ->
    return NFHighlightLayer.isHighlightLayer(@layer)
  isPaperParentLayer: ->
    return NFPaperParentLayer.isPaperParentLayer(@layer)
  getSpecializedLayer: ->
    # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers
    if @isPageLayer()
      return new NFPageLayer @layer
    else if @isHighlightLayer()
      return new NFHighlightLayer @layer
    else if @isPaperParentLayer()
      return new NFPaperParentLayer @layer
    else
      return @
  getInfo: ->
    return "NFLayer: '#{@layer.name}'"
  # Returns true if the layer has a null parent
  hasNullParent: ->
    if @layer.parent?
      return @layer.parent.nullLayer
    return false
  # Checks to see if a given NFLayer's layer is the same as this one's
  # For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  sameLayerAs: (testLayer) ->
    return no unless testLayer?
    return @layer.index == testLayer.layer.index and @layer.containingComp.id == testLayer.layer.containingComp.id
# Class Methods
NFLayer = Object.assign NFLayer,
  # Returns a new Specialized NFLayer from an AVLayer
  getSpecializedLayerFromAVLayer: (theLayer) ->
    throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer" unless theLayer instanceof AVLayer
    tmpLayer = new NFLayer theLayer
    return tmpLayer.getSpecializedLayer()
  # Returns true if the given AVLayer is a comp layer
  isCompLayer: (theLayer) ->
    return theLayer instanceof AVLayer and theLayer.source instanceof CompItem
