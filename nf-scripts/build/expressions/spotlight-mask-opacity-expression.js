var activeMarkersAtTime, controlLayer, duration, expValue, firstInBlock, inFunc, lastInBlock, nearestSpotlightMarkerOnThisControl, notFirstOrLastInBlock, onValue, onlyInBlock, outFunc, positionInBlock, ref, spotlightMarkers, targetPDF;

onValue = ON_VALUE;

duration = ANIMATION_DURATION;

controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME");

targetPDF = "PDF_NUMBER";

spotlightMarkers = [];

firstInBlock = 101;

lastInBlock = 202;

onlyInBlock = 252;

notFirstOrLastInBlock = 303;

nearestSpotlightMarkerOnThisControl = null;

inFunc = function(mark) {
  return mark.time;
};

outFunc = function(mark) {
  return mark.time + mark.duration;
};

activeMarkersAtTime = function() {
  var activeMarkers, adjIn, adjOut, i, idx, j, min, nearestMarker, numLayers, prevTimeToIn, prevTimeToOut, ref, testMarker, theLayer, timeToIn, timeToOut;
  activeMarkers = [];
  nearestMarker = null;
  numLayers = thisComp.numLayers;
  i = 1;
  while (i <= numLayers) {
    theLayer = thisComp.layer(i);
    if (theLayer.name.indexOf(targetPDF + " -") === 0 && theLayer.name.indexOf("Highlight Control") >= 0) {
      if (theLayer.marker.numKeys > 0) {
        for (idx = j = 1, ref = theLayer.marker.numKeys; 1 <= ref ? j <= ref : j >= ref; idx = 1 <= ref ? ++j : --j) {
          testMarker = theLayer.marker.key(idx);
          if (testMarker.comment === "Spotlight") {
            spotlightMarkers.push(testMarker);
            adjIn = inFunc(testMarker);
            adjOut = outFunc(testMarker);
            if ((adjIn <= time && time < adjOut)) {
              activeMarkers.push(testMarker);
            }
            if (theLayer.name === controlLayer.name) {
              if ((adjIn <= time && time <= adjOut)) {
                nearestMarker = testMarker;
              } else if (nearestMarker != null) {
                timeToIn = Math.abs(time - adjIn);
                timeToOut = Math.abs(time - adjOut);
                prevTimeToIn = Math.abs(time - inFunc(nearestMarker));
                prevTimeToOut = Math.abs(time - outFunc(nearestMarker));
                min = Math.min(timeToIn, timeToOut, prevTimeToIn, prevTimeToOut);
                if (min === timeToIn || min === timeToOut) {
                  nearestMarker = testMarker;
                }
              } else {
                nearestMarker = testMarker;
              }
            }
          }
        }
      }
      nearestSpotlightMarkerOnThisControl = nearestMarker;
    }
    i++;
  }
  return activeMarkers;
};

positionInBlock = function() {
  var activeMarkers, blockEndMarker, blockEndTime, blockStartMarker, blockStartTime, iMarker, idx, j, ref, thisMarker;
  activeMarkers = activeMarkersAtTime();
  if (activeMarkers.length === 0) {
    return notFirstOrLastInBlock;
  } else {
    blockStartTime = inFunc(activeMarkers[0]);
    blockEndTime = outFunc(activeMarkers[0]);
    blockStartMarker = blockEndMarker = activeMarkers[0];
    if (activeMarkers.length > 1) {
      for (idx = j = 0, ref = activeMarkers.length - 1; 0 <= ref ? j <= ref : j >= ref; idx = 0 <= ref ? ++j : --j) {
        iMarker = activeMarkers[idx];
        if (inFunc(iMarker) <= blockStartTime) {
          blockStartTime = inFunc(iMarker);
          blockStartMarker = iMarker;
        }
        if (outFunc(iMarker) > blockEndTime) {
          blockEndTime = outFunc(iMarker);
          blockEndMarker = iMarker;
        }
      }
    } else {
      return onlyInBlock;
    }
    thisMarker = nearestSpotlightMarkerOnThisControl;
    if (blockStartMarker.time === thisMarker.time) {
      return firstInBlock;
    } else if (blockEndMarker.time === thisMarker.time) {
      return lastInBlock;
    } else {
      return notFirstOrLastInBlock;
    }
  }
};

expValue = function() {
  var blockChangeInMarker, blockChangeOutMarker, inTime, isntFirstOrOnly, isntLastOrOnly, j, len, outTime, posInBlk, progress, ref, ref1, somethingElseEndsDuringTheOpening, somethingElseStartsDuringTheClosing, spMark, spotMarker, timeIsWithinAllAnimation, timeIsWithinClosingAnimation, timeIsWithinOpeningAnimation;
  posInBlk = positionInBlock();
  spotMarker = nearestSpotlightMarkerOnThisControl;
  if (spotMarker == null) {
    return null;
  }
  inTime = inFunc(spotMarker);
  outTime = outFunc(spotMarker);
  isntFirstOrOnly = posInBlk !== firstInBlock && posInBlk !== onlyInBlock;
  isntLastOrOnly = posInBlk !== lastInBlock && posInBlk !== onlyInBlock;
  timeIsWithinOpeningAnimation = (inTime <= time && time < inTime + duration);
  timeIsWithinClosingAnimation = (outTime - duration <= time && time < outTime);
  timeIsWithinAllAnimation = (inTime <= time && time < outTime);
  blockChangeInMarker = null;
  blockChangeOutMarker = null;
  for (j = 0, len = spotlightMarkers.length; j < len; j++) {
    spMark = spotlightMarkers[j];
    if ((inTime < (ref = outFunc(spMark)) && ref < inTime + duration)) {
      blockChangeInMarker = spMark;
    }
    if ((outTime - duration < (ref1 = inFunc(spMark)) && ref1 < outTime)) {
      blockChangeOutMarker = spMark;
    }
  }
  somethingElseEndsDuringTheOpening = blockChangeInMarker != null;
  somethingElseStartsDuringTheClosing = blockChangeOutMarker != null;
  if (timeIsWithinAllAnimation) {
    if (timeIsWithinOpeningAnimation) {
      if (isntFirstOrOnly || somethingElseEndsDuringTheOpening) {
        progress = inTime + duration - time;
        return onValue * (1 - progress / duration);
      }
    } else if (timeIsWithinClosingAnimation) {
      if (isntLastOrOnly || somethingElseStartsDuringTheClosing) {
        progress = time - outTime + duration;
        return onValue * (1 - progress / duration);
      }
    } else {
      return onValue;
    }
  } else {
    return 0;
  }
};

if ((ref = expValue()) != null) {
  ref;
} else {
  value;
};
