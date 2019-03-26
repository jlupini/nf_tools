try `#include "runtimeLibraries.jsx"`

NF = app.NF
app.beginUndoGroup 'Follow Single Instruction'

main = ->
	NFTools.clearLog()
	NFTools.log "Asking for input"
	input = prompt 'Enter the instruction (without brackets):', '', 'AutoLayout'

	return false unless input? and input isnt ""

	NFProject.followInstruction input

	NFTools.log "Done following instruction"
	NFTools.breakLog()

	true

main()

app.endUndoGroup()
