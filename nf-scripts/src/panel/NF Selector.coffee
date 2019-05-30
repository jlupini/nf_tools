`#include "runtimeLibraries.jsx"`
_ = {}

panelTest = this

openScript = (targetScript) ->
  start_folder = new Folder(new File($.fileName).parent.fsName)
  scriptFile = new File(start_folder.fsName + "/#{targetScript}")
  script = "#include '#{scriptFile.fullName}'"
  eval script

getContentTree = () ->
  # Build the content tree of pdfs and pages and highlights
  tree = {}
  allPageComps = NFProject.allPageComps()
  for pageComp in allPageComps
    pdfNumber = pageComp.getPDFNumber()
    pageNumber = pageComp.getPageNumber()

    tree[pdfNumber] = {} unless tree[pdfNumber]?

    singlePageTree = {}
    pageHighlights = pageComp.highlights()
    unless pageHighlights.isEmpty()
      pageHighlights.forEach (highlight) =>
        singlePageTree[highlight.layer.name] = highlight

    tree[pdfNumber][pageNumber] = singlePageTree

  return tree

loadContentIntoView = (treeView) ->
  treeView.removeAll()
  contentTree = getContentTree()
  for key of contentTree
    thisPDFNode = treeView.add 'node', "PDF #{key}"

    pdfTree = contentTree[key]
    for pageKey of pdfTree
      pageTree = pdfTree[pageKey]
      if pageTree.isEmpty()
        # Make an item instead of node
        thisPageNode = thisPDFNode.add 'item', "Page #{pageKey}"
      else
        thisPageNode = thisPDFNode.add 'node', "Page #{pageKey}"

        for highlightKey of pageTree
          thisHighlightItem = thisPageNode.add 'item', highlightKey

          thisHighlight = pageTree[highlightKey]
          thisHighlightItem.data = thisHighlight

        thisPageNode.expanded = no

    thisPDFNode.expanded = yes

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

  buttonPanel = panel.add 'panel', undefined, 'Selector', {borderStyle:'none'}
  buttonPanel.alignChildren = 'left'
  buttonPanel.margins.top = 16

  treeView = buttonPanel.add 'treeview', undefined #[0, 0, 250, 150]
  treeView.preferredSize = [220, 250]

  loadContentIntoView treeView

  buttonGroup = buttonPanel.add 'group', undefined

  goButton = buttonGroup.add('button', undefined, 'Do it!')
  goButton.onClick = (w) ->
    alert "doing it!"
    return null
    # choice = treeView.selection.data if treeView.selection?.data && treeView.selection?.type is 'item'
    # return alert "No Tool Selected!" unless choice?
    # app.beginUndoGroup "NF Tool: #{choice.name}" unless choice.automaticUndo is no
    # choice.callback()
    # @active = false
    # app.endUndoGroup() unless choice.automaticUndo is no

  refreshButton = buttonGroup.add('button', undefined, 'Refresh')
  refreshButton.onClick = (w) ->
    loadContentIntoView treeView

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
