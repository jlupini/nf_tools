$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFReferencePageLayer","name":"25_pg01 [ref] <Green Highlighter> {a}","index":4,"isActiveNow":true,"inPoint":7.64097430764097,"outPoint":599.966633299967,"containingComp":{"class":"NFPartComp","name":"Part 1","id":3601,"numLayers":11}},"command":"anchor"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
