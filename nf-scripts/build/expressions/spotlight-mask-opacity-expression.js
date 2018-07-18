var controlLayer, duration, expValue, onValue, ref;

onValue = ON_VALUE;

duration = 1;

controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME");

expValue = function() {
  var i, idx, inMarker, outMarker, progress, ref, testMarker;
  if (controlLayer.marker.numKeys > 0) {
    for (idx = i = 1, ref = controlLayer.marker.numKeys; 1 <= ref ? i <= ref : i >= ref; idx = 1 <= ref ? ++i : --i) {
      testMarker = controlLayer.marker.key(idx);
      if (testMarker.comment === "Spot In") {
        inMarker = testMarker;
      }
      if (testMarker.comment === "Spot Out") {
        outMarker = testMarker;
      }
    }
  } else {
    return null;
  }
  if (!((inMarker != null) && (outMarker != null))) {
    return null;
  }
  if ((inMarker.time - duration <= time && time < inMarker.time)) {
    progress = inMarker.time - time;
    return onValue * (1 - progress / duration);
  } else if ((inMarker.time <= time && time < outMarker.time)) {
    return onValue;
  } else if ((outMarker.time <= time && time < outMarker.time + duration)) {
    progress = time - outMarker.time;
    return onValue * (1 - progress / duration);
  } else {
    return 0;
  }
};

if ((ref = expValue()) != null) {
  ref;
} else {
  value;
};
