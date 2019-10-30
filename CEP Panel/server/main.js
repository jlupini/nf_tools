
/* npm Modules */
var app, bodyParser, express, fs, http, httpServer, jlpdf, namedColors, nearestColor, path, pdfjsLib, pdfjsWorker, request, run;

express = require('express');

app = express();

request = require('request');

http = require('http');

path = require('path');

bodyParser = require('body-parser');

pdfjsLib = require('pdfjs-dist');

pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

nearestColor = require('nearest-color');

namedColors = require('color-name-list');

fs = require('fs');

httpServer = http.Server(app);

jlpdf = require("./jlpdf.js");

run = function() {
  var hostname, port;
  console.log("Run Ran");
  port = 3200;
  hostname = 'localhost';
  httpServer.listen(port);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  app.use(express["static"](path.join(__dirname, '../client')));
  app.get('/restart', function(req, res, next) {
    res.status(200).send();
    httpServer.close();
    return run();
  });
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
  app.get('/annotations', function(req, res, next) {
    var addToFinalData, colors, componentToHex, file, fileArr, finalDataObject, finishedCount, j, len, merge, nearest, processFiles, rgbToHex, round, strippedFileArr, testFolder;
    colors = {
      "Highlight Yellow": "#facd5a",
      "Highlight Green": "#7dc768",
      "Highlight Pink": "#fb5c89",
      "Highlight Purple": "#c885da",
      "Highlight Blue": "#69b0f1",
      "Yellow": "#ffff00",
      "Red": "#ff0000",
      "Brown": "#aa7942",
      "Blue": "#0088ff",
      "Orange": "#ff8800",
      "Purple": "#942192",
      "Pink": "#ff40ff",
      "Black": "#000000",
      "Grey": "#919191",
      "White": "#ffffff"
    };
    nearest = nearestColor.from(colors);
    componentToHex = function(c) {
      var hex;
      hex = c.toString(16);
      if (hex.length === 1) {
        return '0' + hex;
      } else {
        return hex;
      }
    };
    rgbToHex = function(r, g, b) {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
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
    testFolder = "/Users/jlupini/Avocado Video Dropbox/NF Active Prep/Fasting Webinar Aug-Sept 2019/20 Fasting-Mimicking Diet During Chemotherapy/Assets/PDF Pages";
    fileArr = fs.readdirSync(testFolder);
    strippedFileArr = [];
    for (j = 0, len = fileArr.length; j < len; j++) {
      file = fileArr[j];
      if (file.indexOf(".pdf") > -1) {
        if (!(file.indexOf("_annot") > -1)) {
          strippedFileArr.push(file);
        }
      }
    }
    console.log(strippedFileArr);
    finalDataObject = {};
    addToFinalData = function(key, obj) {
      return finalDataObject[key] = obj;
    };
    finishedCount = 0;
    processFiles = function(files, idx) {
      var annotations, loadingTask, textContent, viewport;
      viewport = 1;
      annotations = 1;
      textContent = 1;
      console.log("Opening: " + files[idx]);
      loadingTask = pdfjsLib.getDocument(testFolder + "/" + files[idx]);
      return loadingTask.promise.then(function(doc) {
        var i, lastPromise, loadPage, numPages;
        numPages = doc.numPages;
        lastPromise = doc.getMetadata().then(function(data) {
          return null;
        });
        loadPage = function(pageNum) {
          return doc.getPage(pageNum).then(function(page) {
            viewport = page.getViewport(1.0);
            page.getAnnotations().then(function(content) {
              var annotation, i, k, len1, results;
              annotations = [];
              results = [];
              for (i = k = 0, len1 = content.length; k < len1; i = ++k) {
                annotation = content[i];
                if (annotation.subtype !== "Link") {
                  results.push(annotations.push({
                    borderStyle: annotation.borderStyle.style,
                    color: [annotation.color["0"], annotation.color["1"], annotation.color["2"]],
                    rect: annotation.rect,
                    subtype: annotation.subtype,
                    annotationType: annotation.annotationType,
                    colorName: nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name
                  }));
                } else {
                  results.push(void 0);
                }
              }
              return results;
            });
            return page.getTextContent().then(function(content) {
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
                  height: round(item.height / fontHeight),
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
              console.log("Merged " + mergeCount + " objects");
              return textContent = textItems;
            });
          });
        };
        i = 1;
        while (i <= numPages) {
          lastPromise = lastPromise.then(loadPage.bind(null, i));
          i++;
        }
        return lastPromise;
      }).then((function() {
        var dataObject;
        console.log('# End of Document ' + files[idx]);
        dataObject = {
          annotations: annotations,
          viewport: viewport.viewBox,
          textContent: textContent
        };
        addToFinalData(files[idx], dataObject);
        if (idx + 1 === files.length) {
          fs.writeFile(testFolder + "/annotationData.json", JSON.stringify(finalDataObject, null, " "), function(err) {
            if (err) {
              return console.log(err);
            }
            console.log('The file was saved (block 1)!');
            res.status(200).send("Annotations Saved successfully! (block 1)");
          });
        } else {
          processFiles(files, idx + 1);
        }
      }), function(err) {
        console.error('Error: ' + err);
        if (idx + 1 === files.length) {
          fs.writeFile(testFolder + "/annotationData.json", JSON.stringify(finalDataObject, null, " "), function(err) {
            if (err) {
              return console.log(err);
            }
            console.log('The file was saved (block 2)!');
            res.status(200).send("Annotations Saved successfully! (block 2)");
          });
        } else {
          processFiles(files, idx + 1);
        }
      });
    };
    return processFiles(strippedFileArr, 0);
  });
  return app.get('/annotationData', function(req, res, next) {
    var colors, componentToHex, finalDataObject, finishedCount, merge, nearest, processFiles, rgbToHex, round;
    path = req.headers['filepath'];
    colors = {
      "Highlight Yellow": "#facd5a",
      "Highlight Green": "#7dc768",
      "Highlight Pink": "#fb5c89",
      "Highlight Purple": "#c885da",
      "Highlight Blue": "#69b0f1",
      "Yellow": "#ffff00",
      "Red": "#ff0000",
      "Brown": "#aa7942",
      "Blue": "#0088ff",
      "Orange": "#ff8800",
      "Purple": "#942192",
      "Pink": "#ff40ff",
      "Black": "#000000",
      "Grey": "#919191",
      "White": "#ffffff"
    };
    nearest = nearestColor.from(colors);
    componentToHex = function(c) {
      var hex;
      hex = c.toString(16);
      if (hex.length === 1) {
        return '0' + hex;
      } else {
        return hex;
      }
    };
    rgbToHex = function(r, g, b) {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
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
    finalDataObject = {};
    finishedCount = 0;
    processFiles = function() {
      var annotations, loadingTask, textContent, viewport;
      viewport = 1;
      annotations = 1;
      textContent = 1;
      console.log("Opening: " + path);
      loadingTask = pdfjsLib.getDocument(path);
      return loadingTask.promise.then(function(doc) {
        var i, lastPromise, loadPage, numPages;
        numPages = doc.numPages;
        lastPromise = doc.getMetadata().then(function(data) {
          return null;
        });
        loadPage = function(pageNum) {
          return doc.getPage(pageNum).then(function(page) {
            viewport = page.getViewport(1.0);
            page.getAnnotations().then(function(content) {
              var annotation, i, j, len, results;
              annotations = [];
              results = [];
              for (i = j = 0, len = content.length; j < len; i = ++j) {
                annotation = content[i];
                if (annotation.subtype !== "Link") {
                  results.push(annotations.push({
                    borderStyle: annotation.borderStyle.style,
                    color: [annotation.color["0"], annotation.color["1"], annotation.color["2"]],
                    rect: annotation.rect,
                    subtype: annotation.subtype,
                    annotationType: annotation.annotationType,
                    colorName: nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name
                  }));
                } else {
                  results.push(void 0);
                }
              }
              return results;
            });
            return page.getTextContent().then(function(content) {
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
                  height: round(item.height / fontHeight),
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
              console.log("Merged " + mergeCount + " objects");
              return textContent = textItems;
            });
          });
        };
        i = 1;
        while (i <= numPages) {
          lastPromise = lastPromise.then(loadPage.bind(null, i));
          i++;
        }
        return lastPromise;
      }).then((function() {
        var dataObject;
        console.log('# End of Document ');
        dataObject = {
          annotations: annotations,
          viewport: viewport.viewBox,
          textContent: textContent
        };
        finalDataObject = dataObject;
        console.log('The data was grabbed (block 1)!');
        res.status(200).send(jlpdf.processRawAnnotationData(finalDataObject));
      }), function(err) {
        console.error('Error: ' + err);
        console.log('The data was grabbed with error (block 2)!');
        return res.status(200).send(jlpdf.processRawAnnotationData(finalDataObject));
      });
    };
    return processFiles();
  });
};

module.exports = {
  run: run,
  close: function() {
    return httpServer.close();
  }
};

console.log('is this working');
