(function() {
  #include "nf_runtimeLibraries.jsx";
  var NF, _, getCancelFunction, initWithOptions, nullName, nullify, presentUI, setDropShadowForLayer, setPosition, setSize, topmostLayer, zoom;

  NF = app.NF;

  _ = {
    mainComp: app.project.activeItem,
    undoGroupName: 'initialize Pages',
    animationDuration: 1.85
  };

  presentUI = function() {
    var allHighlights, animatePageCheckbox, buttonGroup, cancelButton, disButtonGroup, disCancelButton, disOkButton, disOptionsPanel, disconnectTab, displayName, highlight, highlightAlreadyConnectedToThisLayer, highlightCheckboxes, highlightDisconnectCheckboxes, highlightDisconnectPanel, highlightPanel, initTab, j, k, l, len, len1, len2, okButton, onlyBubbleUpCheckbox, optionsPanel, orphans, ref, ref1, ref2, removeCheckbox, selectedLayers, tPanel, theLayer, w;
    if (_.mainComp == null) {
      throw "Project has no active composition";
    }
    selectedLayers = NF.Models.NFLayerCollection.collectionFromAVLayerArray(_.mainComp.selectedLayers);
    if (!selectedLayers.onlyContainsPageLayers()) {
      throw "Can't initialize non-page layers";
    }
    allHighlights = selectedLayers.highlights();
    if (allHighlights.duplicateNames()) {
      throw "Some highlights in the selected pages have the same name - Please ensure unique names";
    }
    w = new Window('dialog', 'Page Initialization');
    w.alignChildren = 'left';
    tPanel = w.add("tabbedpanel");
    tPanel.alignChildren = ["fill", "fill"];
    tPanel.preferredSize = [350, 300];
    orphans = 0;
    ref = selectedLayers.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (!theLayer.hasNullParent()) {
        orphans++;
      }
    }
    if ((0 < orphans && orphans < selectedLayers.count())) {
      throw "Can't run this script on both initialized and uninitialized page layers at the same time";
    }
    if (orphans > 0) {
      initTab = tPanel.add("tab", void 0, "Init Page");
      initTab.alignChildren = "fill";
      optionsPanel = initTab.add('panel', void 0, 'Options', {
        borderStyle: 'none'
      });
      optionsPanel.alignChildren = 'left';
      optionsPanel.margins.top = 16;
      animatePageCheckbox = optionsPanel.add("checkbox", void 0, "Animate In First Page");
      animatePageCheckbox.value = true;
      onlyBubbleUpCheckbox = optionsPanel.add("checkbox", void 0, "Bubbleup Only");
      onlyBubbleUpCheckbox.value = false;
      onlyBubbleUpCheckbox.onClick = function() {
        if (onlyBubbleUpCheckbox.value === true) {
          animatePageCheckbox.value = false;
          return animatePageCheckbox.enabled = false;
        } else {
          animatePageCheckbox.value = true;
          return animatePageCheckbox.enabled = true;
        }
      };
      highlightPanel = initTab.add('panel', void 0, 'Highlights', {
        borderStyle: 'none'
      });
      highlightPanel.alignChildren = 'left';
      highlightPanel.margins.top = 16;
      highlightCheckboxes = {};
      ref1 = allHighlights.layers;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        highlight = ref1[k];
        displayName = highlight.name;
        highlightAlreadyConnectedToThisLayer = highlight.containingPageLayer.sameLayerAs(highlight.connectedPageLayer);
        if (highlight.bubbled) {
          if (highlight.broken) {
            displayName += " (OVERRIDE/BROKEN)";
          } else if (highlightAlreadyConnectedToThisLayer) {
            displayName += " (ALREADY CONNECTED TO THIS PAGE LAYER)";
          } else {
            displayName += " (OVERRIDE)";
          }
        } else if (highlight.broken) {
          displayName += " (BROKEN)";
        }
        highlightCheckboxes[highlight.name] = highlightPanel.add("checkbox {text: '" + displayName + "'}");
        highlightCheckboxes[highlight.name].value = !highlight.bubbled;
        highlightCheckboxes[highlight.name].enabled = !highlightAlreadyConnectedToThisLayer;
      }
      buttonGroup = initTab.add('group', void 0);
      okButton = buttonGroup.add('button', void 0, 'Continue');
      cancelButton = buttonGroup.add('button', void 0, 'Cancel', {
        name: 'cancel'
      });
      cancelButton.onClick = getCancelFunction(w);
      okButton.onClick = function() {
        var checkbox, highlightChoices, l, len2, options, ref2;
        highlightChoices = new NF.Models.NFHighlightLayerCollection([]);
        ref2 = allHighlights.layers;
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          highlight = ref2[l];
          checkbox = highlightCheckboxes[highlight.name];
          if (checkbox.value === true) {
            highlightChoices.addNFHighlightLayer(highlight);
          }
        }
        if (onlyBubbleUpCheckbox.value === true) {
          highlightChoices.disconnectHighlights();
          highlightChoices.bubbleUpHighlights();
        } else {
          options = {
            highlightChoices: highlightChoices,
            animatePage: animatePageCheckbox.value
          };
          initWithOptions(options);
        }
        return w.hide();
      };
    }
    if (!allHighlights.isEmpty()) {
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
      ref2 = allHighlights.layers;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        highlight = ref2[l];
        if (highlight.bubbled) {
          highlightDisconnectCheckboxes[highlight.name] = highlightDisconnectPanel.add("checkbox {text: '" + highlight.name + "'}");
          highlightDisconnectCheckboxes[highlight.name].value = false;
        }
      }
      disButtonGroup = disconnectTab.add('group', void 0);
      disOkButton = disButtonGroup.add('button', void 0, 'Continue');
      disCancelButton = disButtonGroup.add('button', void 0, 'Cancel', {
        name: 'cancel'
      });
      disCancelButton.onClick = getCancelFunction(w);
      disOkButton.onClick = function() {
        var disconnectCheckbox, len3, m, ref3, ref4;
        ref3 = allHighlights.layers;
        for (m = 0, len3 = ref3.length; m < len3; m++) {
          highlight = ref3[m];
          disconnectCheckbox = highlightDisconnectCheckboxes[highlight.name];
          if (disconnectCheckbox != null) {
            if (disconnectCheckbox.value === true) {
              if (removeCheckbox.value === true) {
                if ((ref4 = highlight.connectedPageLayerHighlighterEffect()) != null) {
                  ref4.remove();
                }
              }
              highlight.disconnect();
            }
          }
        }
        return w.hide();
      };
    }
    w.show();
  };

  getCancelFunction = function(w) {
    return function() {
      return w.close();
    };
  };

  initWithOptions = function(options) {
    var i, j, layer, len, name, newParent, results, selectedLayers, thisLayer, topLayer, zoomer;
    selectedLayers = _.mainComp.selectedLayers;
    setSize(selectedLayers);
    setPosition(selectedLayers);
    thisLayer = void 0;
    i = 0;
    while (i < selectedLayers.length) {
      thisLayer = selectedLayers[i];
      thisLayer.motionBlur = true;
      setDropShadowForLayer(thisLayer);
      thisLayer.name = thisLayer.name.replace(" NFPage", " [+]");
      i++;
    }
    name = nullName(selectedLayers[0]);
    newParent = nullify(selectedLayers, name);
    zoomer = zoom(newParent);
    NF.Util.bubbleUpHighlights(selectedLayers, options.highlightChoices);
    if (options.animatePage) {
      topLayer = topmostLayer(selectedLayers);
      NF.Util.animatePage({
        page: topLayer,
        type: NF.Util.AnimationType.SLIDE,
        position: NF.Util.Position.RIGHT,
        direction: NF.Util.Direction.IN,
        duration: _.animationDuration,
        easeFunction: NF.Util.EaseFunction.PAGESLIDEEASE
      });
      results = [];
      for (j = 0, len = selectedLayers.length; j < len; j++) {
        layer = selectedLayers[j];
        if (layer.index !== topLayer.index) {
          results.push(layer.inPoint = topLayer.inPoint + _.animationDuration);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
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
    var i, newNull, thisLayer;
    newNull = _.mainComp.layers.addNull();
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

  app.beginUndoGroup(_.undoGroupName);

  presentUI();

  app.endUndoGroup();

}).call(this);
