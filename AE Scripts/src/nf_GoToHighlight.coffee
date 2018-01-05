`#include "nf_functions.jsx"`

importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Go To Highlight'
	pageTurnAnticipation: 0.25 # Percent of the page turn to put before the start point of the animation
	highlightWidthPercent: 85
	easeType: KeyframeInterpolationType.BEZIER
	easeWeight: 33
	defaultOptions:
		animatePage: yes
		duration: 3
		reduceMotion: yes
		pageTurnDuration: 2
		maxPageScale: 115
nf = Object.assign importedFunctions, globals

goToHighlight = (highlight, options) ->
	options =
		reduceMotion: options.reduceMotion ? nf.defaultOptions.reduceMotion
		duration: options.duration ? nf.defaultOptions.duration
		pageTurnDuration: options.pageTurnDuration ? nf.defaultOptions.pageTurnDuration
		animatePage: options.animatePage ? nf.defaultOptions.animatePage
		maxPageScale: options.maxPageScale ? nf.defaultOptions.maxPageScale

	selectedLayer = nf.state.selectedLayer
	highlightPageLayer = nf.state.highlightLayer
	activeLayer = nf.state.activeLayer
	relevantPages = nf.state.relevantPages
	layerToMove = if options.animatePage then nf.pageParent(selectedLayer) else highlightPageLayer 

	return alert "No Layer Parent Found!" if not layerToMove?

	if options.animatePage
		# Determine if we need to do some page turning or other voodoo
		# FIXME: Right now we're assuming no one's mucked it up by changing the in and out points, should handle this possibility
		highlightPageLayerActive = nf.pageLayerCanBeActive highlightPageLayer
		if activeLayer.index < highlightPageLayer.index
			# There is an active layer covering up (above) the target layer, so we need to get rid of it

			if not highlightPageLayerActive
				# We need to get our layer active
				# FIXME: I'm not dealing with this yet
				alert "Uh Oh, the layer with the highlight isn't visible and I don't know how to make it visible yet..."
				return false
				# DEAL WITH PROBLEMS HERE

			# How many active page layers are between us and the active layer?
			problemLayers = []
			for possibleProblemLayer in relevantPages
				if nf.pageLayerCanBeActive(possibleProblemLayer.layer()) and activeLayer.index < possibleProblemLayer.index < highlightPageLayer.index
					problemLayers.push possibleProblemLayer
			# Now we've got an array of problem layers
			# FIXME: Not gonna deal with this yet
			if problemLayers.length > 0
				alert "Uh oh, I'm not smart enough to deal with a layer tangle this complicated yet..."
				return false
			# DEAL WITH PROBLEM LAYERS HERE

			# Since this is a multi-page move, we need to check if we have to reduce motion
			if options.reduceMotion
				# for now, we can only reduce motion if there are no keyframes on the target page.
				# FIXME: Catch this ^
				# FIXME: Support this if there are keyframes on the target page
				reduceMotionOptions =
					reduceMotion: no
					animatePage: no
					maxPageScale: options.maxPageScale * 0.8

				goToHighlight(highlight, reduceMotionOptions)

			# Great!, now we've dealt with problem layers, so let's turn our activeLayer out of the way.
			nf.turnPageAtTime activeLayer, options.pageTurnDuration, app.project.activeItem.time - (nf.pageTurnAnticipation * options.pageTurnDuration)

		else if activeLayer.index > highlightPageLayer.index
			# Our target layer is above, but for some reason isn't active

			# Is it because the page is folded up?
			if nf.pageTurnStatus(highlightPageLayer) is nf.PageTurn.FLIPPEDUP
				# Let's fold it back down!
				nf.turnPageAtTime highlightPageLayer, options.pageTurnDuration, app.project.activeItem.time - (nf.pageTurnAnticipation * options.pageTurnDuration)
			else
				# There are many reasons we could be here - figure out what's going on
				# FIXME: I haven't done this yet
				alert "Uh Oh, I can see that I need to go to a layer above the currently visible one, but it's not flipped out of the way so I don't know what to do yet..."
			
		
	# All clear, proceed as normal after re-evaluating the active layer
	nf.activeLayer = activeLayer = relevantPages[nf.activePageIndexInArray(relevantPages)]

	positionProp = layerToMove.transform.position
	scaleProp = layerToMove.transform.scale

	previousParent = layerToMove.parent if layerToMove.parent?
	layerToMove.parent = null

	now = nf.mainComp.time

	if options.animatePage

		keyframeTimes = [now, now + options.duration]

		targetScale = getTargetScale highlight, scaleProp.value, highlightPageLayer, options.maxPageScale
		scaleProp.setValuesAtTimes keyframeTimes, [scaleProp.valueAtTime(now, false), targetScale]
		nf.setSymmetricalTemporalEasingOnlyForProperties scaleProp, keyframeTimes, nf.easeType, nf.easeWeight, true

		# Now that we've set the scale, we can get the location of the highlighter at that scale
		targetPosition = getTargetPosition highlight, positionProp.value, highlightPageLayer, keyframeTimes[1]
		positionProp.setValuesAtTimes keyframeTimes, [positionProp.valueAtTime(now, false), targetPosition]

		nf.setSymmetricalTemporalEasingOnlyForProperties positionProp, keyframeTimes, nf.easeType, nf.easeWeight, true

	else
		# Delete any Keyframes
		didRemoveKeys = false
		while positionProp.numKeys != 0
			didRemoveKeys = true
			positionProp.removeKey 1
		while scaleProp.numKeys != 0
			didRemoveKeys = true
			scaleProp.removeKey 1
		if didRemoveKeys
			alert "Warning: The options you selected have caused the removal of one or more keyframes from the target layer. This is probably because you chose 'Move Only'."

		targetScale = getTargetScale highlight, scaleProp.value, highlightPageLayer, options.maxPageScale
		scaleProp.setValue targetScale
		targetPosition = getTargetPosition highlight, positionProp.value, highlightPageLayer
		positionProp.setValue targetPosition

	layerToMove.parent = previousParent if previousParent?
	selectedLayer.selected = yes

