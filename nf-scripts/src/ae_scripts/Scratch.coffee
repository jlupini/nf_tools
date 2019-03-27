try `#include "runtimeLibraries.jsx"`

app.beginUndoGroup 'Run Scratch Script'

parts = NFProject.allPartComps()
targetValue = null
for part in parts
  spotlightLayers = part.searchLayers "Spotlight"
  spotlightLayers.forEach (spotlight) =>
    masks = spotlight.property("Masks")
    maskCount = masks.numProperties
    for i in [1..maskCount]
      mask = masks.property(i)
      unless mask.name is "Dummy"
        featherProp = mask.property("Mask Feather")
        if featherProp.value[0] is 0
          featherProp.setValue [80,80]
        else
          featherProp.setValue [0,0]

app.endUndoGroup()
