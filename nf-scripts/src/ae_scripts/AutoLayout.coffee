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

	# selectedLayer = comp.selectedLayers().get(0)
	# opacityProp = selectedLayer.transform().scale
	# return selectedLayer.addInOutMarkersForProperty
	# 	property: opacityProp
	# 	startValue: [0, 0, 80]
	# 	#endValue: [0, 0, 100]
	#

	# while true
	input = prompt('Enter the instruction (without brackets):')
	# break if input is "" or not input?

	NFProject.followInstruction input
	# try
	# 	NFProject.followInstruction input
	# catch e
	# 	alert "Ah shit... Error message:\n\"#{e.message}\"\n\nFrom line ##{e.line} in file '#{e.fileName}'"

	# alert('Moving on')
	# time += 5
	# comp.setTime time

	true

main()

app.endUndoGroup()
