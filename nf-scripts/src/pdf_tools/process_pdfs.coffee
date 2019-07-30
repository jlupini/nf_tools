
# Basic node example that prints document metadata and text content.
# Requires single file built version of PDF.js -- please run
# `gulp singlefile` before running the example.
#
# Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
pdfjsLib = require('pdfjs-dist')
# Loading file from file system into typed array

pdfPath = process.argv[2] or '1_pg01.pdf'
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

      # Get the text content
      page.getTextContent().then (content) ->

        # find all text start points
        # xs = []
        # ys = []
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
            #fullItem: item.transform
          # xs.push tx[4]
          # ys.push tx[5]
          return
        # boundsOfStartPoints = [
        #   Math.min.apply(null, xs)
        #   Math.min.apply(null, ys)
        #   Math.max.apply(null, xs)
        #   Math.max.apply(null, ys)
        # ]

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
  console.log annotations
  console.log viewport
  console.log textContent
  # I need to access all the data here
  return
), (err) ->
  console.error 'Error: ' + err
  return
