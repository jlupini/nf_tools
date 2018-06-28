#include "runtimeLibraries.jsx";
var _, getPanelUI, main, panelTest, toolRegistry;

_ = {};

panelTest = this;

toolRegistry = {
  renamePDFPrecomps: {
    name: "Rename PDF Precomps",
    callback: function(w) {
      var i, item, j, precompFolder, ref, results;
      precompFolder = NFProject.findItem("PDF Precomps");
      if ((precompFolder != null ? precompFolder.typeName : void 0) !== "Folder") {
        throw new Error("Couldn't get the PDF Precomp folder");
      }
      results = [];
      for (i = j = 1, ref = precompFolder.numItems; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        item = precompFolder.item(i);
        results.push(item.name = item.name.replace('.pdf', ' NFPage'));
      }
      return results;
    }
  }
};

main = function() {
  return _.panel = getPanelUI();
};

getPanelUI = function() {
  var buttonGroup, buttonPanel, panel, panelType;
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
  buttonPanel = panel.add('panel', void 0, 'Controls', {
    borderStyle: 'none'
  });
  buttonPanel.alignChildren = 'left';
  buttonPanel.margins.top = 16;
  buttonGroup = buttonPanel.add('group', void 0);
  _.toggleGuideLayersButton = buttonGroup.add('button', void 0, toolRegistry.renamePDFPrecomps.name);
  _.toggleGuideLayersButton.onClick = function(w) {
    toolRegistry.renamePDFPrecomps.callback(w);
    return this.active = false;
  };
  panel.layout.layout(true);
  buttonGroup.minimumSize = buttonGroup.size;
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
