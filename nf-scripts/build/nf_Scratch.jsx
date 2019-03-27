var j, len, part, parts, spotlightLayers, targetValue;

try {
  #include "runtimeLibraries.jsx";
} catch (undefined) {}

app.beginUndoGroup('Run Scratch Script');

parts = NFProject.allPartComps();

targetValue = null;

for (j = 0, len = parts.length; j < len; j++) {
  part = parts[j];
  spotlightLayers = part.searchLayers("Spotlight");
  spotlightLayers.forEach((function(_this) {
    return function(spotlight) {
      var featherProp, i, k, mask, maskCount, masks, ref, results;
      masks = spotlight.property("Masks");
      maskCount = masks.numProperties;
      results = [];
      for (i = k = 1, ref = maskCount; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
        mask = masks.property(i);
        if (mask.name !== "Dummy") {
          featherProp = mask.property("Mask Feather");
          if (featherProp.value[0] === 0) {
            results.push(featherProp.setValue([80, 80]));
          } else {
            results.push(featherProp.setValue([0, 0]));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
  })(this));
}

app.endUndoGroup();
