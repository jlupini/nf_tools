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

  ###*
  Adds a highlight data layer for a given part comp, or does nothing if
  one already exists.
  @memberof NFPageComp
  @param {NFPartComp} the part comp for the data layer to target
  @returns {NFPageComp} self
  ###
  addHighlightDataLayerFor: (targetComp) ->
    targetCompName = targetComp.comp.name
    unless @layerWithName(targetCompName)?
      dataLayer = @addTextLayer
        at: @allLayers().count()-1
        time: 0
      expression = NFTools.readExpression "highlight-data-expression",
        TARGET_COMP_NAME: targetCompName
        PAGE_BASE_NAME: @getPageBaseName()
      dataLayer.property("Text").property("Source Text").expression = expression
      dataLayer.layer.enabled = no
      dataLayer.layer.name = "HighData-#{targetCompName}"
    @

  ###*
  Gets the PDF layer with the actual PDF file
  @memberof NFPageComp
  @returns {NFLayer} the PDF NFLayer
  ###
  getPDFLayer: ->
    return @layerWithName @getName().replace(" NFPage", ".pdf")


  ###*
  Given a shape layer and number of lines, creates a new NFHighlightLayer
  highlight.
  @memberof NFPageComp
  @param {Object} model
  @param {NFLayer} model.shapeLayer the shape layer with target shape
  @param {int} model.lines the number of lines
  @returns {NFHighlightLayer} the new highlight
  ###
  createHighlight: (model) ->
    model =
      shapeLayer: model.shapeLayer ? throw new Error "Must specify a shape layer"
      lines: model.lines ? throw new Error "Must include number of lines"
    throw new Error "model.shapeLayer must be a valid shape layer" unless model.shapeLayer.isShapeLayer()

    # First, let's get the source rect
    currTime = @getTime()
    rect = model.shapeLayer.sourceRect()
    @setTime currTime

    # Boom done. Now we'll make a new Shape Layer and Build the Highlight
    highlightLayer = new NFLayer @comp.layers.addShape()
    highlightLayer.setName "#{model.shapeLayer.getName()} Highlight"
    highlightLayer.transform().property("Position").setValue [0,0]
    highlightLayer.transform().property("Position").expression = '[transform.position[0]+ effect("AV Highlighter")("Offset")[0], transform.position[1]+ effect("AV Highlighter")("Offset")[1]]'
    highlightLayer.layer.blendingMode = BlendingMode.MULTIPLY
    highlightLayer.effects().addProperty 'AV_Highlighter'
    highlightLayer.transform().property('Opacity').expression = 'effect("AV Highlighter")("Opacity")'

    mainContents = highlightLayer.property("ADBE Root Vectors Group")

    lineShape = new Shape()
    lineShape.vertices = [
      [rect.left, rect.top],
      [rect.left + rect.width, rect.top]
    ]
    lineShape.inTangents = []
    lineShape.outTangents = []
    lineShape.closed = no

    # Add Group
    group = mainContents.addProperty("ADBE Vector Group")
    group.name = "Highlight Lines"
    for i in [1..model.lines]
      lineGroup = group.property("Contents").addProperty("ADBE Vector Group")
      lineGroup.name = "Line #{i}"
      linePathProp = lineGroup.property("Contents").addProperty("ADBE Vector Shape - Group")
      linePathProp.name = "Line #{i} Path"
      linePathProp.property("ADBE Vector Shape").setValue(lineShape)
      lineTrimProp = lineGroup.property("Contents").addProperty('ADBE Vector Filter - Trim')
      lineTrimProp.property('Start').expression = 'effect("AV Highlighter")("Start Offset")'
      lineStrokeProp = lineGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke")

      lineStrokeProp.property("Color").expression = NFTools.readExpression "highlight-stroke-color-expression"
      lineStrokeProp.property('Stroke Width').expression = 'effect("AV Highlighter")("Thickness")'


    # FIXME: Add in the meat of the expression logic here


    return null
