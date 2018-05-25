#include "runtimeLibraries.jsx";
var NF, _, absoluteScaleOfLayer, askForChoice, getTargetPosition, getTargetPositionDelta, getTargetPositionUsingDelta, getTargetScale, getTargetScaleFactor, getTargetScaleUsingFactor, goToHighlight, newGoTo;

NF = app.NF;

_ = {
  mainComp: app.project.activeItem,
  undoGroupName: 'Go To Highlight',
  pageTurnAnticipation: 0.25,
  highlightWidthPercent: 85,
  easeType: KeyframeInterpolationType.BEZIER,
  easeWeight: 33,
  defaultOptions: {
    animatePage: true,
    duration: 3,
    reduceMotion: true,
    pageTurnDuration: 2,
    endAfterTurn: true,
    maxPageScale: 115
  }
};

newGoTo = function(highlight, options) {
  var activeComp, selectedLayers, testHighlight, testLayer, tree;
  _.w.hide();
  tree = _.pageTree;
  activeComp = NFProject.activeComp();
  selectedLayers = activeComp.selectedPageLayers();
  testLayer = selectedLayers.layers[0];
  testHighlight = testLayer.highlights().layers[0];
  return activeComp.animateToHighlight({
    highlight: testHighlight,
    animationDuration: 4
  });
};

goToHighlight = function(highlight, options) {
  var activeLayer, didRemoveKeys, highlightPageLayer, highlightPageLayerActive, j, keyframeTimes, layerToMove, len, now, pageTurnTime, positionProp, possibleProblemLayer, previousParent, problemLayers, reduceMotionOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6, relevantPages, scaleProp, selectedLayer, targetPosition, targetScale;
  options = {
    reduceMotion: (ref = options.reduceMotion) != null ? ref : _.defaultOptions.reduceMotion,
    duration: (ref1 = options.duration) != null ? ref1 : _.defaultOptions.duration,
    pageTurnDuration: (ref2 = options.pageTurnDuration) != null ? ref2 : _.defaultOptions.pageTurnDuration,
    animatePage: (ref3 = options.animatePage) != null ? ref3 : _.defaultOptions.animatePage,
    maxPageScale: (ref4 = options.maxPageScale) != null ? ref4 : _.defaultOptions.maxPageScale,
    endAfterTurn: (ref5 = options.endAfterTurn) != null ? ref5 : _.defaultOptions.endAfterTurn
  };
  selectedLayer = _.state.selectedLayer;
  highlightPageLayer = _.state.highlightLayer;
  activeLayer = _.state.activeLayer;
  relevantPages = _.state.relevantPages;
  layerToMove = options.animatePage ? NF.Util.pageParent(selectedLayer) : highlightPageLayer;
  if (layerToMove == null) {
    return alert("No Layer Parent Found!");
  }
  if (options.animatePage) {
    highlightPageLayerActive = NF.Util.pageLayerCanBeActive(highlightPageLayer);
    if (activeLayer.index < highlightPageLayer.index) {
      if (!highlightPageLayerActive) {
        alert("Uh Oh, the layer with the highlight isn't visible and I don't know how to make it visible yet...");
        return false;
      }
      problemLayers = [];
      for (j = 0, len = relevantPages.length; j < len; j++) {
        possibleProblemLayer = relevantPages[j];
        if (NF.Util.pageLayerCanBeActive(possibleProblemLayer.layer()) && (activeLayer.index < (ref6 = possibleProblemLayer.index) && ref6 < highlightPageLayer.index)) {
          problemLayers.push(possibleProblemLayer);
        }
      }
      if (problemLayers.length > 0) {
        alert("Uh oh, I'm not smart enough to deal with a layer tangle this complicated yet...");
        return false;
      }
      if (options.reduceMotion) {
        reduceMotionOptions = {
          reduceMotion: false,
          animatePage: false,
          maxPageScale: options.maxPageScale * 0.8
        };
        goToHighlight(highlight, reduceMotionOptions);
      }
      pageTurnTime = app.project.activeItem.time - (_.pageTurnAnticipation * options.pageTurnDuration);
      NF.Util.turnPageAtTime(activeLayer, options.pageTurnDuration, pageTurnTime);
      if (options.endAfterTurn) {
        activeLayer.outPoint = pageTurnTime + options.pageTurnDuration;
      }
    } else if (activeLayer.index > highlightPageLayer.index) {
      if (NF.Util.pageTurnStatus(highlightPageLayer) === NF.Util.PageTurn.FLIPPEDUP) {
        NF.Util.turnPageAtTime(highlightPageLayer, options.pageTurnDuration, app.project.activeItem.time - (_.pageTurnAnticipation * options.pageTurnDuration));
      } else {
        alert("Uh Oh, I can see that I need to go to a layer above the currently visible one, but it's not flipped out of the way so I don't know what to do yet...");
      }
    }
  }
  _.activeLayer = activeLayer = relevantPages[NF.Util.activePageIndexInArray(relevantPages)];
  positionProp = layerToMove.transform.position;
  scaleProp = layerToMove.transform.scale;
  if (layerToMove.parent != null) {
    previousParent = layerToMove.parent;
  }
  layerToMove.parent = null;
  now = _.mainComp.time;
  if (options.animatePage) {
    keyframeTimes = [now, now + options.duration];
    targetScale = getTargetScale(highlight, scaleProp.value, highlightPageLayer, options.maxPageScale);
    scaleProp.setValuesAtTimes(keyframeTimes, [scaleProp.valueAtTime(now, false), targetScale]);
    NF.Util.setSymmetricalTemporalEasingOnlyForProperties(scaleProp, keyframeTimes, _.easeType, _.easeWeight, true);
    targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer, keyframeTimes[1]);
    positionProp.setValuesAtTimes(keyframeTimes, [positionProp.valueAtTime(now, false), targetPosition]);
    NF.Util.setSymmetricalTemporalEasingOnlyForProperties(positionProp, keyframeTimes, _.easeType, _.easeWeight, true);
  } else {
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
      alert("Warning: The options you selected have caused the removal of one or more keyframes from the target layer. This is probably because you chose 'Move Only'.");
    }
    targetScale = getTargetScale(highlight, scaleProp.value, highlightPageLayer, options.maxPageScale);
    scaleProp.setValue(targetScale);
    targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer);
    positionProp.setValue(targetPosition);
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

