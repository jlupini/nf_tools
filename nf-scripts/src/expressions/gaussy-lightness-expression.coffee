duration = thisLayer("Effects")("AV Gaussy")("Duration").value / 100
maxLightness = thisLayer("Effects")("AV Gaussy")("Lightness").value

if time < thisLayer.inPoint
  0
else if thisLayer.inPoint <= time < thisLayer.inPoint + duration
  progress = time - thisLayer.inPoint
  progress / duration * maxLightness
else if thisLayer.inPoint + duration <= time < thisLayer.outPoint - duration
  maxLightness
else if thisLayer.outPoint - duration <= time < thisLayer.outPoint
  progress = thisLayer.outPoint - time
  progress / duration * maxLightness
else
  0
