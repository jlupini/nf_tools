`#include "nf_functions.jsx"`

importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Go To Highlight'
	highlightWidthPercent: 85
	easeType: KeyframeInterpolationType.BEZIER
	easeWeight: 33
	maxPageScale: 130
	defaultOptions:
		movePageLayer: no
		makeInKeyframe: yes
		moveOnly: no
		duration: 2
nf = Object.assign importedFunctions, globals

goToHighlight = (highlight, options) ->
	options =
		movePageLayer: options.movePageLayer ? nf.defaultOptions.movePageLayer
		makeInKeyframe: options.makeInKeyframe ? nf.defaultOptions.makeInKeyframe
		moveOnly: options.moveOnly ? nf.defaultOptions.moveOnly
		duration: options.duration ? nf.defaultOptions.duration

	selectedLayer = nf.mainComp.selectedLayers[0]
	highlightPageLayer = selectedLayer # FIXME: This will change once we support selecting the parent and moving ALL highlights in child pages
	layerToMove = if options.movePageLayer then selectedLayer else nf.pageParent(selectedLayer)

	return alert "No Layer Parent Found!" if not layerToMove?

	positionProp = layerToMove.transform.position
	scaleProp = layerToMove.transform.scale

	previousParent = layerToMove.parent if layerToMove.parent?
	layerToMove.parent = null

	now = nf.mainComp.time
	if options.makeInKeyframe

		keyframeTimes = [now, now + options.duration]

		targetScaleFactor = getTargetScaleFactor highlight, scaleProp.value, highlightPageLayer
		targetScale = getTargetScaleUsingFactor scaleProp.value, targetScaleFactor
		scaleProp.setValuesAtTimes keyframeTimes, [scaleProp.valueAtTime(now, false), targetScale]
		nf.setSymmetricalTemporalEasingOnlyForProperties scaleProp, keyframeTimes, nf.easeType, nf.easeWeight, true

		# Now that we've set the scale, we can get the location of the highlighter at that scale
		targetPosition = getTargetPosition highlight, positionProp.value, highlightPageLayer, keyframeTimes[1]
		positionProp.setValuesAtTimes keyframeTimes, [positionProp.valueAtTime(now, false), targetPosition]
		nf.setSymmetricalTemporalEasingOnlyForProperties positionProp, keyframeTimes, nf.easeType, nf.easeWeight, true

	else if options.moveOnly
		# Delete any Keyframes
		didRemoveKeys = false
		while positionProp.numKeys != 0
			didRemoveKeys = true
			positionProp.removeKey 1
		while scaleProp.numKeys != 0
			didRemoveKeys = true
			scaleProp.removeKey 1
		if didRemoveKeys
			alert "Warning: The options you selected have caused the removal of one or more keyframes from the target layer. This is probably because you chose 'No Keyframes'."

		targetScaleFactor = getTargetScaleFactor highlight, scaleProp.value, highlightPageLayer
		targetScale = getTargetScaleUsingFactor scaleProp.value, targetScaleFactor
		scaleProp.setValue targetScale
		targetPosition = getTargetPosition highlight, positionProp.value, highlightPageLayer
		positionProp.setValue targetPosition
	else
		targetScaleFactor = getTargetScaleFactor highlight, scaleProp.value, highlightPageLayer
		targetScale = getTargetScaleUsingFactor scaleProp.value, targetScaleFactor
		scaleProp.setValueAtTime now, targetScale
		targetPosition = getTargetPosition highlight, positionProp.value, highlightPageLayer
		positionProp.setValueAtTime now, targetPosition

		nf.setSymmetricalTemporalEasingOnlyForProperties [positionProp, scaleProp], nf.mainComp.time, nf.easeType, nf.easeWeight, true

	layerToMove.parent = previousParent if previousParent?
	selectedLayer.selected = yes

absoluteScaleOfLayer = (layer) ->
	layerParent = layer.parent
	layer.parent = null
	absoluteScale = layer.transform.scale.value
	layer.parent = layerParent
	absoluteScale
	
getTargetPosition = (highlight, layerPosition, highlightPageLayer, targetTime = null) ->
	highlightCenterPoint = nf.pointRelativeToComp [highlight.left + highlight.width / 2, highlight.top + highlight.height / 2], highlightPageLayer, targetTime
	compCenterPoint = [nf.mainComp.width / 2, nf.mainComp.height / 2]
	delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]]
	targetPosition = [layerPosition[0] + delta[0], layerPosition[1] + delta[1]]
	# FIXME: Don't let us land off the page
	targetPosition

getTargetScaleUsingFactor = (initialScale, scaleFactor) ->
	newScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor]

