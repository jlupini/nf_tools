d = new Date()
n = d.getTime()
$.write "\n\nSTARTING\n----------------\nInitializing Libraries!\n"
`#include "runtimeLibraries.jsx"`
$.write "Setting up Script: +#{NFTools.now()-n}ms\n"

NF = app.NF
_ =
	mainComp: NFProject.activeComp()
	undoGroupName: 'AutoLayout'

app.beginUndoGroup _.undoGroupName

main = ->
	curr = NFTools.now()-n
	$.write "Boom! Time: +#{curr}ms\nAsking for input...\n"
	comp = _.mainComp
	time = comp.getTime()

	input = prompt 'Enter the instruction (without brackets):', '', 'AutoLayout'

	postInstructionTime = NFTools.now()
	$.write "Following instruction!\n"

	return false unless input? and input isnt "" 

	NFProject.followInstruction input
	# try
	# 	NFProject.followInstruction input
	# catch e
	# 	return alert "Error:\n#{e.message}"

	$.write "Done! Time: +#{NFTools.now()-postInstructionTime}ms\n"

	true

main()

app.endUndoGroup()
