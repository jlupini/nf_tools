(function() {
  #include "lib/extendscript.prototypes.js";
  var nf;

  nf = {};

  nf.PageTurn = {
    FLIPPEDUP: 100,
    FLIPPEDDOWN: 200,
    TURNING: 300,
    NOPAGETURN: 400,
    BROKEN: 500
  };

  nf.findItem = function(itemName) {
    var i, thisItem;
    i = 1;
    while (i <= app.project.items.length) {
      thisItem = app.project.items[i];
      if (thisItem.name === itemName) {
        return thisItem;
      }
      i++;
    }
    return null;
  };

  nf.isHighlightLayer = function(theLayer) {
    var ref;
    return theLayer instanceof ShapeLayer && ((ref = theLayer.Effects.property(1)) != null ? ref.matchName : void 0) === "AV_Highlighter";
  };

  nf.findItemIn = function(itemName, sourceFolderItem) {
    var i;
    i = 1;
    while (i <= sourceFolderItem.numItems) {
      if (sourceFolderItem.item(i).name === itemName) {
        return sourceFolderItem.item(i);
      }
      i++;
    }
    return null;
  };

  nf.pageTreeForPaper = function(sourceLayer) {
    var activePageIndex, allLayers, i, pageObject, pageParent, testLayer, tree;
    this.layerObj = function(layerName) {
      return function() {
        return app.project.activeItem.layers.byName(layerName);
      };
    };
    pageParent = nf.pageParent(sourceLayer);
    allLayers = app.project.activeItem.layers;
    tree = {
      name: pageParent.name,
      index: pageParent.index,
      layer: this.layerObj(pageParent.name),
      pages: []
    };
    i = 1;
    while (i <= allLayers.length) {
      testLayer = allLayers[i];
      if (testLayer.parent === pageParent && nf.isCompLayer(testLayer)) {
        pageObject = {
          name: testLayer.name,
          index: testLayer.index,
          layer: this.layerObj(testLayer.name),
          active: false,
          highlights: nf.sourceRectsForHighlightsInTargetLayer(testLayer, nf.isTitlePage(testLayer))
        };
        tree.pages.push(pageObject);
      }
      i++;
    }
    activePageIndex = nf.activePageIndexInArray(tree.pages);
    if (activePageIndex != null) {
      tree.pages[activePageIndex].active = true;
      tree.activePage = tree.pages[activePageIndex].layer();
    }
    return tree;
  };

  nf.isTitlePage = function(testLayer) {
    var isTitlePage, len, m, test, tests;
    tests = ['pg01', 'pg1', 'page1', 'page01'];
    isTitlePage = false;
    for (m = 0, len = tests.length; m < len; m++) {
      test = tests[m];
      if (testLayer.name.indexOf(test) !== -1) {
        isTitlePage = true;
      }
    }
    return isTitlePage;
  };

  nf.activePageIndexInArray = function(pages) {
    var activePage, activePageIndex, i, page, pageLayer;
    activePage = null;
    activePageIndex = null;
    i = 0;
    while (i < pages.length) {
      page = pages[i];
      pageLayer = page.layer();
      if (pageLayer.active && (nf.pageTurnStatus(pageLayer) === nf.PageTurn.FLIPPEDDOWN || nf.pageTurnStatus(pageLayer) === nf.PageTurn.NOPAGETURN)) {
        if ((activePage == null) || page.index < activePage.index) {
          activePage = page;
          activePageIndex = i;
        }
      }
      i++;
    }
    return activePageIndex;
  };

  nf.pageLayerCanBeActive = function(pageLayer) {
    return pageLayer.active && (nf.pageTurnStatus(pageLayer) === nf.PageTurn.FLIPPEDDOWN || nf.pageTurnStatus(pageLayer) === nf.PageTurn.NOPAGETURN);
  };


  /*
  Turn a page, with a duration in seconds, starting at a given time, optionally flipping down to reveal instead of flippingUp
  Current state of the page's fold will override a given flipUp value if there is already a pageTurn Effect
   */

  nf.turnPageAtTime = function(page, duration, time, flipUp) {
    var downPosition, endStatus, endTime, foldPosition, pageSize, positions, startStatus, startTime, times, upPosition;
    if (duration == null) {
      duration = 1.5;
    }
    if (time == null) {
      time = null;
    }
    if (flipUp == null) {
      flipUp = true;
    }
    if (!nf.isCompLayer(page)) {
      return alert("Cannot turn page on a non-comp layer");
    }
    startTime = time != null ? time : app.project.activeItem.time;
    endTime = startTime + duration;
    startStatus = nf.pageTurnStatus(page, startTime);
    endStatus = nf.pageTurnStatus(page, endTime);
    if (startStatus === nf.PageTurn.TURNING || endStatus === nf.PageTurn.TURNING) {
      return alert("Page is already turning at specified time");
    }
    if (startStatus === nf.PageTurn.BROKEN) {
      return alert("Page Turn keyframes seem broken...");
    }
    if (startStatus === nf.PageTurn.NOPAGETURN) {
      nf.addPageTurnEffects(page);
    }
    pageSize = {
      width: page.source.width,
      height: page.source.height
    };
    downPosition = [pageSize.width, pageSize.height];
    upPosition = [-pageSize.width, -pageSize.height];
    positions = [downPosition, upPosition];
    if (startStatus === nf.PageTurn.FLIPPEDUP) {
      flipUp = false;
    } else if (startStatus === nf.PageTurn.FLIPPEDDOWN) {
      flipUp = true;
    }
    if (!flipUp) {
      positions.reverse();
    }
    times = [startTime, endTime];
    foldPosition = page.effect("CC Page Turn").property("Fold Position");
    foldPosition.setValuesAtTimes(times, positions);
    return nf.setSymmetricalTemporalEasingOnlyForProperties(foldPosition, times, null, null, true);
  };

  nf.addPageTurnEffects = function(page) {
    var dropShadowEffect, dropShadowMatchName, forceMotionBlurEffect, forceMotionBlurMatchName, pageTurnEffect, pageTurnMatchName;
    forceMotionBlurMatchName = "CC Force Motion Blur";
    dropShadowMatchName = "ADBE Drop Shadow";
    pageTurnMatchName = "CC Page Turn";
    pageTurnEffect = page.effect(pageTurnMatchName);
    if (pageTurnEffect == null) {
      pageTurnEffect = page.Effects.addProperty(pageTurnMatchName);
      pageTurnEffect.property("Fold Radius").setValue(500);
    }
    forceMotionBlurEffect = page.effect(forceMotionBlurMatchName);
    if (forceMotionBlurEffect == null) {
      forceMotionBlurEffect = page.Effects.addProperty(forceMotionBlurMatchName);
      forceMotionBlurEffect.property("Override Shutter Angle").setValue(0);
    }
    dropShadowEffect = page.effect(dropShadowMatchName);
    if (dropShadowEffect != null) {
      dropShadowEffect.remove();
    }
    dropShadowEffect = page.Effects.addProperty(dropShadowMatchName);
    dropShadowEffect.property("Opacity").setValue(0.75 * 255);
    dropShadowEffect.property("Direction").setValue(125);
    dropShadowEffect.property("Distance").setValue(20);
    dropShadowEffect.property("Softness").setValue(300);
    return page;
  };


  /*
  Given a layer, returns the nf.PageTurn enum
   */

  nf.pageTurnStatus = function(pageLayer, time) {
    var foldPosition, foldPositionProperty, pageTurnEffect, threshold;
    if (time == null) {
      time = null;
    }
    time = time != null ? time : app.project.activeItem.time;
    pageTurnEffect = pageLayer.effect("CC Page Turn");
    foldPositionProperty = pageTurnEffect != null ? pageTurnEffect.property("Fold Position") : void 0;
    foldPosition = foldPositionProperty != null ? foldPositionProperty.value : void 0;
    threshold = 3840;
    if (pageTurnEffect == null) {
      return nf.PageTurn.NOPAGETURN;
    } else if (foldPosition[0] >= threshold) {
      return nf.PageTurn.FLIPPEDDOWN;
    } else if (foldPosition[0] <= threshold * -1) {
      return nf.PageTurn.FLIPPEDUP;
    } else if (foldPositionProperty.numKeys !== 0) {
      return nf.PageTurn.TURNING;
    } else {
      return nf.PageTurn.BROKEN;
    }
  };

  nf.isCompLayer = function(testLayer) {
    return testLayer instanceof AVLayer && testLayer.source instanceof CompItem;
  };

  nf.pageParent = function(selectedLayer) {
    var ref;
    if (selectedLayer.nullLayer) {
      return selectedLayer;
    }
    if ((ref = selectedLayer.parent) != null ? ref.nullLayer : void 0) {
      return selectedLayer.parent;
    }
    return null;
  };

  nf.disconnectBubbleupsInLayers = function(layers, names) {
    var bubbleupLayers, effect, i, len, len1, m, n, property, propertyCount, theLayer;
    if (names == null) {
      names = null;
    }
    if (!BE.isArray(layers)) {
      layers = [layers];
    }
    bubbleupLayers = [];
    for (m = 0, len = layers.length; m < len; m++) {
      theLayer = layers[m];
      if (nf.isCompLayer(theLayer)) {
        bubbleupLayers = bubbleupLayers.concat(nf.layerCollectionToArray(theLayer.source.layers));
      } else {
        bubbleupLayers.push(theLayer);
      }
    }
    for (n = 0, len1 = bubbleupLayers.length; n < len1; n++) {
      theLayer = bubbleupLayers[n];
      if ((names == null) || names.indexOf(theLayer.name) > -1 || (names.indexOf(theLayer.containingComp.name) > -1 && theLayer.name.indexOf("Annotation") > -1)) {
        effect = theLayer.effect("AV_Highlighter") || theLayer.effect("Guide Layer");
        propertyCount = effect != null ? effect.numProperties : void 0;
        i = 1;
        while (i < propertyCount && (effect != null)) {
          property = effect.property(i);
          property.expression = "";
          i++;
        }
      }
    }
    return layers;
  };

  nf.setSymmetricalTemporalEasingOnlyForProperties = function(theProperties, keys, easeType, easeWeight, keysAsTimes) {
    var ease, i, key, keyItem, length, ref, ref1, results, singleKey, singleProperty, spatialEaseArray, temporalEaseArray, theProperty;
    if (easeType == null) {
      easeType = null;
    }
    if (easeWeight == null) {
      easeWeight = null;
    }
    if (keysAsTimes == null) {
      keysAsTimes = false;
    }
    if (theProperties instanceof Array && keys instanceof Array) {
      if (theProperties.length !== keys.length) {
        return -1;
      }
    }
    singleKey = null;
    singleProperty = null;
    if (theProperties instanceof Array && !(keys instanceof Array)) {
      singleKey = keys;
    }
    if (keys instanceof Array && !(theProperties instanceof Array)) {
      singleProperty = theProperties;
    }
    if (easeType == null) {
      easeType = (ref = nf.easeType) != null ? ref : KeyframeInterpolationType.BEZIER;
    }
    if (easeWeight == null) {
      easeWeight = (ref1 = nf.easeWeight) != null ? ref1 : 33;
    }
    i = 0;
    length = singleProperty != null ? keys.length : theProperties.length;
    results = [];
    while (i < length) {
      theProperty = singleProperty != null ? singleProperty : theProperties[i];
      keyItem = singleKey != null ? singleKey : keys[i];
      key = keysAsTimes ? theProperty.nearestKeyIndex(keyItem) : keyItem;
      theProperty.setInterpolationTypeAtKey(key, easeType, easeType);
      ease = new KeyframeEase(0, easeWeight);
      temporalEaseArray = [ease];
      if (theProperty.propertyValueType === PropertyValueType.TwoD) {
        temporalEaseArray = [ease, ease];
      } else if (theProperty.propertyValueType === PropertyValueType.ThreeD) {
        temporalEaseArray = [ease, ease, ease];
      }
      theProperty.setTemporalEaseAtKey(key, temporalEaseArray);
      spatialEaseArray = null;
      if (theProperty.propertyValueType === PropertyValueType.TwoD_SPATIAL) {
        spatialEaseArray = [0, 0];
      } else if (theProperty.propertyValueType === PropertyValueType.ThreeD_SPATIAL) {
        spatialEaseArray = [0, 0, 0];
      }
      if (spatialEaseArray != null) {
        theProperty.setSpatialTangentsAtKey(key, spatialEaseArray);
      }
      results.push(i++);
    }
    return results;
  };

  nf.layerCollectionToArray = function(layerCollection) {
    var arr, i;
    arr = [];
    i = 1;
    while (i <= layerCollection.length) {
      arr.push(layerCollection[i]);
      i++;
    }
    return arr;
  };

  nf.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  nf.isNonEmptyString = function(unknownVariable) {
    if (((typeof unknownVariable !== "undefined") && (typeof unknownVariable.valueOf() === "string")) && (unknownVariable.length > 0)) {
      return true;
    }
    return false;
  };

  nf.markerDrivenExpression = function(model) {
    var defaults, durationString, generalValueExpression, layerName, term, trimString, valueAString, valueBString;
    term = ";\n";
    defaults = {
      duration: "30",
      valueA: "0",
      valueB: "0",
      subEffect: "Slider"
    };
    generalValueExpression = function(key) {
      var effectName, expressionString, subEffectName, subModel;
      subModel = model[key];
      expressionString = "";
      if (subModel != null) {
        if (subModel.value != null) {
          expressionString += subModel.value;
        } else if (subModel.effect != null) {
          if (nf.isNonEmptyString(subModel.effect)) {
            effectName = subModel.effect;
          } else {
            effectName = subModel.effect.name;
          }
          if (subModel.subEffect != null) {
            if (nf.isNonEmptyString(subModel.subEffect)) {
              subEffectName = subModel.subEffect;
            } else {
              subEffectName = subModel.subEffect.name;
            }
          } else {
            subEffectName = defaults.subEffect;
          }
          expressionString += "thisComp.layer(\"" + layerName + "\").effect(\"" + effectName + "\")(\"" + subEffectName + "\")";
        } else {
          expressionString += defaults[key];
        }
      } else {
        expressionString += defaults[key];
      }
      expressionString += term;
      return expressionString;
    };
    if (!((model.layer != null) && (model.duration != null))) {
      return alert("Error\nNo layer or duration specified in nf.markerDrivenExpression!");
    }
    if (nf.isNonEmptyString(model.layer)) {
      layerName = model.layer;
    } else {
      layerName = model.layer.name;
    }
    durationString = generalValueExpression("duration");
    valueAString = generalValueExpression("valueA");
    valueBString = generalValueExpression("valueB");
    trimString = "if (thisComp.layer(\"" + layerName + "\").marker.numKeys > 0) {\n d = " + durationString + " m = thisComp.layer(\"" + layerName + "\").marker.nearestKey(time);\n t = m.time;\n valueA = " + valueAString + " valueB = " + valueBString + " \n if (m.index%2) {\n // For all in markers\n ease(time,t,t+d*thisComp.frameDuration,valueA,valueB)\n } else {\n // For all out markers\n ease(time,t,t-d*thisComp.frameDuration,valueB,valueA)\n }\n } else {\n value\n }";
    return trimString;
  };

  nf.sourceRectsForHighlightsInTargetLayer = function(targetLayer, includeTitlePage) {
    var i, layerParent, ref, sourceCompLayers, sourceHighlightLayers, sourceHighlightRects, theLayer;
    if (includeTitlePage == null) {
      includeTitlePage = false;
    }
    sourceCompLayers = (ref = targetLayer.source) != null ? ref.layers : void 0;
    if (sourceCompLayers == null) {
      return null;
    }
    sourceHighlightLayers = [];
    sourceHighlightRects = {};
    i = 1;
    while (i <= sourceCompLayers.length) {
      theLayer = sourceCompLayers[i];
      if (theLayer.Effects.numProperties > 0) {
        if (theLayer instanceof ShapeLayer && theLayer.Effects.property(1).matchName === "AV_Highlighter") {
          sourceHighlightLayers.push(theLayer);
          layerParent = theLayer.parent;
          theLayer.parent = null;
          sourceHighlightRects[theLayer.name] = nf.sourceRectToComp(theLayer);
          sourceHighlightRects[theLayer.name].padding = theLayer.Effects.property(1).property("Thickness").value || 0;
          sourceHighlightRects[theLayer.name].name = theLayer.name;
          sourceHighlightRects[theLayer.name].bubbled = theLayer.Effects.property("AV_Highlighter").property("Spacing").expressionEnabled;
          sourceHighlightRects[theLayer.name].broken = theLayer.Effects.property("AV_Highlighter").property("Spacing").expressionError;
          theLayer.parent = layerParent;
        }
      }
      i++;
    }
    if (includeTitlePage) {
      sourceHighlightRects["Title Page"] = {
        left: 0,
        top: 0,
        width: targetLayer.source.width,
        height: 1080,
        padding: 0,
        name: "Title Page"
      };
    }
    return sourceHighlightRects;
  };

  nf.sourceRectToComp = function(layer, targetTime, keepNull) {
    var bottomRightPoint, expressionBase, mainCompTime, rect, tempNull, topLeftPoint;
    if (targetTime == null) {
      targetTime = null;
    }
    if (keepNull == null) {
      keepNull = false;
    }
    mainCompTime = app.project.activeItem.time;
    targetTime = targetTime != null ? targetTime : mainCompTime;
    tempNull = layer.containingComp.layers.addNull();
    app.project.activeItem.time = mainCompTime;
    expressionBase = "rect = thisComp.layer(" + layer.index + ").sourceRectAtTime(time);";
    tempNull.transform.position.expression = expressionBase + ("thisComp.layer(" + layer.index + ").toComp([rect.left, rect.top])");
    topLeftPoint = tempNull.transform.position.valueAtTime(targetTime, false);
    tempNull.transform.position.expression = expressionBase + ("thisComp.layer(" + layer.index + ").toComp([rect.left + rect.width, rect.top + rect.height])");
    bottomRightPoint = tempNull.transform.position.valueAtTime(targetTime, false);
    if (!keepNull) {
      tempNull.remove();
    }
    return rect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };

  nf.rectRelativeToComp = function(rect, layer, targetTime) {
    var bottomRightPoint, newRect, topLeftPoint;
    if (targetTime == null) {
      targetTime = null;
    }
    topLeftPoint = nf.pointRelativeToComp([rect.left, rect.top], layer, targetTime);
    bottomRightPoint = nf.pointRelativeToComp([rect.left + rect.width, rect.top + rect.height], layer, targetTime);
    return newRect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };

  nf.pointRelativeToComp = function(sourcePoint, layer, targetTime) {
    var newPoint, tempNull;
    if (targetTime == null) {
      targetTime = null;
    }
    targetTime = targetTime != null ? targetTime : app.project.activeItem.time;
    tempNull = nf.nullAtPointRelativeToComp(sourcePoint, layer);
    newPoint = tempNull.transform.position.valueAtTime(targetTime, false);
    tempNull.remove();
    return newPoint;
  };

  nf.nullAtPointRelativeToComp = function(sourcePoint, layer) {
    var targetTime, tempNull;
    targetTime = targetTime != null ? targetTime : app.project.activeItem.time;
    tempNull = layer.containingComp.layers.addNull();
    tempNull.transform.position.expression = "a = thisComp.layer(" + layer.index + ").toComp([" + sourcePoint[0] + ", " + sourcePoint[1] + "]); a";
    return tempNull;
  };

  nf.toKeys = function(dict) {
    var allKeys, key;
    allKeys = [];
    for (key in dict) {
      allKeys.push(key);
    }
    return allKeys;
  };

  nf.verticiesFromSourceRect = function(rect) {
    var v;
    v = {
      topLeft: [rect.left, rect.top],
      topRight: [rect.left + rect.width, rect.top],
      bottomRight: [rect.left + rect.width, rect.top + rect.height],
      bottomLeft: [rect.left, rect.top + rect.height]
    };
    return [v.topLeft, v.bottomLeft, v.bottomRight, v.topRight];
  };

  nf.trimExpression = function(thisLine, numberOfLines) {
    var trimString;
    return trimString = "slider_val = effect(\"AV Highlighter\")(\"Completion\") / 10; start_offset = effect(\"AV Highlighter\")(\"Start Offset\"); end_offset = effect(\"AV Highlighter\")(\"End Offset\"); line_count = " + numberOfLines + "; this_line = " + thisLine + "; total_points = line_count * 100; gross_points = total_points - start_offset - end_offset; points_per_line = gross_points/line_count*100; total_percent = (slider_val / 100 * gross_points + start_offset) / total_points * 100; min_percent = 100/line_count*(this_line-1); max_percent = 100/line_count*this_line; if (total_percent <= min_percent) {0;} else if ( total_percent >= max_percent ) { 100; } else { (total_percent - min_percent) / (max_percent - min_percent) * 100; }";
  };

  nf.upgradeHighlightLayer = function(highlightLayer) {
    var completionControl, endOffset, endOffsetControl, i, lineCount, lineNumber, ref, thisLine, trimProperty;
    lineCount = highlightLayer.property("Contents").numProperties;
    i = lineCount;
    lineNumber = 1;
    while (i >= 1) {
      thisLine = highlightLayer.property("Contents").property(i);
      trimProperty = thisLine.property('Contents').property('Trim Paths 1').property('End');
      trimProperty.expression = nf.trimExpression(lineNumber, lineCount);
      if (lineNumber === lineCount) {
        if ((100 > (ref = trimProperty.value) && ref > 0)) {
          endOffset = 100 - trimProperty.value;
          completionControl = highlightLayer.property("Effects").property("AV Highlighter").property("Completion");
          endOffsetControl = highlightLayer.property("Effects").property("AV Highlighter").property("End Offset");
          if (completionControl.expressionEnabled === false) {
            completionControl.setValue(1000);
            endOffsetControl.setValue(endOffset);
          }
        }
      }
      i--;
      lineNumber++;
    }
    return highlightLayer;
  };

  nf.fixTrimExpressionsForHighlightLayer = function(highlightLayer) {
    var i, lineCount, lineNumber, results, thisLine, trimProperty;
    lineCount = highlightLayer.property("Contents").numProperties;
    i = lineCount;
    lineNumber = 1;
    results = [];
    while (i >= 1) {
      thisLine = highlightLayer.property("Contents").property(i);
      trimProperty = thisLine.property('Contents').property('Trim Paths 1').property('End');
      trimProperty.expression = nf.trimExpression(lineNumber, lineCount);
      i--;
      results.push(lineNumber++);
    }
    return results;
  };

  nf.bubbleUpGuideLayers = function(pagesToBubble, choices) {
    var checkbox, checkboxName, childGuideCheckbox, effects, guideLayer, i, layersInPageComp, mainComp, newValue, shouldBubble, sourceExpression, targetComp, targetLayer;
    if (choices == null) {
      choices = null;
    }
    mainComp = app.project.activeItem;
    i = pagesToBubble.length - 1;
    while (i >= 0) {
      targetLayer = pagesToBubble[i];
      targetComp = targetLayer.source;
      layersInPageComp = targetComp.layers;
      guideLayer = layersInPageComp.byName('Annotation Guide');
      if (guideLayer) {
        childGuideCheckbox = guideLayer.property('Effects').property('Guide Layer').property('Checkbox');
        shouldBubble = false;
        if (choices != null) {
          shouldBubble = choices.indexOf(targetLayer.name) >= 0;
        } else {
          shouldBubble = !childGuideCheckbox.expressionEnabled;
        }
        if (shouldBubble) {
          effects = targetLayer.Effects;
          checkbox = effects.addProperty('ADBE Checkbox Control');
          checkboxName = 'Guide Layer';
          checkbox.name = checkboxName;
          newValue = void 0;
          if (!guideLayer.enabled) {
            guideLayer.enabled = true;
            newValue = false;
          } else {
            newValue = childGuideCheckbox.value;
          }
          checkbox.property('Checkbox').setValue(newValue);
          sourceExpression = 'comp("' + mainComp.name + '").layer("' + targetLayer.name + '").effect("' + checkboxName + '")("Checkbox")*60';
          childGuideCheckbox.expression = sourceExpression;
        }
      }
      i--;
    }
  };

  nf.bubbleUpHighlights = function(pagesToBubble, choices) {
    var effects, firstShapeIndex, highlightLayersInPageComp, highlighterProperties, highlighterProperty, i, j, k, l, layersInPageComp, mainComp, newName, shouldBubble, sourceExpression, sourceHighlighterEffect, sourceHighlighterPropertyValue, targetComp, targetHighlighterEffect, targetLayer, testExpression, testLayer;
    if (choices == null) {
      choices = null;
    }
    mainComp = app.project.activeItem;
    i = pagesToBubble.length - 1;
    while (i >= 0) {
      targetLayer = pagesToBubble[i];
      targetComp = targetLayer.source;
      layersInPageComp = targetComp.layers;
      highlightLayersInPageComp = [];
      k = layersInPageComp.length;
      while (k >= 1) {
        testLayer = layersInPageComp[k];
        if (testLayer.property('Effects').property('AV Highlighter')) {
          firstShapeIndex = testLayer.property("Contents").numProperties;
          testExpression = testLayer.property("Contents").property(firstShapeIndex).property("Contents").property("Trim Paths 1").property("End").expression;
          if (testExpression.indexOf('end_offset') < 0) {
            nf.upgradeHighlightLayer(testLayer);
          }
          highlightLayersInPageComp.push(testLayer);
        }
        k--;
      }
      effects = targetLayer.Effects;
      j = highlightLayersInPageComp.length - 1;
      while (j >= 0) {
        sourceHighlighterEffect = highlightLayersInPageComp[j].property('Effects').property('AV Highlighter');
        shouldBubble = false;
        if (choices != null) {
          shouldBubble = choices.indexOf(highlightLayersInPageComp[j].name) >= 0;
        } else {
          shouldBubble = !sourceHighlighterEffect.property('Completion').expressionEnabled;
        }
        if (shouldBubble) {
          targetHighlighterEffect = effects.addProperty('AV_Highlighter');
          newName = highlightLayersInPageComp[j].name + ' Highlighter';
          targetHighlighterEffect.name = newName;
          highlighterProperties = ['Spacing', 'Thickness', 'Start Offset', 'Completion', 'Offset', 'Opacity', 'Highlight Colour', 'End Offset'];
          l = highlighterProperties.length - 1;
          while (l >= 0) {
            highlighterProperty = highlighterProperties[l];
            sourceHighlighterPropertyValue = sourceHighlighterEffect.property(highlighterProperty).value;
            targetHighlighterEffect.property(highlighterProperty).setValue(sourceHighlighterPropertyValue);
            sourceExpression = '';
            sourceExpression += 'var offsetTime = comp("' + mainComp.name + '").layer("' + targetLayer.name + '").startTime;';
            sourceExpression += 'comp("' + mainComp.name + '").layer("' + targetLayer.name + '").effect("' + newName + '")("' + highlighterProperty + '")';
            sourceExpression += '.valueAtTime(time+offsetTime)';
            sourceHighlighterEffect.property(highlighterProperty).expression = sourceExpression;
            l--;
          }
        }
        j--;
      }
      i--;
    }
  };

  app.nf = nf;

}).call(this);
