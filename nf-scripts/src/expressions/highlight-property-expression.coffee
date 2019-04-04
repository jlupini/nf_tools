targetComp = comp('TARGET_COMP_NAME')
controlLayer = targetComp.layer('CONTROL_LAYER_NAME')
targetPage = 'PAGE_BASE_NAME'

# Get our matching page layer. DON'T CHANGE ANYTHING ABOVE THIS LINE or it will
# break the 'update highlight expressions' script.
activeBabby = null

# For animating completion, we need to know the offset based on the start time
# of the page layer. For everything else, we can assume it's fixed.
if thisProperty.name is "Completion"

  # Grab our relevant layers from the text data layer
  dataLayer = thisComp.layer "HighData-#{targetComp.name}"
  dataLayerText = dataLayer("Text")("Source Text").valueAtTime 0
  searchPointString = "allMatchingLayers:["
  preIndex = dataLayerText.indexOf searchPointString
  endIndex = preIndex + dataLayerText.substring(preIndex).indexOf("]")
  dataString = dataLayerText.substring(preIndex + searchPointString.length, endIndex)
  dataArr = dataString.split(",")

  for i in dataArr
    theLayer = targetComp.layer parseInt(i)
    if theLayer.name.indexOf(targetPage) >= 0
      rightNow = theLayer.startTime + time
      if theLayer.inPoint <= rightNow <= theLayer.outPoint
        activeBabby = theLayer
        break

if activeBabby?
  offsetTime = activeBabby.startTime
else
  offsetTime = 0

controlLayer.effect('HIGHLIGHT_NAME')('HIGHLIGHTER_PROPERTY').valueAtTime time + offsetTime
