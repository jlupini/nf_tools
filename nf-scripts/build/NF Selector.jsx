#include "runtimeLibraries.jsx";
var _, getContentTree, getPanelUI, loadContentIntoView, main, openScript, panelTest;

_ = {};

panelTest = this;

openScript = function(targetScript) {
  var script, scriptFile, start_folder;
  start_folder = new Folder(new File($.fileName).parent.fsName);
  scriptFile = new File(start_folder.fsName + ("/" + targetScript));
  script = "#include '" + scriptFile.fullName + "'";
  return eval(script);
};

getContentTree = function() {
  var allPageComps, i, len, pageComp, pageHighlights, pageNumber, pdfNumber, singlePageTree, tree;
  tree = {};
  allPageComps = NFProject.allPageComps();
  for (i = 0, len = allPageComps.length; i < len; i++) {
    pageComp = allPageComps[i];
    pdfNumber = pageComp.getPDFNumber();
    pageNumber = pageComp.getPageNumber();
    if (tree[pdfNumber] == null) {
      tree[pdfNumber] = {};
    }
    singlePageTree = {};
    pageHighlights = pageComp.highlights();
    if (!pageHighlights.isEmpty()) {
      pageHighlights.forEach((function(_this) {
        return function(highlight) {
          return singlePageTree[highlight.layer.name] = highlight;
        };
      })(this));
    }
    tree[pdfNumber][pageNumber] = singlePageTree;
  }
  return tree;
};

loadContentIntoView = function(treeView) {
  var contentTree, highlightKey, key, pageKey, pageTree, pdfTree, results, thisHighlight, thisHighlightItem, thisPDFNode, thisPageNode;
  treeView.removeAll();
  contentTree = getContentTree();
  results = [];
  for (key in contentTree) {
    thisPDFNode = treeView.add('node', "PDF " + key);
    pdfTree = contentTree[key];
    for (pageKey in pdfTree) {
      pageTree = pdfTree[pageKey];
      if (pageTree.isEmpty()) {
        thisPageNode = thisPDFNode.add('item', "Page " + pageKey);
      } else {
        thisPageNode = thisPDFNode.add('node', "Page " + pageKey);
        for (highlightKey in pageTree) {
          thisHighlightItem = thisPageNode.add('item', highlightKey);
          thisHighlight = pageTree[highlightKey];
          thisHighlightItem.data = thisHighlight;
        }
        thisPageNode.expanded = false;
      }
    }
    results.push(thisPDFNode.expanded = true);
  }
  return results;
};

main = function() {
  return _.panel = getPanelUI();
};

getPanelUI = function() {
  var buttonGroup, buttonPanel, goButton, panel, panelType, refreshButton, treeView;
  if (_.panel != null) {
    return _.panel;
  }
  panel = void 0;
  if (panelTest instanceof Panel) {
    panel = panelTest;
    _.isUIPanel = true;
  } else {
    panelType = _.debug ? "dialog" : "palette";
    panel = new Window("dialog", "NF Tools");
    _.isUIPanel = false;
  }
  panel.alignChildren = 'left';
  buttonPanel = panel.add('panel', void 0, 'Selector', {
    borderStyle: 'none'
  });
  buttonPanel.alignChildren = 'left';
  buttonPanel.margins.top = 16;
  treeView = buttonPanel.add('treeview', void 0);
  treeView.preferredSize = [220, 250];
  loadContentIntoView(treeView);
  buttonGroup = buttonPanel.add('group', void 0);
  goButton = buttonGroup.add('button', void 0, 'Do it!');
  goButton.onClick = function(w) {
    alert("doing it!");
    return null;
  };
  refreshButton = buttonGroup.add('button', void 0, 'Refresh');
  refreshButton.onClick = function(w) {
    return loadContentIntoView(treeView);
  };
  panel.layout.layout(true);
  treeView.minimumSize = treeView.size;
  panel.layout.resize();
  panel.onResizing = panel.onResize = function() {
    this.layout.resize();
  };
  if (!_.isUIPanel) {
    panel.center();
    panel.show();
  }
  return panel;
};

main();
