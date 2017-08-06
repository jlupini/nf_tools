`#include "extendscript.prototypes.js"`
nf = {}

# Utility Functions
nf.pageParent = (selectedLayer) ->
  return selectedLayer if selectedLayer.nullLayer
  return selectedLayer.parent if selectedLayer.parent.nullLayer
  return null
  

nf.capitalizeFirstLetter = (string) ->
  string.charAt(0).toUpperCase() + string.slice(1)

# Returns an array where each item is an object containing position data for each highlight in the target page layer
nf.sourceRectsForHighlightsInTargetLayer = (targetLayer) ->
  sourceCompLayers = targetLayer.source.layers
  return null if not sourceCompLayers?
  sourceHighlightLayers = []
  sourceHighlightRects = {}
  i = 1
  while i <= sourceCompLayers.length
    theLayer = sourceCompLayers[i]
    if theLayer instanceof ShapeLayer and theLayer.Effects.property(1).matchName is "AV_Highlighter"
      sourceHighlightLayers.push theLayer

      layerParent = theLayer.parent
      theLayer.parent = null
      sourceHighlightRects[theLayer.name] = nf.sourceRectRelativeToComp theLayer
      sourceHighlightRects[theLayer.name].padding = theLayer.Effects.property(1).property("Thickness").value or 0
      sourceHighlightRects[theLayer.name].name = theLayer.name
      theLayer.parent = layerParent
    i++
  sourceHighlightRects

# Uses a null hack to get the sourceRect of a layer relative to the comp
nf.sourceRectRelativeToComp = (layer) ->
  tempNull = layer.containingComp.layers.addNull()
  tempNull.transform.position.expression = "rect = thisComp.layer(#{layer.index}).sourceRectAtTime(time);
                                            a = thisComp.layer(#{layer.index}).toComp(thisComp.layer(#{layer.index}).transform.anchorPoint);
                                            [rect.left + a[0], rect.top + a[1]]"
  topLeftPoint = tempNull.transform.position.value
  tempNull.transform.position.expression = "rect = thisComp.layer(#{layer.index}).sourceRectAtTime(time);
                                            a = thisComp.layer(#{layer.index}).toComp(thisComp.layer(#{layer.index}).transform.anchorPoint);
                                            [rect.left + rect.width + a[0], rect.top + rect.height + a[1]]"
  bottomRightPoint = tempNull.transform.position.value
  tempNull.remove()
  rect =
    left: topLeftPoint[0]
    top: topLeftPoint[1]
    width: bottomRightPoint[0] - topLeftPoint[0]
    height: bottomRightPoint[1] - topLeftPoint[1]

nf.rectRelativeToComp = (rect, layer, targetTime = null) ->
  topLeftPoint = nf.pointRelativeToComp [rect.left, rect.top], layer, targetTime
  bottomRightPoint = nf.pointRelativeToComp [rect.left + rect.width, rect.top + rect.height], layer, targetTime
  newRect =
    left: topLeftPoint[0]
    top: topLeftPoint[1]
    width: bottomRightPoint[0] - topLeftPoint[0]
    height: bottomRightPoint[1] - topLeftPoint[1]

# Returns a point on a layer relative to the containing comp, optionally at a given time
nf.pointRelativeToComp = (sourcePoint, layer, targetTime = null) ->
  targetTime = targetTime ? app.project.activeItem.time
  tempNull = nf.nullAtPointRelativeToComp sourcePoint, layer
  newPoint = tempNull.transform.position.valueAtTime targetTime, false
  tempNull.remove()
  newPoint

# Creates and returns a null object with no parent, at the same coordinates in a comp as the
# supplied point on a given layer.
nf.nullAtPointRelativeToComp = (sourcePoint, layer) ->
  targetTime = targetTime ? app.project.activeItem.time
  tempNull = layer.containingComp.layers.addNull()
  tempNull.transform.position.expression = "a = thisComp.layer(#{layer.index}).toComp([#{sourcePoint[0]}, #{sourcePoint[1]}]);
                                            a"
  tempNull

nf.toKeys = (dict) ->
  allKeys = []
  for key of dict
    allKeys.push key
  allKeys

# Returns an array of verticies needed to draw a shape or mask from the source rect of a highlight layer
nf.verticiesFromSourceRect = (rect) ->
  v =
    topLeft: [rect.left, rect.top]
    topRight: [rect.left + rect.width, rect.top]
    bottomRight: [rect.left + rect.width, rect.top + rect.height]
    bottomLeft: [rect.left, rect.top + rect.height]
  return [v.topLeft, v.bottomLeft, v.bottomRight, v.topRight]

# Add functions to app.nf
app.nf = nf