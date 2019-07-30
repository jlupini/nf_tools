#include "runtimeLibraries.jsx";
var AnnotationBorderStyleType, AnnotationType, activeComp, annotationData, annotationLayer, convertCartesian, convertColorArray, getRectFromTextItem, i, item, j, len, len1, pdfLayer, ref, scaleFactor, testAnnotation, textContent, viewport;

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

convertColorArray = function(arr) {
  return [arr[0] / 256, arr[1] / 256, arr[2] / 256];
};

convertCartesian = function(points, viewport) {
  var height, pageCenterX, pageCenterY, rect, rectX, rectY, width;
  pageCenterX = viewport[2] / 2;
  pageCenterY = viewport[3] / 2;
  width = points[2] - points[0];
  height = points[3] - points[1];
  rectX = points[0] - pageCenterX + width / 2;
  rectY = -(points[1] - pageCenterY + height / 2);
  rect = {
    left: rectX,
    top: rectY,
    width: width,
    height: height
  };
  return rect;
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

app.beginUndoGroup('Create Annotations');

viewport = [0, 0, 584.957, 782.986];

annotationData = [
  {
    color: [124, 200, 104],
    id: '21R',
    rect: [39.15884, 100.3647, 285.8416, 143.5545],
    subtype: 'Highlight',
    annotationType: 9,
    contents: ''
  }
];

textContent = {
  "items": [
    {
      str: 'Higher dietary anthocyanin and flavonol intakes are associated with',
      fontHeight: 15.9403,
      width: 488.74872636,
      height: 15.9403,
      left: 39.9685,
      top: 136.97040000000004
    }, {
      str: 'anti-inflammatory effects in a population of US adults',
      width: 386.46300932,
      height: 15.9403,
      left: 39.9685,
      top: 154.88570000000004
    }, {
      str: 'We used an inflammation score (IS) that integrated 12',
      width: 201.88700406000007,
      height: 8.9663,
      left: 83.11165,
      top: 343.78659999999996
    }, {
      str: '0.01), respectively. Results remained significant after additional ad-',
      tx: [8.9663, 0, 0, -8.9663, 39.9676, 500.09069999999997],
      fontHeight: 8.9663,
      width: 245.04359922000006,
      height: 8.9663,
      left: 39.9676,
      top: 500.09069999999997
    }
  ]
};

activeComp = NFProject.activeComp();

pdfLayer = activeComp != null ? activeComp.getPDFLayer() : void 0;

scaleFactor = pdfLayer.transform().scale.value;

for (i = 0, len = annotationData.length; i < len; i++) {
  testAnnotation = annotationData[i];
  annotationLayer = activeComp.addShapeLayer();
  annotationLayer.addRectangle({
    fill: convertColorArray(testAnnotation.color),
    rect: convertCartesian(testAnnotation.rect, viewport),
    name: "Test Annotation"
  });
  ref = textContent.items;
  for (j = 0, len1 = ref.length; j < len1; j++) {
    item = ref[j];
    annotationLayer.addRectangle({
      name: item.str,
      rect: item
    });
  }
  annotationLayer.transform().scale.setValue(scaleFactor);
}

app.endUndoGroup();