getTargetScaleFactor = (highlight, layerScale, highlightPageLayer, targetTime = null) ->
	highlightRectInContext = nf.rectRelativeToComp highlight, highlightPageLayer, targetTime
	compWidth = nf.mainComp.width
	targetHighlightWidth = nf.highlightWidthPercent / 100 * compWidth
	scaleFactor = targetHighlightWidth / highlightRectInContext.width

	# Adjust for max page scale
	absoluteScale = absoluteScaleOfLayer highlightPageLayer
	adjustedScaleFactor = if scaleFactor * absoluteScale[0] > nf.maxPageScale then nf.maxPageScale / absoluteScale[0] else scaleFactor

askForChoice = ->
	selectedLayer = nf.mainComp.selectedLayers[0]
	w = new Window('dialog', 'Go To Highlight')
	w.alignChildren = 'left'

	w.grp1 = w.add 'panel', undefined, 'Options', {borderStyle:'none'}
	w.grp1.alignChildren = 'left'
	w.grp1.margins.top = 16

	w.grp1.durGroup = w.grp1.add 'panel', undefined, 'Duration and Size'
	w.grp1.durGroup.orientation = 'row'
	durationLabel = w.grp1.durGroup.add 'statictext {text: "Duration (seconds):", characters: 15, justify: "left"}'
	durationValue = w.grp1.durGroup.add 'edittext', undefined, 2
	durationValue.characters = 3
	widthLabel = w.grp1.durGroup.add 'statictext {text: "Width (% of window):", characters: 16, justify: "left"}'
	widthValue = w.grp1.durGroup.add 'edittext', undefined, nf.highlightWidthPercent
	widthValue.characters = 3
	maxScaleLabel = w.grp1.durGroup.add 'statictext {text: "Max Scale (%):", characters: 11, justify: "left"}'
	maxScaleValue = w.grp1.durGroup.add 'edittext', undefined, nf.maxPageScale
	maxScaleValue.characters = 4

	# FIXME: Add some padding options  or deal with really big or small highlights

	radioGroupTargetLayer = w.grp1.add "panel", undefined, 'Target Layer'
	radioGroupTargetLayer.alignChildren = 'left'
	radioGroupTargetLayer.orientation = 'row'
	radioButtonParentLayer = radioGroupTargetLayer.add "radiobutton", undefined, "Page parent"
	radioButtonPageLayer = radioGroupTargetLayer.add "radiobutton", undefined, "Page layer"
	radioButtonParentLayer.value = true

	radioGroupKeyframes = w.grp1.add "panel", undefined, "Keyframes"
	radioGroupKeyframes.alignChildren = 'left'
	radioGroupKeyframes.orientation = 'row'
	radioButtonInOut = radioGroupKeyframes.add "radiobutton", undefined, "In & Out"
	radioButtonOneKF = radioGroupKeyframes.add "radiobutton", undefined, "One Keyframe"
	radioButtonMoveOnly = radioGroupKeyframes.add "radiobutton", undefined, "No Keyframes (Move Only)"
	radioButtonInOut.value = true

	highlightRects = nf.sourceRectsForHighlightsInTargetLayer selectedLayer
	if highlightRects?
		
		w.grp2 = w.add 'panel', undefined, 'Highlights On Selected Page', {borderStyle:'none'}
		w.grp2.alignChildren = 'left'
		w.grp2.margins.top = 16

		w.grp3 = w.grp2.add 'group', undefined, undefined, undefined
		w.grp3.alignChildren = 'left'
		w.grp3.orientation = 'column'

		for highlightRect of highlightRects
			highlightRectObject = {}
			highlightRectObject[highlightRect] = highlightRects[highlightRect]
			radioButton = w.grp3.add 'button', undefined, nf.capitalizeFirstLetter(highlightRect)
			radioButton.onClick = getOnClickFunction highlightRectObject, w

	cancelButton = w.add('button', undefined, 'Cancel', name: 'cancel')

	nf.UIControls =
		duration: durationValue
		keyframes:
			inOut: radioButtonInOut
			moveOnly: radioButtonMoveOnly
			oneKF: radioButtonOneKF
		movePageLayer: radioButtonPageLayer
		highlightWidthPercent: widthValue
		maxScale: maxScaleValue

	cancelButton.onClick = ->
		w.close()
		return

	w.show()

getOnClickFunction = (highlightRectObject, w) ->
	->
		options =
			movePageLayer: nf.UIControls.movePageLayer.value
			duration: parseFloat(nf.UIControls.duration.text)
			moveOnly: nf.UIControls.keyframes.moveOnly.value
			makeInKeyframe: nf.UIControls.keyframes.inOut.value
			# oneKF: nf.UIControls.keyframes.oneKF.value

		nf.maxPageScale = parseFloat(nf.UIControls.maxScale.text) ? nf.maxScaleValue
		nf.highlightWidthPercent = parseFloat(nf.UIControls.highlightWidthPercent.text) ? nf.highlightWidthPercent

		if not options.duration?
			alert 'Invalid Duration!'
			return false

		for name of highlightRectObject
			goToHighlight highlightRectObject[name], options
		w.hide()
		false

app.beginUndoGroup nf.undoGroupName
askForChoice()
app.endUndoGroup()
nf = {}