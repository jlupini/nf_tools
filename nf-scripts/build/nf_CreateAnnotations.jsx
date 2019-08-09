var AnnotationBorderStyleType, AnnotationBorderStyleTypeName, AnnotationType, AnnotationTypeName, activeComp, convertCartesian, convertColorJSON, getRectFromTextItem, importAnnotationDataForPageComp, recognizedAnnotationTypes;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

AnnotationTypeName = {
  1: "Text",
  2: "Link",
  3: "Free Text",
  4: "Line",
  5: "Square",
  6: "Circle",
  7: "Polygon",
  8: "Polyline",
  9: "Highlight",
  10: "Underline",
  11: "Squiggly",
  12: "Strikeout",
  13: "Stamp",
  14: "Caret",
  15: "Ink",
  16: "Popup",
  17: "File Attachment",
  18: "Sound",
  19: "Movie",
  20: "Widget",
  21: "Screen",
  22: "Printer Mark",
  23: "Trap Net",
  24: "Watermark",
  25: "3D",
  26: "Redaction"
};

AnnotationType = {
  TEXT: 1,
  LINK: 2,
  FREETEXT: 3,
  LINE: 4,
  SQUARE: 5,
  CIRCLE: 6,
  POLYGON: 7,
  POLYLINE: 8,
  HIGHLIGHT: 9,
  UNDERLINE: 10,
  SQUIGGLY: 11,
  STRIKEOUT: 12,
  STAMP: 13,
  CARET: 14,
  INK: 15,
  POPUP: 16,
  FILEATTACHMENT: 17,
  SOUND: 18,
  MOVIE: 19,
  WIDGET: 20,
  SCREEN: 21,
  PRINTERMARK: 22,
  TRAPNET: 23,
  WATERMARK: 24,
  THREED: 25,
  REDACT: 26
};

AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};

AnnotationBorderStyleTypeName = {
  1: "Solid",
  2: "Dashed",
  3: "Beveled",
  4: "Inset",
  5: "Underline"
};

recognizedAnnotationTypes = [annotationType.STRIKEOUT, annotationType.HIGHLIGHT, annotationType.UNDERLINE, annotationType.CIRCLE, annotationType.POLYGON];

convertColorJSON = function(obj) {
  var arr;
  arr = [obj["0"], obj["1"], obj["2"]];
  return [arr[0] / 256, arr[1] / 256, arr[2] / 256];
};

convertCartesian = function(points, viewport) {
  var height, rect, width;
  width = points[2] - points[0];
  height = points[3] - points[1];
  rect = {
    left: points[0],
    top: viewport[3] - points[1] - height,
    width: width,
    height: height
  };
  return new Rect(rect);
};

getRectFromTextItem = function(textItem) {
  var rect;
  return rect = {
    width: textItem.width,
    height: textItem.height,
    left: textItem.left,
    top: viewport[3] - textItem.bottom
  };
};

importAnnotationDataForPageComp = function(targetComp) {
  var alreadyAddedAnnotation, alreadyAddedAnnotationRect, annotationData, annotationRect, annotationsOverlap, exportData, i, j, k, l, len, len1, len2, len3, len4, lineCount, m, matchedLine, matchingLines, n, overlapExists, parsedData, pdfData, pdfDataFile, pdfFile, pdfLayer, ref, scaleFactor, testAnnotation, testAnnotationRect, textContent, textItem, textRect, trimmedAnnotationData, viewport;
  pdfLayer = targetComp != null ? targetComp.getPDFLayer() : void 0;
  pdfFile = (ref = pdfLayer.$.source) != null ? ref.file : void 0;
  pdfDataFile = pdfFile.fsName.replace(".pdf", ".json");
  pdfData = NFTools.readFile(pdfDataFile, true, false);
  parsedData = JSON.parse(pdfData);
  annotationData = parsedData["annotations"];
  viewport = parsedData["viewport"].viewBox;
  textContent = parsedData["textContent"];
  scaleFactor = pdfLayer.transform().scale.value;
  trimmedAnnotationData = [];
  for (j = 0, len = annotationData.length; j < len; j++) {
    testAnnotation = annotationData[j];
    if (recognizedAnnotationTypes.indexOf(testAnnotation.annotationType) > -1) {
      testAnnotationRect = convertCartesian(testAnnotation.rect, viewport);
      annotationsOverlap = false;
      if (trimmedAnnotationData.length !== 0) {
        for (k = 0, len1 = trimmedAnnotationData.length; k < len1; k++) {
          alreadyAddedAnnotation = trimmedAnnotationData[k];
          alreadyAddedAnnotationRect = new Rect(convertCartesian(alreadyAddedAnnotation.rect, viewport));
          if (testAnnotationRect.contains(alreadyAddedAnnotationRect)) {
            annotationsOverlap = true;
          }
        }
      }
      if (!annotationsOverlap) {
        trimmedAnnotationData.push(testAnnotation);
      }
    }
  }
  exportData = [];
  for (i = l = 0, len2 = trimmedAnnotationData.length; l < len2; i = ++l) {
    testAnnotation = trimmedAnnotationData[i];
    annotationRect = convertCartesian(testAnnotation.rect, viewport);
    matchingLines = [];
    for (m = 0, len3 = textContent.length; m < len3; m++) {
      textItem = textContent[m];
      textRect = new Rect(textItem);
      if (annotationRect.contains(textRect)) {
        overlapExists = false;
        if (matchingLines.length !== 0) {
          for (n = 0, len4 = matchingLines.length; n < len4; n++) {
            matchedLine = matchingLines[n];
            if (matchedLine.yOverlapWith(textRect) !== 0) {
              overlapExists = true;
            }
          }
        }
        if (!overlapExists) {
          matchingLines.push(textRect);
        }
      }
    }
    lineCount = matchingLines.length;
    if (lineCount === 0) {
      lineCount = 1;
    }
    exportData.push({
      rect: annotationRect,
      lineCount: lineCount,
      color: convertColorJSON(testAnnotation.color),
      colorName: testAnnotation.colorName,
      type: AnnotationTypeName[testAnnotation.annotationType]
    });
  }
  return exportData;
};

app.beginUndoGroup('Create Annotations');

activeComp = NFProject.activeComp();

importAnnotationDataForPageComp(activeComp);

app.endUndoGroup();
