###*
NFPDFManager Namespace
@namespace NFPDFManager
###
NFPDFManagerImportedData = {} unless NFPDFManagerImportedData?
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
    12: "Strikethrough"
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
  Returns the raw annotation Data for a given page comp. Does NOT import that data
  @memberof NFPDFManager
  @param {NFPageComp} targetComp - the target comp
  @returns {Object} the annotation data
  ###
  getAnnotationDataForPageComp: (targetComp) ->
    pdfLayer = targetComp?.getPDFLayer()
    dataFile = pdfLayer.$.source?.file
    pdfDataKey = dataFile.name

    importedData = NFPDFManagerImportedData[app.project.file.name]
    return null unless importedData?
    parsedData = importedData[pdfDataKey]
    return parsedData

  ###*
  Processes the raw annotation Data into something usable by AE. Does NOT import that data
  @memberof NFPDFManager
  @param {Object} rawAnnotationData - the raw annotation data
  @returns {Object} the processed annotation data
  ###
  processRawAnnotationData: (rawAnnotationData) ->
    recognizedAnnotationTypes = [
      NFPDFManager.AnnotationType.STRIKEOUT
      NFPDFManager.AnnotationType.HIGHLIGHT
      NFPDFManager.AnnotationType.UNDERLINE
      NFPDFManager.AnnotationType.CIRCLE
      NFPDFManager.AnnotationType.SQUARE
      NFPDFManager.AnnotationType.POLYGON
    ]

    # Takes a array of rgb values between 0 and 256. Spits out as 0-1. Borks with anything but 3-length array
    convertColorJSON = (arr) ->
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

    annotationData = rawAnnotationData["annotations"]
    viewport = rawAnnotationData["viewport"]
    textContent = rawAnnotationData["textContent"]

    # Let's get the scale factor for the PDF Layer.
    scaleFactor = pdfLayer.transform().scale.value

    # Remove all the annotations that take up the same space, or aren't the right type
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
      expandColor = null

      # Count lines
      if textContent.length is 0 or testAnnotation.annotationType is NFPDFManager.AnnotationType.SQUARE
        lineCount = 0
      else
        matchingLines = []
        lineHeightSum = 0
        for textItem in textContent
          textRect = new Rect textItem
          if annotationRect.contains(textRect) or textRect.contains(annotationRect)
            overlapExists = no
            if matchingLines.length isnt 0
              for matchedLine in matchingLines
                overlapExists = yes if matchedLine.yOverlapWith(textRect) isnt 0
            unless overlapExists
              matchingLines.push textRect
              lineHeightSum += textRect.height

        lineCount = matchingLines.length

        # Look for Expands
        # $.writeln "Testannotation.colorname = #{testAnnotation.colorName}"
        if testAnnotation.colorName.indexOf("Highlight Pink") >= 0
          unless lineCount is 0
            averageLineHeight = lineHeightSum / lineCount
            closestDistance = 99999
            for distanceCheckAnnotation, j in trimmedAnnotationData
              if i isnt j
                distanceCheckAnnotationRect = convertCartesian(distanceCheckAnnotation.rect, viewport)
                distance = annotationRect.distanceTo(distanceCheckAnnotationRect)
                if distance <= averageLineHeight
                  if distance < closestDistance
                    expandColor = distanceCheckAnnotation.colorName.replace("Highlight ", "")
                    closestDistance = distance

      # Create a cleaner type list with the word 'Highlight' at the end
      typeList = testAnnotation.types.join(" ")
      if typeList.indexOf("Highlight ") > -1
        typeList = typeList.replace("Highlight ", "")
        typeList = typeList + " Highlight"

      if expandColor?
        expString = "#{expandColor} Expand"
        cleanName = "#{testAnnotation.colorName.replace("Highlight Pink", expString)} #{typeList}"
      else
        cleanName = "#{testAnnotation.colorName.replace("Highlight ", "")} #{typeList}"

      exportData.push
        rect: annotationRect
        lineCount: lineCount
        color: convertColorJSON(testAnnotation.color)
        colorName: testAnnotation.colorName
        type: typeList
        cleanName: cleanName
        expand: expandColor

    return exportData

  ###*
  Imports the annotation Data for a given page comp from a json file in the pdf pages directory
  @memberof NFPDFManager
  @returns {boolean} whether the import succeeded
  ###
  importAnnotationData: ->
    pdfPagesFolder = NFProject.findItem "PDF Pages"
    pdfFile = pdfPagesFolder.items[1].mainSource.file

    pdfData = NFTools.readFile pdfFile.path + "/annotationData.json", true, false
    parsedData = JSON.parse(pdfData)
    if parsedData?
      NFPDFManagerImportedData[app.project.file.name] = parsedData
      return true
    else
      return false
