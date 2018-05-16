
/*
 *    NF Comp
 *
 *    A composition
 *
 */
var NFComp;

NFComp = (function() {
  function NFComp(comp) {
    var ref, ref1;
    this.comp = comp;
    this.name = (ref = this.comp) != null ? ref.name : void 0;
    this.id = (ref1 = this.comp) != null ? ref1.id : void 0;
    this;
  }

  NFComp.prototype.getInfo = function() {
    return "NFComp: '" + this.name + "'";
  };

  NFComp.prototype.selectedLayers = function() {
    return NFLayerCollection.collectionFromAVLayerArray(this.comp.selectedLayers);
  };

  NFComp.prototype.selectedPageLayers = function() {
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
  };

  NFComp.prototype.layerWithName = function(name) {
    var foundLayer, ref, theLayer;
    theLayer = (ref = this.comp.layers) != null ? ref.byName(name) : void 0;
    if (theLayer != null) {
      foundLayer = new NFLayer(theLayer);
      foundLayer = foundLayer.getSpecializedLayer();
    }
    return null;
  };

  return NFComp;

})();


/*
 *    NF LAYER
 *
 */
var NFLayer;

NFLayer = (function() {
  function NFLayer(layer) {
    this.layer = layer;
    this;
  }

  NFLayer.prototype.isPageLayer = function() {
    return NFPageLayer.isPageLayer(this.layer);
  };

  NFLayer.prototype.isNullLayer = function() {
    return this.layer.nullLayer;
  };

  NFLayer.prototype.isHighlightLayer = function() {
    return NFHighlightLayer.isHighlightLayer(this.layer);
  };

  NFLayer.prototype.isPaperParentLayer = function() {
    return NFPaperParentLayer.isPaperParentLayer(this.layer);
  };

  NFLayer.prototype.getSpecializedLayer = function() {
    if (this.isPageLayer()) {
      return new NFPageLayer(this.layer);
    } else if (this.isHighlightLayer()) {
      return new NFHighlightLayer(this.layer);
    } else if (this.isPaperParentLayer()) {
      return new NFPaperParentLayer(this.layer);
    } else {
      return this;
    }
  };

  NFLayer.prototype.getInfo = function() {
    return "NFLayer: '" + this.layer.name + "'";
  };

  NFLayer.prototype.hasNullParent = function() {
    if (this.layer.parent != null) {
      return this.layer.parent.nullLayer;
    }
    return false;
  };

  NFLayer.prototype.sameLayerAs = function(testLayer) {
    if (testLayer == null) {
      return false;
    }
    return this.layer.index === testLayer.layer.index && this.layer.containingComp.id === testLayer.layer.containingComp.id;
  };

  return NFLayer;

})();

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
var NFLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFLayerCollection = (function(superClass) {
  extend(NFLayerCollection, superClass);

  function NFLayerCollection(layerArr) {
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
    this;
  }

  NFLayerCollection.prototype.getInfo = function() {
    var i, infoString, len, ref, theLayer;
    infoString = "NFLayerCollection: [";
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  };

  NFLayerCollection.prototype.addNFLayer = function(newLayer) {
    if (newLayer instanceof NFLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "You can only add NFLayers to an NFLayerCollection";
    }
  };

  NFLayerCollection.prototype.onlyContainsPageLayers = function() {
    var i, len, ref, theLayer;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      if (!(theLayer instanceof NFPageLayer)) {
        return false;
      }
    }
    return true;
  };

  NFLayerCollection.prototype.inSameComp = function() {
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
  };

  NFLayerCollection.prototype.containingComp = function() {
    if (this.inSameComp() && !this.isEmpty()) {
      return this.layers[0].containingComp();
    }
    return false;
  };

  NFLayerCollection.prototype.getPageLayerCollection = function() {
    return new NFPageLayerCollection(this.layers);
  };

  NFLayerCollection.prototype.count = function() {
    return this.layers.length;
  };

  NFLayerCollection.prototype.isEmpty = function() {
    return this.count() === 0;
  };

  NFLayerCollection.prototype.nullify = function() {
    var newNull;
    if (!this.inSameComp()) {
      throw "Cannot nullify layers in different compositions at the same time";
    }
    if (this.isEmpty()) {
      throw "Cannot nullify without a given layer";
    }
    return newNull = this.containingComp.addNull();
  };

  return NFLayerCollection;

})(Array);

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

