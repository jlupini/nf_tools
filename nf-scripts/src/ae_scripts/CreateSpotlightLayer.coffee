`#include "runtimeLibraries.jsx"`

NF = app.NF
_ =
  mainComp: app.project.activeItem
  spotlightColor: [0.0078, 0, 0.1216]
  initialSpotlightStartOffset: -2
  initialSpotlightLength: 7

askForChoice = ->
  selectedLayer = _.mainComp.selectedLayers[0]
  w = new Window('dialog', 'Add Spotlight')
  w.alignChildren = 'left'

  w.grp1 = w.add 'panel', undefined, 'Create Spotlight from Mask', {borderStyle:'none'}
  w.grp1.alignChildren = 'left'
  w.grp1.margins.top = 16

  useNewMaskButton = w.grp1.add "button", undefined, "Latest Mask on Selected Layer"
  useNewMaskButton.onClick = getOnClickFunction null, null, w

  highlightRects = NF.Util.sourceRectsForHighlightsInTargetLayer selectedLayer
  if highlightRects?
    
    w.grp2 = w.add 'panel', undefined, 'Create Spotlight from Highlight', {borderStyle:'none'}
    w.grp2.alignChildren = 'left'
    w.grp2.margins.top = 16

    useAllHighlightsButton = w.grp2.add 'button', undefined, "All Active Highlights"
    useAllHighlightsButton.onClick = getOnClickFunction NF.Util.toKeys(highlightRects), highlightRects, w, true

    w.grp3 = w.grp2.add 'group', undefined, undefined, undefined
    w.grp3.alignChildren = 'left'
    w.grp3.orientation = 'column'

    for highlightRect of highlightRects
      radioButton = w.grp3.add 'checkbox', undefined, NF.Util.capitalizeFirstLetter(highlightRect)

    useSelectedHighlightsButton = w.grp2.add 'button', undefined, "Selected Highlights"
    useSelectedHighlightsButton.onClick = getOnClickFunction NF.Util.toKeys(highlightRects), highlightRects, w, true, w.grp3.children

  cancelButton = w.add('button', undefined, 'Cancel', name: 'cancel')

  cancelButton.onClick = ->
    w.close()
    return

  w.show()

# FIXME: The way this function takes in arguments is ridiculous. Combine sourceRect, multiple, and choices
getOnClickFunction = (name, sourceRect, w, multiple = false, choices = null) ->
  ->
    rectKeys = NF.Util.toKeys sourceRect if choices?
    if multiple
      for theRect of sourceRect
        if choices?
          thisIndex = rectKeys.indexOf theRect
          createSpotlightLayer theRect, sourceRect[theRect] if choices[thisIndex].value
        else
          createSpotlightLayer theRect, sourceRect[theRect]
    else
      createSpotlightLayer name, sourceRect
    w.hide()
    false

