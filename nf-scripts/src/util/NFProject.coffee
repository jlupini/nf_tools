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
  Follow an instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
  ###
  followInstruction: (input) ->

    # Get a PDF Number from the input, if any
    mainComp = @activeComp()
    throw new Error "Can only run instruction on a part comp" unless mainComp instanceof NFPartComp
    targetPDFNumber = /(^\d+)/i.exec(input)
    targetPDFNumber = targetPDFNumber[1] if targetPDFNumber?
    if targetPDFNumber?
      instructionString = input.slice(targetPDFNumber.length)
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

    instruction = null
    # Look for an instruction
    if instructionString isnt ""
      for key of NFLayoutInstructionDict
        option = NFLayoutInstructionDict[key]
        for code in option.code
          if instructionString.indexOf(code) >= 0
            if instruction?
              # If there's already an instruction found found, get the highest priority one
              if option.priority? and instruction.priority? and option.priority < instruction.priority
                instruction = option
              else if (option.priority? and instruction.priority?) or (not option.priority? and not instruction.priority?)
                throw new Error "instruction matched two instruction options (#{instruction.display} and #{option.display}) with the same priority. Check layoutDictionary."
              else if option.priority?
                instruction = option
            else
              instruction = option
      throw new Error "No instruction matches instruction string" unless instruction?

    # OK, now we have four key pieces of information: the instruction, flags, the current PDF and the active PDF

    # If we have a PDF to go to but no instruction, assume we should bring in
    # the title page
    if targetPDF? and not instruction?
      titlePage = targetPDF.getTitlePage()
      mainComp.animateTo
        page: titlePage

    # if the instruction is a highlight, let's call animateTo
    else if instruction.type is NFLayoutType.HIGHLIGHT
      highlight = targetPDF.findHighlight instruction.look
      throw new Error "Can't find highlight with name '#{instruction.look}' in PDF '#{targetPDF.toString()}'" unless highlight?

      mainComp.animateTo
        highlight: highlight
        skipTitle: flags.skipTitle

    else if instruction.type is NFLayoutType.INSTRUCTION
      if instruction.instruction is NFLayoutInstruction.SHOW_TITLE
        mainComp.animateTo
          page: targetPDF.getTitlePage()
      else
        # FIXME: FINISH BUILDING this
        @
      @

    @
