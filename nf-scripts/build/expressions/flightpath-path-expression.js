var exposeMask, flightPathShape, highlighterEffect, inTangents, is_closed, maskExpansion, maskPointSource, maskPoints, ori, outTangents, points, shapeLayer, shapeLayerName, shapePoints, shapeRect, sourceComp, sourceLayer, sourceLayerName, targetLayer, targetLayerName, thickness, vShapeAdj;

targetLayerName = "25_pg01 [ref] <Green Highlighter> {a}";

sourceLayerName = "25_pg01 [+]";

shapeLayerName = "Green Highlighter";

maskExpansion = 26;

targetLayer = thisComp.layer(targetLayerName);

sourceLayer = thisComp.layer(sourceLayerName);

sourceComp = sourceLayer.source;

shapeLayer = sourceComp.layer(shapeLayerName);

highlighterEffect = shapeLayer.effect('AV_Highlighter');

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
  exposeMask = targetLayer.mask('Mask 1').maskPath;
  maskPointSource = exposeMask.points();
  maskPoints = {
    lt: targetLayer.toComp([maskPointSource[0][0] - maskExpansion, maskPointSource[0][1] - maskExpansion]),
    rt: targetLayer.toComp([maskPointSource[1][0] + maskExpansion, maskPointSource[1][1] - maskExpansion]),
    rb: targetLayer.toComp([maskPointSource[2][0] + maskExpansion, maskPointSource[2][1] + maskExpansion]),
    lb: targetLayer.toComp([maskPointSource[3][0] - maskExpansion, maskPointSource[3][1] + maskExpansion])
  };
  flightPathShape = [maskPoints.lb, maskPoints.lt, maskPoints.rt, shapePoints.rt, shapePoints.rb, shapePoints.lb];
  createPath(points = flightPathShape, inTangents = [], outTangents = [], is_closed = true);
} else {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
}
