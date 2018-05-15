/*
 *    NF Comp
 *
 *    A composition
 *
 */
var NFComp;

NFComp = function(comp) {
  if (comp == null) {
    // FIXME: Check to make sure we've been given a valid comp and throw error if not
    throw "Can't create an NFComp without a given comp";
  }
  this.comp = comp;
  this.name = this.comp.name;
  this.id = this.comp.id;
  return this;
};

// Instance Methods
NFComp.prototype = Object.assign(NFComp.prototype, {
  getInfo: function() {
    return `NFComp: '${this.name}'`;
  },
  selectedLayers: function() {
    return NFLayerCollection.collectionFromAVLayerArray(this.comp.selectedLayers);
  },
  // Throws an error if there are non-page layers selected
  selectedPageLayers: function() {
    var i, layer, len, ref, selectedPageLayers;
    selectedPageLayers = new NFPageLayerCollection;
    ref = this.selectedLayers();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer(instanceOf(NFPageLayer))) {
        selectedPageLayers.addNFPageLayer(layer);
      }
    }
    return selectedPageLayers;
  },
  layerWithName: function(name) {
    var foundLayer, ref, theLayer;
    theLayer = (ref = this.comp.layers) != null ? ref.byName(name) : void 0;
    if (theLayer != null) {
      foundLayer = new NFLayer(theLayer);
      foundLayer = foundLayer.getSpecializedLayer();
    }
    return null;
  }
});

/*
 *    NF EMPHASIS LAYER
 *
 *    (Subclass of NFLayer)
 *
 */
var NFEmphasisLayer;

NFEmphasisLayer = function(layer) {
  NFLayer.call(this, layer);
  return this;
};

NFEmphasisLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return `NFEmphasisLayer: '${this.layer.name}'`;
  }
});

/*
 *    NF GAUSSY LAYER
 *
 *    (Subclass of NFLayer)
 *
 */
var NFGaussyLayer;

NFGaussyLayer = function(layer) {
  NFLayer.call(this, layer);
  return this;
};

// Instance Methods
NFGaussyLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return `NFGaussyLayer: '${this.layer.name}'`;
  }
});

/*
 *    NF HIGHLIGHT LAYER
 *
 *    (inherits from NFLayer)
 *
 */
var NFHighlightLayer;

NFHighlightLayer = function(layer) {
  NFLayer.call(this, layer);
  if (!NFHighlightLayer.isHighlightLayer(this.layer)) {
    throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect";
  }
  this.updateProperties();
  return this;
};

