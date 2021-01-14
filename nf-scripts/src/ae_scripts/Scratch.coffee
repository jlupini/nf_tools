$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '
{"target":{"class":"NFHighlightLayer","name":"Green Highlighter","index":2,"isActiveNow":true,"inPoint":0,"outPoint":66.6666666666667,"containingComp":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":8,"pageNumber":"01","pdfNumber":"25"}},"command":"expose"}
'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
