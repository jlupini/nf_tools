(function() {
  var NF, NFComp, NFEmphasisLayer, NFGaussyLayer, NFHighlightLayer, NFHighlightLayerCollection, NFImageLayer, NFLayer, NFLayerCollection, NFPDF, NFPageItem, NFPageLayer, NFPageLayerCollection, NFPaperParentLayer, NFPartComp, ref;

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
        var j, len, ref1, results;
        ref1 = this.highlights().layers;
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          highlight = ref1[j];
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
      var highlight, j, len, ref1, results;
      if (!this.isInitted()) {
        this.layer.name.replace(" NFPage", " [+]");
        if (this.bubbledHighlights.count() > 0) {
          ref1 = this.bubbledHighlights.layers;
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            highlight = ref1[j];
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
      var ref1, shadowProp;
      shadowProp = (ref1 = this.effects().property('ADBE Drop Shadow')) != null ? ref1 : this.effects().addProperty('ADBE Drop Shadow');
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
      }
      oldPosition = this.layer.property('Transform').property('Position').value;
      newPosition = oldPosition;
      newPosition[1] = layerHeight / 4;
      this.layer.property('Transform').property('Position').setValue(newPosition);
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
      var highlighterProperty, j, len, ref1, results, sourceEffect, sourceExpression, sourceValue, targetComp, targetHighlighterEffect, targetPageLayerEffects;
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
      ref1 = NF.Util.highlighterProperties;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        highlighterProperty = ref1[j];
        sourceValue = sourceEffect.property(highlighterProperty).value;
        targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue);
        sourceExpression = "var offsetTime = comp(\"" + targetComp.name + "\").layer(\"" + this.containingPageLayer.layer.name + "\").startTime; comp(\"" + targetComp.name + "\").layer(\"" + this.containingPageLayer.layer.name + "\").effect(\"" + this.name + "\")(\"" + highlighterProperty + "\").valueAtTime(time+offsetTime)";
        sourceEffect.property(highlighterProperty).expression = sourceExpression;
        results.push(this.updateProperties());
      }
      return results;
    },
    fixExpressionAfterInit: function() {
      var expression, j, len, property, ref1, results;
      if (this.bubbled) {
        ref1 = NF.Util.highlighterProperties;
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          property = ref1[j];
          expression = this.highlighterEffect.property(property).expression;
          results.push(this.highlighterEffect.property(property).expression = expression.replace(" NFPage", " [+]"));
        }
        return results;
      }
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
      if (!(pageLayers instanceof NFPageLayerCollection)) {
        throw "Can only create a new paper parent layer from a NFPageLayerCollection";
      }
      if (!pageLayers.fromSamePDF()) {
        throw "Can't create a single paper parent layer for page layers from different PDFs";
      }
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
    getPageLayerCollection: function() {
      return new NFPageLayerCollection(this.layers);
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
   *    NF PAGE LAYER COLLECTION
   *
   *    A collection of NF Page Layers
   *
   */

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
    fromSamePDF: function() {
      var j, layer, len, ref1, testNumber;
      if (this.count() === 0) {
        return true;
      }
      testNumber = this.layers[0].getPDFNumber();
      ref1 = this.layers;
      for (j = 0, len = ref1.length; j < len; j++) {
        layer = ref1[j];
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
      var j, len, page, ref1, results;
      ref1 = this.layers;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        page = ref1[j];
        results.push(page.init());
      }
      return results;
    },
    initLayerTransforms: function() {
      var j, len, page, ref1, results;
      ref1 = this.layers;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        page = ref1[j];
        results.push(page.initTransforms());
      }
      return results;
    },
    connectToParents: function() {
      var j, len, pageLayer, paperParentLayer, ref1, results;
      ref1 = this.layers;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        pageLayer = ref1[j];
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
      if (newLayer instanceof AVLayer) {
        return this.layers.push(new NFHighlightLayer(newLayer));
      } else {
        throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection";
      }
    },
    onlyContainsPageLayers: function() {
      return false;
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
   *    NF Comp
   *
   *    A composition
   *
   */

  NFComp = function(comp) {
    if (comp == null) {
      throw "Can't create an NFComp without a given comp";
    }
    this.comp = comp;
    this.name = this.comp.name;
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
      var j, layer, len, ref1, selectedPageLayers;
      selectedPageLayers = new NFPageLayerCollection;
      ref1 = this.selectedLayers();
      for (j = 0, len = ref1.length; j < len; j++) {
        layer = ref1[j];
        if (layer(instanceOf(NFPageLayer))) {
          selectedPageLayers.addNFPageLayer(layer);
        }
      }
      return selectedPageLayers;
    },
    layerWithName: function(name) {
      var foundLayer, ref1, theLayer;
      theLayer = (ref1 = this.comp.layers) != null ? ref1.byName(name) : void 0;
      if (theLayer != null) {
        foundLayer = new NFLayer(theLayer);
        foundLayer = foundLayer.getSpecializedLayer();
      }
      return null;
    }
  });


  /*
   *    NF Part Comp
   *
   *    subclass of NFComp
   *    A part composition which can contain pageLayers and other such things
   *
   */

  NFPartComp = function(comp) {
    NFComp.call(this, comp);
    if (comp == null) {
      throw "Can't create an NFPartComp without a given comp";
    }
    this.comp = comp;
    this.name = this.comp.name;
    return this;
  };

  NFPartComp.prototype = Object.assign(NFPartComp.prototype, {
    getInfo: function() {
      return "NFPartComp: '" + this.name + "'";
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
    NFPageLayerCollection: NFPageLayerCollection,
    NFHighlightLayerCollection: NFHighlightLayerCollection,
    NFPageItem: NFPageItem,
    NFPDF: NFPDF,
    NFComp: NFComp,
    NFPartComp: NFPartComp
  };

  app.NF = Object.assign(app.NF, NF);

}).call(this);
