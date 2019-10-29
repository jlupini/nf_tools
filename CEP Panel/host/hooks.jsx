var makeAlert, openDocument;

makeAlert = function() {
  alert('Oh dayummmmm');
};

openDocument = function(location) {
  var docRef, fileRef;
  alert('Testing server');
  fileRef = new File(location);
  docRef = app.open(fileRef);
};
