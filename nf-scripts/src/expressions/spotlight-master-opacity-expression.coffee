# These two functions let us look at markers as being wider than they are
# to account for the start and finish being outside the actual points
inFunc = (marker) ->
  return marker.time - duration
outFunc = (marker) ->
  return marker.time + marker.duration + duration

# Get all the highlight control layers for this PDF.
duration = ANIMATION_DURATION * 0.75
targetPDF = "PDF_NUMBER"

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

if activeMarkers.length is 0
  0
else
  blockStartTime = inFunc activeMarkers[0]
  blockEndTime = outFunc activeMarkers[0]
  blockStartMarker = blockEndMarker = activeMarkers[0]

  if activeMarkers.length > 1
    for idx in [1..activeMarkers.length]
      marker = activeMarkers[idx]
      if inFunc(marker) < blockStartTime
        blockStartTime = inFunc marker
        blockStartMarker = marker
      if outFunc(marker) > blockEndTime
        blockEndTime = outFunc marker
        blockEndMarker = marker

# If we're at the start of a block
if blockStartTime < time < blockStartTime + duration
  progress = time - blockStartTime
  progress / duration * value
else if blockEndTime - duration < time < blockEndTime
  progress = blockEndTime - time
  progress / duration * value
else if time < blockStartTime or time > blockEndTime
  0
else
  value
