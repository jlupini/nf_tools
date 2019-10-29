makeAlert = ->
  alert 'Oh dayummmmm'
  return

openDocument = (location) ->
  alert 'Testing server'
  fileRef = new File(location)
  docRef = app.open(fileRef)
  return
