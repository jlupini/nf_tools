function makeAlert(){
  alert("Oh fuuuuuck");
}

function openDocument(location){
  alert("Testing server");
  var fileRef = new File(location);
  var docRef = app.open(fileRef);

}
