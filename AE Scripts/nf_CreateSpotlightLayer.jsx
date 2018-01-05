(function() {
  #include "nf_functions.jsx";
  var askForChoice, childrenOfSpotlight, createSpotlightLayer, featherExpression, getOnClickFunction, globals, importedFunctions, layerOpacityExpression, matchTransformAndParent, moveLatestMaskToSpotlightLayer, newSolid, nf, spotlightLayerMaskExpression, spotlightNameForLayer;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    spotlightColor: [0.0078, 0, 0.1216],
    initialSpotlightStartOffset: -2,
    initialSpotlightLength: 7
  };

  nf = Object.assign(importedFunctions, globals);

  askForChoice = function() {
    var cancelButton, highlightRect, highlightRects, radioButton, selectedLayer, useAllHighlightsButton, useNewMaskButton, useSelectedHighlightsButton, w;
    selectedLayer = nf.mainComp.selectedLayers[0];
    w = new Window('dialog', 'Add Spotlight');
    w.alignChildren = 'left';
    w.grp1 = w.add('panel', void 0, 'Create Spotlight from Mask', {
      borderStyle: 'none'
    });
    w.grp1.alignChildren = 'left';
    w.grp1.margins.top = 16;
    useNewMaskButton = w.grp1.add("button", void 0, "Latest Mask on Selected Layer");
    useNewMaskButton.onClick = getOnClickFunction(null, null, w);
    highlightRects = nf.sourceRectsForHighlightsInTargetLayer(selectedLayer);
    if (highlightRects != null) {
      w.grp2 = w.add('panel', void 0, 'Create Spotlight from Highlight', {
        borderStyle: 'none'
      });
      w.grp2.alignChildren = 'left';
      w.grp2.margins.top = 16;
      useAllHighlightsButton = w.grp2.add('button', void 0, "All Active Highlights");
      useAllHighlightsButton.onClick = getOnClickFunction(nf.toKeys(highlightRects), highlightRects, w, true);
      w.grp3 = w.grp2.add('group', void 0, void 0, void 0);
      w.grp3.alignChildren = 'left';
      w.grp3.orientation = 'column';
      for (highlightRect in highlightRects) {
        radioButton = w.grp3.add('checkbox', void 0, nf.capitalizeFirstLetter(highlightRect));
      }
      useSelectedHighlightsButton = w.grp2.add('button', void 0, "Selected Highlights");
      useSelectedHighlightsButton.onClick = getOnClickFunction(nf.toKeys(highlightRects), highlightRects, w, true, w.grp3.children);
    }
    cancelButton = w.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  getOnClickFunction = function(name, sourceRect, w, multiple, choices) {
    if (multiple == null) {
      multiple = false;
    }
    if (choices == null) {
      choices = null;
    }
    return function() {
      var rectKeys, theRect, thisIndex;
      if (choices != null) {
        rectKeys = nf.toKeys(sourceRect);
      }
      if (multiple) {
        for (theRect in sourceRect) {
          if (choices != null) {
            thisIndex = rectKeys.indexOf(theRect);
            if (choices[thisIndex].value) {
              createSpotlightLayer(theRect, sourceRect[theRect]);
            }
          } else {
            createSpotlightLayer(theRect, sourceRect[theRect]);
          }
        }
      } else {
        createSpotlightLayer(name, sourceRect);
      }
      w.hide();
      return false;
    };
  };

  createSpotlightLayer = function(sourceHighlightName, sourceHighlightRect) {
    var childSpan, children, dummyMask, effects, j, len1, newShape, ref, spanLayer, spanMask, spanMaskPath, spanSolidProperties, spotlightControl, spotlightLayer, spotlightLayerMask, spotlightLayerMaskName, spotlightMaskShape, spotlightName, spotlightSolidProperties, targetLayer;
    targetLayer = nf.mainComp.selectedLayers[0];
    if (targetLayer instanceof ShapeLayer || targetLayer.nullLayer || (targetLayer.source instanceof FootageItem && targetLayer.source.mainSource instanceof SolidSource)) {
      alert("Error\nPlease select the correct source layer\nDid you draw the mask on the existing spotlight layer by mistake?");
    }
    spotlightName = spotlightNameForLayer(targetLayer);
    spotlightLayer = nf.mainComp.layers.byName(spotlightName);
    if (spotlightLayer == null) {
      spotlightSolidProperties = {
        color: nf.spotlightColor,
        name: spotlightName,
        width: targetLayer.width,
        height: targetLayer.height,
        pixelAspect: 1,
        layerAfter: targetLayer,
        motionBlur: true,
        startTime: targetLayer.inPoint
      };
      spotlightLayer = newSolid(spotlightSolidProperties);
      matchTransformAndParent(spotlightLayer, targetLayer);
    }
    if (spotlightLayer.mask.numProperties === 0) {
      dummyMask = spotlightLayer.mask.addProperty('ADBE Mask Atom');
    }
    if ((sourceHighlightName != null) && (sourceHighlightRect != null)) {
      spotlightLayerMaskName = spotlightName + " - " + sourceHighlightName;
      if (nf.mainComp.layer(spotlightLayerMaskName) != null) {
        alert("Skipping duplicate of spotlight:\n'" + spotlightLayerMaskName + "'");
        return;
      }
      spotlightLayerMask = spotlightLayer.mask.addProperty("Mask");
      spotlightMaskShape = spotlightLayerMask.property("maskShape");
      newShape = spotlightMaskShape.value;
      newShape.vertices = nf.verticiesFromSourceRect(sourceHighlightRect);
      newShape.closed = true;
      spotlightMaskShape.setValue(newShape);
      spotlightLayerMask.maskMode = MaskMode.SUBTRACT;
      spotlightLayerMask.maskExpansion.setValue(sourceHighlightRect.padding);
      spotlightLayerMask.name = spotlightLayerMaskName;
    } else {
      spotlightLayerMask = moveLatestMaskToSpotlightLayer(spotlightLayer, targetLayer);
      spotlightLayerMask.name = spotlightName + " - " + (spotlightLayer.mask.numProperties - 1);
    }
    spotlightLayer.selected = false;
    spanSolidProperties = {
      color: [0, 0, 1],
      width: targetLayer.width,
      height: targetLayer.height,
      name: spotlightLayerMask.name,
      layerAfter: spotlightLayer,
      enabled: false,
      startTime: nf.mainComp.time + nf.initialSpotlightStartOffset,
      outPoint: nf.mainComp.time + nf.initialSpotlightStartOffset + nf.initialSpotlightLength
    };
    spanLayer = newSolid(spanSolidProperties);
    matchTransformAndParent(spanLayer, spotlightLayer);
    effects = spanLayer.Effects;
    spotlightControl = effects.addProperty("AV_Spotlight");
    spanMask = spanLayer.property('Masks').addProperty('Mask');
    spanMaskPath = spanMask.property('Mask Path');
    spanMaskPath.setValue(spotlightLayerMask.property('Mask Path').value);
    spotlightLayerMask.property('Mask Path').expression = "thisComp.layer(\"" + spanLayer.name + "\").mask(1).maskPath";
    children = childrenOfSpotlight(spotlightLayer);
    spotlightLayer.transform.opacity.expression = layerOpacityExpression(targetLayer, spotlightLayer, spotlightControl, spanLayer, children.string);
    ref = children.array;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      childSpan = ref[j];
      childSpan.mask(1).maskFeather.expression = featherExpression(targetLayer, spotlightLayer, spotlightControl, spanLayer, children.string);
      childSpan.mask(1).maskOpacity.expression = spotlightLayerMaskExpression(targetLayer, spotlightLayer, spotlightControl, spanLayer, children.string);
    }
    spotlightLayerMask.maskFeather.expression = "thisComp.layer(\"" + spanLayer.name + "\").mask(1).maskFeather";
    spotlightLayerMask.maskOpacity.expression = "thisComp.layer(\"" + spanLayer.name + "\").mask(1).maskOpacity";
    spanLayer.selected = false;
    targetLayer.selected = true;
  };

  spotlightLayerMaskExpression = function(targetLayer, spotlightLayer, spotlightControl, spanLayer, children) {
    var trimString;
    return trimString = "var activeBabbies, d, endOfBlock, i, o, startOfBlock, theLayer, children, inLayer, outLayer; activeBabbies = []; children = " + children + "; for (i = 0; i < children.length; i++) { theLayer = thisComp.layer(children[i]); if (theLayer.inPoint <= time && theLayer.outPoint > time) { activeBabbies.push(theLayer); } } if (activeBabbies.length > 0) { startOfBlock = activeBabbies[0].inPoint; inLayer = activeBabbies[0]; endOfBlock = activeBabbies[0].outPoint; outLayer = activeBabbies[0]; for (i = 1; i < activeBabbies.length; i++) { if (activeBabbies[i].inPoint < startOfBlock) { startOfBlock = activeBabbies[i].inPoint; inLayer = activeBabbies[i]; } if (activeBabbies[i].outPoint > endOfBlock) { endOfBlock = activeBabbies[i].outPoint; outLayer = activeBabbies[i]; } } d = thisLayer.effect(\"" + spotlightControl.name + "\")(\"Duration\"); spotIn = thisLayer.inPoint; spotOut = thisLayer.outPoint; // If this layer is the opening of a block, don't fade in \n if ((thisLayer.index == inLayer.index || thisLayer.inPoint == inLayer.inPoint) && (time < (spotIn+spotOut)/2)) { 100 } else if (time < (spotIn+spotOut)/2) { ease(time,spotIn,spotIn + d * thisComp.frameDuration,0,100) } else if (thisLayer.index == outLayer.index) { 100 } else { ease(time,spotOut - d * thisComp.frameDuration,spotOut,100,0) } } else { 0 }";
  };

  layerOpacityExpression = function(targetLayer, spotlightLayer, spotlightControl, spanLayer, children) {
    var trimString;
    return trimString = "var activeBabbies, d, endOfBlock, i, o, startOfBlock, theLayer, children, inLayer, outLayer; activeBabbies = []; children = " + children + "; for (i = 0; i < children.length; i++) { theLayer = thisComp.layer(children[i]); if (theLayer.inPoint <= time && theLayer.outPoint > time) { activeBabbies.push(theLayer); } } if (activeBabbies.length > 0) { startOfBlock = activeBabbies[0].inPoint; inLayer = activeBabbies[0]; endOfBlock = activeBabbies[0].outPoint; outLayer = activeBabbies[0]; for (i = 1; i < activeBabbies.length; i++) { if (activeBabbies[i].inPoint < startOfBlock) { startOfBlock = activeBabbies[i].inPoint; inLayer = activeBabbies[i]; } if (activeBabbies[i].outPoint > endOfBlock) { endOfBlock = activeBabbies[i].outPoint; outLayer = activeBabbies[i]; } } oIn = inLayer.effect(\"" + spotlightControl.name + "\")(\"Opacity\"); dIn = inLayer.effect(\"" + spotlightControl.name + "\")(\"Duration\"); oOut = outLayer.effect(\"" + spotlightControl.name + "\")(\"Opacity\"); dOut = outLayer.effect(\"" + spotlightControl.name + "\")(\"Duration\"); if (time < (endOfBlock + startOfBlock) / 2) { ease(time, startOfBlock, startOfBlock + dIn * thisComp.frameDuration, 0, oIn); } else { ease(time, endOfBlock - dOut * thisComp.frameDuration, endOfBlock, oOut, 0); } } else { 0 }";
  };

  featherExpression = function(targetLayer, spotlightLayer, spotlightControl, spanLayer, children) {
    var trimString;
    return trimString = "var activeBabbies, d, endOfBlock, i, o, startOfBlock, theLayer, children, inLayer, outLayer; activeBabbies = []; children = " + children + "; for (i = 0; i < children.length; i++) { theLayer = thisComp.layer(children[i]); if (theLayer.inPoint <= time && theLayer.outPoint > time) { activeBabbies.push(theLayer); } } if (activeBabbies.length > 0) { startOfBlock = activeBabbies[0].inPoint; inLayer = activeBabbies[0]; endOfBlock = activeBabbies[0].outPoint; outLayer = activeBabbies[0]; for (i = 1; i < activeBabbies.length; i++) { if (activeBabbies[i].inPoint < startOfBlock) { startOfBlock = activeBabbies[i].inPoint; inLayer = activeBabbies[i]; } if (activeBabbies[i].outPoint > endOfBlock) { endOfBlock = activeBabbies[i].outPoint; outLayer = activeBabbies[i]; } } fIn = inLayer.effect(\"" + spotlightControl.name + "\")(\"Feather\"); dIn = inLayer.effect(\"" + spotlightControl.name + "\")(\"Duration\"); fOut = outLayer.effect(\"" + spotlightControl.name + "\")(\"Feather\"); dOut = outLayer.effect(\"" + spotlightControl.name + "\")(\"Duration\"); if (time < (endOfBlock + startOfBlock) / 2) { ease(time, startOfBlock, startOfBlock + dIn * thisComp.frameDuration, [300, 300], [fIn, fIn]); } else { ease(time, endOfBlock - dOut * thisComp.frameDuration, endOfBlock, [fOut, fOut], [300, 300]); } } else { [300,300] }";
  };

  childrenOfSpotlight = function(spotlightLayer) {
    var allLayers, childLayerArray, childLayerArrayString, i, returnObject, theLayer;
    allLayers = nf.mainComp.layers;
    childLayerArrayString = "[";
    childLayerArray = [];
    i = 1;
    while (i <= allLayers.length) {
      theLayer = allLayers[i];
      if (theLayer.parent === spotlightLayer) {
        childLayerArrayString += "\"" + theLayer.name + "\"";
        childLayerArray.push(theLayer);
        if (i < allLayers.length) {
          childLayerArrayString += ",";
        }
      }
      i++;
    }
    childLayerArrayString += "]";
    return returnObject = {
      string: childLayerArrayString,
      array: childLayerArray
    };
  };

  moveLatestMaskToSpotlightLayer = function(spotlightLayer, targetLayer) {
    var spotlightLayerMask, spotlightMask;
    spotlightMask = targetLayer.mask(targetLayer.mask.numProperties);
    spotlightLayerMask = spotlightLayer.mask.addProperty('ADBE Mask Atom');
    spotlightLayerMask.maskPath.setValue(spotlightMask.maskPath.value);
    spotlightLayerMask.maskMode = MaskMode.SUBTRACT;
    spotlightMask.remove();
    return spotlightLayerMask;
  };

  matchTransformAndParent = function(newLayer, targetLayer) {
    var j, len1, propertiesToCopy, property, targetParent;
    targetParent = targetLayer.parent;
    targetLayer.parent = null;
    propertiesToCopy = ["rotation", "anchorPoint", "position", "scale"];
    for (j = 0, len1 = propertiesToCopy.length; j < len1; j++) {
      property = propertiesToCopy[j];
      newLayer.transform[property].setValue(targetLayer.transform[property].value);
    }
    targetLayer.parent = targetParent;
    newLayer.parent = targetLayer;
    return newLayer;
  };

  newSolid = function(props) {
    var newSolidLayer, ref, ref1, ref10, ref11, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    props = {
      color: (ref = props.color) != null ? ref : [0, 0, 0],
      name: (ref1 = props.name) != null ? ref1 : "New Solid",
      width: (ref2 = props.width) != null ? ref2 : nf.mainComp.width,
      height: (ref3 = props.height) != null ? ref3 : nf.mainComp.height,
      pixelAspect: (ref4 = props.pixelAspect) != null ? ref4 : 1,
      layerAfter: (ref5 = props.layerAfter) != null ? ref5 : null,
      layerBefore: (ref6 = props.layerBefore) != null ? ref6 : null,
      motionBlur: (ref7 = props.motionBlur) != null ? ref7 : false,
      parent: (ref8 = props.parent) != null ? ref8 : null,
      enabled: props.enabled === false ? false : void 0,
      startTime: (ref9 = props.startTime) != null ? ref9 : null,
      outPoint: (ref10 = props.outPoint) != null ? ref10 : null,
      inPoint: (ref11 = props.inPoint) != null ? ref11 : null
    };
    newSolidLayer = nf.mainComp.layers.addSolid(props.color, props.name, props.width, props.height, props.pixelAspect);
    if (props.layerAfter) {
      newSolidLayer.moveBefore(props.layerAfter);
    }
    if (props.layerBefore) {
      newSolidLayer.moveAfter(props.layerBefore);
    }
    if (props.parent) {
      newSolidLayer.parent = props.parent;
    }
    if (props.startTime) {
      newSolidLayer.startTime = props.startTime;
    }
    if (props.inPoint) {
      newSolidLayer.inPoint = props.inPoint;
    }
    if (props.outPoint) {
      newSolidLayer.outPoint = props.outPoint;
    }
    if (props.enabled === false) {
      newSolidLayer.enabled = props.enabled;
    }
    return newSolidLayer;
  };

  spotlightNameForLayer = function(targetLayer) {
    var layerName, name, shortName;
    layerName = targetLayer.name;
    shortName = layerName.substr(0, layerName.indexOf('.'));
    return name = 'Spot - ' + shortName;
  };

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
      var k, len, n, o;
      k = void 0;
      if (this === null) {
        throw new TypeError('"this" is null or not defined');
      }
      o = Object(this);
      len = o.length >>> 0;
      if (len === 0) {
        return -1;
      }
      n = fromIndex | 0;
      if (n >= len) {
        return -1;
      }
      k = Math.max(n >= 0 ? n : len - Math.abs(n));
      while (k < len) {
        if (k in o && o[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }

  app.beginUndoGroup('Create Spotlight Layer');

  askForChoice();

  app.endUndoGroup();

}).call(this);
