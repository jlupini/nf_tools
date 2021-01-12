targetLayerName = "25_pg01 [ref] <Green Highlighter> {a}"#'TARGET_LAYER_NAME'
sourceLayerName = "25_pg01 [+]" #'SOURCE_LAYER_NAME'
shapeLayerName = "Green Highlighter"#'SHAPE_LAYER_NAME'
maskExpansion = 26 #MASK_EXPANSION
# edgePadding = 0#'EDGE_PADDING'

targetLayer = thisComp.layer targetLayerName
sourceLayer = thisComp.layer sourceLayerName
sourceComp = sourceLayer.source
shapeLayer = sourceComp.layer shapeLayerName

highlighterEffect = shapeLayer.effect('AV_Highlighter')

if targetLayer.inPoint <= time <= targetLayer.outPoint

  vShapeAdj = 0
  if highlighterEffect?
    thickness = highlighterEffect('Thickness').value
    vShapeAdj = thickness / 2

  # Let's get the source rect for the HIGHLIGHT OR SHAPE (expose)
  shapeRect = shapeLayer.sourceRectAtTime(sourceComp.duration)
  shapePoints =
    lt: sourceLayer.toComp shapeLayer.toComp [shapeRect.left, shapeRect.top - vShapeAdj]
    lb: sourceLayer.toComp shapeLayer.toComp [shapeRect.left, shapeRect.top + shapeRect.height + vShapeAdj]
    rt: sourceLayer.toComp shapeLayer.toComp [shapeRect.left + shapeRect.width, shapeRect.top - vShapeAdj]
    rb: sourceLayer.toComp shapeLayer.toComp [shapeRect.left + shapeRect.width, shapeRect.top + shapeRect.height + vShapeAdj]

  # Let's get the shape of the mask for the expose
  exposeMask = targetLayer.mask('Mask 1').maskPath
  maskPointSource = exposeMask.points()
  maskPoints =
    lt: targetLayer.toComp [maskPointSource[0][0] - maskExpansion, maskPointSource[0][1] - maskExpansion]
    rt: targetLayer.toComp [maskPointSource[1][0] + maskExpansion, maskPointSource[1][1] - maskExpansion]
    rb: targetLayer.toComp [maskPointSource[2][0] + maskExpansion, maskPointSource[2][1] + maskExpansion]
    lb: targetLayer.toComp [maskPointSource[3][0] - maskExpansion, maskPointSource[3][1] + maskExpansion]

  # lt2 = [lt2[0] - (edgePadding / 2), lt2[1] - (edgePadding / 3)]
  # rt2 = [rt2[0] + (edgePadding / 2), rt2[1] - (edgePadding / 3)]
  # rb2 = [rb2[0] + (edgePadding / 2), rb2[1] + (edgePadding / 3)]
  # lb2 = [lb2[0] - (edgePadding / 2), lb2[1] + (edgePadding / 3)]

  flightPathShape = [
    maskPoints.lb, maskPoints.lt, maskPoints.rt,
    shapePoints.rt, shapePoints.rb, shapePoints.lb
  ]

  createPath points = flightPathShape, inTangents = [], outTangents = [], is_closed = true

else
  ori = [0, 0]
  createPath points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true
