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
  @returns {CompItem} the MainComp
  ###
  mainComp: ->
    foundItems = NFProject.searchItems "MainComp"
    mainComp = foundItems[0]
    throw new Error "Cannot find MainComp! Did you change the name?" unless mainComp?
    return mainComp

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
    scriptFile = "script.txt"
    instructionFile = "instructions.csv"

    # Test both files
    throw new Error "Cannot read #{scriptFile}" unless NFTools.testProjectFile scriptFile
    throw new Error "Cannot read #{instructionFile}" unless NFTools.testProjectFile instructionFile

    # Let's import the script first, and break it into lines
    scriptString = NFTools.readProjectFile scriptFile
    testChar = "\xA9" # The copyright symbol
    dirtyScriptArray = scriptString.split(testChar)
    scriptLines = []
    # Clean empty elements and Trim newlines
    for element in dirtyScriptArray
      #scriptArray.push element.trim()
      if element isnt ""
        trimmed = element.trim()
        splitElement = trimmed.split(/\[(.*?)\]/g)
        lineObj =
          instruction: splitElement[1].trim().slice(1, -1)
          text: splitElement[2]?.trim() or ""
        scriptLines.push lineObj

    # Now let's import the instructions with timecodes
    instructionString = NFTools.readProjectFile instructionFile
    instructionArray = instructionString.splitCSV()

    # Match up lines with ranges of words from the instruction array
    testLineIdx = 0
    testLine = ""
    rangeString = ""
    startIdx = 0
    endIdx = 0
    growCount = 0
    growThreshold = 3
    simValues = []
    parsedLines = []
    i = 1
    # FIXME: Deal with the possibility of the first testLine being empty texted
    NFTools.log "Comparing lines...", "Importer"
    while testLineIdx isnt scriptLines.length
      # If we're on the last line, save some time by just grabbing whatever's left
      if testLineIdx is scriptLines.length - 1
        assumedLineTimecodes = instructionArray.slice i
        assumedSentence = ("#{theWord[1]} " for theWord in assumedLineTimecodes).join("")
        NFTools.log "Last line - grabbing whatever's left: '#{assumedSentence}'", "Importer"
        parsedLines.push
          instruction: testLine.instruction
          text: testLine.text
          timecodes: assumedLineTimecodes
        break

      # Grab the testLine
      if testLine.text isnt scriptLines[testLineIdx].text
        testLine = scriptLines[testLineIdx]
        NFTools.log "Test Line:   '#{testLine.text}'", "Importer"

      # We start at 1 because the first line is headers.
      tc = instructionArray[i][0]
      word = instructionArray[i][1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()

      # Adjust the indecies and add to the rangeString (stripped of whitespace in lowercase) ^
      if rangeString is ""
        startIdx = i
        rangeString = word
      else
        rangeString += " #{word}"

      # Check the similarity value
      simValues[i] = NFTools.similarity rangeString, testLine.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()
      # Increment the growCount if the sim value is growing
      if simValues[i] > simValues[i-1] then growCount++ else growCount = 0

      # If the growCount has reached the threshold, assume that we're now
      # getting further away from the right range.
      if growCount >= growThreshold
        # First, stuff the simValues with '1' so we can perform basic math on it *facepalm*
        simValues = simValues.stuff 1
        # Get the index of the smallest value we hit
        endIdx = simValues.indexOf Math.min.apply(Math, simValues)
        # Make a new array of the range for what we think is this line
        assumedLineTimecodes = instructionArray.slice startIdx, endIdx + 1
        assumedSentence = ("#{theWord[1]} " for theWord in assumedLineTimecodes).join("")
        NFTools.log "Best result: '#{assumedSentence}'", "Importer"
        parsedLines.push
          instruction: testLine.instruction
          text: testLine.text
          timecodes: assumedLineTimecodes

        # Reset the rangeString and simValues
        simValues = []
        rangeString = ""
        growCount = 0
        # Move the iterator back to the last word we grabbed (because it's about to increment anyway)
        i = endIdx
        # Grab the next testLine
        testLineIdx++
        NFTools.log "MOVING ON...", "Importer"

      i++

    NFTools.log "Done Importing!", "Importer"
    $.bp()


    return null

  ###*
  Follow an instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
  ###
  followInstruction: (input) ->

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
        switch instruction.instruction
          when NFLayoutInstruction.SHOW_TITLE
            NFTools.log "Following Instruction: #{instruction.display}", "Parser"
            mainComp.animateTo
              page: targetPDF.getTitlePage()
          when NFLayoutInstruction.ICON_SEQUENCE, NFLayoutInstruction.GAUSSY, NFLayoutInstruction.FIGURE, NFLayoutInstruction.TABLE
            NFTools.log "Following Instruction: #{instruction.display}", "Parser"
            mainComp.addGaussy
              placeholder: instruction.display
          else throw new Error "There isn't a case for this instruction"
        @
      else throw new Error "Instruction not found"
    @
