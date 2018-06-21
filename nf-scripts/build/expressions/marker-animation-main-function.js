var easeAndWizz, endEquation, ref, startEquation;

startEquation = function(t, b, c, d) {
  return startEquationFunc(t, b, c, d);
};

endEquation = function(t, b, c, d) {
  return endEquationFunc(t, b, c, d);
};

easeAndWizz = function() {
  var d, dimensionCount, e, eX, eY, eZ, endValue, error, error1, error2, error3, error4, i, idx, inMarker, outMarker, ref, sX, sY, sZ, startValue, t, testMarker, val1, val2, val3;
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
  if ((inMarker != null) && (typeof inValue !== "undefined" && inValue !== null) && time < inPoint) {
    startValue = inValue;
    try {
      startValue[0];
    } catch (error1) {
      startValue = [startValue];
    }
    sX = startValue[0];
    if (dimensionCount >= 2) {
      sY = startValue[1];
      if (dimensionCount >= 3) {
        sZ = startValue[2];
      }
    }
    switch (dimensionCount) {
      case 1:
        return sX;
      case 2:
        return [sX, sY];
      case 3:
        return [sX, sY, sZ];
      default:
        return null;
    }
  } else if ((outMarker != null) && (typeof outValue !== "undefined" && outValue !== null) && time > outPoint) {
    endValue = outValue;
    try {
      endValue[0];
    } catch (error2) {
      endValue = [endValue];
    }
    sX = endValue[0];
    if (dimensionCount >= 2) {
      sY = endValue[1];
      if (dimensionCount >= 3) {
        sZ = endValue[2];
      }
    }
    switch (dimensionCount) {
      case 1:
        return sX;
      case 2:
        return [sX, sY];
      case 3:
        return [sX, sY, sZ];
      default:
        return null;
    }
  } else if ((inMarker != null) && (typeof inValue !== "undefined" && inValue !== null) && (inPoint <= time && time <= inMarker.time)) {
    startValue = inValue;
    endValue = valueAtTime(inMarker.time);
    try {
      startValue[0];
    } catch (error3) {
      e = error3;
      startValue = [startValue];
      endValue = [endValue];
    }
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
  } else if ((outMarker != null) && (typeof outValue !== "undefined" && outValue !== null) && (outMarker.time <= time && time <= outPoint)) {
    startValue = valueAtTime(outMarker.time);
    endValue = outValue;
    try {
      endValue[0];
    } catch (error4) {
      e = error4;
      startValue = [startValue];
      endValue = [endValue];
    }
    t = time - outMarker.time;
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

if ((ref = easeAndWizz()) != null) {
  ref;
} else {
  value;
};
