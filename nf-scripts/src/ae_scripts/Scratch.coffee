$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFHighlightLayer","name":"Grey Highlight Expand","index":3,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg02 NFPage","id":2583,"numLayers":11,"pageNumber":"02","pdfNumber":"25"}},"command":"expand"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
