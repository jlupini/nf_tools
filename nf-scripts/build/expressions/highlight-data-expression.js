var displayString, i, matchingPageLayers, numLayers, targetComp, targetPage, theLayer;

targetComp = comp('TARGET_COMP_NAME');

targetPage = 'PAGE_BASE_NAME';

if (time === 0) {
  matchingPageLayers = [];
  numLayers = targetComp.numLayers;
  i = 1;
  while (i <= numLayers) {
    theLayer = targetComp.layer(i);
    if (theLayer.name.indexOf(targetPage) >= 0) {
      matchingPageLayers.push(i);
    }
    i++;
  }
  displayString = "allMatchingLayers:[" + (matchingPageLayers.join()) + "]\n";
} else {
  "";
}
