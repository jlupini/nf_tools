targetLayerName = 'TARGET_LAYER_NAME'

targetLayer = thisComp.layer(targetLayerName)

if targetLayer.inPoint <= time <= targetLayer.outPoint

  shape = targetLayer.mask('Mask 1').maskPath
  shapePoints = shape.points()

  lt = targetLayer.toComp(shapePoints[0])
  rt = targetLayer.toComp(shapePoints[1])
  rb = targetLayer.toComp(shapePoints[2])
  lb = targetLayer.toComp(shapePoints[3])

  # lt = [lt[0] - (EDGE_PADDING / 2), lt[1] - (EDGE_PADDING / 4)]
  # rt = [rt[0] + (EDGE_PADDING / 2), rt[1] - (EDGE_PADDING / 4)]
  # rb = [rb[0] + (EDGE_PADDING / 2), rb[1] + (EDGE_PADDING / 4)]
  # lb = [lb[0] - (EDGE_PADDING / 2), lb[1] + (EDGE_PADDING / 4)]

  createPath points = [lt, rt, rb, lb], inTangents = [], outTangents = [], is_closed = true

else
  ori = [0, 0]
  createPath points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true
