`#include "nf_functions.jsx"`

importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Bubble Up Highlights'
nf = Object.assign importedFunctions, globals

main = ->
	pagesToBubble = nf.mainComp.selectedLayers

	nf.bubbleUpHighlights pagesToBubble

app.beginUndoGroup nf.undoGroupName

main()

app.endUndoGroup()