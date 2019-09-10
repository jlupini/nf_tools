var testLayer;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

app.beginUndoGroup('Run Scratch Script');

testLayer = NFProject.activeComp().selectedLayers().get(0);

testLayer.centerAnchorPoint();

app.endUndoGroup();
