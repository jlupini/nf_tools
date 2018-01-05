`#include "nf_functions.jsx"`

# Import Polyfills and nf namespace functions from nf_functions.jsx,
# then combine them with the global variables in the 'nf' object
importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Script Title'
nf = Object.assign importedFunctions, globals

firstFunction = ->
	write('firstFunction')

app.beginUndoGroup nf.undoGroupName

# Call your main function here
firstFunction()

app.endUndoGroup()
# app.nf = {}