// Instance Methods
NFHighlightLayer.prototype = Object.assign(new NFLayer(), {
  // Updates values of all Properties. Run after changing anything that buggers these up
  updateProperties: function() {
    var comp, compName, expression, layer, layerName;
    this.name = this.layer.name;
    this.bubbled = this.highlighterEffect().property("Spacing").expressionEnabled;
    this.broken = this.highlighterEffect().property("Spacing").expressionError !== "";
    // The NFPageLayer this highlight was found in.
    // Should be set by any function that looks inside NFPageLayers for highlights and returns the highlights
    // Is required to bubble up
    if (this.containingPageLayer == null) {
      this.containingPageLayer = null;
    }
    // The NFPageLayer this highlight is bubbled up to
    this.connectedPageLayer = null;
    if (this.bubbled) {
      expression = this.highlighterEffect().property("Spacing").expression;
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression);
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression);
      comp = NF.Util.findItem(compName);
      if (comp != null) {
        layer = comp.layer(layerName);
        if (layer != null) {
          return this.connectedPageLayer = new NFPageLayer(layer);
        }
      }
    }
  },
  getInfo: function() {
    return `NFHighlightLayer: '${this.name}'`;
  },
  // Returns the NFPageItem this highlight lives in
  getPageItem: function() {
    return new NFPageItem(this.layer.containingComp);
  },
  // Returns the AV Highlighter effect
  highlighterEffect: function() {
    return this.layer.Effects.property("AV_Highlighter");
  },
  // Returns the Bubbled Up AV Highlighter effect on a page layer
  connectedPageLayerHighlighterEffect: function() {
    var effect, effectName, expression;
    if (this.connectedPageLayer != null) {
      expression = this.highlighterEffect().property("Spacing").expression;
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression);
      effect = this.connectedPageLayer.getEffectWithName(effectName);
      return effect;
    }
    return null;
  },
  // Returns true if the highlight can be bubbled up
  canBubbleUp: function() {
    return !((this.bubbled && !this.broken) || (this.containingPageLayer == null));
  },
  // Bubbles up highlight to the containingPageLayer
  // Will throw an error if there's no containingPageLayer or if (@bubbled and not @broken)
  bubbleUp: function() {
    var highlighterProperty, j, len, ref, results, sourceEffect, sourceExpression, sourceValue, targetComp, targetHighlighterEffect, targetPageLayerEffects;
    if (this.bubbled && !this.broken) {
      throw "Cannot bubble highlight if already connected and not broken. Disconnect first";
    }
    if (this.containingPageLayer == null) {
      throw "Cannot bubble highlight without a containingPageLayer";
    }
    targetPageLayerEffects = this.containingPageLayer.effects();
    sourceEffect = this.highlighterEffect();
    targetHighlighterEffect = targetPageLayerEffects.addProperty('AV_Highlighter');
    targetHighlighterEffect.name = this.name;
    targetComp = this.containingPageLayer.layer.containingComp;
    ref = NF.Util.highlighterProperties;
    // Iterate through the properties and connect each one
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      highlighterProperty = ref[j];
      sourceValue = sourceEffect.property(highlighterProperty).value;
      targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue);
      sourceExpression = `var offsetTime = comp("${targetComp.name}").layer("${this.containingPageLayer.layer.name}").startTime; comp("${targetComp.name}").layer("${this.containingPageLayer.layer.name}").effect("${this.name}")("${highlighterProperty}").valueAtTime(time+offsetTime)`;
      sourceEffect.property(highlighterProperty).expression = sourceExpression;
      results.push(this.updateProperties());
    }
    return results;
  },
  // Fixes the expression after initting if the page layer name changed and there was already an existing expression
  fixExpressionAfterInit: function() {
    var expression, j, len, property, ref, results;
    if (this.bubbled) {
      ref = NF.Util.highlighterProperties;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        property = ref[j];
        expression = this.highlighterEffect.property(property).expression;
        results.push(this.highlighterEffect.property(property).expression = expression.replace(" NFPage", " [+]"));
      }
      return results;
    }
  },
  // Disconnects bubbleups in this highlight layer
  disconnect: function() {
    var effect, i, j, property, propertyCount, ref, ref1;
    // Remove the bubbled up AV Highlighter Effect if it exists
    if ((ref = this.connectedPageLayerHighlighterEffect()) != null) {
      ref.remove();
    }
    effect = this.highlighterEffect();
    propertyCount = effect != null ? effect.numProperties : void 0;
    for (i = j = 1, ref1 = propertyCount; (1 <= ref1 ? j <= ref1 : j >= ref1); i = 1 <= ref1 ? ++j : --j) {
      property = effect.property(i);
      property.expression = "";
    }
    return this.updateProperties();
  }
});

// Class Methods
NFHighlightLayer = Object.assign(NFHighlightLayer, {
  // Returns whether or not the given AVLayer is a valid Highlight Layer
  isHighlightLayer: function(theLayer) {
    var ref;
    return theLayer instanceof ShapeLayer && ((ref = theLayer.Effects.property(1)) != null ? ref.matchName : void 0) === "AV_Highlighter";
  }
});

/*
 *    NF HIGHLIGHT LAYER COLLECTION
 *
 *    A collection of NF Highlight Layers
 *
 */
var NFHighlightLayerCollection;

NFHighlightLayerCollection = function(layerArr) {
  var i, len, theLayer;
  NFLayerCollection.call(this, layerArr);
  if (layerArr != null) {
    for (i = 0, len = layerArr.length; i < len; i++) {
      theLayer = layerArr[i];
      if (!(theLayer instanceof NFHighlightLayer)) {
        throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection";
      }
    }
  }
  return this;
};

