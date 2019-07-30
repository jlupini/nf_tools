
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

viewport = null
annotations = null
textContent = null

loadingTask = pdfjsLib.getDocument(pdfPath)
loadingTask.promise.then((doc) ->
  numPages = doc.numPages
  # console.log '# Document Loaded'
  # console.log 'Number of Pages: ' + numPages
  # console.log()
  lastPromise = undefined
  # will be used to chain promises
  lastPromise = doc.getMetadata().then((data) ->
    # console.log '# Metadata Is Loaded'
    # console.log '## Info'
    # console.log JSON.stringify(data.info, null, 2)
    # console.log()
    # if data.metadata
    #   console.log '## Metadata'
    #   console.log JSON.stringify(data.metadata.getAll(), null, 2)
    #   console.log()
    return null
  )

  loadPage = (pageNum) ->
    doc.getPage(pageNum).then (page) ->
      # console.log '# Page ' + pageNum
      # viewport = page.getViewport(scale: 1.0)
      viewport = page.view

      # console.log '# OOOOOOO ' + page._pageInfo.view
      # console.log()

      # Get the annotations
      page.getAnnotations().then((content) ->
        # console.log '## Annotation Content'
        # console.log content
        annotations = content
        return
      )

      # Get the text content
      return page.getTextContent().then((content) ->
        # Content contains lots of information about the text layout and
        # styles, but we need only strings at the moment
        # var strings = content.items.map(function (item) {
        #   return item.str;
        # });
        # console.log '## Text Content'
        # console.log JSON.stringify(content, null, 2)
        # console.log(strings.join(' '));
        textContent = content
        return
      ).then ->
        # console.log()
        return null

  # Loading of the first page will wait on metadata and subsequent loadings
  # will wait on the previous pages.
  i = 1
  while i <= numPages
    lastPromise = lastPromise.then(loadPage.bind(null, i))
    i++
  lastPromise
).then (->
  console.log '# End of Document'
  return
), (err) ->
  console.error 'Error: ' + err
  return
