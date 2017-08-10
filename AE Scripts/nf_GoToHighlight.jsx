(function() {
  #include "nf_functions.jsx";
  var absoluteScaleOfLayer, askForChoice, getTargetPosition, getTargetPositionDelta, getTargetPositionUsingDelta, getTargetScale, getTargetScaleFactor, getTargetScaleUsingFactor, globals, goToHighlight, importedFunctions, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Go To Highlight',
    highlightWidthPercent: 85,
    easeType: KeyframeInterpolationType.BEZIER,
    easeWeight: 33,
    maxPageScale: 130,
    defaultOptions: {
      movePageLayer: false,
      makeInKeyframe: true,
      moveOnly: false,
      duration: 3,
      pageTurnDuration: 2
    }
  };

  nf = Object.assign(importedFunctions, globals);

  goToHighlight = function(highlight, options) {
    var activeLayer, didRemoveKeys, highlightPageLayer, highlightPageLayerActive, j, keyframeTimes, layerToMove, len, now, positionProp, possibleProblemLayer, previousParent, problemLayers, ref, ref1, ref2, ref3, ref4, ref5, relevantPages, scaleProp, selectedLayer, targetPosition, targetScale;
    options = {
      movePageLayer: (ref = options.movePageLayer) != null ? ref : nf.defaultOptions.movePageLayer,
      makeInKeyframe: (ref1 = options.makeInKeyframe) != null ? ref1 : nf.defaultOptions.makeInKeyframe,
      moveOnly: (ref2 = options.moveOnly) != null ? ref2 : nf.defaultOptions.moveOnly,
      duration: (ref3 = options.duration) != null ? ref3 : nf.defaultOptions.duration,
      pageTurnDuration: (ref4 = options.pageTurnDuration) != null ? ref4 : nf.defaultOptions.pageTurnDuration
    };
    selectedLayer = nf.state.selectedLayer;
    highlightPageLayer = nf.state.highlightLayer;
    activeLayer = nf.state.activeLayer;
    relevantPages = nf.state.relevantPages;
    layerToMove = options.movePageLayer ? highlightPageLayer : nf.pageParent(selectedLayer);
    if (layerToMove == null) {
      return alert("No Layer Parent Found!");
    }
    highlightPageLayerActive = nf.pageLayerCanBeActive(highlightPageLayer);
    if (activeLayer.index < highlightPageLayer.index) {
      if (!highlightPageLayerActive) {
        alert("Uh Oh, the layer with the highlight isn't visible and I don't know how to make it visible yet...");
        return false;
      }
      problemLayers = [];
      for (j = 0, len = relevantPages.length; j < len; j++) {
        possibleProblemLayer = relevantPages[j];
        if (nf.pageLayerCanBeActive(possibleProblemLayer.layer()) && (activeLayer.index < (ref5 = possibleProblemLayer.index) && ref5 < highlightPageLayer.index)) {
          problemLayers.push(possibleProblemLayer);
        }
      }
      if (problemLayers.length > 0) {
        alert("Uh oh, I'm not smart enough to deal with a layer tangle this complicated yet...");
        return false;
      }
      nf.turnPageAtTime(activeLayer, options.pageTurnDuration);
    } else if (activeLayer.index > highlightPageLayer.index) {
      if (nf.pageTurnStatus(highlightPageLayer) === nf.PageTurn.FLIPPEDUP) {
        nf.turnPageAtTime(highlightPageLayer, options.pageTurnDuration);
      } else {
        alert("Uh Oh, I can see that I need to go to a layer above the currently visible one, but it's not flipped out of the way so I don't know what to do yet...");
      }
    }
    nf.activeLayer = activeLayer = relevantPages[nf.activePageIndexInArray(relevantPages)];
    positionProp = layerToMove.transform.position;
    scaleProp = layerToMove.transform.scale;
    if (layerToMove.parent != null) {
      previousParent = layerToMove.parent;
    }
    layerToMove.parent = null;
    now = nf.mainComp.time;
    if (options.makeInKeyframe) {
      keyframeTimes = [now, now + options.duration];
      targetScale = getTargetScale(highlight, scaleProp.value, highlightPageLayer);
      scaleProp.setValuesAtTimes(keyframeTimes, [scaleProp.valueAtTime(now, false), targetScale]);
      nf.setSymmetricalTemporalEasingOnlyForProperties(scaleProp, keyframeTimes, nf.easeType, nf.easeWeight, true);
      targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer, keyframeTimes[1]);
      positionProp.setValuesAtTimes(keyframeTimes, [positionProp.valueAtTime(now, false), targetPosition]);
      nf.setSymmetricalTemporalEasingOnlyForProperties(positionProp, keyframeTimes, nf.easeType, nf.easeWeight, true);
    } else if (options.moveOnly) {
      didRemoveKeys = false;
      while (positionProp.numKeys !== 0) {
        didRemoveKeys = true;
        positionProp.removeKey(1);
      }
      while (scaleProp.numKeys !== 0) {
        didRemoveKeys = true;
        scaleProp.removeKey(1);
      }
      if (didRemoveKeys) {
        alert("Warning: The options you selected have caused the removal of one or more keyframes from the target layer. This is probably because you chose 'No Keyframes'.");
      }
      targetScale = getTargetScale(highlight, scaleProp.value, highlightPageLayer);
      scaleProp.setValue(targetScale);
      targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer);
      positionProp.setValue(targetPosition);
    } else {
      targetScale = getTargetScale(highlight, scaleProp.value, highlightPageLayer);
      scaleProp.setValueAtTime(now, targetScale);
      targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer);
      positionProp.setValueAtTime(now, targetPosition);
      nf.setSymmetricalTemporalEasingOnlyForProperties([positionProp, scaleProp], nf.mainComp.time, nf.easeType, nf.easeWeight, true);
    }
    if (previousParent != null) {
      layerToMove.parent = previousParent;
    }
    return selectedLayer.selected = true;
  };

  absoluteScaleOfLayer = function(layer) {
    var absoluteScale, layerParent;
    layerParent = layer.parent;
    layer.parent = null;
    absoluteScale = layer.transform.scale.value;
    layer.parent = layerParent;
    return absoluteScale;
  };

  getTargetScale = function(highlight, layerScale, highlightPageLayer, targetTime) {
    var targetScale, targetScaleFactor;
    if (targetTime == null) {
      targetTime = null;
    }
    targetScaleFactor = getTargetScaleFactor(highlight, layerScale, highlightPageLayer, targetTime);
    return targetScale = getTargetScaleUsingFactor(layerScale, targetScaleFactor);
  };

  getTargetPosition = function(highlight, layerPosition, highlightPageLayer, targetTime) {
    var targetPosition, targetPositionDelta;
    if (targetTime == null) {
      targetTime = null;
    }
    targetPositionDelta = getTargetPositionDelta(highlight, layerPosition, highlightPageLayer, targetTime);
    return targetPosition = getTargetPositionUsingDelta(layerPosition, targetPositionDelta);
  };

  getTargetPositionUsingDelta = function(initialPosition, delta) {
    var targetPosition;
    return targetPosition = [initialPosition[0] + delta[0], initialPosition[1] + delta[1]];
  };

  getTargetPositionDelta = function(highlight, layerPosition, highlightPageLayer, targetTime) {
    var compCenterPoint, delta, highlightCenterPoint, rectAfterScale;
    if (targetTime == null) {
      targetTime = null;
    }
    highlightCenterPoint = nf.pointRelativeToComp([highlight.left + highlight.width / 2, highlight.top + highlight.height / 2], highlightPageLayer, targetTime);
    compCenterPoint = [nf.mainComp.width / 2, nf.mainComp.height / 2];
    delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]];
    rectAfterScale = nf.sourceRectToComp(highlightPageLayer, targetTime);
    rectAfterScale.left += delta[0];
    rectAfterScale.top += delta[1];
    if (rectAfterScale.left > 0) {
      delta[0] -= rectAfterScale.left;
    }
    if (rectAfterScale.top > 0) {
      delta[1] -= rectAfterScale.top;
    }
    if (rectAfterScale.left + rectAfterScale.width < nf.mainComp.width) {
      delta[0] += nf.mainComp.width - (rectAfterScale.left + rectAfterScale.width);
    }
    if (rectAfterScale.top + rectAfterScale.height < nf.mainComp.height) {
      delta[1] += nf.mainComp.height - (rectAfterScale.top + rectAfterScale.height);
    }
    return delta;
  };

  getTargetScaleUsingFactor = function(initialScale, scaleFactor) {
    var newScale;
    return newScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor];
  };

  getTargetScaleFactor = function(highlight, layerScale, highlightPageLayer, targetTime) {
    var absoluteScale, adjustedScaleFactor, calculatedScale, compWidth, highlightRectInContext, scaleFactor, targetHighlightWidth;
    if (targetTime == null) {
      targetTime = null;
    }
    highlightRectInContext = nf.rectRelativeToComp(highlight, highlightPageLayer, targetTime);
    compWidth = nf.mainComp.width;
    targetHighlightWidth = nf.highlightWidthPercent / 100 * compWidth;
    scaleFactor = targetHighlightWidth / highlightRectInContext.width;
    absoluteScale = absoluteScaleOfLayer(highlightPageLayer);
    calculatedScale = scaleFactor * absoluteScale[0];
    if (calculatedScale > nf.maxPageScale) {
      adjustedScaleFactor = nf.maxPageScale / absoluteScale[0];
    } else if (calculatedScale < 50) {
      adjustedScaleFactor = 50 / absoluteScale[0];
    } else {
      adjustedScaleFactor = scaleFactor;
    }
    return adjustedScaleFactor;
  };

  askForChoice = function() {
    var buttonGroup, cancelButton, durationLabel, durationValue, highlight, highlightName, i, maxScaleLabel, maxScaleValue, okButton, pageName, pageTurnLabel, pageTurnValue, radioButtonInOut, radioButtonMoveOnly, radioButtonOneKF, radioButtonPageLayer, radioButtonParentLayer, radioGroupKeyframes, radioGroupTargetLayer, selectedLayer, spacingGroup, thePage, tree, w, widthLabel, widthValue;
    selectedLayer = nf.mainComp.selectedLayers[0];
    w = new Window('dialog', 'Go To Highlight');
    w.alignChildren = 'left';
    w.grp1 = w.add('panel', void 0, 'Options', {
      borderStyle: 'none'
    });
    w.grp1.alignChildren = 'left';
    w.grp1.margins.top = 16;
    w.grp1.durGroup = w.grp1.add('panel', void 0, 'Duration (seconds)');
    w.grp1.durGroup.orientation = 'row';
    durationLabel = w.grp1.durGroup.add('statictext {text: "Movement Duration:", characters: 16, justify: "left"}');
    durationValue = w.grp1.durGroup.add('edittext', void 0, nf.defaultOptions.duration);
    durationValue.characters = 3;
    pageTurnLabel = w.grp1.durGroup.add('statictext {text: "Page Turn Duration:", characters: 16, justify: "left"}');
    pageTurnValue = w.grp1.durGroup.add('edittext', void 0, nf.defaultOptions.pageTurnDuration);
    pageTurnValue.characters = 3;
    w.grp1.sizeGroup = w.grp1.add('panel', void 0, 'Sizing');
    w.grp1.sizeGroup.orientation = 'row';
    widthLabel = w.grp1.sizeGroup.add('statictext {text: "Width (% of window):", characters: 16, justify: "left"}');
    widthValue = w.grp1.sizeGroup.add('edittext', void 0, nf.highlightWidthPercent);
    widthValue.characters = 3;
    maxScaleLabel = w.grp1.sizeGroup.add('statictext {text: "Max Scale (%):", characters: 11, justify: "left"}');
    maxScaleValue = w.grp1.sizeGroup.add('edittext', void 0, nf.maxPageScale);
    maxScaleValue.characters = 4;
    radioGroupTargetLayer = w.grp1.add("panel", void 0, 'Target Layer');
    radioGroupTargetLayer.alignChildren = 'left';
    radioGroupTargetLayer.orientation = 'row';
    radioButtonParentLayer = radioGroupTargetLayer.add("radiobutton", void 0, "Page parent");
    radioButtonPageLayer = radioGroupTargetLayer.add("radiobutton", void 0, "Page layer");
    radioButtonParentLayer.value = true;
    radioGroupKeyframes = w.grp1.add("panel", void 0, "Keyframes");
    radioGroupKeyframes.alignChildren = 'left';
    radioGroupKeyframes.orientation = 'row';
    radioButtonInOut = radioGroupKeyframes.add("radiobutton", void 0, "In & Out");
    radioButtonOneKF = radioGroupKeyframes.add("radiobutton", void 0, "One Keyframe");
    radioButtonMoveOnly = radioGroupKeyframes.add("radiobutton", void 0, "No Keyframes (Move Only)");
    radioButtonInOut.value = true;
    nf.pageTree = nf.pageTreeForPaper(selectedLayer);
    w.grp2 = w.add('panel', void 0, 'Highlights', {
      borderStyle: 'none'
    });
    w.grp2.alignChildren = 'left';
    w.grp2.margins.top = 16;
    tree = w.grp2.add('treeview', [0, 0, 450, 250]);
    nf.pageTree.node = tree.add('node', nf.pageTree.name);
    i = 0;
    while (i < nf.pageTree.pages.length) {
      thePage = nf.pageTree.pages[i];
      pageName = null;
      if (thePage.active) {
        pageName = thePage.name + " (Active Page)";
      } else if (thePage.index === selectedLayer.index) {
        pageName = thePage.name + " (Selected Page)";
      } else {
        pageName = thePage.name;
      }
      thePage.node = nf.pageTree.node.add('node', pageName);
      thePage.node.data = thePage;
      for (highlightName in thePage.highlights) {
        highlight = thePage.highlights[highlightName];
        highlight.item = thePage.node.add('item', highlight.name);
        highlight.item.data = highlight;
      }
      thePage.node.expanded = true;
      i++;
    }
    nf.pageTree.node.expanded = true;
    buttonGroup = w.add('group', void 0);
    okButton = buttonGroup.add('button', void 0, 'Go To Highlight');
    spacingGroup = buttonGroup.add('group', [0, 0, 280, 50]);
    cancelButton = buttonGroup.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    nf.UIControls = {
      duration: durationValue,
      keyframes: {
        inOut: radioButtonInOut,
        moveOnly: radioButtonMoveOnly,
        oneKF: radioButtonOneKF
      },
      movePageLayer: radioButtonPageLayer,
      highlightWidthPercent: widthValue,
      maxScale: maxScaleValue,
      tree: tree
    };
    okButton.onClick = function() {
      var highlightChoice, options, ref, ref1, ref2, ref3;
      options = {
        movePageLayer: nf.UIControls.movePageLayer.value,
        duration: parseFloat(nf.UIControls.duration.text),
        moveOnly: nf.UIControls.keyframes.moveOnly.value,
        makeInKeyframe: nf.UIControls.keyframes.inOut.value
      };
      nf.maxPageScale = (ref = parseFloat(nf.UIControls.maxScale.text)) != null ? ref : nf.maxScaleValue;
      nf.highlightWidthPercent = (ref1 = parseFloat(nf.UIControls.highlightWidthPercent.text)) != null ? ref1 : nf.highlightWidthPercent;
      if (options.duration == null) {
        alert('Invalid Duration!');
        return false;
      }
      if (((ref2 = nf.UIControls.tree.selection) != null ? ref2.data : void 0) && ((ref3 = nf.UIControls.tree.selection) != null ? ref3.type : void 0) === 'item') {
        highlightChoice = nf.UIControls.tree.selection.data;
      }
      if (highlightChoice == null) {
        alert('Invalid Selection!');
        return false;
      }
      nf.state = {
        selectedLayer: nf.mainComp.selectedLayers[0],
        highlightLayer: nf.UIControls.tree.selection.parent.data.layer(),
        activeLayer: nf.pageTree.activePage,
        relevantPages: nf.pageTree.pages
      };
      goToHighlight(highlightChoice, options);
      return w.hide();
    };
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  app.beginUndoGroup(nf.undoGroupName);

  askForChoice();

  app.endUndoGroup();

  nf = {};

}).call(this);
