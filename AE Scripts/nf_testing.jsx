(function() {
  #include "nf_runtimeLibraries.jsx";
  var NF, _, clear, main;

  NF = app.NF;

  _ = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Testing',
    selectedLayer: app.project.activeItem.selectedLayers[0]
  };

  clear = function() {
    return NF.Util.disconnectBubbleupsInLayers(app.project.activeItem.selectedLayers);
  };

  main = function() {
    var highlight, highlightName, i, pageTree, thePage, tree, w;
    pageTree = NF.Util.pageTreeForPaper(_.selectedLayer);
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

  app.beginUndoGroup(_.undoGroupName);

  main();

  app.endUndoGroup();

}).call(this);
