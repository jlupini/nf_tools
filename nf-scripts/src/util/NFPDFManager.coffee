###*
NFPDFManager Namespace
@namespace NFPDFManager
###
NFPDFManager =

  AnnotationTypeName:
    1: "Text"
    2: "Link"
    3: "Free Text"
    4: "Line"
    5: "Square"
    6: "Circle"
    7: "Polygon"
    8: "Polyline"
    9: "Highlight"
    10: "Underline"
    11: "Squiggly"
    12: "Strikeout"
    13: "Stamp"
    14: "Caret"
    15: "Ink"
    16: "Popup"
    17: "File Attachment"
    18: "Sound"
    19: "Movie"
    20: "Widget"
    21: "Screen"
    22: "Printer Mark"
    23: "Trap Net"
    24: "Watermark"
    25: "3D"
    26: "Redaction"

  AnnotationType:
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

  AnnotationBorderStyleType:
    SOLID: 1
    DASHED: 2
    BEVELED: 3
    INSET: 4
    UNDERLINE: 5

  AnnotationBorderStyleTypeName:
    1: "Solid"
    2: "Dashed"
    3: "Beveled"
    4: "Inset"
    5: "Underline"

  ###*
  Returns the annotation Data for a given page comp
  @memberof NFPDFManager
  @param {NFPageComp} the target comp
  @returns {Object} the annotation data
  ###
  importAnnotationDataForPageComp: (targetComp) ->

    recognizedAnnotationTypes = [
      NFPDFManager.AnnotationType.STRIKEOUT
      NFPDFManager.AnnotationType.HIGHLIGHT
      NFPDFManager.AnnotationType.UNDERLINE
      NFPDFManager.AnnotationType.CIRCLE
      NFPDFManager.AnnotationType.POLYGON
    ]

    # Takes a array of rgb values between 0 and 256. Spits out as 0-1. Borks with anything but 3-length array
    convertColorJSON = (obj) ->
      arr = [obj["0"], obj["1"], obj["2"]]
      return [arr[0]/256, arr[1]/256, arr[2]/256]

    # Accepts PDF coordiates in array of points and spits out a rect object
    convertCartesian = (points) ->
      width = points[2]-points[0]
      height = points[3]-points[1]
      rect =
        left: points[0]
        top: viewport[3]-points[1]-height
        width: width
        height: height
      return new Rect rect

    getRectFromTextItem = (textItem) ->
      rect =
        width: textItem.width
        height: textItem.height
        left: textItem.left
        top: viewport[3] - textItem.bottom

    pdfLayer = targetComp?.getPDFLayer()

    pdfFile = pdfLayer.$.source?.file
    pdfDataFile = pdfFile.fsName.replace(".pdf", ".json")
    pdfData = NFTools.readFile pdfDataFile, true, false
    parsedData = JSON.parse pdfData

    annotationData = parsedData["annotations"]
    viewport = parsedData["viewport"].viewBox
    textContent = parsedData["textContent"]

    # Let's get the scale factor for the PDF Layer.
    scaleFactor = pdfLayer.transform().scale.value

    # Remove all the annotations that take up the same space, or aren't the right type
    # FIXME: Add a flag each time one takes up the same space as another so we can stack color/strikethroughs/etc
    trimmedAnnotationData = []
    for testAnnotation, i in annotationData
      if (recognizedAnnotationTypes.indexOf(testAnnotation.annotationType) > -1)
        testAnnotationRect = convertCartesian(testAnnotation.rect)
        annotationsOverlap = no
        if trimmedAnnotationData.length isnt 0
          for alreadyAddedAnnotation, j in trimmedAnnotationData
            alreadyAddedAnnotationRect = convertCartesian(alreadyAddedAnnotation.rect)
            if testAnnotationRect.contains alreadyAddedAnnotationRect
              annotationsOverlap = yes
              if alreadyAddedAnnotation.types.indexOf(NFPDFManager.AnnotationTypeName[testAnnotation.annotationType]) < 0
                trimmedAnnotationData[j].types.push NFPDFManager.AnnotationTypeName[testAnnotation.annotationType]

        unless annotationsOverlap
          testAnnotation.types = [NFPDFManager.AnnotationTypeName[testAnnotation.annotationType]]
          trimmedAnnotationData.push testAnnotation

    exportData = []
    for testAnnotation, i in trimmedAnnotationData

      annotationRect = convertCartesian(testAnnotation.rect, viewport)

      matchingLines = []
      for textItem in textContent
        textRect = new Rect textItem
        if annotationRect.contains textRect
          overlapExists = no
          if matchingLines.length isnt 0
            for matchedLine in matchingLines
              overlapExists = yes if matchedLine.yOverlapWith(textRect) isnt 0
          matchingLines.push textRect unless overlapExists

      lineCount = matchingLines.length
      lineCount = 1 if lineCount is 0

      typeList = testAnnotation.types.join(" ")
      if typeList.indexOf("Highlight ") > -1
        typeList = typeList.replace("Highlight ", "")
        typeList = typeList + " Highlight"

      exportData.push
        rect: annotationRect
        lineCount: lineCount
        color: convertColorJSON(testAnnotation.color)
        colorName: testAnnotation.colorName
        type: typeList


      # # Actually add the shapes and stuff
      # annotationLayer = targetComp.addShapeLayer()
      # annotationLayer.setName "Imported Shape #{i} - n=#{lineCount}"
      # annotationLayer.addRectangle
      #   fillColor: convertColorJSON(testAnnotation.color)
      #   rect: annotationRect
      # annotationLayer.transform().scale.setValue scaleFactor
      #
      # # Create the highlight effect
      # targetComp.createHighlight
      #   shapeLayer: annotationLayer
      #   lines: lineCount
      #   name: "Auto Highlight #{i}"
      #
      # annotationLayer.remove()
    return exportData
