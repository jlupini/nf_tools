(function() {
  #include "nf_functions.jsx";
  var getPanelUI, globals, guideReference, importedFunctions, main, nf, panelTest, toggleGuideLayers, videoProject;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    isDialog: false
  };

  nf = Object.assign(importedFunctions, globals);

  panelTest = this;

  main = function() {
    return nf.panel = getPanelUI();
  };

  getPanelUI = function() {
    var buttonGroup, buttonPanel, panel, panelType;
    if (nf.panel != null) {
      return nf.panel;
    }
    panel = void 0;
    if (panelTest instanceof Panel) {
      panel = panelTest;
      nf.isUIPanel = true;
    } else {
      panelType = nf.isDialog ? "dialog" : "palette";
      panel = new Window("dialog", "NF Controls");
      nf.isUIPanel = false;
    }
    panel.alignChildren = 'left';
    buttonPanel = panel.add('panel', void 0, 'Controls', {
      borderStyle: 'none'
    });
    buttonPanel.alignChildren = 'left';
    buttonPanel.margins.top = 16;
    buttonGroup = buttonPanel.add('group', void 0);
    nf.toggleGuideLayersButton = buttonGroup.add('button', void 0, 'Toggle Guide Layers');
    nf.toggleGuideLayersButton.onClick = function(w) {
      return toggleGuideLayers();
    };
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

  videoProject = {
    precompsFolder: function() {
      return nf.findItem('Precomps');
    },
    PDFPrecompsFolder: function() {
      return nf.findItem('PDF Precomps');
    },
    partsFolder: function() {
      return nf.findItem('Parts');
    }
  };

  guideReference = {
    compName: 'Guide Reference',
    layerName: 'Guide Visibility',
    effectName: 'Guide Layer',
    comp: function() {
      if (videoProject.precompsFolder() != null) {
        return nf.findItemIn('Guide Reference', videoProject.precompsFolder());
      } else {
        return null;
      }
    },
    layer: function() {
      var layerCollection, ref;
      if (this.comp() == null) {
        return null;
      }
      layerCollection = (ref = this.comp()) != null ? ref.layers : void 0;
      if ((layerCollection != null ? layerCollection.length : void 0) === 0) {
        alert("No layers in Guide Reference Comp");
        return null;
      } else {
        return layerCollection[1];
      }
    },
    create: function() {
      if ((this.comp() != null) || (this.layer() != null) || (videoProject.precompsFolder() == null)) {
        return null;
      }
      videoProject.precompsFolder().items.addComp(this.compName, 1920, 1080, 1.0, 1, 30);
      this.comp().layers.addNull();
      this.layer().name = this.layerName;
      return this.layer();
    },
    visible: function() {
      var ref;
      return (ref = this.layer()) != null ? ref.enabled : void 0;
    },
    setVisible: function(newVisibility) {
      var ref;
      if ((ref = this.layer()) != null) {
        ref.enabled = newVisibility;
      }
      return this.layer();
    }
  };

  toggleGuideLayers = function() {
    var guideEffect, guideLayer, i, j, k, len, len1, len2, pagePrecomps, partLayers, parts, ref, ref1, ref2, theLayer, thePageComp, thePartComp;
    if (guideReference.comp() == null) {
      alert("Upgrading Guide Layers!\nThis project uses an older guide layer toggle style. Upgrading to the new version - This may take a minute.");
      app.beginUndoGroup('Toggle Guide Layers');
      guideReference.create();
      pagePrecomps = nf.collectionToArray(videoProject.PDFPrecompsFolder().items);
      for (i = 0, len = pagePrecomps.length; i < len; i++) {
        thePageComp = pagePrecomps[i];
        guideLayer = thePageComp.layers.byName("Annotation Guide");
        if (guideLayer != null) {
          guideEffect = (ref = guideLayer.property("Effects")) != null ? ref.property(guideReference.effectName) : void 0;
          if (guideEffect != null) {
            guideEffect.remove();
          }
          guideLayer.property("Transform").property("Opacity").expression = "comp(\"" + guideReference.compName + "\").layer(\"" + guideReference.layerName + "\").enabled * 60";
        }
      }
      parts = nf.toArr((ref1 = videoProject.partsFolder()) != null ? ref1.items : void 0);
      for (j = 0, len1 = parts.length; j < len1; j++) {
        thePartComp = parts[j];
        partLayers = nf.toArr(thePartComp.layers);
        for (k = 0, len2 = partLayers.length; k < len2; k++) {
          theLayer = partLayers[k];
          guideEffect = (ref2 = theLayer.property("Effects")) != null ? ref2.property(guideReference.effectName) : void 0;
          if (guideEffect != null) {
            guideEffect.remove();
          }
        }
      }
      app.endUndoGroup();
    }
    app.beginUndoGroup('Toggle Guide Layers');
    guideReference.setVisible(!guideReference.visible());
    return app.endUndoGroup();
  };

  main();

}).call(this);
