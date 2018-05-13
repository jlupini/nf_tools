(function() {
  var NF, NFEmphasisLayer, NFGaussyLayer, NFHighlightLayer, NFHighlightLayerCollection, NFImageLayer, NFLayer, NFLayerCollection, NFPDF, NFPageItem, NFPageLayer, NFPaperParentLayer, ref;

  NF = (ref = app.NF) != null ? ref : {};


  /*
   *     Important Notes:
   *
   *     Outside of this file, Classes can be accessed via the namespace NF.Models.MYClass
   *     Inside this file, do NOT use that namespacing. Reference classes directly.
   *
   *     Because Javascript ES5 doesn't even pretend to try and support OOP, this is a little
   *     hacky. Basically, each 'Class' is an object with a constructor function, which
   *     has 'Class methods' that are function properties of that variable, and 'Instance methods' which
   *     are function properties on the object's prototype (and can access properties of the instance)
   *
   *     Just a reminder to self: There are NO pointers. Everything is a copy. Be careful which
   *     version of an object you're screwing around with if there's more than one for some reason...
   *
   *     Each class declaration should have three parts:
   *       1) Constructor which returns itself and sets up any properties
   *       2) Prototype setup. This is where instance methods are declared. Set the prototype
   *          for the new class to a new object that combines an object containing instance methods
   *          with either the new class's prototype or a new instance of its superclass.
   *          The superclass instance becomes the new class's prototype.
   *       3) Class methods, added to the new class
   *
   *     If you add new classes, you MUST add them to the NF.Models namespace at the bottom of this file.
   *     Otherwise they will be invisible and pointless.
   *
   */


  /*
   *    DECLARE CLASSES
   */


  /*
   *    NF LAYER
   *
   */

  NFLayer = function(layer) {
    this.layer = layer;
    return this;
  };

  NFLayer.prototype = Object.assign(NFLayer.prototype, {
    isPageLayer: function() {
      return NFPageLayer.isPageLayer(this.layer);
    },
    isHighlightLayer: function() {
      return NFHighlightLayer.isHighlightLayer(this.layer);
    },
    getSpecializedLayer: function() {
      if (this.isPageLayer()) {
        return new NFPageLayer(this.layer);
      } else if (this.isHighlightLayer()) {
        return new NFHighlightLayer(this.layer);
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
    isCompLayer: function(theLayer) {
      return theLayer instanceof AVLayer && theLayer.source instanceof CompItem;
    }
  });


  /*
   *    NF PAGE LAYER
   *
   *    (Subclass of NFLayer)
   *
   */

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
    effects: function() {
      return this.layer.Effects;
    },
    getEffectWithName: function(effectName) {
      return this.layer.Effects.property(effectName);
    },
    highlights: function() {
      return this.pageItem.highlights();
    }
  });

  NFPageLayer = Object.assign(NFPageLayer, {
    isPageLayer: function(theLayer) {
      return NFLayer.isCompLayer(theLayer) && theLayer.source.name.indexOf("NFPage") >= 0;
    }
  });


  /*
   *    NF IMAGE LAYER
   *
   *    (Subclass of NFLayer)
   *
   */

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
   *    NF GAUSSY LAYER
   *
   *    (Subclass of NFLayer)
   *
   */

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
   *    NF EMPHASIS LAYER
   *
   *    (Subclass of NFLayer)
   *
   */

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
   *    NF HIGHLIGHT LAYER
   *
   *    (inherits from NFLayer)
   *
   */

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
      var highlighterProperties, highlighterProperty, j, len, results, sourceEffect, sourceExpression, sourceValue, targetComp, targetHighlighterEffect, targetPageLayerEffects;
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
      highlighterProperties = ['Spacing', 'Thickness', 'Start Offset', 'Completion', 'Offset', 'Opacity', 'Highlight Colour', 'End Offset'];
      results = [];
      for (j = 0, len = highlighterProperties.length; j < len; j++) {
        highlighterProperty = highlighterProperties[j];
        sourceValue = sourceEffect.property(highlighterProperty).value;
        targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue);
        sourceExpression = "var offsetTime = comp(\"" + targetComp.name + "\").layer(\"" + this.containingPageLayer.layer.name + "\").startTime; comp(\"" + targetComp.name + "\").layer(\"" + this.containingPageLayer.layer.name + "\").effect(\"" + this.name + "\")(\"" + highlighterProperty + "\").valueAtTime(time+offsetTime)";
        sourceEffect.property(highlighterProperty).expression = sourceExpression;
        results.push(this.updateProperties());
      }
      return results;
    },
    disconnect: function() {
      var effect, i, j, property, propertyCount, ref1, ref2;
      if ((ref1 = this.connectedPageLayerHighlighterEffect()) != null) {
        ref1.remove();
      }
      effect = this.highlighterEffect();
      propertyCount = effect != null ? effect.numProperties : void 0;
      for (i = j = 1, ref2 = propertyCount; 1 <= ref2 ? j <= ref2 : j >= ref2; i = 1 <= ref2 ? ++j : --j) {
        property = effect.property(i);
        property.expression = "";
      }
      return this.updateProperties();
    }
  });

  NFHighlightLayer = Object.assign(NFHighlightLayer, {
    isHighlightLayer: function(theLayer) {
      var ref1;
      return theLayer instanceof ShapeLayer && ((ref1 = theLayer.Effects.property(1)) != null ? ref1.matchName : void 0) === "AV_Highlighter";
    }
  });


  /*
   *    NF PAPER PARENT LAYER
   *
   *    (inherits from NFLayer)
   */

  NFPaperParentLayer = function(layer) {
    NFLayer.call(this, layer);
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


  /*
   *    NF LAYER COLLECTION
   *
   *    A collection of NF Layers
   *
   */

  NFLayerCollection = function(layerArr) {
    var j, len, theLayer;
    this.layers = layerArr != null ? layerArr : [];
    if (layerArr != null) {
      for (j = 0, len = layerArr.length; j < len; j++) {
        theLayer = layerArr[j];
        if (!(theLayer instanceof NFLayer)) {
          throw "You can only add NFLayers to an NFLayerCollection";
        }
      }
    }
    return this;
  };

  NFLayerCollection.prototype = Object.assign(NFLayerCollection.prototype, {
    getInfo: function() {
      var infoString, j, len, ref1, theLayer;
      infoString = "NFLayerCollection: [";
      ref1 = this.layers;
      for (j = 0, len = ref1.length; j < len; j++) {
        theLayer = ref1[j];
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
    highlights: function() {
      var containingLayerArray, highlight, highlightArray, highlights, i, j, k, l, len, len1, ref1, ref2, ref3, theLayer;
      highlightArray = [];
      containingLayerArray = [];
      ref1 = this.layers;
      for (j = 0, len = ref1.length; j < len; j++) {
        theLayer = ref1[j];
        if (theLayer instanceof NFPageLayer) {
          ref2 = theLayer.highlights().layers;
          for (k = 0, len1 = ref2.length; k < len1; k++) {
            highlight = ref2[k];
            highlightArray.push(highlight);
            containingLayerArray.push(theLayer);
          }
        }
      }
      highlights = new NFHighlightLayerCollection(highlightArray);
      if (highlights.isEmpty()) {
        return highlights;
      }
      for (i = l = 0, ref3 = highlights.count() - 1; 0 <= ref3 ? l <= ref3 : l >= ref3; i = 0 <= ref3 ? ++l : --l) {
        highlights.layers[i].containingPageLayer = containingLayerArray[i];
      }
      return highlights;
    },
    onlyContainsPageLayers: function() {
      var j, len, ref1, theLayer;
      ref1 = this.layers;
      for (j = 0, len = ref1.length; j < len; j++) {
        theLayer = ref1[j];
        if (!(theLayer instanceof NFPageLayer)) {
          return false;
        }
      }
      return true;
    },
    count: function() {
      return this.layers.length;
    },
    isEmpty: function() {
      return this.count() === 0;
    }
  });

  NFLayerCollection = Object.assign(NFLayerCollection, {
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
      return new NFLayerCollection(newArray);
    }
  });


  /*
   *    NF HIGHLIGHT LAYER COLLECTION
   *
   *    A collection of NF Highlight Layers
   *
   */

  NFHighlightLayerCollection = function(layerArr) {
    var j, len, theLayer;
    NFLayerCollection.call(this, layerArr);
    if (layerArr != null) {
      for (j = 0, len = layerArr.length; j < len; j++) {
        theLayer = layerArr[j];
        if (!(theLayer instanceof NFHighlightLayer)) {
          throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection";
        }
      }
    }
    return this;
  };

  NFHighlightLayerCollection.prototype = Object.assign(new NFLayerCollection(), {
    getInfo: function() {
      var infoString, j, len, ref1, theLayer;
      infoString = "NFHighlightLayerCollection: [";
      ref1 = this.layers;
      for (j = 0, len = ref1.length; j < len; j++) {
        theLayer = ref1[j];
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
      if (true) {
        return this.layers.push(new NFHighlightLayer(newLayer));
      } else {
        throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection";
      }
    },
    onlyContainsPageLayers: function() {
      return false;
    },
    highlights: function() {
      return this;
    },
    duplicateNames: function() {
      var j, len, nameArr, ref1, theLayer;
      nameArr = [];
      ref1 = this.layers;
      for (j = 0, len = ref1.length; j < len; j++) {
        theLayer = ref1[j];
        nameArr.push(theLayer.name);
      }
      return NF.Util.hasDuplicates(nameArr);
    },
    disconnectHighlights: function() {
      var highlight, j, len, ref1, results;
      ref1 = this.layers;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        highlight = ref1[j];
        results.push(highlight.disconnect());
      }
      return results;
    },
    bubbleUpHighlights: function() {
      var highlight, j, len, ref1, results;
      ref1 = this.layers;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        highlight = ref1[j];
        results.push(highlight.bubbleUp());
      }
      return results;
    }
  });

  NFHighlightLayerCollection = Object.assign(NFHighlightLayerCollection, {
    collectionFromAVLayerArray: function(arr) {
      var layer, newArray, newLayer;
      newArray = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = arr.length; j < len; j++) {
          layer = arr[j];
          results.push(newLayer = new NFHighlightLayer(layer));
        }
        return results;
      })();
      return new NFHighlightLayerCollection(newArray);
    }
  });


  /*
   *    NF PAGE ITEM
   *
   *    The composition page item
   *
   */

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
      var highlightLayers, j, len, sourceLayers, theLayer;
      sourceLayers = NF.Util.collectionToArray(this.item.layers);
      highlightLayers = new NFHighlightLayerCollection();
      for (j = 0, len = sourceLayers.length; j < len; j++) {
        theLayer = sourceLayers[j];
        if (NFHighlightLayer.isHighlightLayer(theLayer)) {
          highlightLayers.addAVLayer(theLayer);
        }
      }
      return highlightLayers;
    }
  });


  /*
   *    NF PDF
   *
   *    A collection of Page Items
   *
   */

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

  NF.Models = {
    NFLayer: NFLayer,
    NFPageLayer: NFPageLayer,
    NFImageLayer: NFImageLayer,
    NFGaussyLayer: NFGaussyLayer,
    NFEmphasisLayer: NFEmphasisLayer,
    NFHighlightLayer: NFHighlightLayer,
    NFPaperParentLayer: NFPaperParentLayer,
    NFLayerCollection: NFLayerCollection,
    NFHighlightLayerCollection: NFHighlightLayerCollection,
    NFPageItem: NFPageItem,
    NFPDF: NFPDF
  };

  app.NF = Object.assign(app.NF, NF);

}).call(this);
