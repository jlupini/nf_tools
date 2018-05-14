NF = app.NF ? {}

###
#     Important Notes:
#
#     Outside of this file, Classes can be accessed via the namespace NF.Models.MYClass
#     Inside this file, do NOT use that namespacing. Reference classes directly.
#
#     Because Javascript ES5 doesn't even pretend to try and support OOP, this is a little
#     hacky. Basically, each 'Class' is an object with a constructor function, which
#     has 'Class methods' that are function properties of that variable, and 'Instance methods' which
#     are function properties on the object's prototype (and can access properties of the instance)
#
#     Just a reminder to self: There are NO pointers. Everything is a copy. Be careful which
#     version of an object you're screwing around with if there's more than one for some reason...
#
#     Each class declaration should have three parts:
#       1) Constructor which returns itself and sets up any properties
#       2) Prototype setup. This is where instance methods are declared. Set the prototype
#          for the new class to a new object that combines an object containing instance methods
#          with either the new class's prototype or a new instance of its superclass.
#          The superclass instance becomes the new class's prototype.
#       3) Class methods, added to the new class
#
#     If you add new classes, you MUST add them to the NF.Models namespace at the bottom of this file.
#     Otherwise they will be invisible and pointless.
#
###

###
#    DECLARE CLASSES
###

###
#    NF LAYER
#
###
NFLayer = (layer) ->
  @layer = layer
  @
# Instance Methods
NFLayer:: = Object.assign NFLayer::,
  isPageLayer: ->
    return NFPageLayer.isPageLayer(@layer)
  isHighlightLayer: ->
    return NFHighlightLayer.isHighlightLayer(@layer)
  isPaperParentLayer: ->
    return NFPaperParentLayer.isPaperParentLayer(@layer)
  getSpecializedLayer: ->
    # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers
    if @isPageLayer()
      return new NFPageLayer @layer
    else if @isHighlightLayer()
      return new NFHighlightLayer @layer
    else if @isPaperParentLayer()
      return new NFPaperParentLayer @layer
    else
      return @
  getInfo: ->
    return "NFLayer: '#{@layer.name}'"
  # Returns true if the layer has a null parent
  hasNullParent: ->
    if @layer.parent?
      return @layer.parent.nullLayer
    return false
  # Checks to see if a given NFLayer's layer is the same as this one's
  # For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  sameLayerAs: (testLayer) ->
    return no unless testLayer?
    return @layer.index == testLayer.layer.index and @layer.containingComp.id == testLayer.layer.containingComp.id
# Class Methods
NFLayer = Object.assign NFLayer,
  # Returns a new Specialized NFLayer from an AVLayer
  getSpecializedLayerFromAVLayer: (theLayer) ->
    throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer" unless theLayer instanceof AVLayer
    tmpLayer = new NFLayer theLayer
    return tmpLayer.getSpecializedLayer()
  # Returns true if the given AVLayer is a comp layer
  isCompLayer: (theLayer) ->
    return theLayer instanceof AVLayer and theLayer.source instanceof CompItem

###
#    NF PAGE LAYER
#
#    (Subclass of NFLayer)
#
###
NFPageLayer = (layer) ->
  NFLayer.call(this, layer)
  throw "Cannot create an NFPageLayer from a layer without a source" unless layer.source?
  @pageItem = new NFPageItem layer.source
  @
