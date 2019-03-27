# These two functions let us look at markers as being wider than they are
# to account for the start and finish being outside the actual points
inFunc = (mark) ->
  return mark.time
outFunc = (mark) ->
  return mark.time + mark.duration

# Get all the highlight control layers for this PDF.
duration = ANIMATION_DURATION
targetPDF = "PDF_NUMBER"

babbies = []
spotlightMarkers = []
activeMarkers = []

# Grab our relevant layers from the text data layer
dataLayer = thisComp.layer "SpotData"
dataLayerText = dataLayer("Text")("Source Text").valueAtTime 0
searchPointString = "PDF#{targetPDF}:["
preIndex = dataLayerText.indexOf searchPointString
endIndex = preIndex + dataLayerText.substring(preIndex).indexOf("]")
dataString = dataLayerText.substring(preIndex + searchPointString.length, endIndex)
dataArr = dataString.split(",")

activeMarkers = []
nearestMarker = null

for i in dataArr
  theLayer = thisComp.layer parseInt(i)
  if theLayer.name.indexOf(targetPDF + " -") is 0 and theLayer.name.indexOf("Highlight Control") >= 0
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
    for idx in [0..activeMarkers.length-1]
      iMarker = activeMarkers[idx]
      if inFunc(iMarker) < blockStartTime
        blockStartTime = inFunc iMarker
        blockStartMarker = iMarker
      if outFunc(iMarker) > blockEndTime
        blockEndTime = outFunc iMarker
        blockEndMarker = iMarker

# Figure out if something changes during the opening animation, to fix a
# jump bug caused by lack of lookahead/lookbehind
blockChangeInMarker = null
blockChangeOutMarker = null
for spMark in spotlightMarkers
  if blockStartTime < outFunc(spMark) < blockStartTime + duration
    blockChangeInMarker = spMark
  if blockEndTime - duration < inFunc(spMark) < blockEndTime
    blockChangeOutMarker = spMark
somethingElseEndsDuringTheOpening = blockChangeInMarker?
somethingElseStartsDuringTheClosing = blockChangeOutMarker?

timeIsWithinAllAnimation = blockStartTime <= time < blockEndTime
timeIsWithinOpeningAnimation = blockStartTime < time < blockStartTime + duration
timeIsWithinClosingAnimation = blockEndTime - duration < time < blockEndTime

# If we're at the start of a block
if timeIsWithinAllAnimation
  if timeIsWithinOpeningAnimation
    if somethingElseEndsDuringTheOpening
      value
    else
      progress = time - blockStartTime
      progress / duration * value
  else if timeIsWithinClosingAnimation
    if somethingElseStartsDuringTheClosing
      value
    else
      progress = blockEndTime - time
      progress / duration * value
  else
    value
else
  0
