###*
Creates a new NFHighlightControlLayer from a given AVLayer
@class NFHighlightControlLayer
@classdesc Subclass of {@link NFLayer} for a highlight control layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@property {NFHighlightLayer} highlight - the highlight this layer controls
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a highlight control
###
class NFHighlightControlLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    unless NFHighlightControlLayer.isHighlightControlLayer(@layer)
      throw new Error "NF Highlight Control Layer is invalid and the wrapper class cannot be created"
    @
  toString: ->
    return "NFHighlightControlLayer: '#{@layer.name}'"

  ###*
  Returns the spotlight markers
  @memberof NFHighlightControlLayer
  @returns {Object[]} an array of markers, with each item being an object
  containing 'time' and 'value' keys
  ###
  spotlightMarkers: ->
    spotMarkers = []
    markers = @markers()
    for idx in [1..markers.numKeys]
      thisMarkerValue = markers.keyValue idx
      if thisMarkerValue.comment is "Spotlight"
        markerObject =
          value: @markers().keyValue "Spotlight"
          time: @markers().keyTime "Spotlight"
        spotMarkers.push markerObject

    return spotMarkers

  ###*
  Returns the spotlight marker
  @memberof NFHighlightControlLayer
  @param {Object} [model] - the model
  @param {float} [model.time=currTime] - the marker time
  @param {float} [model.duration=5] - the marker duration
  @returns {NFHighlightControlLayer} self
  ###
  addSpotlightMarker: (model) ->
    model =
      time: model?.time ? @containingComp().getTime()
      duration: model?.duration ? 5

    # TODO: Deal with possiblility that we're creating intersecting markers...
    @addMarker
      comment: "Spotlight"
      time: model.time
      duration: model.duration

  ###*
  Sets the in point of the spotlight marker, keeping the out point where it is.
  If the new in point is after the current out point, the duration will become
  0 and the out point will move
  @memberof NFHighlightControlLayer
  @returns {NFHighlightControlLayer} self
  @param {float} newInPoint - the new in point
  ###
  setSpotlightMarkerInPoint: (newInPoint) ->
    spotMarkers = @spotlightMarkers()
    if spotMarkers.length is 0
      throw new Error "Can't set spotlight marker in point because there are no spotlight markers"

    oldMarker = spotMarkers[0]
    if spotMarkers.length > 1
      # Get the one with the closest in point
      for testMarker in spotMarkers
        currDistance = Math.abs(oldMarker.time - newInPoint)
        testDistance = Math.abs(testMarker.time - newInPoint)
        oldMarker = testMarker if testDistance < currDistance


    startDelta = newInPoint - oldMarker.time
    newDuration = oldMarker.value.duration - startDelta
    newDuration = 0 if newDuration < 0

    # Remove the old marker
    @markers().removeKey @layer.indexOfMarker("Spotlight")

    @addMarker
      comment: "Spotlight"
      time: newInPoint
      duration: newDuration
    @

  ###*
  Sets the out point of the spotlight marker, keeping the in point where it is.
  If the new out point is before the current in point, the whole marker will
  move to the new out point with a duration of 0.
  @memberof NFHighlightControlLayer
  @returns {NFHighlightControlLayer} self
  @param {float} newOutPoint - the new out point
  ###
  setSpotlightMarkerOutPoint: (newOutPoint) ->
    spotMarkers = @spotlightMarkers()
    if spotMarkers.length is 0
      throw new Error "Can't set spotlight marker out point because there are no spotlight markers"

    oldMarker = spotMarkers[0]
    if spotMarkers.length > 1
      # Get the one with the closest out point
      for testMarker in spotMarkers
        currDistance = Math.abs(oldMarker.time + oldMarker.value.duration - newOutPoint)
        testDistance = Math.abs(testMarker.time + testMarker.value.duration - newOutPoint)
        oldMarker = testMarker if testDistance < currDistance

    if newOutPoint < oldMarker.time
      newInPoint = newOutPoint
      duration = 0
    else
      newInPoint = oldMarker.time
      currentOutPoint = oldMarker.time + oldMarker.value.duration
      delta = newOutPoint - currentOutPoint
      duration = oldMarker.value.duration + delta

    # Remove the old marker
    @markers().removeKey @layer.indexOfMarker("Spotlight")

    @addMarker
      comment: "Spotlight"
      time: newInPoint
      duration: duration
    @

  ###*
  Returns the AV Highlighter effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Highlighter Property on the control layer
  ###
  highlighterEffect: ->
    return @layer.Effects.property("AV_Highlighter")

  ###*
  Returns the AV Highlight Control effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Highlighter Control property on the control layer
  ###
  highlightControlEffect: ->
    return @layer.Effects.property("AV_Highlight_Control")

  ###*
  Returns the AV Spotlight effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Spotlight property on the control layer
  ###
  spotlightEffect: ->
    return @layer.Effects.property("AV_Spotlight")

