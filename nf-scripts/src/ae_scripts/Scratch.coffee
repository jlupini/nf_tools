$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"id":2679,"type":"pageComp","pageNumber":"02","displayName":"Page 02","compName":"26_pg02 NFPage","shapes":[{"type":"shape","layerName":"Highlighter 2","displayName":"Highlighter 2 (HL)","highlight":true},{"type":"shape","layerName":"Highlighter","displayName":"Highlighter (HL)","highlight":true}]}}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
