maskNumber = thisProperty.propertyGroup(1).propertyIndex - 1
paperNumber = Math.floor(maskNumber / 2)
sheetNumber = maskNumber % 2

offsetValue = thisLayer.effect("Page Offset")("Slider").value
calculatedOffset = offsetValue * (sheetNumber + 1)
layerString = thisComp.layer("ghost-page-data").text.sourceText.valueAtTime time
layerStringArr = layerString.split ";"

if layerString isnt "" and paperNumber <= layerStringArr.length - 1
  targetLayer = thisComp.layer layerStringArr[paperNumber]

  shapeRect = targetLayer.sourceRectAtTime(time)
  shapePoints =
    lt: targetLayer.toComp([shapeRect.left + calculatedOffset, shapeRect.top + calculatedOffset])
    lb: targetLayer.toComp([shapeRect.left + calculatedOffset, shapeRect.top + shapeRect.height + calculatedOffset])
    rt: targetLayer.toComp([shapeRect.left + shapeRect.width + calculatedOffset, shapeRect.top + calculatedOffset])
    rb: targetLayer.toComp([shapeRect.left + shapeRect.width + calculatedOffset, shapeRect.top + shapeRect.height + calculatedOffset])

  createPath points = [shapePoints.lt, shapePoints.rt, shapePoints.rb, shapePoints.lb], inTangents = [], outTangents = [], is_closed = true

else
  ori = [0, 0]
  createPath points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true
