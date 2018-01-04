(function() {
  #include "nf_functions.jsx";
  var globals, importedFunctions, main, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Testing',
    selectedLayer: app.project.activeItem.selectedLayers[0]
  };

  nf = Object.assign(importedFunctions, globals);

  main = function() {
    var allKeys, i, ins, insArr, instructionString, key, keyTime, layer, marker, numKeys, property, results;
    instructionString = "66 gunderlineq|URL 38-10 Does Cell Phone Radiation Cause Cancer?|23|19gq|expand|expand|f2|circle u|y|expand|b|expand|17bq|gunderline|u|23yq|g|expand|underline “faster reaction time”|20|y|30|underline “biopositive”|g|expand|back to 20y then t3|9|y|29|f1|g|6|g|expand|15|21|y|21y|expand|expand|b|1bq|expand|";
    insArr = instructionString.split("|");
    layer = nf.selectedLayer;
    property = layer.property("Text").property("Source Text");
    numKeys = property.numKeys;
    allKeys = (function() {
      var j, ref, results;
      results = [];
      for (key = j = 1, ref = numKeys; 1 <= ref ? j <= ref : j >= ref; key = 1 <= ref ? ++j : --j) {
        results.push(property.keyTime(key));
      }
      return results;
    })();
    i = 0;
    results = [];
    while (i < numKeys) {
      keyTime = allKeys[i];
      ins = insArr[i];
      marker = new MarkerValue(ins);
      layer.property('Marker').setValueAtTime(keyTime, marker);
      results.push(i++);
    }
    return results;
  };

  app.beginUndoGroup(nf.undoGroupName);

  main();

  app.endUndoGroup();

}).call(this);
