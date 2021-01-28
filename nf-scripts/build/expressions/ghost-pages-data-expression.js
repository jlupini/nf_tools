var i, layerName, nextTopmostLayer, numLayers, pdfNum, ref, theLayer, topmostLayer;

numLayers = thisComp.numLayers;

topmostLayer = null;

nextTopmostLayer = null;

pdfNum = function(layer) {
  return layer.name.substr(0, layer.name.indexOf('_'));
};

i = 1;

while (i <= numLayers) {
  theLayer = thisComp.layer(i);
  layerName = theLayer.name;
  try {
    if (((ref = theLayer.source) != null ? ref.name.indexOf("NFPage") : void 0) >= 0 && layerName.indexOf('[ref]') < 0 && theLayer.active) {
      if (topmostLayer == null) {
        topmostLayer = theLayer;
      } else if (theLayer.index < topmostLayer.index) {
        if (pdfNum(theLayer) !== pdfNum(topmostLayer)) {
          nextTopmostLayer = topmostLayer;
        }
        topmostLayer = theLayer;
      } else if (theLayer.index < (nextTopmostLayer != null ? nextTopmostLayer.index : void 0) || (nextTopmostLayer == null)) {
        if (pdfNum(theLayer) !== pdfNum(topmostLayer)) {
          nextTopmostLayer = theLayer;
        }
      }
    }
  } catch (undefined) {}
  i++;
}

if (topmostLayer != null) {
  if (nextTopmostLayer != null) {
    topmostLayer.name + ";" + nextTopmostLayer.name;
  } else {
    "" + topmostLayer.name;
  }
} else {
  "";
}
