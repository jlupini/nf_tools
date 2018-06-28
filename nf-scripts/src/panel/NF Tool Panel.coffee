`#include "runtimeLibraries.jsx"`

_ = {}
panelTest = this

toolRegistry =

  renamePDFPrecomps:
    name: "Rename PDF Precomps"
    callback: (w) ->
      precompFolder = NFProject.findItem "PDF Precomps"
      unless precompFolder?.typeName is "Folder"
        throw new Error "Couldn't get the PDF Precomp folder"
      for i in [1..precompFolder.numItems]
        item = precompFolder.item i
        item.name = item.name.replace '.pdf', ' NFPage'

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
    panel = new Window("dialog", "NF Tools")
    _.isUIPanel = no

  panel.alignChildren = 'left'

  buttonPanel = panel.add 'panel', undefined, 'Controls', {borderStyle:'none'}
  buttonPanel.alignChildren = 'left'
  buttonPanel.margins.top = 16

  buttonGroup = buttonPanel.add 'group', undefined

  _.toggleGuideLayersButton = buttonGroup.add('button', undefined, toolRegistry.renamePDFPrecomps.name)

  _.toggleGuideLayersButton.onClick = (w) ->
    toolRegistry.renamePDFPrecomps.callback w
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

main()
