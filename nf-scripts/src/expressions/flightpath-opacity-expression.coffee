duration = OPACITY_DURATION
refLayerName = 'REF_LAYER_NAME'

refLayer = thisComp.layer refLayerName
refOpacityFactor = refLayer.transform.opacity.value / 100

if time < thisLayer.inPoint
  0
else if thisLayer.inPoint <= time < thisLayer.inPoint + duration
  progress = time - thisLayer.inPoint
  progress / duration * transform.opacity * refOpacityFactor
else if thisLayer.inPoint + duration <= time < thisLayer.outPoint - duration
  transform.opacity * refOpacityFactor
else if thisLayer.outPoint - duration <= time < thisLayer.outPoint
  progress = thisLayer.outPoint - time
  progress / duration * transform.opacity * refOpacityFactor
else
  0
