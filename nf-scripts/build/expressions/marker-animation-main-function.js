var easeAndWizz, endEquation, startEquation;

startEquation = function(t, b, c, d) {
  return eval(startEquationString);
};

endEquation = function(t, b, c, d) {
  return eval(endEquationString);
};

easeAndWizz = function() {
  var d, dimensionCount, e, eX, eY, eZ, endValue, error, i, idx, inMarker, outMarker, ref, sX, sY, sZ, startValue, t, testMarker, val1, val2, val3;
  if (marker.numKeys > 0) {
    for (idx = i = 1, ref = marker.numKeys; 1 <= ref ? i <= ref : i >= ref; idx = 1 <= ref ? ++i : --i) {
      testMarker = marker.key(idx);
      if (testMarker.comment === "NF In") {
        inMarker = testMarker;
      }
      if (testMarker.comment === "NF Out") {
        outMarker = testMarker;
      }
    }
  } else {
    return null;
  }
  if (!((inMarker != null) || (outMarker != null))) {
    return null;
  }
  dimensionCount = 1;
  try {
    value[1];
    dimensionCount = 2;
    value[2];
    dimensionCount = 3;
  } catch (error) {
    e = error;
  }
  if ((inMarker != null) && (inPoint <= time && time <= inMarker.time)) {
    startValue = inValue;
    endValue = valueAtTime(inMarker.time);
    t = time - inPoint;
    d = inMarker.time - inPoint;
    sX = startValue[0];
    eX = endValue[0] - startValue[0];
    if (dimensionCount >= 2) {
      sY = startValue[1];
      eY = endValue[1] - startValue[1];
      if (dimensionCount >= 3) {
        sZ = startValue[2];
        eZ = endValue[2] - startValue[2];
      }
    }
    val1 = startEquation(t, sX, eX, d);
    switch (dimensionCount) {
      case 1:
        return val1;
      case 2:
        val2 = startEquation(t, sY, eY, d);
        return [val1, val2];
      case 3:
        val2 = startEquation(t, sY, eY, d);
        val3 = startEquation(t, sZ, eZ, d);
        return [val1, val2, val3];
      default:
        return null;
    }
  } else if ((outMarker != null) && (outMarker.time <= time && time <= outPoint)) {
    startValue = valueAtTime(outMarker.time);
    endValue = outValue;
    t = time - inPoint;
    d = outPoint - outMarker.time;
    sX = startValue[0];
    eX = endValue[0] - startValue[0];
    if (dimensionCount >= 2) {
      sY = startValue[1];
      eY = endValue[1] - startValue[1];
      if (dimensionCount >= 3) {
        sZ = startValue[2];
        eZ = endValue[2] - startValue[2];
      }
    }
    val1 = endEquation(t, sX, eX, d);
    switch (dimensionCount) {
      case 1:
        return val1;
      case 2:
        val2 = endEquation(t, sY, eY, d);
        return [val1, val2];
      case 3:
        val2 = endEquation(t, sY, eY, d);
        val3 = endEquation(t, sZ, eZ, d);
        return [val1, val2, val3];
      default:
        return null;
    }
  }
  return null;
};

easeAndWizz() || value;
