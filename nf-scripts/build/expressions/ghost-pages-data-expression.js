var extra, i, layerName, nextTopmostLayer, numLayers, ref, theLayer, topmostLayer;

numLayers = thisComp.numLayers;

topmostLayer = null;

nextTopmostLayer = null;

extra = 0;

i = 1;

while (i <= numLayers) {
  theLayer = thisComp.layer(i);
  layerName = theLayer.name;
  try {
    if (((ref = theLayer.source) != null ? ref.name.indexOf("NFPage") : void 0) >= 0 && layerName.indexOf('[ref]') < 0 && theLayer.active) {
      if (topmostLayer == null) {
        topmostLayer = theLayer;
      } else if (theLayer.index < topmostLayer.index) {
        extra++;
        nextTopmostLayer = topmostLayer;
        topmostLayer = theLayer;
      } else if (theLayer.index < (nextTopmostLayer != null ? nextTopmostLayer.index : void 0) || (nextTopmostLayer == null)) {
        nextTopmostLayer = theLayer;
      }
    }
  } catch (undefined) {}
  i++;
}

if (topmostLayer != null) {
  if (nextTopmostLayer != null) {
    topmostLayer.name + "&" + nextTopmostLayer.name;
  } else {
    "" + topmostLayer.name;
  }
} else {
  "";
}
