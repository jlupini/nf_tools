###*
Creates a new NFObject
@class NFObject
@classdesc Superclass for all NF objects
###
class NFObject
  constructor: () ->
    @

  # MARK: Instance Methods
  toString: ->
    return "NFObject"

  ###*
  Logs a message to log.txt
  @memberof NFObject
  @param {String} message - The message to log
  @returns {null} null
  ###
  log: (message) ->
    NFTools.log message, @toString()

  ###*
  Clears log.txt
  @memberof NFObject
  @returns {null} null
  ###
  clearLog: ->
    NFTools.clearLog()

  ###*
  Adds a section break to log.txt
  @memberof NFObject
  @returns {null} null
  ###
  breakLog: ->
    NFTools.breakLog()
