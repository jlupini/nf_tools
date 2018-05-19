###*
Creates a new NFPageItem from a given CompItem
@class NFPageItem
@classdesc NF Wrapper object for a page CompItem
@param {CompItem} item - the CompItem to wrap
@property {CompItem} item - the CompItem
###
class NFPageItem
  constructor: (item) ->
    # FIXME: Check to make sure we've been given a valid item and throw error if not
    @item = item
    @name = @item.name
    @
  getInfo: ->
    return "NFPageItem: '#{@name}'"

  ###*
  Returns the PDF number as a String
  @memberof NFPageItem
  @throws Throws error if the number could not be found in this item
  @returns {string} the PDF number
  ###
  getPDFNumber: ->
    # Assuming every page number is two digits long
    endIdx = @name.indexOf("_")
    return @name.substr(0, endIdx) if endIdx > 0
    throw "Could not get the PDF Number from this NFPageItem"

  ###*
  Returns the page number as a String
  @memberof NFPageItem
  @throws Throws error if the number could not be found in this item
  @returns {string} the page number
  ###
  getPageNumber: ->
    # Assuming every page number is two digits long
    searchIndex = @name.indexOf("pg")
    return @name.substr(searchIndex + 2, 2) if searchIndex > 0
    throw "Could not get the Page Number from this NFPageItem"

  ###*
  Gets the Highlight layers in this item
  @memberof NFPageItem
  @returns {NFHighlightLayerCollection} highlight layers in this PageItem
  ###
  highlights: ->
    # We're working with AVLayers here
    sourceLayers = NF.Util.collectionToArray(@item.layers)
    highlightLayers = new NFHighlightLayerCollection()
    for theLayer in sourceLayers
      if NFHighlightLayer.isHighlightLayer(theLayer)
        highlightLayers.addLayer(theLayer)
    return highlightLayers
