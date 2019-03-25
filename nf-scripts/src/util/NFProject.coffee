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
  Returns the root FolderItem
  @memberof NFProject
  @returns {Folderitem} the root folder item
  ###
  rootFolder: ->
    return app.project.rootFolder

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
        lookString = layoutInstruction.expandLookString or layoutInstruction.instruction.look
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
            targetPDF = NFPDF.fromPDFNumber layoutInstruction.getPDF() unless targetPDF?

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
              targetPDF = NFPDF.fromPDFNumber layoutInstruction.getPDF()
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
      for ins in layoutInstructions
        NFTools.log "Invalid Instruction [#{ins.raw}]: #{ins.validationMessage}" unless ins.valid
      NFTools.log "Validation completed with errors!", "validateInstructions"
    else
      NFTools.log "Validation completed with no errors!", "validateInstructions"
    NFTools.logLine()
    return returnObj =
      layoutInstructions: validatedInstructions
      valid: !anyInvalid

  ###*
  Looks for PDFs that straddle the part markers.
  @memberof NFProject
  @param {Object} instructions - the parsed instructions object
  @returns {Object[] | null} A straddlers object to be passed to #fixStraddlers, or null
  ###
  searchForStraddlers: (instructions) ->
    straddlingInstructions = []

    mainComp = NFProject.mainComp()
    audioLayer = mainComp.audioLayers().getBottommostLayer()
    audioMarkers = audioLayer.markers()

    markerTimes = []
    markerTimes.push audioMarkers.keyTime i for i in [1..audioMarkers.numKeys]

    # Make a new array with the instruction that comes immediately after each marker
    subsequentInstructions = []
    for ins in instructions
      if markerTimes[subsequentInstructions.length] <= ins.time
        subsequentInstructions.push ins

        # We found the instruction after the marker. Let's explore it.

        # First, what's the PDF from the intruction before this one?
        pdfBefore = ins.prev.getPDF()

        # If there are any expand or highlight instructions AFTER the fold
        # which share this PDF number, ITS A STRADDLE!
        testIns = ins
        straddling = no
        while testIns? and testIns.getPDF() is pdfBefore
          if testIns.instruction.type is NFLayoutType.HIGHLIGHT or testIns.instruction.type is NFLayoutType.EXPAND
            straddling = yes
            break
          testIns = testIns.next

        straddlingInstructions.push ins if straddling

      break if subsequentInstructions.length is markerTimes.length

    return null if straddlingInstructions.length is 0

    return straddlingInstructions



  ###*
  Moves the part markers to fix straddlers. Needs to be passed the output of
  #searchForStraddlers.
  @memberof NFProject
  @param {Object[]} straddlers - the straddlers object
  @returns {null}
  ###
  fixStraddlers: (straddlers) ->
    allComps = NFProject.allPartComps()
    allComps.push NFProject.mainComp()

    # For each straddler, first find the instruction we need to move the marker
    # before, then... actually do it.
    for straddler in straddlers
      keyPDF = straddler.getPDF()
      testIns = straddler
      while testIns.prev? and testIns.prev.getPDF() is keyPDF
        testIns = testIns.prev

      # Now testIns is the first instruction of the key PDF
      # Let's move the markers
      for thisComp in allComps
        audioLayer = thisComp.audioLayers().getBottommostLayer()
        audioMarkers = audioLayer.markers()

        nearestKeyIndex = audioMarkers.nearestKeyIndex straddler.time
        oldMarkerTime = audioMarkers.keyTime nearestKeyIndex
        markerValue = audioMarkers.keyValue nearestKeyIndex
        markerComment = markerValue.comment
        audioMarkers.removeKey nearestKeyIndex

        audioLayer.addMarker
          time: testIns.time - thisComp.comp.frameDuration
          comment: markerComment + " - ADJUSTED"

        if oldMarkerTime-1 < audioLayer.layer.inPoint < oldMarkerTime+1
          oldOutPoint = audioLayer.layer.outPoint
          audioLayer.layer.inPoint = testIns.time - thisComp.comp.frameDuration
          audioLayer.layer.outPoint = oldOutPoint
      null



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
    thisType = instruction.instruction.type
    if not instruction.pdf? and thisType is NFLayoutType.HIGHLIGHT or thisType is NFLayoutType.EXPAND or thisType is NFLayoutType.INSTRUCTION
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
