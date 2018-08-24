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
    parentPath = (new File($.fileName)).parent.fsName
    relPath = if filename[0] is "/" then filename else "/#{filename}"
    theFile = new File(parentPath + relPath)

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

    # Skip parsing if the instruction starts with a backslash
    if input[0] is "\\"
      NFTools.log "Ignoring instruction", "parseInstructionString"
      NFTools.logLine()
      return new NFLayoutInstruction
        raw: input
        flags: {}
        instruction: NFLayoutInstructionIgnore

    if input[0] is "!"
      strippedInput = input.substr 1
      shouldBreak = yes
    else
      strippedInput = input
      shouldBreak = no

    # Get a PDF Number from the input, if any
    targetPDFNumber = /(^\d+)/i.exec(strippedInput)
    targetPDFNumber = targetPDFNumber[1] if targetPDFNumber?
    if targetPDFNumber?
      instructionString = strippedInput.slice(targetPDFNumber.length)
      NFTools.log "Target PDF Number found: '#{targetPDFNumber}'", "parseInstructionString"
    else
      instructionString = strippedInput

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
      break: shouldBreak

  ###*
  Imports the script (script.txt) and the instructions (transcript.csv) files.
  Compares the two of them to combine.
  @memberof NFTools
  @param {boolean} [detailedAnalysis=no] - if a detailed analysis should be done
  @returns {Object[]} an Array of line objects with 'instruction', 'text', and
  'timecodes' keys
  ###
  readAndCombineScriptAndInstructions: (detailedAnalysis = no) ->

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

    sentenceFromInstructionRange = (fromVal, toVal) ->
      testTimecodes = instructionArray.slice fromVal, toVal + 1
      return ("#{theWord[1]} " for theWord in testTimecodes).join("").trim()

    # Takes the line, and a instruction range, and returns the similarity value
    rangeComparison = (model) ->
      # model =
      #   model.line
      #   model.from
      #   model.to
      testSentence = cleanLine sentenceFromInstructionRange(model.from, model.to)
      lineSentence = cleanLine model.line.text
      return retObj =
        match: NFTools.similarity testSentence, lineSentence
        line: model.line
        from: model.from
        to: model.to

    findBestRange = (model) ->
      model =
        testStart: model.testStart
        testEnd: model.testEnd
        startDelta: model.startDelta ? 0
        endDelta: model.endDelta ? 0
        maxTests: model.maxTests ? 100
        method: model.method

      # NFTools.log "Testing method '#{model.method}'", "Fuck it"

      testCount = 0
      growCount = 0
      growThreshold = 2
      comparisons = []
      while growCount <= growThreshold and testCount <= model.maxTests
        # NFTools.log "Trying #{testStart}-#{testEnd}", "Fuck it"
        lastComparison = comparisons[comparisons.length-1] if comparisons.length
        comparison = rangeComparison
          line: testLine
          from: testStart
          to: testEnd
        comparisons.push comparison

        growCount++ if lastComparison?.match < comparison.match
        testCount++

        # Adjust test range for next round
        testEnd += model.endDelta
        testStart += model.startDelta

        # Break if going out of bounds or end and start switch
        break if testStart < 1 or testEnd > instructionArray.length
        break if testEnd < testStart

      # look for the best value we found
      bestComparison = null
      for testComparison in comparisons
        if not bestComparison? or testComparison.match < bestComparison.match
          bestComparison = testComparison
      bestComparison.method = model.method
      # NFTools.log "Method '#{model.method}' had a best match of #{bestComparison.match}", "Fuck it"
      return bestComparison

    comprehensiveRangeTest = (model) ->
      # Get best ranges for a few different directions
      testResults = []
      testResults.push findBestRange
        testStart: testStart
        testEnd: testEnd
        endDelta: 1
        method: "Growing Tail"

      testResults.push findBestRange
        testStart: testStart
        testEnd: testEnd
        endDelta: -1
        method: "Shrinking Tail"

      if detailedAnalysis
        testResults.push findBestRange
          testStart: testStart
          testEnd: testEnd
          startDelta: -1
          endDelta: -1
          maxTests: 20
          method: "Shifting Back"

        testResults.push findBestRange
          testStart: testStart
          testEnd: testEnd
          startDelta: 1
          endDelta: 1
          maxTests: 20
          method: "Shifting Forward"

        testResults.push findBestRange
          testStart: testStart
          testEnd: testEnd
          startDelta: -2
          endDelta: -1
          maxTests: 20
          method: "Growing Backwards"

        testResults.push findBestRange
          testStart: testStart
          testEnd: testEnd
          startDelta: 1
          endDelta: 2
          maxTests: 20
          method: "Growing Forwards"

      # look for the best value we found
      bestComparison = null
      for testComparison in testResults
        if not bestComparison? or testComparison.match < bestComparison.match
          bestComparison = testComparison
      return bestComparison


    NFTools.log "Comparing lines...\n", "readAndCombineScriptAndInstructions"
    winners = []
    for testLineIdx in [0..scriptLines.length-1]
      testLine = scriptLines[testLineIdx]
      lastWinner = if winners.length then winners[winners.length-1] else null
      NFTools.log "Test Line:   '#{cleanLine testLine.text}'", "readAndCombineScriptAndInstructions"

      # May as well begin with the same number of words in the line
      wordCount = testLine.text.split(' ').length
      testStart = if lastWinner? then lastWinner.to + 1 else 1
      testEnd = testStart + wordCount

      # Handle empty lines
      if testLine.text is ""
        winners.push dummy =
          from: testStart
          to: testStart - 1
          line: testLine
          method: "None"
          match: 0
        NFTools.log "Empty test line - moving on", "readAndCombineScriptAndInstructions"
      else
        bestComparison = comprehensiveRangeTest
          testStart: testStart
          testEnd: testEnd
        winners.push bestComparison
        NFTools.log "Best result: '#{cleanLine sentenceFromInstructionRange(bestComparison.from, bestComparison.to)}'", "readAndCombineScriptAndInstructions"
        NFTools.log "Method '#{bestComparison.method}' is the winner, with range #{bestComparison.from}-#{bestComparison.to}", "readAndCombineScriptAndInstructions"

        if lastWinner? and lastWinner.to >= bestComparison.from
          NFTools.logLine()
          NFTools.log "NOTE: last result shifted back, so we're moving the previous one...", "readAndCombineScriptAndInstructions"
          lastWinner.to = bestComparison.from - 1
          NFTools.log "Prev test Line:   '#{cleanLine lastWinner.line.text}'", "readAndCombineScriptAndInstructions"
          NFTools.log "Adjusted match:   '#{cleanLine sentenceFromInstructionRange(lastWinner.from, lastWinner.to)}'", "readAndCombineScriptAndInstructions"
          winners[winners.length-2] = lastWinner

      NFTools.logLine()

    parsedLines = []
    for comparison in winners
      # Fake an entry for timecode if the script line was blank.
      if comparison.to < comparison.from
        beforeTC = if comparison.to <= 1 then 0 else instructionArray[comparison.to][0]
        afterTC = instructionArray[comparison.from][0]
        averageTC = (parseFloat(beforeTC) + parseFloat(afterTC)) / 2
        timecodes = [[averageTC, '', '']]
      else
        timecodes = instructionArray.slice comparison.from, comparison.to + 1

      parsedLine =
        instruction: comparison.line.instruction
        text: comparison.line.text
        timecodes: timecodes
      parsedLines.push parsedLine

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
    res = NFTools.levenshtein(str1, str2) / n
    return res


  ###*
  Returns the levenshtein value of two strings, aka how different they are. The
  higher the number, the bigger the difference.
  @memberof NFTools
  @param {String} str1
  @param {String} str2
  @returns {int} the result
  ###
  levenshtein: (a, b) ->
    if a.length == 0
      return b.length
    if b.length == 0
      return a.length
    matrix = []
    # increment along the first column of each row
    i = undefined
    i = 0
    while i <= b.length
      matrix[i] = [ i ]
      i++
    # increment each column in the first row
    j = undefined
    j = 0
    while j <= a.length
      matrix[0][j] = j
      j++
    # Fill in the rest of the matrix
    i = 1
    while i <= b.length
      j = 1
      while j <= a.length
        if b.charAt(i - 1) == a.charAt(j - 1)
          matrix[i][j] = matrix[i - 1][j - 1]
        else
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1))
          # deletion
        j++
      i++
    matrix[b.length][a.length]
