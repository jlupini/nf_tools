var activeSlideInfo, activeSlides, calcVal, calcValFactor, deltaScale, deltaX, deltaY, easeInOutCubic, fullscreenDefaultPosition, fullscreenDefaultScaleFactor, i, idx, inMarker, isPos, isScale, isTransitioning, j, k, len, numLayers, obj, outMarker, progress, ref, slide1, slide1Info, slide2, slide2Info, splitscreenDefaultPosition, splitscreenDefaultScaleFactor, testMarker, theLayer, thisSlide, transitionType;

isPos = thisProperty.name === "Position";

isScale = thisProperty.name === "Scale";

if (isPos) {
  fullscreenDefaultPosition = thisLayer.effect("Fullscreen Default Position")("Point").value;
  splitscreenDefaultPosition = thisLayer.effect("Splitscreen Default Position")("Point").value;
}

if (isScale) {
  fullscreenDefaultScaleFactor = thisLayer.effect("Fullscreen Default Scale")("Slider").value;
  splitscreenDefaultScaleFactor = thisLayer.effect("Splitscreen Default Scale")("Slider").value;
}

easeInOutCubic = function(t) {
  if (t < 0.5) {
    return 4 * t * t * t;
  } else {
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

numLayers = thisComp.numLayers;

activeSlides = [];

calcVal = null;

i = 1;

while (i <= numLayers) {
  theLayer = thisComp.layer(i);
  if (theLayer.active) {
    try {
      transitionType = theLayer.effect("Transition Type");
    } catch (undefined) {}
    if (transitionType != null) {
      activeSlides.push(theLayer);
    }
    transitionType = null;
  }
  if (activeSlides.length === 2) {
    break;
  }
  i++;
}

if (activeSlides.length !== 0) {
  activeSlideInfo = [];
  for (j = 0, len = activeSlides.length; j < len; j++) {
    thisSlide = activeSlides[j];
    obj = {};
    try {
      switch (thisSlide.effect("Transition Type")("Menu").value) {
        case 3:
          if (isPos) {
            obj.targetPosVal = thisSlide.effect("Position Override")("Point").value;
          }
          if (isScale) {
            obj.targetScaleFactor = thisSlide.effect("Scale Override")("Slider").value;
          }
          break;
        case 2:
          if (isPos) {
            obj.targetPosVal = splitscreenDefaultPosition;
          }
          if (isScale) {
            obj.targetScaleFactor = splitscreenDefaultScaleFactor;
          }
          break;
        case 1:
          if (isPos) {
            obj.targetPosVal = fullscreenDefaultPosition;
          }
          if (isScale) {
            obj.targetScaleFactor = fullscreenDefaultScaleFactor;
          }
          break;
        default:
          throw new Error("Uncaught Transition Type value");
      }
    } catch (undefined) {}
    activeSlideInfo.push(obj);
  }
  switch (activeSlides.length) {
    case 1:
      thisSlide = activeSlides[0];
      if (thisSlide.marker.numKeys > 0) {
        for (idx = k = 1, ref = thisSlide.marker.numKeys; 1 <= ref ? k <= ref : k >= ref; idx = 1 <= ref ? ++k : --k) {
          testMarker = thisSlide.marker.key(idx);
          if (testMarker.comment === "NF In") {
            inMarker = testMarker;
          }
          if (testMarker.comment === "NF Out") {
            outMarker = testMarker;
          }
        }
      }
      if ((inMarker != null) && (thisSlide.inPoint <= time && time < inMarker.time)) {
        isTransitioning = true;
        progress = 1 - easeInOutCubic((time - thisSlide.inPoint) / (inMarker.time - thisSlide.inPoint));
      }
      if ((outMarker != null) && (thisSlide.outPoint >= time && time > outMarker.time)) {
        isTransitioning = true;
        progress = 1 - easeInOutCubic((time - thisSlide.outPoint) / (outMarker.time - thisSlide.outPoint));
      }
      break;
    case 2:
      if (activeSlides[0].inPoint < activeSlides[1].inPoint) {
        slide1 = activeSlides[0];
        slide2 = activeSlides[1];
        slide1Info = activeSlideInfo[0];
        slide2Info = activeSlideInfo[1];
      } else {
        slide1 = activeSlides[1];
        slide2 = activeSlides[0];
        slide1Info = activeSlideInfo[1];
        slide2Info = activeSlideInfo[0];
      }
      if ((slide2.inPoint <= time && time <= slide1.outPoint)) {
        isTransitioning = true;
        progress = 1 - easeInOutCubic((time - slide2.inPoint) / (slide1.outPoint - slide2.inPoint));
      }
      break;
    default:
      throw new Error("Too many slides active at same time");
  }
  if (isTransitioning) {
    if (activeSlides.length === 1) {
      if (isPos) {
        deltaX = value[0] - activeSlideInfo[0].targetPosVal[0];
        deltaY = value[1] - activeSlideInfo[0].targetPosVal[1];
        calcVal = [activeSlideInfo[0].targetPosVal[0] + deltaX * progress, activeSlideInfo[0].targetPosVal[1] + deltaY * progress];
      }
      if (isScale) {
        deltaScale = value[0] - activeSlideInfo[0].targetScaleFactor;
        calcValFactor = activeSlideInfo[0].targetScaleFactor + deltaScale * progress;
        calcVal = [calcValFactor, calcValFactor];
      }
    } else if (activeSlides.length === 2) {
      if (isPos) {
        deltaX = slide1Info.targetPosVal[0] - slide2Info.targetPosVal[0];
        deltaY = slide1Info.targetPosVal[1] - slide2Info.targetPosVal[1];
        calcVal = [slide2Info.targetPosVal[0] + deltaX * progress, slide2Info.targetPosVal[1] + deltaY * progress];
      }
      if (isScale) {
        deltaScale = slide1Info.targetScaleFactor - slide2Info.targetScaleFactor;
        calcValFactor = slide2Info.targetScaleFactor + deltaScale * progress;
        calcVal = [calcValFactor, calcValFactor];
      }
    }
  } else {
    if (isPos) {
      calcVal = activeSlideInfo[0].targetPosVal;
    } else if (isScale) {
      calcVal = [activeSlideInfo[0].targetScaleFactor, activeSlideInfo[0].targetScaleFactor];
    }
  }
}

if (calcVal != null) {
  calcVal;
} else {
  value;
};
