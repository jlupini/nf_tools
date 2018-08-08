var activeAtControlIn, activeAtControlOut, activeBabbies, controlIn, controlLayer, controlOut, duration, endless, highlightName, i, numLayers, progress, relAnimEnd, relAnimStart, relControlIn, relControlOut, targetComp, targetPage, targetValue, theLayer;

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

numLayers = targetComp.numLayers;

i = 1;

while (i <= numLayers) {
  theLayer = targetComp.layer(i);
  if (theLayer.name.indexOf(targetPage) >= 0) {
    activeBabbies.push(theLayer);
    if (theLayer.inPoint < controlIn && controlIn < theLayer.outPoint) {
      activeAtControlIn = theLayer;
    }
    if (theLayer.inPoint < controlOut && controlOut < theLayer.outPoint) {
      activeAtControlOut = theLayer;
    }
  }
  i++;
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

relAnimStart = relControlIn - duration;

relAnimEnd = relControlOut + duration;

if (time <= relAnimStart) {
  0;
} else if (relAnimStart < time && time < relControlIn) {
  progress = time - relAnimStart;
  progress / duration * targetValue;
} else {
  if (endless || time <= relControlOut) {
    targetValue;
  } else if (relControlOut < time && time < relAnimEnd) {
    progress = time - relControlOut;
    (1 - (progress / duration)) * targetValue;
  } else {
    0;
  }
}
