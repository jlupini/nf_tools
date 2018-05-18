###*
Creates a new NFPartComp and sets its comp property.
@class NFPartComp
@classdesc NF Wrapper object for a CompItem used as a part comp that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFPartComp
@param {CompItem} comp - the CompItem for this NFPartComp
@extends NFComp
@throws Will throw an error if not given a valid CompItem at initialization
###
class NFPartComp extends NFComp
  constructor: (comp) ->
    NFComp.call(this, comp)
    # FIXME: Check to make sure we've been given a valid part comp and throw error if not
    throw "Can't create an NFPartComp without a given comp" unless comp?
    @comp = comp
    @name = @comp.name
    @

  ###*
  Returns a string representation of the object
  @memberof NFPartComp
  @override
  @returns {string} string representation of the object
  ###
  getInfo: ->
    return "NFPartComp: '#{@name}'"

  ###*
  Gets the zoomer layer
  @memberof NFPartComp
  @override
  @throws Will throw an error if the zoomer comp cannot be found
  @returns {NFLayer} The zoomer NFLayer
  ###
  getZoomer: ->
    zoomer = @layerWithName 'Zoomer'
    throw "This NFPartComp has no zoomer!" unless zoomer?
    return zoomer
