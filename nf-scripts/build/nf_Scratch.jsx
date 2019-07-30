var lines, shapeLayer;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

app.beginUndoGroup('Run Scratch Script');

shapeLayer = NFProject.activeComp().selectedLayers().get(0);

lines = 4;

NFProject.activeComp().createHighlight({
  shapeLayer: shapeLayer,
  lines: lines
});

app.endUndoGroup();
