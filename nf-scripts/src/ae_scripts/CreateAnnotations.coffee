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
  pageCenterX = viewport[2]/2
  pageCenterY = viewport[3]/2
  width = points[2]-points[0]
  height = points[3]-points[1]
  rectX = points[0]-pageCenterX+width/2
  rectY = -(points[1]-pageCenterY+height/2)
  rect =
    left: rectX
    top: rectY
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
        top: 136.97040000000004
      },
      {
        str: 'anti-inflammatory effects in a population of US adults',
        width: 386.46300932,
        height: 15.9403,
        left: 39.9685,
        top: 154.88570000000004
      },
      {
        str: 'We used an inflammation score (IS) that integrated 12',
        width: 201.88700406000007,
        height: 8.9663,
        left: 83.11165,
        top: 343.78659999999996
      },
      {
        str: '0.01), respectively. Results remained significant after additional ad-',
        tx: [ 8.9663, 0, 0, -8.9663, 39.9676, 500.09069999999997 ],
        fontHeight: 8.9663,
        width: 245.04359922000006,
        height: 8.9663,
        left: 39.9676,
        top: 500.09069999999997
      }

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
