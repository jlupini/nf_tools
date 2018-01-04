`#include "nf_functions.jsx"`

# Import Polyfills and nf namespace functions from nf_functions.jsx,
# then combine them with the global variables in the 'nf' object
importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Testing'
	selectedLayer: app.project.activeItem.selectedLayers[0];
nf = Object.assign importedFunctions, globals

# buildTree = (doc, tree) ->
#   styles = doc.paragraphStyles.everyItem().getElements()
#   i = 0
#   while i < styles.length
#     temp = tree.add('item', styles[i].name)
#     temp.id = styles[i].id
#     # Add property so we can easily get a handle on the style later }
#     j = 0
#     while j < doc.paragraphStyleGroups.length
#       buildTree doc.paragraphStyleGroups[j], tree.add('node', doc.paragraphStyleGroups[j].name)
#       j++
#     i++
#   return

main = ->
	instructionString = "66 gunderlineq|URL 38-10 Does Cell Phone Radiation Cause Cancer?|23|19gq|expand|expand|f2|circle u|y|expand|b|expand|17bq|gunderline|u|23yq|g|expand|underline “faster reaction time”|20|y|30|underline “biopositive”|g|expand|back to 20y then t3|9|y|29|f1|g|6|g|expand|15|21|y|21y|expand|expand|b|1bq|expand|"
	insArr = instructionString.split("|")
	layer = nf.selectedLayer
	property = layer.property("Text").property("Source Text")
	numKeys = property.numKeys

	allKeys = (property.keyTime(key) for key in [1..numKeys])

	i = 0
	while i < numKeys
		keyTime = allKeys[i]
		ins = insArr[i]
		marker = new MarkerValue(insArr)
		layer.property('Marker').setValueAtTime keyTime, marker
		i++

app.beginUndoGroup nf.undoGroupName

# Call your main function here
main()

app.endUndoGroup()
# app.nf = {}