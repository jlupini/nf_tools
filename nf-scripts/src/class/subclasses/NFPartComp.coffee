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
    throw "Can't create an NFPartComp from a non-part comp" unless @name.indexOf("Part") >= 0
    @

  toString: ->
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

  ###*
  Gets the active PDF at an optional time
  @memberof NFPartComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFPDF | null} The active PDF or null if none active
  ###
  activePDF: (time) ->
    activePage = @activePage(time)
    return activePage?.getPDF()

  ###*
  Gets the active NFPageLayer at a time (or current time by default). In this
  case, that means the topmost Page Layer that is not folded back, invisible,
  disabled, pre-start or post-end.
  @memberof NFPartComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFPageLayer | null} The active page layer or null if none
  ###
  activePage: (time) ->
    # Set the current time to the test time, but we'll need to set it back later.
    if time?
      originalTime = @getTime()
      @setTime(time)

    activePage = null
    activeLayers = @activeLayers()
    until activeLayers.isEmpty()
      topLayer = activeLayers.getTopmostLayer()
      if topLayer instanceof NFPageLayer
        if topLayer.pageTurnStatus() isnt NFPageLayer.PAGETURN_FLIPPED_UP and topLayer.property("Transform").property("Opacity").value is 100
          activePage = topLayer
          break

      activeLayers.remove(topLayer)

    @setTime originalTime if originalTime?
    return activePage