getTargetScale = function(highlight, layerScale, highlightPageLayer, maxScale, targetTime) {
  var targetScale, targetScaleFactor;
  if (targetTime == null) {
    targetTime = null;
  }
  targetScaleFactor = getTargetScaleFactor(highlight, layerScale, highlightPageLayer, maxScale, targetTime);
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
  highlightCenterPoint = NF.Util.pointRelativeToComp([highlight.left + highlight.width / 2, highlight.top + highlight.height / 2], highlightPageLayer, targetTime);
  compCenterPoint = [_.mainComp.width / 2, _.mainComp.height / 2];
  delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]];
  rectAfterScale = NF.Util.sourceRectToComp(highlightPageLayer, targetTime);
  rectAfterScale.left += delta[0];
  rectAfterScale.top += delta[1];
  if (rectAfterScale.left > 0) {
    delta[0] -= rectAfterScale.left;
  }
  if (rectAfterScale.top > 0) {
    delta[1] -= rectAfterScale.top;
  }
  if (rectAfterScale.left + rectAfterScale.width < _.mainComp.width) {
    delta[0] += _.mainComp.width - (rectAfterScale.left + rectAfterScale.width);
  }
  if (rectAfterScale.top + rectAfterScale.height < _.mainComp.height) {
    delta[1] += _.mainComp.height - (rectAfterScale.top + rectAfterScale.height);
  }
  return delta;
};

getTargetScaleUsingFactor = function(initialScale, scaleFactor) {
  var newScale;
  return newScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor];
};

getTargetScaleFactor = function(highlight, layerScale, highlightPageLayer, maxScale, targetTime) {
  var absoluteScale, adjustedScaleFactor, calculatedScale, compWidth, highlightRectInContext, scaleFactor, targetHighlightWidth;
  if (targetTime == null) {
    targetTime = null;
  }
  highlightRectInContext = NF.Util.rectRelativeToComp(highlight, highlightPageLayer, targetTime);
  compWidth = _.mainComp.width;
  targetHighlightWidth = _.highlightWidthPercent / 100 * compWidth;
  scaleFactor = targetHighlightWidth / highlightRectInContext.width;
  absoluteScale = absoluteScaleOfLayer(highlightPageLayer);
  calculatedScale = scaleFactor * absoluteScale[0];
  if (calculatedScale > maxScale) {
    adjustedScaleFactor = maxScale / absoluteScale[0];
  } else if (calculatedScale < 50) {
    adjustedScaleFactor = 50 / absoluteScale[0];
  } else {
    adjustedScaleFactor = scaleFactor;
  }
  return adjustedScaleFactor;
};

