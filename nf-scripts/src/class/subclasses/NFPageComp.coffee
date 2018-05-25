###*
Creates a new NFPageComp from a given CompItem
@class NFPageComp
@classdesc NF Wrapper object for a page CompItem
@extends NFComp
@param {CompItem} comp - the CompItem to wrap
@property {CompItem} comp - the CompItem
###
class NFPageComp extends NFComp
  constructor: (comp) ->
    NFComp.call(this, comp)
    throw "Can't create an NFPageComp from a non-page comp" unless @name.indexOf("NFPage") >= 0
    @
  toString: ->
    return "NFPageComp: '#{@name}'"

  ###*
  Returns the PDF number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the PDF number
  ###
  getPDFNumber: ->
    endIdx = @name.indexOf("_")
    return @name.substr(0, endIdx) if endIdx > 0
    throw "Could not get the PDF Number from this NFPageComp"

  ###*
  Returns the page number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the page number
  ###
  getPageNumber: ->
    # Assuming every page number is two digits long
    searchIndex = @name.indexOf("pg")
    return @name.substr(searchIndex + 2, 2) if searchIndex > 0
    throw "Could not get the Page Number from this NFPageComp"

  ###*
  Gets the Highlight layers in this item
  @memberof NFPageComp
  @returns {NFHighlightLayerCollection} highlight layers in this pageComp
  ###
  highlights: ->
    # We're working with AVLayers here
    sourceLayers = NF.Util.collectionToArray(@comp.layers)
    highlightLayers = new NFHighlightLayerCollection()
    for theLayer in sourceLayers
      if NFHighlightLayer.isHighlightLayer(theLayer)
        highlightLayers.addLayer(theLayer)
    return highlightLayers

  ###*
  Returns the NFHighlight with a given name in this comp, or null if none found
  @memberof NFPageComp
  @param {string} name - the name to search for
  @returns {NFHighlightLayer | null} The found highlight or null
  ###
  highlightWithName: (name) ->
    for highlight in @highlights().layers
      return highlight if highlight.getName() is name
    return null
