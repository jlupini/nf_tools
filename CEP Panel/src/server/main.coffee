### npm Modules ###

express = require('express')
app = express()
request = require('request')
http = require('http')
path = require('path')
bodyParser = require('body-parser')

pdfjsLib = require('pdfjs-dist')
pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry')
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

fs = require('fs')
httpServer = http.Server(app)

# Import Local Classes and files
jlpdf = require "./jlpdf.js"

run = ->
  port = 3200
  hostname = 'localhost'
  httpServer.listen port

  app.use bodyParser.json()
  app.use bodyParser.urlencoded(
    limit: '50mb'
    extended: true)
  app.use express.static(path.join(__dirname, '../client'))

  app.get '/import', (req, res, next) ->
    path = req.headers['directory'] + '/placeholder.png'
    uri = 'http://via.placeholder.com/350x150'

    saveImage = (uri, filepath, callback) ->
      request.head uri, (err, res, body) ->
        request(uri).pipe(fs.createWriteStream(filepath)).on 'close', callback

    saveImage uri, path, ->
      res.status(200).send path

  # app.get '/annotations', (req, res, next) ->
  #   colors =
  #     "Highlight Yellow": "#facd5a"
  #     "Highlight Green": "#7dc768"
  #     "Highlight Pink": "#fb5c89"
  #     "Highlight Purple": "#c885da"
  #     "Highlight Blue": "#69b0f1"
  #     "Yellow": "#ffff00"
  #     "Red": "#ff0000"
  #     "Brown": "#aa7942"
  #     "Blue": "#0088ff"
  #     "Orange": "#ff8800"
  #     "Purple": "#942192"
  #     "Pink": "#ff40ff"
  #     "Black": "#000000"
  #     "Grey": "#919191"
  #     "White": "#ffffff"
  #   nearest = nearestColor.from(colors)
  #   componentToHex = (c) ->
  #     hex = c.toString(16)
  #     if hex.length == 1 then '0' + hex else hex
  #   rgbToHex = (r, g, b) ->
  #     '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
  #   round = (value, precision = 4) ->
  #     multiplier = 10 ** (precision or 0)
  #     Math.round(value * multiplier) / multiplier
  #   merge = (r1, r2) ->
  #     width = if r1.width > r2.width then r1.width else r2.width + r2.left - (r1.left)
  #     height = if r1.height > r2.height then r1.height else r2.height + r2.top - (r1.top)
  #     {
  #       left: Math.min(r1.left, r2.left)
  #       top: Math.min(r1.top, r2.top)
  #       width: width
  #       height: height
  #     }
  #   testFolder = "/Users/jlupini/Avocado Video Dropbox/NF Active Prep/Fasting Webinar Aug-Sept 2019/20 Fasting-Mimicking Diet During Chemotherapy/Assets/PDF Pages"
  #
  #   fileArr = fs.readdirSync(testFolder)
  #   strippedFileArr = []
  #   for file in fileArr
  #     if file.indexOf(".pdf") > -1
  #       strippedFileArr.push file unless file.indexOf("_annot") > -1
  #   console.log strippedFileArr
  #
  #   finalDataObject = {}
  #   addToFinalData = (key, obj) ->
  #     finalDataObject[key] = obj
  #
  #   # Will be using promises to load document, pages and misc data instead of
  #   # callback.
  #   finishedCount = 0
  #   # for file in strippedFileArr
  #   processFiles = (files, idx) ->
  #     viewport = 1
  #     annotations = 1
  #     textContent = 1
  #     console.log "Opening: #{files[idx]}"
  #     loadingTask = pdfjsLib.getDocument("#{testFolder}/#{files[idx]}")
  #     loadingTask.promise.then((doc) ->
  #       numPages = doc.numPages
  #       lastPromise = doc.getMetadata().then (data) ->
  #         return null
  #
  #       loadPage = (pageNum) ->
  #         doc.getPage(pageNum).then (page) ->
  #           viewport = page.getViewport(1.0)
  #
  #           # Get the annotations
  #           page.getAnnotations().then (content) ->
  #             annotations = []
  #             for annotation, i in content
  #               unless annotation.subtype is "Link"
  #                 annotations.push
  #                   borderStyle: annotation.borderStyle.style
  #                   color: [annotation.color["0"], annotation.color["1"], annotation.color["2"]]
  #                   rect: annotation.rect
  #                   subtype: annotation.subtype
  #                   annotationType: annotation.annotationType
  #                   colorName: nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name
  #
  #           # Get the text content
  #           page.getTextContent().then (content) ->
  #
  #             textItems = []
  #             prevItem = {}
  #             mergeCount = 0
  #             content.items.forEach (item) ->
  #               tx = pdfjsLib.Util.transform(viewport.transform, item.transform)
  #               fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))
  #
  #               newItem =
  #                 str: item.str
  #                 # tx: tx
  #                 fontHeight: fontHeight
  #                 width: round(item.width)
  #                 height: round(item.height/fontHeight)
  #                 left: round(tx[4])
  #                 top: round(tx[5] - fontHeight)
  #               # textItems.push newItem
  #
  #               # Combine together items on the same lines to reduce JSON file size
  #               prevItem = textItems[textItems.length - 1] if textItems.length isnt 0
  #               # console.log "Ding:  #{Math.abs(prevItem.top - newItem.top) < prevItem.height}"
  #               if prevItem? and ( Math.abs(prevItem.top - newItem.top) < prevItem.height )
  #                 mergedRect = merge prevItem, newItem
  #                 # console.log "merged"
  #                 mergeCount++
  #                 combinedItem =
  #                   str: "#{prevItem.str} // #{newItem.str}"
  #                   width: round(mergedRect.width)
  #                   height: round(mergedRect.height)
  #                   left: round(mergedRect.left)
  #                   top: round(mergedRect.top)
  #                 textItems[textItems.length - 1] = combinedItem
  #               else
  #                 textItems.push newItem
  #               return
  #             console.log "Merged #{mergeCount} objects"
  #
  #             textContent = textItems
  #
  #       # Loading of the first page will wait on metadata and subsequent loadings
  #       # will wait on the previous pages.
  #       i = 1
  #       while i <= numPages
  #         lastPromise = lastPromise.then(loadPage.bind(null, i))
  #         i++
  #       lastPromise
  #     ).then (->
  #       console.log '# End of Document ' + files[idx]
  #
  #       dataObject =
  #         annotations: annotations
  #         viewport: viewport.viewBox
  #         textContent: textContent
  #
  #       addToFinalData files[idx], dataObject
  #       if idx + 1 is files.length
  #         # Write to a file
  #         fs.writeFile "#{testFolder}/annotationData.json", JSON.stringify(finalDataObject, null, " "), (err) ->
  #           if err
  #             return console.log(err)
  #           console.log 'The file was saved (block 1)!'
  #           res.status(200).send "Annotations Saved successfully! (block 1)"
  #           return
  #       else
  #         processFiles(files, idx + 1)
  #
  #       return
  #     ), (err) ->
  #       console.error 'Error: ' + err
  #       if idx + 1 is files.length
  #         # Write to a file
  #         fs.writeFile "#{testFolder}/annotationData.json", JSON.stringify(finalDataObject, null, " "), (err) ->
  #           if err
  #             return console.log(err)
  #           console.log 'The file was saved (block 2)!'
  #           res.status(200).send "Annotations Saved successfully! (block 2)"
  #           return
  #       else
  #         processFiles(files, idx + 1)
  #       return
  #   processFiles strippedFileArr, 0

  app.get '/annotationData', (req, res, next) ->
    path = req.headers['filepath']

    viewport = 1
    annotations = 1
    textContent = 1

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

    handleError = (reason) ->
      console.error 'Error processing PDF: ' + reason
      res.status(500).send()

    handleSuccess = ->
      console.log 'PDF Processing success'
      res.status(200).send jlpdf.processRawAnnotationData
        annotations: annotations
        viewport: viewport.viewBox
        textContent: textContent

    console.log "Processing PDF: #{path}"

    afterLoad = (doc) ->

      loadPage = (pageNum) ->
        doc.getPage(pageNum).then (page) ->
          viewport = page.getViewport(1.0)

          processAnnotations = (content) ->
            annotations = []
            for annotation, i in content
              unless annotation.subtype is "Link"
                annotations.push
                  borderStyle: annotation.borderStyle.style
                  color: jlpdf.trimColorArray(annotation.color)
                  rect: annotation.rect
                  subtype: annotation.subtype
                  annotationType: annotation.annotationType
                  colorName: jlpdf.nearestColorName(annotation.color)

          processTextContent = (content) ->

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
                # height: round(item.height/fontHeight)
                height: round(item.height)
                left: round(tx[4])
                top: round(tx[5] - fontHeight)

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
            # console.log "Merged #{mergeCount} objects"

            textContent = textItems

          page.getAnnotations().then processAnnotations
          page.getTextContent().then processTextContent

      # Loading of the first page will wait on metadata and subsequent loadings
      # will wait on the previous pages.
      numPages = doc.numPages
      lastPromise = doc.getMetadata().then (data) -> return null

      i = 1
      while i <= numPages
        lastPromise = lastPromise.then loadPage.bind(null, i)
        i++
      lastPromise

    loadingTask = pdfjsLib.getDocument(path)
    loadingTask.promise.then(afterLoad).then handleSuccess, handleError


module.exports =
  run: run
  close: ->
    httpServer.close()
