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
  Imports the script (script.txt) and the instructions (transcript.csv) files.
  Adds the guide layers for both to each part comp.
  @memberof NFProject
  @throws Throw error if script.txt or transcript.csv are not in the project
  directory or cannot be read.
  @returns {null} nothin'
  ###
  importScript: ->
    shouldImport = confirm "Import Script?", false, "Import?"
    return null unless shouldImport

    shouldUseCache = no
    if app.tmp?.parsedLines?
      shouldUseCache = confirm "Cached script/instruction data found. Use the
                                cached data? Select NO if you've changed the
                                script.txt or transcript.csv files since
                                the last import.", false, "Cached Data"
    if shouldUseCache
      NFTools.log "Loading cached script/instructions...", "importScript"
      NFTools.logLine()
      parsedLines = app.tmp.parsedLines
    else
      NFTools.log "Importing from files...", "importScript"
      NFTools.logLine()
      shouldUseDetail = confirm "Would you like to do a detailed analysis on the
                                 script? Accuracy is higher but it takes twice
                                 as long to process. Only do this if standard
                                 analysis gave messed up results.", true, "Detailed Analysis"
      parsedLines = NFTools.readAndCombineScriptAndInstructions shouldUseDetail
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
             transcript.csv or script.txt files, you'll need to re-import."
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
  Returns whether there are broken highlights in the project
  @memberof NFProject
  @returns {boolean} If there are broken highlights
  ###
  containsBrokenHighlights: ->
    allHighlights = NFProject.allHighlights()
    brokenHighlights = no
    allHighlights.forEach (highlight) =>
      highlight.resetExpressionErrors()
      brokenHighlights = yes if highlight.isBroken()
    return brokenHighlights

  ###*
  Takes a single NFLayoutInstruction and lays it out at the current time in the
  current part
  @memberof NFProject
  @param {NFLayoutInstruction} layoutInstruction
  @returns {String} A message to display to the user
  ###
  layoutSingleInstruction: (layoutInstruction) ->
    activeComp = NFProject.activeComp()
    unless activeComp instanceof NFPartComp
      return "Cannot layout an instruction in a non-part comp."

    if NFProject.containsBrokenHighlights()
      return "Aborting AutoLayout!\nThere are broken highlights in some page
              comps. Fix before running again."

    # if the instruction is a highlight, let's call animateTo
    switch layoutInstruction.instruction.type
      when NFLayoutType.HIGHLIGHT
        # For highlights and expands we need a target PDF, so use this method instead of layoutInstruction.pdf
        targetPDF = NFPDF.fromPDFNumber layoutInstruction.getPDF()
        lookString = layoutInstruction.instruction.look
        highlight = targetPDF.findHighlight lookString
        throw new Error "Can't find highlight with name '#{lookString}' in PDF '#{targetPDF.toString()}'" unless highlight?

        NFTools.log "Animating to highlight '#{lookString}'", "autoLayout"
        activeComp.animateTo
          highlight: highlight
          time: layoutInstruction.time
          skipTitle: layoutInstruction.flags.skipTitle
      when NFLayoutType.EXPAND
        # For highlights and expands we need a target PDF, so use this method instead of layoutInstruction.pdf
        targetPDF = NFPDF.fromPDFNumber layoutInstruction.getPDF()
        lookString = layoutInstruction.expandLookString
        highlight = targetPDF.findHighlight lookString
        throw new Error "Can't find highlight with name '#{lookString}' in PDF '#{targetPDF.toString()}'" unless highlight?

        NFTools.log "Animating to highlight '#{lookString}'", "autoLayout"
        activeComp.animateTo
          highlight: highlight
          time: layoutInstruction.time
          skipTitle: layoutInstruction.flags.skipTitle
      when NFLayoutType.INSTRUCTION
        targetPDF = NFPDF.fromPDFNumber layoutInstruction.pdf # Use only explicit PDFs here
        switch layoutInstruction.instruction.behavior
          when NFLayoutBehavior.SHOW_TITLE
            NFTools.log "Following Instruction: #{layoutInstruction.instruction.display}", "autoLayout"
            activeComp.animateTo
              time: layoutInstruction.time
              page: targetPDF.getTitlePage()
          when NFLayoutBehavior.ICON_SEQUENCE, NFLayoutBehavior.GAUSSY, NFLayoutBehavior.FIGURE, NFLayoutBehavior.TABLE
            NFTools.log "Following Instruction: #{layoutInstruction.instruction.display}", "autoLayout"
            activeComp.addGaussy
              placeholder: "[#{layoutInstruction.raw}]"
              time: layoutInstruction.time
          when NFLayoutBehavior.UNRECOGNIZED, NFLayoutBehavior.DO_NOTHING
            if targetPDF?
              NFTools.log "PDF found but no instruction - animating to title page", "autoLayout"
              titlePage = targetPDF.getTitlePage()
              activeComp.animateTo
                time: layoutInstruction.time
                page: titlePage
            NFTools.log "Adding placeholder for [#{layoutInstruction.raw}]", "autoLayout"
            activeComp.addPlaceholder
              text: "[#{layoutInstruction.raw}]"
              time: instructionTime
          when NFLayoutBehavior.NONE
            if targetPDF?
              NFTools.log "PDF found but no instruction - animating to title page", "autoLayout"
              titlePage = targetPDF.getTitlePage()
              activeComp.animateTo
                time: layoutInstruction.time
                page: titlePage

          else
            throw new Error "There isn't a case for this instruction"
      else
        throw new Error "Instruction not found"
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

    if NFProject.containsBrokenHighlights()
      return "Aborting AutoLayout!\nThere are broken highlights in some page
              comps. Fix before running again."

    NFTools.log "Beginning layout!", "autoLayout"
    lastPart = null
    for layoutInstruction in layoutInstructions
      # Figure out which part to work in.
      instructionTime = parseFloat layoutInstruction.time
      thisPart = NFProject.partForTime instructionTime
      # Trim the previous part if we're in a new one
      if lastPart? and not thisPart.is lastPart
        NFTools.logLine()
        NFTools.log "New part - Trimming previous one.", "autoLayout"
        lastPart.trimTo instructionTime + 10

      NFTools.logLine()
      NFTools.logLine()
      NFTools.log "Laying out instruction [#{layoutInstruction.raw}] in #{thisPart.getName()}", "autoLayout"

      $.bp() if layoutInstruction.break

      # if the instruction is a highlight, let's call animateTo
      switch layoutInstruction.instruction.type
        when NFLayoutType.HIGHLIGHT, NFLayoutType.EXPAND
          # For highlights and expands we need a target PDF, so use this method instead of layoutInstruction.pdf
          targetPDF = NFPDF.fromPDFNumber layoutInstruction.getPDF()
          lookString = layoutInstruction.expandLookString ? layoutInstruction.instruction.look
          highlight = targetPDF.findHighlight lookString
          throw new Error "Can't find highlight with name '#{lookString}' in PDF '#{targetPDF.toString()}'" unless highlight?

          NFTools.log "Animating to highlight '#{lookString}'", "autoLayout"
          thisPart.animateTo
            highlight: highlight
            time: instructionTime
            skipTitle: layoutInstruction.flags.skipTitle
            expand: layoutInstruction.flags.expand
            expandUp: layoutInstruction.flags.expandUp
        when NFLayoutType.INSTRUCTION
          targetPDF = NFPDF.fromPDFNumber layoutInstruction.pdf # Use only explicit PDFs here
          switch layoutInstruction.instruction.behavior
            when NFLayoutBehavior.SHOW_TITLE
              NFTools.log "Following Instruction: #{layoutInstruction.instruction.display}", "autoLayout"
              thisPart.animateTo
                time: instructionTime
                page: targetPDF.getTitlePage()
            when NFLayoutBehavior.ICON_SEQUENCE, NFLayoutBehavior.GAUSSY, NFLayoutBehavior.FIGURE, NFLayoutBehavior.TABLE
              NFTools.log "Following Instruction: #{layoutInstruction.instruction.display}", "autoLayout"
              thisPart.addGaussy
                placeholder: "[#{layoutInstruction.raw}]"
                time: instructionTime
            when NFLayoutBehavior.UNRECOGNIZED, NFLayoutBehavior.DO_NOTHING
              if targetPDF?
                NFTools.log "PDF found but no instruction - animating to title page", "autoLayout"
                titlePage = targetPDF.getTitlePage()
                thisPart.animateTo
                  time: instructionTime
                  page: titlePage
              NFTools.log "Adding placeholder for [#{layoutInstruction.raw}]", "autoLayout"
              thisPart.addPlaceholder
                text: "[#{layoutInstruction.raw}]"
                time: instructionTime
            when NFLayoutBehavior.NONE
              if targetPDF?
                NFTools.log "PDF found but no instruction - animating to title page", "autoLayout"
                titlePage = targetPDF.getTitlePage()
                thisPart.animateTo
                  time: instructionTime
                  page: titlePage

            else
              throw new Error "There isn't a case for this instruction"
        else
          throw new Error "Instruction not found"
      # catch error
      #   return "Aborting AutoLayout!\nError Message: '#{error.message}'\nFailed Instruction: [#{layoutInstruction.raw}]"
      #   break



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
      else if i is audioMarkers.numKeys and time >= markerTime
        partName += (i+1)
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
      thisValid = ins.validate()
      # ins = NFProject.validateSingleInstruction ins
      anyInvalid = yes unless thisValid
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
    instruction = NFTools.parseInstructionString input

    # Assign the instruction the current active comp time
    instruction.time = NFProject.activeComp().getTime()

    # Assign the instruction the current active PDF if none given
    if not instruction.pdf? and instruction.instruction.type is NFLayoutType.HIGHLIGHT or instruction.instruction.type is NFLayoutType.EXPAND
       activePDF = NFProject.activeComp().activePDF()
       instruction.pdf = activePDF.getPDFNumber() if activePDF?

    # Ask for the expand look string manually if needed
    if instruction.flags.expand?
      lookString = prompt 'Enter the look string for the expand:', '', 'AutoLayout'
      if lookString? and lookString isnt ''
        instruction.expandLookString = lookString
      else
        return alert "Aborting - I need to know the look string for the expand."

    valid = instruction.validate()
    if valid
      result = NFProject.layoutSingleInstruction instruction
    else
      return alert "Aborting - Invalid instruction.\nValidator says: #{instruction.validationMessage}"

    alert result if result?
