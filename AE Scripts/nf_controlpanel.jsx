(function() {
  #include "nf_functions.jsx";
  var getPanelUI, globals, importedFunctions, main, nf, panelTest, toggleGuideLayers;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem
  };

  nf = Object.assign(importedFunctions, globals);

  panelTest = this;

  main = function() {
    return nf.panel = getPanelUI();
  };

  getPanelUI = function() {
    var buttonGroup, buttonPanel, fixExpressionErrorsButton, panel, toggleGuideLayersButton;
    if (nf.panel != null) {
      return nf.panel;
    }
    panel = void 0;
    if (panelTest instanceof Panel) {
      panel = panelTest;
      nf.isUIPanel = true;
    } else {
      panel = new Window("palette", "NF Controls");
      nf.isUIPanel = false;
    }
    panel.alignChildren = 'left';
    buttonPanel = panel.add('panel', void 0, 'Buttons', {
      borderStyle: 'none'
    });
    buttonPanel.alignChildren = 'left';
    buttonPanel.margins.top = 16;
    buttonGroup = buttonPanel.add('group', void 0);
    fixExpressionErrorsButton = buttonGroup.add('button', void 0, 'Fix Expression Errors');
    toggleGuideLayersButton = buttonGroup.add('button', void 0, 'Toggle Guide Layers');
    toggleGuideLayersButton.onClick = toggleGuideLayers();
    panel.layout.layout(true);
    buttonGroup.minimumSize = buttonGroup.size;
    panel.layout.resize();
    panel.onResizing = panel.onResize = function() {
      this.layout.resize();
    };
    if (!nf.isUIPanel) {
      panel.center();
      panel.show();
    }
    return panel;
  };

  toggleGuideLayers = function() {
    var guideReferenceComp, precompsFolder;
    app.beginUndoGroup('Toggle Guide Layers');
    precompsFolder = nf.findItem('Precomps');
    if (precompsFolder != null) {
      guideReferenceComp = nf.findItemIn('Guide Reference', precompsFolder);
    }
    if (guideReferenceComp == null) {
      alert("Upgrading Guide Layers!\nThis project uses an older guide layer toggle style. Upgrading to the new version - This may take a minute.");
    }
    return app.endUndoGroup();
  };

  main();

}).call(this);
