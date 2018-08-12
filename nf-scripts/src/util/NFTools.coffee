###*
NFTools Namespace
@namespace NFTools
###
NFTools =

  # Change me to stop or start logging to log.txt
  logging: yes

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
      return "#{fileText}\n#{newEntry}"

    null

  ###*
  Adds a section break to log.txt
  @memberof NFTools
  @returns {null} null
  ###
  breakLog: ->
    return null unless NFTools.logging
    NFTools.editFile "../log.txt", (fileText) =>
      return fileText + "\n-----------------------------\n\n\n"
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
  Converts a String from a CSV file to an array of arrays
  @memberof NFTools
  @returns {Array} the array from the CSV
  ###
  parseCSV: (sep) ->

    # splitted = text.split ','
    # return splitted
    foo = @split(sep = sep or ',')
    x = foo.length - 1
    tl = undefined
    while x >= 0
      if foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"'
        if (tl = foo[x].replace(/^\s+"/, '"')).length > 1 and tl.charAt(0) == '"'
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"')
        else if x
          foo.splice x - 1, 2, [
            foo[x - 1]
            foo[x]
          ].join(sep)
        else
          foo = foo.shift().split(sep).concat(foo)
      else
        foo[x].replace /""/g, '"'
      x--
    foo
