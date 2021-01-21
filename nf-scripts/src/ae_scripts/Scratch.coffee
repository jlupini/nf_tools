$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

partComp = NFProject.activeComp()

str = '{"target":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":23,"pageNumber":"01","pdfNumber":"25","shapes":[{"class":"NFHighlightLayer","name":"Orange Highlight","index":1,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":23,"pageNumber":"01","pdfNumber":"25"}},{"class":"NFHighlightLayer","name":"Green Highlight","index":2,"isActiveNow":true,"inPoint":0,"outPoint":66.6666666666667,"containingComp":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":23,"pageNumber":"01","pdfNumber":"25"}},{"class":"NFHighlightLayer","name":"Yellow Highlight","index":3,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":23,"pageNumber":"01","pdfNumber":"25"}},{"class":"NFShapeLayer","name":"Shape Layer 1","index":4,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg01 NFPage","id":2597,"numLayers":23,"pageNumber":"01","pdfNumber":"25"}}]},"command":"add-small"}'

partComp.runLayoutCommand JSON.parse(str)

app.endUndoGroup()
