(function() {
  #include "nf_functions.jsx";
  var clear, globals, importedFunctions, main, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Testing',
    selectedLayer: app.project.activeItem.selectedLayers[0]
  };

  nf = Object.assign(importedFunctions, globals);

  clear = function() {
    return nf.disconnectBubbleupsInLayers(app.project.activeItem.selectedLayers);
  };

  main = function() {
    var highlight, highlightName, i, pageTree, thePage, tree, w;
    pageTree = nf.pageTreeForPaper(nf.selectedLayer);
    w = new Window('dialog');
    tree = w.add('treeview', [0, 0, 250, 350]);
    pageTree.node = tree.add('node', pageTree.name);
    i = 0;
    while (i < pageTree.pages.length) {
      thePage = pageTree.pages[i];
      thePage.node = pageTree.node.add('node', thePage.name);
      for (highlightName in thePage.highlights) {
        highlight = thePage.highlights[highlightName];
        highlight.item = thePage.node.add('item', highlight.name);
      }
      thePage.node.expanded = true;
      i++;
    }
    pageTree.node.expanded = true;
    return w.show();
  };

  app.beginUndoGroup(nf.undoGroupName);

  main();

  app.endUndoGroup();

}).call(this);
