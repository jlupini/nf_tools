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
		# FIXME: Support selecting a highlight control layer to remove it
		throw new Error "Can't initialize non-page layers"

	throw new Error "Can't initialize pages from different PDFs at the same time" unless _.selectedPages.fromSamePDF()

	allHighlights = _.selectedPages.highlights()

	# Check if there are duplicate highlight names and get out if there are
	throw new Error "Some highlights in the selected pages have the same name - Please ensure unique names" if allHighlights.duplicateNames()

	# Present UI
	w = new Window('dialog', 'Page Initialization')
	w.alignChildren = 'left'

	tPanel = w.add ("tabbedpanel")
	tPanel.alignChildren = ["fill", "fill"]
	tPanel.preferredSize = [350,300]

	# Warn and abort if we're trying to run the script on both initialized and uninitialized pages at the same time
	orphans = 0
	_.selectedPages.forEach (theLayer) =>
		orphans++ unless theLayer.getPaperLayerGroup()?
	if 0 < orphans < _.selectedPages.count()
		throw new Error "Can't run this script on both initialized and uninitialized page layers at the same time"

	# Only Show the Init tab if pages are ORPHANS (Not Initialized)
	if orphans > 0
		initTab = tPanel.add("tab", undefined, "Init Page")
		initTab.alignChildren = "fill"

		# Options Panel
		optionsPanel = initTab.add 'panel', undefined, 'Options', {borderStyle:'none'}
		optionsPanel.alignChildren = 'left'
		optionsPanel.margins.top = 16

		animatePageCheckbox = optionsPanel.add "checkbox", undefined, "Animate In First Page"
		animatePageCheckbox.value = yes

		initLayerTransformsCheckbox = optionsPanel.add "checkbox", undefined, "Init Size and Position"
		initLayerTransformsCheckbox.value = yes

		# Highlights
		highlightPanel = initTab.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
		highlightPanel.alignChildren = 'left'
		highlightPanel.margins.top = 16

		highlightCheckboxes = {}
		allHighlights.forEach (highlight) =>
			displayName = highlight.getName() + " - pg" + highlight.getPageComp().getPageNumber()
			highlightAlreadyBubbledInThisComp = highlight.getControlLayer()?

			if highlight.isBubbled()
				if highlight.isBroken()
					displayName += " (OVERRIDE/BROKEN)"
				else if highlightAlreadyBubbledInThisComp
					displayName += " (ALREADY BUBBLED TO THIS COMP)"
				else
					displayName += " (OVERRIDE)"
			else if highlight.isBroken()
				displayName += " (BROKEN)"

			highlightCheckboxes[highlight.getName()] = highlightPanel.add "checkbox {text: '#{displayName}'}"
			highlightCheckboxes[highlight.getName()].value = not highlight.isBubbled()
			# Disable the checkbox if it's already bubbled up to the given layer
			# highlightCheckboxes[highlight.getName()].enabled = not highlightAlreadyConnectedToThisLayer

		buttonGroup = initTab.add('group', undefined)
		okButton = buttonGroup.add('button', undefined, 'Continue')
		cancelButton = buttonGroup.add('button', undefined, 'Cancel', name: 'cancel')
		cancelButton.onClick = getCancelFunction w

		okButton.onClick = ->
			highlightChoices = new NFHighlightLayerCollection()
			allHighlights.forEach (highlight) =>
				checkbox = highlightCheckboxes[highlight.getName()]
				highlightChoices.add highlight if checkbox.value is true

			curTime = _.mainComp.getTime()
			topLayer = _.selectedPages.getTopmostLayer()
			_.mainComp.setTime topLayer.layer.startTime

			_.selectedPages.initLayerTransforms() if initLayerTransformsCheckbox.value is yes
			_.selectedPages.initLayers()

			newParent = _.selectedPages.assignPaperParentLayer(yes)
			group = new NFPaperLayerGroup newParent


			_.mainComp.setTime curTime

			if animatePageCheckbox.value
				topLayer.slideIn()
				_.selectedPages.forEach (layer) =>
					layer.layer.startTime = topLayer.getInMarkerTime() unless layer.is topLayer

			highlightChoices.disconnectHighlights()
			group.assignControlLayer highlightChoices

			w.hide()
	else
		# Add a bubble up tab if there are unBubbled or broken highlights
		shouldPresentBubbleOnlyPanel = no
		_.selectedPages.forEach (page) =>
			bubblableForPage = page.bubblableHighlights()
			shouldPresentBubbleOnlyPanel = yes unless bubblableForPage.isEmpty()

		if shouldPresentBubbleOnlyPanel

			bubbleOnlyTab = tPanel.add("tab", undefined, "Bubble Only")
			bubbleOnlyTab.alignChildren = "fill"

			# Highlights
			highlightBubblePanel = bubbleOnlyTab.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
			highlightBubblePanel.alignChildren = 'left'
			highlightBubblePanel.margins.top = 16

			bubblableHighlights = []
			highlightBubbleCheckboxes = {}
			_.selectedPages.forEach (page) =>
				page.bubblableHighlights().forEach (highlight) =>
					highlightBubbleCheckboxes[highlight.getName()] = highlightBubblePanel.add "checkbox {text: '#{highlight.getName()} (#{page.getName()})'}"
					highlightBubbleCheckboxes[highlight.getName()].value = off
					highlightBubbleCheckboxes[highlight.getName()].sourcePage = page
					bubblableHighlights.push highlight

			bubButtonGroup = bubbleOnlyTab.add 'group', undefined
			bubOkButton = bubButtonGroup.add('button', undefined, 'Continue')
			bubCancelButton = bubButtonGroup.add('button', undefined, 'Cancel', name: 'cancel')
			bubCancelButton.onClick = getCancelFunction w

			bubOkButton.onClick = ->
				bubblableHighlights.forEach (highlight) =>
					bubbleCheckbox = highlightBubbleCheckboxes[highlight.getName()]
					if bubbleCheckbox?
						if bubbleCheckbox.value is true
							bubbleCheckbox.sourcePage.getPaperLayerGroup().assignControlLayer highlight

				w.hide()

	unless allHighlights.isEmpty()
		# DISCONNECTIONS
		disconnectTab = tPanel.add("tab", undefined, "Disconnect Items")
		disconnectTab.alignChildren = "fill"

		# Options Panel
		disOptionsPanel = disconnectTab.add 'panel', undefined, 'Options', {borderStyle:'none'}
		disOptionsPanel.alignChildren = 'left'
		disOptionsPanel.margins.top = 16


		# Highlights
		highlightDisconnectPanel = disconnectTab.add 'panel', undefined, 'Highlights', {borderStyle:'none'}
		highlightDisconnectPanel.alignChildren = 'left'
		highlightDisconnectPanel.margins.top = 16

		highlightDisconnectCheckboxes = {}
		allHighlights.forEach (highlight) =>
			if highlight.isBubbled()
				highlightDisconnectCheckboxes[highlight.getName()] = highlightDisconnectPanel.add "checkbox {text: '#{highlight.getName()}'}"
				highlightDisconnectCheckboxes[highlight.getName()].value = off

		disButtonGroup = disconnectTab.add 'group', undefined
		disOkButton = disButtonGroup.add('button', undefined, 'Continue')
		disCancelButton = disButtonGroup.add('button', undefined, 'Cancel', name: 'cancel')
		disCancelButton.onClick = getCancelFunction w

		disOkButton.onClick = ->
			allHighlights.forEach (highlight) =>
				disconnectCheckbox = highlightDisconnectCheckboxes[highlight.getName()]
				if disconnectCheckbox?
					if disconnectCheckbox.value is true
						highlight.disconnect()

			w.hide()

	return alert "Nothing to do here!" unless disconnectTab? or initTab? or bubbleOnlyTab?

	w.show()

	return

getCancelFunction = (w) ->
	->
		w.close()

app.beginUndoGroup _.undoGroupName

presentUI()

app.endUndoGroup()
