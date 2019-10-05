var edgePadding, inTangents, is_closed, lb, lt, ori, outTangents, points, rb, rt, shape, shapePoints, targetLayer, targetLayerName;

targetLayerName = 'TARGET_LAYER_NAME';

edgePadding = 'EDGE_PADDING';

targetLayer = thisComp.layer(targetLayerName);

if ((targetLayer.inPoint <= time && time <= targetLayer.outPoint)) {
  shape = targetLayer.mask('Mask 1').maskPath;
  shapePoints = shape.points();
  lt = targetLayer.toComp(shapePoints[0]);
  rt = targetLayer.toComp(shapePoints[1]);
  rb = targetLayer.toComp(shapePoints[2]);
  lb = targetLayer.toComp(shapePoints[3]);
  lt = [lt[0] - (edgePadding / 2), lt[1] - (edgePadding / 3)];
  rt = [rt[0] + (edgePadding / 2), rt[1] - (edgePadding / 3)];
  rb = [rb[0] + (edgePadding / 2), rb[1] + (edgePadding / 3)];
  lb = [lb[0] - (edgePadding / 2), lb[1] + (edgePadding / 3)];
  createPath(points = [lt, rt, rb, lb], inTangents = [], outTangents = [], is_closed = true);
} else {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
}