NFHighlightControlLayer = Object.assign NFHighlightControlLayer,

  ###*
  Returns the name for a control layer for a given PDF Number and highlight
  @memberof NFHighlightControlLayer
  @param {String} num - the PDF Number
  @param {NFHighlightLayer} highlight - the highlight
  @returns {String} the appropriate name
  ###
  nameForPDFNumberAndHighlight: (num, highlight) ->
    return "#{num} - #{highlight.layer.name} Highlight Control"

  ###*
  Returns whether or not the given AVLayer is a valid Highlight Control Layer
  @memberof NFHighlightControlLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid highlight layer
  ###
  isHighlightControlLayer: (theLayer) ->
    return theLayer.isSolid() and theLayer.name.indexOf("Highlight Control") >= 0

  ###*
  Creates a new NFHighlightControlLayer for the given page, at the given time,
  for the given highlight
  @memberof NFHighlightControlLayer
  @param {Object} model - the model
  @param {NFPaperLayerGroup} model.group - the layer group
  @param {NFHighlightLayer} model.highlight - the highlight
  @param {float} model.time - the start time for the control
  @returns {NFHighlightControlLayer} the new control layer
  ###
  newHighlightControlLayer: (model) ->
    throw new Error "Missing parameters" unless model?.group? and model.highlight?
    NFTools.log "Creating new control layer for highlight: #{model.highlight.toString()}"

    # Create the control layer
    partComp = model.group.containingComp()
    controlLayer = partComp.addSolid
      color: [1, 1, 0]
      name: NFHighlightControlLayer.nameForPDFNumberAndHighlight model.group.getPDFNumber(), model.highlight
      width: 10
      height: 10
    controlLayer.layer.enabled = no

    citationLayer = model.group.getCitationLayer()
    existingControlLayers = model.group.getControlLayers()
    if not existingControlLayers.isEmpty()
      controlLayer.moveBefore existingControlLayers.getTopmostLayer()
    else if citationLayer?
      controlLayer.moveAfter citationLayer
    else
      controlLayer.moveAfter model.group.paperParent

    controlLayer.layer.startTime = model.time ? partComp.getTime()
    controlLayer.layer.endTime = controlLayer.layer.startTime + 5
    controlLayer.setParent model.group.paperParent

    effects = controlLayer.effects()

    unless model.highlight.isBubbled()
      # Add the highlighter effect
      highlighterEffect = effects.addProperty "AV_Highlighter"
      highlighterEffect.name = model.highlight.layer.name

      # Add the control effect
      controlEffect = effects.addProperty "AV_Highlight_Control"
      controlEffect.name = "Highlight Control"
      controlEffect.property("Endless").setValue true

    # Add the spotlight markers
    controlLayer.addMarker
      comment: "Spotlight"
      time: controlLayer.layer.startTime + 1
      duration: 10

    return controlLayer
