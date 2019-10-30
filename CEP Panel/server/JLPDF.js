var AnnotationBorderStyleType, AnnotationBorderStyleTypeName, AnnotationType, AnnotationTypeName, RecognizedAnnotationTypes, Rect, convertCartesian, convertColorJSON, getRectFromTextItem, processRawAnnotationData;

Rect = require("./Rect.js");

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
  12: "Strikethrough",
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

RecognizedAnnotationTypes = [AnnotationType.STRIKEOUT, AnnotationType.HIGHLIGHT, AnnotationType.UNDERLINE, AnnotationType.CIRCLE, AnnotationType.SQUARE, AnnotationType.POLYGON];

convertColorJSON = function(arr) {
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


/**
Processes the raw annotation Data into something usable by AE. Does NOT import that data
@memberof NFPDFManager
@param {Object} rawAnnotationData - the raw annotation data
@returns {Object} the processed annotation data
 */

processRawAnnotationData = function(rawAnnotationData) {
  var alreadyAddedAnnotation, alreadyAddedAnnotationRect, annotationData, annotationRect, annotationsOverlap, averageLineHeight, cleanName, closestDistance, distance, distanceCheckAnnotation, distanceCheckAnnotationRect, expString, expandColor, exportData, i, j, k, l, len, len1, len2, len3, len4, len5, lineCount, lineHeightSum, m, matchedLine, matchingLines, n, o, overlapExists, p, testAnnotation, testAnnotationRect, textContent, textItem, textRect, trimmedAnnotationData, typeList, viewport;
  annotationData = rawAnnotationData["annotations"];
  viewport = rawAnnotationData["viewport"];
  textContent = rawAnnotationData["textContent"];
  trimmedAnnotationData = [];
  for (i = k = 0, len = annotationData.length; k < len; i = ++k) {
    testAnnotation = annotationData[i];
    if (RecognizedAnnotationTypes.indexOf(testAnnotation.annotationType) > -1) {
      testAnnotationRect = convertCartesian(testAnnotation.rect, viewport);
      annotationsOverlap = false;
      if (trimmedAnnotationData.length !== 0) {
        for (j = l = 0, len1 = trimmedAnnotationData.length; l < len1; j = ++l) {
          alreadyAddedAnnotation = trimmedAnnotationData[j];
          alreadyAddedAnnotationRect = convertCartesian(alreadyAddedAnnotation.rect, viewport);
          if (testAnnotationRect.contains(alreadyAddedAnnotationRect)) {
            annotationsOverlap = true;
            if (alreadyAddedAnnotation.types.indexOf(AnnotationTypeName[testAnnotation.annotationType]) < 0) {
              trimmedAnnotationData[j].types.push(AnnotationTypeName[testAnnotation.annotationType]);
            }
          }
        }
      }
      if (!annotationsOverlap) {
        testAnnotation.types = [AnnotationTypeName[testAnnotation.annotationType]];
        trimmedAnnotationData.push(testAnnotation);
      }
    }
  }
  exportData = [];
  for (i = m = 0, len2 = trimmedAnnotationData.length; m < len2; i = ++m) {
    testAnnotation = trimmedAnnotationData[i];
    annotationRect = convertCartesian(testAnnotation.rect, viewport);
    expandColor = null;
    if (textContent.length === 0 || testAnnotation.annotationType === AnnotationType.SQUARE) {
      lineCount = 0;
    } else {
      matchingLines = [];
      lineHeightSum = 0;
      for (n = 0, len3 = textContent.length; n < len3; n++) {
        textItem = textContent[n];
        textRect = new Rect(textItem);
        if (annotationRect.contains(textRect) || textRect.contains(annotationRect)) {
          overlapExists = false;
          if (matchingLines.length !== 0) {
            for (o = 0, len4 = matchingLines.length; o < len4; o++) {
              matchedLine = matchingLines[o];
              if (matchedLine.yOverlapWith(textRect) !== 0) {
                overlapExists = true;
              }
            }
          }
          if (!overlapExists) {
            matchingLines.push(textRect);
            lineHeightSum += textRect.height;
          }
        }
      }
      lineCount = matchingLines.length;
      if (testAnnotation.colorName.indexOf("Highlight Pink") >= 0) {
        if (lineCount !== 0) {
          averageLineHeight = lineHeightSum / lineCount;
          closestDistance = 99999;
          for (j = p = 0, len5 = trimmedAnnotationData.length; p < len5; j = ++p) {
            distanceCheckAnnotation = trimmedAnnotationData[j];
            if (i !== j) {
              distanceCheckAnnotationRect = convertCartesian(distanceCheckAnnotation.rect, viewport);
              distance = annotationRect.distanceTo(distanceCheckAnnotationRect);
              if (distance <= averageLineHeight) {
                if (distance < closestDistance) {
                  expandColor = distanceCheckAnnotation.colorName.replace("Highlight ", "");
                  closestDistance = distance;
                }
              }
            }
          }
        }
      }
    }
    typeList = testAnnotation.types.join(" ");
    if (typeList.indexOf("Highlight ") > -1) {
      typeList = typeList.replace("Highlight ", "");
      typeList = typeList + " Highlight";
    }
    if (expandColor != null) {
      expString = expandColor + " Expand";
      cleanName = (testAnnotation.colorName.replace("Highlight Pink", expString)) + " " + typeList;
    } else {
      cleanName = (testAnnotation.colorName.replace("Highlight ", "")) + " " + typeList;
    }
    exportData.push({
      rect: annotationRect,
      lineCount: lineCount,
      color: convertColorJSON(testAnnotation.color),
      colorName: testAnnotation.colorName,
      type: typeList,
      cleanName: cleanName,
      expand: expandColor,
      matchingLines: matchingLines
    });
  }
  return exportData;
};

module.exports = {
  RecognizedAnnotationTypes: RecognizedAnnotationTypes,
  processRawAnnotationData: processRawAnnotationData
};