// Instance Methods
NFHighlightLayerCollection.prototype = Object.assign(new NFLayerCollection(), {
  getInfo: function() {
    var i, infoString, len, ref, theLayer;
    infoString = "NFHighlightLayerCollection: [";
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  },
  addNFLayer: function(newLayer) {
    return this.addNFHighlightLayer(newLayer);
  },
  addNFHighlightLayer: function(newLayer) {
    if (newLayer instanceof NFHighlightLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "addNFHighlightLayer() can only be used to add NFHighlightLayers to an NFHighlightLayerCollection";
    }
  },
  addAVLayer: function(newLayer) {
    if (newLayer instanceof AVLayer) {
      return this.layers.push(new NFHighlightLayer(newLayer));
    } else {
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection";
    }
  },
  // Overrides the function in NFLayerCollection
  onlyContainsPageLayers: function() {
    return false;
  },
  // Checks to see if any highlights in the collection share the same name
  duplicateNames: function() {
    var i, len, nameArr, ref, theLayer;
    nameArr = [];
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      nameArr.push(theLayer.name);
    }
    return NF.Util.hasDuplicates(nameArr);
  },
  disconnectHighlights: function() {
    var highlight, i, len, ref, results;
    ref = this.layers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      results.push(highlight.disconnect());
    }
    return results;
  },
  bubbleUpHighlights: function() {
    var highlight, i, len, ref, results;
    ref = this.layers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      results.push(highlight.bubbleUp());
    }
    return results;
  }
});

// Class Methods
NFHighlightLayerCollection = Object.assign(NFHighlightLayerCollection, {
  // Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
    // FIXME: Should throw error if each layer isnt an AVLayer
    newArray = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = arr.length; i < len; i++) {
        layer = arr[i];
        results.push(newLayer = new NFHighlightLayer(layer));
      }
      return results;
    })();
    return new NFHighlightLayerCollection(newArray);
  }
});

/*
 *    NF IMAGE LAYER
 *
 *    (Subclass of NFLayer)
 *
 */
var NFImageLayer;

NFImageLayer = function(layer) {
  NFLayer.call(this, layer);
  return this;
};

// Instance Methods
NFImageLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return `NFImageLayer: '${this.layer.name}'`;
  }
});

/*
 *    NF LAYER
 *
 */
var NFLayer;

NFLayer = function(layer) {
  this.layer = layer;
  return this;
};

// Instance Methods
NFLayer.prototype = Object.assign(NFLayer.prototype, {
  isPageLayer: function() {
    return NFPageLayer.isPageLayer(this.layer);
  },
  isNullLayer: function() {
    return this.layer.nullLayer;
  },
  isHighlightLayer: function() {
    return NFHighlightLayer.isHighlightLayer(this.layer);
  },
  isPaperParentLayer: function() {
    return NFPaperParentLayer.isPaperParentLayer(this.layer);
  },
  getSpecializedLayer: function() {
    // FIXME: Also add cases for image layers, Gaussy layers, Emphasis Layers
    if (this.isPageLayer()) {
      return new NFPageLayer(this.layer);
    } else if (this.isHighlightLayer()) {
      return new NFHighlightLayer(this.layer);
    } else if (this.isPaperParentLayer()) {
      return new NFPaperParentLayer(this.layer);
    } else {
      return this;
    }
  },
  getInfo: function() {
    return `NFLayer: '${this.layer.name}'`;
  },
  // Returns true if the layer has a null parent
  hasNullParent: function() {
    if (this.layer.parent != null) {
      return this.layer.parent.nullLayer;
    }
    return false;
  },
  // Checks to see if a given NFLayer's layer is the same as this one's
  // For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  sameLayerAs: function(testLayer) {
    if (testLayer == null) {
      return false;
    }
    return this.layer.index === testLayer.layer.index && this.layer.containingComp.id === testLayer.layer.containingComp.id;
  }
});

// Class Methods
NFLayer = Object.assign(NFLayer, {
  // Returns a new Specialized NFLayer from an AVLayer
  getSpecializedLayerFromAVLayer: function(theLayer) {
    var tmpLayer;
    if (!(theLayer instanceof AVLayer)) {
      throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer";
    }
    tmpLayer = new NFLayer(theLayer);
    return tmpLayer.getSpecializedLayer();
  },
  // Returns true if the given AVLayer is a comp layer
  isCompLayer: function(theLayer) {
    return theLayer instanceof AVLayer && theLayer.source instanceof CompItem;
  }
});

/*
 *    NF LAYER COLLECTION
 *
 *    A collection of NF Layers
 *
 */
var NFLayerCollection;

