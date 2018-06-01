###*
Creates a new NFPageLayer from a given AVLayer
@class NFPageLayer
@classdesc Subclass of {@link NFLayer} for a page layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a source (aka a comp layer)
###
class NFPageLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    throw "Cannot create an NFPageLayer from a layer without a source" unless layer.source?
    @pageComp = new NFPageComp layer.source
    @
  # MARK: Instance Methods
  toString: ->
    return "NFPageLayer: '#{@layer.name}'"

  ###*
  Returns a connected paper parent layer. Not to be confused with {@link NFPageLayer#findPaperParentLayer} which will return a non-connected one
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
  ###
  getPaperParentLayer: ->
    if @layer.parent?
      return new NFPaperParentLayer(@layer.parent)
    else
      return null

  ###*
  Gets the comp this layer is in
  @memberof NFPageLayer
  @override
  @returns {NFComp} The containing Comp
  ###
  containingComp: ->
    return new NFComp @layer.containingComp

  ###*
  Returns the pageComp for this layer
  @memberof NFPageLayer
  @returns {NFPageComp} The page item
  ###
  getPageComp: ->
    return @pageComp

  ###*
  Returns the paperParentLayer for this layer, if it exists, REGARDLESS OF WHETHER ITS CONNECTED. Not to be confused with {@link NFPageLayer#getPaperParentLayer}
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
  ###
  findPaperParentLayer: ->
    paperParent = @getPaperParentLayer()
    unless paperParent?
      paperParent = @containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(@))
    return paperParent

  ###*
  Returns NFHighlightLayerCollection of all highlights in this page
  @memberof NFPageLayer
  @returns {NFHighlightLayerCollection} The collection of highlights
  ###
  highlights: ->
    return @pageComp.highlights()

  ###*
  Returns NFHighlightLayerCollection of all highlights bubbled onto this page layer
  @memberof NFPageLayer
  @returns {NFHighlightLayerCollection} The collection of highlights
  ###
  bubbledHighlights: ->
    bubbledHighlights = []
    for highlight in @highlights().layers
      bubbledHighlights.push highlight if highlight.isBubbled() and highlight.getConnectedPageLayer()?.is(@)
    return new NFHighlightLayerCollection(bubbledHighlights)

  ###*
  Bubbles up given highlights or highlight to this layer.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {NFHighlightLayer | NFHighlightLayerCollection}
  @throws Throw error if any highlight choices are connected and not broken,
  so you should have disconnected them first
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
  ###
  bubbleUp: (highlightsToBubble) ->
    # If given a single highlight, wrap it.
    if highlightsToBubble instanceof NFHighlightLayer
      highlightsToBubble = new NFHighlightLayerCollection([highlightsToBubble])

    unless highlightsToBubble.isEmpty()
      for highlight in highlightsToBubble.layers

        unless highlight.canBubbleUp()
          throw "Cannot bubble highlight if already connected and not broken. Disconnect first"

        # Make sure the highlight is in this page
        unless @getPageComp().is highlight.getPageComp()
          throw "Cannot bubble highlight because it is not in this page!"

        targetPageLayerEffects = @effects()
        sourceEffect = highlight.highlighterEffect()

        targetHighlighterEffect = targetPageLayerEffects.addProperty('AV_Highlighter')
        targetHighlighterEffect.name = highlight.layer.name

        targetComp = @containingComp()

        # Iterate through the properties and connect each one
        for highlighterProperty in NF.Util.highlighterProperties
          sourceValue = sourceEffect.property(highlighterProperty).value
          targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue)
          sourceExpression = "var offsetTime = comp(\"#{targetComp.comp.name}\").layer(\"#{@layer.name}\").startTime;
                              comp(\"#{targetComp.comp.name}\").layer(\"#{@layer.name}\").effect(\"#{highlight.getName()}\")(\"#{highlighterProperty}\").valueAtTime(time+offsetTime)"
          sourceEffect.property(highlighterProperty).expression = sourceExpression
    @

  ###*
  Returns whether or not the page has been initted with the below methods
  @memberof NFPageLayer
  @returns {boolean} the init state
  ###
  isInitted: ->
    return @layer.name.indexOf("[+]") >= 0

  ###*
  Changes the page name to mark the page layer as initted, and updates bubbled highlights
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  ###
  markInitted: ->
    unless @isInitted()
      bubbledHighlights = @bubbledHighlights()
      if bubbledHighlights.count() > 0
        bubbledHighlights.fixExpressionsAfterInit()
      @layer.name = @layer.name.replace " NFPage", " [+]"
      bubbledHighlights.resetExpressionErrors()
    @

  ###*
  Adds the non-transform init properties (dropshadow, motion blur, etc)
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  ###
  init: ->
    @layer.motionBlur = true
    @setDropShadow()
    @markInitted()
    @

  ###*
  Sets the drop shadow for the layer
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  ###
  setDropShadow: ->
    shadowProp = @effects().property('ADBE Drop Shadow') ? @effects().addProperty('ADBE Drop Shadow')
    shadowProp.property('Opacity').setValue(191.25)
    shadowProp.property('Direction').setValue(0)
    shadowProp.property('Distance').setValue(20)
    shadowProp.property('Softness').setValue(300)
    @

  ###*
  Adds the transform init properties (size, position)
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  ###
  initTransforms: ->
    @setInitSize()
    @setInitPosition()
    @

  ###*
  Sets the size of the layer to the Init size. Returns false and doesn't set size if there are existing keyframes
  @memberof NFPageLayer
  @returns {boolean} whether or not the size was updated
  ###
  setInitSize: ->
    return false if @layer.property('Transform').property('Scale').numKeys > 0
    @layer.property('Transform').property('Scale').setValue [50,50,50]
    return true

  ###*
  Sets the position of the layer to the Init position. Returns false and doesn't set position if there are existing keyframes
  @memberof NFPageLayer
  @returns {boolean} whether or not the position was updated
  ###
  setInitPosition: ->
    if @layer.property('Transform').property('Position').numKeys > 0
      return false
    else
      layerHeight = @layer.height
      oldPosition = @layer.property('Transform').property('Position').value
      newPosition = oldPosition
      newPosition[1] = layerHeight / 4
      @layer.property('Transform').property('Position').setValue(newPosition)
    return true

  ###*
  Returns the PDF number as a String
  @memberof NFPageLayer
  @returns {string} the PDF number of the page
  ###
  getPDFNumber: ->
    @pageComp.getPDFNumber()

  ###*
  Returns the page number as a String
  @memberof NFPageLayer
  @returns {string} the page number of the page
  ###
  getPageNumber: ->
    @pageComp.getPageNumber()

  ###*
  Returns the NFPDF object for this layer
  @memberof NFPageLayer
  @returns {NFPDF} the PDF object for the page
  ###
  getPDF: ->
    NFPDF.fromPageLayer @

  ###*
  Returns the source rect of this layer's 'full top' frame.
  @memberof NFPageLayer
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
  ###
  sourceRectForFullTop: ->
    rect =
      left: 0
      top: 0
      width: @layer.source.width
      height: @containingComp().comp.height
      padding: 0

  ###*
  Returns the source rect of a given highlight relative to this layer's
  parent comp.
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
  @throws Throw error if highlight is not in page
  ###
  sourceRectForHighlight: (highlight) ->
    throw "Can't get source rect for this highlight since it's not in the layer" unless @containsHighlight highlight
    @sourceRectForLayer highlight

  ###*
  Returns whether a given highlight is in this layer
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
  ###
  containsHighlight: (highlight) ->
    for testHighlight in @highlights().layers
      return true if testHighlight.is highlight
    return false

  ###*
  Returns the page turn status at the current time
  @memberof NFPageLayer
  @returns {ENUM} the page turn status (found in NFPageLayer)
  ###
  pageTurnStatus: () ->
    pageTurnEffect = @getEffectWithName "CC Page Turn"
    foldPositionProperty = pageTurnEffect?.property("Fold Position")
    foldPosition = foldPositionProperty?.value
    threshold = 3840
    if not pageTurnEffect?
      return NFPageLayer.PAGETURN_NONE
    else if foldPosition[0] >= threshold
      return NFPageLayer.PAGETURN_FLIPPED_DOWN
    else if foldPosition[0] <= threshold * -1
      return NFPageLayer.PAGETURN_FLIPPED_UP
    else if foldPositionProperty.numKeys isnt 0
      # FIXME: There may be more things that could mean this is broken
      return NFPageLayer.PAGETURN_TURNING
    else
      return NFPageLayer.PAGETURN_BROKEN

  ###*
  Checks for an existing valid paper parent layer for this page. Sets it as
  the parent if it exists, otherwise creates a new one.
  @memberof NFPageLayer
  @returns {NFPaperParentLayer} the paper parent layer
  @param {boolean} [shouldMove=false] - whether or not the layer should move below its parent
  ###
  assignPaperParentLayer: (shouldMove = no) ->
    paperParentLayer = @findPaperParentLayer()
    if paperParentLayer?
      @setParent paperParentLayer
      if shouldMove
        paperLayerGroup = new NFPaperLayerGroup(paperParentLayer)
        paperLayerGroup.gatherLayers @
    else
      paperParentLayer = new NFPaperParentLayer(@nullify()).setName()

    return paperParentLayer

  ###*
  Slides in the pageLayer using markers. Overrides existing markers!!!
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.fromEdge=NFComp.RIGHT] - The direction to slide in from.
  Default is the right.
  ###
  slideIn: (model) ->
    model ?= []
    model.fromEdge ?= NFComp.RIGHT

    positionProperty = @layer.property("Transform").property("Position")
    # Make a slider for controlling the start position
    slider = @addSlider("Start Offset", 3000)
    @addInOutMarkersForProperty
      property: positionProperty
      startEquation: NF.Util.easingEquations.out_quint
      startValue: [slider.property("Slider"), positionProperty.value[1], positionProperty.value[2]]
    @

# Class Methods
NFPageLayer = Object.assign NFPageLayer,

  ###*
  Returns true if the given AVLayer is a Page Layer
  @memberof NFPageLayer
  @param {AVLayer} theLayer - the layer to test
  @returns {boolean} if the given layer is a page layer
  ###
  isPageLayer: (theLayer) ->
    return NFLayer.isCompLayer(theLayer) and theLayer.source.name.indexOf("NFPage") >= 0

  PAGETURN_FLIPPED_UP: 100
  PAGETURN_FLIPPED_DOWN: 200
  PAGETURN_TURNING: 300
  PAGETURN_NONE: 400
  PAGETURN_BROKEN: 500
