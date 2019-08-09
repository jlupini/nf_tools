var annotations, colors, componentToHex, loadingTask, namedColors, nearest, nearestColor, pdfPath, pdfjsLib, rgbToHex, textContent, viewport;

pdfjsLib = require('pdfjs-dist');

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

pdfPath = process.argv[2] || '1000_pg01.pdf';

viewport = 1;

annotations = 1;

textContent = 1;

loadingTask = pdfjsLib.getDocument(pdfPath);

loadingTask.promise.then(function(doc) {
  var i, lastPromise, loadPage, numPages;
  numPages = doc.numPages;
  lastPromise = void 0;
  lastPromise = doc.getMetadata().then(function(data) {
    return null;
  });
  loadPage = function(pageNum) {
    return doc.getPage(pageNum).then(function(page) {
      viewport = page.getViewport(1.0);
      page.getAnnotations().then(function(content) {
        var annotation, i, j, len, results;
        annotations = content;
        results = [];
        for (i = j = 0, len = annotations.length; j < len; i = ++j) {
          annotation = annotations[i];
          annotations[i]["colorName"] = nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name;
          results.push(console.log((annotation.subtype + " color: ") + nearest(rgbToHex(annotation.color["0"], annotation.color["1"], annotation.color["2"])).name));
        }
        return results;
      });
      return page.getTextContent().then(function(content) {
        var textItems;
        textItems = [];
        content.items.forEach(function(item) {
          var fontHeight, tx;
          tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
          fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
          textItems.push({
            str: item.str,
            tx: tx,
            fontHeight: fontHeight,
            width: item.width,
            height: item.height / fontHeight,
            left: tx[4],
            top: tx[5] - fontHeight
          });
        });
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
  var dataObject, fs;
  console.log('# End of Document');
  dataObject = {
    annotations: annotations,
    viewport: viewport,
    textContent: textContent
  };
  fs = require('fs');
  fs.writeFile('1000_pg01.json', JSON.stringify(dataObject, null, "  "), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
}), function(err) {
  console.error('Error: ' + err);
});
