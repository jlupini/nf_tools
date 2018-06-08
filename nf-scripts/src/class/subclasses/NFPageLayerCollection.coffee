###*
Creates a new NFPageLayerCollection from a given array of NFPageLayers
@class NFPageLayerCollection
@classdesc Subclass of {@link NFLayerCollection} for page layers
@param {NFPageLayer[]} layerArr - array of layers to use
@property {NFPageLayer[]} layers - array of layers
@extends NFLayerCollection
@throws Will throw an error if the array does not contain valid page layers
###
class NFPageLayerCollection extends NFLayerCollection
  constructor: (layerArr) ->
    NFLayerCollection.call(@, layerArr)
    for theLayer in @layers
      throw "You can only add NFPageLayers to an NFPageLayerCollection" unless theLayer instanceof NFPageLayer

    @
  # MARK: Instance Methods
  toString: ->
    infoString = "NFPageLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.toString() + ", "
    infoString += "]"

  ###*
  Adds an NFLayer or AVLayer to this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  @override
  @param {NFPageLayer | AVLayer} newLayer - the layer to add
  @throws Throw error if not adding a NFPageLayer or an AVLayer that's a valid NFPageLayer
  ###
  addLayer: (newLayer) ->
    if newLayer.isAVLayer()
      @layers.push new NFPageLayer(newLayer)
    else if newLayer instanceof NFPageLayer
      @layers.push newLayer
    else
      throw "addLayer() can only be used to add AVLayers or NFPageLayers to an NFPageLayerCollection"
    @

  ###*
  Returns NFHighlightLayerCollection of all highlights in all pages in the collection
  @memberof NFPageLayerCollection
  @returns {NFHighlightLayerCollection} all highlights in all pages in this collection
  ###
  highlights: ->
    highlightArray = []
    containingLayerArray = []
    for theLayer in @layers
      if theLayer instanceof NFPageLayer
        # Get the layer's NFPageComp
        for highlight in theLayer.highlights().layers
          highlightArray.push highlight
          containingLayerArray.push theLayer
    highlights = new NFHighlightLayerCollection(highlightArray)
    return highlights

  ###*
  Returns the NFPageLayerCollection of the pagelayers in the collection with
  the given highlight in them
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} the layers with the highlight
  @param {NFHighlightLayer} highlight - the highlight to look for
  ###
  layersWithHighlight: (highlight) ->
    foundHighlights = new NFPageLayerCollection
    for theLayer in @layers
      if theLayer instanceof NFPageLayer
        # Get the layer's NFPageComp
        for testHighlight in theLayer.highlights().layers
          foundHighlights.addLayer theLayer if highlight.is testHighlight
    return foundHighlights

  ###*
  Bubbles up the highlights in the given NFHighlightLayerCollection onto the
  page layers in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  @param {NFHighlightLayerCollection} highlightCollection - the highlights to bubble up
  ###
  bubbleUpHighlights: (highlightCollection) ->
    for layer in @layers
      pageHighlights = highlightCollection.getHighlightsInPage layer.getPageComp()
      layer.bubbleUp pageHighlights
    @

  ###*
  Returns true if the collection only contains pages from the same PDF
  @memberof NFPageLayerCollection
  @returns {boolean} whether all pages in this collection are from the same PDF
  ###
  fromSamePDF: ->
    return true if @count() is 0
    testNumber = @layers[0].getPDFNumber()
    for layer in @layers
      return false if layer.getPDFNumber() isnt testNumber
    return true

  ###*
  Always returns true. Overrides the function in NFLayerCollection
  @memberof NFPageLayerCollection
  @override
  @returns {boolean} true (because this has to contain only page layers)
  ###
  #
  onlyContainsPageLayers: ->
    return true

  ###*
  Run NFPageLayer#init on every page in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  ###
  initLayers: ->
    page.init() for page in @layers
    @

  ###*
  Run NFPageLayer#initLayerTransforms on every page in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  ###
  initLayerTransforms: ->
    page.initTransforms() for page in @layers
    @

  ###*
  Gives unique names to each layer and updates bubbled highlights
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  ###
  differentiate: ->
    return @ if @isEmpty()
    noLetterNames = new NFPageLayerCollection
    letteredNames = new NFPageLayerCollection
    for theLayer in @layers
      if theLayer.getName().indexOf("(") >= 0 and theLayer.getName().indexOf(")") >= 0
        letteredNames.addLayer theLayer
      else
        noLetterNames.addLayer theLayer

    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

    if letteredNames.isEmpty()
      for i in [0..noLetterNames.count()-1]
        theLayer = noLetterNames.layers[i]

        bubbledToFix = theLayer.bubbledHighlights()
        unless bubbledToFix.isEmpty()
          for highlight in bubbledToFix.layers
            highlight.fixExpressionWithDiffLetter(alphabet[i])

        theLayer.layer.name += " (#{alphabet[i]})"
        bubbledToFix.resetExpressionErrors()
    else
      lastUsedLetterIndex = null
      for theLayer in letteredNames.layers
        lastUsedLetter = theLayer.getName().charAt(theLayer.getName().indexOf("(")+1)
        letterIndex = alphabet.indexOf lastUsedLetter
        if lastUsedLetterIndex?
          lastUsedLetterIndex = letterIndex if letterIndex > lastUsedLetterIndex
        else
          lastUsedLetterIndex = letterIndex
      throw "Something is wrong with the layer naming..." unless lastUsedLetterIndex?

      for i in [0..noLetterNames.count()-1]
        theLayer = noLetterNames.layers[i]

        bubbledToFix = theLayer.bubbledHighlights()
        unless bubbledToFix.isEmpty()
          for highlight in bubbledToFix.layers
            highlight.fixExpressionWithDiffLetter(alphabet[lastUsedLetterIndex+1]).resetExpressionErrors()

        theLayer.layer.name += " (#{alphabet[lastUsedLetterIndex+1]})"
        bubbledToFix.resetExpressionErrors()

    @
    

  ###*
  Creates a new {@link NFPaperParentLayer} from this collection. probably
  best not to call this directly (use assignPaperParentLayer() instead) unless
  you really know what you're doing...
  @memberof NFPageLayerCollection
  @returns {NFPaperParentLayer} the new Paper Parent layer
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
  ###
  newPaperParentLayer: ->
    throw "Can't create a paper parent layer with no target layers" if @isEmpty()
    throw "Can't create a single paper parent layer for page layers from different PDFs" unless @fromSamePDF()
    newPaperParent = new NFPaperParentLayer(@nullify()).setName()
    return newPaperParent

  ###*
  Checks for an existing valid paper parent layer for these pages. Sets it as
  the parent if it exists, otherwise creates a new one.
  @memberof NFPageLayerCollection
  @returns {NFPaperParentLayer} the paper parent layer
  @param {boolean} [shouldMove=false] - whether or not the layers should move below their parent
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
  ###
  assignPaperParentLayer: (shouldMove = no) ->
    throw "Can't create a paper parent layer with no target layers" if @isEmpty()
    throw "Can't create a single paper parent layer for page layers from different PDFs" unless @fromSamePDF()
    paperParentLayer = @layers[0].findPaperParentLayer()
    if paperParentLayer?
      if shouldMove
        paperLayerGroup = new NFPaperLayerGroup(paperParentLayer)
        paperLayerGroup.gatherLayers @
    else
      paperParentLayer = @newPaperParentLayer()

    return paperParentLayer
