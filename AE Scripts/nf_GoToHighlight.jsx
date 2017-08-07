(function() {
  #include "nf_functions.jsx";
  var absoluteScaleOfLayer, askForChoice, getOnClickFunction, getTargetPosition, getTargetScaleFactor, getTargetScaleUsingFactor, globals, goToHighlight, importedFunctions, nf;

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
      duration: 2
    }
  };

  nf = Object.assign(importedFunctions, globals);

  goToHighlight = function(highlight, options) {
    var didRemoveKeys, highlightPageLayer, keyframeTimes, layerToMove, now, positionProp, previousParent, ref, ref1, ref2, ref3, scaleProp, selectedLayer, targetPosition, targetScale, targetScaleFactor;
    options = {
      movePageLayer: (ref = options.movePageLayer) != null ? ref : nf.defaultOptions.movePageLayer,
      makeInKeyframe: (ref1 = options.makeInKeyframe) != null ? ref1 : nf.defaultOptions.makeInKeyframe,
      moveOnly: (ref2 = options.moveOnly) != null ? ref2 : nf.defaultOptions.moveOnly,
      duration: (ref3 = options.duration) != null ? ref3 : nf.defaultOptions.duration
    };
    selectedLayer = nf.mainComp.selectedLayers[0];
    highlightPageLayer = selectedLayer;
    layerToMove = options.movePageLayer ? selectedLayer : nf.pageParent(selectedLayer);
    if (layerToMove == null) {
      return alert("No Layer Parent Found!");
    }
    positionProp = layerToMove.transform.position;
    scaleProp = layerToMove.transform.scale;
    if (layerToMove.parent != null) {
      previousParent = layerToMove.parent;
    }
    layerToMove.parent = null;
    now = nf.mainComp.time;
    if (options.makeInKeyframe) {
      keyframeTimes = [now, now + options.duration];
      targetScaleFactor = getTargetScaleFactor(highlight, scaleProp.value, highlightPageLayer);
      targetScale = getTargetScaleUsingFactor(scaleProp.value, targetScaleFactor);
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
      targetScaleFactor = getTargetScaleFactor(highlight, scaleProp.value, highlightPageLayer);
      targetScale = getTargetScaleUsingFactor(scaleProp.value, targetScaleFactor);
      scaleProp.setValue(targetScale);
      targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer);
      positionProp.setValue(targetPosition);
    } else {
      targetScaleFactor = getTargetScaleFactor(highlight, scaleProp.value, highlightPageLayer);
      targetScale = getTargetScaleUsingFactor(scaleProp.value, targetScaleFactor);
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

  getTargetPosition = function(highlight, layerPosition, highlightPageLayer, targetTime) {
    var compCenterPoint, delta, highlightCenterPoint, targetPosition;
    if (targetTime == null) {
      targetTime = null;
    }
    highlightCenterPoint = nf.pointRelativeToComp([highlight.left + highlight.width / 2, highlight.top + highlight.height / 2], highlightPageLayer, targetTime);
    compCenterPoint = [nf.mainComp.width / 2, nf.mainComp.height / 2];
    delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]];
    targetPosition = [layerPosition[0] + delta[0], layerPosition[1] + delta[1]];
    return targetPosition;
  };

  getTargetScaleUsingFactor = function(initialScale, scaleFactor) {
    var newScale;
    return newScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor];
  };

  getTargetScaleFactor = function(highlight, layerScale, highlightPageLayer, targetTime) {
    var absoluteScale, adjustedScaleFactor, compWidth, highlightRectInContext, scaleFactor, targetHighlightWidth;
    if (targetTime == null) {
      targetTime = null;
    }
    highlightRectInContext = nf.rectRelativeToComp(highlight, highlightPageLayer, targetTime);
    compWidth = nf.mainComp.width;
    targetHighlightWidth = nf.highlightWidthPercent / 100 * compWidth;
    scaleFactor = targetHighlightWidth / highlightRectInContext.width;
    absoluteScale = absoluteScaleOfLayer(highlightPageLayer);
    return adjustedScaleFactor = scaleFactor * absoluteScale[0] > nf.maxPageScale ? nf.maxPageScale / absoluteScale[0] : scaleFactor;
  };

  askForChoice = function() {
    var cancelButton, durationLabel, durationValue, highlightRect, highlightRectObject, highlightRects, maxScaleLabel, maxScaleValue, radioButton, radioButtonInOut, radioButtonMoveOnly, radioButtonOneKF, radioButtonPageLayer, radioButtonParentLayer, radioGroupKeyframes, radioGroupTargetLayer, selectedLayer, w, widthLabel, widthValue;
    selectedLayer = nf.mainComp.selectedLayers[0];
    w = new Window('dialog', 'Go To Highlight');
    w.alignChildren = 'left';
    w.grp1 = w.add('panel', void 0, 'Options', {
      borderStyle: 'none'
    });
    w.grp1.alignChildren = 'left';
    w.grp1.margins.top = 16;
    w.grp1.durGroup = w.grp1.add('panel', void 0, 'Duration and Size');
    w.grp1.durGroup.orientation = 'row';
    durationLabel = w.grp1.durGroup.add('statictext {text: "Duration (seconds):", characters: 15, justify: "left"}');
    durationValue = w.grp1.durGroup.add('edittext', void 0, 2);
    durationValue.characters = 3;
    widthLabel = w.grp1.durGroup.add('statictext {text: "Width (% of window):", characters: 16, justify: "left"}');
    widthValue = w.grp1.durGroup.add('edittext', void 0, nf.highlightWidthPercent);
    widthValue.characters = 3;
    maxScaleLabel = w.grp1.durGroup.add('statictext {text: "Max Scale (%):", characters: 11, justify: "left"}');
    maxScaleValue = w.grp1.durGroup.add('edittext', void 0, nf.maxPageScale);
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
    highlightRects = nf.sourceRectsForHighlightsInTargetLayer(selectedLayer);
    if (highlightRects != null) {
      w.grp2 = w.add('panel', void 0, 'Highlights On Selected Page', {
        borderStyle: 'none'
      });
      w.grp2.alignChildren = 'left';
      w.grp2.margins.top = 16;
      w.grp3 = w.grp2.add('group', void 0, void 0, void 0);
      w.grp3.alignChildren = 'left';
      w.grp3.orientation = 'column';
      for (highlightRect in highlightRects) {
        highlightRectObject = {};
        highlightRectObject[highlightRect] = highlightRects[highlightRect];
        radioButton = w.grp3.add('button', void 0, nf.capitalizeFirstLetter(highlightRect));
        radioButton.onClick = getOnClickFunction(highlightRectObject, w);
      }
    }
    cancelButton = w.add('button', void 0, 'Cancel', {
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
      maxScale: maxScaleValue
    };
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  getOnClickFunction = function(highlightRectObject, w) {
    return function() {
      var name, options, ref, ref1;
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
      for (name in highlightRectObject) {
        goToHighlight(highlightRectObject[name], options);
      }
      w.hide();
      return false;
    };
  };

  app.beginUndoGroup(nf.undoGroupName);

  askForChoice();

  app.endUndoGroup();

  nf = {};

}).call(this);
