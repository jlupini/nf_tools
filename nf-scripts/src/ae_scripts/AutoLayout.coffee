`#include "runtimeLibraries.jsx"`

NF = app.NF
app.beginUndoGroup 'AutoLayout'

main = ->
	NFTools.clearLog()
	NFTools.log "Asking for input"

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
