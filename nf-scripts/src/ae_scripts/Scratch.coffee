$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '
{"target":{"class":"NFHighlightLayer","name":"Green Highlight","index":2,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg02 NFPage","id":2583,"numLayers":6,"pageNumber":"02","pdfNumber":"25"}},"command":"expose"}
'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
