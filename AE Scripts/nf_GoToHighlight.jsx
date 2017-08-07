(function() {
  #include "nf_functions.jsx";
  var askForChoice, getOnClickFunction, getTargetPosition, getTargetScale, globals, goToHighlight, importedFunctions, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Go To Highlight',
    highlightWidthPercent: 85,
    easeType: KeyframeInterpolationType.BEZIER,
    easeWeight: 33,
    defaultOptions: {
      movePageLayer: false,
      makeInKeyframe: true,
      moveOnly: false,
      duration: 2
    }
  };

  nf = Object.assign(importedFunctions, globals);

  goToHighlight = function(highlight, options) {
    var didRemoveKeys, ease, highlightPageLayer, i, j, keyframeTimes, layerToMove, len, len1, now, posKey, positionProp, previousParent, ref, ref1, ref2, ref3, scaleKey, scaleProp, selectedLayer, targetPosition, targetScale, theTime;
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
      targetScale = getTargetScale(highlight, scaleProp.value, highlightPageLayer);
      scaleProp.setValuesAtTimes(keyframeTimes, [scaleProp.valueAtTime(now, false), targetScale]);
      for (i = 0, len = keyframeTimes.length; i < len; i++) {
        theTime = keyframeTimes[i];
        scaleKey = scaleProp.nearestKeyIndex(theTime);
        scaleProp.setInterpolationTypeAtKey(scaleKey, nf.easeType, nf.easeType);
        ease = new KeyframeEase(0, nf.easeWeight);
        scaleProp.setTemporalEaseAtKey(scaleKey, [ease, ease, ease]);
      }
      targetPosition = getTargetPosition(highlight, positionProp.value, highlightPageLayer, keyframeTimes[1]);
      positionProp.setValuesAtTimes(keyframeTimes, [positionProp.valueAtTime(now, false), targetPosition]);
      for (j = 0, len1 = keyframeTimes.length; j < len1; j++) {
        theTime = keyframeTimes[j];
        posKey = positionProp.nearestKeyIndex(theTime);
        positionProp.setInterpolationTypeAtKey(posKey, nf.easeType, nf.easeType);
        ease = new KeyframeEase(0, nf.easeWeight);
        positionProp.setTemporalEaseAtKey(posKey, [ease]);
      }
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
      posKey = positionProp.nearestKeyIndex(nf.mainComp.time);
      scaleKey = scaleProp.nearestKeyIndex(nf.mainComp.time);
      positionProp.setInterpolationTypeAtKey(posKey, nf.easeType, nf.easeType);
      scaleProp.setInterpolationTypeAtKey(scaleKey, nf.easeType, nf.easeType);
      ease = new KeyframeEase(0, nf.easeWeight);
      positionProp.setTemporalEaseAtKey(posKey, [ease]);
      scaleProp.setTemporalEaseAtKey(scaleKey, [ease, ease, ease]);
    }
    if (previousParent != null) {
      return layerToMove.parent = previousParent;
    }
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

  getTargetScale = function(highlight, layerScale, highlightPageLayer, targetTime) {
    var compWidth, highlightRectInContext, newScale, scaleFactor, targetHighlightWidth;
    if (targetTime == null) {
      targetTime = null;
    }
    highlightRectInContext = nf.rectRelativeToComp(highlight, highlightPageLayer, targetTime);
    compWidth = nf.mainComp.width;
    targetHighlightWidth = nf.highlightWidthPercent / 100 * compWidth;
    scaleFactor = targetHighlightWidth / highlightRectInContext.width;
    return newScale = [layerScale[0] * scaleFactor, layerScale[1] * scaleFactor];
  };

  askForChoice = function() {
    var cancelButton, durationLabel, durationValue, highlightRect, highlightRectObject, highlightRects, radioButton, radioButtonInOut, radioButtonMoveOnly, radioButtonOneKF, radioButtonPageLayer, radioButtonParentLayer, radioGroupKeyframes, radioGroupTargetLayer, selectedLayer, w;
    selectedLayer = nf.mainComp.selectedLayers[0];
    w = new Window('dialog', 'Go To Highlight');
    w.alignChildren = 'left';
    w.grp1 = w.add('panel', void 0, 'Options', {
      borderStyle: 'none'
    });
    w.grp1.alignChildren = 'left';
    w.grp1.margins.top = 16;
    w.grp1.durGroup = w.grp1.add('group');
    durationLabel = w.grp1.durGroup.add('statictext {text: "Duration (seconds)", characters: 15, justify: "left"}');
    durationValue = w.grp1.durGroup.add('edittext', void 0, 2);
    durationValue.characters = 3;
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
      movePageLayer: radioButtonPageLayer
    };
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  getOnClickFunction = function(highlightRectObject, w) {
    return function() {
      var name, options;
      options = {
        movePageLayer: nf.UIControls.movePageLayer.value,
        duration: parseFloat(nf.UIControls.duration.text),
        moveOnly: nf.UIControls.keyframes.moveOnly.value,
        makeInKeyframe: nf.UIControls.keyframes.inOut.value
      };
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
