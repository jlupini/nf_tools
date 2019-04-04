var activeBabby, controlLayer, dataArr, dataLayer, dataLayerText, dataString, endIndex, i, j, len, offsetTime, preIndex, rightNow, searchPointString, targetComp, targetPage, theLayer;

targetComp = comp('TARGET_COMP_NAME');

controlLayer = targetComp.layer('CONTROL_LAYER_NAME');

targetPage = 'PAGE_BASE_NAME';

activeBabby = null;

if (thisProperty.name === "Completion") {
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
    if (theLayer.name.indexOf(targetPage) >= 0) {
      rightNow = theLayer.startTime + time;
      if ((theLayer.inPoint <= rightNow && rightNow <= theLayer.outPoint)) {
        activeBabby = theLayer;
        break;
      }
    }
  }
}

if (activeBabby != null) {
  offsetTime = activeBabby.startTime;
} else {
  offsetTime = 0;
}

controlLayer.effect('HIGHLIGHT_NAME')('HIGHLIGHTER_PROPERTY').valueAtTime(time + offsetTime);