# Initialize the prototype as a new instance of the superclass, then add instance methods
# Instance Methods
NFPageLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFPageLayer: '#{@layer.name}'"
  # Returns the paper parent layer. If the parent exists but is not attached, this will not return it.
  getPaperParentLayer: ->
    if @layer.parent?
      return new NFPaperParentLayer(@layer.parent)
    else
      return null
  effects: ->
    return @layer.Effects
  getEffectWithName: (effectName) ->
    return @layer.Effects.property(effectName)
  # Returns NFHighlightLayerCollection of all highlights in this page
  highlights: ->
    return @pageItem.highlights()
  # Returns NFHighlightLayerCollection of all highlights bubbled onto this page layer
  bubbledHighlights: ->
    bubbledHighlights = highlight if highlight.bubbled and highlight.connectedPageLayer.sameLayerAs(@) for highlight in @highlights().layers
    return new NFHighlightLayerCollection(bubbledHighlights)
  # Returns whether or not the page has been initted with the below methods
  isInitted: ->
    return @layer.name.indexOf "[+]"
  # Changes the page name to mark the page layer as initted, and updates bubbled highlights
  markInitted: ->
    unless @isInitted()
      @layer.name.replace " NFPage", " [+]"
      if @bubbledHighlights.count() > 0
        for highlight in @bubbledHighlights.layers
          highlight.fixExpressionAfterInit()
  # Adds the non-transform init properties (dropshadow, motion blur, etc)
  init: ->
    @layer.motionBlur = true
    @setDropShadow()
    @markInitted()
  # Sets the drop shadow for the layer
  setDropShadow: ->
    shadowProp = @effects().property('ADBE Drop Shadow') ? @effects().addProperty('ADBE Drop Shadow')
    shadowProp.property('Opacity').setValue(191.25)
    shadowProp.property('Direction').setValue(0)
    shadowProp.property('Distance').setValue(20)
    shadowProp.property('Softness').setValue(300)
  # Adds the transform init properties (size, position)
  initTransforms: ->
    @setInitSize()
    @setInitPosition()
  # Sets the size of the layer to the Init size. Returns false and doesn't set size if there are existing keyframes
  setInitSize: ->
    return false if @layer.property('Transform').property('Scale').numKeys > 0
    @layer.property('Transform').property('Scale').setValue [50,50,50]
    return true
  # Sets the position of the layer to the Init position. Returns false and doesn't set position if there are existing keyframes
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
  # Returns the PDF number as a String
  getPDFNumber: ->
    @pageItem.getPDFNumber()
  # Returns the page number as a String
  getPageNumber: ->
    @pageItem.getPageNumber()
  # Returns the containing NFPartComp
  containingComp: ->
    return new NFComp @layer.containingComp
# Class Methods
NFPageLayer = Object.assign NFPageLayer,
  # Returns true if the given AVLayer is a Page Layer
  isPageLayer: (theLayer) ->
    return NFLayer.isCompLayer(theLayer) and theLayer.source.name.indexOf("NFPage") >= 0

###
#    NF IMAGE LAYER
#
#    (Subclass of NFLayer)
#
###
NFImageLayer = (layer) ->
  NFLayer.call(this, layer)
  @
# Instance Methods
NFImageLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFImageLayer: '#{@layer.name}'"


###
#    NF GAUSSY LAYER
#
#    (Subclass of NFLayer)
#
###
NFGaussyLayer = (layer) ->
  NFLayer.call(this, layer)
  @
# Instance Methods
NFGaussyLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFGaussyLayer: '#{@layer.name}'"


###
#    NF EMPHASIS LAYER
#
#    (Subclass of NFLayer)
#
###
NFEmphasisLayer = (layer) ->
  NFLayer.call(this, layer)
  @
NFEmphasisLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFEmphasisLayer: '#{@layer.name}'"


###
#    NF HIGHLIGHT LAYER
#
#    (inherits from NFLayer)
#
###
NFHighlightLayer = (layer) ->
  NFLayer.call(this, layer)
  unless NFHighlightLayer.isHighlightLayer(@layer)
    throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect"
  @updateProperties()
  @
