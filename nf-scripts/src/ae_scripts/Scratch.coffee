$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFPageComp","name":"26_pg02 NFPage","id":2679,"numLayers":6,"pageNumber":"02","pdfNumber":"26","shapes":[{"class":"NFHighlightLayer","name":"Highlighter 2","index":1,"isActiveNow":null,"inPoint":4.33767100433767,"outPoint":604.337671004338,"containingComp":{"class":"NFPageComp","name":"26_pg02 NFPage","id":2679,"numLayers":6,"pageNumber":"02","pdfNumber":"26"}},{"class":"NFHighlightLayer","name":"Highlighter","index":2,"isActiveNow":null,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"26_pg02 NFPage","id":2679,"numLayers":6,"pageNumber":"02","pdfNumber":"26"}}]},"command":"switch-to-page"}'
partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
