###*
NFProject Namespace
@namespace NFProject
###
NFProject =

  ###*
  Looks for all items which contain the search string and returns an array of
  them.
  @memberof NFProject
  @param {string} searchString - the string to search for
  @param {FolderItem} [sourceFolder] - optional source folder
  @returns {Item[]} array of matches or an empty array
  ###
  searchItems: (searchString, sourceFolder) ->
    searchBase = sourceFolder ? app.project
    allItems = []
    i = 1
    while i <= searchBase.items.length
      thisItem = searchBase.items[i]
      if thisItem.name.indexOf(searchString) >= 0
        allItems.push thisItem
      i++
    return allItems

  ###*
  Looks for an item globally in the project. Returns first item found. Exact name
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
  ###
  findItem: (itemName) ->
    i = 1
    while i <= app.project.items.length
      thisItem = app.project.items[i]
      if thisItem.name == itemName
        return thisItem
      i++
    null

  ###*
  Returns the MainComp
  @memberof NFProject
  @returns {NFComp} the MainComp
  ###
  mainComp: ->
    foundItems = NFProject.searchItems "MainComp"
    mainComp = foundItems[0]
    throw new Error "Cannot find MainComp! Did you change the name?" unless mainComp?
    return new NFComp mainComp

  ###*
  Returns an array of all part comps in the project
  @memberof NFProject
  @returns {NFPartComp[]} An array of part comps
  ###
  allPartComps: ->
    folder = NFProject.findItem "Parts"
    items = NFProject.searchItems("Part", folder)
    parts = []
    for item in items
      parts.push new NFPartComp item
    return parts

  ###*
  Returns the Active Comp
  @memberof NFProject
  @returns {CompItem | null} the active CompItem or null
  ###
  activeComp: ->
    activeItem = app.project.activeItem
    if activeItem instanceof CompItem
      return new NFComp activeItem
    else
      return null

  ###*
  Returns an NFLayerCollection of selected layers in the active comp
  @memberof NFProject
  @returns {NFLayerCollection} - the selected layers
  ###
  selectedLayers: ->
    return NFProject.activeComp().selectedLayers()

  ###*
  Given a string with the name of an item to find and it's parent folder,
  returns the folderItem, or null of none is found.
  @memberof NFProject
  @param {string} itemName - the string to search for
  @param {FolderItem} sourceFolderItem - the folder to look in
  @returns {Item | null} the found item or null
  ###
  findItemIn: (itemName, sourceFolderItem) ->
    i = 1
    while i <= sourceFolderItem.numItems
      if sourceFolderItem.item(i).name == itemName
        return sourceFolderItem.item(i)
      i++
    null

  ###*
  Returns the currently active NFComp
  @memberof NFProject
  @returns {NFComp | NFPartComp | NFPageComp} the found item or null
  ###
  activeComp: ->
    return NFComp.specializedComp app.project.activeItem

  ###*
  Returns all the page comps in the project
  @memberof NFProject
  @returns {NFPageComp[]} an array of NFPageComp items
  ###
  allPageComps: ->
    pageComps = []
    precompFolder = NFProject.findItem "PDF Precomps"
    unless precompFolder?.typeName is "Folder"
      throw new Error "Couldn't find the PDF Precomp folder"
    for i in [1..precompFolder.numItems]
      item = precompFolder.item i
      pageComps.push new NFPageComp item
    return pageComps

  ###*
  Returns all the highlight layers in the project
  @memberof NFProject
  @returns {NFHighlightLayerCollection} the collection of highlight layers
  ###
  allHighlights: ->
    pageComps = NFProject.allPageComps()
    allHighlights = new NFHighlightLayerCollection()
    for pageComp in pageComps
      pageHighlights = pageComp.highlights()
      pageHighlights.forEach (highlight) ->
        allHighlights.add highlight
    return allHighlights

  ###*
  Imports the script (script.txt) and the instructions (instructions.csv) files.
  Adds the guide layers for both to each part comp.
  @memberof NFProject
  @throws Throw error if script.txt or instructions.csv are not in the project
  directory or cannot be read.
  @returns {null} nothin'
  ###
  importScript: ->
    alert "About to import and combine the script and instructions.\nThis can
           take a few minutes, so check 'log.txt' to stay updated as it runs."

    shouldUseCache = no
    if app.tmp?.parsedLines?
      shouldUseCache = confirm "Cached script/instruction data found. Use the
                                cached data? Select NO if you've changed the
                                script.txt or instructions.csv files since
                                the last import.", false, "Cached Data"
    if shouldUseCache
      NFTools.log "Loading cached script/instructions...", "importScript"
      NFTools.logLine()
      parsedLines = app.tmp.parsedLines
    else
      NFTools.log "Importing from files...", "importScript"
      NFTools.logLine()
      parsedLines = NFTools.readAndCombineScriptAndInstructions()
    app.tmp =
      parsedLines: parsedLines

    parsedInstructions = NFTools.parseInstructions parsedLines

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

    shouldContinue = confirm "Import complete! Continue to Validation?", false, 'Validation'
    return null unless shouldContinue

    validationResult = NFProject.validateInstructions parsedInstructions

    if not validationResult.valid
      alert "Validation failed!\nCheck log for details. I've cached
             the import data, so as long as you just need to fix things
             in the AE project, you won't need to wait for all the script
             matching next time. However, if you modify anything in the
             instructions.csv or script.txt files, you'll need to re-import."
      return null
    else
      shouldContinue = confirm "Validation successful!\nWould you like to run
                                AutoLayout now? It takes a while and you won't
                                be able to stop the process once it begins.", false, 'AutoLayout'
    return null unless shouldContinue
    autoLayoutStatus = NFProject.autoLayout validationResult.layoutInstructions
    alert autoLayoutStatus

    return null

  ###*
  Takes a set of validated layoutInstructions and lays out the whole project.
  @memberof NFProject
  @param {NFLayoutInstruction[]} layoutInstructions
  @returns {String} A message to display to the user
  ###
  autoLayout: (layoutInstructions) ->
    # Check if there are existing pages in any parts
    allParts = NFProject.allPartComps()
    existingPages = no
    for part in allParts
      part.allLayers().forEach (layer) =>
        existingPages = yes if layer instanceof NFPageLayer
    if existingPages
      return "Aborting AutoLayout!\nIt looks like there are already pages in
              one or more part comps. Clean up and try again."

    NFTools.log "Beginning layout!", "autoLayout"
    lastPart = null
    for layoutInstruction in layoutInstructions
      # Figure out which part to work in.
      thisPart = NFProject.partForTime layoutInstruction.time
      # Trim the previous part if we're in a new one
      if lastPart? and not thisPart.is lastPart
        NFTools.log "New part - Trimming previous one.", "autoLayout"
        thisPart.trimTo layoutInstruction.time + 10


      NFTools.log "Laying out instruction [#{layoutInstruction.raw}] in #{thisPart.getName()}", "autoLayout"


      # Get some information about which PDF we're on and which one we need
      activePDF = thisPart.activePDF()
      activePDFNumber = activePDF?.getPDFNumber()
      alreadyOnTargetPaper = if layoutInstruction.pdf? then activePDFNumber is layoutInstruction.pdf else true
      targetPDF = if alreadyOnTargetPaper then activePDF else NFPDF.fromPDFNumber(layoutInstruction.pdf)

      # # Do the autolayout
      # # If we have a PDF to go to but no instruction, assume we should bring in
      # # the title page
      # if targetPDF? and layoutInstruction.instruction.behavior is NFLayoutBehavior.NONE?
      #   NFTools.log "PDF found but no instruction - animating to title page", "Parser"
      #   titlePage = targetPDF.getTitlePage()
      #   mainComp.animateTo
      #     page: titlePage
      #
      # # if the instruction is a highlight, let's call animateTo
      # else switch instruction.type
      #   when NFLayoutType.HIGHLIGHT
      #     highlight = targetPDF.findHighlight instruction.look
      #     throw new Error "Can't find highlight with name '#{instruction.look}' in PDF '#{targetPDF.toString()}'" unless highlight?
      #
      #     NFTools.log "Animating to #{instruction.display}", "Parser"
      #     mainComp.animateTo
      #       highlight: highlight
      #       skipTitle: flags.skipTitle
      #       expand: flags.expand
      #       expandUp: flags.expandUp
      #
      #   when NFLayoutType.EXPAND
      #     NFTools.log "Animating to #{instruction.display}", "Parser"
      #     # FIXME: Need to build this out so that the relevant expand highlight
      #     # can be determined and checked from the previous instructions
      #
      #   when NFLayoutType.INSTRUCTION
      #     switch instruction.instruction
      #       when NFLayoutBehavior.SHOW_TITLE
      #         NFTools.log "Following Instruction: #{instruction.display}", "Parser"
      #         mainComp.animateTo
      #           page: targetPDF.getTitlePage()
      #       when NFLayoutBehavior.ICON_SEQUENCE, NFLayoutBehavior.GAUSSY, NFLayoutBehavior.FIGURE, NFLayoutBehavior.TABLE
      #         NFTools.log "Following Instruction: #{instruction.display}", "Parser"
      #         mainComp.addGaussy
      #           placeholder: instruction.display
      #       else throw new Error "There isn't a case for this instruction"
      #     @
      #   else throw new Error "Instruction not found"




      lastPart = thisPart


    return "AutoLayout Complete"


  ###*
  Returns the part comp that contains a given time
  @memberof NFProject
  @param {float} time - the time to find the part for
  @returns {NFPartComp} The matching NFPartComp
  ###
  partForTime: (time) ->
    mainComp = NFProject.mainComp()
    audioLayer = mainComp.audioLayers().getBottommostLayer()
    audioMarkers = audioLayer.markers()
    partName = "Part"
    for i in [1..audioMarkers.numKeys]
      markerTime = audioMarkers.keyTime i
      if time < markerTime
        partName += i
        break
    matchingPart = null
    NFProject.allPartComps().forEach (partComp) =>
      matchingPart = partComp if partComp.getName() is partName
    return matchingPart


  ###*
  Checks the instructions against the project to make sure there aren't any
  missing highlights/expands, etc.
  @memberof NFProject
  @param {NFLayoutInstruction[]} layoutInstructions
  @returns {Object} An object with the validated 'layoutInstructions' and
  a boolean value 'valid' to indicate success or failure
  ###
  validateInstructions: (layoutInstructions) ->
    NFTools.log "Validating Instructions...", "validateInstructions"
    validatedInstructions = []
    anyInvalid = no
    expands = []
    for ins in layoutInstructions
      ins.valid = yes
      ins.validationMessage = ""

      # If there's a native PDF, make sure it exists
      if ins.pdf?
        targetPDF = NFPDF.fromPDFNumber(ins.pdf)
        if not targetPDF?
          ins.valid = no
          ins.validationMessage += "Missing PDF: '#{ins.pdf}'. "
      else
        targetPDF = null

      # If there's a highlight, make sure it exists on the relevant PDF
      if ins.getInstruction().type is NFLayoutType.HIGHLIGHT
        targetPDF = NFPDF.fromPDFNumber(ins.getPDF()) unless targetPDF?
        highlightLook = ins.getInstruction().look
        if ins.flags.expand?
          if ins.flags.expandUp?
            # First, figure out which expandUp this is...
            matchedExpands = []
            for exp in expands
              # If we've encountered an expand with the same PDF and highlight
              sameInstruction = exp.getInstruction().look is highlightLook
              samePDF = exp.getPDF() is ins.getPDF()
              matchedExpands.push exp if sameInstruction and samePDF and exp.flags.expandUp?
            ins.expandUpNumber = matchedExpands.length + 1
            if ins.expandUpNumber is 1
              lookString = "#{highlightLook} Expand Up"
            else
              lookString = "#{highlightLook} Expand Up #{ins.expandUpNumber}"
            highlight = targetPDF?.findHighlight lookString
          else
            # First, figure out which expand this is...
            matchedExpands = []
            for exp in expands
              # If we've encountered an expand with the same PDF and highlight
              sameInstruction = exp.getInstruction().look is highlightLook
              samePDF = exp.getPDF() is ins.getPDF()
              matchedExpands.push exp if sameInstruction and samePDF and not exp.flags.expandUp?
            ins.expandNumber = matchedExpands.length + 1
            if ins.expandNumber is 1
              lookString = "#{highlightLook} Expand"
            else
              lookString = "#{highlightLook} Expand #{ins.expandNumber}"
            highlight = targetPDF?.findHighlight lookString
          expands.push ins
          if not highlight?
            ins.valid = no
            ins.validationMessage += "Missing expand '#{lookString}' in PDF #{ins.getPDF()}"
        else
          highlight = targetPDF?.findHighlight ins.instruction.look
          if not highlight?
            ins.valid = no
            ins.validationMessage += "Missing highlight '#{ins.instruction.look}' in PDF #{ins.getPDF()}"

      if ins.valid is no
        anyInvalid = yes
        NFTools.log "Invalid Instruction [#{ins.raw}]. Reasons: #{ins.validationMessage}", "validateInstructions"

      ins.validated = yes
      validatedInstructions.push ins

    if anyInvalid
      NFTools.log "Validation completed with errors!", "validateInstructions"
    else
      NFTools.log "Validation completed with no errors!", "validateInstructions"
    NFTools.logLine()
    return returnObj =
      layoutInstructions: validatedInstructions
      valid: !anyInvalid

  ###*
  Follow a single instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
  ###
  followInstruction: (input) ->
    # FIXME: This needs to be re-written for one-offs now...
    NFTools.log "Parsing input: '#{input}'", "Parser"
    # Get a PDF Number from the input, if any
    mainComp = @activeComp()
    throw new Error "Can only run instruction on a part comp" unless mainComp instanceof NFPartComp
    targetPDFNumber = /(^\d+)/i.exec(input)
    targetPDFNumber = targetPDFNumber[1] if targetPDFNumber?
    if targetPDFNumber?
      instructionString = input.slice(targetPDFNumber.length)
      NFTools.log "Target PDF Number found: '#{targetPDFNumber}'", "Parser"
    else
      instructionString = input

    # Get some information about which PDF we're on and which one we need
    activePDF = mainComp.activePDF()
    activePDFNumber = activePDF?.getPDFNumber()
    alreadyOnTargetPaper = if targetPDFNumber? then activePDFNumber is targetPDFNumber else true
    targetPDF = if alreadyOnTargetPaper then activePDF else NFPDF.fromPDFNumber(targetPDFNumber)

    flags = {}
    # Look for any flags and remove them for later
    for key of NFLayoutFlagDict
      flagOption = NFLayoutFlagDict[key]
      for code in flagOption.code
        if instructionString.indexOf(code) >= 0
          flags[key] = flagOption
          instructionString = instructionString.replace(code, "").trim()
          NFTools.log "Flag found: '#{flagOption.display}'", "Parser"

    # If we've only got expand/expandup flags and there's nothing else left,
    # we can assume those should be instructions instead.
    if instructionString is ""
      if flags.expand?
        NFTools.log "No instruction remaining. Converting Flag '#{flags.expand.display}' to Instruction", "Parser"
        instruction = NFLayoutInstructionDict.expand
        delete flags.expand
      else
        throw new Error "No instructionString remaining after parsing flags and PDF"
    else
      # Look for an instruction
      instruction = null
      NFTools.log "Instruction string remaining is: '#{instructionString}'", "Parser"
      for key of NFLayoutInstructionDict
        option = NFLayoutInstructionDict[key]
        for code in option.code
          if instructionString is code
            if instruction?
              # If there's already an instruction found found, get the highest priority one
              if option.priority? and instruction.priority? and option.priority < instruction.priority
                instruction = option
              else if (option.priority? and instruction.priority?) or (not option.priority? and not instruction.priority?)
                throw new Error "instruction matched two instruction options (#{instruction.display} and #{option.display}) with the same priority. Fix layoutDictionary."
              else if option.priority?
                instruction = option
            else
              instruction = option

      if instruction?
        NFTools.log "Instruction found: '#{instruction.display}'", "Parser"
      else
        throw new Error "No instruction matches instruction string"

    # OK, now we have four key pieces of information: the instruction, flags, the current PDF and the active PDF

    # FIXME: Pickup here and deal with the various expand flags and instructions that could have arrived...

    # If we have a PDF to go to but no instruction, assume we should bring in
    # the title page
    if targetPDF? and not instruction?
      NFTools.log "PDF found but no instruction - animating to title page", "Parser"
      titlePage = targetPDF.getTitlePage()
      mainComp.animateTo
        page: titlePage

    # if the instruction is a highlight, let's call animateTo
    else switch instruction.type
      when NFLayoutType.HIGHLIGHT
        highlight = targetPDF.findHighlight instruction.look
        throw new Error "Can't find highlight with name '#{instruction.look}' in PDF '#{targetPDF.toString()}'" unless highlight?

        NFTools.log "Animating to #{instruction.display}", "Parser"
        mainComp.animateTo
          highlight: highlight
          skipTitle: flags.skipTitle
          expand: flags.expand
          expandUp: flags.expandUp

      when NFLayoutType.EXPAND
        NFTools.log "Animating to #{instruction.display}", "Parser"
        # FIXME: Need to build this out so that the relevant expand highlight
        # can be determined and checked from the previous instructions

      when NFLayoutType.INSTRUCTION
        switch instruction.behavior
          when NFLayoutBehavior.SHOW_TITLE
            NFTools.log "Following Instruction: #{instruction.display}", "Parser"
            mainComp.animateTo
              page: targetPDF.getTitlePage()
          when NFLayoutBehavior.ICON_SEQUENCE, NFLayoutBehavior.GAUSSY, NFLayoutBehavior.FIGURE, NFLayoutBehavior.TABLE
            NFTools.log "Following Instruction: #{instruction.display}", "Parser"
            mainComp.addGaussy
              placeholder: instruction.display
          else throw new Error "There isn't a case for this instruction"
        @
      else throw new Error "Instruction not found"
    @
