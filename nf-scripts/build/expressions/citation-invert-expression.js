var duration, i, numLayers, progress, targetGaussy, theLayer;

duration = INVERT_DURATION;

numLayers = thisComp.numLayers;

i = 1;

while (i <= numLayers) {
  theLayer = thisComp.layer(i);
  if (theLayer.name.indexOf("Gaussy") >= 0 && (theLayer.inPoint < time && time < theLayer.outPoint)) {
    targetGaussy = theLayer;
    i = numLayers;
  }
  i++;
}

if (targetGaussy == null) {
  100;
} else if ((targetGaussy.inPoint <= time && time < targetGaussy.inPoint + duration)) {
  progress = time - targetGaussy.inPoint;
  100 - (progress / duration * 100);
} else if ((targetGaussy.inPoint + duration <= time && time < targetGaussy.outPoint - duration)) {
  0;
} else if ((targetGaussy.outPoint - duration <= time && time < targetGaussy.outPoint)) {
  progress = targetGaussy.outPoint - time;
  100 - (progress / duration * 100);
} else {
  100;
}
