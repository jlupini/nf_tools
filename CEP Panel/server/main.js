
/* npm Modules */
var app, bodyParser, express, fs, http, httpServer, jlpdf, path, pdfjsLib, pdfjsWorker, request, run;

express = require('express');

app = express();

request = require('request');

http = require('http');

path = require('path');

bodyParser = require('body-parser');

pdfjsLib = require('pdfjs-dist');

pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

fs = require('fs');

httpServer = http.Server(app);

jlpdf = require("./jlpdf.js");

run = function() {
  var hostname, port;
  port = 3200;
  hostname = 'localhost';
  httpServer.listen(port);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  app.use(express["static"](path.join(__dirname, '../client')));
  app.get('/import', function(req, res, next) {
    var saveImage, uri;
    path = req.headers['directory'] + '/placeholder.png';
    uri = 'http://via.placeholder.com/350x150';
    saveImage = function(uri, filepath, callback) {
      return request.head(uri, function(err, res, body) {
        return request(uri).pipe(fs.createWriteStream(filepath)).on('close', callback);
      });
    };
    return saveImage(uri, path, function() {
      return res.status(200).send(path);
    });
  });
  return app.get('/annotationData', function(req, res, next) {
    var afterLoad, annotations, handleError, handleSuccess, loadingTask, merge, round, textContent, viewport;
    path = req.headers['filepath'];
    viewport = 1;
    annotations = 1;
    textContent = 1;
    round = function(value, precision) {
      var multiplier;
      if (precision == null) {
        precision = 4;
      }
      multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    };
    merge = function(r1, r2) {
      var height, width;
      width = r1.width > r2.width ? r1.width : r2.width + r2.left - r1.left;
      height = r1.height > r2.height ? r1.height : r2.height + r2.top - r1.top;
      return {
        left: Math.min(r1.left, r2.left),
        top: Math.min(r1.top, r2.top),
        width: width,
        height: height
      };
    };
    handleError = function(reason) {
      console.error('Error processing PDF: ' + reason);
      return res.status(500).send();
    };
    handleSuccess = function() {
      console.log('PDF Processing success');
      return res.status(200).send(jlpdf.processRawAnnotationData({
        annotations: annotations,
        viewport: viewport.viewBox,
        textContent: textContent
      }));
    };
    console.log("Processing PDF: " + path);
    afterLoad = function(doc) {
      var i, lastPromise, loadPage, numPages;
      loadPage = function(pageNum) {
        return doc.getPage(pageNum).then(function(page) {
          var processAnnotations, processTextContent;
          viewport = page.getViewport(1.0);
          processAnnotations = function(content) {
            var annotation, i, j, len, results;
            annotations = [];
            results = [];
            for (i = j = 0, len = content.length; j < len; i = ++j) {
              annotation = content[i];
              if (annotation.subtype !== "Link") {
                results.push(annotations.push({
                  borderStyle: annotation.borderStyle.style,
                  color: jlpdf.trimColorArray(annotation.color),
                  rect: annotation.rect,
                  subtype: annotation.subtype,
                  annotationType: annotation.annotationType,
                  colorName: jlpdf.nearestColorName(annotation.color)
                }));
              } else {
                results.push(void 0);
              }
            }
            return results;
          };
          processTextContent = function(content) {
            var mergeCount, prevItem, textItems;
            textItems = [];
            prevItem = {};
            mergeCount = 0;
            content.items.forEach(function(item) {
              var combinedItem, fontHeight, mergedRect, newItem, tx;
              tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
              fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
              newItem = {
                str: item.str,
                fontHeight: fontHeight,
                width: round(item.width),
                height: round(item.height),
                left: round(tx[4]),
                top: round(tx[5] - fontHeight)
              };
              if (textItems.length !== 0) {
                prevItem = textItems[textItems.length - 1];
              }
              if ((prevItem != null) && (Math.abs(prevItem.top - newItem.top) < prevItem.height)) {
                mergedRect = merge(prevItem, newItem);
                mergeCount++;
                combinedItem = {
                  str: prevItem.str + " // " + newItem.str,
                  width: round(mergedRect.width),
                  height: round(mergedRect.height),
                  left: round(mergedRect.left),
                  top: round(mergedRect.top)
                };
                textItems[textItems.length - 1] = combinedItem;
              } else {
                textItems.push(newItem);
              }
            });
            return textContent = textItems;
          };
          page.getAnnotations().then(processAnnotations);
          return page.getTextContent().then(processTextContent);
        });
      };
      numPages = doc.numPages;
      lastPromise = doc.getMetadata().then(function(data) {
        return null;
      });
      i = 1;
      while (i <= numPages) {
        lastPromise = lastPromise.then(loadPage.bind(null, i));
        i++;
      }
      return lastPromise;
    };
    loadingTask = pdfjsLib.getDocument(path);
    return loadingTask.promise.then(afterLoad).then(handleSuccess, handleError);
  });
};

module.exports = {
  run: run,
  close: function() {
    return httpServer.close();
  }
};
