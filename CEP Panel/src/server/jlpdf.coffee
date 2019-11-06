Rect = require "./Rect.js"

nearestColor = require 'nearest-color'

AnnotationTypeName =
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

AnnotationBorderStyleTypeName =
  1: "Solid"
  2: "Dashed"
  3: "Beveled"
  4: "Inset"
  5: "Underline"

RecognizedAnnotationTypes = [
  AnnotationType.STRIKEOUT
  AnnotationType.HIGHLIGHT
  AnnotationType.UNDERLINE
  AnnotationType.CIRCLE
  AnnotationType.SQUARE
  AnnotationType.POLYGON
]

AnnotationColors =
  "Highlight Yellow": "#facd5a"
  "Highlight Green": "#7dc768"
  "Highlight Pink": "#fb5c89"
  "Highlight Purple": "#c885da"
  "Highlight Blue": "#69b0f1"
  "Yellow": "#ffff00"
  "Red": "#ff0000"
  "Brown": "#aa7942"
  "Blue": "#0088ff"
  "Orange": "#ff8800"
  "Purple": "#942192"
  "Pink": "#ff40ff"
  "Black": "#000000"
  "Grey": "#919191"
  "White": "#ffffff"

nearest = nearestColor.from AnnotationColors

# Takes a array of rgb values between 0 and 256. Spits out as 0-1. Borks with anything but 3-length array
convertColorJSON = (arr) ->
  return [arr[0]/256, arr[1]/256, arr[2]/256]

# Accepts PDF coordiates in array of points, and a viewport, and spits out a rect object
convertCartesian = (points, viewport) ->
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

rgbToHex = (r, g, b) ->
  componentToHex = (c) ->
    hex = c.toString(16)
    if hex.length == 1 then '0' + hex else hex

  if r.length is 3
    b = r[2]
    g = r[1]
    r = r[0]
  '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)

trimColorArray = (arr) ->
  [arr["0"], arr["1"], arr["2"]]

nearestColorName = (color) ->
  nearest(rgbToHex(trimColorArray(color))).name

###*
Processes the raw annotation Data into something usable by AE. Does NOT import that data
@memberof NFPDFManager
@param {Object} rawAnnotationData - the raw annotation data
@returns {Object} the processed annotation data
###
processRawAnnotationData = (rawAnnotationData) ->
  console.log rawAnnotationData
  annotationData = rawAnnotationData["annotations"]
  viewport = rawAnnotationData["viewport"]
  textContent = rawAnnotationData["textContent"]

  # Remove all the annotations that take up the same space, or aren't the right type
  trimmedAnnotationData = []
  for testAnnotation, i in annotationData
    if (RecognizedAnnotationTypes.indexOf(testAnnotation.annotationType) > -1)
      testAnnotationRect = convertCartesian(testAnnotation.rect, viewport)
      annotationsOverlap = no
      if trimmedAnnotationData.length isnt 0
        for alreadyAddedAnnotation, j in trimmedAnnotationData
          alreadyAddedAnnotationRect = convertCartesian(alreadyAddedAnnotation.rect, viewport)
          if testAnnotationRect.contains alreadyAddedAnnotationRect
            annotationsOverlap = yes
            if alreadyAddedAnnotation.types.indexOf(AnnotationTypeName[testAnnotation.annotationType]) < 0
              trimmedAnnotationData[j].types.push AnnotationTypeName[testAnnotation.annotationType]

      unless annotationsOverlap
        testAnnotation.types = [AnnotationTypeName[testAnnotation.annotationType]]
        trimmedAnnotationData.push testAnnotation

  exportData = []
  for testAnnotation, i in trimmedAnnotationData

    annotationRect = convertCartesian(testAnnotation.rect, viewport)
    expandColor = null

    # Count lines
    if textContent.length is 0 or testAnnotation.annotationType is AnnotationType.SQUARE
      lineCount = 0
    else
      matchingLines = []
      matchingLineString = ""
      matchingLineStringArray = []
      lineHeightSum = 0

      printPrev = true
      if i is 0
        console.log "annotation #{annotationRect}"
      for textItem, j in textContent

        textRect = new Rect textItem
        if annotationRect.contains(textRect) or textRect.contains(annotationRect)
          if i is 0
            if printPrev
              printPrev = false
              console.log "NUTTY ONE: #{textContent[j-1].str} (j is #{j-1})"
              console.log new Rect textContent[j-1]
            console.log "str: '#{textItem.str}'"
            console.log textRect
          overlapExists = no
          if matchingLines.length isnt 0
            for matchedLine in matchingLines
              overlapExists = yes if matchedLine.yOverlapWith(textRect) isnt 0
          unless overlapExists
            matchingLines.push textRect
            matchingLineString = matchingLineString + textItem.str
            matchingLineStringArray.push textItem.str
            lineHeightSum += textRect.height


      lineCount = matchingLines.length

      # Look for Expands
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
      matchingLines: matchingLines
      lineArr: matchingLineStringArray
      text: matchingLineString

  return exportData

# Export relevant stuff
module.exports =
  RecognizedAnnotationTypes: RecognizedAnnotationTypes
  AnnotationColors: AnnotationColors
  processRawAnnotationData: processRawAnnotationData
  nearestColorName: nearestColorName
  trimColorArray: trimColorArray
