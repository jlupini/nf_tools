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
