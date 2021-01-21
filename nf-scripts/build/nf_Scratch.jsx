var partComp, str;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

app.beginUndoGroup('Run Scratch Script');

partComp = NFProject.activeComp();

str = '{"target":{"class":"NFPageComp","name":"25_pg02 NFPage","id":2583,"numLayers":10,"pageNumber":"02","pdfNumber":"25","shapes":[{"class":"NFHighlightLayer","name":"Blue Highlight","index":1,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg02 NFPage","id":2583,"numLayers":10,"pageNumber":"02","pdfNumber":"25"}},{"class":"NFHighlightLayer","name":"Grey Highlight","index":2,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg02 NFPage","id":2583,"numLayers":10,"pageNumber":"02","pdfNumber":"25"}},{"class":"NFHighlightLayer","name":"Grey Highlight Expand","index":3,"isActiveNow":true,"inPoint":0,"outPoint":600,"containingComp":{"class":"NFPageComp","name":"25_pg02 NFPage","id":2583,"numLayers":10,"pageNumber":"02","pdfNumber":"25"}}]},"command":"switch-to-page"}';

partComp.runLayoutCommand(JSON.parse(str));

app.endUndoGroup();
