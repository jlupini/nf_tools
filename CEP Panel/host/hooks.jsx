var createHighlightFromAnnotation, getActivePage, getCompName, loadNFLibraries, openDocument, processRawAnnotationData;

openDocument = function(location) {
  var docRef, fileRef;
  alert('Testing server');
  fileRef = new File(location);
  docRef = app.open(fileRef);
};

loadNFLibraries = function() {
  var loc;
  loc = "/Users/jlupini/Documents/nf_tools/nf-scripts/build/runtimeLibraries.jsx";
  return $.evalFile(loc);
};

getCompName = function() {
  return NFProject.activeComp().getName();
};

getActivePage = function() {
  var activeComp;
  activeComp = NFProject.activeComp();
  if (activeComp instanceof NFPageComp) {
    return activeComp.getPDFLayer().layer.source.file.fsName;
  } else {
    return null;
  }
};

processRawAnnotationData = function(rawData) {
  return NFPDFManager.processRawAnnotationData(rawData);
};

createHighlightFromAnnotation = function(annotationDataString) {
  var annotData, annotationLayer, key, newColor, ref, targetComp, testColor;
  app.beginUndoGroup("Create Highlight from Annotation");
  annotData = JSON.parse(annotationDataString);
  targetComp = NFProject.activeComp();
  annotationLayer = targetComp.addShapeLayer();
  annotationLayer.addRectangle({
    fillColor: annotData.color,
    rect: annotData.rect
  });
  annotationLayer.transform().scale.setValue(targetComp != null ? targetComp.getPDFLayer().transform().scale.value : void 0);
  if (annotData.lineCount === 0) {
    annotationLayer.transform("Opacity").setValue(20);
    annotationLayer.setName("Imported PDF Shape: " + annotData.cleanName);
  } else {
    ref = NFHighlightLayer.COLOR;
    for (key in ref) {
      testColor = ref[key];
      if (annotData.colorName.indexOf(testColor.str) >= 0) {
        newColor = testColor;
      }
    }
    targetComp.createHighlight({
      shapeLayer: annotationLayer,
      lines: annotData.lineCount,
      name: annotData.cleanName,
      color: newColor
    });
    annotationLayer.remove();
  }
  return app.endUndoGroup();
};
