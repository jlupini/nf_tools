`#include "runtimeLibraries.jsx"`
_ = {}
cacheFileName = "combinedTranscript.json"

panelTest = this

openScript = (targetScript) ->
  start_folder = new Folder(new File($.fileName).parent.fsName)
  scriptFile = new File(start_folder.fsName + "/#{targetScript}")
  script = "#include '#{scriptFile.fullName}'"
  eval script

toolRegistry =

  setup:

    name: "Setup"
    tools:

      setupMainComp:
        name: "Setup Main Comp"
        callback: ->
          openScript "nf_SetupMainComp.jsx"

      renamePDFPrecomps:
        name: "Rename PDF Precomps"
        callback: ->
          precompFolder = NFProject.findItem "PDF Precomps"
          unless precompFolder?.typeName is "Folder"
            throw new Error "Couldn't get the PDF Precomp folder"
          for i in [1..precompFolder.numItems]
            item = precompFolder.item i
            item.name = item.name.replace '.pdf', ' NFPage'

      createInstructionFile:
        name: "Create Instruction File (Mac Only)"
        callback: ->
          start_folder = new Folder(new File($.fileName).parent.parent.fsName)
          unless app.project.file?
            throw new Error "Can't find the location of the project file. This could be because the project is not saved."
          project_folder = new Folder(app.project.file.parent.fsName)
          bashFile = new File(start_folder.fsName + '/lib/stt/systemcall.sh')
          sttFolder = File(start_folder.fsName + '/lib/stt/')
          audioLayer = NFProject.mainComp().audioLayers().getBottommostLayer()
          audioFile = audioLayer.layer.source.file

          cmdLineString = "sh '#{bashFile.fsName}' '#{sttFolder.fsName}' '#{audioFile.fsName}' '#{project_folder.fsName}'"

          termfile = new File(File($.fileName).parent.fsName + '/command.term')
          command = cmdLineString
          termfile.open 'w'
          termfile.writeln '<?xml version="1.0" encoding="UTF-8"?>\n' +
                           '<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"' +
                           '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
                           '<plist version="1.0">\n' +
                           '<dict>\n' +
                           '<key>WindowSettings</key>\n' +
                           '<array>\n' +
                           ' <dict>\n' +
                           '<key>CustomTitle</key>\n' +
                           '<string>My first termfile</string>\n' +
                           '<key>ExecutionString</key>\n' +
                           '<string>' +
                           command +
                           '</string>\n' +
                           '</dict>\n' +
                           '</array>\n' +
                           '</dict>\n' +
                           '</plist>\n'
          termfile.close()
          shouldContinue = confirm "This involves running a terminal instance to perform speech to text
                                    and line up timecodes. It may take a while and you'll have to check
                                    the terminal window to follow the progress. Continue?", false, "Run Script?"
          termfile.execute() if shouldContinue


      importInstructions:
        name: "Import Script/Instructions"
        callback: ->
          NFTools.log "Importing from files...", "importScript"
          NFTools.logLine()
          shouldUseDetail = confirm "Would you like to do a detailed analysis on the
                                     script? Accuracy is higher but it takes twice
                                     as long to process. Only do this if standard
                                     analysis gave messed up results.", true, "Detailed Analysis"
          parsedLines = NFTools.readAndCombineScriptAndInstructions shouldUseDetail

          NFTools.editProjectFile cacheFileName, (theFileText) =>
            return JSON.stringify parsedLines, null, 4

          alert "Import complete!\nImported data is located in the project
                 directory in the file '#{cacheFileName}'. Edit the instruction
                 strings on this new file if you want to change
                 things without having to run Import again."

          null

      validateInstructions:
        name: "Validate Instructions"
        callback: ->
          if NFTools.testProjectFile cacheFileName
            cacheJSON = NFTools.readProjectFile cacheFileName
            parsedLines = JSON.parse cacheJSON

            parsedInstructions = NFTools.parseInstructions parsedLines

            validationResult = NFProject.validateInstructions parsedInstructions
            if not validationResult.valid
              errorString = ""
              for i in [0..validationResult.layoutInstructions.length-1]
                thisIns = validationResult.layoutInstructions[i]
                if not thisIns.valid
                  errorString += "\n\n" unless errorString is ""
                  errorString += "❌ Instruction ##{i+1}: [#{thisIns.raw}] - #{thisIns.validationMessage}"

              alert "Validation failed!\n\nErrors:\n#{errorString}"
              return null
            else
              straddlers = NFProject.searchForStraddlers parsedInstructions
              if straddlers?
                shouldFix = confirm "Validation was successful, but
                                     we found a few PDFs that straddle
                                     the part markers.\n\nWould you like
                                     to automatically fix these?", false, "Fix Straddlers?"
                NFProject.fixStraddlers straddlers if shouldFix

              alert "Validation Complete!\nEverything looks good to go, so
                     run 'Auto Layout' whenever you're ready."

          else
            alert "No import data found!\nRun 'Import Script/Instructions' before
                   validating or laying out."

      autoLayout:
        name: "Auto Layout"
        callback: ->

          if NFTools.testProjectFile cacheFileName
            cacheJSON = NFTools.readProjectFile cacheFileName
            parsedLines = JSON.parse cacheJSON

            parsedInstructions = NFTools.parseInstructions parsedLines

            validationResult = NFProject.validateInstructions parsedInstructions

            if not validationResult.valid
              alert "Validation failed!\n Aborting layout - Check log for details."
              return null

            # Add the line and instruction markers to part comps
            allParts = NFProject.allPartComps()
            lineWrap = "...\n"
            for part in allParts

              lineLayer = part.addSolid
                color: [0,1,0.2]
                name: "Lines"
              lineLayer.moveBefore part.allLayers().getBottommostLayer()

              instructionLayer = part.addSolid
                color: [0,0.8, 0.4]
                name: "Instructions"
              instructionLayer.moveBefore lineLayer

              lineLayer.layer.guideLayer = instructionLayer.layer.guideLayer = yes
              lineLayer.layer.enabled = instructionLayer.layer.enabled = no

              for ins in parsedInstructions
                lineText = if ins.line.length > 15 then ins.line.insertAt(15, lineWrap) else ins.line
                lineInstruction = if ins.raw.length > 15 then ins.raw.insertAt(15, lineWrap) else ins.raw

                lineLayer.addMarker
                  time: ins.time
                  comment: lineText
                instructionLayer.addMarker
                  time: ins.time
                  comment: lineInstruction

            autoLayoutStatus = NFProject.autoLayout validationResult.layoutInstructions
            alert autoLayoutStatus
          else
            alert "No import data found!\nRun 'Import Script/Instructions' before
                   validating or laying out."

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
          mainComp = NFProject.mainComp().comp
          mainComp.motionBlur = on
          mainComp.resolutionFactor = [1,1]

          parts = NFProject.allPartComps()
          for part in parts
            spotlightLayers = part.searchLayers "Spotlight"
            spotlightLayers.forEach (spotlight) =>
              spotlight.layer.enabled = yes

      prepareForStandardRender:
        name: "Arm Settings for Fast Render"
        callback: ->
          # Set the GPU settings
          if app.availableGPUAccelTypes.indexOf GpuAccelType.OPENCL >= 0
            app.project.gpuAccelType = GpuAccelType.OPENCL
          else if app.availableGPUAccelTypes.indexOf GpuAccelType.CUDA >= 0
            app.project.gpuAccelType = GpuAccelType.CUDA

          parts = NFProject.allPartComps()
          for part in parts
            spotlightLayers = part.searchLayers "Spotlight"
            spotlightLayers.forEach (spotlight) =>
              spotlight.layer.enabled = yes

          # Set Motion Blur on/resolution full
          mainComp = NFProject.mainComp().comp
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
          mainComp = NFProject.mainComp().comp
          mainComp.motionBlur = off
          mainComp.resolutionFactor = [2,2]

  animation:
    name: "Animation"
    tools:

      singleInstruction:
        name: "Follow Single Instruction"
        automaticUndo: no
        callback: ->
          openScript "nf_SingleInstruction.jsx"

      pageTools:
        name: "Page Tools"
        automaticUndo: no
        callback: ->
          openScript "nf_PageTools.jsx"

      toggleSpotlights:
        name: "Toggle Spotlight Layers"
        callback: ->
          parts = NFProject.allPartComps()
          targetValue = null
          for part in parts
            spotlightLayers = part.searchLayers "Spotlight"
            spotlightLayers.forEach (spotlight) =>
              targetValue = !spotlight.layer.enabled if targetValue is null
              spotlight.layer.enabled = targetValue

      addGaussyLayer:
        name: "Add Gaussy"
        automaticUndo: no
        callback: ->
          openScript "nf_Gaussy.jsx"

      addEmphasis:
        name: "Emphasizer"
        automaticUndo: no
        callback: ->
          openScript "nf_Emphasizer.jsx"

      addSpotlightMarker:
        name: "Add Spotlight Marker"
        callback: ->
          activeComp = NFProject.activeComp()
          selectedLayers = NFProject.selectedLayers()
          if selectedLayers.count() is 1
            theLayer = selectedLayers.get 0
            if theLayer instanceof NFHighlightControlLayer
              theLayer.addSpotlightMarker()
          else
            alert "Error\nPlease select a single Highlight Control Layer and try again"

      disconnectBrokenHighlights:
        name: "Disconnect Broken Highlights"
        callback: ->
          allHighlights = NFProject.allHighlights()
          allHighlights.forEach (highlight) =>
            highlight.resetExpressionErrors()
            if highlight.isBroken()
              highlight.disconnect()
              NFTools.log "Disconnected highlight: #{highlight.getName()} in
                           page: #{highlight.getPageComp().comp.name}\n", "NFToolPanel#disconnectBrokenHighlights"

      toggleGuideLayers:
        name: "Toggle Guide Layers"
        description: "Toggles the guide layers on and off for highlights. if
                      the guide layer reference comp hasn't been set up, this
                      script does the initial setup and links all guide layers."
        callback: ->
          guideCompFolderName = "Precomps"
          guideLayerName = "Guide Visibility"
          guideCompName = "Guide Reference"
          oldEffectName = "Guide Layer"

          guideAVComp = NFProject.findItem guideCompName

          # If this project doesn't use this guide layer method, upgrade it.
          unless guideAVComp?
            precompsFolder = NFProject.findItem guideCompFolderName
            unless precompsFolder?
              precompsFolder = NFProject.findItem("Assets").item.addFolder guideCompFolderName

            guideAVComp = precompsFolder.items.addComp guideCompName, 100, 100, 1.0, 1, 30
            newLayer = guideAVComp.layers.addNull()
            newLayer.name = guideLayerName

            for thePageComp in NFProject.allPageComps()
              guideLayer = thePageComp.layerWithName "Annotation Guide"
              if guideLayer?
                guideEffect = guideLayer.effect oldEffectName
                guideEffect?.remove()
                opacityProp = guideLayer.property("Transform").property("Opacity")
                opacityProp.expression = "comp(\"#{guideCompName}\")
                                          .layer(\"#{guideLayerName}\")
                                          .enabled * 60"

            for thePartComp in NFProject.allPartComps()
              thePartComp.allLayers().forEach (layer) =>
                layer.effect(oldEffectName)?.remove()

          guideAVComp.layers[1].enabled = !guideAVComp.layers[1].enabled

  development:
    name: "Dev"
    tools:
      updateHighlightExpressions:
        name: "Update Highlight Expressions"
        description: "This script replaces all highlight expressions with the
                      latest versions from the expression files."
        callback: ->

          # Get our script segments
          newPropertySegment = NFTools.readExpression "highlight-property-expression"
          newPropertySegment = newPropertySegment.substring(newPropertySegment.indexOf("activeBabby = null;"), newPropertySegment.indexOf("controlLayer.effect("))

          newOpacitySegment = NFTools.readExpression "highlight-opacity-expression"
          newOpacitySegment = newOpacitySegment.substring(newOpacitySegment.indexOf("controlIn = controlLayer.inPoint;"))

          newDataSegment = NFTools.readExpression "highlight-data-expression"
          newDataSegment = newDataSegment.substring(newDataSegment.indexOf("MARK_TOP = null;"))

          # Get all the highlight and data layers...
          pageComps = NFProject.allPageComps()
          for pageComp in pageComps
            highlights = pageComp.highlights()
            highlights.forEach (highlightLayer) =>
              if highlightLayer.isBubbled()
                for propertyName in NFHighlightLayer.highlighterProperties
                  property = highlightLayer.highlighterEffect().property(propertyName)
                  currExp = property.expression
                  if propertyName is 'Opacity'
                    strippedExp = currExp.substring(0, currExp.indexOf("controlIn = controlLayer.inPoint;"))
                    property.expression = strippedExp + newOpacitySegment
                  else
                    strippedExpStart = currExp.substring(0, currExp.indexOf("activeBabby = null;"))
                    strippedExpEnd = currExp.substring(currExp.indexOf("controlLayer.effect("))

                    property.expression = strippedExpStart + newPropertySegment + strippedExpEnd

            dataLayers = pageComp.searchLayers "HighData"
            dataLayers.forEach (dataLayer) =>
              property = dataLayer.property("Text").property("Source Text")
              currExp = property.expression
              strippedExp = currExp.substring(0, currExp.indexOf("MARK_TOP = null;"))
              property.expression = strippedExp + newDataSegment

      updateSpotlightExpressions:
        name: "Update Spotlight Expressions"
        description: "This script replaces all spotlight expressions with the
                      latest versions from the expression files."
        callback: ->

          # FIXME: Have this update the data layers too

          # Get our script segments
          newMaskOpacityExpSegment = NFTools.readExpression "spotlight-mask-opacity-expression"
          newMaskOpacityExpSegment = newMaskOpacityExpSegment.substring(newMaskOpacityExpSegment.indexOf("inFunc = function(mark)"))

          newMaskPathExpSegment = NFTools.readExpression "spotlight-mask-expression"
          newMaskPathExpSegment = newMaskPathExpSegment.substring(newMaskPathExpSegment.indexOf("numLayers = thisComp.numLayers;"))

          newMasterOpacityExpSegment = NFTools.readExpression "spotlight-master-opacity-expression"
          newMasterOpacityExpSegment = newMasterOpacityExpSegment.substring(newMasterOpacityExpSegment.indexOf("babbies = [];"))

          # Get all the spotlight layers...
          parts = NFProject.allPartComps()
          spotlightLayers = new NFLayerCollection()
          for part in parts
            part.searchLayers("Spotlight").forEach (partSpotLayer) =>
              spotMasks = partSpotLayer.mask()
              for i in [1..spotMasks.numProperties]
                mask = spotMasks.property(i)
                # $.bp()
                if mask.name is "Dummy"
                  prop = mask.property("Mask Opacity")
                  currExp = prop.expression
                  strippedExp = currExp.substring(0, currExp.indexOf("babbies = [];"))
                  prop.expression = strippedExp + newMasterOpacityExpSegment
                else
                  prop = mask.property("Mask Path")
                  currExp = prop.expression
                  strippedExp = currExp.substring(0, currExp.indexOf("numLayers = thisComp.numLayers;"))
                  prop.expression = strippedExp + newMaskPathExpSegment.replace("highlightComp.duration", "540")

                  prop = mask.property("Mask Opacity")
                  currExp = prop.expression
                  strippedExp = currExp.substring(0, currExp.indexOf("inFunc = function(mark)"))
                  prop.expression = strippedExp + newMaskOpacityExpSegment

      scratch:
        name: "Scratch Script"
        automaticUndo: no
        callback: ->
          openScript "nf_Scratch.jsx"

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
  treeView.preferredSize = [220, 250]

  for key of toolRegistry
    category = toolRegistry[key]
    thisCategoryNode = treeView.add 'node', category.name

    for toolKey of category.tools
      thisTool = category.tools[toolKey]
      thisToolItem = thisCategoryNode.add 'item', thisTool.name
      thisToolItem.data = thisTool

    thisCategoryNode.expanded = no

  buttonGroup = buttonPanel.add 'group', undefined

  goButton = buttonGroup.add('button', undefined, 'Do it!')

  goButton.onClick = (w) ->
    choice = treeView.selection.data if treeView.selection?.data && treeView.selection?.type is 'item'
    return alert "No Tool Selected!" unless choice?
    app.beginUndoGroup "NF Tool: #{choice.name}" unless choice.automaticUndo is no
    choice.callback()
    @active = false
    app.endUndoGroup() unless choice.automaticUndo is no

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
