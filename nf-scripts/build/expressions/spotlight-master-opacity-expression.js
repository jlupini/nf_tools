var activeMarkers, adjIn, adjOut, babbies, blockEndMarker, blockEndTime, blockStartMarker, blockStartTime, duration, i, idx, inFunc, j, k, marker, numLayers, outFunc, progress, ref, ref1, spotlightMarkers, targetPDF, testMarker, theLayer;

inFunc = function(marker) {
  return marker.time - duration;
};

outFunc = function(marker) {
  return marker.time + marker.duration + duration;
};

duration = ANIMATION_DURATION * 0.75;

targetPDF = "PDF_NUMBER";

babbies = [];

spotlightMarkers = [];

activeMarkers = [];

numLayers = thisComp.numLayers;

i = 1;

while (i <= numLayers) {
  theLayer = thisComp.layer(i);
  if (theLayer.name.indexOf(targetPDF + " -") >= 0 && theLayer.name.indexOf("Highlight Control") >= 0) {
    babbies.push(theLayer);
    if (theLayer.marker.numKeys > 0) {
      for (idx = j = 1, ref = theLayer.marker.numKeys; 1 <= ref ? j <= ref : j >= ref; idx = 1 <= ref ? ++j : --j) {
        testMarker = theLayer.marker.key(idx);
        if (testMarker.comment === "Spotlight") {
          spotlightMarkers.push(testMarker);
          adjIn = inFunc(testMarker);
          adjOut = outFunc(testMarker);
          if ((adjIn < time && time < adjOut)) {
            activeMarkers.push(testMarker);
          }
        }
      }
    }
  }
  i++;
}

if (activeMarkers.length === 0) {
  0;
} else {
  blockStartTime = inFunc(activeMarkers[0]);
  blockEndTime = outFunc(activeMarkers[0]);
  blockStartMarker = blockEndMarker = activeMarkers[0];
  if (activeMarkers.length > 1) {
    for (idx = k = 1, ref1 = activeMarkers.length; 1 <= ref1 ? k <= ref1 : k >= ref1; idx = 1 <= ref1 ? ++k : --k) {
      marker = activeMarkers[idx];
      if (inFunc(marker) < blockStartTime) {
        blockStartTime = inFunc(marker);
        blockStartMarker = marker;
      }
      if (outFunc(marker) > blockEndTime) {
        blockEndTime = outFunc(marker);
        blockEndMarker = marker;
      }
    }
  }
}

if ((blockStartTime < time && time < blockStartTime + duration)) {
  progress = time - blockStartTime;
  progress / duration * value;
} else if ((blockEndTime - duration < time && time < blockEndTime)) {
  progress = blockEndTime - time;
  progress / duration * value;
} else if (time < blockStartTime || time > blockEndTime) {
  0;
} else {
  value;
}
