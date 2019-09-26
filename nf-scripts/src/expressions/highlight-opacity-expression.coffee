targetComp = comp('TARGET_COMP_NAME')
controlLayer = targetComp.layer('CONTROL_LAYER_NAME')
targetPage = 'PAGE_BASE_NAME'
highlightName = 'HIGHLIGHT_NAME'

# Get the in and out points of the control layer.
# Don't edit anything above this if you want to use the update expression scripts
controlIn = controlLayer.inPoint
controlOut = controlLayer.outPoint
endless = controlLayer.effect('Highlight Control')('Endless').value == 1
duration = controlLayer.effect('Highlight Control')('Opacity Duration').value
targetValue = controlLayer.effect(highlightName)("Opacity").value

# Get our matching page layer!

activeBabbies = []
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
  if theLayer.name.indexOf(targetPage) is 0
    activeBabbies.push theLayer
    if theLayer.inPoint < controlIn < theLayer.outPoint
      activeAtControlIn = theLayer
    if theLayer.inPoint < controlOut < theLayer.outPoint
      activeAtControlOut = theLayer

# If we don't have activeAtControlIn or Out, let's get the first and last active
unless activeAtControlIn?
  activeAtControlIn = activeBabbies[0]
  i = 0
  while i < activeBabbies.length
    if activeBabbies[i].inPoint < activeAtControlIn.inPoint
      activeAtControlIn = activeBabbies[i]
    i++
unless activeAtControlOut?
  activeAtControlOut = activeBabbies[0]
  i = 0
  while i < activeBabbies.length
    if activeBabbies[i].inPoint < activeAtControlOut.outPoint
      activeAtControlOut = activeBabbies[i]
    i++

# Let's translate those to relative control ins and outs
relControlIn = controlIn - (activeAtControlIn.startTime)
relControlOut = controlOut - (activeAtControlOut.startTime)
relInAnimPeak = relControlIn + duration
relOutAnimPeak = relControlOut - duration

if time <= relControlIn
  0
else if relControlIn < time < relInAnimPeak
  progress = time - relControlIn
  progress / duration * targetValue
else
  if endless or time <= relOutAnimPeak
    targetValue
  else if relOutAnimPeak < time < relControlOut
    progress = time - relOutAnimPeak
    (1 - (progress / duration)) * targetValue
  else
    0
