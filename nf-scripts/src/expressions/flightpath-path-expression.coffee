targetLayerName = 'TARGET_LAYER_NAME'
sourceLayerName = 'SOURCE_LAYER_NAME'
shapeLayerName = 'SHAPE_LAYER_NAME'

targetLayer = thisComp.layer targetLayerName
sourceLayer = thisComp.layer sourceLayerName
sourceComp = sourceLayer.source
shapeLayer = sourceComp.layer shapeLayerName
maskExpansion = thisLayer.mask('Mask 1').maskExpansion.value
expandTimingOffset = thisLayer.effect("Expand Transition Timing Offset")("Slider").value

try
  highlighterEffect = shapeLayer.effect('AV_Highlighter')
catch error
  highlighterEffect = null

# Rect functions
maxX = (rect) ->
  return rect.left + rect.width
maxY = (rect) ->
  return rect.top + rect.height
combineRects = (rect1, rect2) ->
  left: Math.min(rect1.left, rect2.left)
  top: Math.min(rect1.top, rect2.top)
  width: Math.max(maxX(rect1), maxX(rect2)) - Math.min(rect1.left, rect2.left)
  height: Math.max(maxY(rect1), maxY(rect2)) - Math.min(rect1.top, rect2.top)
rectToComp = (rect1, layer1, vPad) ->
  tl = layer1.toComp [rect1.left, rect1.top - vPad]
  br = layer1.toComp [rect1.left + rect1.width, rect1.top + rect1.height + vPad]

  retObj =
    left: tl[0]
    top: tl[1]
    width: br[0] - tl[0]
    height: br[1] - tl[1]

easeInOutCubic = (t) ->
  if t < 0.5 then 4*t*t*t else (t-1)*(2*t-2)*(2*t-2)+1
tweenRects = (rect1, rect2, position) ->
  deltaL = rect2.left - rect1.left
  deltaT = rect2.top - rect1.top
  deltaW = rect2.width - rect1.width
  deltaH = rect2.height - rect1.height
  easedPos = easeInOutCubic(position)

  retObj =
    left: rect1.left + (deltaL * easedPos)
    top: rect1.top + (deltaT * easedPos)
    width: rect1.width + (deltaW * easedPos)
    height: rect1.height + (deltaH * easedPos)

vShapeAdj = 0
if highlighterEffect?
  thickness = highlighterEffect('Thickness').value
  vShapeAdj = thickness / 2

# Main Math
if targetLayer.inPoint <= time <= targetLayer.outPoint

  # Let's get the source rect for the HIGHLIGHT OR SHAPE (expose)
  defaultShapeRect = rectToComp(shapeLayer.sourceRectAtTime(sourceComp.duration), shapeLayer, vShapeAdj)

  # Grab any Expands
  effectCount = thisLayer("ADBE Effect Parade").numProperties
  # allExpands = []
  preTransitionExpands = []
  postTransitionExpands = []
  if effectCount isnt 0
    for i in [1..effectCount]
      currentEffect = thisLayer.effect(i)
      if currentEffect.name.indexOf('Expand Tracker') isnt -1
        controlLayer = currentEffect("Layer")
        # if controlLayer.inPoint <= time <= controlLayer.outPoint
        expShapeLayerName = controlLayer.effect("AV_Highlighter").name
        expShapeLayer = sourceComp.layer expShapeLayerName
        expShapeLayerRect = expShapeLayer.sourceRectAtTime(sourceComp.duration)
        exp =
          rect: rectToComp(expShapeLayerRect, expShapeLayer, vShapeAdj)
          inPoint: controlLayer.inPoint
        if time - expandTimingOffset > exp.inPoint
          if time - expandTimingOffset > exp.inPoint + 1
            preTransitionExpands.push exp
          else
            postTransitionExpands.push exp
            transitionProgress = time - expandTimingOffset - exp.inPoint

  if preTransitionExpands.length > 0
    for exp in preTransitionExpands
      if preTransitionShapeRect?
        preTransitionShapeRect = combineRects preTransitionShapeRect, exp.rect
      else preTransitionShapeRect = exp.rect
    preTransitionShapeRect = combineRects preTransitionShapeRect, defaultShapeRect
  if postTransitionExpands.length > 0
    for exp in postTransitionExpands
      if postTransitionShapeRect?
        postTransitionShapeRect = combineRects postTransitionShapeRect, exp.rect
      else postTransitionShapeRect = exp.rect
    postTransitionShapeRect = combineRects postTransitionShapeRect, defaultShapeRect

  if preTransitionShapeRect? and postTransitionShapeRect?
    shapeRect = tweenRects preTransitionShapeRect, postTransitionShapeRect, transitionProgress
  else if postTransitionShapeRect and not preTransitionShapeRect
    shapeRect = tweenRects defaultShapeRect, postTransitionShapeRect, transitionProgress
  else if preTransitionShapeRect and not postTransitionShapeRect?
    shapeRect = preTransitionShapeRect
  else shapeRect = defaultShapeRect

  # shapeRect = if expandRect? then combineRects(expandRect, defaultShapeRect) else defaultShapeRect
  shapePoints =
    lt: sourceLayer.toComp([shapeRect.left, shapeRect.top])
    lb: sourceLayer.toComp([shapeRect.left, shapeRect.top + shapeRect.height])
    rt: sourceLayer.toComp([shapeRect.left + shapeRect.width, shapeRect.top])
    rb: sourceLayer.toComp([shapeRect.left + shapeRect.width, shapeRect.top + shapeRect.height])

  shapeHeight = shapePoints.lb[1] - shapePoints.lt[1]
  shapeOffset = Math.min(0.75 * maskExpansion, shapeHeight / 2)

  shapePoints =
    lt: [ shapePoints.lt[0] + shapeOffset, shapePoints.lt[1] + shapeOffset ]
    lb: [ shapePoints.lb[0] + shapeOffset, shapePoints.lb[1] - shapeOffset ]
    rt: [ shapePoints.rt[0] - shapeOffset, shapePoints.rt[1] + shapeOffset ]
    rb: [ shapePoints.rb[0] - shapeOffset, shapePoints.rb[1] - shapeOffset ]

  # Let's get the shape of the mask for the expose
  exposeMask = targetLayer.mask('Mask 1').maskPath
  maskPointSource = exposeMask.points()
  maskPoints =
    lt: targetLayer.toComp maskPointSource[0]
    rt: targetLayer.toComp maskPointSource[1]
    rb: targetLayer.toComp maskPointSource[2]
    lb: targetLayer.toComp maskPointSource[3]

  flightPathShape = []

  if maskPoints.lb[1] <= shapePoints.lb[1]
    flightPathShape = [
      maskPoints.lb, maskPoints.lt, maskPoints.rt,
      shapePoints.rt, shapePoints.rb, shapePoints.lb
    ]
  else if maskPoints.lt[1] >= shapePoints.lt[1]
    flightPathShape = [
      maskPoints.lt, maskPoints.lb, maskPoints.rb,
      shapePoints.rb, shapePoints.rt, shapePoints.lt
    ]
  else
    flightPathShape = [
      maskPoints.rb, maskPoints.lb, maskPoints.lt, maskPoints.rt,
      shapePoints.rt, shapePoints.rb
    ]

  createPath points = flightPathShape, inTangents = [], outTangents = [], is_closed = true

else
  ori = [0, 0]
  createPath points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true
