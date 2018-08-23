###*
NFTools Namespace
@namespace NFTools
###
NFTools =

  # Change me to stop or start logging to log.txt
  logging: yes

  ###*
  Returns if a given object is empty
  @memberof NFTools
  @param {object} obj - the object to test
  @returns {boolean} the result
  ###
  isEmpty: (obj) ->
    for prop of obj
      if obj.hasOwnProperty(prop)
        return false
    return JSON.stringify(obj) == JSON.stringify({})

  ###*
  Returns the current time (of world, not comp)
  @memberof NFTools
  @returns {time} the time
  ###
  now: ->
    d = new Date()
    return d.getTime()

  ###*
  Returns the current timestamp, nicely formatted (of world, not comp)
  @memberof NFTools
  @returns {string} the timestamp
  ###
  timestamp: ->
    # Create a date object with the current time
    now = new Date
    # Create an array with the current month, day and time
    date = [
      now.getMonth() + 1
      now.getDate()
      now.getFullYear()
    ]
    # Create an array with the current hour, minute and second
    time = [
      now.getHours()
      now.getMinutes()
      now.getSeconds()
    ]
    # Determine AM or PM suffix based on the hour
    suffix = if time[0] < 12 then 'AM' else 'PM'
    # Convert hour from military time
    time[0] = if time[0] < 12 then time[0] else time[0] - 12
    # If hour is 0, set it to 12
    time[0] = time[0] or 12
    # If seconds and minutes are less than 10, add a zero
    i = 1
    while i < 3
      if time[i] < 10
        time[i] = '0' + time[i]
      i++
    # Return the formatted string
    return date.join('/') + ' ' + time.join(':') + ' ' + suffix

  ###*
  Opens a file with a given path, and lets you work with the file using a
  callback function. File will be created if it does not already exist.
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {function} fn - the callback function which should return the new file
  contents
  @example
  NFTools.openFile "../log.txt", (theFileText) =>
    return "Layer number #{i} is called #{layer.getName()}"
  @returns {null} null
  ###
  editFile: (filename, fn) ->
    theFile = new File filename

    if theFile.exists

      openCheck = theFile.open("r");
      unless openCheck
        throw new Error "Can't open the File with read permissions!"
      theFileText = theFile.read()

      closeCheck = theFile.close()
      unless closeCheck
        throw new Error "Can't close the File!"

    else
      encoding = 'utf-8'
      theFile.encoding = encoding

    openCheck = theFile.open("w")
    unless openCheck
      throw new Error "Can't open the File with write permissions"

    newFileText = fn theFileText
    writeCheck = theFile.write newFileText
    unless writeCheck
      throw new Error "Can't write to the File!"

    closeCheck = theFile.close();
    unless closeCheck
      throw new Error "Can't close the File!"

    return null

  ###*
  Opens a file and clears it.
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @returns {null} null
  ###
  clearFile: (filename) ->
    NFTools.editFile filename, (fileText) =>
      return ""

    return null

  ###*
  Reads a file relative to the current AE project
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {boolean} [fixLineBreaks=true] replace file line breaks with standard
  js line breaks
  @example fileString = readFile "citations.csv"
  @returns {String} the file contents
  ###
  readProjectFile: (filename, fixLineBreaks = true) ->
    file_contents = undefined
    start_folder = new Folder(app.project.file.parent.fsName)
    file_handle = new File(start_folder.fsName + '/' + filename)
    if !file_handle.exists
      throw new Error('I can\'t find this file: \'' + filename + '\'. \n\nI looked in here: \'' + start_folder.fsName + '\'.')
    try
      file_handle.open 'r'
      file_contents = file_handle.read()
    catch e
      throw new Error('I couldn\'t read the given file: ' + e)
    finally
      file_handle.close()

    if fixLineBreaks
      return NFTools.fixLineBreaks file_contents
    else
      file_contents

  ###*
  Checks to see if a file exists relative to the current AE project
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @returns {boolean} Whether the file can be read or not
  ###
  testProjectFile: (filename) ->
    file_contents = undefined
    start_folder = new Folder(app.project.file.parent.fsName)
    file_handle = new File(start_folder.fsName + '/' + filename)
    if !file_handle.exists
      return false
    try
      file_handle.open 'r'
      file_contents = file_handle.read()
    catch e
      return false
    finally
      file_handle.close()
    if file_contents?
      return true


  ###*
  Reads a file and returns the contents as a string
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {boolean} [fixLineBreaks=true] replace file line breaks with standard
  js line breaks
  @example fileString = readFile "expressions/expressionfile.js"
  @returns {String} the file contents
  ###
  readFile: (filename, fixLineBreaks = true) ->
    file_contents = undefined
    start_folder = new Folder(new File($.fileName).parent.fsName)
    file_handle = new File(start_folder.fsName + '/' + filename)
    if !file_handle.exists
      throw new Error('I can\'t find this file: \'' + filename + '\'. \n\nI looked in here: \'' + start_folder.fsName + '\'.')
    try
      file_handle.open 'r'
      file_contents = file_handle.read()
    catch e
      throw new Error('I couldn\'t read the given file: ' + e)
    finally
      file_handle.close()

    if fixLineBreaks
      return NFTools.fixLineBreaks file_contents
    else
      file_contents

  fixLineBreaks: (text) ->
    return text.replace(/\n\n/g, '\n \n')


  ###*
  Reads an expression .js file and returns the contents as a string. Looks in
  `expressions/` folder.
  @memberof NFTools
  @param {String} expName - The name of the script. No path or extension.
  @param {Object} [replacementDict] - a dictionary of search/replace keys in the
  file.
  @example fileString = readExpression "expressionfile"
  @throw Throws error if search value could not be found
  @throw Throws error if file cannot be found
  @throw Throws error if file cannot be read
  @returns {String} the expression as a string
  ###
  readExpression: (expName, replacementDict) ->
    filename = "expressions/#{expName}.js"
    file_contents = NFTools.readFile filename

    if replacementDict?
      for k of replacementDict
        file_contents = file_contents.replace k, replacementDict[k]

    return file_contents

  ###*
  Logs a message to log.txt
  @memberof NFTools
  @param {String} message - The message to log
  @param {String} sender - The lender to attribute the message to
  @returns {null} null
  ###
  log: (message, sender = "") ->
    return null unless NFTools.logging
    NFTools.editFile "../log.txt", (fileText) =>
      now = new Date()
      timestamp = NFTools.timestamp()

      newEntry = "[#{timestamp}] (#{sender}) > #{message}"
      return "#{fileText}\r\n#{newEntry}"

    null

  ###*
  Adds a line break to the log
  @memberof NFTools
  @returns {null} null
  ###
  logLine: ->
    return null unless NFTools.logging
    NFTools.editFile "../log.txt", (fileText) =>
      return fileText + "\r\n"
    null

  ###*
  Adds a section break to log.txt
  @memberof NFTools
  @returns {null} null
  ###
  breakLog: ->
    return null unless NFTools.logging
    NFTools.editFile "../log.txt", (fileText) =>
      return fileText + "\r\n-----------------------------\r\n\r\n"
    null

  ###*
  Clears log.txt
  @memberof NFTools
  @returns {null} null
  ###
  clearLog: ->
    return null unless NFTools.logging
    NFTools.clearFile "../log.txt"
    null

  ###*
  Parse each instruction in the parsedLines object and return an array of
  parsed instruction objects. Properties on each object are: `raw`, `pdf`,
  `flags`, `instruction`, `time`, `line`, and `assumptions`.
  @memberof NFProject
  @param {Object[]} parsedLines - the parsedLines object to parse
  @returns {NFLayoutInstruction[]} the instruction object array
  ###
  parseInstructions: (parsedLines) ->
    parsedInstructions = []
    prevInstruction = null
    NFTools.log "Parsing instructions...", "parseInstructions"
    NFTools.logLine()
    for line in parsedLines

      # Build the object
      layoutInstruction = NFTools.parseInstructionString line.instruction
      layoutInstruction.time = line.timecodes[0][0]
      layoutInstruction.line = line.text
      if prevInstruction?
        layoutInstruction.prev = prevInstruction
        prevInstruction.next = layoutInstruction
      parsedInstructions.push prevInstruction if prevInstruction?
      prevInstruction = layoutInstruction
    parsedInstructions.push prevInstruction

    # Log that shit
    NFTools.log "Finished parsing instructions. Result:", "parseInstructions"
    for parsed in parsedInstructions
      pad = (str, len) ->
        str = str.toString()
        if str.length < len
          return str + new Array(len - str.length).join(" ")
        else return str
      logString = "At #{pad parsed.time, 6} "
      if parsed.pdf?
        logString += "in PDF #{pad parsed.pdf, 4} "
      else
        logString += "           "
      logString += "instruction    #{pad parsed.instruction.display, 20} "
      unless NFTools.isEmpty parsed.flags
        logString += "with flags: "
      for key of parsed.flags
        logString += "'#{parsed.flags[key].display}', "
      logString += "from raw input '#{parsed.raw}'"
      NFTools.log logString, "parseInstructions"
    NFTools.logLine()

    parsedInstructions


  ###*
  Parse an instruction string (ie. "41g"). The basic methodology here is to
  remove each peice one by one as they're recognized and see what's left at the
  end.
  @memberof NFProject
  @param {string} input - the input to parse
  @returns {NFLayoutInstruction} the instruction object
  ###
  parseInstructionString: (input) ->

    NFTools.log "Parsing instruction: '#{input}'", "parseInstructionString"
    # Get a PDF Number from the input, if any
    targetPDFNumber = /(^\d+)/i.exec(input)
    targetPDFNumber = targetPDFNumber[1] if targetPDFNumber?
    if targetPDFNumber?
      instructionString = input.slice(targetPDFNumber.length)
      NFTools.log "Target PDF Number found: '#{targetPDFNumber}'", "parseInstructionString"
    else
      instructionString = input

    flags = {}
    # Look for any flags and remove them for later
    for key of NFLayoutFlagDict
      flagOption = NFLayoutFlagDict[key]
      for code in flagOption.code
        if instructionString.indexOf(code) >= 0
          flags[key] = flagOption
          instructionString = instructionString.replace(code, "").trim()
          NFTools.log "Flag found: '#{flagOption.display}'", "parseInstructionString"


    if instructionString isnt ""
      # Look for an instruction
      instruction = null
      NFTools.log "Instruction string remaining: '#{instructionString}'", "parseInstructionString"
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
        if not instruction? and option.regex?
          # Check for a regex if no instruction was found
          regexResult = option.regex.exec instructionString
          if regexResult?
            instruction = option



      if instruction?
        NFTools.log "Instruction found: '#{instruction.display}'", "parseInstructionString"

    unless instruction?
      NFTools.log "No Instruction found.", "parseInstructionString"
      if instructionString is ""
        instruction = NFLayoutInstructionNone
      else
        instruction = NFLayoutInstructionNotFound

      NFTools.logLine()

    # OK, now we have three key pieces of information: the instruction, flags, the PDF
    # Put together the object we're returning
    parsedObject = new NFLayoutInstruction
      raw: input
      pdf: targetPDFNumber
      flags: flags
      instruction: instruction

  ###*
  Imports the script (script.txt) and the instructions (transcript.csv) files.
  Compares the two of them to combine.
  @memberof NFTools
  @returns {Object[]} an Array of line objects with 'instruction', 'text', and
  'timecodes' keys
  ###
  readAndCombineScriptAndInstructions: ->

    # Removes punctuation, line breaks, and converts to lower case
    cleanLine = (line) ->
      cleaned = line.toLowerCase()
      cleaned = cleaned.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
      removeLineBreaks cleaned
    removeLineBreaks = (line) ->
      return line.replace(/(\r\n\t|\n|\r\t)/gm," ")
    getMinSim = (vals) ->
      vals = vals.stuff 1
      return Math.min.apply(Math, vals)
    toPercent = (ratio) ->
      return Math.round((1 - ratio) * 100) + "%"

    scriptFile = "script.txt"
    instructionFile = "transcript.csv"

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

    # Takes the line index, and a instruction range, and returns the similarity value
    compareRange = (model) ->
      # model =
      #   model.line
      #   model.from
      #   model.to
      testTimecodes = instructionArray.slice model.from, model.to + 1
      testSentence = cleanLine (("#{theWord[1]} " for theWord in testTimecodes).join("").trim())
      lineSentence = cleanLine scriptLines[model.line].text
      return retObj =
        match: NFTools.similarity testSentence, lineSentence
        line: model.line
        from: model.from
        to: model.to


    # Match up lines with ranges of words from the instruction array
    testLineIdx = 0
    testLine = ""
    rangeString = ""
    startIdx = 0
    endIdx = 0
    growCount = 0
    growThreshold = 3
    minSims = []
    simValues = []
    parsedLines = []
    i = 1
    # FIXME: Deal with the possibility of the first testLine being empty texted
    NFTools.log "Comparing lines...", "readAndCombineScriptAndInstructions"
    while testLineIdx isnt scriptLines.length
      # If we're on the last line, save some time by just grabbing whatever's left
      if testLineIdx is scriptLines.length - 1
        assumedLineTimecodes = instructionArray.slice i
        assumedSentence = ("#{theWord[1]} " for theWord in assumedLineTimecodes).join("").trim()
        sim = NFTools.similarity cleanLine(assumedSentence), testLineText
        minSims.push sim
        NFTools.log "Last line - grabbing whatever's left: '#{cleanLine assumedSentence}' at #{assumedLineTimecodes[0][0]}", "readAndCombineScriptAndInstructions"
        NFTools.log "Match: #{toPercent sim}", "readAndCombineScriptAndInstructions"
        NFTools.logLine()
        parsedLines.push
          instruction: testLine.instruction
          text: removeLineBreaks testLine.text
          timecodes: assumedLineTimecodes
        break

      # Grab the testLine
      if testLine.text isnt scriptLines[testLineIdx].text
        testLine = scriptLines[testLineIdx]
        testLineText = cleanLine testLine.text
        NFTools.log "Test Line:   '#{testLineText}'", "readAndCombineScriptAndInstructions"


      # We start at 1 because the first line is headers.
      tc = instructionArray[i][0]
      word = instructionArray[i][1]

      # If we have an empty testLine, push a timecode halfway between this and the next one.
      if testLineText is ""
        # Make a fake timecode halfway betweeen the one we're looking at now
        # and the previous one.
        prevTC = if i is 1 then 0 else instructionArray[i-1][0]
        customTC = (parseFloat(tc) + parseFloat(prevTC)) / 2
        assumedLineTimecodes = [[customTC, '', '']]
        parsedLines.push
          instruction: testLine.instruction
          text: ""
          timecodes: assumedLineTimecodes
        NFTools.log "Empty test line at #{assumedLineTimecodes[0][0]} - moving on", "readAndCombineScriptAndInstructions"
        NFTools.logLine()
        testLineIdx++
      else
        # Adjust the indecies and add to the rangeString (stripped of whitespace in lowercase) ^
        if rangeString is ""
          startIdx = i
          rangeString = word
        else
          rangeString += " #{word}"
        rangeString = cleanLine rangeString

        # Check the similarity value
        simValues[i] = NFTools.similarity rangeString, testLineText
        # Increment the growCount if the sim value is growing
        if simValues[i] > simValues[i-1] then growCount++ else growCount = 0

        # If the growCount has reached the threshold, assume that we're now
        # getting further away from the right range.
        if growCount >= growThreshold
          minSim = getMinSim simValues
          minSims.push minSim
          endIdx = simValues.indexOf minSim
          # Make a new array of the range for what we think is this line
          assumedLineTimecodes = instructionArray.slice startIdx, endIdx + 1
          assumedSentence = ("#{theWord[1]} " for theWord in assumedLineTimecodes).join("").trim()
          NFTools.log "Best result: '#{cleanLine assumedSentence}' at #{assumedLineTimecodes[0][0]}", "readAndCombineScriptAndInstructions"
          NFTools.log "Match: #{toPercent minSim}", "readAndCombineScriptAndInstructions"
          NFTools.logLine()
          parsedLines.push
            instruction: testLine.instruction
            text: removeLineBreaks testLine.text
            timecodes: assumedLineTimecodes

          # Reset the rangeString and simValues
          simValues = []
          rangeString = ""
          growCount = 0
          # Move the iterator back to the last word we grabbed (because it's about to increment anyway)
          i = endIdx
          # Grab the next testLine
          testLineIdx++
        i++

    # Get the average match ratio score
    sum = 0
    sum += val for val in minSims
    avg = sum / minSims.length
    NFTools.log "Average match: #{toPercent avg}", "readAndCombineScriptAndInstructions"
    NFTools.logLine()

    NFTools.log "Done Importing!", "readAndCombineScriptAndInstructions"
    NFTools.logLine()
    return parsedLines

  ###*
  Returns the similarity value of two strings, relative to their length.
  This number is effectively the percentage of characters that would need to
  change to make them the same
  @memberof NFTools
  @param {String} str1
  @param {String} str2
  @returns {int} the result
  ###
  similarity: (str1, str2) ->
    unless typeof str1 is 'string' and typeof str2 is 'string'
      throw new Error "Can't compare similarity of non-strings"
    n = Math.max(str1.length, str2.length)
    return NFTools.levenshtein(str1, str2) / n


  ###*
  Returns the levenshtein value of two strings, aka how different they are. The
  higher the number, the bigger the difference.
  @memberof NFTools
  @param {String} str1
  @param {String} str2
  @returns {int} the result
  ###
  levenshtein: (str1, str2) ->
    cost = new Array
    n = str1.length
    m = str2.length

    minimum = (a, b, c) ->
      min = a
      if b < min
        min = b
      if c < min
        min = c
      min

    if n == 0
      return
    if m == 0
      return
    i = 0
    while i <= n
      cost[i] = new Array
      i++
    i = 0
    while i <= n
      cost[i][0] = i
      i++
    j = 0
    while j <= m
      cost[0][j] = j
      j++
    i = 1
    while i <= n
      x = str1.charAt(i - 1)
      j = 1
      while j <= m
        y = str2.charAt(j - 1)
        if x == y
          cost[i][j] = cost[i - 1][j - 1]
        else
          cost[i][j] = 1 + minimum(cost[i - 1][j - 1], cost[i][j - 1], cost[i - 1][j])
        j++
      #endfor
      i++
    #endfor
    cost[n][m]
