duration = thisLayer("Effects")("AV Gaussy")("Duration").value / 100
maxBlurriness = thisLayer("Effects")("AV Gaussy")("Blurriness").value

if time < thisLayer.inPoint
  0
else if thisLayer.inPoint <= time < thisLayer.inPoint + duration
  progress = time - thisLayer.inPoint
  progress / duration * maxBlurriness
else if thisLayer.inPoint + duration <= time < thisLayer.outPoint - duration
  maxBlurriness
else if thisLayer.outPoint - duration <= time < thisLayer.outPoint
  progress = thisLayer.outPoint - time
  progress / duration * maxBlurriness
else
  0
