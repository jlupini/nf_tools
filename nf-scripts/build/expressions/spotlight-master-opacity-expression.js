var activeMarkers, adjIn, adjOut, babbies, blockChangeInMarker, blockChangeOutMarker, blockEndMarker, blockEndTime, blockStartMarker, blockStartTime, duration, i, iMarker, idx, inFunc, j, k, l, len, numLayers, outFunc, progress, ref, ref1, ref2, ref3, somethingElseEndsDuringTheOpening, somethingElseStartsDuringTheClosing, spMark, spotlightMarkers, targetPDF, testMarker, theLayer, timeIsWithinAllAnimation, timeIsWithinClosingAnimation, timeIsWithinOpeningAnimation;

inFunc = function(mark) {
  return mark.time;
};

outFunc = function(mark) {
  return mark.time + mark.duration;
};

duration = ANIMATION_DURATION;

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
    for (idx = k = 0, ref1 = activeMarkers.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; idx = 0 <= ref1 ? ++k : --k) {
      iMarker = activeMarkers[idx];
      if (inFunc(iMarker) < blockStartTime) {
        blockStartTime = inFunc(iMarker);
        blockStartMarker = iMarker;
      }
      if (outFunc(iMarker) > blockEndTime) {
        blockEndTime = outFunc(iMarker);
        blockEndMarker = iMarker;
      }
    }
  }
}

blockChangeInMarker = null;

blockChangeOutMarker = null;

for (l = 0, len = spotlightMarkers.length; l < len; l++) {
  spMark = spotlightMarkers[l];
  if ((blockStartTime < (ref2 = outFunc(spMark)) && ref2 < blockStartTime + duration)) {
    blockChangeInMarker = spMark;
  }
  if ((blockEndTime - duration < (ref3 = inFunc(spMark)) && ref3 < blockEndTime)) {
    blockChangeOutMarker = spMark;
  }
}

somethingElseEndsDuringTheOpening = blockChangeInMarker != null;

somethingElseStartsDuringTheClosing = blockChangeOutMarker != null;

timeIsWithinAllAnimation = (blockStartTime <= time && time < blockEndTime);

timeIsWithinOpeningAnimation = (blockStartTime < time && time < blockStartTime + duration);

timeIsWithinClosingAnimation = (blockEndTime - duration < time && time < blockEndTime);

if (timeIsWithinAllAnimation) {
  if (timeIsWithinOpeningAnimation) {
    if (somethingElseEndsDuringTheOpening) {
      value;
    } else {
      progress = time - blockStartTime;
      progress / duration * value;
    }
  } else if (timeIsWithinClosingAnimation) {
    if (somethingElseStartsDuringTheClosing) {
      value;
    } else {
      progress = blockEndTime - time;
      progress / duration * value;
    }
  } else {
    value;
  }
} else {
  0;
}