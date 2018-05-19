`#include "runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: new NFPartComp(app.project.activeItem)
	undoGroupName: 'AutoLayout'

app.beginUndoGroup _.undoGroupName

main = ->
	$.write "AutoLayout..."

main()

app.endUndoGroup()
