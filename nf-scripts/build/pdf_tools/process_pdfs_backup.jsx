var annotations, loadingTask, pdfPath, pdfjsLib, textContent, viewport;

pdfjsLib = require('pdfjs-dist');

pdfPath = process.argv[2] || '1_pg01.pdf';

viewport = null;

annotations = null;

textContent = null;

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
      viewport = page.view;
      page.getAnnotations().then(function(content) {
        annotations = content;
      });
      return page.getTextContent().then(function(content) {
        textContent = content;
      }).then(function() {
        return null;
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
}), function(err) {
  console.error('Error: ' + err);
});
