var activeAtControlIn, activeAtControlOut, activeBabbies, controlIn, controlLayer, controlOut, dataArr, dataLayer, dataLayerText, dataString, duration, endIndex, endless, highlightName, i, j, len, preIndex, progress, relControlIn, relControlOut, relInAnimPeak, relOutAnimPeak, searchPointString, targetComp, targetPage, targetValue, theLayer;

targetComp = comp('TARGET_COMP_NAME');

controlLayer = targetComp.layer('CONTROL_LAYER_NAME');

targetPage = 'PAGE_BASE_NAME';

highlightName = 'HIGHLIGHT_NAME';

controlIn = controlLayer.inPoint;

controlOut = controlLayer.outPoint;

endless = controlLayer.effect('Highlight Control')('Endless').value === 1;

duration = controlLayer.effect('Highlight Control')('Opacity Duration').value;

targetValue = controlLayer.effect(highlightName)("Opacity").value;

activeBabbies = [];

dataLayer = thisComp.layer("HighData-" + targetComp.name);

dataLayerText = dataLayer("Text")("Source Text").valueAtTime(0);

searchPointString = "allMatchingLayers:[";

preIndex = dataLayerText.indexOf(searchPointString);

endIndex = preIndex + dataLayerText.substring(preIndex).indexOf("]");

dataString = dataLayerText.substring(preIndex + searchPointString.length, endIndex);

dataArr = dataString.split(",");

for (j = 0, len = dataArr.length; j < len; j++) {
  i = dataArr[j];
  theLayer = targetComp.layer(parseInt(i));
  if (theLayer.name.indexOf(targetPage) === 0) {
    activeBabbies.push(theLayer);
    if ((theLayer.inPoint < controlIn && controlIn < theLayer.outPoint)) {
      activeAtControlIn = theLayer;
    }
    if ((theLayer.inPoint < controlOut && controlOut < theLayer.outPoint)) {
      activeAtControlOut = theLayer;
    }
  }
}

if (activeAtControlIn == null) {
  activeAtControlIn = activeBabbies[0];
  i = 0;
  while (i < activeBabbies.length) {
    if (activeBabbies[i].inPoint < activeAtControlIn.inPoint) {
      activeAtControlIn = activeBabbies[i];
    }
    i++;
  }
}

if (activeAtControlOut == null) {
  activeAtControlOut = activeBabbies[0];
  i = 0;
  while (i < activeBabbies.length) {
    if (activeBabbies[i].inPoint < activeAtControlOut.outPoint) {
      activeAtControlOut = activeBabbies[i];
    }
    i++;
  }
}

relControlIn = controlIn - activeAtControlIn.startTime;

relControlOut = controlOut - activeAtControlOut.startTime;

relInAnimPeak = relControlIn + duration;

relOutAnimPeak = relControlOut - duration;

if (time <= relControlIn) {
  0;
} else if ((relControlIn < time && time < relInAnimPeak)) {
  progress = time - relControlIn;
  progress / duration * targetValue;
} else {
  if (endless || time <= relOutAnimPeak) {
    targetValue;
  } else if ((relOutAnimPeak < time && time < relControlOut)) {
    progress = time - relOutAnimPeak;
    (1 - (progress / duration)) * targetValue;
  } else {
    0;
  }
}
