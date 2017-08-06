(function() {
  #include "nf_functions.jsx";
  var askForChoice, getOnClickFunction, getTargetPosition, getTargetScale, globals, goToHighlight, importedFunctions, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Go To Highlight',
    highlightWidthPercent: 85,
    easeType: KeyframeInterpolationType.BEZIER,
    easeWeight: 33
  };

  nf = Object.assign(importedFunctions, globals);

  goToHighlight = function(highlight, options) {
    var ease, highlightPageLayer, i, j, keyframeTimes, layerToMove, len, len1, now, posKey, positionProp, ref, ref1, ref2, results, scaleKey, scaleProp, selectedLayer, targetPosition, targetScale, theTime;
    options = {
      movePageLayer: (ref = options.movePageLayer) != null ? ref : false,
      makeInKeyframe: (ref1 = options.makeInKeyframe) != null ? ref1 : true,
      duration: (ref2 = options.duration) != null ? ref2 : 1
    };
    selectedLayer = nf.mainComp.selectedLayers[0];
    highlightPageLayer = selectedLayer;
    layerToMove = options.movePageLayer ? selectedLayer : nf.pageParent(selectedLayer);
    if (layerToMove == null) {
      return alert("No Layer Parent Found!");
    }
    positionProp = layerToMove.transform.position;
    scaleProp = layerToMove.transform.scale;
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
      results = [];
      for (j = 0, len1 = keyframeTimes.length; j < len1; j++) {
        theTime = keyframeTimes[j];
        posKey = positionProp.nearestKeyIndex(theTime);
        positionProp.setInterpolationTypeAtKey(posKey, nf.easeType, nf.easeType);
        ease = new KeyframeEase(0, nf.easeWeight);
        results.push(positionProp.setTemporalEaseAtKey(posKey, [ease]));
      }
      return results;
    } else {
      return positionProp.setValueAtTime(now, targetPosition);
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
    var cancelButton, highlightRect, highlightRectObject, highlightRects, radioButton, selectedLayer, w;
    selectedLayer = nf.mainComp.selectedLayers[0];
    w = new Window('dialog', 'Go To Highlight');
    w.alignChildren = 'left';
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
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  getOnClickFunction = function(highlightRectObject, w) {
    return function() {
      var name, options;
      options = {
        movePageLayer: true,
        makeInKeyframe: true,
        duration: 1
      };
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
