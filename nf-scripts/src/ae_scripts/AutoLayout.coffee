`#include "runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: NFProject.activeComp()
	undoGroupName: 'AutoLayout'

app.beginUndoGroup _.undoGroupName

main = ->
	$.write "AutoLayout..."
	comp = _.mainComp
	time = comp.getTime()
	while true
		input = prompt('Enter the instruction (without brackets):')
		break if input is "" or not input?

		NFProject.followInstruction input

		alert('Moving on')
		time += 5
		comp.setTime time

	true

main()

app.endUndoGroup()
