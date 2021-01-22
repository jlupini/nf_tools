$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFPageLayer","name":"25_pg01 [+] (a)","index":3,"inPoint":0.83416750083417,"outPoint":600.834167500834,"containingComp":{"class":"NFPartComp","name":"Part 1","id":3601,"numLayers":7},"pageNumber":"01","pdfNumber":"25"},"command":"shrink-page"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
