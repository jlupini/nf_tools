`#include "nf_functions.jsx"`

# Import Polyfills and nf namespace functions from nf_functions.jsx,
# then combine them with the global variables in the 'nf' object
importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
nf = Object.assign importedFunctions, globals

panelTest = this

main = ->
	nf.panel = getPanelUI()

# Returns the panel if we're a UI panel, and creates a new Window if not
getPanelUI = ->
	# NOTE: This could potentially cause a bug where the panel doesnt show up. Keep an eye on it
	return nf.panel if nf.panel?

	panel = undefined
	# check if this Obj is a panel (run from Window menu)  
	if panelTest instanceof Panel
		# is a panel (called from Window menu)  
		panel = panelTest
		nf.isUIPanel = yes
	else
		# not a panel (called from File > Scripts > Run)
		# FIXME: This may not work dimensions-wise. Need to come back & fix
		panel = new Window("palette", "NF Controls")
		nf.isUIPanel = no

	panel.alignChildren = 'left'

	buttonPanel = panel.add 'panel', undefined, 'Buttons', {borderStyle:'none'}
	buttonPanel.alignChildren = 'left'
	buttonPanel.margins.top = 16

	buttonGroup = buttonPanel.add 'group', undefined

	fixExpressionErrorsButton = buttonGroup.add('button', undefined, 'Fix Expression Errors')
	toggleGuideLayersButton = buttonGroup.add('button', undefined, 'Toggle Guide Layers')

	toggleGuideLayersButton.onClick = toggleGuideLayers()

	# Layout + Resize handling
	panel.layout.layout(true)
	buttonGroup.minimumSize = buttonGroup.size;
	panel.layout.resize()
	panel.onResizing =
	panel.onResize = ->
	  @layout.resize()
	  return

	unless nf.isUIPanel
		panel.center()
		panel.show()

	return panel

toggleGuideLayers = ->
	app.beginUndoGroup 'Toggle Guide Layers'

	# First, check if this is an old project that needs to be upgraded

	precompsFolder = nf.findItem 'Precomps'
	guideReferenceComp = nf.findItemIn 'Guide Reference', precompsFolder if precompsFolder?

	unless guideReferenceComp?
		alert "Upgrading Guide Layers!\nThis project uses an older guide layer toggle style. Upgrading to the new version - This may take a minute."
	# Prompt to upgrade

	# Make one if none exists, with a single null layer called 'Guide Visibility'

	# Now we're ready to clean house. Go to each of the page precomps and look at the Annotation Guide Layer
	# If it has a 'Guide layer' effect, look at if it's connected to a part precomp.
	# If it is, delete the PARENT effect.
	# Delete the CHILD Effect
	# Fix the (now broken) opacity expression to point to the guide precomp's null layer's 'enabled' state



	app.endUndoGroup()

main()
