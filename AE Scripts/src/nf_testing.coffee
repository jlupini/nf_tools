`#include "nf_runtimeLibraries.jsx"`

# Import Polyfills and nf namespace functions from nf_functions.jsx,
# then combine them with the global variables in the 'nf' object
NF = app.NF
_ =
	mainComp: app.project.activeItem
	undoGroupName: 'Testing'
	selectedLayer: app.project.activeItem.selectedLayers[0];

clear = ->
	NF.Util.disconnectBubbleupsInLayers(app.project.activeItem.selectedLayers)

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
	# nf.turnPageAtTime app.project.activeItem.selectedLayers[0]
	pageTree = NF.Util.pageTreeForPaper _.selectedLayer

	w = new Window('dialog')
	tree = w.add 'treeview', [0, 0, 250, 350]

	pageTree.node = tree.add 'node', pageTree.name

	i = 0
	while i < pageTree.pages.length
		thePage = pageTree.pages[i]
		thePage.node = pageTree.node.add 'node', thePage.name
		for highlightName of thePage.highlights
			highlight = thePage.highlights[highlightName]
			highlight.item = thePage.node.add 'item', highlight.name
		thePage.node.expanded = yes
		i++
	pageTree.node.expanded = yes

	# mammals = tree.add('node', 'Mammals')
	# mammals.add 'item', 'cats'
	# mammals.add 'item', 'dogs'
	# insects = tree.add('node', 'Insects')
	# insects.add 'item', 'ants'
	# insects.add 'item', 'bees'
	# insects.add 'item', 'flies'
	# mammals.expanded = true
	# insects.expanded = true
	w.show()

app.beginUndoGroup _.undoGroupName

# Call your main function here
main()

app.endUndoGroup()
