var error, error1, exposeMask, flightPathShape, highlighterEffect, inTangents, is_closed, maskExpansion, maskPointSource, maskPoints, ori, outTangents, points, shapeHeight, shapeLayer, shapeLayerName, shapeOffset, shapePoints, shapeRect, sourceComp, sourceLayer, sourceLayerName, targetLayer, targetLayerName, thickness, vShapeAdj;

targetLayerName = 'TARGET_LAYER_NAME';

sourceLayerName = 'SOURCE_LAYER_NAME';

shapeLayerName = 'SHAPE_LAYER_NAME';

targetLayer = thisComp.layer(targetLayerName);

sourceLayer = thisComp.layer(sourceLayerName);

sourceComp = sourceLayer.source;

shapeLayer = sourceComp.layer(shapeLayerName);

maskExpansion = thisLayer.mask('Mask 1').maskExpansion.value;

try {
  highlighterEffect = shapeLayer.effect('AV_Highlighter');
} catch (error1) {
  error = error1;
  highlighterEffect = null;
}

if ((targetLayer.inPoint <= time && time <= targetLayer.outPoint)) {
  vShapeAdj = 0;
  if (highlighterEffect != null) {
    thickness = highlighterEffect('Thickness').value;
    vShapeAdj = thickness / 2;
  }
  shapeRect = shapeLayer.sourceRectAtTime(sourceComp.duration);
  shapePoints = {
    lt: sourceLayer.toComp(shapeLayer.toComp([shapeRect.left, shapeRect.top - vShapeAdj])),
    lb: sourceLayer.toComp(shapeLayer.toComp([shapeRect.left, shapeRect.top + shapeRect.height + vShapeAdj])),
    rt: sourceLayer.toComp(shapeLayer.toComp([shapeRect.left + shapeRect.width, shapeRect.top - vShapeAdj])),
    rb: sourceLayer.toComp(shapeLayer.toComp([shapeRect.left + shapeRect.width, shapeRect.top + shapeRect.height + vShapeAdj]))
  };
  shapeHeight = shapePoints.lb[1] - shapePoints.lt[1];
  shapeOffset = Math.min(maskExpansion, shapeHeight / 2);
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
