
# Basic node example that prints document metadata and text content.
# Requires single file built version of PDF.js -- please run
# `gulp singlefile` before running the example.
#
# Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
pdfjsLib = require('pdfjs-dist')
# Loading file from file system into typed array
fs = require('fs')

nearestColor = require 'nearest-color'
namedColors = require 'color-name-list'
# colors = {}
# for color in namedColors
#   colors[color.name] = color.hex
colors =
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
# console.log colors
nearest = nearestColor.from(colors)
componentToHex = (c) ->
  hex = c.toString(16)
  if hex.length == 1 then '0' + hex else hex
rgbToHex = (r, g, b) ->
  '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
round = (value, precision = 4) ->
  multiplier = 10 ** (precision or 0)
  Math.round(value * multiplier) / multiplier
merge = (r1, r2) ->
  width = if r1.width > r2.width then r1.width else r2.width + r2.left - (r1.left)
  height = if r1.height > r2.height then r1.height else r2.height + r2.top - (r1.top)
  {
    left: Math.min(r1.left, r2.left)
    top: Math.min(r1.top, r2.top)
    width: width
    height: height
  }

pdfPath = process.argv[2] or '1000_pg01.pdf'
testFolder = "/Users/jlupini/Avocado Video Dropbox/NF Active Prep/Volume 48/48-05 SUGAR Does Sugar Lead to Weight Gain?/48-05 Assets/PDF Pages"
fileArr = fs.readdirSync(testFolder)
strippedFileArr = []
for file in fileArr
  if file.indexOf(".pdf") > -1
    strippedFileArr.push file unless file.indexOf("_annot") > -1
console.log strippedFileArr

finalDataObject = {}
addToFinalData = (key, obj) ->
  finalDataObject[key] = obj

# Will be using promises to load document, pages and misc data instead of
# callback.
finishedCount = 0
# for file in strippedFileArr
processFiles = (files, idx) ->
  viewport = 1
  annotations = 1
  textContent = 1
  console.log "Opening: #{files[idx]}"
  loadingTask = pdfjsLib.getDocument("#{testFolder}/#{files[idx]}")
  loadingTask.promise.then((doc) ->
    numPages = doc.numPages
    lastPromise = doc.getMetadata().then (data) ->
      return null

    loadPage = (pageNum) ->
      doc.getPage(pageNum).then (page) ->
        viewport = page.getViewport(1.0)

        # Get the annotations
        page.getAnnotations().then (content) ->
          annotations = []
          for annotation, i in content
            unless annotation.subtype is "Link"
              annotations.push
                borderStyle: annotation.borderStyle.style
                color: [annotation.color["0"], annotation.color["1"], annotation.color["2"]]
                rect: annotation.rect
                subtype: annotation.subtype
                annotationType: annotation.annotationType
                colorName: nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name

        # Get the text content
        page.getTextContent().then (content) ->

          textItems = []
          prevItem = {}
          mergeCount = 0
          content.items.forEach (item) ->
            tx = pdfjsLib.Util.transform(viewport.transform, item.transform)
            fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))

            newItem =
              str: item.str
              # tx: tx
              fontHeight: fontHeight
              width: round(item.width)
              height: round(item.height/fontHeight)
              left: round(tx[4])
              top: round(tx[5] - fontHeight)
            # textItems.push newItem

            # Combine together items on the same lines to reduce JSON file size
            prevItem = textItems[textItems.length - 1] if textItems.length isnt 0
            # console.log "Ding:  #{Math.abs(prevItem.top - newItem.top) < prevItem.height}"
            if prevItem? and ( Math.abs(prevItem.top - newItem.top) < prevItem.height )
              mergedRect = merge prevItem, newItem
              # console.log "merged"
              mergeCount++
              combinedItem =
                str: "#{prevItem.str} // #{newItem.str}"
                width: round(mergedRect.width)
                height: round(mergedRect.height)
                left: round(mergedRect.left)
                top: round(mergedRect.top)
              textItems[textItems.length - 1] = combinedItem
            else
              textItems.push newItem
            return
          console.log "Merged #{mergeCount} objects"

          textContent = textItems

    # Loading of the first page will wait on metadata and subsequent loadings
    # will wait on the previous pages.
    i = 1
    while i <= numPages
      lastPromise = lastPromise.then(loadPage.bind(null, i))
      i++
    lastPromise
  ).then (->
    console.log '# End of Document ' + files[idx]

    dataObject =
      annotations: annotations
      viewport: viewport.viewBox
      textContent: textContent

    addToFinalData files[idx], dataObject
    if idx + 1 is files.length
      # Write to a file
      fs.writeFile "#{testFolder}/annotationData.json", JSON.stringify(finalDataObject, null, " "), (err) ->
        if err
          return console.log(err)
        console.log 'The file was saved!'
        return
    else
      processFiles(files, idx + 1)

    return
  ), (err) ->
    console.error 'Error: ' + err
    if idx + 1 is files.length
      # Write to a file
      fs.writeFile "#{testFolder}/annotationData.json", JSON.stringify(finalDataObject, null, " "), (err) ->
        if err
          return console.log(err)
        console.log 'The file was saved!'
        return
    else
      processFiles(files, idx + 1)
    return
processFiles strippedFileArr, 0
