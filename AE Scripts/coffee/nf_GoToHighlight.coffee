# Move _Parent_ OR Move Page
# End Keyframe Only? (default no)
# List of highlight colors


`#include "nf_functions.jsx"`

importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Go To Highlight'
	highlightWidthPercent: 85
	easeType: KeyframeInterpolationType.BEZIER
	easeWeight: 33
nf = Object.assign importedFunctions, globals

goToHighlight = (highlight, options) ->
	options =
		movePageLayer: options.movePageLayer ? no
		makeInKeyframe: options.makeInKeyframe ? yes
		duration: options.duration ? 1

	selectedLayer = nf.mainComp.selectedLayers[0]
	highlightPageLayer = selectedLayer # FIXME: This will change once we support selecting the parent and moving ALL highlights in child pages
	layerToMove = if options.movePageLayer then selectedLayer else nf.pageParent(selectedLayer)

	return alert "No Layer Parent Found!" if not layerToMove?

	positionProp = layerToMove.transform.position
	scaleProp = layerToMove.transform.scale

	now = nf.mainComp.time
	if options.makeInKeyframe

		keyframeTimes = [now, now + options.duration]

		# Do the scale keyframing first, since we'll need this to figure out the new position
		targetScale = getTargetScale highlight, scaleProp.value, highlightPageLayer
		scaleProp.setValuesAtTimes keyframeTimes, [scaleProp.valueAtTime(now, false), targetScale]

		for theTime in keyframeTimes
			scaleKey = scaleProp.nearestKeyIndex theTime
			scaleProp.setInterpolationTypeAtKey scaleKey, nf.easeType, nf.easeType
			ease = new KeyframeEase(0, nf.easeWeight)
			scaleProp.setTemporalEaseAtKey scaleKey, [ease, ease, ease]

		targetPosition = getTargetPosition highlight, positionProp.value, highlightPageLayer, keyframeTimes[1]
		positionProp.setValuesAtTimes keyframeTimes, [positionProp.valueAtTime(now, false), targetPosition]

		for theTime in keyframeTimes
			posKey = positionProp.nearestKeyIndex theTime
			positionProp.setInterpolationTypeAtKey posKey, nf.easeType, nf.easeType
			ease = new KeyframeEase(0, nf.easeWeight)
			positionProp.setTemporalEaseAtKey posKey, [ease]
	else
		positionProp.setValueAtTime now, targetPosition
		#scaleProp.setValueAtTime now, targetScale
	
getTargetPosition = (highlight, layerPosition, highlightPageLayer, targetTime = null) ->
	highlightCenterPoint = nf.pointRelativeToComp [highlight.left + highlight.width / 2, highlight.top + highlight.height / 2], highlightPageLayer, targetTime
	compCenterPoint = [nf.mainComp.width / 2, nf.mainComp.height / 2]
	delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]]
	targetPosition = [layerPosition[0] + delta[0], layerPosition[1] + delta[1]]
	targetPosition

getTargetScale = (highlight, layerScale, highlightPageLayer, targetTime = null) ->
	highlightRectInContext = nf.rectRelativeToComp highlight, highlightPageLayer, targetTime
	compWidth = nf.mainComp.width
	targetHighlightWidth = nf.highlightWidthPercent / 100 * compWidth
	scaleFactor = targetHighlightWidth / highlightRectInContext.width
	newScale = [layerScale[0] * scaleFactor, layerScale[1] * scaleFactor]

askForChoice = ->
	selectedLayer = nf.mainComp.selectedLayers[0]
	w = new Window('dialog', 'Go To Highlight')
	w.alignChildren = 'left'

	highlightRects = nf.sourceRectsForHighlightsInTargetLayer selectedLayer
	if highlightRects?
		
		w.grp2 = w.add 'panel', undefined, 'Highlights On Selected Page', {borderStyle:'none'}
		w.grp2.alignChildren = 'left'
		w.grp2.margins.top = 16

		# useAllHighlightsButton = w.grp2.add 'button', undefined, "All Active Highlights"
		# useAllHighlightsButton.onClick = getOnClickFunction toKeys(highlightRects), highlightRects, w, true

		w.grp3 = w.grp2.add 'group', undefined, undefined, undefined
		w.grp3.alignChildren = 'left'
		w.grp3.orientation = 'column'

		for highlightRect of highlightRects
			highlightRectObject = {}
			highlightRectObject[highlightRect] = highlightRects[highlightRect]
			radioButton = w.grp3.add 'button', undefined, nf.capitalizeFirstLetter(highlightRect)
			radioButton.onClick = getOnClickFunction highlightRectObject, w

	cancelButton = w.add('button', undefined, 'Cancel', name: 'cancel')

	cancelButton.onClick = ->
		w.close()
		return

	w.show()

getOnClickFunction = (highlightRectObject, w) ->
	->
		options =
			movePageLayer: yes
			makeInKeyframe: yes
			duration: 1

		for name of highlightRectObject
			goToHighlight highlightRectObject[name], options
		w.hide()
		false

app.beginUndoGroup nf.undoGroupName
askForChoice()
app.endUndoGroup()
nf = {}