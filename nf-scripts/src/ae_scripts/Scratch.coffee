$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFPageComp","name":"26_pg01 NFPage","id":2663,"numLayers":3,"pageNumber":"01","pdfNumber":"26","shapes":[]},"command":"fullscreen-title"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
