###*
NFTools Namespace
@namespace NFTools
###
NFTools =

  ###*
  Returns the current time (of world, not comp)
  @memberof NFTools
  @returns {time} the time
  ###
  now: ->
    d = new Date()
    return d.getTime()


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
