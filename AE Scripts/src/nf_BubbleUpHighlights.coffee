`#include "nf_runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: app.project.activeItem
	undoGroupName: 'Bubble Up Highlights'

main = ->
	pagesToBubble = _.mainComp.selectedLayers

	NF.Util.bubbleUpHighlights pagesToBubble

app.beginUndoGroup _.undoGroupName

main()

app.endUndoGroup()