NFPDF = (function() {
  function NFPDF(pageArr) {
    this.pages = pageArr;
  }

  return NFPDF;

})();

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

NFPageItem = (function() {
  function NFPageItem(item) {
    this.item = item;
    this.name = this.item.name;
    this;
  }

  return NFPageItem;

})();

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
var NFEmphasisLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFEmphasisLayer = (function(superClass) {
  extend(NFEmphasisLayer, superClass);

  function NFEmphasisLayer(layer) {
    NFLayer.call(this, layer);
    this;
  }

  NFEmphasisLayer.prototype.getInfo = function() {
    return "NFEmphasisLayer: '" + this.layer.name + "'";
  };

  return NFEmphasisLayer;

})(NFLayer);


/*
 *    NF GAUSSY LAYER
 *
 *    (Subclass of NFLayer)
 *
 */
var NFGaussyLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFGaussyLayer = (function(superClass) {
  extend(NFGaussyLayer, superClass);

  function NFGaussyLayer(layer) {
    NFLayer.call(this, layer);
    this;
  }

  NFGaussyLayer.prototype.getInfo = function() {
    return "NFGaussyLayer: '" + this.layer.name + "'";
  };

  return NFGaussyLayer;

})(NFLayer);


/*
 *    NF HIGHLIGHT LAYER
 *
 *    (inherits from NFLayer)
 *
 */
var NFHighlightLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFHighlightLayer = (function(superClass) {
  extend(NFHighlightLayer, superClass);

  function NFHighlightLayer(layer) {
    NFLayer.call(this, layer);
    if (!NFHighlightLayer.isHighlightLayer(this.layer)) {
      throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect";
    }
    this.updateProperties();
    this;
  }

  NFHighlightLayer.prototype.updateProperties = function() {
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
  };

  NFHighlightLayer.prototype.getInfo = function() {
    return "NFHighlightLayer: '" + this.name + "'";
  };

  NFHighlightLayer.prototype.getPageItem = function() {
    return new NFPageItem(this.layer.containingComp);
  };

  NFHighlightLayer.prototype.highlighterEffect = function() {
    return this.layer.Effects.property("AV_Highlighter");
  };

  NFHighlightLayer.prototype.connectedPageLayerHighlighterEffect = function() {
    var effect, effectName, expression;
    if (this.connectedPageLayer != null) {
      expression = this.highlighterEffect().property("Spacing").expression;
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression);
      effect = this.connectedPageLayer.getEffectWithName(effectName);
      return effect;
    }
    return null;
  };

  NFHighlightLayer.prototype.canBubbleUp = function() {
    return !((this.bubbled && !this.broken) || (this.containingPageLayer == null));
  };

  NFHighlightLayer.prototype.bubbleUp = function() {
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
  };

  NFHighlightLayer.prototype.fixExpressionAfterInit = function() {
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
  };

  NFHighlightLayer.prototype.disconnect = function() {
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
  };

  return NFHighlightLayer;

})(NFLayer);

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
var NFHighlightLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFHighlightLayerCollection = (function(superClass) {
  extend(NFHighlightLayerCollection, superClass);

  function NFHighlightLayerCollection(layerArr) {
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
    this;
  }

  NFHighlightLayerCollection.prototype.getInfo = function() {
    var i, infoString, len, ref, theLayer;
    infoString = "NFHighlightLayerCollection: [";
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  };

  NFHighlightLayerCollection.prototype.addNFLayer = function(newLayer) {
    return this.addNFHighlightLayer(newLayer);
  };

  NFHighlightLayerCollection.prototype.addNFHighlightLayer = function(newLayer) {
    if (newLayer instanceof NFHighlightLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "addNFHighlightLayer() can only be used to add NFHighlightLayers to an NFHighlightLayerCollection";
    }
  };

  NFHighlightLayerCollection.prototype.addAVLayer = function(newLayer) {
    if (newLayer instanceof ShapeLayer) {
      return this.layers.push(new NFHighlightLayer(newLayer));
    } else {
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection";
    }
  };

  NFHighlightLayerCollection.prototype.onlyContainsPageLayers = function() {
    return false;
  };

  NFHighlightLayerCollection.prototype.duplicateNames = function() {
    var i, len, nameArr, ref, theLayer;
    nameArr = [];
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      nameArr.push(theLayer.name);
    }
    return NF.Util.hasDuplicates(nameArr);
  };

  NFHighlightLayerCollection.prototype.disconnectHighlights = function() {
    var highlight, i, len, ref, results;
    ref = this.layers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      results.push(highlight.disconnect());
    }
    return results;
  };

  NFHighlightLayerCollection.prototype.bubbleUpHighlights = function() {
    var highlight, i, len, ref, results;
    ref = this.layers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      results.push(highlight.bubbleUp());
    }
    return results;
  };

  return NFHighlightLayerCollection;

})(NFLayerCollection);

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
var NFImageLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFImageLayer = (function(superClass) {
  extend(NFImageLayer, superClass);

  function NFImageLayer(layer) {
    NFLayer.call(this, layer);
    this;
  }

  NFImageLayer.prototype.getInfo = function() {
    return "NFImageLayer: '" + this.layer.name + "'";
  };

  return NFImageLayer;

})(NFLayer);