askForChoice = function() {
  var buttonGroup, cancelButton, checkboxEndAfterTurn, checkboxReduceMotion, durationLabel, durationValue, groupAdditionalOptions, highlight, highlightName, i, maxScaleLabel, maxScaleValue, okButton, pageName, pageTurnLabel, pageTurnValue, radioButtonPageLayer, radioButtonShouldAnimate, radioGroupAnimationType, selectedLayer, spacingGroup, thePage, tree, w, widthLabel, widthValue;
  selectedLayer = _.mainComp.selectedLayers[0];
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
  durationValue = w.grp1.durGroup.add('edittext', void 0, _.defaultOptions.duration);
  durationValue.characters = 3;
  pageTurnLabel = w.grp1.durGroup.add('statictext {text: "Page Turn Duration:", characters: 16, justify: "left"}');
  pageTurnValue = w.grp1.durGroup.add('edittext', void 0, _.defaultOptions.pageTurnDuration);
  pageTurnValue.characters = 3;
  w.grp1.sizeGroup = w.grp1.add('panel', void 0, 'Sizing');
  w.grp1.sizeGroup.orientation = 'row';
  widthLabel = w.grp1.sizeGroup.add('statictext {text: "Width (% of window):", characters: 16, justify: "left"}');
  widthValue = w.grp1.sizeGroup.add('edittext', void 0, _.highlightWidthPercent);
  widthValue.characters = 3;
  maxScaleLabel = w.grp1.sizeGroup.add('statictext {text: "Max Scale (%):", characters: 11, justify: "left"}');
  maxScaleValue = w.grp1.sizeGroup.add('edittext', void 0, _.defaultOptions.maxPageScale);
  maxScaleValue.characters = 4;
  radioGroupAnimationType = w.grp1.add("panel", void 0, 'Animation Type');
  radioGroupAnimationType.alignChildren = 'left';
  radioGroupAnimationType.orientation = 'row';
  radioButtonShouldAnimate = radioGroupAnimationType.add("radiobutton", void 0, "Animate Movement");
  radioButtonPageLayer = radioGroupAnimationType.add("radiobutton", void 0, "Only Move Page");
  radioButtonShouldAnimate.value = _.defaultOptions.animatePage;
  radioButtonPageLayer = !_.defaultOptions.animatePage;
  groupAdditionalOptions = w.grp1.add("panel", void 0, 'Additional Options');
  groupAdditionalOptions.alignChildren = 'left';
  groupAdditionalOptions.orientation = 'row';
  checkboxReduceMotion = groupAdditionalOptions.add("checkbox", void 0, "Reduce motion on cross-page moves");
  checkboxReduceMotion.value = _.defaultOptions.reduceMotion;
  checkboxEndAfterTurn = groupAdditionalOptions.add("checkbox", void 0, "End layer after turn");
  checkboxEndAfterTurn.value = _.defaultOptions.endAfterTurn;
  _.pageTree = NF.Util.pageTreeForPaper(selectedLayer);
  w.grp2 = w.add('panel', void 0, 'Highlights', {
    borderStyle: 'none'
  });
  w.grp2.alignChildren = 'left';
  w.grp2.margins.top = 16;
  tree = w.grp2.add('treeview', [0, 0, 450, 250]);
  _.pageTree.node = tree.add('node', _.pageTree.name);
  i = 0;
  while (i < _.pageTree.pages.length) {
    thePage = _.pageTree.pages[i];
    pageName = null;
    if (thePage.active) {
      pageName = thePage.name + " (Active Page)";
    } else if (thePage.index === selectedLayer.index) {
      pageName = thePage.name + " (Selected Page)";
    } else {
      pageName = thePage.name;
    }
    thePage.node = _.pageTree.node.add('node', pageName);
    thePage.node.data = thePage;
    for (highlightName in thePage.highlights) {
      highlight = thePage.highlights[highlightName];
      highlight.item = thePage.node.add('item', highlight.name);
      highlight.item.data = highlight;
    }
    thePage.node.expanded = true;
    i++;
  }
  _.pageTree.node.expanded = true;
  buttonGroup = w.add('group', void 0);
  okButton = buttonGroup.add('button', void 0, 'Go To Highlight');
  spacingGroup = buttonGroup.add('group', [0, 0, 280, 50]);
  cancelButton = buttonGroup.add('button', void 0, 'Cancel', {
    name: 'cancel'
  });
  _.UIControls = {
    duration: durationValue,
    animatePage: radioButtonShouldAnimate,
    highlightWidthPercent: widthValue,
    maxScale: maxScaleValue,
    endAfterTurn: checkboxEndAfterTurn,
    reduceMotion: checkboxReduceMotion,
    tree: tree
  };
  okButton.onClick = function() {
    var highlightChoice, options, ref, ref1, ref2;
    options = {
      duration: parseFloat(_.UIControls.duration.text),
      animatePage: _.UIControls.animatePage.value,
      reduceMotion: _.UIControls.reduceMotion.value,
      maxPageScale: parseFloat(_.UIControls.maxScale.text),
      endAfterTurn: _.UIControls.endAfterTurn.value
    };
    _.highlightWidthPercent = (ref = parseFloat(_.UIControls.highlightWidthPercent.text)) != null ? ref : _.highlightWidthPercent;
    if (options.maxPageScale == null) {
      alert('Invalid Max Page Scale!');
      return false;
    }
    if (options.duration == null) {
      alert('Invalid Duration!');
      return false;
    }
    if (((ref1 = _.UIControls.tree.selection) != null ? ref1.data : void 0) && ((ref2 = _.UIControls.tree.selection) != null ? ref2.type : void 0) === 'item') {
      highlightChoice = _.UIControls.tree.selection.data;
    }
    if (highlightChoice == null) {
      alert('Invalid Selection!');
      return false;
    }
    _.state = {
      selectedLayer: _.mainComp.selectedLayers[0],
      highlightLayer: _.UIControls.tree.selection.parent.data.layer(),
      activeLayer: _.pageTree.activePage,
      relevantPages: _.pageTree.pages
    };
    _.w = w;
    newGoTo(highlightChoice, options);
    return w.hide();
  };
  cancelButton.onClick = function() {
    w.close();
  };
  return w.show();
};

app.beginUndoGroup(_.undoGroupName);

askForChoice();

app.endUndoGroup();