NFLayerCollection = function(layerArr) {
  var i, len, theLayer;
  this.layers = layerArr != null ? layerArr : [];
  if (layerArr != null) {
    for (i = 0, len = layerArr.length; i < len; i++) {
      theLayer = layerArr[i];
      if (!(theLayer instanceof NFLayer)) {
        throw "You can only add NFLayers to an NFLayerCollection";
      }
    }
  }
  return this;
};

NFLayerCollection.prototype = Object.assign(NFLayerCollection.prototype, {
  getInfo: function() {
    var i, infoString, len, ref, theLayer;
    infoString = "NFLayerCollection: [";
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  },
  addNFLayer: function(newLayer) {
    if (newLayer instanceof NFLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "You can only add NFLayers to an NFLayerCollection";
    }
  },
  // Returns true if the collection only contains NFPageLayers and no other types of NFLayers
  onlyContainsPageLayers: function() {
    var i, len, ref, theLayer;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      if (!(theLayer instanceof NFPageLayer)) {
        return false;
      }
    }
    return true;
  },
  // Returns true if the layers in the collection are all in the same comp
  inSameComp: function() {
    var i, layer, len, ref, testID;
    if (this.isEmpty()) {
      return true;
    }
    testID = this.layers[0].containingComp().id;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.containingComp().id !== testID) {
        return false;
      }
    }
    return true;
  },
  // Returns the containing comp for the layers, or null if inSameComp() is false
  containingComp: function() {
    if (this.inSameComp() && !this.isEmpty()) {
      return this.layers[0].containingComp();
    }
    return false;
  },
  getPageLayerCollection: function() {
    return new NFPageLayerCollection(this.layers);
  },
  // Shortcut to access the number of layers in the collection
  count: function() {
    return this.layers.length;
  },
  // Returns true if the collection is empty
  isEmpty: function() {
    return this.count() === 0;
  },
  // Creates a new null parent to all the layers, positioned above the one with the lowest index. Will override previous parenting
  nullify: function() {
    var newNull;
    if (!this.inSameComp()) {
      throw "Cannot nullify layers in different compositions at the same time";
    }
    if (this.isEmpty()) {
      throw "Cannot nullify without a given layer";
    }
    return newNull = this.containingComp.addNull();
  }
});

// FIXME: PICKUP: here and add addNull() to NFComp

// newNull = _.mainComp.layers.addNull()
// newNull.name = nullName
// newNull.moveBefore topmostLayer(selectedLayers)
// thisLayer = undefined
// #$.write("new null: "+ newNull.name + "\n");
// i = 1
// while i <= selectedLayers.length
// 	thisLayer = selectedLayers[i - 1]
// 	thisLayer.parent = newNull
// 	i++
// newNull

// Class Methods
NFLayerCollection = Object.assign(NFLayerCollection, {
  // Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
    // FIXME: Should throw error if each layer isnt an AVLayer
    newArray = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = arr.length; i < len; i++) {
        layer = arr[i];
        newLayer = new NFLayer(layer);
        results.push(newLayer.getSpecializedLayer());
      }
      return results;
    })();
    return new NFLayerCollection(newArray);
  }
});

/*
 *    NF PDF
 *
 *    A collection of Page Items
 *
 */
var NFPDF;

NFPDF = function(pageArr) {
  return this.pages = pageArr;
};

// Instance Methods
NFPDF.prototype = Object.assign(NFPDF.prototype, {
  getInfo: function() {
    // FIXME: Write this function
    return "NFPDF: 'FIXME'";
  },
  addNFPageItem: function(newPage) {
    if (newPage instanceof NFPageItem) {
      return this.layers.push(newPage);
    } else {
      throw "You can only add NFPageItems to an NFPDF";
    }
  }
});

/*
 *    NF PAGE ITEM
 *
 *    The composition page item
 *
 */
var NFPageItem;

NFPageItem = function(item) {
  // FIXME: Check to make sure we've been given a valid item and throw error if not
  this.item = item;
  this.name = this.item.name;
  return this;
};

