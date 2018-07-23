var activeMarkersAtTime, controlLayer, duration, expValue, firstInBlock, inFunc, lastInBlock, notFirstOrLastInBlock, onValue, onlyInBlock, outFunc, positionInBlock, ref, targetPDF, thisSpotlightMarker;

onValue = ON_VALUE;

duration = ANIMATION_DURATION;

controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME");

targetPDF = "PDF_NUMBER";

firstInBlock = 101;

lastInBlock = 202;

onlyInBlock = 252;

notFirstOrLastInBlock = 303;

inFunc = function(mark) {
  return mark.time - duration;
};

outFunc = function(mark) {
  return mark.time + mark.duration + duration;
};

activeMarkersAtTime = function() {
  var activeMarkers, adjIn, adjOut, babbies, i, idx, j, numLayers, ref, spotlightMarkers, testMarker, theLayer;
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
  return activeMarkers;
};

thisSpotlightMarker = function() {
  var idx, j, ref, spotMarker, testMarker;
  if (controlLayer.marker.numKeys > 0) {
    for (idx = j = 1, ref = controlLayer.marker.numKeys; 1 <= ref ? j <= ref : j >= ref; idx = 1 <= ref ? ++j : --j) {
      testMarker = controlLayer.marker.key(idx);
      if (testMarker.comment === "Spotlight") {
        spotMarker = testMarker;
      }
    }
    return spotMarker;
  } else {
    return null;
  }
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
        if (inFunc(iMarker) < blockStartTime) {
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
    thisMarker = thisSpotlightMarker();
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
  var inTime, outTime, posInBlk, progress, spotMarker;
  spotMarker = thisSpotlightMarker();
  if (spotMarker == null) {
    return null;
  }
  posInBlk = positionInBlock();
  inTime = spotMarker.time;
  outTime = spotMarker.time + spotMarker.duration;
  if ((inTime - duration <= time && time < inTime) && posInBlk !== firstInBlock && posInBlk !== onlyInBlock) {
    progress = inTime - time;
    return onValue * (1 - progress / duration);
  } else if ((outTime <= time && time < outTime + duration) && posInBlk !== lastInBlock && posInBlk !== onlyInBlock) {
    progress = time - outTime;
    return onValue * (1 - progress / duration);
  } else if ((inTime <= time && time < outTime) || (posInBlk === lastInBlock || posInBlk === firstInBlock)) {
    return onValue;
  } else {
    return 0;
  }
};

if ((ref = expValue()) != null) {
  ref;
} else {
  value;
};
