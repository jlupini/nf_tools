$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFPageLayer","name":"26_pg01 [+]","index":3,"isActiveNow":true,"inPoint":1.56823490156823,"outPoint":601.534868201535},"command":"shrink-page"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
