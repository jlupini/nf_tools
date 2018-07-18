onValue = ON_VALUE
duration = 1
controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME")

expValue = ->
  # Get the relevant marker
  if controlLayer.marker.numKeys > 0
    for idx in [1..controlLayer.marker.numKeys]
      testMarker = controlLayer.marker.key(idx)
      inMarker = testMarker if testMarker.comment is "Spot In"
      outMarker = testMarker if testMarker.comment is "Spot Out"
  else
    return null

  return null unless inMarker? and outMarker?

  if inMarker.time - duration <= time < inMarker.time
    progress = inMarker.time - time
    return onValue * (1 - progress / duration)
  else if inMarker.time <= time < outMarker.time
    return onValue
  else if outMarker.time <= time < outMarker.time + duration
    progress = time - outMarker.time
    return onValue * (1 - progress / duration)
  else
    return 0

expValue() ? value