// Instance Methods
NFPageItem.prototype = Object.assign(NFPageItem.prototype, {
  getInfo: function() {
    return `NFPageItem: '${this.name}'`;
  },
  // Returns the PDF number as a String
  getPDFNumber: function() {
    var endIdx;
    // Assuming every page number is two digits long
    endIdx = this.name.indexOf("_");
    if (endIdx > 0) {
      return this.name.substr(0, endIdx);
    }
    throw "Could not get the PDF Number from this NFPageItem";
  },
  // Returns the page number as a String
  getPageNumber: function() {
    var searchIndex;
    // Assuming every page number is two digits long
    searchIndex = this.name.indexOf("pg");
    if (searchIndex > 0) {
      return this.name.substr(searchIndex + 2, 2);
    }
    throw "Could not get the Page Number from this NFPageItem";
  },
  // Returns the NFHighlightLayerCollection of layers in this pageItem
  highlights: function() {
    var highlightLayers, i, len, sourceLayers, theLayer;
    // We're working with AVLayers here
    sourceLayers = NF.Util.collectionToArray(this.item.layers);
    highlightLayers = new NFHighlightLayerCollection();
    for (i = 0, len = sourceLayers.length; i < len; i++) {
      theLayer = sourceLayers[i];
      if (NFHighlightLayer.isHighlightLayer(theLayer)) {
        highlightLayers.addAVLayer(theLayer);
      }
    }
    return highlightLayers;
  }
});

/*
 *    NF PAGE LAYER
 *
 *    (Subclass of NFLayer)
 *
 */
var NFPageLayer;

NFPageLayer = function(layer) {
  NFLayer.call(this, layer);
  if (layer.source == null) {
    throw "Cannot create an NFPageLayer from a layer without a source";
  }
  this.pageItem = new NFPageItem(layer.source);
  return this;
};

// Initialize the prototype as a new instance of the superclass, then add instance methods
// Instance Methods
NFPageLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return `NFPageLayer: '${this.layer.name}'`;
  },
  // Returns the paper parent layer. If the parent exists but is not attached, this will not return it.
  getPaperParentLayer: function() {
    if (this.layer.parent != null) {
      return new NFPaperParentLayer(this.layer.parent);
    } else {
      return null;
    }
  },
  effects: function() {
    return this.layer.Effects;
  },
  getEffectWithName: function(effectName) {
    return this.layer.Effects.property(effectName);
  },
  // Returns NFHighlightLayerCollection of all highlights in this page
  highlights: function() {
    return this.pageItem.highlights();
  },
  // Returns NFHighlightLayerCollection of all highlights bubbled onto this page layer
  bubbledHighlights: function() {
    var bubbledHighlights, highlight;
    if ((function() {
      var i, len, ref, results;
      ref = this.highlights().layers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        highlight = ref[i];
        results.push(highlight.bubbled && highlight.connectedPageLayer.sameLayerAs(this));
      }
      return results;
    }).call(this)) {
      bubbledHighlights = highlight;
    }
    return new NFHighlightLayerCollection(bubbledHighlights);
  },
  // Returns whether or not the page has been initted with the below methods
  isInitted: function() {
    return this.layer.name.indexOf("[+]");
  },
  // Changes the page name to mark the page layer as initted, and updates bubbled highlights
  markInitted: function() {
    var highlight, i, len, ref, results;
    if (!this.isInitted()) {
      this.layer.name.replace(" NFPage", " [+]");
      if (this.bubbledHighlights.count() > 0) {
        ref = this.bubbledHighlights.layers;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          highlight = ref[i];
          results.push(highlight.fixExpressionAfterInit());
        }
        return results;
      }
    }
  },
  // Adds the non-transform init properties (dropshadow, motion blur, etc)
  init: function() {
    this.layer.motionBlur = true;
    this.setDropShadow();
    return this.markInitted();
  },
  // Sets the drop shadow for the layer
  setDropShadow: function() {
    var ref, shadowProp;
    shadowProp = (ref = this.effects().property('ADBE Drop Shadow')) != null ? ref : this.effects().addProperty('ADBE Drop Shadow');
    shadowProp.property('Opacity').setValue(191.25);
    shadowProp.property('Direction').setValue(0);
    shadowProp.property('Distance').setValue(20);
    return shadowProp.property('Softness').setValue(300);
  },
  // Adds the transform init properties (size, position)
  initTransforms: function() {
    this.setInitSize();
    return this.setInitPosition();
  },
  // Sets the size of the layer to the Init size. Returns false and doesn't set size if there are existing keyframes
  setInitSize: function() {
    if (this.layer.property('Transform').property('Scale').numKeys > 0) {
      return false;
    }
    this.layer.property('Transform').property('Scale').setValue([50, 50, 50]);
    return true;
  },
  // Sets the position of the layer to the Init position. Returns false and doesn't set position if there are existing keyframes
  setInitPosition: function() {
    var layerHeight, newPosition, oldPosition;
    if (this.layer.property('Transform').property('Position').numKeys > 0) {
      return false;
    } else {
      layerHeight = this.layer.height;
      oldPosition = this.layer.property('Transform').property('Position').value;
      newPosition = oldPosition;
      newPosition[1] = layerHeight / 4;
      this.layer.property('Transform').property('Position').setValue(newPosition);
    }
    return true;
  },
  // Returns the PDF number as a String
  getPDFNumber: function() {
    return this.pageItem.getPDFNumber();
  },
  // Returns the page number as a String
  getPageNumber: function() {
    return this.pageItem.getPageNumber();
  },
  // Returns the containing NFPartComp
  containingComp: function() {
    return new NFComp(this.layer.containingComp);
  }
});

