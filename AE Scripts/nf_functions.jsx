(function() {
  #include "extendscript.prototypes.js";
  var nf;

  nf = {};

  nf.pageParent = function(selectedLayer) {
    if (selectedLayer.nullLayer) {
      return selectedLayer;
    }
    if (selectedLayer.parent.nullLayer) {
      return selectedLayer.parent;
    }
    return null;
  };

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
        sourceHighlightRects[theLayer.name].name = theLayer.name;
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

  nf.rectRelativeToComp = function(rect, layer, targetTime) {
    var bottomRightPoint, newRect, topLeftPoint;
    if (targetTime == null) {
      targetTime = null;
    }
    topLeftPoint = nf.pointRelativeToComp([rect.left, rect.top], layer, targetTime);
    bottomRightPoint = nf.pointRelativeToComp([rect.left + rect.width, rect.top + rect.height], layer, targetTime);
    return newRect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };

  nf.pointRelativeToComp = function(sourcePoint, layer, targetTime) {
    var newPoint, tempNull;
    if (targetTime == null) {
      targetTime = null;
    }
    targetTime = targetTime != null ? targetTime : app.project.activeItem.time;
    tempNull = nf.nullAtPointRelativeToComp(sourcePoint, layer);
    newPoint = tempNull.transform.position.valueAtTime(targetTime, false);
    tempNull.remove();
    return newPoint;
  };

  nf.nullAtPointRelativeToComp = function(sourcePoint, layer) {
    var targetTime, tempNull;
    targetTime = targetTime != null ? targetTime : app.project.activeItem.time;
    tempNull = layer.containingComp.layers.addNull();
    tempNull.transform.position.expression = "a = thisComp.layer(" + layer.index + ").toComp([" + sourcePoint[0] + ", " + sourcePoint[1] + "]); a";
    return tempNull;
  };

  nf.toKeys = function(dict) {
    var allKeys, key;
    allKeys = [];
    for (key in dict) {
      allKeys.push(key);
    }
    return allKeys;
  };

  nf.verticiesFromSourceRect = function(rect) {
    var v;
    v = {
      topLeft: [rect.left, rect.top],
      topRight: [rect.left + rect.width, rect.top],
      bottomRight: [rect.left + rect.width, rect.top + rect.height],
      bottomLeft: [rect.left, rect.top + rect.height]
    };
    return [v.topLeft, v.bottomLeft, v.bottomRight, v.topRight];
  };

  app.nf = nf;

}).call(this);
