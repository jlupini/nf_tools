var activeMarkers, adjIn, adjOut, babbies, blockChangeInMarker, blockChangeOutMarker, blockEndMarker, blockEndTime, blockStartMarker, blockStartTime, dataArr, dataLayer, dataLayerText, dataString, duration, endIndex, i, iMarker, idx, inFunc, j, k, l, len, len1, m, nearestMarker, outFunc, preIndex, progress, ref, ref1, ref2, ref3, searchPointString, somethingElseEndsDuringTheOpening, somethingElseStartsDuringTheClosing, spMark, spotlightMarkers, targetPDF, testMarker, theLayer, timeIsWithinAllAnimation, timeIsWithinClosingAnimation, timeIsWithinOpeningAnimation;

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

dataLayer = thisComp.layer("SpotData");

dataLayerText = dataLayer("Text")("Source Text").valueAtTime(0);

searchPointString = "PDF" + targetPDF + ":[";

preIndex = dataLayerText.indexOf(searchPointString);

endIndex = preIndex + dataLayerText.substring(preIndex).indexOf("]");

dataString = dataLayerText.substring(preIndex + searchPointString.length, endIndex);

dataArr = dataString.split(",");

activeMarkers = [];

nearestMarker = null;

for (j = 0, len = dataArr.length; j < len; j++) {
  i = dataArr[j];
  theLayer = thisComp.layer(parseInt(i));
  if (theLayer.name.indexOf(targetPDF + " -") === 0 && theLayer.name.indexOf("Highlight Control") >= 0) {
    babbies.push(theLayer);
    if (theLayer.marker.numKeys > 0) {
      for (idx = k = 1, ref = theLayer.marker.numKeys; 1 <= ref ? k <= ref : k >= ref; idx = 1 <= ref ? ++k : --k) {
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
    for (idx = l = 0, ref1 = activeMarkers.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; idx = 0 <= ref1 ? ++l : --l) {
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

for (m = 0, len1 = spotlightMarkers.length; m < len1; m++) {
  spMark = spotlightMarkers[m];
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
