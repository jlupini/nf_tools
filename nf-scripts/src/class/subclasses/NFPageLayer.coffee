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
    throw new Error "Cannot create an NFPageLayer from a layer without a source" unless layer.source?
    @pageComp = new NFPageComp layer.source
    @
  # MARK: Instance Methods
  toString: ->
    return "NFPageLayer: '#{@$.name}'"

  ###*
  Provides an object to be easily converted to JSON for the CEP Panel
  @memberof NFPageLayer
  @returns {Object} the CEP Panel object
  ###
  simplify: ->
    obj = NFLayer.prototype.simplify.call @
    obj.class = "NFPageLayer"
    return obj

  ###*
  Returns a connected paper parent layer. Not to be confused with {@link NFPageLayer#findPaperParentLayer} which will return a non-connected one
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
  ###
  getPaperParentLayer: ->
    if @$.parent?
      return new NFPaperParentLayer(@$.parent)
    else
      return null

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
      paperParent = @containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForObject(@))
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
    @highlights().forEach (highlight) =>
      bubbledHighlights.push highlight if highlight.isBubbled() and highlight.getControlLayer()?.containingComp().is(@containingComp())
    return new NFHighlightLayerCollection(bubbledHighlights)

  ###*
  Returns NFHighlightLayerCollection of all highlights that can be bubbled (aka
  not bubbled already and not broken)
  @memberof NFPageLayer
  @returns {NFHighlightLayerCollection} The collection of highlights
  ###
  bubblableHighlights: ->
    bubblableHighlights = []
    @highlights().forEach (highlight) =>
      bubblableHighlights.push highlight unless highlight.isBubbled() and not highlight.isBroken()
    return new NFHighlightLayerCollection(bubblableHighlights)

  ###*
  Bubbles up given highlights or highlight to this comp by creating an
  NFHighlightControlLayer.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {NFHighlightLayer | NFHighlightLayerCollection}
  @throws Throw error if any highlight choices are connected and not broken,
  so you should have disconnected them first
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
  @deprecated replaced by NFPaperLayerGroup#assignControlLayer
  ###
  bubbleUp: (highlightsToBubble) ->
    @getPaperLayerGroup().bubbleUp highlightsToBubble
    @

  ###*
  Returns whether or not the page has been initted with the below methods
  @memberof NFPageLayer
  @returns {boolean} the init state
  ###
  isInitted: ->
    return @$.name.indexOf("[+]") >= 0

  ###*
  Returns the base page name (everything before the space)
  @memberof NFPageLayer
  @returns {String} the page base name
  ###
  getPageBaseName: ->
    return @$.name.substr(0, @$.name.indexOf(' '))

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
      @$.name = @$.name.replace " NFPage", " [+]"
      bubbledHighlights.resetExpressionErrors()
    @

  ###*
  Adds the non-transform init properties (dropshadow, motion blur, etc)
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  ###
  init: ->
    @$.motionBlur = true
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
    shadowProp.property('Opacity').setValue(51)
    shadowProp.property('Direction').setValue(145)
    shadowProp.property('Distance').setValue(10)
    shadowProp.property('Softness').setValue(47)
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
    return false if @$.property('Transform').property('Scale').numKeys > 0
    @$.property('Transform').property('Scale').setValue [50,50,50]
    return true

  ###*
  Sets the position of the layer to the Init position. Returns false and doesn't set position if there are existing keyframes
  @memberof NFPageLayer
  @returns {boolean} whether or not the position was updated
  ###
  setInitPosition: ->
    if @$.property('Transform').property('Position').numKeys > 0
      return false
    else
      layerHeight = @$.height
      oldPosition = @$.property('Transform').property('Position').value
      newPosition = oldPosition
      newPosition[1] = layerHeight / 4
      @$.property('Transform').property('Position').setValue(newPosition)
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
      width: @$.source.width
      height: @containingComp().$.height
      padding: 0
    @relativeRect rect

  ###*
  Returns the source rect of a given highlight relative to this layer's
  parent comp.
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @param {float} [targetTime=Current Time] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
  @throws Throw error if highlight is not in page
  ###
  sourceRectForHighlight: (highlight, targetTime = null) ->
    throw new Error "Can't get source rect for this highlight since it's not in the layer" unless @containsHighlight highlight
    @sourceRectForLayer highlight

  ###*
  Returns the source rect of a given layer relative to this layer's
  parent comp.
  @memberof NFPageLayer
  @param {NFLayer} layer - the layer
  @param {float} [targetTime=Current Time] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
  @throws Throw error if layer is not in page comp
  ###
  sourceRectForLayer: (layer, targetTime = null) ->
    throw new Error "Can't get source rect for this layer since it's not in the page" unless layer.containingComp().is @getPageComp()
    currentTime = @containingComp().getTime()
    layerRect = layer.sourceRect()
    @containingComp().setTime currentTime
    @relativeRect layerRect, targetTime

  ###*
  Returns whether a given highlight is in this layer
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
  ###
  containsHighlight: (highlight) ->
    foundHighlight = false
    @highlights().forEach (testHighlight) =>
      foundHighlight = true if testHighlight.is highlight
    return foundHighlight

  ###*
  Duplicates the page layer and converts to a reference layer. Reference
  layers can't be seen by Highlight Control Layers. New layer will be
  immediately above the target layer. Returns new layer.
  @memberof NFPageLayer
  @returns {NFPageLayer} the new reference layer
  ###
  duplicateAsReferenceLayer: ->
    oldName = @getName()
    refLayer = @duplicate()
    refLayer.$.name = oldName.replace("+", "ref")
    return new NFReferencePageLayer reflayer.$

  ###*
  Duplicates the page layer and converts to a reference layer. Reference
  layers can't be seen by Highlight Control Layers. New layer will be
  immediately above the target layer. Returns new layer.
  @memberof NFPageLayer
  @param {Object} model - the data model
  @param {NFLayer} model.target - the target shape or highlight layer
  @param {NFLayer} model.maskExpansion - the expansion on the mask
  @returns {NFPageLayer} the new reference layer
  ###
  createReferenceLayer: (model) ->
    ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split ''
    currTime = @containingComp().getTime()

    oldName = @getName()
    refLayer = @duplicate()
    refLayer.$.name = oldName.replace("+", "ref")

    baseName = "#{refLayer.getName()} <#{model.target.getName()}>"

    # Unique naming
    layersWithName = refLayer.containingComp().searchLayers baseName, yes, "FlightPath"
    refLayer.$.name = "#{baseName} {#{ALPHABET[layersWithName.count()]}}"

    # Clear position and scale animation markers from transitions
    positionProp = refLayer.transform("Position")
    scaleProp = refLayer.transform("Scale")

    positionProp.expression = "" unless newPageLayer?
    if positionProp.numKeys > 0
      for idx in [positionProp.numKeys..1]
        positionProp.removeKey idx
    if scaleProp.numKeys > 0
      for idx in [scaleProp.numKeys..1]
        scaleProp.removeKey idx

    refLayer.removeNFMarkers()

    # Positioning and Framing and Masking

    # Frame up that baby
    choiceRect = model.target.sourceRect()
    @containingComp().setTime(currTime) unless @containingComp().getTime() is currTime

    scaleProp = refLayer.transform("Scale")
    newScale = refLayer.getAbsoluteScaleToFrameUp
      rect: refLayer.relativeRect choiceRect
      fillPercentage: 75
      maxScale: 100

    scaleProp.setValue [newScale, newScale]

    positionProp = refLayer.transform("Position")
    newPosition = refLayer.getAbsolutePositionToFrameUp
      rect: refLayer.relativeRect choiceRect
      preventFalloff: no

    positionProp.setValue newPosition

    # Make a mask over the text
    highlightThickness = if model.target instanceof NFHighlightLayer then model.target.highlighterEffect().property("Thickness").value else 0
    paddedChoiceRect =
      left: choiceRect.left
      top: choiceRect.top - (highlightThickness/2)
      width: choiceRect.width
      height: choiceRect.height + highlightThickness

    newMask = refLayer.mask().addProperty "Mask"
    newMask.maskShape.setValue NFTools.shapeFromRect(paddedChoiceRect)
    newMask.maskExpansion.setValue model.maskExpansion

    # Create the flightpath and attach it to the ref layer
    bgSolid = @containingComp().addSolid
      color: [1,1,1]
      name: "FlightPath -> '#{refLayer.$.name}'"
    bgSolid.transform("Opacity").setValue 20
    bgSolid.moveAfter refLayer
    bgSolid.$.blendingMode = BlendingMode.OVERLAY
    bgSolid.$.motionBlur = true
    bgSolid.$.locked = yes
    bgSolid.setShy yes

    newMask = bgSolid.mask().addProperty "Mask"
    newMask.maskExpansion.expression = NFTools.readExpression "flightpath-expansion-expression",
      REF_LAYER_NAME: refLayer.getName()
    newMask.maskShape.expression = NFTools.readExpression "flightpath-path-expression",
      TARGET_LAYER_NAME: refLayer.getName()
      SOURCE_LAYER_NAME: @getName()
      SHAPE_LAYER_NAME: model.target.getName()
    bgSolid.transform("Opacity").expression = NFTools.readExpression "backing-opacity-expression",
      TARGET_LAYER_NAME: refLayer.getName()
    shadowProp = bgSolid.addDropShadow()

    refLayer.effect('Drop Shadow')?.enabled = yes
    refLayer.setParent @

    return new NFReferencePageLayer refLayer.$

  ###*
  Returns whether or not this layer is a reference layer
  @memberof NFPageLayer
  @returns {boolean} the result
  ###
  isReferenceLayer: ->
    return @getName().indexOf("[ref]") >= 0


  ###*
  Sets the start point of the layer to be the first frame of the page comp that
  we haven't seen before.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  ###
  makeContinuous: ->
    thisPage = @getPageComp()

    # Get every instance of this page layer in every part comp
    thePDF = NFPDF.fromPageLayer @
    partComps = thePDF.containingPartComps()
    layerInstances = new NFPageLayerCollection
    for partComp in partComps
      layersInComp = partComp.layersForPage thisPage
      unless layersInComp.isEmpty()
        layersInComp.forEach (theLayer) =>
          layerInstances.add theLayer

    # Get the last time we saw
    latestInternalEndTime = 0
    unless layerInstances.isEmpty()
      layerInstances.forEach (theInstance) =>
        unless theInstance.is @
          internalEndTime = theInstance.internalEndTime()
          latestInternalEndTime = internalEndTime if internalEndTime > latestInternalEndTime

    @beginAt latestInternalEndTime + @containingComp().$.frameDuration
    @

  ###*
  Returns the page turn status at the current time
  @memberof NFPageLayer
  @param {float} [time=Current Time] - the time to check the status at
  @returns {ENUM} the page turn status (found in NFPageLayer)
  ###
  pageTurnStatus: (time) ->
    time ?= @containingComp().getTime()

    pageTurnEffect = @effect "CC Page Turn"
    foldPositionProperty = pageTurnEffect?.property("Fold Position")
    foldPosition = foldPositionProperty?.valueAtTime time, false
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
      nullLayer = @nullify [1, 0, 0.7]
      paperParentLayer = new NFPaperParentLayer(nullLayer).setName(NFPaperParentLayer.getPaperParentNameForObject(@))

    return paperParentLayer

  ###*
  Returns the NFPaperLayerGroup for this page, if it exists. Will not create one
  @memberof NFPageLayer
  @returns {NFPaperLayerGroup | null} the paper layer group
  ###
  getPaperLayerGroup: ->
    paperParentLayer = @getPaperParentLayer()
    return new NFPaperLayerGroup paperParentLayer if paperParentLayer?
    return null


  ###*
  Slides in or out the pageLayer using markers. #slideIn and #slideOut both
  call this method
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.fromEdge=NFComp.AUTO] - The direction to slide in from.
  Default if page is centered is the right.
  @param {boolean} [model.in=yes] - If page should slide in. No means out
  ###
  slide: (model) ->
    model ?= []
    model.fromEdge ?= NFComp.AUTO
    model.in ?= yes

    if model.in
      @log "Sliding in at time: #{@getCompTime()}"
    else
      @log("Sliding out at time: #{@getCompTime()}")

    # If .fromEdge is AUTO, figure out which edge to use.
    if model.fromEdge is NFComp.AUTO
      layerCenter = @relativeCenterPoint()
      layerCenter = [Math.round layerCenter[0], Math.round layerCenter[1]]
      compCenter = @containingComp().centerPoint()
      compCenter = [Math.round compCenter[0], Math.round compCenter[1]]
      if layerCenter[0] < compCenter[0]
        model.fromEdge = NFComp.LEFT
      else
        model.fromEdge = NFComp.RIGHT

    positionProperty = @transform("Position")

    animatingX = model.fromEdge is NFComp.RIGHT or model.fromEdge is NFComp.LEFT
    animatingY = model.fromEdge is NFComp.TOP or model.fromEdge is NFComp.BOTTOM

    throw new Error "Invalid Edge" unless animatingX or animatingY

    # Make a slider for controlling the start position
    startOffset = switch
      when model.fromEdge is NFComp.RIGHT then 3000
      when model.fromEdge is NFComp.LEFT then -3000
      when model.fromEdge is NFComp.BOTTOM then @containingComp().$.height * 1.1
      when model.fromEdge is NFComp.TOP then @sourceRect().height * 1.1
      else 0
    slider = @addSlider("Start Offset", startOffset)

    xVal = switch
      when animatingX then slider.property("Slider")
      else "value[0]"
    yVal = switch
      when animatingY then slider.property("Slider")
      else "value[1]"
    zVal = 0

    if model.in
      startEquation = EasingEquation.quint.out
      startValue = [xVal, yVal, zVal]
    else
      endEquation = EasingEquation.quint.in
      endValue = [xVal, yVal, zVal]

    @addInOutMarkersForProperty
      property: positionProperty
      startEquation: startEquation
      startValue: startValue
      endEquation: endEquation
      endValue: endValue
    @

  ###*
  Slides in the pageLayer using markers.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.fromEdge=NFComp.AUTO] - The direction to slide in from.
  Default if page is centered is the right.
  ###
  slideIn: (model) ->
    @slide
      in: yes
      fromEdge: model?.fromEdge

  ###*
  Slides out the pageLayer using markers.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.toEdge=NFComp.AUTO] - The direction to slide out to.
  Default if page is centered is the right.
  ###
  slideOut: (model) ->
    @slide
      in: no
      fromEdge: model?.toEdge

  ###*
  Adds the pageturn effect, motion blur effect and drop shadow to the layer in
  a given pageturn status. Overwrites existing drop shadow effects, but leaves
  existing force motion blur and page turns
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Enum} [pageTurnStatus=NFPageLayer.PAGETURN_FLIPPED_DOWN] - The status
  to set the turn up with
  ###
  setupPageTurnEffect: (pageTurnStatus) ->
    @log "Setting up page turn effect"
    forceMotionBlurMatchName = "CC Force Motion Blur"
    dropShadowMatchName = "ADBE Drop Shadow"
    pageTurnMatchName = "CC Page Turn"

    pageTurnEffect = @effect pageTurnMatchName
    if not pageTurnEffect?
      pageTurnEffect = @effects().addProperty pageTurnMatchName
      pageTurnEffect.property("Fold Radius").setValue 500
      foldPosition = pageTurnEffect.property("Fold Position")
      if pageTurnStatus is NFPageLayer.PAGETURN_FLIPPED_UP
        foldPosition.setValue @pageTurnUpPosition()
      else if pageTurnStatus is NFPageLayer.PAGETURN_FLIPPED_DOWN or not pageTurnStatus?
        foldPosition.setValue @pageTurnDownPosition()
      else
        throw new Error "Invalid page turn type for initial position"

    forceMotionBlurEffect = @effect forceMotionBlurMatchName
    if not forceMotionBlurEffect?
      forceMotionBlurEffect = @effects().addProperty forceMotionBlurMatchName
      forceMotionBlurEffect.property("Override Shutter Angle").setValue 0

    dropShadowEffect = @effect dropShadowMatchName
    dropShadowEffect.remove() if dropShadowEffect?
    dropShadowEffect = @effects().addProperty dropShadowMatchName
    dropShadowEffect.property("Opacity").setValue 0.75 * 255
    dropShadowEffect.property("Direction").setValue 125
    dropShadowEffect.property("Distance").setValue 20
    dropShadowEffect.property("Softness").setValue 300

    @

  ###*
  Simply calculates and returns the property values for CC page turn's position
  for which the page is flipped down.
  @memberof NFPageLayer
  @returns {float[]} the position property of the pageturn effect when this page
  is flipped down
  ###
  pageTurnDownPosition: ->
    comp = @getPageComp()
    pageSize =
      width: comp.$.width
      height: comp.$.height
    downPosition = [pageSize.width, pageSize.height]

  ###*
  Simply calculates and returns the property values for CC page turn's position
  for which the page is flipped up.
  @memberof NFPageLayer
  @returns {float[]} the position property of the pageturn effect when this page
  is flipped up
  ###
  pageTurnUpPosition: ->
    comp = @getPageComp()
    pageSize =
      width: comp.$.width
      height: comp.$.height
    upPosition = [-pageSize.width, -pageSize.height]

  ###*
  Animates a page turn, essentially toggling the current page turn status.
  Throws an error if the page is not all the way up or down at the start time.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {float} [model.time=The current time] - The time to start the turn at
  @param {float} [model.duration=1.5] - The duration of the pageturn
  @param {boolean} [model.trim=no] - Trim the layer after the turn is complete.
  Defaults to YES if we're folding up, and NO if we're folding down.
  ###
  animatePageTurn: (model) ->
    model ?= []
    model.time ?= @containingComp().getTime()
    model.duration ?= 1.5

    startTime = model.time
    endTime = startTime + model.duration
    startStatus = @pageTurnStatus startTime
    endStatus = @pageTurnStatus endTime

    # Add the effect if it's not there already
    if startStatus is NFPageLayer.PAGETURN_NONE
      @setupPageTurnEffect()
    if startStatus is NFPageLayer.PAGETURN_BROKEN
      throw new Error "Page turn keyframes seem broken..."
    if startStatus is NFPageLayer.PAGETURN_TURNING or endStatus is NFPageLayer.PAGETURN_TURNING
      throw new Error "Page is already turning at start or end time of new turn"

    positions = [@pageTurnDownPosition(), @pageTurnUpPosition()]

    if startStatus is NFPageLayer.PAGETURN_FLIPPED_UP
      targetStatus = NFPageLayer.PAGETURN_FLIPPED_DOWN
    else if startStatus is NFPageLayer.PAGETURN_FLIPPED_DOWN
      targetStatus = NFPageLayer.PAGETURN_FLIPPED_UP

    if targetStatus is NFPageLayer.PAGETURN_FLIPPED_DOWN
      positions.reverse()
      model.trim = no unless model.trim?

    times = [startTime, endTime]

    @log "Animating page turn"

    foldPosition = @effect("CC Page Turn").property("Fold Position")
    foldPosition.setValuesAtTimes times, positions
    foldPosition.easyEaseKeyTimes
      keyTimes: times

    # Trim if necessary
    unless model.trim is no
      @$.outPoint = endTime

    @

  ###*
  Moves the layer so that a given highlight is visible and centered in frame,
  at the given time. Adds keyframes only if keyframes already exist on the
  layer's position or scale properties.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} model - The options
  @param {NFHighlightLayer} model.highlight - The highlight to move to
  @param {float} [model.time=The current time] - The time to frame up at
  @param {float} [model.fillPercentage=85] - Percentage of the comp width the
  highlight should take up
  @param {float} [model.maxScale=115] - The maximum that a page layer will scale
  @throws Throws error if not given a NFHighlightLayer as model.highlight or
  given highlight is not on this page.
  ###
  frameUpHighlight: (model) ->
    throw new Error "Invalid highlight" unless model?.highlight instanceof NFHighlightLayer and @containsHighlight(model.highlight)
    @log "Framing up highlight: #{model.highlight.toString()}"

    positionProp = @transform().position
    scaleProp = @transform().scale

    # Move the time to the target time and unparent
    originalTime = @containingComp().getTime()
    model.time = model.time ? originalTime
    @containingComp().setTime model.time

    originalParent = @getParent()
    @setParent null

    # Frame up the Highlight
    hasPositionKeyframes = positionProp.numKeys != 0
    hasScaleKeyframes = scaleProp.numKeys != 0

    scaleFactor = @getScaleFactorToFrameUp model
    initialScale = scaleProp.valueAtTime model.time, false
    targetScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor]
    if hasScaleKeyframes then scaleProp.setValueAtTime(model.time, targetScale) else scaleProp.setValue(targetScale)

    positionDelta = @getPositionDeltaToFrameUp model
    initialPosition = positionProp.valueAtTime model.time, false
    targetPosition = [initialPosition[0] + positionDelta[0], initialPosition[1] + positionDelta[1]]
    if hasPositionKeyframes then positionProp.setValueAtTime(model.time, targetPosition) else positionProp.setValue(targetPosition)

    # Restore the original parent and comp time
    @setParent originalParent
    @containingComp().setTime(originalTime)

    @

  ###*
  Returns the absolute scale value for this layer to frame up a given
  highlight or rect in this layer's Containing comp. Must provide either a highlight OR rect.
  @memberof NFPageLayer
  @returns {float} the scale factor
  @param {Object} model - the options
  @param {NFHighlightLayer} [model.highlight] - The highlight to get the scale
  factor for.
  @param {rect} [model.rect] - the rect to get the scale factor for
  @param {float} [model.time=The current time] - The time to calculate at
  @param {float} [model.fillPercentage=85] - Percentage of the comp width the
  highlight should take up
  @param {float} [model.maxScale=115] - The maximum that a page layer will scale
  @throws Throws error if not given a NFHighlightLayer or rect, or the
  given highlight is not on this page.
  ###
  getAbsoluteScaleToFrameUp: (model) ->
    scaleFactor = @getScaleFactorToFrameUp model
    scaleProp = @transform "Scale"
    oldScale = scaleProp.value
    return newScale = oldScale[0] * scaleFactor

  ###*
  Returns the multiplier, or scale factor required to frame up the given
  highlight or rect in this layer's Containing comp. Basically, multiplying the scale
  of this layer by the result of this number will make the highlight or rect fit in
  frame perfectly. Must provide either a highlight OR rect.
  @memberof NFPageLayer
  @returns {float} the scale factor
  @param {Object} model - the options
  @param {NFHighlightLayer} [model.highlight] - The highlight to get the scale
  factor for.
  @param {rect} [model.rect] - the rect to get the scale factor for
  @param {float} [model.time=The current time] - The time to calculate at
  @param {float} [model.fillPercentage=85] - Percentage of the comp width the
  highlight should take up
  @param {float} [model.maxScale=115] - The maximum that a page layer will scale
  @throws Throws error if not given a NFHighlightLayer or rect, or the
  given highlight is not on this page.
  ###
  getScaleFactorToFrameUp: (model) ->
    # Make sure either a rect or highlight is given
    if model.highlight?
       unless model.highlight instanceof NFHighlightLayer and @containsHighlight(model.highlight)
         throw new Error "Invalid highlight"
    else if not model.rect?
      throw new Error "Must provide either a highlight OR rect"

    model =
      highlight: model.highlight
      rect: model.rect
      time: model.time ? @containingComp().getTime()
      fillPercentage: model.fillPercentage ? 85
      maxScale: model.maxScale ? 115


    rect = model.rect ? @sourceRectForHighlight model.highlight, model.time
    compWidth = @containingComp().$.width
    targetRectWidth = model.fillPercentage / 100 * compWidth
    scaleFactor = targetRectWidth / rect.width

    # Adjust for max page scale
    absoluteScale = @getAbsoluteScale()
    calculatedScale = scaleFactor * absoluteScale[0]
    if calculatedScale > model.maxScale
      adjustedScaleFactor = model.maxScale / absoluteScale[0]
    else if calculatedScale < 50
      adjustedScaleFactor = 50 / absoluteScale[0]
    else
      adjustedScaleFactor = scaleFactor

    adjustedScaleFactor

  ###*
  Returns a length-2 array with absolute x and y values to make the given
  highlight or rect be centered in frame *at the current scale of the layer*.
  Must provide either a rect OR highlight.
  @memberof NFPageLayer
  @returns {float[]} the x and y nudge values
  @param {Object} model - The options
  @param {NFHighlightLayer} [model.highlight] - The highlight to get the scale
  factor for.
  @param {rect} [model.rect] - the rect to get the scale factor for
  @param {float} [model.time=The current time] - The time to calculate at
  @param {boolean} [model.preventFalloff=yes] - whether to derive position without letting the page fall out of the frame
  @throws Throws error if not given a NFHighlightLayer or rect, or
  given highlight is not on this page.
  ###
  getAbsolutePositionToFrameUp: (model) ->
    positionDelta = @getPositionDeltaToFrameUp model
    positionProp = @transform "Position"
    oldPosition = positionProp.value
    return newPosition = [oldPosition[0] + positionDelta[0], oldPosition[1] + positionDelta[1]]

  ###*
  Returns a length-2 array with x and y 'nudge' values to make the given
  highlight or rect be centered in frame *at the current scale of the layer*.
  Must provide either a rect OR highlight.
  @memberof NFPageLayer
  @returns {float[]} the x and y nudge values
  @param {Object} model - The options
  @param {NFHighlightLayer} [model.highlight] - The highlight to get the scale
  factor for.
  @param {rect} [model.rect] - the rect to get the scale factor for
  @param {float} [model.time=The current time] - The time to calculate at
  @param {boolean} [model.preventFalloff=yes] - whether to derive position without letting the page fall out of the frame
  @throws Throws error if not given a NFHighlightLayer or rect, or
  given highlight is not on this page.
  ###
  getPositionDeltaToFrameUp: (model) ->
    # Make sure either a rect or highlight is given
    if model.highlight?
       unless model.highlight instanceof NFHighlightLayer and @containsHighlight(model.highlight)
         throw new Error "Invalid highlight"
    else if not model.rect?
      throw new Error "Must provide either a highlight OR rect"

    model.preventFalloff = model.preventFalloff ? yes

    rect = model.rect ? @sourceRectForHighlight model.highlight, model.time

    rectCenterPoint = [rect.left + rect.width / 2, rect.top + rect.height / 2]
    compCenterPoint = [@containingComp().$.width / 2, @containingComp().$.height / 2]
    delta = [compCenterPoint[0] - rectCenterPoint[0], compCenterPoint[1] - rectCenterPoint[1]]

    # Adjust to prevent falling off the page
    if model.preventFalloff
      rectAfterReposition = @sourceRect model.time

      rectAfterReposition.left += delta[0]
      rectAfterReposition.top += delta[1]

      if rectAfterReposition.left > 0
        delta[0] -= rectAfterReposition.left
      if rectAfterReposition.top > 0
        delta[1] -= rectAfterReposition.top
      if rectAfterReposition.left + rectAfterReposition.width < @containingComp().$.width
        delta[0] += @containingComp().$.width - (rectAfterReposition.left + rectAfterReposition.width)
      if rectAfterReposition.top + rectAfterReposition.height < @containingComp().$.height
        delta[1] += @containingComp().$.height - (rectAfterReposition.top + rectAfterReposition.height)

    delta

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
