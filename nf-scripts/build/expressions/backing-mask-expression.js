var inTangents, is_closed, lb, lt, ori, outTangents, points, rb, rt, shape, shapePoints, targetLayer, targetLayerName;

targetLayerName = 'TARGET_LAYER_NAME';

targetLayer = thisComp.layer(targetLayerName);

if ((targetLayer.inPoint <= time && time <= targetLayer.outPoint)) {
  shape = targetLayer.mask('Mask 1').maskPath;
  shapePoints = shape.points();
  lt = targetLayer.toComp(shapePoints[0]);
  rt = targetLayer.toComp(shapePoints[1]);
  rb = targetLayer.toComp(shapePoints[2]);
  lb = targetLayer.toComp(shapePoints[3]);
  createPath(points = [lt, rt, rb, lb], inTangents = [], outTangents = [], is_closed = true);
} else {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
}
