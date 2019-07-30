`#include "runtimeLibraries.jsx"`

AnnotationType =
  TEXT: 1
  LINK: 2
  FREETEXT: 3
  LINE: 4
  SQUARE: 5
  CIRCLE: 6
  POLYGON: 7
  POLYLINE: 8
  HIGHLIGHT: 9
  UNDERLINE: 10
  SQUIGGLY: 11
  STRIKEOUT: 12
  STAMP: 13
  CARET: 14
  INK: 15
  POPUP: 16
  FILEATTACHMENT: 17
  SOUND: 18
  MOVIE: 19
  WIDGET: 20
  SCREEN: 21
  PRINTERMARK: 22
  TRAPNET: 23
  WATERMARK: 24
  THREED: 25
  REDACT: 26

AnnotationBorderStyleType =
  SOLID: 1
  DASHED: 2
  BEVELED: 3
  INSET: 4
  UNDERLINE: 5


# Takes a array of rgb values between 0 and 256. Spits out as 0-1. Borks with anything but 3-length array
convertColorArray = (arr) ->
  return [arr[0]/256, arr[1]/256, arr[2]/256]

# Accepts PDF coordiates in array of points and spits out a rect object
convertCartesian = (points, viewport) ->
  width = points[2]-points[0]
  height = points[3]-points[1]
  rect =
    left: points[0]
    top: viewport[3]-points[1]-height
    width: width
    height: height
  return rect

getRectFromTextItem = (textItem) ->
  rect =
    width: textItem.width
    height: textItem.height
    left: textItem.left
    top: viewport[3] - textItem.bottom


app.beginUndoGroup 'Create Annotations'

viewport = [0,0,584.957,782.986]
annotationData = [
  {
    color: [124, 200, 104]
    id: '21R'
    rect: [39.15884, 100.3647, 285.8416, 143.5545]
    subtype: 'Highlight'
    annotationType: 9
    contents: ''
  }
]
textContent = {
   "items":[
      {
        str: 'Higher dietary anthocyanin and flavonol intakes are associated with',
        fontHeight: 15.9403,
        width: 488.74872636,
        height: 15.9403,
        left: 39.9685,
        top: 121.03010000000003
      },
      {
        str: 'anti-inflammatory effects in a population of US adults',
        tx: [ 15.9403, 0, 0, -15.9403, 39.9685, 154.88570000000004 ],
        fontHeight: 15.9403,
        width: 386.46300932,
        height: 15.9403,
        left: 39.9685,
        top: 138.94540000000003 },
      {
        str: '1',
        tx: [ 11.9551, 0, 0, -10.6257, 426.444, 147.79869999999994 ],
        fontHeight: 10.6257,
        width: 6.599215200000001,
        height: 11.9551,
        left: 426.444,
        top: 137.17299999999994 },
      {
        str: 'Aedin Cassidy,',
        tx: [ 9.9626, 0, 0, -9.9626, 39.9685, 178.8098 ],
        fontHeight: 9.9626,
        width: 60.25978236,
        height: 9.9626,
        left: 39.9685,
        top: 168.8472 },
      {
        str: '2',
        tx: [ 7.4718, 0, 0, -6.641, 100.233, 174.3877 ],
        fontHeight: 6.641,
        width: 3.7359,
        height: 7.4718,
        left: 100.233,
        top: 167.7467 },
      {
        str: 'Gail Rogers,',
        tx: [ 9.9626, 0, 0, -9.9626, 107.263, 178.8098 ],
        fontHeight: 9.9626,
        width: 51.79754992,
        height: 9.9626,
        left: 107.263,
        top: 168.8472 },
      {
        str: '3',
        tx: [ 7.4718, 0, 0, -6.641, 159.0803, 174.3877 ],
        fontHeight: 6.641,
        width: 3.7359,
        height: 7.4718,
        left: 159.0803,
        top: 167.7467 }

  ]
}
#return [x * scale, this.canvas.height - ((y + height) * scale), width * scale, height * scale];



activeComp = NFProject.activeComp()
pdfLayer = activeComp?.getPDFLayer()

# Let's get the scale factor for the PDF Layer.
scaleFactor = pdfLayer.transform().scale.value

# Let's just try drawing a shape layer LOL
for testAnnotation in annotationData
  # refLayer = activeComp.addRectangleShapeLayer
  #   fill: [.5,1,1]
  #   rect: [0,0,595.276,779.528]
  #   name: "Viewport Ref"
  annotationLayer = activeComp.addShapeLayer()

  annotationLayer.addRectangle
    fill: convertColorArray(testAnnotation.color)
    rect: convertCartesian(testAnnotation.rect, viewport)
    name: "Test Annotation"

  for item in textContent.items
    annotationLayer.addRectangle
      name: item.str
      rect: item

  annotationLayer.transform().scale.setValue scaleFactor




app.endUndoGroup()
