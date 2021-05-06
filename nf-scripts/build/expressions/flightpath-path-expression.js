var combineRects, controlLayer, currentEffect, defaultShapeRect, easeInOutCubic, effectCount, error, error1, exp, expShapeLayer, expShapeLayerName, expShapeLayerRect, expandTimingOffset, exposeMask, flightPathShape, highlighterEffect, i, inTangents, is_closed, j, k, l, len, len1, maskExpansion, maskPointSource, maskPoints, maxX, maxY, ori, outTangents, points, postTransitionExpands, postTransitionShapeRect, preTransitionExpands, preTransitionShapeRect, rectToComp, ref, shapeHeight, shapeLayer, shapeLayerName, shapeOffset, shapePoints, shapeRect, sourceComp, sourceLayer, sourceLayerName, targetLayer, targetLayerName, thickness, transitionProgress, tweenRects, vShapeAdj;

targetLayerName = 'TARGET_LAYER_NAME';

sourceLayerName = 'SOURCE_LAYER_NAME';

shapeLayerName = 'SHAPE_LAYER_NAME';

targetLayer = thisComp.layer(targetLayerName);

sourceLayer = thisComp.layer(sourceLayerName);

sourceComp = sourceLayer.source;

shapeLayer = sourceComp.layer(shapeLayerName);

maskExpansion = thisLayer.mask('Mask 1').maskExpansion.value;

expandTimingOffset = thisLayer.effect("Expand Transition Timing Offset")("Slider").value;

try {
  highlighterEffect = shapeLayer.effect('AV_Highlighter');
} catch (error1) {
  error = error1;
  highlighterEffect = null;
}

maxX = function(rect) {
  return rect.left + rect.width;
};

maxY = function(rect) {
  return rect.top + rect.height;
};

combineRects = function(rect1, rect2) {
  return {
    left: Math.min(rect1.left, rect2.left),
    top: Math.min(rect1.top, rect2.top),
    width: Math.max(maxX(rect1), maxX(rect2)) - Math.min(rect1.left, rect2.left),
    height: Math.max(maxY(rect1), maxY(rect2)) - Math.min(rect1.top, rect2.top)
  };
};

rectToComp = function(rect1, layer1, vPad) {
  var br, retObj, tl;
  tl = layer1.toComp([rect1.left, rect1.top - vPad]);
  br = layer1.toComp([rect1.left + rect1.width, rect1.top + rect1.height + vPad]);
  return retObj = {
    left: tl[0],
    top: tl[1],
    width: br[0] - tl[0],
    height: br[1] - tl[1]
  };
};

