$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFHighlightLayer","name":"Green Highlighter","index":2,"isActiveNow":false,"inPoint":14.7147147147147,"outPoint":37.0704037370704,"containingComp":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":5,"pageNumber":"01","pdfNumber":"25"}},"command":"expose"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