# Instance Methods
NFHighlightLayer:: = Object.assign new NFLayer(),
  # Updates values of all Properties. Run after changing anything that buggers these up
  updateProperties: ->
    @name = @layer.name
    @bubbled = @highlighterEffect().property("Spacing").expressionEnabled
    @broken = @highlighterEffect().property("Spacing").expressionError isnt ""

    # The NFPageLayer this highlight was found in.
    # Should be set by any function that looks inside NFPageLayers for highlights and returns the highlights
    # Is required to bubble up
    @containingPageLayer ?= null
    # The NFPageLayer this highlight is bubbled up to
    @connectedPageLayer = null
    if @bubbled
      expression = @highlighterEffect().property("Spacing").expression
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression)
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression)
      comp = NF.Util.findItem compName
      if comp?
        layer = comp.layer layerName
        @connectedPageLayer = new NFPageLayer(layer) if layer?
  getInfo: ->
    return "NFHighlightLayer: '#{@name}'"
  # Returns the NFPageItem this highlight lives in
  getPageItem: ->
    return new NFPageItem(@layer.containingComp)
  # Returns the AV Highlighter effect
  highlighterEffect: ->
    return @layer.Effects.property("AV_Highlighter")
  # Returns the Bubbled Up AV Highlighter effect on a page layer
  connectedPageLayerHighlighterEffect: ->
    if @connectedPageLayer?
      expression = @highlighterEffect().property("Spacing").expression
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression)
      effect = @connectedPageLayer.getEffectWithName(effectName)
      return effect
    return null
  # Returns true if the highlight can be bubbled up
  canBubbleUp: ->
    return not ((@bubbled and not @broken) or not @containingPageLayer?)
  # Bubbles up highlight to the containingPageLayer
  # Will throw an error if there's no containingPageLayer or if (@bubbled and not @broken)
  bubbleUp: ->
    if @bubbled and not @broken
      throw "Cannot bubble highlight if already connected and not broken. Disconnect first"
    unless @containingPageLayer?
      throw "Cannot bubble highlight without a containingPageLayer"

    targetPageLayerEffects = @containingPageLayer.effects()
    sourceEffect = @highlighterEffect()

    targetHighlighterEffect = targetPageLayerEffects.addProperty('AV_Highlighter')
    targetHighlighterEffect.name = @name

    targetComp = @containingPageLayer.layer.containingComp

    # Iterate through the properties and connect each one
    for highlighterProperty in NF.Util.highlighterProperties
      sourceValue = sourceEffect.property(highlighterProperty).value
      targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue)
      sourceExpression = "var offsetTime = comp(\"#{targetComp.name}\").layer(\"#{@containingPageLayer.layer.name}\").startTime;
                          comp(\"#{targetComp.name}\").layer(\"#{@containingPageLayer.layer.name}\").effect(\"#{@name}\")(\"#{highlighterProperty}\").valueAtTime(time+offsetTime)"
      sourceEffect.property(highlighterProperty).expression = sourceExpression

      @updateProperties()
  # Fixes the expression after initting if the page layer name changed and there was already an existing expression
  fixExpressionAfterInit: ->
    if @bubbled
      for property in NF.Util.highlighterProperties
        expression = @highlighterEffect.property(property).expression
        @highlighterEffect.property(property).expression = expression.replace " NFPage", " [+]"
  # Disconnects bubbleups in this highlight layer
  disconnect: ->
    # Remove the bubbled up AV Highlighter Effect if it exists
    @connectedPageLayerHighlighterEffect()?.remove()
    effect = @highlighterEffect()
    propertyCount = effect?.numProperties
    for i in [1..propertyCount]
      property = effect.property(i)
      property.expression = ""
    @updateProperties()
# Class Methods
NFHighlightLayer = Object.assign NFHighlightLayer,
  # Returns whether or not the given AVLayer is a valid Highlight Layer
  isHighlightLayer: (theLayer) ->
    return theLayer instanceof ShapeLayer and theLayer.Effects.property(1)?.matchName is "AV_Highlighter"

###
#    NF PAPER PARENT LAYER
#
#    (inherits from NFLayer)
###
NFPaperParentLayer = (layer) ->
  NFLayer.call(this, layer)
  throw "Can only create a NFPaperParentLayer from a null layer" unless @layer.nullLayer
  @
# Instance Methods
NFPaperParentLayer:: = Object.assign new NFLayer(),
  getInfo: ->
    return "NFPaperParentLayer: '#{@layer.name}'"
  # Returns an array of child NFLayers
  getChildren: ->
    # Look for all layers in the comp this layer is in whose parents are this layer
    allLayers = @layer.containingComp.layers
    childLayers = []

    i = 1
    while i <= allLayers.length
      testLayer = new NFLayer allLayers[i]

      # If this layer is the parent...
      if testLayer.layer.parent is @layer

        # Convert to page, image or gaussy if it's a specialized layer
        testLayer = testLayer.getSpecializedLayer()
        childLayers.push testLayer
      i++

    return childLayers
# Class Methods
NFPaperParentLayer = Object.assign NFPaperParentLayer,
  # Tests an AV layer to see if it can be a paper parent Layer
  isPaperParentLayer: (layer) ->
    return layer.nullLayer and layer.name.indexOf 'PDF' >= 0
  # Returns the name string for the paper parent for a given layer
  getPaperParentNameForPageLayer: (pageLayer) ->
  	return 'PDF ' + pageLayer.getPDFNumber()
  # Returns the paperParentLayer for a given page layer
  getPaperParentLayerForPageLayers: (pageLayer) ->
    paperParent = pageLayer.getPaperParentLayer()
    unless paperParent?
      paperParent = pageLayer.containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(pageLayer))
    return paperParent
  # Creates a new paperParentLayer for a given collection of Page Layers
  newPaperParentLayerForPageLayers: (pageLayers) ->
    throw "Can only create a new paper parent layer from a NFPageLayerCollection" unless pageLayers instanceof NFPageLayerCollection
    throw "Can't create a single paper parent layer for page layers from different PDFs" unless pageLayers.fromSamePDF()
    # FIXME: Pickup here - this is for NFPageLayerCollection's method connectToParents()