// Class Methods
NFPageLayer = Object.assign(NFPageLayer, {
  // Returns true if the given AVLayer is a Page Layer
  isPageLayer: function(theLayer) {
    return NFLayer.isCompLayer(theLayer) && theLayer.source.name.indexOf("NFPage") >= 0;
  }
});

/*
 *    NF PAGE LAYER COLLECTION
 *
 *    A collection of NF Page Layers
 *
 */
var NFPageLayerCollection;

NFPageLayerCollection = function(layerArr) {
  var j, len, theLayer;
  NFLayerCollection.call(this, layerArr);
  if (layerArr != null) {
    for (j = 0, len = layerArr.length; j < len; j++) {
      theLayer = layerArr[j];
      if (!(theLayer instanceof NFPageLayer)) {
        throw "You can only add NFPageLayers to an NFPageLayerCollection";
      }
    }
  }
  return this;
};

// Instance Methods
NFPageLayerCollection.prototype = Object.assign(new NFLayerCollection(), {
  addNFLayer: function(newLayer) {
    return this.addNFPageLayer(newLayer);
  },
  addNFPageLayer: function(newLayer) {
    if (newLayer instanceof NFPageLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "addNFPageLayer() can only be used to add NFPageLayers to an NFPageLayerCollection";
    }
  },
  addAVLayer: function(newLayer) {
    if (newLayer instanceof AVLayer) {
      return this.layers.push(new NFPageLayer(newLayer));
    } else {
      throw "addAVLayer() can only be used to add AVLayers to an NFPageLayerCollection";
    }
  },
  // Returns NFHighlightLayerCollection of all highlights in all pages in the collection
  highlights: function() {
    var containingLayerArray, highlight, highlightArray, highlights, i, j, k, l, len, len1, ref, ref1, ref2, theLayer;
    highlightArray = [];
    containingLayerArray = [];
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (theLayer instanceof NFPageLayer) {
        ref1 = theLayer.highlights().layers;
        // Get the layer's NFPageItem
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          highlight = ref1[k];
          highlightArray.push(highlight);
          containingLayerArray.push(theLayer);
        }
      }
    }
    highlights = new NFHighlightLayerCollection(highlightArray);
    if (highlights.isEmpty()) {
      return highlights;
    }
    for (i = l = 0, ref2 = highlights.count() - 1; (0 <= ref2 ? l <= ref2 : l >= ref2); i = 0 <= ref2 ? ++l : --l) {
      highlights.layers[i].containingPageLayer = containingLayerArray[i];
    }
    return highlights;
  },
  // Returns true if the collection only contains pages from the same PDF
  fromSamePDF: function() {
    var j, layer, len, ref, testNumber;
    if (this.count() === 0) {
      return true;
    }
    testNumber = this.layers[0].getPDFNumber();
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
      if (layer.getPDFNumber() !== testNumber) {
        return false;
      }
    }
    return true;
  },
  // Overrides the function in NFLayerCollection
  onlyContainsPageLayers: function() {
    return true;
  },
  initLayers: function() {
    var j, len, page, ref, results;
    ref = this.layers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      page = ref[j];
      results.push(page.init());
    }
    return results;
  },
  initLayerTransforms: function() {
    var j, len, page, ref, results;
    ref = this.layers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      page = ref[j];
      results.push(page.initTransforms());
    }
    return results;
  },
  connectToParents: function() {
    var j, len, pageLayer, paperParentLayer, ref, results;
    ref = this.layers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      pageLayer = ref[j];
      results.push(paperParentLayer = pageLayer.containingComp());
    }
    return results;
  }
});

