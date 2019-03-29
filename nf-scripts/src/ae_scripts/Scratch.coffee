try `#include "runtimeLibraries.jsx"`

app.beginUndoGroup 'Run Scratch Script'

# pageComps = NFProject.allPageComps()
# for pageComp in pageComps
#   highlights = pageComp.highlights()
#   highlights.forEach (highlightLayer) =>
#     if highlightLayer.isBubbled()
#       for property in NFHighlightLayer.highlighterProperties
#         expression = highlightLayer.highlighterEffect().property(property).expression
#         highlightLayer.highlighterEffect().property(property).expression = ""
#         highlightLayer.highlighterEffect().property(property).expression = expression


pageComps = NFProject.allPageComps()
for pageComp in pageComps
  for i in [1..4]
    dataLayer = pageComp.addTextLayer
      at: pageComp.allLayers().count()-1
      time: 0
    expression = NFTools.readExpression "highlight-data-expression",
      TARGET_COMP_NAME: "Part#{i}"
      PAGE_BASE_NAME: pageComp.getPageBaseName()
    dataLayer.property("Text").property("Source Text").expression = expression
    dataLayer.layer.enabled = no
    dataLayer.layer.name = "HighData-Part#{i}"

app.endUndoGroup()
