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
