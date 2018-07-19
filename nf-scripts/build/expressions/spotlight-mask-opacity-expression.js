var controlLayer, duration, expValue, onValue, ref;

onValue = ON_VALUE;

duration = ANIMATION_DURATION;

controlLayer = thisComp.layer("HIGHLIGHT_CONTROL_LAYER_NAME");

expValue = function() {
  var i, idx, inTime, outTime, progress, ref, spotMarker, testMarker;
  if (controlLayer.marker.numKeys > 0) {
    for (idx = i = 1, ref = controlLayer.marker.numKeys; 1 <= ref ? i <= ref : i >= ref; idx = 1 <= ref ? ++i : --i) {
      testMarker = controlLayer.marker.key(idx);
      if (testMarker.comment === "Spotlight") {
        spotMarker = testMarker;
      }
    }
  } else {
    return null;
  }
  if (spotMarker == null) {
    return null;
  }
  inTime = spotMarker.time;
  outTime = spotMarker.time + spotMarker.duration;
  if ((inTime - duration <= time && time < inTime)) {
    progress = inTime - time;
    return onValue * (1 - progress / duration);
  } else if ((inTime <= time && time < outTime)) {
    return onValue;
  } else if ((outTime <= time && time < outTime + duration)) {
    progress = time - outTime;
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
