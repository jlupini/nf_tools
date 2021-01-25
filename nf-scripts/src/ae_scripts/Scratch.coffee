$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

activeComp = NFProject.activeComp()
selectedLayer = activeComp.selectedLayers()
if selectedLayer.count() is 1
  selectedLayer = selectedLayer.get(0)

  selection = app.project.selection
  browserImage = NFProject.findItem "safari-browser-v01.ai"

  webCompsFolder = NFProject.findItem "Website Comps"
  unless webCompsFolder
    assetsFolder = NFProject.findItem "Assets"
    webCompsFolder = assetsFolder.items.addFolder "Website Comps"

  webComp = webCompsFolder.items.addComp("Browser - #{selectedLayer.getName()}", 1920, 1080, 1, 600, 30)

  browserLayer = new NFLayer webComp.layers.add(browserImage)
  browserLayer.transform("Scale").setValue [417.4, 417.4]
  browserLayer.transform("Anchor Point").setValue [0, 0]
  browserLayer.transform("Position").setValue [0, 0]
  browserLayer.$.collapseTransformation = true

  footageLayer = new NFLayer webComp.layers.add(selectedLayer.$.source)
else alert "wrong number of layers selected" 


app.endUndoGroup()
