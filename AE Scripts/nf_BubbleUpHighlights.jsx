(function() {
  #include "nf_functions.jsx";
  var globals, importedFunctions, main, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Bubble Up Highlights'
  };

  nf = Object.assign(importedFunctions, globals);

  main = function() {
    var pagesToBubble;
    pagesToBubble = nf.mainComp.selectedLayers;
    return nf.bubbleUpHighlights(pagesToBubble);
  };

  app.beginUndoGroup(nf.undoGroupName);

  main();

  app.endUndoGroup();

}).call(this);
