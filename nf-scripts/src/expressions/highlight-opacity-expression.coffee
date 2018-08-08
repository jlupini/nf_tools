targetComp = comp('TARGET_COMP_NAME')
controlLayer = targetComp.layer('CONTROL_LAYER_NAME')
targetPage = 'PAGE_BASE_NAME'
highlightName = 'HIGHLIGHT_NAME'

# Get the in and out points of the control layer
controlIn = controlLayer.inPoint
controlOut = controlLayer.outPoint
endless = controlLayer.effect('Highlight Control')('Endless').value == 1
duration = controlLayer.effect('Highlight Control')('Opacity Duration').value
targetValue = controlLayer.effect(highlightName)("Opacity").value

# Get our matching page layer
activeBabbies = []
numLayers = targetComp.numLayers

i = 1
while i <= numLayers
  theLayer = targetComp.layer(i)
  if theLayer.name.indexOf(targetPage) >= 0
    activeBabbies.push theLayer
    if theLayer.inPoint < controlIn < theLayer.outPoint
      activeAtControlIn = theLayer
    if theLayer.inPoint < controlOut < theLayer.outPoint
      activeAtControlOut = theLayer
  i++

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
