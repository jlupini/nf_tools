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
	NFTools.log "Asking for input"
	comp = _.mainComp

	NFProject.importScript()

	# input = prompt 'Enter the instruction (without brackets):', '', 'AutoLayout'
	#
	# NFTools.log "Following Instruction"
	#
	# return false unless input? and input isnt ""
	#
	# NFProject.followInstruction input

	NFTools.log "Done following instruction"
	NFTools.breakLog()

	true

main()

app.endUndoGroup()
