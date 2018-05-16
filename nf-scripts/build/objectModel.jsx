
/*
 *    NF Comp
 *
 *    A composition
 *
 */
var NFComp;

NFComp = function(comp) {
  var ref, ref1;
  this.comp = comp;
  this.name = (ref = this.comp) != null ? ref.name : void 0;
  this.id = (ref1 = this.comp) != null ? ref1.id : void 0;
  return this;
};

NFComp.prototype = Object.assign(NFComp.prototype, {
  getInfo: function() {
    return "NFComp: '" + this.name + "'";
  },
  selectedLayers: function() {
    return NFLayerCollection.collectionFromAVLayerArray(this.comp.selectedLayers);
  },
  selectedPageLayers: function() {
    var i, layer, len, ref, selectedPageLayers;
    selectedPageLayers = new NFPageLayerCollection;
    ref = this.selectedLayers().layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer instanceof NFPageLayer) {
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
 *    NF LAYER
 *
 */
var NFLayer;

NFLayer = function(layer) {
  this.layer = layer;
  return this;
};

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
    return "NFLayer: '" + this.layer.name + "'";
  },
  hasNullParent: function() {
    if (this.layer.parent != null) {
      return this.layer.parent.nullLayer;
    }
    return false;
  },
  sameLayerAs: function(testLayer) {
    if (testLayer == null) {
      return false;
    }
    return this.layer.index === testLayer.layer.index && this.layer.containingComp.id === testLayer.layer.containingComp.id;
  }
});

