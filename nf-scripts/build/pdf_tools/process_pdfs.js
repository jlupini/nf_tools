var addToFinalData, colors, componentToHex, file, fileArr, finalDataObject, finishedCount, fs, j, len, merge, namedColors, nearest, nearestColor, pdfPath, pdfjsLib, processFiles, rgbToHex, round, strippedFileArr, testFolder;

pdfjsLib = require('pdfjs-dist');

fs = require('fs');

nearestColor = require('nearest-color');

namedColors = require('color-name-list');

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

pdfPath = process.argv[2] || '1000_pg01.pdf';

testFolder = "/Users/jlupini/Avocado Video Dropbox/NF Active Prep/Volume 48/48-05 SUGAR Does Sugar Lead to Weight Gain?/48-05 Assets/PDF Pages";

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
      fs.writeFile(testFolder + "/annotationData.json", JSON.stringify(finalDataObject), function(err) {
        if (err) {
          return console.log(err);
        }
        console.log('The file was saved!');
      });
    } else {
      processFiles(files, idx + 1);
    }
  }), function(err) {
    console.error('Error: ' + err);
    if (idx + 1 === files.length) {
      fs.writeFile(testFolder + "/annotationData.json", JSON.stringify(finalDataObject), function(err) {
        if (err) {
          return console.log(err);
        }
        console.log('The file was saved!');
      });
    } else {
      processFiles(files, idx + 1);
    }
  });
};

processFiles(strippedFileArr, 0);