createSpotlightLayer = (sourceHighlightName, sourceHighlightRect) ->
  targetLayer = _.mainComp.selectedLayers[0]
  if targetLayer instanceof ShapeLayer or targetLayer.nullLayer or (targetLayer.source instanceof FootageItem and targetLayer.source.mainSource instanceof SolidSource)
    alert "Error\nPlease select the correct source layer\nDid you draw the mask on the existing spotlight layer by mistake?"
  spotlightName = spotlightNameForLayer(targetLayer)
  spotlightLayer = _.mainComp.layers.byName(spotlightName)

  if not spotlightLayer?

    # create new solid
    spotlightSolidProperties =
      color: _.spotlightColor
      name: spotlightName
      width: targetLayer.width
      height: targetLayer.height
      pixelAspect: 1
      layerAfter: targetLayer
      motionBlur: yes
      startTime: targetLayer.inPoint
    spotlightLayer = newSolid spotlightSolidProperties
    matchTransformAndParent spotlightLayer, targetLayer

  if spotlightLayer.mask.numProperties is 0
    dummyMask = spotlightLayer.mask.addProperty('ADBE Mask Atom')

  # Going for the highlights
  if sourceHighlightName? and sourceHighlightRect?

    # Check if we have a highlight Dupe
    spotlightLayerMaskName = spotlightName + " - " + sourceHighlightName
    if _.mainComp.layer(spotlightLayerMaskName)?
      alert("Skipping duplicate of spotlight:\n'#{spotlightLayerMaskName}'")
      return

    spotlightLayerMask = spotlightLayer.mask.addProperty "Mask"
    spotlightMaskShape = spotlightLayerMask.property "maskShape"
    newShape = spotlightMaskShape.value
    newShape.vertices = NF.Util.verticiesFromSourceRect sourceHighlightRect
    newShape.closed = true
    spotlightMaskShape.setValue newShape
    spotlightLayerMask.maskMode = MaskMode.SUBTRACT
    spotlightLayerMask.maskExpansion.setValue sourceHighlightRect.padding
    spotlightLayerMask.name = spotlightLayerMaskName
  else
    spotlightLayerMask = moveLatestMaskToSpotlightLayer spotlightLayer, targetLayer
    spotlightLayerMask.name = spotlightName + " - " + (spotlightLayer.mask.numProperties - 1)

  spotlightLayer.selected = no

  # Create Span layer
  spanSolidProperties =
    color: [0,0,1]
    width: targetLayer.width
    height: targetLayer.height
    name: spotlightLayerMask.name
    layerAfter: spotlightLayer
    enabled: no
    startTime: _.mainComp.time + _.initialSpotlightStartOffset
    outPoint: _.mainComp.time + _.initialSpotlightStartOffset + _.initialSpotlightLength
  spanLayer = newSolid spanSolidProperties
  matchTransformAndParent spanLayer, spotlightLayer

  # Create layer Controls
  effects = spanLayer.Effects
  spotlightControl = effects.addProperty "AV_Spotlight"

  # Copy spotlight mask to span layer and use span mask as source
  spanMask = spanLayer.property('Masks').addProperty('Mask')
  spanMaskPath = spanMask.property('Mask Path')
  spanMaskPath.setValue spotlightLayerMask.property('Mask Path').value
  spotlightLayerMask.property('Mask Path').expression = "thisComp.layer(\"#{spanLayer.name}\").mask(1).maskPath"

  # Create expressions on span and spotlight layer
  # FIXME: Need to update the expressions of ALL spanlayers based on new children
  children = childrenOfSpotlight(spotlightLayer)
  spotlightLayer.transform.opacity.expression = layerOpacityExpression targetLayer, spotlightLayer, spotlightControl, spanLayer, children.string

  for childSpan in children.array
    childSpan.mask(1).maskFeather.expression = featherExpression targetLayer, spotlightLayer, spotlightControl, spanLayer, children.string
    childSpan.mask(1).maskOpacity.expression = spotlightLayerMaskExpression targetLayer, spotlightLayer, spotlightControl, spanLayer, children.string

  spotlightLayerMask.maskFeather.expression = "thisComp.layer(\"#{spanLayer.name}\").mask(1).maskFeather"
  spotlightLayerMask.maskOpacity.expression = "thisComp.layer(\"#{spanLayer.name}\").mask(1).maskOpacity"

  spanLayer.selected = no
  targetLayer.selected = yes

  return

