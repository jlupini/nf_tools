###
#    NF Part Comp
#
#    subclass of NFComp
#    A part composition which can contain pageLayers and other such things
#
###
NFPartComp = (comp) ->
  NFComp.call(this, comp)
  # FIXME: Check to make sure we've been given a valid comp and throw error if not
  throw "Can't create an NFPartComp without a given comp" unless comp?
  @comp = comp
  @name = @comp.name
  @
# Instance Methods
NFPartComp:: = Object.assign new NFComp(),
  getInfo: ->
    return "NFPartComp: '#{@name}'"
