duration = INVERT_DURATION

numLayers = thisComp.numLayers
i = 1
while i <= numLayers
  theLayer = thisComp.layer(i)
  if theLayer.name.indexOf("Gaussy") >= 0 and theLayer.inPoint < time < theLayer.outPoint
    targetGaussy = theLayer
    i = numLayers
  i++

if not targetGaussy?
  100
else if targetGaussy.inPoint <= time < targetGaussy.inPoint + duration
  progress = time - targetGaussy.inPoint
  100 - (progress / duration * 100)
else if targetGaussy.inPoint + duration <= time < targetGaussy.outPoint - duration
  0
else if targetGaussy.outPoint - duration <= time < targetGaussy.outPoint
  progress = targetGaussy.outPoint - time
  100 - (progress / duration * 100)
else
  100