// get PDF #
// get layer name
// Look for layer
// if it doesn't exist
// make it and put it above the pageLayer
// if it does
// put this pagelayer below it
// Class Methods
NFPageLayerCollection = Object.assign(NFPageLayerCollection, {
  // Returns a new instance from an array of AVLayers
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
    // FIXME: Should throw error if each layer isnt an AVLayer
    newArray = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = arr.length; j < len; j++) {
        layer = arr[j];
        newLayer = new NFLayer(layer);
        results.push(newLayer.getSpecializedLayer());
      }
      return results;
    })();
    return new NFPageLayerCollection(newArray);
  }
});

/*
 *    NF PAPER PARENT LAYER
 *
 *    (inherits from NFLayer)
 */
var NFPaperParentLayer;

NFPaperParentLayer = function(layer) {
  NFLayer.call(this, layer);
  if (!this.layer.nullLayer) {
    throw "Can only create a NFPaperParentLayer from a null layer";
  }
  return this;
};

// Instance Methods
NFPaperParentLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return `NFPaperParentLayer: '${this.layer.name}'`;
  },
  // Returns an array of child NFLayers
  getChildren: function() {
    var allLayers, childLayers, i, testLayer;
    // Look for all layers in the comp this layer is in whose parents are this layer
    allLayers = this.layer.containingComp.layers;
    childLayers = [];
    i = 1;
    while (i <= allLayers.length) {
      testLayer = new NFLayer(allLayers[i]);
      // If this layer is the parent...
      if (testLayer.layer.parent === this.layer) {
        // Convert to page, image or gaussy if it's a specialized layer
        testLayer = testLayer.getSpecializedLayer();
        childLayers.push(testLayer);
      }
      i++;
    }
    return childLayers;
  }
});

// Class Methods
NFPaperParentLayer = Object.assign(NFPaperParentLayer, {
  // Tests an AV layer to see if it can be a paper parent Layer
  isPaperParentLayer: function(layer) {
    return layer.nullLayer && layer.name.indexOf('PDF' >= 0);
  },
  // Returns the name string for the paper parent for a given layer
  getPaperParentNameForPageLayer: function(pageLayer) {
    return 'PDF ' + pageLayer.getPDFNumber();
  },
  // Returns the paperParentLayer for a given page layer
  getPaperParentLayerForPageLayers: function(pageLayer) {
    var paperParent;
    paperParent = pageLayer.getPaperParentLayer();
    if (paperParent == null) {
      paperParent = pageLayer.containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(pageLayer));
    }
    return paperParent;
  },
  // Creates a new paperParentLayer for a given collection of Page Layers
  newPaperParentLayerForPageLayers: function(pageLayers) {
    var name;
    if (!((pageLayers != null) && pageLayers.count() > 0)) {
      throw "Can't create a paper parent layer with no target layers";
    }
    if (!(pageLayers instanceof NFPageLayerCollection)) {
      throw "Can only create a new paper parent layer from a NFPageLayerCollection";
    }
    if (!pageLayers.fromSamePDF()) {
      throw "Can't create a single paper parent layer for page layers from different PDFs";
    }
    // FIXME: Pickup in NFLayerCollection.nullify() - this is for NFPageLayerCollection's method connectToParents()
    return name = NFPaperParentLayer.getPaperParentNameForPageLayer(pageLayer);
  }
});

/*
 *    NF Part Comp
 *
 *    subclass of NFComp
 *    A part composition which can contain pageLayers and other such things
 *
 */
var NFPartComp;

NFPartComp = function(comp) {
  NFComp.call(this, comp);
  if (comp == null) {
    // FIXME: Check to make sure we've been given a valid comp and throw error if not
    throw "Can't create an NFPartComp without a given comp";
  }
  this.comp = comp;
  this.name = this.comp.name;
  return this;
};

// Instance Methods
NFPartComp.prototype = Object.assign(NFPartComp.prototype, {
  getInfo: function() {
    return `NFPartComp: '${this.name}'`;
  }
});
