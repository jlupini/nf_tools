(function() {
  #include "nf_runtimeLibraries.jsx";
  var NF, _, main;

  NF = app.NF;

  _ = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Bubble Up Highlights'
  };

  main = function() {
    var pagesToBubble;
    pagesToBubble = _.mainComp.selectedLayers;
    return NF.Util.bubbleUpHighlights(pagesToBubble);
  };

  app.beginUndoGroup(_.undoGroupName);

  main();

  app.endUndoGroup();

}).call(this);
