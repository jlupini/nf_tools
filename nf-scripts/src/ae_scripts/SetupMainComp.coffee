$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Setup Main Comp'

fileName = decodeURIComponent app.project.file.name
mainCompName = fileName.substr(0, fileName.indexOf('.')) + ' - MainComp'
footageFile = app.project.selection[0]
throw new Error "No footage file selected!" unless footageFile?

# Check that all the other assets we need exist
backdropFileName = "nf-bg-v01.ai"
dotOverlayFileName = "particular-bg-overlay-v01.mov"
backdropFile = NFProject.findItem backdropFileName
dotOverlayFile = NFProject.findItem dotOverlayFileName
throw new Error "Can't find dependent files in the project" unless backdropFile? and dotOverlayFile?

# Make the main comp and add footage
mainComp = app.project.items.addComp(mainCompName, 1920, 1080, 1.0, footageFile.duration, 29.9700012207031)
footageLayer = mainComp.layers.add footageFile
footageLayer.property('Transform').property("Scale").setValue [50, 50]

# Get number of markers on layer
markerStream = footageLayer.property('Marker')
markerCount = markerStream.numKeys

# create new background layer
bgLayer = mainComp.layers.addSolid([1,1,1], 'Background', 1920, 1080, 1)
bgLayer.moveBefore footageLayer

# Populate the Parts
newComps = []
prevTime = 0
# Make a folder for the new Precomps
rootFolder = app.project.rootFolder
partsFolder = app.project.items.addFolder('Parts')

# For each marker, duplicate the audio layer, set in and out points, then precompose
for i in [1..markerCount+1]
  duplicatedFootageLayer = footageLayer.duplicate()
  duplicatedFootageLayer.inPoint = prevTime
  if i is markerCount + 1
    currentTime = duplicatedFootageLayer.outPoint = mainComp.duration
  else
    currentMarker = markerStream.keyValue i
    currentTime = duplicatedFootageLayer.outPoint = markerStream.keyTime i

  newCompName = "Part #{i}"
  newComp = mainComp.layers.precompose [duplicatedFootageLayer.index], newCompName, true
  precomposedFootageLayer = newComp.layers[1]

  backdropLayer = newComp.layers.add backdropFile
  dotOverlayLayer = newComp.layers.add dotOverlayFile
  backdropLayer.name = "NF Backdrop"
  dotOverlayLayer.name = "Dot Overlay"
  dotOverlayLayer.blendingMode = BlendingMode.SCREEN

  dotOverlayLayer.moveAfter precomposedFootageLayer
  backdropLayer.moveAfter dotOverlayLayer

  newComps.push newComp
  newComp.parentFolder = partsFolder

  newCompLayer = mainComp.layers.byName(newCompName)
  unless markerCount is 0
    newCompLayer.inPoint = prevTime - 3
    newCompLayer.outPoint = currentTime + 10

  newCompLayer.audioEnabled = no
  newComp.bgColor = [1,1,1]
  newCompLayer.moveToBeginning()
  prevTime = currentTime

fadeLayer = mainComp.layers.addSolid([1,1,1], 'Fade In/Out', 1920, 1080, 1)
fadeOpacity = fadeLayer.property('Transform').property('Opacity')
fadeOpacity.setValuesAtTimes [0, 1, mainComp.duration - 2.5, mainComp.duration], [100, 0, 0, 100]
fadeLayer.moveToBeginning()

footageLayer.remove()

app.endUndoGroup()
