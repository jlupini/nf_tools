###*
Creates a new NFSpotlightLayer from a given AVLayer
@class NFSpotlightLayer
@classdesc Subclass of {@link NFLayer} for a spotlight layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFSpotlightLayer extends NFLayer

  constructor: (layer) ->
    NFLayer.call(this, layer)
    unless NFSpotlightLayer.isSpotlightLayer(@$)
      throw new Error "NF Spotlight Layer is invalid and the wrapper class cannot be created"
    @

  toString: ->
    return "NFSpotlightLayer: '#{@$.name}'"

  ###*
  Start tracking a highlight
  @memberof NFSpotlightLayer
  @param {NFHighlightLayer} highlight - the new highlight to track
  @throw Throws error if highlight is already being tracked
  @returns {NFSpotlightLayer} self
  ###
  trackHighlight: (highlight) ->
    throw new Error "Highlight invalid to track" unless highlight instanceof NFHighlightLayer
    throw new Error "Already tracking highlight" if @mask().property(highlight.getName())?

    # Get the expression for the mask shape
    expression = NFTools.readExpression "spotlight-mask-expression",
      TARGET_PAGE: highlight.getPageComp().getPageBaseName()
      COMP_NAME: highlight.getPageComp().getName()
      HIGHLIGHT_LAYER_NAME: highlight.getName()
      HIGHLIGHT_CONTROL_LAYER_NAME: highlight.getControlLayer().getName()
      HIGHLIGHT_CONTROL_HIGHLIGHT_EFFECT_NAME: highlight.getName()

    # Setup the mask
    newMask = @mask().addProperty "Mask"
    newMask.name = highlight.getName()
    newMask.maskShape.expression = expression
    newMask.maskMode = MaskMode.SUBTRACT
    newMask.maskFeather.setValue [80, 80]
    newMask.maskExpansion.setValue 45

    # Get the expression for the opacity
    expression = NFTools.readExpression "spotlight-mask-opacity-expression",
      ON_VALUE: "100"
      HIGHLIGHT_CONTROL_LAYER_NAME: highlight.getControlLayer().getName()
      ANIMATION_DURATION: NFSpotlightLayer.duration
      PDF_NUMBER: highlight.getPDFNumber()

    newMask.maskOpacity.expression = expression

    @

  ###*
  Stop tracking a highlight
  @memberof NFSpotlightLayer
  @param {NFHighlightLayer} the highlight to stop tracking
  @returns {NFSpotlightLayer} self
  ###
  stopTrackingHighlight: (highlight) ->
    throw new Error "Highlight invalid to stop tracking" unless highlight instanceof NFHighlightLayer

    existingMask = @mask().property highlight.getName()
    if existingMask?
      existingMask.remove()
    else
      throw new Error "Can't stop tracking highlight because it's not currently being tracked"

    @


NFSpotlightLayer = Object.assign NFSpotlightLayer,

  duration: 1

  ###*
  Returns whether or not the given AVLayer is a valid Spotlight Layer
  @memberof NFSpotlightLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid spotlight layer
  ###
  isSpotlightLayer: (theLayer) ->
    return theLayer.isAVLayer() and theLayer.isSolid() and theLayer.name.indexOf "Spotlight" >= 0

  ###*
  Returns the name for a spotlight layer for a given PDF Number
  @memberof NFSpotlightLayer
  @returns {String} the appropriate name
  ###
  nameForPDFNumber: (num) ->
    return num + " - Spotlight"

  ###*
  Creates a new Spotlight layer for the given NFPaperLayerGroup. Also creates
  a spotData layer if this part doesn't have one yet.
  @memberof NFSpotlightLayer
  @param {NFPaperLayerGroup} group - the paper layer group
  @returns {NFSpotlightLayer} the new spotlight layer
  ###
  newSpotlightLayer: (group) ->
    throw new Error "group must be an NFPaperLayerGroup" unless group instanceof NFPaperLayerGroup

    # Add the spotData layer if missing
    containingComp = group.containingComp()
    unless containingComp.layerWithName("SpotData")?
      dataLayer = containingComp.addTextLayer
        at: containingComp.allLayers().count()-1
        time: 0
      expression = NFTools.readExpression "spotlight-data-expression"
      dataLayer.property("Text").property("Source Text").expression = expression
      dataLayer.$.enabled = no
      dataLayer.$.name = "SpotData"

    existingSpot = group.getSpotlight()
    return existingSpot if existingSpot?

    spotlightLayer = containingComp.addSolid
      color: [0.0078, 0, 0.1216]
      name: NFSpotlightLayer.nameForPDFNumber group.getPDFNumber()

    controlLayers = group.getControlLayers()
    if controlLayers.isEmpty()
      spotlightLayer.moveAfter group.paperParent
    else
      spotlightLayer.moveBefore controlLayers.getTopmostLayer()

    spotlightLayer.$.startTime = group.getPages().getEarliestLayer().$.inPoint

    # Set up the dummy mask
    newMask = spotlightLayer.mask().addProperty "Mask"
    newMask.name = "Dummy"
    newMask.maskShape.expression = "ori = [0, 0];createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);"
    newMask.maskMode = MaskMode.SUBTRACT
    newMask.maskOpacity.setValue 35

    # Get the expression for the opacity
    expression = NFTools.readExpression "spotlight-master-opacity-expression",
       ANIMATION_DURATION: NFSpotlightLayer.duration
       PDF_NUMBER: group.getPDFNumber()

    newMask.maskOpacity.expression = expression

    # Set the layer opacity expression
    spotlightCompFolderName = "Precomps"
    spotlightLayerName = "Spotlight Visibility"
    spotlightCompName = "Spotlight Reference"

    spotlightAVComp = NFProject.findItem spotlightCompName
    # If this project doesn't use this spotlight layer method, upgrade it.
    unless spotlightAVComp?
      precompsFolder = NFProject.findItem spotlightCompFolderName
      unless precompsFolder?
        precompsFolder = NFProject.findItem("Assets").item.addFolder spotlightCompFolderName

      spotlightAVComp = precompsFolder.items.addComp spotlightCompName, 100, 100, 1.0, 1, 30
      newLayer = spotlightAVComp.layers.addNull()
      newLayer.name = spotlightLayerName

    opacityProp = spotlightLayer.property("Transform").property("Opacity")
    opacityProp.expression = "comp(\"#{spotlightCompName}\")
                              .layer(\"#{spotlightLayerName}\")
                              .enabled * 100"

    return spotlightLayer
