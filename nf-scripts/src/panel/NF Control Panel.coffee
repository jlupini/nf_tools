`#include "runtimeLibraries.jsx"`

# Import Polyfills and nf namespace functions from nf_functions.jsx,
# then combine them with the global variables in the 'nf' object
NF = app.NF

# _ is temp storag0
_ =
  mainComp: app.project.activeItem
  debug: no # Change this flag when you need to add breakpoints to this as a dialog

panelTest = this

main = ->
  _.panel = getPanelUI()

# Returns the panel if we're a UI panel, and creates a new Window if not
getPanelUI = ->
  # NOTE: This could potentially cause a bug where the panel doesnt show up. Keep an eye on it
  return _.panel if _.panel?

  panel = undefined
  # check if this Obj is a panel (run from Window menu)
  if panelTest instanceof Panel
    # is a panel (called from Window menu)
    panel = panelTest
    _.isUIPanel = yes
  else
    # not a panel (called from File > Scripts > Run)
    # FIXME: This may not work dimensions-wise. Need to come back & fix
    panelType = if _.debug then "dialog" else "palette"
    panel = new Window("dialog", "NF Controls")
    _.isUIPanel = no

  panel.alignChildren = 'left'

  buttonPanel = panel.add 'panel', undefined, 'Controls', {borderStyle:'none'}
  buttonPanel.alignChildren = 'left'
  buttonPanel.margins.top = 16

  buttonGroup = buttonPanel.add 'group', undefined

  # _.fixExpressionErrorsButton = buttonGroup.add('button', undefined, 'Fix Expression Errors')
  _.toggleGuideLayersButton = buttonGroup.add('button', undefined, 'Toggle Guide Layers')

  _.toggleGuideLayersButton.onClick = (w) ->
    toggleGuideLayers w
    @active = false

  # Layout + Resize handling
  panel.layout.layout(true)
  buttonGroup.minimumSize = buttonGroup.size;
  panel.layout.resize()
  panel.onResizing =
  panel.onResize = ->
    @layout.resize()
    return

  unless _.isUIPanel
    panel.center()
    panel.show()

  return panel

videoProject =
  precompsFolder: ->
    return NF.Util.findItem 'Precomps'
  PDFPrecompsFolder: ->
    return NF.Util.findItem 'PDF Precomps'
  partsFolder: ->
    return NF.Util.findItem 'Parts'

# Guide Reference Object
guideReference =
  compName: 'Guide Reference'
  layerName: 'Guide Visibility'
  effectName: 'Guide Layer'

  comp: ->
    if videoProject.precompsFolder()?
      return NF.Util.findItemIn 'Guide Reference', videoProject.precompsFolder()
    else
      return null
  layer: ->
    return null unless @comp()?
    layerCollection = @comp()?.layers
    if layerCollection?.length == 0
      alert("No layers in Guide Reference Comp")
      return null
    else
      return layerCollection[1]
  create: ->
    return null if @comp()? or @layer()? or not videoProject.precompsFolder()?
    videoProject.precompsFolder().items.addComp(@compName, 1920, 1080, 1.0, 1, 30)
    @comp().layers.addNull()
    @layer().name = @layerName

    return @layer()
  visible: ->
    return @layer()?.enabled
  setVisible: (newVisibility) ->
    @layer()?.enabled = newVisibility
    return @layer()

toggleGuideLayers = (w) ->
  # First, check if this is an old project that needs to be upgraded
  unless guideReference.comp()?
    alert "Upgrading Guide Layers!\nThis project uses an older guide layer toggle style. Upgrading to the new version - This may take a minute."
    app.beginUndoGroup 'Upgrading Guide Layers'

    guideReference.create()

    # Get all the page precomps
    pagePrecomps = NF.Util.collectionToArray videoProject.PDFPrecompsFolder().items
    # Get all the Annotation Guide Layers
    for thePageComp in pagePrecomps
      guideLayer = thePageComp.layers.byName "Annotation Guide"
      # If it has a 'Guide layer' effect, delete it
      if guideLayer?
        guideEffect = guideLayer.property("Effects")?.property(guideReference.effectName)
        guideEffect.remove() if guideEffect?

        guideLayer.property("Transform").property("Opacity").expression = "comp(\"#{guideReference.compName}\").layer(\"#{guideReference.layerName}\").enabled * 60"

    # Look for and delete all guide layer effects in part comps
    parts = NF.Util.toArr videoProject.partsFolder()?.items
    for thePartComp in parts
      partLayers = NF.Util.toArr thePartComp.layers
      for theLayer in partLayers
        guideEffect = theLayer.property("Effects")?.property(guideReference.effectName)
        guideEffect.remove() if guideEffect?

    alert "All done upgrading!\nIf you see expression errors, it's possible that you have PDF Page Comps out of the PDF Precomps folder. If that happens, hit undo, then try moving them there and running the script again."
    app.endUndoGroup()

  # Toggle State
  app.beginUndoGroup 'Toggle Guide Layers'
  guideReference.setVisible !guideReference.visible()
  app.endUndoGroup()

main()
