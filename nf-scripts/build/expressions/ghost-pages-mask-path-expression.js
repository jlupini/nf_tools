var calculatedOffset, error, inTangents, is_closed, layerString, layerStringArr, maskNumber, maskPoints, offsetValue, ori, outTangents, pageMaskPath, paperNumber, points, shapePoints, shapeRect, sheetNumber, targetLayer;

maskNumber = thisProperty.propertyGroup(1).propertyIndex - 1;

paperNumber = Math.floor(maskNumber / 2);

sheetNumber = maskNumber % 2;

offsetValue = thisLayer.effect("Page Offset")("Slider").value;

calculatedOffset = offsetValue * (sheetNumber + 1);

layerString = thisComp.layer("ghost-page-data").text.sourceText.valueAtTime(time);

layerStringArr = layerString.split(";");

if (layerString !== "" && paperNumber <= layerStringArr.length - 1) {
  targetLayer = thisComp.layer(layerStringArr[paperNumber]);
  try {
    pageMaskPath = targetLayer.mask(1).path;
    maskPoints = pageMaskPath.points(time);
    shapePoints = {
      lt: targetLayer.toComp([maskPoints[0][0] + calculatedOffset, maskPoints[0][1] + calculatedOffset]),
      lb: targetLayer.toComp([maskPoints[3][0] + calculatedOffset, maskPoints[3][1] + calculatedOffset]),
      rt: targetLayer.toComp([maskPoints[1][0] + calculatedOffset, maskPoints[1][1] + calculatedOffset]),
      rb: targetLayer.toComp([maskPoints[2][0] + calculatedOffset, maskPoints[2][1] + calculatedOffset])
    };
  } catch (error) {
    shapeRect = targetLayer.sourceRectAtTime(time);
    shapePoints = {
      lt: targetLayer.toComp([shapeRect.left + calculatedOffset, shapeRect.top + calculatedOffset]),
      lb: targetLayer.toComp([shapeRect.left + calculatedOffset, shapeRect.top + shapeRect.height + calculatedOffset]),
      rt: targetLayer.toComp([shapeRect.left + shapeRect.width + calculatedOffset, shapeRect.top + calculatedOffset]),
      rb: targetLayer.toComp([shapeRect.left + shapeRect.width + calculatedOffset, shapeRect.top + shapeRect.height + calculatedOffset])
    };
  }
  createPath(points = [shapePoints.lt, shapePoints.rt, shapePoints.rb, shapePoints.lb], inTangents = [], outTangents = [], is_closed = true);
} else {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
}
