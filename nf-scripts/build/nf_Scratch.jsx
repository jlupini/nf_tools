var dataLayer, expression, i, j, k, len, pageComp, pageComps;

try {
  #include "runtimeLibraries.jsx";
} catch (undefined) {}

app.beginUndoGroup('Run Scratch Script');

pageComps = NFProject.allPageComps();

for (j = 0, len = pageComps.length; j < len; j++) {
  pageComp = pageComps[j];
  for (i = k = 1; k <= 4; i = ++k) {
    dataLayer = pageComp.addTextLayer({
      at: pageComp.allLayers().count() - 1,
      time: 0
    });
    expression = NFTools.readExpression("highlight-data-expression", {
      TARGET_COMP_NAME: "Part" + i,
      PAGE_BASE_NAME: pageComp.getPageBaseName()
    });
    dataLayer.property("Text").property("Source Text").expression = expression;
    dataLayer.layer.enabled = false;
    dataLayer.layer.name = "HighData-Part" + i;
  }
}

app.endUndoGroup();
