(function() {
  #include "extendscript.prototypes.js";
  var nf;

  nf = {};

  nf.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  nf.sourceRectsForHighlightsInTargetLayer = function(targetLayer) {
    var i, layerParent, sourceCompLayers, sourceHighlightLayers, sourceHighlightRects, theLayer;
    sourceCompLayers = targetLayer.source.layers;
    if (sourceCompLayers == null) {
      return null;
    }
    sourceHighlightLayers = [];
    sourceHighlightRects = {};
    i = 1;
    while (i <= sourceCompLayers.length) {
      theLayer = sourceCompLayers[i];
      if (theLayer instanceof ShapeLayer && theLayer.Effects.property(1).matchName === "AV_Highlighter") {
        sourceHighlightLayers.push(theLayer);
        layerParent = theLayer.parent;
        theLayer.parent = null;
        sourceHighlightRects[theLayer.name] = nf.sourceRectRelativeToComp(theLayer);
        sourceHighlightRects[theLayer.name].padding = theLayer.Effects.property(1).property("Thickness").value || 0;
        theLayer.parent = layerParent;
      }
      i++;
    }
    return sourceHighlightRects;
  };

  nf.sourceRectRelativeToComp = function(layer) {
    var bottomRightPoint, rect, tempNull, topLeftPoint;
    tempNull = layer.containingComp.layers.addNull();
    tempNull.transform.position.expression = "rect = thisComp.layer(" + layer.index + ").sourceRectAtTime(time); a = thisComp.layer(" + layer.index + ").toComp(thisComp.layer(" + layer.index + ").transform.anchorPoint); [rect.left + a[0], rect.top + a[1]]";
    topLeftPoint = tempNull.transform.position.value;
    tempNull.transform.position.expression = "rect = thisComp.layer(" + layer.index + ").sourceRectAtTime(time); a = thisComp.layer(" + layer.index + ").toComp(thisComp.layer(" + layer.index + ").transform.anchorPoint); [rect.left + rect.width + a[0], rect.top + rect.height + a[1]]";
    bottomRightPoint = tempNull.transform.position.value;
    tempNull.remove();
    return rect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };

  nf.toKeys = function(dict) {
    var allKeys, key;
    allKeys = [];
    for (key in dict) {
      allKeys.push(key);
    }
    return allKeys;
  };

  app.nf = nf;

}).call(this);
