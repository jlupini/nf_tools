onValue = ON_VALUE
duration = ANIMATION_DURATION
controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME")
targetPDF = "PDF_NUMBER"

firstInBlock = 101
lastInBlock = 202
onlyInBlock = 252
notFirstOrLastInBlock = 303

inFunc = (mark) ->
  return mark.time - duration
outFunc = (mark) ->
  return mark.time + mark.duration + duration

# FIXME: Pickup here and check if this is the start or end of a block, in which case NO ANIMATION

# Gets an array of the active markers at this time
activeMarkersAtTime = ->
  babbies = []
  spotlightMarkers = []
  activeMarkers = []
  numLayers = thisComp.numLayers
  i = 1
  while i <= numLayers
    theLayer = thisComp.layer(i)
    if theLayer.name.indexOf(targetPDF + " -") >= 0 and theLayer.name.indexOf("Highlight Control") >= 0
      babbies.push theLayer

      if theLayer.marker.numKeys > 0
        for idx in [1..theLayer.marker.numKeys]
          testMarker = theLayer.marker.key(idx)
          if testMarker.comment is "Spotlight"
            spotlightMarkers.push testMarker

            adjIn = inFunc testMarker
            adjOut = outFunc testMarker
            activeMarkers.push testMarker if adjIn < time < adjOut

    i++
  return activeMarkers

# Gets the spotlight marker on this layer
thisSpotlightMarker = ->
  if controlLayer.marker.numKeys > 0
    for idx in [1..controlLayer.marker.numKeys]
      testMarker = controlLayer.marker.key(idx)
      spotMarker = testMarker if testMarker.comment is "Spotlight"
    return spotMarker
  else
    return null

positionInBlock = ->
  activeMarkers = activeMarkersAtTime()

  if activeMarkers.length is 0
    return notFirstOrLastInBlock
  else
    blockStartTime = inFunc activeMarkers[0]
    blockEndTime = outFunc activeMarkers[0]
    blockStartMarker = blockEndMarker = activeMarkers[0]

    if activeMarkers.length > 1
      for idx in [0..activeMarkers.length-1]
        iMarker = activeMarkers[idx]
        if inFunc(iMarker) < blockStartTime
          blockStartTime = inFunc iMarker
          blockStartMarker = iMarker
        if outFunc(iMarker) > blockEndTime
          blockEndTime = outFunc iMarker
          blockEndMarker = iMarker
    else
      return onlyInBlock

    thisMarker = thisSpotlightMarker()
    if blockStartMarker.time is thisMarker.time
      return firstInBlock
    else if blockEndMarker.time is thisMarker.time
      return lastInBlock
    else
      return notFirstOrLastInBlock

# Gets null or the value the opacity should be at
expValue = ->
  spotMarker = thisSpotlightMarker()
  return null unless spotMarker?

  posInBlk = positionInBlock()

  inTime = spotMarker.time
  outTime = spotMarker.time + spotMarker.duration

  if inTime - duration <= time < inTime and posInBlk isnt firstInBlock and posInBlk isnt onlyInBlock
    # If we're after the animation start and before the animation completion,
    # AND this is not the first or only highlight in this block,
    # we should animate opacity in
    progress = inTime - time
    return onValue * (1 - progress / duration)
  else if outTime <= time < outTime + duration and posInBlk isnt lastInBlock and posInBlk isnt onlyInBlock
    # If we're after the animation start at the end but before the animation end at the end,
    # AND this isn't the last or only highlight in this block
    # we should animate opacity out
    progress = time - outTime
    return onValue * (1 - progress / duration)
  else if inTime - duration <= time < outTime + duration or (posInBlk is lastInBlock or posInBlk is firstInBlock)
    # If we're inside the ol' brackets, we're firmly ON
    return onValue
  else
    # Otherwise, NOTHING
    return 0

expValue() ? value
