targetPage = 'TARGET_PAGE' #'20_pg03'
highlightLayer = comp('COMP_NAME').layer('HIGHLIGHT_LAYER_NAME') #comp('20_pg03 NFPage').layer('Orange')
controlLayerEffect = thisComp.layer('HIGHLIGHT_CONTROL_LAYER_NAME').effect('HIGHLIGHT_CONTROL_HIGHLIGHT_EFFECT_NAME') #thisComp.layer('20 - Orange Highlight Control').effect('Orange')

# Get our matching page layer
activeBabby = null
numLayers = thisComp.numLayers
i = 1
while i <= numLayers
  theLayer = thisComp.layer(i)
  if theLayer.name.indexOf(targetPage) >= 0 and theLayer.inPoint < time and time < theLayer.outPoint
    activeBabby = theLayer
  i++
if activeBabby == null
  ori = [0, 0]
  createPath points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true
else
  rect = highlightLayer.sourceRectAtTime(time)
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
