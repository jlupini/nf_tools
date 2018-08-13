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
    throw new Error "Can't create an NFPageComp from a non-page comp" unless @getName().indexOf("NFPage") >= 0
    @
  toString: ->
    return "NFPageComp: '#{@getName()}'"

  ###*
  Returns the PDF number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the PDF number
  ###
  getPDFNumber: ->
    endIdx = @getName().indexOf("_")
    return @getName().substr(0, endIdx) if endIdx > 0
    throw new Error "Could not get the PDF Number from this NFPageComp"

  ###*
  Returns the page number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the page number
  ###
  getPageNumber: ->
    # Assuming every page number is two digits long
    searchIndex = @getName().indexOf "pg"
    endIdx = @getName().indexOf " NFPage"
    return @getName().substr(searchIndex + 2, endIdx) if searchIndex > 0
    throw new Error "Could not get the Page Number from this NFPageComp"

  ###*
  Returns the NFPDF this page lives in
  @memberof NFPageComp
  @returns {NFPDF} the PDF
  ###
  getPDF: ->
    return NFPDF.fromPDFNumber @getPDFNumber()

  ###*
  Returns the base page name (everything before the space)
  @memberof NFPageComp
  @returns {String} the page base name
  ###
  getPageBaseName: ->
    return @getName().substr(0, @getName().indexOf(' '))

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
        highlightLayers.add(theLayer)
    return highlightLayers

  ###*
  Returns the NFHighlight with a given name in this comp, or null if none found
  @memberof NFPageComp
  @param {string} name - the name to search for
  @returns {NFHighlightLayer | null} The found highlight or null
  ###
  highlightWithName: (name) ->
    foundHighlight = null
    @highlights().forEach (highlight) =>
      foundHighlight = highlight if highlight.getName() is name
    return foundHighlight
