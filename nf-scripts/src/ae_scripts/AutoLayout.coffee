`#include "runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: new NFPartComp(app.project.activeItem)
	undoGroupName: 'AutoLayout'

app.beginUndoGroup _.undoGroupName

types =
	HIGHLIGHT: 100
	INSTRUCTION: 200
	FLAG: 300

dict =
	yellowUnderlineHighlight:
		code: 'yunderline'
		type: types.HIGHLIGHT
		look: "Yellow Underline"
		display: "Yellow Underline Highlight"
	greenHighlight:
		code: 'g'
		type: types.HIGHLIGHT
		look: "Green"
		display: "Green Highlight"
	yellowHighlight:
		code: 'y'
		type: types.HIGHLIGHT
		look: "Yellow"
		display: "Yellow Highlight"
	pinkHighlight:
		code: 'i'
		type: types.HIGHLIGHT
		look: "Pink"
		display: "Pink Highlight"
	blueHighlight:
		code: 'b'
		type: types.HIGHLIGHT
		look: "Blue"
		display: "Blue Highlight"


main = ->
	$.write "AutoLayout..."
	comp = _.mainComp
	time = comp.getTime()
	while true
		input = prompt('Enter the instruction (without brackets):')
		break if input is "" or not input?

		# First, check if we need to go to a new PDF
		activePDF = comp.activePDF()
		targetPDF = input.replace /(^\d+)(.+$)/i,'$1'

		

		alert('Moving on')
		time += 5
		comp.setTime time

	true


main()

app.endUndoGroup()
