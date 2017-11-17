(function() {
  #include "nf_functions.jsx";
  var getBubblableObjects, getCancelFunction, globals, importedFunctions, initWithOptions, initializePages, nf, nullName, nullify, setDropShadowForLayer, setPosition, setSize, topmostLayer, zoom;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'initialize Pages'
  };

  nf = Object.assign(importedFunctions, globals);

  initializePages = function() {
    var allHighlights, bubblableObjects, buttonGroup, cancelButton, disButtonGroup, disCancelButton, disOkButton, disOptionsPanel, disconnectTab, displayName, guideCheckboxes, guideDisconnectCheckboxes, guideDisconnectPanel, guideLayerPages, guidePanel, highlight, highlightCheckboxes, highlightDisconnectCheckboxes, highlightDisconnectPanel, highlightName, highlightPanel, initTab, j, layer, len, mainComp, okButton, orphans, pageName, removeCheckbox, selectedLayers, tPanel, w;
    mainComp = app.project.activeItem;
    selectedLayers = mainComp.selectedLayers;
    bubblableObjects = getBubblableObjects(selectedLayers);
    allHighlights = bubblableObjects.highlights;
    guideLayerPages = bubblableObjects.guideLayerPages;
    w = new Window('dialog', 'Page Initialization');
    w.alignChildren = 'left';
    tPanel = w.add("tabbedpanel");
    tPanel.alignChildren = ["fill", "fill"];
    tPanel.preferredSize = [350, 300];
    orphans = true;
    for (j = 0, len = selectedLayers.length; j < len; j++) {
      layer = selectedLayers[j];
      if (layer.parent != null) {
        orphans = false;
      }
    }
    if (orphans) {
      initTab = tPanel.add("tab", void 0, "Init Page");
      initTab.alignChildren = "fill";
      highlightPanel = initTab.add('panel', void 0, 'Highlights', {
        borderStyle: 'none'
      });
      highlightPanel.alignChildren = 'left';
      highlightPanel.margins.top = 16;
      highlightCheckboxes = {};
      for (highlightName in allHighlights) {
        highlight = allHighlights[highlightName];
        displayName = highlightName;
        if (highlight.bubbled) {
          if (highlight.broken !== "") {
            displayName = highlightName + " (OVERRIDE/BROKEN)";
          } else {
            displayName = highlightName + " (OVERRIDE)";
          }
        } else if (highlight.broken !== "") {
          displayName = highlightName + " (BROKEN)";
        }
        highlightCheckboxes[highlightName] = highlightPanel.add("checkbox {text: '" + displayName + "'}");
        highlightCheckboxes[highlightName].value = !highlight.bubbled;
      }
      guidePanel = initTab.add('panel', void 0, 'Guide Layers', {
        borderStyle: 'none'
      });
      guidePanel.alignChildren = 'left';
      guidePanel.margins.top = 16;
      guideCheckboxes = {};
      for (pageName in guideLayerPages) {
        layer = guideLayerPages[pageName];
        displayName = pageName;
        if (layer.bubbled) {
          if (layer.broken !== "") {
            displayName = pageName + " (OVERRIDE/BROKEN)";
          } else {
            displayName = pageName + " (OVERRIDE)";
          }
        } else if (layer.broken !== "") {
          displayName = pageName + " (BROKEN)";
        }
        guideCheckboxes[pageName] = guidePanel.add("checkbox {text: '" + displayName + "'}");
        guideCheckboxes[pageName].value = true;
      }
      buttonGroup = initTab.add('group', void 0);
      okButton = buttonGroup.add('button', void 0, 'Continue');
      cancelButton = buttonGroup.add('button', void 0, 'Cancel', {
        name: 'cancel'
      });
      cancelButton.onClick = getCancelFunction(w);
      okButton.onClick = function() {
        var checkbox, guideLayerChoices, highlightChoices, options;
        highlightChoices = [];
        for (highlightName in allHighlights) {
          checkbox = highlightCheckboxes[highlightName];
          highlight = allHighlights[highlightName];
          if (checkbox.value === true) {
            highlightChoices.push(highlight.name);
          }
        }
        guideLayerChoices = [];
        for (pageName in guideLayerPages) {
          checkbox = guideCheckboxes[pageName];
          if (checkbox.value === true) {
            guideLayerChoices.push(pageName);
          }
        }
        options = {
          highlightChoices: highlightChoices,
          guideLayerChoices: guideLayerChoices
        };
        initWithOptions(options);
        return w.hide();
      };
    }
    disconnectTab = tPanel.add("tab", void 0, "Disconnect Items");
    disconnectTab.alignChildren = "fill";
    disOptionsPanel = disconnectTab.add('panel', void 0, 'Options', {
      borderStyle: 'none'
    });
    disOptionsPanel.alignChildren = 'left';
    disOptionsPanel.margins.top = 16;
    removeCheckbox = disOptionsPanel.add("checkbox {text: 'Also Remove Controls'}");
    removeCheckbox.value = true;
    highlightDisconnectPanel = disconnectTab.add('panel', void 0, 'Highlights', {
      borderStyle: 'none'
    });
    highlightDisconnectPanel.alignChildren = 'left';
    highlightDisconnectPanel.margins.top = 16;
    highlightDisconnectCheckboxes = {};
    for (highlightName in allHighlights) {
      highlight = allHighlights[highlightName];
      if (highlight.bubbled) {
        highlightDisconnectCheckboxes[highlightName] = highlightDisconnectPanel.add("checkbox {text: '" + highlightName + "'}");
        highlightDisconnectCheckboxes[highlightName].value = false;
      }
    }
    guideDisconnectPanel = disconnectTab.add('panel', void 0, 'Guide Layers', {
      borderStyle: 'none'
    });
    guideDisconnectPanel.alignChildren = 'left';
    guideDisconnectPanel.margins.top = 16;
    guideDisconnectCheckboxes = {};
    for (pageName in guideLayerPages) {
      layer = guideLayerPages[pageName];
      if (layer.bubbled) {
        guideDisconnectCheckboxes[pageName] = guideDisconnectPanel.add("checkbox {text: '" + pageName + "'}");
        guideDisconnectCheckboxes[pageName].value = false;
      }
    }
    disButtonGroup = disconnectTab.add('group', void 0);
    disOkButton = disButtonGroup.add('button', void 0, 'Continue');
    disCancelButton = disButtonGroup.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    disCancelButton.onClick = getCancelFunction(w);
    disOkButton.onClick = function() {
      var checkbox, guideLayerChoices, highlightChoices, highlighterEffect, layerContainingGuideLayer;
      highlightChoices = [];
      for (highlightName in allHighlights) {
        checkbox = highlightDisconnectCheckboxes[highlightName];
        if (checkbox != null) {
          highlight = allHighlights[highlightName];
          if (checkbox.value === true) {
            highlightChoices.push(highlight.name);
            if (removeCheckbox.value === true) {
              highlighterEffect = highlight.layerInPart.property("Effects").property(highlightName + " Highlighter");
              if (highlighterEffect != null) {
                highlighterEffect.remove();
              }
            }
          }
        }
      }
      guideLayerChoices = [];
      for (pageName in guideLayerPages) {
        checkbox = guideDisconnectCheckboxes[pageName];
        if (checkbox != null) {
          if (checkbox.value === true) {
            guideLayerChoices.push(pageName);
            if (removeCheckbox.value === true) {
              layerContainingGuideLayer = mainComp.layer(pageName);
              if (layerContainingGuideLayer != null) {
                layerContainingGuideLayer.property("Effects").property("Guide Layer").remove();
              }
            }
          }
        }
      }
      nf.disconnectBubbleupsInLayers(selectedLayers, guideLayerChoices.concat(highlightChoices));
      return w.hide();
    };
    w.show();
  };

  getCancelFunction = function(w) {
    return function() {
      return w.close();
    };
  };

  initWithOptions = function(options) {
    var i, mainComp, name, newParent, selectedLayers, thisLayer, zoomer;
    mainComp = app.project.activeItem;
    selectedLayers = mainComp.selectedLayers;
    setSize(selectedLayers);
    setPosition(selectedLayers);
    thisLayer = void 0;
    i = 0;
    while (i < selectedLayers.length) {
      thisLayer = selectedLayers[i];
      thisLayer.motionBlur = true;
      setDropShadowForLayer(thisLayer);
      i++;
    }
    name = nullName(selectedLayers[0]);
    newParent = nullify(selectedLayers, name);
    zoomer = zoom(newParent);
    nf.bubbleUpHighlights(selectedLayers, options.highlightChoices);
    return nf.bubbleUpGuideLayers(selectedLayers, options.guideLayerChoices);
  };

  getBubblableObjects = function(selectedLayers) {
    var allHighlights, bubblableObjects, guideLayer, j, key, layer, layerHighlights, layersWithGuideLayer, len;
    allHighlights = {};
    layersWithGuideLayer = {};
    for (j = 0, len = selectedLayers.length; j < len; j++) {
      layer = selectedLayers[j];
      layerHighlights = nf.sourceRectsForHighlightsInTargetLayer(layer);
      for (key in layerHighlights) {
        layerHighlights[key].layerInPart = layer;
      }
      allHighlights = Object.assign(allHighlights, layerHighlights);
      guideLayer = layer.source.layers.byName('Annotation Guide');
      if (guideLayer) {
        layersWithGuideLayer[layer.name] = {
          layer: guideLayer,
          bubbled: guideLayer.Effects.property('Guide Layer').property('Checkbox').expressionEnabled,
          broken: guideLayer.Effects.property("Guide Layer").property("Checkbox").expressionError
        };
      }
    }
    return bubblableObjects = {
      highlights: allHighlights,
      guideLayerPages: layersWithGuideLayer
    };
  };

  setDropShadowForLayer = function(layer) {
    var dropShadow;
    dropShadow = layer.property('Effects').addProperty('ADBE Drop Shadow');
    dropShadow.property('Opacity').setValue(191.25);
    dropShadow.property('Direction').setValue(0);
    dropShadow.property('Distance').setValue(20);
    dropShadow.property('Softness').setValue(300);
  };

  setSize = function(selectedLayers) {
    var i, thisLayer;
    thisLayer = void 0;
    i = 0;
    while (i < selectedLayers.length) {
      thisLayer = selectedLayers[i];
      thisLayer.property('Transform').property('Scale').setValue([50, 50, 50]);
      i++;
    }
  };

  setPosition = function(selectedLayers) {
    var i, layerHeight, newPosition, oldPosition, thisLayer;
    thisLayer = void 0;
    i = 0;
    while (i < selectedLayers.length) {
      thisLayer = selectedLayers[i];
      layerHeight = thisLayer.height;
      oldPosition = thisLayer.property('Transform').property('Position').value;
      newPosition = oldPosition;
      newPosition[1] = layerHeight / 4;
      thisLayer.property('Transform').property('Position').setValue(newPosition);
      i++;
    }
  };

  nullName = function(selectedLayer) {
    var fullName, newName;
    fullName = selectedLayer.name;
    newName = 'PDF ' + fullName.substr(0, fullName.indexOf('_'));
    return newName;
  };

  zoom = function(target) {
    var zoomName, zoomer;
    zoomName = 'Zoomer';
    zoomer = app.project.activeItem.layer(zoomName);
    if (zoomer === null) {
      zoomer = app.project.activeItem.layer(zoomName.toLowerCase());
    }
    if (zoomer === null) {
      zoomer = nullify([target], zoomName);
    } else {
      target.parent = zoomer;
    }
    return zoomer;
  };

  nullify = function(selectedLayers, nullName) {
    var i, mainComp, newNull, thisLayer;
    mainComp = app.project.activeItem;
    newNull = mainComp.layers.addNull();
    newNull.name = nullName;
    newNull.moveBefore(topmostLayer(selectedLayers));
    thisLayer = void 0;
    i = 1;
    while (i <= selectedLayers.length) {
      thisLayer = selectedLayers[i - 1];
      thisLayer.parent = newNull;
      i++;
    }
    return newNull;
  };

  topmostLayer = function(layers) {
    var i, lowestIndex, thisLayer;
    lowestIndex = layers[0].index;
    thisLayer = void 0;
    i = 1;
    while (i < layers.length) {
      if (layers[i].index < lowestIndex) {
        lowestIndex = layers[i].index;
      }
      i++;
    }
    return app.project.activeItem.layer(lowestIndex);
  };

  app.beginUndoGroup(nf.undoGroupName);

  initializePages();

  app.endUndoGroup();

}).call(this);
