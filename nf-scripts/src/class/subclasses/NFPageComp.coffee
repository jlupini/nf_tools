###*
Creates a new NFPageComp from a given CompItem
@class NFPageComp
@classdesc NF Wrapper object for a page CompItem
@extends NFComp
@param {CompItem | NFComp} comp - the CompItem to wrap
@property {CompItem} comp - the CompItem
###
class NFPageComp extends NFComp
  constructor: (comp) ->
    NFComp.call(this, comp)
    throw new Error "Can't create an NFPageComp from a non-page comp" unless NFPageComp.canBePageComp(@$)
    @
  toString: ->
    return "NFPageComp: '#{@getName()}'"

  ###*
  Provides an object to be easily converted to JSON for the CEP Panel
  @memberof NFCitationLayer
  @returns {Object} the CEP Panel object
  ###
  simplify: ->
    obj = super.simplify()
    obj.class = "NFPageComp"
    return obj

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
    return @getName().substring(searchIndex + 2, endIdx) if searchIndex > 0
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
    sourceLayers = NF.Util.collectionToArray(@$.layers)
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

  ###*
  Adds a highlight data layer for a given part comp, or does nothing if
  one already exists.
  @memberof NFPageComp
  @param {NFPartComp} the part comp for the data layer to target
  @returns {NFPageComp} self
  ###
  addHighlightDataLayerFor: (targetComp) ->
    targetCompName = targetComp.$.name
    unless @layerWithName(targetCompName)?
      currTime = targetComp.getTime()
      dataLayer = @addTextLayer
        at: @allLayers().count()-1
        time: 0
      targetComp.setTime(currTime) unless targetComp.getTime() is currTime
      expression = NFTools.readExpression "highlight-data-expression",
        TARGET_COMP_NAME: targetCompName
        PAGE_BASE_NAME: @getPageBaseName()
      dataLayer.property("Text").property("Source Text").expression = expression
      dataLayer.$.enabled = no
      dataLayer.$.name = "HighData-#{targetCompName}"
    @

  ###*
  Gets the PDF layer with the actual PDF file
  @memberof NFPageComp
  @returns {NFLayer} the PDF NFLayer
  ###
  getPDFLayer: ->
    return @layerWithName @getName().replace(" NFPage", ".pdf")

# Class Methods
NFPageComp = Object.assign NFPageComp,

  ###*
  # Returns whether the CompItem can be NFPageComp
  # @memberof NFComp
  # @param {CompItem}
  # @returns {boolean} if the given CompItem fits the criteria to be a NFPageComp
  ###
  canBePageComp: (compItem) ->
    return compItem.name.indexOf("NFPage") >= 0
