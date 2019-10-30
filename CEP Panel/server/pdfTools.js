var convertCartesian, convertColorJSON, getRectFromTextItem;

module.exports = {
  AnnotationTypeName: {
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
  },
  AnnotationType: {
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
  },
  AnnotationBorderStyleType: {
    SOLID: 1,
    DASHED: 2,
    BEVELED: 3,
    INSET: 4,
    UNDERLINE: 5
  },
  AnnotationBorderStyleTypeName: {
    1: "Solid",
    2: "Dashed",
    3: "Beveled",
    4: "Inset",
    5: "Underline"
  },
  recognizedAnnotationTypes: [NFPDFManager.AnnotationType.STRIKEOUT, NFPDFManager.AnnotationType.HIGHLIGHT, NFPDFManager.AnnotationType.UNDERLINE, NFPDFManager.AnnotationType.CIRCLE, NFPDFManager.AnnotationType.SQUARE, NFPDFManager.AnnotationType.POLYGON]
};

convertColorJSON = function(arr) {
  return [arr[0] / 256, arr[1] / 256, arr[2] / 256];
};

convertCartesian = function(points) {
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