/*
 *    NF PAGE LAYER
 *
 *    (Subclass of NFLayer)
 *
 */
var NFPageLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPageLayer = (function(superClass) {
  extend(NFPageLayer, superClass);

  function NFPageLayer(layer) {
    NFLayer.call(this, layer);
    if (layer.source == null) {
      throw "Cannot create an NFPageLayer from a layer without a source";
    }
    this.pageItem = new NFPageItem(layer.source);
    this;
  }

  NFPageLayer.prototype.getInfo = function() {
    return "NFPageLayer: '" + this.layer.name + "'";
  };

  NFPageLayer.prototype.getPaperParentLayer = function() {
    if (this.layer.parent != null) {
      return new NFPaperParentLayer(this.layer.parent);
    } else {
      return null;
    }
  };

  NFPageLayer.prototype.effects = function() {
    return this.layer.Effects;
  };

  NFPageLayer.prototype.getEffectWithName = function(effectName) {
    return this.layer.Effects.property(effectName);
  };

  NFPageLayer.prototype.highlights = function() {
    return this.pageItem.highlights();
  };

  NFPageLayer.prototype.bubbledHighlights = function() {
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
  };

  NFPageLayer.prototype.isInitted = function() {
    return this.layer.name.indexOf("[+]");
  };

  NFPageLayer.prototype.markInitted = function() {
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
  };

  NFPageLayer.prototype.init = function() {
    this.layer.motionBlur = true;
    this.setDropShadow();
    return this.markInitted();
  };

  NFPageLayer.prototype.setDropShadow = function() {
    var ref, shadowProp;
    shadowProp = (ref = this.effects().property('ADBE Drop Shadow')) != null ? ref : this.effects().addProperty('ADBE Drop Shadow');
    shadowProp.property('Opacity').setValue(191.25);
    shadowProp.property('Direction').setValue(0);
    shadowProp.property('Distance').setValue(20);
    return shadowProp.property('Softness').setValue(300);
  };

  NFPageLayer.prototype.initTransforms = function() {
    this.setInitSize();
    return this.setInitPosition();
  };

  NFPageLayer.prototype.setInitSize = function() {
    if (this.layer.property('Transform').property('Scale').numKeys > 0) {
      return false;
    }
    this.layer.property('Transform').property('Scale').setValue([50, 50, 50]);
    return true;
  };

  NFPageLayer.prototype.setInitPosition = function() {
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
  };

  NFPageLayer.prototype.getPDFNumber = function() {
    return this.pageItem.getPDFNumber();
  };

  NFPageLayer.prototype.getPageNumber = function() {
    return this.pageItem.getPageNumber();
  };

  NFPageLayer.prototype.containingComp = function() {
    return new NFComp(this.layer.containingComp);
  };

  return NFPageLayer;

})(NFLayer);

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
var NFPageLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPageLayerCollection = (function(superClass) {
  extend(NFPageLayerCollection, superClass);

  function NFPageLayerCollection(layerArr) {
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
    this;
  }

  NFPageLayerCollection.prototype.getInfo = function() {
    var infoString, j, len, ref, theLayer;
    infoString = "NFPageLayerCollection: [";
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  };

  NFPageLayerCollection.prototype.addNFLayer = function(newLayer) {
    return this.addNFPageLayer(newLayer);
  };

  NFPageLayerCollection.prototype.addNFPageLayer = function(newLayer) {
    if (newLayer instanceof NFPageLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "addNFPageLayer() can only be used to add NFPageLayers to an NFPageLayerCollection";
    }
  };

  NFPageLayerCollection.prototype.addAVLayer = function(newLayer) {
    if (newLayer instanceof AVLayer) {
      return this.layers.push(new NFPageLayer(newLayer));
    } else {
      throw "addAVLayer() can only be used to add AVLayers to an NFPageLayerCollection";
    }
  };

  NFPageLayerCollection.prototype.highlights = function() {
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
  };

  NFPageLayerCollection.prototype.fromSamePDF = function() {
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
  };

  NFPageLayerCollection.prototype.onlyContainsPageLayers = function() {
    return true;
  };

  NFPageLayerCollection.prototype.initLayers = function() {
    var j, len, page, ref, results;
    ref = this.layers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      page = ref[j];
      results.push(page.init());
    }
    return results;
  };

  NFPageLayerCollection.prototype.initLayerTransforms = function() {
    var j, len, page, ref, results;
    ref = this.layers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      page = ref[j];
      results.push(page.initTransforms());
    }
    return results;
  };

  NFPageLayerCollection.prototype.connectToParents = function() {
    var j, len, pageLayer, paperParentLayer, ref, results;
    ref = this.layers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      pageLayer = ref[j];
      results.push(paperParentLayer = pageLayer.containingComp());
    }
    return results;
  };

  return NFPageLayerCollection;

})(NFLayerCollection);

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
var NFPaperParentLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPaperParentLayer = (function(superClass) {
  extend(NFPaperParentLayer, superClass);

  function NFPaperParentLayer(layer) {
    NFLayer.call(this, layer);
    if (!this.layer.nullLayer) {
      throw "Can only create a NFPaperParentLayer from a null layer";
    }
    this;
  }

  NFPaperParentLayer.prototype.getInfo = function() {
    return "NFPaperParentLayer: '" + this.layer.name + "'";
  };

  NFPaperParentLayer.prototype.getChildren = function() {
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
  };

  return NFPaperParentLayer;

})(NFLayer);

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
var NFPartComp,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPartComp = (function(superClass) {
  extend(NFPartComp, superClass);

  function NFPartComp(comp) {
    NFComp.call(this, comp);
    if (comp == null) {
      throw "Can't create an NFPartComp without a given comp";
    }
    this.comp = comp;
    this.name = this.comp.name;
    this;
  }

  NFPartComp.prototype.getInfo = function() {
    return "NFPartComp: '" + this.name + "'";
  };

  return NFPartComp;

})(NFComp);
