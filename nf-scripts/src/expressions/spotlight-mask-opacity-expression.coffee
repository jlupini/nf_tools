onValue = ON_VALUE
duration = ANIMATION_DURATION
controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME")

expValue = ->
  # Get the relevant marker
  if controlLayer.marker.numKeys > 0
    for idx in [1..controlLayer.marker.numKeys]
      testMarker = controlLayer.marker.key(idx)
      spotMarker = testMarker if testMarker.comment is "Spotlight"
  else
    return null

  return null unless spotMarker?

  inTime = spotMarker.time
  outTime = spotMarker.time + spotMarker.duration

  if inTime - duration <= time < inTime
    progress = inTime - time
    return onValue * (1 - progress / duration)
  else if inTime <= time < outTime
    return onValue
  else if outTime <= time < outTime + duration
    progress = time - outTime
    return onValue * (1 - progress / duration)
  else
    return 0

expValue() ? value
