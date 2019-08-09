
# Basic node example that prints document metadata and text content.
# Requires single file built version of PDF.js -- please run
# `gulp singlefile` before running the example.
#
# Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
pdfjsLib = require('pdfjs-dist')
# Loading file from file system into typed array


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

pdfPath = process.argv[2] or '1000_pg01.pdf'
# Will be using promises to load document, pages and misc data instead of
# callback.

viewport = 1
annotations = 1
textContent = 1

loadingTask = pdfjsLib.getDocument(pdfPath)
loadingTask.promise.then((doc) ->
  numPages = doc.numPages

  lastPromise = undefined
  lastPromise = doc.getMetadata().then((data) ->
    return null
  )

  loadPage = (pageNum) ->
    doc.getPage(pageNum).then (page) ->
      viewport = page.getViewport(1.0)

      # Get the annotations
      page.getAnnotations().then (content) ->
        annotations = content
        for annotation, i in annotations
          annotations[i]["colorName"] = nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name
          console.log "#{annotation.subtype} color: " + nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name

      # Get the text content
      page.getTextContent().then (content) ->

        textItems = []
        content.items.forEach (item) ->
          tx = pdfjsLib.Util.transform(viewport.transform, item.transform)
          fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))
          textItems.push
            str: item.str
            tx: tx
            fontHeight: fontHeight
            width: item.width
            height: item.height/fontHeight
            left: tx[4]
            top: tx[5] - fontHeight
          return

        textContent = textItems

  # Loading of the first page will wait on metadata and subsequent loadings
  # will wait on the previous pages.
  i = 1
  while i <= numPages
    lastPromise = lastPromise.then(loadPage.bind(null, i))
    i++
  lastPromise
).then (->
  console.log '# End of Document'
  # console.log annotations
  # console.log viewport
  # console.log textContent
  # I need to access all the data here

  dataObject =
    annotations: annotations
    viewport: viewport
    textContent: textContent


  # Write to a file
  fs = require('fs')
  fs.writeFile '1000_pg01.json', JSON.stringify(dataObject, null, "  "), (err) ->
    if err
      return console.log(err)
    console.log 'The file was saved!'
    return

  return
), (err) ->
  console.error 'Error: ' + err
  return