###
#    NF LAYER COLLECTION
#
#    A collection of NF Layers
#
###
NFLayerCollection = (layerArr) ->
  @layers = layerArr ? []
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFLayers to an NFLayerCollection" unless theLayer instanceof NFLayer
  @
NFLayerCollection:: = Object.assign NFLayerCollection::,
  getInfo: ->
    infoString = "NFLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"
  addNFLayer: (newLayer) ->
    if newLayer instanceof NFLayer
      @layers.push newLayer
    else
      throw "You can only add NFLayers to an NFLayerCollection"
  # Returns true if the collection only contains NFPageLayers and no other types of NFLayers
  onlyContainsPageLayers: ->
    for theLayer in @layers
      return false unless theLayer instanceof NFPageLayer
    return true
  getPageLayerCollection: ->
    return new NFPageLayerCollection @layers
  # Shortcut to access the number of layers in the collection
  count: ->
    return @layers.length
  # Returns true if the collection is empty
  isEmpty: ->
    return @count() is 0
# Class Methods
NFLayerCollection = Object.assign NFLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFLayer(layer)
      newLayer.getSpecializedLayer()
    return new NFLayerCollection newArray


###
#    NF PAGE LAYER COLLECTION
#
#    A collection of NF Page Layers
#
###
NFPageLayerCollection = (layerArr) ->
  NFLayerCollection.call(this, layerArr)
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFPageLayers to an NFPageLayerCollection" unless theLayer instanceof NFPageLayer
  @
# Instance Methods
NFPageLayerCollection:: = Object.assign new NFLayerCollection(),
  addNFLayer: (newLayer) ->
    @addNFPageLayer(newLayer)
  addNFPageLayer: (newLayer) ->
    if newLayer instanceof NFPageLayer
      @layers.push newLayer
    else
      throw "addNFPageLayer() can only be used to add NFPageLayers to an NFPageLayerCollection"
  addAVLayer: (newLayer) ->
    if newLayer instanceof AVLayer
      @layers.push new NFPageLayer(newLayer)
    else
      throw "addAVLayer() can only be used to add AVLayers to an NFPageLayerCollection"
  # Returns NFHighlightLayerCollection of all highlights in all pages in the collection
  highlights: ->
    highlightArray = []
    containingLayerArray = []
    for theLayer in @layers
      if theLayer instanceof NFPageLayer
        # Get the layer's NFPageItem
        for highlight in theLayer.highlights().layers
          highlightArray.push highlight
          containingLayerArray.push theLayer
    highlights = new NFHighlightLayerCollection(highlightArray)
    return highlights if highlights.isEmpty()
    for i in [0..highlights.count()-1]
      highlights.layers[i].containingPageLayer = containingLayerArray[i]
    return highlights
  # Returns true if the collection only contains pages from the same PDF
  fromSamePDF: ->
    return true if @count() is 0
    testNumber = @layers[0].getPDFNumber()
    for layer in @layers
      return false if layer.getPDFNumber() isnt testNumber
    return true
  # Overrides the function in NFLayerCollection
  onlyContainsPageLayers: ->
    return true
  initLayers: ->
    page.init() for page in @layers
  initLayerTransforms: ->
    page.initTransforms() for page in @layers
  connectToParents: ->
    for pageLayer in @layers
      paperParentLayer = pageLayer.containingComp()
      # get PDF #
      # get layer name
      # Look for layer
      # if it doesn't exist
        # make it and put it above the pageLayer
      # if it does
        # put this pagelayer below it
# Class Methods
NFPageLayerCollection = Object.assign NFPageLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFLayer(layer)
      newLayer.getSpecializedLayer()
    return new NFPageLayerCollection newArray

###
#    NF HIGHLIGHT LAYER COLLECTION
#
#    A collection of NF Highlight Layers
#
###
NFHighlightLayerCollection = (layerArr) ->
  NFLayerCollection.call(this, layerArr)
  if layerArr?
    for theLayer in layerArr
      throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection" unless theLayer instanceof NFHighlightLayer

  @
