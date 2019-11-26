###*
Creates a new NFPaperLayerGroup from an NFPaperParentLayer
@class NFPaperLayerGroup
@classdesc An object that manages and manipulates a group of layers that are part of the same PDF
@param {NFPaperParentLayer} paperParent - the NFPaperParentLayer to create the group with
@property {NFPaperParentLayer} paperParent - the NFPaperParentLayer for the group
@throws Will throw an error if not created with a valid NFPaperParentLayer object
###
class NFPaperLayerGroup extends NFObject
  constructor: (paperParent) ->
    NFObject.call(this)
    @paperParent = paperParent
    throw new Error "Not a valid paper parent" unless @paperParent instanceof NFPaperParentLayer
    @
  toString: ->
    return "NFPaperLayerGroup: PDF #{@getPDFNumber()} in #{@containingComp().getName()}"

  ###*
  Gets all the child NFLayers of the group's parent
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the layers
  ###
  getChildren: ->
    return @paperParent.getChildren()

  ###*
  Gets all the NFLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the layers
  ###
  getMembers: ->
    members = @paperParent.getChildren(yes)
    members.add @getControlLayers()
    members.add @getCitationLayer()

    return members

  ###*
  Returns the PDF Number
  @memberof NFPaperLayerGroup
  @returns {String} the pdf number
  ###
  getPDFNumber: ->
    return @paperParent.getName().replace("PDF ", "")


  ###*
  Gets all the NFPageLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFPageLayerCollection} the page layers
  ###
  getPages: ->
    allChildren = @getChildren()
    pageChildren = new NFPageLayerCollection()
    allChildren.forEach (layer) =>
      pageChildren.add layer if layer instanceof NFPageLayer
    return pageChildren


  ###*
  Gets all the NFHighlightControlLayer in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the control layers
  ###
  getControlLayers: ->
    allChildren = @getChildren()
    controlChildren = new NFLayerCollection()
    allChildren.forEach (layer) =>
      controlChildren.add layer if layer instanceof NFHighlightControlLayer
    return controlChildren

  ###*
  Returns whether a given highlight is in one of the group's layers
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
  ###
  containsHighlight: (highlight) ->
    foundHighlight = false
    @getPages().forEach (pageLayer) =>
      pageLayer.highlights().forEach (testHighlight) =>
        foundHighlight = true if testHighlight.is highlight
    return foundHighlight

  ###*
  Returns the containing NFComp
  @memberof NFPaperLayerGroup
  @returns {NFComp} the containing comp
  ###
  containingComp: ->
    return @paperParent.containingComp()

  ###*
  Returns the spotlight layer if it exists
  @memberof NFPaperLayerGroup
  @returns {NFSpotlightLayer | null} the spotlight layer
  ###
  getSpotlight: ->
    return @containingComp().layerWithName NFSpotlightLayer.nameForPDFNumber(@getPDFNumber())

  ###*
  Returns the NFPDF for the group
  @memberof NFPaperLayerGroup
  @returns {NFPDF} the PDF for the group
  ###
  getPDF: ->
    return NFPDF.fromGroup @

  ###*
  Looks for and returns the citation layer for this group if it exists. Does not
  create one. For that use #assignCitationLayer
  @memberof NFPaperLayerGroup
  @returns {NFCitationLayer | null} the citation layer or null
  ###
  getCitationLayer: ->
    return @containingComp().layerWithName NFCitationLayer.nameFor(@getPDF())

  ###*
  Gives this group a citation layer unless one already exists
  @memberof NFPaperLayerGroup
  @returns {NFCitationLayer} the citation layer
  ###
  assignCitationLayer: ->
    citeLayer = @getCitationLayer() or NFCitationLayer.newCitationLayer(@)
    return citeLayer

  ###*
  Adds a spotlight for the given highlight.
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight to spotlight
  @returns {NFSpotlightLayer} the spotlight layer
  ###
  addSpotlight: (highlight) ->
    throw new Error "Must provide a highlight to create a spotlight" unless highlight instanceof NFHighlightLayer

    spotlightLayer = @getSpotlight()

    unless spotlightLayer?
      NFSpotlightLayer.newSpotlightLayer(@)

  ###*
  Returns a NFLayerCollection of NFHighlightControlLayer with
  active spotlights at the given time.
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFLayerCollection} collection of NFHighlightControlLayer with active
  spotlights at time
  ###
  getActiveSpotlights: (time) ->
    time = time ? @containingComp().getTime()
    allControlLayers = @getControlLayers()
    activeControlLayers = new NFLayerCollection()

    allControlLayers.forEach (layer) =>
      spotMarkers = layer.spotlightMarkers()
      for marker in spotMarkers
        start = marker.time
        end = marker.time + marker.value.duration
        if start <= time < end
          activeControlLayers.add layer unless activeControlLayers.containsLayer layer

    return activeControlLayers

  ###*
  Trims any active spotlights in the group to the given time
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFPaperLayerGroup} self
  ###
  trimActiveSpotlights: (time) ->
    @log "Trimming active spotlights at time: #{time}"
    time = time ? @containingComp().getTime()
    activeSpots = @getActiveSpotlights time

    unless activeSpots.isEmpty()
      activeSpots.forEach (controlLayer) =>
        controlLayer.setSpotlightMarkerOutPoint time
    @

  ###*
  Trims an active placeholder on the group to the given time
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFPaperLayerGroup} self
  ###
  trimActivePlaceholder: (time) ->
    @log "Trimming placeholders at time: #{time}"
    time = time ? @containingComp().getTime()

    activePH = @containingComp().activePlaceholder time
    activePH.$.outPoint = time if activePH?
    @

  ###*
  Trims all layers in this group to the given time. Call #extend to restore
  citation and spotlight master layers to a given time. Spotlights will end just
  before the group does.
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFPaperLayerGroup} self
  ###
  trim: (time) ->
    @log "Trimming group at time: #{time}"
    time = time ? @containingComp().getTime()

    @trimActiveSpotlights time - 0.75
    @trimActivePlaceholder time
    @getChildren().forEach (layer) =>
      layer.$.outPoint = time if layer.$.outPoint > time
    @getCitationLayer()?.$.outPoint = time
    @getSpotlight()?.$.outPoint = time
    @

  ###*
  Extends the all-important citation and spotlight master layers to allow for
  more pages or elements to be added to a group. Call this after calling #trim
  at some point in the past.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  ###
  extend: ->
    @log "Extending group"

    compDuration = @containingComp().$.duration
    @getCitationLayer()?.$.outPoint = compDuration
    @getSpotlight()?.$.outPoint = compDuration
    @


  ###*
  Formerly called "bubbleUp", this function now adds an NFHighlightControlLayer
  for a given highlight or collection of highlights. Always adds spotlight
  controls, but will not add controls for or bubble up highlight properties
  unless the highlight is not already linked to another control layer.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {NFHighlightLayer | NFHighlightLayerCollection} highlightsToControl - the highlights to control
  @param {float} [time] - the time to create the control layer at
  @param {boolean} [trackSpotlights=yes] - whether or not spotlights should be tracked for these highlights
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
  ###
  addControlLayer: (highlightsToControl, time, trackSpotlights) ->
    @log "Adding control layer for highlights: #{highlightsToControl.toString()}"
    trackSpotlights ?= yes

    # If given a single highlight, wrap it.
    if highlightsToControl instanceof NFHighlightLayer
      highlightsToControl = new NFHighlightLayerCollection([highlightsToControl])

    unless highlightsToControl.isEmpty()
      highlightsToControl.forEach (highlight) =>

        # Make sure the highlight is in a page in the group
        highlightIsInGroup = no
        @getPages().forEach (pageInGroup) =>
          if pageInGroup.getPageComp().is highlight.getPageComp()
            highlightIsInGroup = yes
        unless highlightIsInGroup
          throw new Error "Cannot bubble highlight because it is not in this group!"

        sourceEffect = highlight.highlighterEffect()

        targetComp = @containingComp()

        controlLayer = NFHighlightControlLayer.newHighlightControlLayer
          group: @
          highlight: highlight
          time: time ? null

        if highlight.canBubbleUp()
          @log "Bubbling up highlight: #{highlight.toString()}"
          # Before actually doing the bubble up, we need to make
          # sure that there's a data layer for this part in the page comp
          highlight.containingComp().addHighlightDataLayerFor targetComp

          highlighterEffect = controlLayer.highlighterEffect()

          # Iterate through the properties and connect each one
          for highlighterProperty in NFHighlightLayer.highlighterProperties

            sourceValue = sourceEffect.property(highlighterProperty).value
            highlighterEffect.property(highlighterProperty).setValue(sourceValue)

            # Opacity needs a special expression since it's tied to the position
            # of the control layer
            if highlighterProperty is "Opacity"
              propExpressionName = "highlight-opacity-expression"
            else
              propExpressionName = "highlight-property-expression"

            sourceExpression = NFTools.readExpression propExpressionName,
              TARGET_COMP_NAME: targetComp.$.name
              CONTROL_LAYER_NAME: controlLayer.$.name
              PAGE_BASE_NAME: highlight.getPageComp().getPageBaseName()
              HIGHLIGHT_NAME: highlight.getName()
              HIGHLIGHTER_PROPERTY: highlighterProperty

            sourceEffect.property(highlighterProperty).expression = sourceExpression

        if trackSpotlights
          # Add a spotlight layer if one doesn't exist, and track the new highlight
          spotlightLayer = @getSpotlight() ? @addSpotlight(highlight)
          spotlightLayer.trackHighlight highlight
    @

  ###*
  Assigns the given highlight or highlights one or more control layers. Either
  connects to existing ones or creates new control layers if needed. Unbubbled
  highlights will be bubbled up.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {NFHighlightLayer | NFHighlightLayerCollection} highlights - the highlights to control
  @param {float} [time=currTime] - the time to create the control layer(s) at, if new
  layers are to be created
  @param {boolean} [trackSpotlights=yes] - whether or not spotlights should be tracked for these highlights
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
  ###
  assignControlLayer: (highlights, time, trackSpotlights) ->
    throw new Error "Empty highlight parameter" unless highlights?
    trackSpotlights ?= yes

    # If given a single highlight, wrap it.
    if highlights instanceof NFHighlightLayer
      highlights = new NFHighlightLayerCollection([highlights])

    unless highlights.isEmpty()

      existingControlLayers = @getControlLayers()
      highlights.forEach (highlight) =>

        # Is this highlight already connected to a control layer here?
        controlName = NFHighlightControlLayer.nameForPDFNumberAndHighlight @getPDFNumber(), highlight
        matchedLayer = @containingComp().layerWithName controlName
        if not matchedLayer?
          @addControlLayer highlight, time, trackSpotlights
        else
          # Already connected, so let's just add a spotlight marker to it
          matchedLayer.addSpotlightMarker
            time: time
    @

  ###*
  Animates the parent layer starting at the given time such that a given
  highlight or rect is visible and centered in frame, via the page parent layer.
  Always adds keyframes. Will NOT add page layers and will throw an
  error if the given highlight is not in this group already. use NFPartComp's
  animateTo() instead to perform all the page addition,
  pageturns, etc. IMPORTANT: You must provide either a highlight OR a layer and
  rect.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {Object} model - The options
  @param {NFHighlightLayer} [model.highlight] - The highlight to move to
  @param {rect} [model.rect] - The rect on the given layer to move to
  @param {NFPageLayer} [model.layer] - the layer the rect is on
  @param {float} [model.time=The current time] - The time to start the
  movement at
  @param {float} [model.duration=3.0] - The duration of the move
  @param {float} [model.maxScale=115] - The maximum a page will scale in this move
  @param {float} [model.fillPercentage=85] - the percentage of the width of the
  comp the highlight should fill
  @throws Throws error if not given a NFHighlightLayer as model.highlight OR
  valid model.layer and model.rect values.
  ###
  moveTo: (model) ->
    if model?.highlight?
      unless model.highlight instanceof NFHighlightLayer and @containsHighlight(model.highlight)
        throw new Error "\nInvalid highlight"
    else if model?.layer? and model.rect?
      unless model.layer instanceof NFPageLayer and @getPages().containsLayer model.layer
        throw new Error "Given Layer must be already in the group and an NFPageLayer"
    else
      throw new Error "Must provide either a highlight OR a layer and rect to move"

    model =
      highlight: model.highlight
      layer: model.layer
      rect: model.rect
      time: model.time ? @containingComp().getTime()
      duration: model.duration ? 3.0
      maxScale: model.maxScale ? 115
      fillPercentage: model.fillPercentage ? 85

    if model.highlight?
      @log "Moving to highlight: #{model.highlight.toString()} at time #{model.time}"
    else
      @log "Moving to a rect in layer #{model.layer.toString()} at time #{model.time}"

    positionProp = @paperParent.transform().position
    scaleProp = @paperParent.transform().scale

    # Move the time to the target time and unparent
    originalTime = @containingComp().getTime()
    @containingComp().setTime model.time

    originalParent = @paperParent.getParent()
    @paperParent.setParent null

    # Move to the Highlight or Rect
    if model.highlight?
      # Find out which layer contains the highlight at this time
      possibleLayers = @getPages().layersWithHighlight model.highlight
      activePageLayer = null
      possibleLayers.forEach (theLayer) =>
        activePageLayer = theLayer if theLayer.isActiveAtTime model.time
    else
      activePageLayer = model.layer

    keyframeTimes = [model.time, model.time + model.duration]

    scaleFactor = activePageLayer.getScaleFactorToFrameUp
      highlight: model.highlight
      rect: model.rect
      time: keyframeTimes[1]
      maxScale: model.maxScale
      fillPercentage: model.fillPercentage

    initialScale = scaleProp.valueAtTime model.time, false
    targetScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor]
    keyframeScales = [scaleProp.valueAtTime(model.time, false), targetScale]
    scaleProp.setValuesAtTimes keyframeTimes, keyframeScales

    positionDelta = activePageLayer.getPositionDeltaToFrameUp
      highlight: model.highlight
      rect: model.rect
      time: keyframeTimes[1]
    initialPosition = positionProp.valueAtTime model.time, false
    targetPosition = [initialPosition[0] + positionDelta[0], initialPosition[1] + positionDelta[1]]
    keyframePositions = [positionProp.valueAtTime(model.time, false), targetPosition]
    positionProp.setValuesAtTimes keyframeTimes, keyframePositions

    scaleProp.easyEaseKeyTimes
      keyTimes: keyframeTimes
    positionProp.easyEaseKeyTimes
      keyTimes: keyframeTimes

    # Restore the original parent and comp time
    @containingComp().setTime(originalTime)
    @paperParent.setParent originalParent

    @


  ###*
  Moves the given layers into the group and parents if indicated. Layers below
  the bottommost layer in the group will go at the bottom, and layers above the
  parent will go immediately below it.
  @memberof NFPaperLayerGroup
  @param {NFLayerCollection} layersToGather - the layers to gather up
  @param {boolean} [shouldParent=true] - whether or not to parent the new layers
  to the paper parent
  @returns {NFPaperLayerGroup} self
  ###
  gatherLayers: (layersToGather, shouldParent = yes) ->
    @log "Gathering layers: #{layersToGather.toString()}"
    childLayers = @getChildren()

    layersAboveGroup = new NFLayerCollection()
    layersBelowGroup = new NFLayerCollection()
    layersToGather.forEach (layer) =>
      layersAboveGroup.add layer if layer.index() < @paperParent.index()
      layersBelowGroup.add layer if layer.index() > childLayers.getBottommostLayer().index()

    # For the layers in this collection above the group
    while layersAboveGroup.count() > 0
      controlLayers = @getControlLayers()
      citationLayer = @getCitationLayer()
      if controlLayers.isEmpty()
        layerAbove = citationLayer ? @paperParent
      else
        layerAbove = controlLayers.getBottommostLayer()

      # starting with the bottommost and working up, move each one just below the lowest control layer
      bottomLayer = layersAboveGroup.getBottommostLayer()
      bottomLayer.moveAfter layerAbove
      layersAboveGroup.remove bottomLayer
    # for the layers in this coll below the group
    while layersBelowGroup.count() > 0
      # starting with the toppest and workingdown, move each one just below the bottomest layer in the group
      topLayer = layersBelowGroup.getTopmostLayer()
      topLayer.moveAfter childLayers.getBottommostLayer()
      layersBelowGroup.remove topLayer

      layersToGather.setParents(@paperParent) if shouldParent
    @
