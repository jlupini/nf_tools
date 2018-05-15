(function() {
  #include "nf_runtimeLibraries.jsx";
  var NF, _, createHighlighter, createShapeLayer, createSplitterEffect, fixExpressionProblems, getChoice, getColorExpression, getLineArray, indexOfClosestLineToPoint, initColorPresets, main, percentThroughLineAtPoint, splitHighlightAtPoint, splitHighlightLayer;

  NF = app.NF;

  _ = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Create Highlight Layer'
  };

  main = function() {
    var highlightLayer, mainComp;
    mainComp = app.project.activeItem;
    highlightLayer = mainComp.selectedLayers[0];
    if (_.mainComp.selectedLayers.length > 1) {
      return alert("Error!\nMore than one layer selected");
    }
    if (!(highlightLayer instanceof ShapeLayer)) {
      return createShapeLayer(highlightLayer);
    } else if (highlightLayer.property("Effects").property("AV Highlighter") != null) {
      if (fixExpressionProblems(highlightLayer)) {
        return;
      }
      if (highlightLayer.property("Effects").property("AV Highlighter").property("Spacing").expressionEnabled) {
        return getChoice();
      } else {
        return splitHighlightLayer();
      }
    } else {
      return createHighlighter();
    }
  };

  getChoice = function() {
    var cancelButton, disconnectButton, splitButton, w;
    w = new Window('dialog');
    w.alignChildren = 'left';
    w.add('statictext', [0, 0, 300, 50], 'This highlight is connected to a parent composition.\rCreating a split will disconnect the highlight,\rso you will have to bubble it up again after.', {
      multiline: true
    });
    splitButton = w.add('button', void 0, 'Split and Disconnect', {
      name: 'split'
    });
    disconnectButton = w.add('button', void 0, 'Disconnect Only', {
      name: 'disconnect'
    });
    cancelButton = w.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    splitButton.onClick = function() {
      NF.Util.disconnectBubbleupsInLayers(_.mainComp.selectedLayers[0]);
      splitHighlightLayer();
      w.close();
    };
    disconnectButton.onClick = function() {
      NF.Util.disconnectBubbleupsInLayers(_.mainComp.selectedLayers[0]);
      w.close();
    };
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  fixExpressionProblems = function(highlightLayer) {
    var firstShapeColorExpression, i, numShapes;
    firstShapeColorExpression = highlightLayer.property("Contents").property(1).property("Contents").property("Stroke 1").property("Color").expression;
    if (firstShapeColorExpression == null) {
      return false;
    }
    if (firstShapeColorExpression.indexOf("popup_val == 21") >= 0) {
      numShapes = highlightLayer.property("Contents").numProperties;
      i = 1;
      while (i <= numShapes) {
        highlightLayer.property("Contents").property(i).property('Contents').property('Stroke 1').property('Color').expression = getColorExpression();
        i++;
      }
      alert("Just so you're in the loop...\nI fixed a broken expression on this highlight. Run the script again to do whatever you were trying to do just now...");
      return true;
    }
    return false;
  };

  initColorPresets = function() {
    var highlightColorBLUE, highlightColorGREEN, highlightColorORANGE, highlightColorPINK, highlightColorPURPLE, highlightColorRED, highlightColorYELLOW;
    highlightColorYELLOW = [255, 221, 3, 255];
    highlightColorBLUE = [152, 218, 255, 255];
    highlightColorPURPLE = [236, 152, 255, 255];
    highlightColorGREEN = [157, 255, 160, 255];
    highlightColorPINK = [255, 152, 202, 255];
    highlightColorORANGE = [255, 175, 104, 255];
    highlightColorRED = [255, 157, 157, 255];
    return _.highlightColorOptions = [highlightColorYELLOW, highlightColorBLUE, highlightColorPURPLE, highlightColorGREEN, highlightColorPINK, highlightColorORANGE, highlightColorRED];
  };

  getColorExpression = function() {
    var i, trimString;
    initColorPresets();
    trimString = '';
    trimString += 'popup_val = effect("AV Highlighter")("Highlight Colour");';
    i = 0;
    while (i < _.highlightColorOptions.length) {
      if (i !== 0) {
        trimString += 'else ';
      }
      if (i !== _.highlightColorOptions.length - 1) {
        trimString += 'if (popup_val == ' + (i + 1) + ') ';
      }
      trimString += '{ [' + _.highlightColorOptions[i].toString() + ']/255; } ';
      i++;
    }
    trimString += ';';
    return trimString;
  };

  createHighlighter = function() {
    var effects, highlightLayer, highlightLinesCount, i, mainComp, newShape, offsetString, shape1, trim1;
    mainComp = app.project.activeItem;
    highlightLayer = mainComp.selectedLayers[0];
    highlightLinesCount = parseInt(prompt('How many initial highlight lines would you like to create?'));
    highlightLayer.name = 'Highlighter';
    highlightLayer.blendingMode = BlendingMode.MULTIPLY;
    shape1 = highlightLayer.property('Contents').property('Shape 1');
    shape1.property('Contents').property('Fill 1').remove();
    trim1 = shape1.property('Contents').addProperty('ADBE Vector Filter - Trim');
    effects = highlightLayer.Effects;
    effects.addProperty('AV_Highlighter');
    shape1.property('Contents').property('Stroke 1').property('Stroke Width').expression = 'effect("AV Highlighter")("Thickness")';
    shape1.property('Contents').property('Trim Paths 1').property('Start').expression = 'effect("AV Highlighter")("Start Offset")';
    highlightLayer.property('Transform').property('Opacity').expression = 'effect("AV Highlighter")("Opacity")';
    shape1.property('Contents').property('Stroke 1').property('Color').expression = getColorExpression();
    offsetString = '';
    offsetString += '[transform.position[0]+ effect("AV Highlighter")("Offset")[0],';
    offsetString += ' transform.position[1]+ effect("AV Highlighter")("Offset")[1]]';
    highlightLayer.property('Transform').property('Position').expression = offsetString;
    shape1.property('Contents').property('Trim Paths 1').property('End').expression = NF.Util.trimExpression(1, highlightLinesCount);
    i = 2;
    while (i <= highlightLinesCount) {
      newShape = highlightLayer.property('Contents').property(1).duplicate();
      newShape.property('Transform').property('Position').expression = '[content("Shape 1").transform.position[0], effect("AV Highlighter")("Spacing")*' + (i - 1) + ']';
      newShape.property('Contents').property('Trim Paths 1').property('Start').expression = '';
      newShape.property('Contents').property('Trim Paths 1').property('End').expression = NF.Util.trimExpression(i, highlightLinesCount);
      i++;
    }
  };

  createShapeLayer = function(targetLayer) {
    var newShape;
    newShape = app.project.activeItem.layers.addShape();
    newShape.moveBefore(targetLayer);
    newShape.name = 'Highlighter';
    newShape.parent = targetLayer;
    newShape.startTime = targetLayer.inPoint;
  };

  splitHighlightLayer = function() {
    var j, layer, len, newLayers, results, splitterEffect, splitterPoint;
    _.selectedLayer = _.mainComp.selectedLayers[0];
    splitterEffect = _.selectedLayer.property("Effects").property("Splitter");
    if (splitterEffect == null) {
      return createSplitterEffect();
    }
    splitterPoint = splitterEffect.property("Point").value;
    newLayers = splitHighlightAtPoint(splitterPoint);
    results = [];
    for (j = 0, len = newLayers.length; j < len; j++) {
      layer = newLayers[j];
      layer.property("Effects").property("Splitter").remove();
      results.push(layer.selected = true);
    }
    return results;
  };

  splitHighlightAtPoint = function(splitterPoint) {
    var closestIndex, closestLine, firstShape, firstShapeName, firstShapePosition, highlighterEffect, highlighterSpacing, highlighterThickness, i, lineArray, lineCount, newHighlightLayer, newHighlightParentPosition, newHighlighterEffect, newLayers, originalHighlightLayer, originalHighlighterEffect, percentage;
    lineArray = getLineArray();
    closestIndex = indexOfClosestLineToPoint(splitterPoint, lineArray);
    closestLine = lineArray[closestIndex];
    percentage = percentThroughLineAtPoint(closestLine, splitterPoint);
    highlighterEffect = _.selectedLayer.property("Effects").property("AV Highlighter");
    highlighterThickness = highlighterEffect.property("Thickness");
    highlighterSpacing = highlighterEffect.property("Spacing");
    if (highlighterThickness.value > highlighterSpacing.value + 1) {
      highlighterThickness.setValue(highlighterSpacing.value + 1);
    }
    originalHighlightLayer = _.selectedLayer;
    newHighlightLayer = originalHighlightLayer.duplicate();
    newHighlightLayer.moveAfter(originalHighlightLayer);
    newHighlightParentPosition = closestLine.shape.property("Transform").property("Position").value;
    lineCount = originalHighlightLayer.property("Contents").numProperties;
    i = lineCount - 1;
    while (i >= 0) {
      if (i < closestIndex) {
        originalHighlightLayer.property("Contents").property(i + 1).remove();
      }
      if (i > closestIndex) {
        newHighlightLayer.property("Contents").property(i + 1).remove();
      }
      i--;
    }
    lineCount = newHighlightLayer.property("Contents").numProperties;
    i = lineCount;
    while (i >= 1) {
      if (i === lineCount) {
        firstShape = newHighlightLayer.property("Contents").property(i);
        firstShapeName = firstShape.name;
        firstShapePosition = firstShape.property("Transform").property("Position");
        firstShapePosition.expression = "";
        firstShapePosition.setValue(newHighlightParentPosition);
        firstShape.property("Contents").property("Trim Paths 1").property("Start").expression = "effect(\"AV Highlighter\")(\"Start Offset\")";
      } else {
        newHighlightLayer.property("Contents").property(i).property("Transform").property("Position").expression = "[content(\"" + firstShapeName + "\").transform.position[0], content(\"" + firstShapeName + "\").transform.position[1] + effect(\"AV Highlighter\")(\"Spacing\")*" + (lineCount - i) + "]";
      }
      i--;
    }
    originalHighlighterEffect = originalHighlightLayer.property("Effects").property("AV Highlighter");
    newHighlighterEffect = newHighlightLayer.property("Effects").property("AV Highlighter");
    newHighlighterEffect.property("Start Offset").setValue(percentage * 100);
    originalHighlighterEffect.property("End Offset").setValue((1 - percentage) * 100);
    NF.Util.fixTrimExpressionsForHighlightLayer(newHighlightLayer);
    NF.Util.fixTrimExpressionsForHighlightLayer(originalHighlightLayer);
    newLayers = [originalHighlightLayer, newHighlightLayer];
    return newLayers;
  };

  percentThroughLineAtPoint = function(line, point) {
    var percent, pointX;
    pointX = point[0];
    percent = (pointX - line.relativeX) / line.length;
    return percent;
  };

  getLineArray = function() {
    var i, lineAdjustedStartPoint, lineArray, lineCount, lineEndPoint, lineLength, lineName, lineObj, linePath, lineRawY, lineRelativeAdjustedStartPoint, lineRelativeY, lineShape, lineStartPoint, lineStartRelativeX, lineVerticies, yOffsetValue;
    lineCount = _.selectedLayer.property("Contents").numProperties;
    lineArray = [];
    i = 1;
    while (i <= lineCount) {
      lineShape = _.selectedLayer.property("Contents").property(i);
      lineName = lineShape.name;
      linePath = lineShape.property("Contents").property("Path 1").property("Path").value;
      lineVerticies = linePath.vertices;
      lineStartPoint = lineVerticies[0];
      lineEndPoint = lineVerticies[1];
      yOffsetValue = lineShape.property("Transform").property("Position").value[1];
      lineAdjustedStartPoint = [lineStartPoint[0], lineStartPoint[1] + yOffsetValue];
      lineRelativeAdjustedStartPoint = NF.Util.pointRelativeToComp(lineAdjustedStartPoint, _.selectedLayer);
      lineRawY = lineAdjustedStartPoint[1];
      lineRelativeY = lineRelativeAdjustedStartPoint[1];
      lineStartRelativeX = lineRelativeAdjustedStartPoint[0];
      lineLength = lineEndPoint[0] - lineStartPoint[0];
      lineObj = {
        name: lineName,
        shape: lineShape,
        path: linePath,
        verticies: lineVerticies,
        rawY: lineRawY,
        relativeY: lineRelativeY,
        relativeX: lineStartRelativeX,
        length: lineLength,
        yOffsetValue: yOffsetValue
      };
      lineArray.push(lineObj);
      i++;
    }
    return lineArray;
  };

  createSplitterEffect = function() {
    var splitterEffect;
    splitterEffect = _.selectedLayer.property("Effects").addProperty("ADBE Point Control");
    splitterEffect.name = "Splitter";
    return 1;
  };

  indexOfClosestLineToPoint = function(point, lineArray) {
    var curr, diff, i, newDiff, testY;
    testY = point[1];
    curr = 0;
    diff = Math.abs(testY - lineArray[0].relativeY);
    i = 0;
    while (i < lineArray.length) {
      newDiff = Math.abs(testY - lineArray[i].relativeY);
      if (newDiff < diff) {
        diff = newDiff;
        curr = i;
      }
      i++;
    }
    return curr;
  };

  app.beginUndoGroup(_.undoGroupName);

  main();

  app.endUndoGroup();

}).call(this);
