var activeMarkersAtTime, displayString, positionInBlock;

displayString = "";

activeMarkersAtTime = function() {
  var PDFNumber, activeMarkers, dict, error, error1, i, k, layerName, nearestMarker, numLayers, theLayer, v;
  dict = {};
  activeMarkers = [];
  nearestMarker = null;
  numLayers = thisComp.numLayers;
  i = 1;
  while (i <= numLayers) {
    theLayer = thisComp.layer(i);
    layerName = theLayer.name;
    if (layerName.indexOf("Highlight Control") >= 0) {
      PDFNumber = layerName.substr(0, layerName.indexOf(' -'));
      try {
        dict[PDFNumber].push(i);
      } catch (error1) {
        error = error1;
        dict[PDFNumber] = [i];
      }
    }
    i++;
  }
  for (k in dict) {
    v = dict[k];
    displayString += "PDF" + k + ":[" + (v.join()) + "]\n";
  }
  return activeMarkers;
};

positionInBlock = function() {
  var activeMarkers;
  return activeMarkers = activeMarkersAtTime();
};

if (time === 0) {
  positionInBlock();
}

displayString;
