var getActivePage, getCompName, loadNFLibraries, makeAlert, openDocument, processRawAnnotationData;

makeAlert = function() {
  alert('Oh dayummmmm');
};

openDocument = function(location) {
  var docRef, fileRef;
  alert('Testing server');
  fileRef = new File(location);
  docRef = app.open(fileRef);
};

loadNFLibraries = function(directory) {
  var loc;
  loc = "/Users/jlupini/Documents/nf_tools/nf-scripts/build/runtimeLibraries.jsx";
  $.evalFile(loc);
  return alert("NF Libraries Reloaded");
};

getCompName = function() {
  return NFProject.activeComp().getName();
};

getActivePage = function() {
  return NFProject.activeComp().getPDFLayer().layer.source.file.fsName;
};

processRawAnnotationData = function(rawData) {
  return NFPDFManager.processRawAnnotationData(rawData);
};
