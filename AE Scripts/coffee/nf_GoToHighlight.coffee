`#include "nf_functions.jsx"`

importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Go To Highlight'
	spotlightColor: [0.0078, 0, 0.1216]
	initialSpotlightStartOffset: -2
	initialSpotlightLength: 7
nf = Object.assign importedFunctions, globals

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
			radioButton = w.grp3.add 'checkbox', undefined, nf.capitalizeFirstLetter(highlightRect)

		useSelectedHighlightsButton = w.grp2.add 'button', undefined, "Selected Highlights"
		useSelectedHighlightsButton.onClick = getOnClickFunction nf.toKeys(highlightRects), highlightRects, w, true, w.grp3.children

	cancelButton = w.add('button', undefined, 'Cancel', name: 'cancel')

	cancelButton.onClick = ->
		w.close()
		return

	w.show()

getOnClickFunction = (name, sourceRect, w, multiple = false, choices = null) ->
	->
		rectKeys = toKeys sourceRect if choices?
		if multiple
			for theRect of sourceRect
				if choices?
					thisIndex = rectKeys.indexOf theRect
					write('somechoices')
					#createSpotlightLayer theRect, sourceRect[theRect] if choices[thisIndex].value
				else
					write('else')
					#createSpotlightLayer theRect, sourceRect[theRect]
		else
			write('else')
			#createSpotlightLayer name, sourceRect
		w.hide()
		false

app.beginUndoGroup nf.undoGroupName
askForChoice()
app.endUndoGroup()
nf = {}