`#include "extendscript.prototypes.js"`
nf = {}

# Utility Functions
nf.capitalizeFirstLetter = (string) ->
  string.charAt(0).toUpperCase() + string.slice(1)

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

nf.toKeys = (dict) ->
  allKeys = []
  for key of dict
    allKeys.push key
  allKeys

# Add functions to app.nf
app.nf = nf