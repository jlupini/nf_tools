var activeBabby, controlLayer, i, numLayers, offsetTime, rightNow, targetComp, targetPage, theLayer;

targetComp = comp('TARGET_COMP_NAME');

controlLayer = targetComp.layer('CONTROL_LAYER_NAME');

targetPage = 'PAGE_BASE_NAME';

activeBabby = null;

numLayers = targetComp.numLayers;

i = 1;

while (i <= numLayers) {
  theLayer = targetComp.layer(i);
  if (theLayer.name.indexOf(targetPage) >= 0) {
    rightNow = theLayer.startTime + time;
    if ((theLayer.inPoint <= rightNow && rightNow <= theLayer.outPoint)) {
      activeBabby = theLayer;
      break;
    }
  }
  i++;
}

if (activeBabby != null) {
  offsetTime = activeBabby.startTime;
} else {
  offsetTime = 0;
}

controlLayer.effect('HIGHLIGHT_NAME')('HIGHLIGHTER_PROPERTY').valueAtTime(time + offsetTime);
