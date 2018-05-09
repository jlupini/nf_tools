`#include "nf_runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: app.project.activeItem
	undoGroupName: 'initialize Pages'
	animationDuration: 1.85

initializePages = ->
	# Setup
	mainComp = app.project.activeItem
	selectedLayers = mainComp.selectedLayers

	bubblableObjects = getBubblableObjects selectedLayers
	allHighlights = bubblableObjects.highlights

	# Present UI
	w = new Window('dialog', 'Page Initialization')
	w.alignChildren = 'left'

	tPanel = w.add ("tabbedpanel")
	tPanel.alignChildren = ["fill", "fill"]
	tPanel.preferredSize = [350,300]

	# Only Show the Init tab if pages are ORPHANS (no parents)
	orphans = true
	for layer in selectedLayers
		orphans = false if layer.parent?

	if orphans

		initTab = tPanel.add("tab", undefined, "Init Page")
		initTab.alignChildren = "fill"

		#FIXME: Add back in this movement thing, to eventually replace the animation composer animation in
		# Options Panel
		optionsPanel = initTab.add 'panel', undefined, 'Options', {borderStyle:'none'}
		optionsPanel.alignChildren = 'left'
		optionsPanel.margins.top = 16
		animatePageCheckbox = optionsPanel.add "checkbox", undefined, "Animate In First Page"
		animatePageCheckbox.value = yes

		# Highlights
		highlightPanel = initTab.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
		highlightPanel.alignChildren = 'left'
		highlightPanel.margins.top = 16

		highlightCheckboxes = {}
		for highlightName of allHighlights
			highlight = allHighlights[highlightName]
			displayName = highlightName
			if highlight.bubbled
				if highlight.broken isnt ""
					displayName = highlightName + " (OVERRIDE/BROKEN)"
				else
					displayName = highlightName + " (OVERRIDE)"
			else if highlight.broken isnt ""
				displayName = highlightName + " (BROKEN)"

			highlightCheckboxes[highlightName] = highlightPanel.add "checkbox {text: '#{displayName}'}"
			highlightCheckboxes[highlightName].value = not highlight.bubbled

		buttonGroup = initTab.add 'group', undefined
		okButton = buttonGroup.add('button', undefined, 'Continue')
		cancelButton = buttonGroup.add('button', undefined, 'Cancel', name: 'cancel')
		cancelButton.onClick = getCancelFunction w

		okButton.onClick = ->
			highlightChoices = []
			for highlightName of allHighlights
				checkbox = highlightCheckboxes[highlightName]
				highlight = allHighlights[highlightName]
				highlightChoices.push highlight.name if checkbox.value is true

			options =
				highlightChoices: highlightChoices
				animatePage: animatePageCheckbox.value

			initWithOptions options

			w.hide()

	# DISCONNECTIONS
	disconnectTab = tPanel.add("tab", undefined, "Disconnect Items")
	disconnectTab.alignChildren = "fill"

	# Options Panel
	disOptionsPanel = disconnectTab.add 'panel', undefined, 'Options', {borderStyle:'none'}
	disOptionsPanel.alignChildren = 'left'
	disOptionsPanel.margins.top = 16
	removeCheckbox = disOptionsPanel.add "checkbox {text: 'Also Remove Controls'}"
	removeCheckbox.value = yes

	# Highlights
	highlightDisconnectPanel = disconnectTab.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
	highlightDisconnectPanel.alignChildren = 'left'
	highlightDisconnectPanel.margins.top = 16

	highlightDisconnectCheckboxes = {}
	for highlightName of allHighlights
		highlight = allHighlights[highlightName]
		if highlight.bubbled
			highlightDisconnectCheckboxes[highlightName] = highlightDisconnectPanel.add "checkbox {text: '#{highlightName}'}"
			highlightDisconnectCheckboxes[highlightName].value = off

	disButtonGroup = disconnectTab.add 'group', undefined
	disOkButton = disButtonGroup.add('button', undefined, 'Continue')
	disCancelButton = disButtonGroup.add('button', undefined, 'Cancel', name: 'cancel')
	disCancelButton.onClick = getCancelFunction w


	# FIXME Add one more tab that handles bubbleups on a non-init state

	# _.UIControls =
	# 	duration: durationValue
	# 	highlights: highlightCheckboxes

	disOkButton.onClick = ->

		highlightChoices = []
		for highlightName of allHighlights
			checkbox = highlightDisconnectCheckboxes[highlightName]
			if checkbox?
				highlight = allHighlights[highlightName]
				if checkbox.value is true
					highlightChoices.push highlight.name
					if removeCheckbox.value is yes
						highlighterEffect = highlight.layerInPart.property("Effects").property("#{highlightName} Highlighter")
						highlighterEffect.remove() if highlighterEffect?
						# FIXME: Find the control and remove it if we're disconnecting from an instance of the page in another part comp

		NF.Util.disconnectBubbleupsInLayers selectedLayers, highlightChoices

		w.hide()

	w.show()

	return

getCancelFunction = (w) ->
	->
		w.close()

initWithOptions = (options) ->
	mainComp = app.project.activeItem
	selectedLayers = mainComp.selectedLayers

	setSize selectedLayers
	setPosition selectedLayers
	thisLayer = undefined
	i = 0
	while i < selectedLayers.length
		thisLayer = selectedLayers[i]
		# Add Motion Blur
		thisLayer.motionBlur = true
		setDropShadowForLayer thisLayer
		thisLayer.name = thisLayer.name.replace " NFPage", " [+]"
		i++
	name = nullName(selectedLayers[0])
	newParent = nullify(selectedLayers, name)
	zoomer = zoom(newParent)
	NF.Util.bubbleUpHighlights selectedLayers, options.highlightChoices
	# FIXME: When we disconnect with an OVERRIDE, we should warn or offer to remove the overridden controls
	# FIXME: Anytime we disconnect a broken bubbleup, we should copy the current values back to the OG one

	if options.animatePage
		topLayer = topmostLayer(selectedLayers)
		NF.Util.animatePage
			page: topLayer
			type: NF.Util.AnimationType.SLIDE
			position: NF.Util.Position.RIGHT
			direction: NF.Util.Direction.IN
			duration: _.animationDuration
			easeFunction: NF.Util.EaseFunction.PAGESLIDEEASE
		for layer in selectedLayers
			layer.inPoint = topLayer.inPoint + _.animationDuration unless layer.index is topLayer.index

getBubblableObjects = (selectedLayers) ->
	# Get all the highlights in selected layers
	allHighlights = {}
	for layer in selectedLayers
		layerHighlights = NF.Util.sourceRectsForHighlightsInTargetLayer layer
		if layerHighlights?
			for key of layerHighlights
				layerHighlights[key].layerInPart = layer
			allHighlights = Object.assign allHighlights, layerHighlights

	bubblableObjects =
		highlights: allHighlights

setDropShadowForLayer = (layer) ->
	dropShadow = layer.property('Effects').addProperty('ADBE Drop Shadow')
	dropShadow.property('Opacity').setValue 191.25
	dropShadow.property('Direction').setValue 0
	dropShadow.property('Distance').setValue 20
	dropShadow.property('Softness').setValue 300
	return

setSize = (selectedLayers) ->
	thisLayer = undefined
	i = 0
	while i < selectedLayers.length
		thisLayer = selectedLayers[i]
		thisLayer.property('Transform').property('Scale').setValue [
			50
			50
			50
		]
		i++
	return

setPosition = (selectedLayers) ->
	thisLayer = undefined
	i = 0
	while i < selectedLayers.length
		thisLayer = selectedLayers[i]
		layerHeight = thisLayer.height
		oldPosition = thisLayer.property('Transform').property('Position').value
		newPosition = oldPosition
		newPosition[1] = layerHeight / 4
		thisLayer.property('Transform').property('Position').setValue newPosition
		i++
	return

nullName = (selectedLayer) ->
	fullName = selectedLayer.name
	newName = 'PDF ' + fullName.substr(0, fullName.indexOf('_'))
	newName

zoom = (target) ->
	zoomName = 'Zoomer'
	zoomer = app.project.activeItem.layer(zoomName)
	if zoomer == null
		zoomer = app.project.activeItem.layer(zoomName.toLowerCase())
	if zoomer == null
		zoomer = nullify([ target ], zoomName)
	else
		target.parent = zoomer
	zoomer

nullify = (selectedLayers, nullName) ->
	mainComp = app.project.activeItem
	newNull = mainComp.layers.addNull()
	newNull.name = nullName
	newNull.moveBefore topmostLayer(selectedLayers)
	thisLayer = undefined
	#$.write("new null: "+ newNull.name + "\n");
	i = 1
	while i <= selectedLayers.length
		thisLayer = selectedLayers[i - 1]
		thisLayer.parent = newNull
		i++
	newNull

topmostLayer = (layers) ->
	lowestIndex = layers[0].index
	thisLayer = undefined
	i = 1
	while i < layers.length
		if layers[i].index < lowestIndex
			lowestIndex = layers[i].index
		i++
	app.project.activeItem.layer lowestIndex

app.beginUndoGroup _.undoGroupName

initializePages()

app.endUndoGroup()