# Instance Methods
NFHighlightLayerCollection:: = Object.assign new NFLayerCollection(),
  getInfo: ->
    infoString = "NFHighlightLayerCollection: ["
    for theLayer in @layers
      infoString += theLayer.getInfo() + ", "
    infoString += "]"
  addNFLayer: (newLayer) ->
    @addNFHighlightLayer(newLayer)
  addNFHighlightLayer: (newLayer) ->
    if newLayer instanceof NFHighlightLayer
      @layers.push newLayer
    else
      throw "addNFHighlightLayer() can only be used to add NFHighlightLayers to an NFHighlightLayerCollection"
  addAVLayer: (newLayer) ->
    if newLayer instanceof AVLayer
      @layers.push new NFHighlightLayer(newLayer)
    else
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection"
  # Overrides the function in NFLayerCollection
  onlyContainsPageLayers: ->
    return false
  # Checks to see if any highlights in the collection share the same name
  duplicateNames: ->
    nameArr = []
    nameArr.push theLayer.name for theLayer in @layers
    return NF.Util.hasDuplicates(nameArr)
  disconnectHighlights: ->
    highlight.disconnect() for highlight in @layers
  bubbleUpHighlights: ->
    highlight.bubbleUp() for highlight in @layers
# Class Methods
NFHighlightLayerCollection = Object.assign NFHighlightLayerCollection,
  # Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: (arr) ->
    # FIXME: Should throw error if each layer isnt an AVLayer
    newArray = for layer in arr
      newLayer = new NFHighlightLayer(layer)
    return new NFHighlightLayerCollection newArray

###
#    NF Comp
#
#    A composition
#
###
NFComp = (comp) ->
  # FIXME: Check to make sure we've been given a valid comp and throw error if not
  throw "Can't create an NFComp without a given comp" unless comp?
  @comp = comp
  @name = @comp.name
  @
# Instance Methods
NFComp:: = Object.assign NFComp::,
  getInfo: ->
    return "NFComp: '#{@name}'"
  selectedLayers: ->
    return NFLayerCollection.collectionFromAVLayerArray @comp.selectedLayers
  # Throws an error if there are non-page layers selected
  selectedPageLayers: ->
    selectedPageLayers = new NFPageLayerCollection
    for layer in @selectedLayers()
      selectedPageLayers.addNFPageLayer layer if layer instanceOf NFPageLayer
    return selectedPageLayers
  layerWithName: (name) ->
    theLayer = @comp.layers?.byName(name)
    if theLayer?
      foundLayer = new NFLayer(theLayer)
      foundLayer = foundLayer.getSpecializedLayer()
    return null

###
#    NF Part Comp
#
#    subclass of NFComp
#    A part composition which can contain pageLayers and other such things
#
###
NFPartComp = (comp) ->
  NFComp.call(this, comp)
  # FIXME: Check to make sure we've been given a valid comp and throw error if not
  throw "Can't create an NFPartComp without a given comp" unless comp?
  @comp = comp
  @name = @comp.name
  @
# Instance Methods
NFPartComp:: = Object.assign NFPartComp::,
  getInfo: ->
    return "NFPartComp: '#{@name}'"

###
#    NF PAGE ITEM
#
#    The composition page item
#
###
NFPageItem = (item) ->
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

###
#    NF PDF
#
#    A collection of Page Items
#
###
NFPDF = (pageArr) ->
  @pages = pageArr
# Instance Methods
NFPDF:: = Object.assign NFPDF::,
  getInfo: ->
    # FIXME: Write this function
    return "NFPDF: 'FIXME'"
  addNFPageItem: (newPage) ->
    if newPage instanceof NFPageItem
      @layers.push newPage
    else
      throw "You can only add NFPageItems to an NFPDF"

# Add all our classes to NF.Models
NF.Models =
  NFLayer: NFLayer
  NFPageLayer: NFPageLayer
  NFImageLayer: NFImageLayer
  NFGaussyLayer: NFGaussyLayer
  NFEmphasisLayer: NFEmphasisLayer
  NFHighlightLayer: NFHighlightLayer
  NFPaperParentLayer: NFPaperParentLayer
  NFLayerCollection: NFLayerCollection
  NFPageLayerCollection: NFPageLayerCollection
  NFHighlightLayerCollection: NFHighlightLayerCollection
  NFPageItem: NFPageItem
  NFPDF: NFPDF
  NFComp: NFComp
  NFPartComp: NFPartComp

# Put everything we changed back into app.NF
app.NF = Object.assign app.NF, NF
