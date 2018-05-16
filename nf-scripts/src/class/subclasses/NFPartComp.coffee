###
#    NF Part Comp
#
#    subclass of NFComp
#    A part composition which can contain pageLayers and other such things
#
###
class NFPartComp extends NFComp
  constructor: (comp) ->
    NFComp.call(this, comp)
    # FIXME: Check to make sure we've been given a valid comp and throw error if not
    throw "Can't create an NFPartComp without a given comp" unless comp?
    @comp = comp
    @name = @comp.name
    @
  # MARK: Instance Methods
  getInfo: ->
    return "NFPartComp: '#{@name}'"
