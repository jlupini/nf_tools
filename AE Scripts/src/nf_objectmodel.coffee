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
  getSpecializedLayer: ->
    # FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers, and Paper Parent Layers (YES)
    if @isPageLayer()
      return new NFPageLayer @layer
    else if @isHighlightLayer()
      return new NFHighlightLayer @layer
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
  effects: ->
    return @layer.Effects
  getEffectWithName: (effectName) ->
    return @layer.Effects.property(effectName)
  # Returns NFHighlightLayerCollection of all highlights in this page
  highlights: ->
    return @pageItem.highlights()
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
    highlighterProperties = [
      'Spacing'
      'Thickness'
      'Start Offset'
      'Completion'
      'Offset'
      'Opacity'
      'Highlight Colour'
      'End Offset'
    ]
    for highlighterProperty in highlighterProperties
      sourceValue = sourceEffect.property(highlighterProperty).value
      targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue)
      sourceExpression = "var offsetTime = comp(\"#{targetComp.name}\").layer(\"#{@containingPageLayer.layer.name}\").startTime;
                          comp(\"#{targetComp.name}\").layer(\"#{@containingPageLayer.layer.name}\").effect(\"#{@name}\")(\"#{highlighterProperty}\").valueAtTime(time+offsetTime)"
      sourceEffect.property(highlighterProperty).expression = sourceExpression

      @updateProperties()
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
  @
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
  # Returns true if the collection only contains NFPageLayers and no other types of NFLayers
  onlyContainsPageLayers: ->
    for theLayer in @layers
      return false unless theLayer instanceof NFPageLayer
    return true
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
    # FIXME: Should throw error if newLayer is not AVLayer
    if true #newLayer instanceof NFHighlightLayer
      @layers.push new NFHighlightLayer(newLayer)
    else
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection"
  # Overrides the function in NFLayerCollection
  onlyContainsPageLayers: ->
    return false
  # Overrides the function in NFLayerCollection. Just returns self because faster
  highlights: ->
    @
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
  NFHighlightLayerCollection: NFHighlightLayerCollection
  NFPageItem: NFPageItem
  NFPDF: NFPDF

# Put everything we changed back into app.NF
app.NF = Object.assign app.NF, NF
