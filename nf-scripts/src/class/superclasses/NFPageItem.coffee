###
#    NF PAGE ITEM
#
#    The composition page item
#
###
class NFPageItem
  constructor: (item) ->
    # FIXME: Check to make sure we've been given a valid item and throw error if not
    @item = item
    @name = @item.name
    @
# Instance Methods
NFPageItem:: = Object.assign NFPageItem::,
  getInfo: ->
    return "NFPageItem: '#{@name}'"
  # Returns the PDF number as a String
  getPDFNumber: ->
    # Assuming every page number is two digits long
    endIdx = @name.indexOf("_")
    return @name.substr(0, endIdx) if endIdx > 0
    throw "Could not get the PDF Number from this NFPageItem"
  # Returns the page number as a String
  getPageNumber: ->
    # Assuming every page number is two digits long
    searchIndex = @name.indexOf("pg")
    return @name.substr(searchIndex + 2, 2) if searchIndex > 0
    throw "Could not get the Page Number from this NFPageItem"
  # Returns the NFHighlightLayerCollection of layers in this pageItem
  highlights: ->
    # We're working with AVLayers here
    sourceLayers = NF.Util.collectionToArray(@item.layers)
    highlightLayers = new NFHighlightLayerCollection()
    for theLayer in sourceLayers
      if NFHighlightLayer.isHighlightLayer(theLayer)
        highlightLayers.addAVLayer(theLayer)
    return highlightLayers