# FIXME: Stop spotlights from fading up and down mask opacity if they're the first or last in a block
#        You'll want to port the activeBabbies and Block stuff from the spotlight layerOpacityExpression stuff below
spotlightLayerMaskExpression = (targetLayer, spotlightLayer, spotlightControl, spanLayer, children) ->
  trimString = "var activeBabbies, d, endOfBlock, i, o, startOfBlock, theLayer, children, inLayer, outLayer;

                activeBabbies = [];
                children = #{children};

                for (i = 0; i < children.length; i++) {

                  theLayer = thisComp.layer(children[i]);

                  if (theLayer.inPoint <= time && theLayer.outPoint > time) {
                    activeBabbies.push(theLayer);
                  }
                }

                if (activeBabbies.length > 0) {

                  startOfBlock = activeBabbies[0].inPoint;
                  inLayer = activeBabbies[0];
                  endOfBlock = activeBabbies[0].outPoint;
                  outLayer = activeBabbies[0];
                  for (i = 1; i < activeBabbies.length; i++) {
                    if (activeBabbies[i].inPoint < startOfBlock) {
                      startOfBlock = activeBabbies[i].inPoint;
                      inLayer = activeBabbies[i];
                    }
                    if (activeBabbies[i].outPoint > endOfBlock) {
                      endOfBlock = activeBabbies[i].outPoint;
                      outLayer = activeBabbies[i];
                    }
                  }

                  d = thisLayer.effect(\"#{spotlightControl.name}\")(\"Duration\");
                  spotIn = thisLayer.inPoint;
                  spotOut = thisLayer.outPoint;

                  // If this layer is the opening of a block, don't fade in \n
                  if ((thisLayer.index == inLayer.index || thisLayer.inPoint == inLayer.inPoint) && (time < (spotIn+spotOut)/2)) {
                    100
                  } else if (time < (spotIn+spotOut)/2) {
                    ease(time,spotIn,spotIn + d * thisComp.frameDuration,0,100)
                  } else if (thisLayer.index == outLayer.index) {
                    100
                  } else {
                    ease(time,spotOut - d * thisComp.frameDuration,spotOut,100,0)
                  }
                } else {
                  0
                }"
  # trimString = "if (thisComp.layer(\"#{spanLayer.name}\")){
  #                 d = thisComp.layer(\"#{spanLayer.name}\").effect(\"#{spotlightControl.name}\")(\"Duration\");

  #                 spotIn = thisComp.layer(\"#{spanLayer.name}\").inPoint;
  #                 spotOut = thisComp.layer(\"#{spanLayer.name}\").outPoint;

  #                 if (time < (spotIn+spotOut)/2) {
  #                   ease(time,spotIn,spotIn + d * thisComp.frameDuration,0,100)
  #                 } else {
  #                   ease(time,spotOut - d * thisComp.frameDuration,spotOut,100,0)
  #                 }
  #               } else {
  #                 0;
  #               }"

layerOpacityExpression = (targetLayer, spotlightLayer, spotlightControl, spanLayer, children) ->
  # FIXME: add edge case where layers just slightly overlap and we switch from the easeOut of one to the easeIn of another very suddenly
  trimString = "var activeBabbies, d, endOfBlock, i, o, startOfBlock, theLayer, children, inLayer, outLayer;

                activeBabbies = [];
                children = #{children};

                for (i = 0; i < children.length; i++) {

                  theLayer = thisComp.layer(children[i]);

                  if (theLayer.inPoint <= time && theLayer.outPoint > time) {
                    activeBabbies.push(theLayer);
                  }
                }

                if (activeBabbies.length > 0) {

                  startOfBlock = activeBabbies[0].inPoint;
                  inLayer = activeBabbies[0];
                  endOfBlock = activeBabbies[0].outPoint;
                  outLayer = activeBabbies[0];
                  for (i = 1; i < activeBabbies.length; i++) {
                    if (activeBabbies[i].inPoint < startOfBlock) {
                      startOfBlock = activeBabbies[i].inPoint;
                      inLayer = activeBabbies[i];
                    }
                    if (activeBabbies[i].outPoint > endOfBlock) {
                      endOfBlock = activeBabbies[i].outPoint;
                      outLayer = activeBabbies[i];
                    }
                  }

                  oIn = inLayer.effect(\"#{spotlightControl.name}\")(\"Opacity\");
                  dIn = inLayer.effect(\"#{spotlightControl.name}\")(\"Duration\");
                  oOut = outLayer.effect(\"#{spotlightControl.name}\")(\"Opacity\");
                  dOut = outLayer.effect(\"#{spotlightControl.name}\")(\"Duration\");

                  if (time < (endOfBlock + startOfBlock) / 2) {
                    ease(time, startOfBlock, startOfBlock + dIn * thisComp.frameDuration, 0, oIn);
                  } else {
                    ease(time, endOfBlock - dOut * thisComp.frameDuration, endOfBlock, oOut, 0);
                  }
                } else {
                  0
                }"

featherExpression = (targetLayer, spotlightLayer, spotlightControl, spanLayer, children) ->
  trimString = "var activeBabbies, d, endOfBlock, i, o, startOfBlock, theLayer, children, inLayer, outLayer;

                activeBabbies = [];
                children = #{children};

                for (i = 0; i < children.length; i++) {

                  theLayer = thisComp.layer(children[i]);

                  if (theLayer.inPoint <= time && theLayer.outPoint > time) {
                    activeBabbies.push(theLayer);
                  }
                }

                if (activeBabbies.length > 0) {

                  startOfBlock = activeBabbies[0].inPoint;
                  inLayer = activeBabbies[0];
                  endOfBlock = activeBabbies[0].outPoint;
                  outLayer = activeBabbies[0];
                  for (i = 1; i < activeBabbies.length; i++) {
                    if (activeBabbies[i].inPoint < startOfBlock) {
                      startOfBlock = activeBabbies[i].inPoint;
                      inLayer = activeBabbies[i];
                    }
                    if (activeBabbies[i].outPoint > endOfBlock) {
                      endOfBlock = activeBabbies[i].outPoint;
                      outLayer = activeBabbies[i];
                    }
                  }

                  fIn = inLayer.effect(\"#{spotlightControl.name}\")(\"Feather\");
                  dIn = inLayer.effect(\"#{spotlightControl.name}\")(\"Duration\");
                  fOut = outLayer.effect(\"#{spotlightControl.name}\")(\"Feather\");
                  dOut = outLayer.effect(\"#{spotlightControl.name}\")(\"Duration\");

                  if (time < (endOfBlock + startOfBlock) / 2) {
                    ease(time, startOfBlock, startOfBlock + dIn * thisComp.frameDuration, [300, 300], [fIn, fIn]);
                  } else {
                    ease(time, endOfBlock - dOut * thisComp.frameDuration, endOfBlock, [fOut, fOut], [300, 300]);
                  }
                } else {
                  [300,300]
                }"

childrenOfSpotlight = (spotlightLayer) ->
  allLayers = _.mainComp.layers
  childLayerArrayString = "["
  childLayerArray = []
  i = 1
  while i <= allLayers.length
    theLayer = allLayers[i]
    if theLayer.parent is spotlightLayer
      childLayerArrayString += "\"" + theLayer.name + "\""
      childLayerArray.push theLayer
      if i < allLayers.length
        childLayerArrayString += ","
    i++
  childLayerArrayString += "]"
  returnObject =
    string: childLayerArrayString
    array: childLayerArray

moveLatestMaskToSpotlightLayer = (spotlightLayer, targetLayer) ->
  spotlightMask = targetLayer.mask(targetLayer.mask.numProperties)
  spotlightLayerMask = spotlightLayer.mask.addProperty('ADBE Mask Atom')
  spotlightLayerMask.maskPath.setValue spotlightMask.maskPath.value
  spotlightLayerMask.maskMode = MaskMode.SUBTRACT
  spotlightMask.remove()
  spotlightLayerMask

matchTransformAndParent = (newLayer, targetLayer) ->
  targetParent = targetLayer.parent
  targetLayer.parent = null

  propertiesToCopy = ["rotation", "anchorPoint", "position", "scale"]
  newLayer.transform[property].setValue targetLayer.transform[property].value for property in propertiesToCopy

  targetLayer.parent = targetParent
  newLayer.parent = targetLayer

  newLayer

newSolid = (props) ->
  props =
    color: props.color ? [0,0,0]
    name: props.name ? "New Solid"
    width: props.width ? _.mainComp.width
    height: props.height ? _.mainComp.height
    pixelAspect: props.pixelAspect ? 1
    layerAfter: props.layerAfter ? null
    layerBefore: props.layerBefore ? null
    motionBlur: props.motionBlur ? no
    parent: props.parent ? null
    enabled: false if props.enabled is false
    startTime: props.startTime ? null
    outPoint: props.outPoint ? null
    inPoint: props.inPoint ? null
  newSolidLayer = _.mainComp.layers.addSolid props.color, props.name, props.width, props.height, props.pixelAspect
  newSolidLayer.moveBefore props.layerAfter if props.layerAfter
  newSolidLayer.moveAfter props.layerBefore if props.layerBefore
  newSolidLayer.parent = props.parent if props.parent
  newSolidLayer.startTime = props.startTime if props.startTime
  newSolidLayer.inPoint = props.inPoint if props.inPoint
  newSolidLayer.outPoint = props.outPoint if props.outPoint
  newSolidLayer.enabled = props.enabled if props.enabled is false
  newSolidLayer

spotlightNameForLayer = (targetLayer) ->
  layerName = targetLayer.name
  shortName = layerName.substr(0, layerName.indexOf('.'))
  name = 'Spot - ' + shortName

# Array.indexOf polyfill
if !Array::indexOf

  Array::indexOf = (searchElement, fromIndex) ->
    k = undefined
    if this == null
      throw new TypeError('"this" is null or not defined')
    o = Object(this)
    len = o.length >>> 0
    if len == 0
      return -1
    n = fromIndex | 0
    if n >= len
      return -1
    k = Math.max(if n >= 0 then n else len - Math.abs(n))
    while k < len
      if k of o and o[k] == searchElement
        return k
      k++
    -1

app.beginUndoGroup 'Create Spotlight Layer'
askForChoice()
app.endUndoGroup()