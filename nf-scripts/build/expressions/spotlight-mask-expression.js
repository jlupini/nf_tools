var activeBabby, adj, controlLayerEffect, highlightComp, highlightLayer, i, inTangents, is_closed, lb, lt, numLayers, ori, outTangents, points, rb, rect, rt, targetPage, theLayer;

targetPage = 'TARGET_PAGE';

highlightComp = comp('COMP_NAME');

highlightLayer = highlightComp.layer('HIGHLIGHT_LAYER_NAME');

controlLayerEffect = highlightLayer.effect('AV_Highlighter');

activeBabby = null;

numLayers = thisComp.numLayers;

i = 1;

while (i <= numLayers) {
  theLayer = thisComp.layer(i);
  if (theLayer.name.indexOf(targetPage) >= 0 && theLayer.inPoint < time && time < theLayer.outPoint) {
    activeBabby = theLayer;
  }
  i++;
}

if (activeBabby === null) {
  ori = [0, 0];
  createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);
} else {
  rect = highlightLayer.sourceRectAtTime(highlightComp.duration);
  lt = [rect.left, rect.top];
  lb = [rect.left, rect.top + rect.height];
  rt = [rect.left + rect.width, rect.top];
  rb = [rect.left + rect.width, rect.top + rect.height];
  lt = activeBabby.toComp(highlightLayer.toComp(lt));
  lb = activeBabby.toComp(highlightLayer.toComp(lb));
  rt = activeBabby.toComp(highlightLayer.toComp(rt));
  rb = activeBabby.toComp(highlightLayer.toComp(rb));
  adj = controlLayerEffect('Thickness').value / 2;
  lt = [lt[0], lt[1] - adj];
  lb = [lb[0], lb[1] + adj];
  rt = [rt[0], rt[1] - adj];
  rb = [rb[0], rb[1] + adj];
  createPath(points = [lt, rt, rb, lb], inTangents = [], outTangents = [], is_closed = true);
}
