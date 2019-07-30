var annotations, loadingTask, pdfPath, pdfjsLib, textContent, viewport;

pdfjsLib = require('pdfjs-dist');

pdfPath = process.argv[2] || '1_pg01.pdf';

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
        return annotations = content;
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
  console.log('# End of Document');
  console.log(annotations);
  console.log(viewport);
  console.log(textContent);
}), function(err) {
  console.error('Error: ' + err);
});