absoluteScaleOfLayer = (layer) ->
	layerParent = layer.parent
	layer.parent = null
	absoluteScale = layer.transform.scale.value
	layer.parent = layerParent
	absoluteScale

getTargetScale = (highlight, layerScale, highlightPageLayer, maxScale, targetTime = null) ->
	targetScaleFactor = getTargetScaleFactor highlight, layerScale, highlightPageLayer, maxScale, targetTime
	targetScale = getTargetScaleUsingFactor layerScale, targetScaleFactor

getTargetPosition = (highlight, layerPosition, highlightPageLayer, targetTime = null) ->
	targetPositionDelta = getTargetPositionDelta highlight, layerPosition, highlightPageLayer, targetTime
	targetPosition = getTargetPositionUsingDelta layerPosition, targetPositionDelta

getTargetPositionUsingDelta = (initialPosition, delta) ->
	targetPosition = [initialPosition[0] + delta[0], initialPosition[1] + delta[1]]

getTargetPositionDelta = (highlight, layerPosition, highlightPageLayer, targetTime = null) ->
	highlightCenterPoint = nf.pointRelativeToComp [highlight.left + highlight.width / 2, highlight.top + highlight.height / 2], highlightPageLayer, targetTime
	compCenterPoint = [nf.mainComp.width / 2, nf.mainComp.height / 2]
	delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]]

	# Adjust to prevent falling off the page
	rectAfterScale = nf.sourceRectToComp highlightPageLayer, targetTime
	rectAfterScale.left += delta[0]
	rectAfterScale.top += delta[1]

	if rectAfterScale.left > 0
		delta[0] -= rectAfterScale.left
	if rectAfterScale.top > 0
		delta[1] -= rectAfterScale.top
	if rectAfterScale.left + rectAfterScale.width < nf.mainComp.width
		delta[0] += nf.mainComp.width - (rectAfterScale.left + rectAfterScale.width)
	if rectAfterScale.top + rectAfterScale.height < nf.mainComp.height
		delta[1] += nf.mainComp.height - (rectAfterScale.top + rectAfterScale.height)

	delta

getTargetScaleUsingFactor = (initialScale, scaleFactor) ->
	newScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor]

getTargetScaleFactor = (highlight, layerScale, highlightPageLayer, maxScale, targetTime = null) ->
	highlightRectInContext = nf.rectRelativeToComp highlight, highlightPageLayer, targetTime
	compWidth = nf.mainComp.width
	targetHighlightWidth = nf.highlightWidthPercent / 100 * compWidth
	scaleFactor = targetHighlightWidth / highlightRectInContext.width

	# Adjust for max page scale
	absoluteScale = absoluteScaleOfLayer highlightPageLayer
	calculatedScale = scaleFactor * absoluteScale[0]
	if calculatedScale > maxScale
		adjustedScaleFactor = maxScale / absoluteScale[0]
	else if calculatedScale < 50
		adjustedScaleFactor = 50 / absoluteScale[0]
	else
		adjustedScaleFactor = scaleFactor

	adjustedScaleFactor