easeInOutCubic = function(t) {
  if (t < 0.5) {
    return 4 * t * t * t;
  } else {
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

tweenRects = function(rect1, rect2, position) {
  var deltaH, deltaL, deltaT, deltaW, easedPos, retObj;
  deltaL = rect2.left - rect1.left;
  deltaT = rect2.top - rect1.top;
  deltaW = rect2.width - rect1.width;
  deltaH = rect2.height - rect1.height;
  easedPos = easeInOutCubic(position);
  return retObj = {
    left: rect1.left + (deltaL * easedPos),
    top: rect1.top + (deltaT * easedPos),
    width: rect1.width + (deltaW * easedPos),
    height: rect1.height + (deltaH * easedPos)
  };
};

vShapeAdj = 0;

if (highlighterEffect != null) {
  thickness = highlighterEffect('Thickness').value;
  vShapeAdj = thickness / 2;
}

if ((targetLayer.inPoint <= time && time <= targetLayer.outPoint)) {
  defaultShapeRect = rectToComp(shapeLayer.sourceRectAtTime(sourceComp.duration), shapeLayer, vShapeAdj);
  effectCount = thisLayer("ADBE Effect Parade").numProperties;
  preTransitionExpands = [];
  postTransitionExpands = [];
  if (effectCount !== 0) {
    for (i = j = 1, ref = effectCount; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      currentEffect = thisLayer.effect(i);
      if (currentEffect.name.indexOf('Expand Tracker') !== -1) {
        controlLayer = currentEffect("Layer");
        expShapeLayerName = controlLayer.effect("AV_Highlighter").name;
        expShapeLayer = sourceComp.layer(expShapeLayerName);
        expShapeLayerRect = expShapeLayer.sourceRectAtTime(sourceComp.duration);
        exp = {
          rect: rectToComp(expShapeLayerRect, expShapeLayer, vShapeAdj),
          inPoint: controlLayer.inPoint
        };
        if (time - expandTimingOffset > exp.inPoint) {
          if (time - expandTimingOffset > exp.inPoint + 1) {
            preTransitionExpands.push(exp);
          } else {
            postTransitionExpands.push(exp);
            transitionProgress = time - expandTimingOffset - exp.inPoint;
          }
        }
      }
    }
  }
  if (preTransitionExpands.length > 0) {
    for (k = 0, len = preTransitionExpands.length; k < len; k++) {
      exp = preTransitionExpands[k];
      if (typeof preTransitionShapeRect !== "undefined" && preTransitionShapeRect !== null) {
        preTransitionShapeRect = combineRects(preTransitionShapeRect, exp.rect);
      } else {
        preTransitionShapeRect = exp.rect;
      }
    }
    preTransitionShapeRect = combineRects(preTransitionShapeRect, defaultShapeRect);
  }
  if (postTransitionExpands.length > 0) {
    for (l = 0, len1 = postTransitionExpands.length; l < len1; l++) {
      exp = postTransitionExpands[l];
      if (typeof postTransitionShapeRect !== "undefined" && postTransitionShapeRect !== null) {
        postTransitionShapeRect = combineRects(postTransitionShapeRect, exp.rect);
      } else {
        postTransitionShapeRect = exp.rect;
      }
    }
    postTransitionShapeRect = combineRects(postTransitionShapeRect, defaultShapeRect);
  }
  if ((preTransitionShapeRect != null) && (postTransitionShapeRect != null)) {
    shapeRect = tweenRects(preTransitionShapeRect, postTransitionShapeRect, transitionProgress);
  } else if (postTransitionShapeRect && !preTransitionShapeRect) {
    shapeRect = tweenRects(defaultShapeRect, postTransitionShapeRect, transitionProgress);
  } else if (preTransitionShapeRect && (postTransitionShapeRect == null)) {
    shapeRect = preTransitionShapeRect;
  } else {
    shapeRect = defaultShapeRect;
  }
  shapePoints = {
    lt: sourceLayer.toComp([shapeRect.left, shapeRect.top]),
    lb: sourceLayer.toComp([shapeRect.left, shapeRect.top + shapeRect.height]),
    rt: sourceLayer.toComp([shapeRect.left + shapeRect.width, shapeRect.top]),
    rb: sourceLayer.toComp([shapeRect.left + shapeRect.width, shapeRect.top + shapeRect.height])
  };
  shapeHeight = shapePoints.lb[1] - shapePoints.lt[1];
  shapeOffset = Math.min(0.75 * maskExpansion, shapeHeight / 2);
  shapePoints = {
    lt: [shapePoints.lt[0] + shapeOffset, shapePoints.lt[1] + shapeOffset],
    lb: [shapePoints.lb[0] + shapeOffset, shapePoints.lb[1] - shapeOffset],
    rt: [shapePoints.rt[0] - shapeOffset, shapePoints.rt[1] + shapeOffset],
    rb: [shapePoints.rb[0] - shapeOffset, shapePoints.rb[1] - shapeOffset]
  };
  exposeMask = targetLayer.mask('Mask 1').maskPath;
  maskPointSource = exposeMask.points();
  maskPoints = {
    lt: targetLayer.toComp(maskPointSource[0]),
    rt: targetLayer.toComp(maskPointSource[1]),
    rb: targetLayer.toComp(maskPointSource[2]),
    lb: targetLayer.toComp(maskPointSource[3])
  };
  flightPathShape = [];
  if (maskPoints.lb[1] <= shapePoints.lb[1]) {
    flightPathShape = [maskPoints.lb, maskPoints.lt, maskPoints.rt, shapePoints.rt, shapePoints.rb, shapePoints.lb];
  } else if (maskPoints.lt[1] >= shapePoints.lt[1]) {
    flightPathShape = [maskPoints.lt, maskPoints.lb, maskPoints.rb, shapePoints.rb, shapePoints.rt, shapePoints.lt];
  } else {
    flightPathShape = [maskPoints.rb, maskPoints.lb, maskPoints.lt, maskPoints.rt, shapePoints.rt, shapePoints.rb];
  }
  createPath(points = flightPathShape, inTangents = [], outTangents = [], is_closed = true);
} else {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
}