NFLayer = Object.assign(NFLayer, {
  getSpecializedLayerFromAVLayer: function(theLayer) {
    var tmpLayer;
    if (!(theLayer instanceof AVLayer)) {
      throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer";
    }
    tmpLayer = new NFLayer(theLayer);
    return tmpLayer.getSpecializedLayer();
  },
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
  containingComp: function() {
    if (this.inSameComp() && !this.isEmpty()) {
      return this.layers[0].containingComp();
    }
    return false;
  },
  getPageLayerCollection: function() {
    return new NFPageLayerCollection(this.layers);
  },
  count: function() {
    return this.layers.length;
  },
  isEmpty: function() {
    return this.count() === 0;
  },
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

NFLayerCollection = Object.assign(NFLayerCollection, {
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
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

NFPDF.prototype = Object.assign(NFPDF.prototype, {
  getInfo: function() {
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
  this.item = item;
  this.name = this.item.name;
  return this;
};

NFPageItem.prototype = Object.assign(NFPageItem.prototype, {
  getInfo: function() {
    return "NFPageItem: '" + this.name + "'";
  },
  getPDFNumber: function() {
    var endIdx;
    endIdx = this.name.indexOf("_");
    if (endIdx > 0) {
      return this.name.substr(0, endIdx);
    }
    throw "Could not get the PDF Number from this NFPageItem";
  },
  getPageNumber: function() {
    var searchIndex;
    searchIndex = this.name.indexOf("pg");
    if (searchIndex > 0) {
      return this.name.substr(searchIndex + 2, 2);
    }
    throw "Could not get the Page Number from this NFPageItem";
  },
  highlights: function() {
    var highlightLayers, i, len, sourceLayers, theLayer;
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
    return "NFEmphasisLayer: '" + this.layer.name + "'";
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

NFGaussyLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return "NFGaussyLayer: '" + this.layer.name + "'";
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

NFHighlightLayer.prototype = Object.assign(new NFLayer(), {
  updateProperties: function() {
    var comp, compName, expression, layer, layerName;
    this.name = this.layer.name;
    this.bubbled = this.highlighterEffect().property("Spacing").expressionEnabled;
    this.broken = this.highlighterEffect().property("Spacing").expressionError !== "";
    if (this.containingPageLayer == null) {
      this.containingPageLayer = null;
    }
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
    return "NFHighlightLayer: '" + this.name + "'";
  },
  getPageItem: function() {
    return new NFPageItem(this.layer.containingComp);
  },
  highlighterEffect: function() {
    return this.layer.Effects.property("AV_Highlighter");
  },
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
  canBubbleUp: function() {
    return !((this.bubbled && !this.broken) || (this.containingPageLayer == null));
  },
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
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      highlighterProperty = ref[j];
      sourceValue = sourceEffect.property(highlighterProperty).value;
      targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue);
      sourceExpression = "var offsetTime = comp(\"" + targetComp.name + "\").layer(\"" + this.containingPageLayer.layer.name + "\").startTime; comp(\"" + targetComp.name + "\").layer(\"" + this.containingPageLayer.layer.name + "\").effect(\"" + this.name + "\")(\"" + highlighterProperty + "\").valueAtTime(time+offsetTime)";
      sourceEffect.property(highlighterProperty).expression = sourceExpression;
      results.push(this.updateProperties());
    }
    return results;
  },
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
  disconnect: function() {
    var effect, i, j, property, propertyCount, ref, ref1;
    if ((ref = this.connectedPageLayerHighlighterEffect()) != null) {
      ref.remove();
    }
    effect = this.highlighterEffect();
    propertyCount = effect != null ? effect.numProperties : void 0;
    for (i = j = 1, ref1 = propertyCount; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
      property = effect.property(i);
      property.expression = "";
    }
    return this.updateProperties();
  }
});

NFHighlightLayer = Object.assign(NFHighlightLayer, {
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
    if (newLayer instanceof ShapeLayer) {
      return this.layers.push(new NFHighlightLayer(newLayer));
    } else {
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection";
    }
  },
  onlyContainsPageLayers: function() {
    return false;
  },
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

NFHighlightLayerCollection = Object.assign(NFHighlightLayerCollection, {
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
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

NFImageLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return "NFImageLayer: '" + this.layer.name + "'";
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

NFPageLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return "NFPageLayer: '" + this.layer.name + "'";
  },
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
  highlights: function() {
    return this.pageItem.highlights();
  },
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
  isInitted: function() {
    return this.layer.name.indexOf("[+]");
  },
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
  init: function() {
    this.layer.motionBlur = true;
    this.setDropShadow();
    return this.markInitted();
  },
  setDropShadow: function() {
    var ref, shadowProp;
    shadowProp = (ref = this.effects().property('ADBE Drop Shadow')) != null ? ref : this.effects().addProperty('ADBE Drop Shadow');
    shadowProp.property('Opacity').setValue(191.25);
    shadowProp.property('Direction').setValue(0);
    shadowProp.property('Distance').setValue(20);
    return shadowProp.property('Softness').setValue(300);
  },
  initTransforms: function() {
    this.setInitSize();
    return this.setInitPosition();
  },
  setInitSize: function() {
    if (this.layer.property('Transform').property('Scale').numKeys > 0) {
      return false;
    }
    this.layer.property('Transform').property('Scale').setValue([50, 50, 50]);
    return true;
  },
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
  getPDFNumber: function() {
    return this.pageItem.getPDFNumber();
  },
  getPageNumber: function() {
    return this.pageItem.getPageNumber();
  },
  containingComp: function() {
    return new NFComp(this.layer.containingComp);
  }
});

NFPageLayer = Object.assign(NFPageLayer, {
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
  highlights: function() {
    var containingLayerArray, highlight, highlightArray, highlights, i, j, k, l, len, len1, ref, ref1, ref2, theLayer;
    highlightArray = [];
    containingLayerArray = [];
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (theLayer instanceof NFPageLayer) {
        ref1 = theLayer.highlights().layers;
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
    for (i = l = 0, ref2 = highlights.count() - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; i = 0 <= ref2 ? ++l : --l) {
      highlights.layers[i].containingPageLayer = containingLayerArray[i];
    }
    return highlights;
  },
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

NFPageLayerCollection = Object.assign(NFPageLayerCollection, {
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
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

NFPaperParentLayer.prototype = Object.assign(new NFLayer(), {
  getInfo: function() {
    return "NFPaperParentLayer: '" + this.layer.name + "'";
  },
  getChildren: function() {
    var allLayers, childLayers, i, testLayer;
    allLayers = this.layer.containingComp.layers;
    childLayers = [];
    i = 1;
    while (i <= allLayers.length) {
      testLayer = new NFLayer(allLayers[i]);
      if (testLayer.layer.parent === this.layer) {
        testLayer = testLayer.getSpecializedLayer();
        childLayers.push(testLayer);
      }
      i++;
    }
    return childLayers;
  }
});

NFPaperParentLayer = Object.assign(NFPaperParentLayer, {
  isPaperParentLayer: function(layer) {
    return layer.nullLayer && layer.name.indexOf('PDF' >= 0);
  },
  getPaperParentNameForPageLayer: function(pageLayer) {
    return 'PDF ' + pageLayer.getPDFNumber();
  },
  getPaperParentLayerForPageLayers: function(pageLayer) {
    var paperParent;
    paperParent = pageLayer.getPaperParentLayer();
    if (paperParent == null) {
      paperParent = pageLayer.containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(pageLayer));
    }
    return paperParent;
  },
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
    throw "Can't create an NFPartComp without a given comp";
  }
  this.comp = comp;
  this.name = this.comp.name;
  return this;
};

NFPartComp.prototype = Object.assign(new NFComp(), {
  getInfo: function() {
    return "NFPartComp: '" + this.name + "'";
  }
});
