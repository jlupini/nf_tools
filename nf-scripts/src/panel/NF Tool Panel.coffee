`#include "runtimeLibraries.jsx"`

_ = {}
panelTest = this

toolRegistry =

  setup:

    name: "Setup"
    tools:

      renamePDFPrecomps:
        name: "Rename PDF Precomps"
        callback: ->
          precompFolder = NFProject.findItem "PDF Precomps"
          unless precompFolder?.typeName is "Folder"
            throw new Error "Couldn't get the PDF Precomp folder"
          for i in [1..precompFolder.numItems]
            item = precompFolder.item i
            item.name = item.name.replace '.pdf', ' NFPage'

  render:

    name: "Render"
    tools:

      prepareForSafeRender:
        name: "Arm Settings for Software Render"
        callback: ->
          # Set the GPU settings
          if app.availableGPUAccelTypes.indexOf GpuAccelType.SOFTWARE >= 0
            app.project.gpuAccelType = GpuAccelType.SOFTWARE

          # Set Motion Blur on/resolution full
          mainComp = NFProject.mainComp()
          mainComp.motionBlur = on
          mainComp.resolutionFactor = [1,1]

      prepareForStandardRender:
        name: "Arm Settings for Fast Render"
        callback: ->
          # Set the GPU settings
          if app.availableGPUAccelTypes.indexOf GpuAccelType.OPENCL >= 0
            app.project.gpuAccelType = GpuAccelType.OPENCL
          else if app.availableGPUAccelTypes.indexOf GpuAccelType.CUDA >= 0
            app.project.gpuAccelType = GpuAccelType.CUDA

          # Set Motion Blur on/resolution full
          mainComp = NFProject.mainComp()
          mainComp.motionBlur = on
          mainComp.resolutionFactor = [1,1]

      prepareForEditing:
        name: "Arm Settings for Editing"
        callback: ->
          # Set the GPU settings
          if app.availableGPUAccelTypes.indexOf GpuAccelType.OPENCL >= 0
            app.project.gpuAccelType = GpuAccelType.OPENCL
          else if app.availableGPUAccelTypes.indexOf GpuAccelType.CUDA >= 0
            app.project.gpuAccelType = GpuAccelType.CUDA

          # Set Motion Blur off/resolution half
          mainComp = NFProject.mainComp()
          mainComp.motionBlur = off
          mainComp.resolutionFactor = [2,2]

  misc:
    name: "Misc"
    tools:

      disconnectBrokenHighlights:
        name: "Disconnect Broken Highlights"
        callback: ->
          allHighlights = NFProject.allHighlights()
          allHighlights.forEach (highlight) =>
            highlight.resetExpressionErrors()
            if highlight.isBroken()
              highlight.disconnect()
              $.write "Disconnected highlight: #{highlight.getName()} in page: #{highlight.getPageComp().comp.name}\n"

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

  buttonPanel = panel.add 'panel', undefined, 'Tools', {borderStyle:'none'}
  buttonPanel.alignChildren = 'left'
  buttonPanel.margins.top = 16

  treeView = buttonPanel.add 'treeview', undefined #[0, 0, 250, 150]
  treeView.preferredSize = [220, 150]

  for key of toolRegistry
    category = toolRegistry[key]
    thisCategoryNode = treeView.add 'node', category.name

    for toolKey of category.tools
      thisTool = category.tools[toolKey]
      thisToolItem = thisCategoryNode.add 'item', thisTool.name
      thisToolItem.data = thisTool

    thisCategoryNode.expanded = yes

  buttonGroup = buttonPanel.add 'group', undefined

  goButton = buttonGroup.add('button', undefined, 'Do it!')

  goButton.onClick = (w) ->
    choice = treeView.selection.data if treeView.selection?.data && treeView.selection?.type is 'item'
    return alert "No Tool Selected!" unless choice?
    app.beginUndoGroup "NF Tool: #{choice.name}"
    choice.callback()
    @active = false
    app.endUndoGroup()

  # Layout + Resize handling
  panel.layout.layout(true)
  treeView.minimumSize = treeView.size;
  panel.layout.resize()
  panel.onResizing = panel.onResize = ->
    @layout.resize()
    return

  unless _.isUIPanel
    panel.center()
    panel.show()

  return panel

main()
