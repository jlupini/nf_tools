onValue = ON_VALUE
duration = ANIMATION_DURATION
controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME")
targetPDF = "PDF_NUMBER"

spotlightMarkers = []

firstInBlock = 101
lastInBlock = 202
onlyInBlock = 252
notFirstOrLastInBlock = 303

inFunc = (mark) ->
  return mark.time
outFunc = (mark) ->
  return mark.time + mark.duration

# Gets an array of the active markers at this time
activeMarkersAtTime = ->
  babbies = []
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
            activeMarkers.push testMarker if adjIn <= time < adjOut

    i++
  return activeMarkers

# Gets the nearest spotlight marker on this layer
nearestSpotlightMarker = ->
  nearestMarker = null
  if controlLayer.marker.numKeys > 0
    for idx in [1..controlLayer.marker.numKeys]
      testMarker = controlLayer.marker.key(idx)
      if testMarker.comment is "Spotlight"
        # Return immediately if the time is actually inside this marker
        testMarkIn = inFunc testMarker
        testMarkOut = outFunc testMarker

        if testMarkIn <= time <= testMarkOut
          return testMarker
        else if nearestMarker?
          timeToIn = Math.abs(time - testMarkIn)
          timeToOut = Math.abs(time - testMarkOut)
          prevTimeToIn = Math.abs(time - inFunc(nearestMarker))
          prevTimeToOut = Math.abs(time - outFunc(nearestMarker))

          min = Math.min timeToIn, timeToOut, prevTimeToIn, prevTimeToOut
          if min is timeToIn or min is timeToOut
            nearestMarker = testMarker
        else
          nearestMarker = testMarker

    return nearestMarker
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
        if inFunc(iMarker) <= blockStartTime
          blockStartTime = inFunc iMarker
          blockStartMarker = iMarker
        if outFunc(iMarker) > blockEndTime
          blockEndTime = outFunc iMarker
          blockEndMarker = iMarker
    else
      return onlyInBlock

    thisMarker = nearestSpotlightMarker()
    if blockStartMarker.time is thisMarker.time
      return firstInBlock
    else if blockEndMarker.time is thisMarker.time
      return lastInBlock
    else
      return notFirstOrLastInBlock

# Gets null or the value the opacity should be at
expValue = ->
  spotMarker = nearestSpotlightMarker()
  return null unless spotMarker?

  posInBlk = positionInBlock()

  inTime = inFunc spotMarker
  outTime = outFunc spotMarker

  isntFirstOrOnly = posInBlk isnt firstInBlock and posInBlk isnt onlyInBlock
  isntLastOrOnly = posInBlk isnt lastInBlock and posInBlk isnt onlyInBlock
  timeIsWithinOpeningAnimation = inTime <= time < inTime + duration
  timeIsWithinClosingAnimation = outTime - duration <= time < outTime
  timeIsWithinAllAnimation = inTime <= time < outTime

  # Figure out if something changes during the opening animation, to fix a
  # jump bug caused by lack of lookahead/lookbehind
  blockChangeInMarker = null
  blockChangeOutMarker = null
  for spMark in spotlightMarkers
    if inTime < outFunc(spMark) < inTime + duration
      blockChangeInMarker = spMark
    if outTime - duration < inFunc(spMark) < outTime
      blockChangeOutMarker = spMark
  somethingElseEndsDuringTheOpening = blockChangeInMarker?
  somethingElseStartsDuringTheClosing = blockChangeOutMarker?

  # First of all, where are we relative to the key marker?
  if timeIsWithinAllAnimation
    if timeIsWithinOpeningAnimation
      if isntFirstOrOnly or somethingElseEndsDuringTheOpening
        progress = inTime + duration - time
        return onValue * (1 - progress / duration)
    else if timeIsWithinClosingAnimation
      if isntLastOrOnly or somethingElseStartsDuringTheClosing
        progress = time - outTime + duration
        return onValue * (1 - progress / duration)
    else
      return onValue
  else
    return 0

expValue() ? value
