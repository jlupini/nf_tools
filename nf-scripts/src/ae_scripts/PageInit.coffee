`#include "runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: new NFPartComp(app.project.activeItem)
	undoGroupName: 'initialize Pages'
	animationDuration: 1.85

presentUI = ->
	# Setup
	if _.mainComp.selectedLayers().onlyContainsPageLayers()
		_.selectedPages = _.mainComp.selectedPageLayers()
	else
		throw "Can't initialize non-page layers"

	throw "Can't initialize pages from different PDFs at the same time" unless _.selectedPages.fromSamePDF()

	allHighlights = _.selectedPages.highlights()

	# Check if there are duplicate highlight names and get out if there are
	throw "Some highlights in the selected pages have the same name - Please ensure unique names" if allHighlights.duplicateNames()

	# Present UI
	w = new Window('dialog', 'Page Initialization')
	w.alignChildren = 'left'

	tPanel = w.add ("tabbedpanel")
	tPanel.alignChildren = ["fill", "fill"]
	tPanel.preferredSize = [350,300]

	# Warn and abort if we're trying to run the script on both initialized and uninitialized pages at the same time
	orphans = 0
	for theLayer in _.selectedPages.layers
		orphans++ unless theLayer.hasNullParent()
	if 0 < orphans < _.selectedPages.count()
		throw "Can't run this script on both initialized and uninitialized page layers at the same time"

	# Only Show the Init tab if pages are ORPHANS (Not Initialized)
	if orphans > 0
		initTab = tPanel.add("tab", undefined, "Init Page")
		initTab.alignChildren = "fill"

		#FIXME: Add back in this movement thing, to eventually replace the animation composer animation in
		# Options Panel
		optionsPanel = initTab.add 'panel', undefined, 'Options', {borderStyle:'none'}
		optionsPanel.alignChildren = 'left'
		optionsPanel.margins.top = 16

		animatePageCheckbox = optionsPanel.add "checkbox", undefined, "Animate In First Page"
		animatePageCheckbox.value = yes

		initLayerTransformsCheckbox = optionsPanel.add "checkbox", undefined, "Init Size and Position"
		initLayerTransformsCheckbox.value = yes

		onlyBubbleUpCheckbox = optionsPanel.add "checkbox", undefined, "Bubbleup Only"
		onlyBubbleUpCheckbox.value = no
		onlyBubbleUpCheckbox.onClick = ->
			if onlyBubbleUpCheckbox.value is yes
				animatePageCheckbox.value = initLayerTransformsCheckbox.value = no
				animatePageCheckbox.enabled = initLayerTransformsCheckbox.enabled = no
			else
				animatePageCheckbox.value = initLayerTransformsCheckbox.value = yes
				animatePageCheckbox.enabled = initLayerTransformsCheckbox.enabled = yes

		# Highlights
		highlightPanel = initTab.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
		highlightPanel.alignChildren = 'left'
		highlightPanel.margins.top = 16

		highlightCheckboxes = {}
		for highlight in allHighlights.layers
			displayName = highlight.name + " - pg" + highlight.getPageItem().getPageNumber()
			highlightAlreadyConnectedToThisLayer = highlight.containingPageLayer.sameLayerAs(highlight.connectedPageLayer)

			if highlight.bubbled
				if highlight.broken
					displayName += " (OVERRIDE/BROKEN)"
				else if highlightAlreadyConnectedToThisLayer
					displayName += " (ALREADY CONNECTED TO THIS PAGE LAYER)"
				else
					displayName += " (OVERRIDE)"
			else if highlight.broken
				displayName += " (BROKEN)"

			highlightCheckboxes[highlight.name] = highlightPanel.add "checkbox {text: '#{displayName}'}"
			highlightCheckboxes[highlight.name].value = not highlight.bubbled
			# Disable the checkbox if it's already bubbled up to the given layer
			highlightCheckboxes[highlight.name].enabled = not highlightAlreadyConnectedToThisLayer

		buttonGroup = initTab.add 'group', undefined
		okButton = buttonGroup.add('button', undefined, 'Continue')
		cancelButton = buttonGroup.add('button', undefined, 'Cancel', name: 'cancel')
		cancelButton.onClick = getCancelFunction w

		okButton.onClick = ->
			highlightChoices = new NFHighlightLayerCollection()
			for highlight in allHighlights.layers
				checkbox = highlightCheckboxes[highlight.name]
				highlightChoices.addNFHighlightLayer highlight if checkbox.value is true

			if onlyBubbleUpCheckbox.value is no
				_.selectedPages.initLayerTransforms() if initLayerTransformsCheckbox.value is yes
				_.selectedPages.initLayers()

				# FIXME: This creates a new paper parent layer even if there's already an existing one we should hook up to
				newParent = _.selectedPages.newPaperParentLayer()
				newParent.setZoomer()

				if animatePageCheckbox.value
					topLayer = _.selectedPages.getTopmostLayer()
					positionProperty = topLayer.layer.property("Transform").property("Position")
					# Make a slider for controlling the start position
					slider = topLayer.addSlider("Start Offset", 3000)
					markerOptions =
						property: positionProperty
						startEquation: NF.Util.easingEquations.out_quint
						startValue: [slider.property("Slider"), positionProperty.value[1], positionProperty.value[2]]
					topLayer.addInOutMarkersForProperty markerOptions
					for layer in _.selectedPages.layers
						layer.layer.startTime = topLayer.markers().keyTime("NF In") unless layer.sameLayerAs topLayer

			highlightChoices.disconnectHighlights()
			highlightChoices.bubbleUpHighlights()

			w.hide()

	unless allHighlights.isEmpty()
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
		for highlight in allHighlights.layers
			if highlight.bubbled
				highlightDisconnectCheckboxes[highlight.name] = highlightDisconnectPanel.add "checkbox {text: '#{highlight.name}'}"
				highlightDisconnectCheckboxes[highlight.name].value = off

		disButtonGroup = disconnectTab.add 'group', undefined
		disOkButton = disButtonGroup.add('button', undefined, 'Continue')
		disCancelButton = disButtonGroup.add('button', undefined, 'Cancel', name: 'cancel')
		disCancelButton.onClick = getCancelFunction w

		disOkButton.onClick = ->
			for highlight in allHighlights.layers
				disconnectCheckbox = highlightDisconnectCheckboxes[highlight.name]
				if disconnectCheckbox?
					if disconnectCheckbox.value is true
						if removeCheckbox.value is yes
							highlight.connectedPageLayerHighlighterEffect()?.remove()
						highlight.disconnect()

			w.hide()

	w.show()

	return

getCancelFunction = (w) ->
	->
		w.close()

app.beginUndoGroup _.undoGroupName

presentUI()

app.endUndoGroup()
