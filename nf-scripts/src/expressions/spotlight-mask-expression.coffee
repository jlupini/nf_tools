targetPage = 'TARGET_PAGE'
highlightComp = comp('COMP_NAME')
highlightLayer = highlightComp.layer('HIGHLIGHT_LAYER_NAME')
controlLayerEffect = highlightLayer.effect('AV_Highlighter')

# Get our matching page layer
activeBabby = null

# DO NOT EDIT ABOVE THIS LINE - It will break the update expressions tool
numLayers = thisComp.numLayers
i = 1
while i <= numLayers
  theLayer = thisComp.layer(i)
  if theLayer.name.indexOf(targetPage) >= 0 and theLayer.inPoint < time and time < theLayer.outPoint
    activeBabby = theLayer
    break
  i++
if activeBabby == null
  ori = [0, 0]
  createPath points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true
else
  rect = highlightLayer.sourceRectAtTime(highlightComp.duration)
  lt = [rect.left, rect.top]
  lb = [rect.left, rect.top + rect.height]
  rt = [rect.left + rect.width, rect.top]
  rb = [rect.left + rect.width, rect.top + rect.height]

  lt = activeBabby.toComp(highlightLayer.toComp(lt))
  lb = activeBabby.toComp(highlightLayer.toComp(lb))
  rt = activeBabby.toComp(highlightLayer.toComp(rt))
  rb = activeBabby.toComp(highlightLayer.toComp(rb))

  # Add a buffer above and below based on the thickness
  adj = controlLayerEffect('Thickness').value / 2
  lt = [lt[0], lt[1] - adj]
  lb = [lb[0], lb[1] + adj]
  rt = [rt[0], rt[1] - adj]
  rb = [rb[0], rb[1] + adj]

  createPath points = [lt, rt, rb, lb], inTangents = [], outTangents = [], is_closed = true
