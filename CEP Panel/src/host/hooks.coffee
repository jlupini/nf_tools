makeAlert = ->
  alert 'Oh dayummmmm'
  return

openDocument = (location) ->
  alert 'Testing server'
  fileRef = new File(location)
  docRef = app.open(fileRef)
  return

loadNFLibraries = (directory) ->
  loc = "/Users/jlupini/Documents/nf_tools/nf-scripts/build/runtimeLibraries.jsx"
  $.evalFile(loc)
  alert "NF Libraries Reloaded"

getCompName = ->
  return NFProject.activeComp().getName()

getActivePage = ->
  return NFProject.activeComp().getPDFLayer().layer.source.file.fsName

processRawAnnotationData = (rawData) ->
  return NFPDFManager.processRawAnnotationData rawData

createHighlightFromAnnotation = (annotationDataString) ->
  app.beginUndoGroup "Create Highlight from Annotation"

  annotData = JSON.parse annotationDataString

  targetComp = NFProject.activeComp()

  # Actually add the shapes and stuff
  annotationLayer = targetComp.addShapeLayer()
  annotationLayer.addRectangle
    fillColor: annotData.color
    rect: annotData.rect

  annotationLayer.transform().scale.setValue targetComp?.getPDFLayer().transform().scale.value

  if annotData.lineCount is 0
    annotationLayer.transform("Opacity").setValue 20
    annotationLayer.setName "Imported PDF Shape: #{annotData.cleanName}"
  else
    for key, testColor of NFHighlightLayer.COLOR
      newColor = testColor if annotData.colorName.indexOf(testColor.str) >= 0

    # Create the highlight effect
    targetComp.createHighlight
      shapeLayer: annotationLayer
      lines: annotData.lineCount
      name: annotData.cleanName
      color: newColor

    annotationLayer.remove()

  app.endUndoGroup()
