var inTangents, is_closed, offsetValue, ori, outTangents, points, shapePoints, shapeRect, targetLayer;

offsetValue = 100;

targetLayer = topmostLayer;

if ((targetLayer.inPoint <= time && time <= targetLayer.outPoint)) {
  shapeRect = targetLayer.sourceRectAtTime(time);
  shapePoints = {
    lt: targetLayer.toComp([shapeRect.left + offsetValue, shapeRect.top + offsetValue]),
    lb: targetLayer.toComp([shapeRect.left + offsetValue, shapeRect.top + shapeRect.height + offsetValue]),
    rt: targetLayer.toComp([shapeRect.left + shapeRect.width + offsetValue, shapeRect.top + offsetValue]),
    rb: targetLayer.toComp([shapeRect.left + shapeRect.width + offsetValue, shapeRect.top + shapeRect.height + offsetValue])
  };
  createPath(points = [shapePoints.lt, shapePoints.rt, shapePoints.rb, shapePoints.lb], inTangents = [], outTangents = [], is_closed = true);
} else {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
}