askForChoice = ->
	# FIXME: Additional options should be TURN PAGE IF NECESSARY checkbox, CHEAT POSITION checkbox, TRIM/SHUNT checkbox
	selectedLayer = nf.mainComp.selectedLayers[0]
	w = new Window('dialog', 'Go To Highlight')
	w.alignChildren = 'left'

	w.grp1 = w.add 'panel', undefined, 'Options', {borderStyle:'none'}
	w.grp1.alignChildren = 'left'
	w.grp1.margins.top = 16

	w.grp1.durGroup = w.grp1.add 'panel', undefined, 'Duration (seconds)'
	w.grp1.durGroup.orientation = 'row'
	durationLabel = w.grp1.durGroup.add 'statictext {text: "Movement Duration:", characters: 16, justify: "left"}'
	durationValue = w.grp1.durGroup.add 'edittext', undefined, nf.defaultOptions.duration
	durationValue.characters = 3
	pageTurnLabel = w.grp1.durGroup.add 'statictext {text: "Page Turn Duration:", characters: 16, justify: "left"}'
	pageTurnValue = w.grp1.durGroup.add 'edittext', undefined, nf.defaultOptions.pageTurnDuration
	pageTurnValue.characters = 3

	w.grp1.sizeGroup = w.grp1.add 'panel', undefined, 'Sizing'
	w.grp1.sizeGroup.orientation = 'row'
	widthLabel = w.grp1.sizeGroup.add 'statictext {text: "Width (% of window):", characters: 16, justify: "left"}'
	widthValue = w.grp1.sizeGroup.add 'edittext', undefined, nf.highlightWidthPercent
	widthValue.characters = 3
	maxScaleLabel = w.grp1.sizeGroup.add 'statictext {text: "Max Scale (%):", characters: 11, justify: "left"}'
	maxScaleValue = w.grp1.sizeGroup.add 'edittext', undefined, nf.defaultOptions.maxPageScale
	maxScaleValue.characters = 4

	radioGroupAnimationType = w.grp1.add "panel", undefined, 'Animation Type'
	radioGroupAnimationType.alignChildren = 'left'
	radioGroupAnimationType.orientation = 'row'
	radioButtonShouldAnimate = radioGroupAnimationType.add "radiobutton", undefined, "Animate Movement"
	radioButtonPageLayer = radioGroupAnimationType.add "radiobutton", undefined, "Only Move Page"
	radioButtonShouldAnimate.value = nf.defaultOptions.animatePage
	radioButtonPageLayer = not nf.defaultOptions.animatePage

	groupAdditionalOptions = w.grp1.add "panel", undefined, 'Additional Options'
	groupAdditionalOptions.alignChildren = 'left'
	groupAdditionalOptions.orientation = 'row'
	checkboxReduceMotion = groupAdditionalOptions.add "checkbox", undefined, "Reduce motion on cross-page moves"
	checkboxReduceMotion.value = nf.defaultOptions.reduceMotion

	nf.pageTree = nf.pageTreeForPaper selectedLayer

	w.grp2 = w.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
	w.grp2.alignChildren = 'left'
	w.grp2.margins.top = 16
	tree = w.grp2.add 'treeview', [0, 0, 450, 250]

	nf.pageTree.node = tree.add 'node', nf.pageTree.name

	i = 0
	while i < nf.pageTree.pages.length
		thePage = nf.pageTree.pages[i]
		pageName = null
		if thePage.active
			pageName = thePage.name + " (Active Page)"
		else if thePage.index is selectedLayer.index
			pageName = thePage.name + " (Selected Page)"
		else 
			pageName = thePage.name

		thePage.node = nf.pageTree.node.add 'node', pageName
		thePage.node.data = thePage
		for highlightName of thePage.highlights
			highlight = thePage.highlights[highlightName]
			highlight.item = thePage.node.add 'item', highlight.name
			highlight.item.data = highlight
		thePage.node.expanded = yes
		i++
	nf.pageTree.node.expanded = yes

	buttonGroup = w.add 'group', undefined
	okButton = buttonGroup.add('button', undefined, 'Go To Highlight')
	spacingGroup = buttonGroup.add 'group', [0,0, 280, 50]
	cancelButton = buttonGroup.add('button', undefined, 'Cancel', name: 'cancel')

	nf.UIControls =
		duration: durationValue
		animatePage: radioButtonShouldAnimate
		highlightWidthPercent: widthValue
		maxScale: maxScaleValue
		reduceMotion: checkboxReduceMotion
		tree: tree

	okButton.onClick = ->
		options =
			duration: parseFloat(nf.UIControls.duration.text)
			animatePage: nf.UIControls.animatePage.value
			reduceMotion: nf.UIControls.reduceMotion.value
			maxPageScale: parseFloat(nf.UIControls.maxScale.text)

		nf.highlightWidthPercent = parseFloat(nf.UIControls.highlightWidthPercent.text) ? nf.highlightWidthPercent

		if not options.maxPageScale?
			alert 'Invalid Max Page Scale!'
			return false

		if not options.duration?
			alert 'Invalid Duration!'
			return false

		highlightChoice = nf.UIControls.tree.selection.data if nf.UIControls.tree.selection?.data && nf.UIControls.tree.selection?.type is 'item'
		if not highlightChoice?
			alert 'Invalid Selection!'
			return false

		nf.state =
			selectedLayer: nf.mainComp.selectedLayers[0]
			highlightLayer: nf.UIControls.tree.selection.parent.data.layer()
			activeLayer: nf.pageTree.activePage
			relevantPages: nf.pageTree.pages

		goToHighlight highlightChoice, options

		w.hide()

	cancelButton.onClick = ->
		w.close()
		return

	w.show()

app.beginUndoGroup nf.undoGroupName
askForChoice()
app.endUndoGroup()
# nf = {}