(function() {
  var NF, ref;

  NF = (ref = app.NF) != null ? ref : {};


  /*
   *    DECLARE CLASSES
   */


  /*
   *    NF LAYER
   *
   */

  NF.Models.NFLayer = function(layer) {
    this.layer = layer;
    return this;
  };

  NF.Models.NFLayer.prototype.isPageLayer = function() {
    return NF.Models.NFPageLayer.isPageLayer(this.layer);
  };

  NF.Models.NFLayer.prototype.isHighlightLayer = function() {
    return NF.Models.NFHighlightLayer.isHighlightLayer(this.layer);
  };

  NF.Models.NFLayer.prototype.getSpecializedLayer = function() {
    if (this.isPageLayer()) {
      return new NF.Models.NFPageLayer(this.layer);
    } else if (this.isHighlightLayer()) {
      return new NF.Model.NFHighlightLayer(this.layer);
    } else {
      return this;
    }
  };

  NF.Models.NFLayer.prototype.getInfo = function() {
    return "NFLayer: '" + this.layer.name + "'";
  };

  NF.Models.NFLayer.prototype.hasNullParent = function() {
    if (this.layer.parent != null) {
      return this.layer.parent.nullLayer;
    }
    return false;
  };

  NF.Models.NFLayer.isCompLayer = function(theLayer) {
    return theLayer instanceof AVLayer && theLayer.source instanceof CompItem;
  };


  /*
   *    NF PAGE LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFPageLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    if (layer.source == null) {
      throw "Cannot create an NFPageLayer from a layer without a source";
    }
    this.pageItem = new NF.Models.NFPageItem(layer.source);
    return this;
  };

  NF.Models.NFPageLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFPageLayer.prototype.getInfo = function() {
    return "NFPageLayer: '" + this.layer.name + "'";
  };

  NF.Models.NFPageLayer.prototype.getEffectWithName = function(effectName) {
    return this.layer.Effects.property(effectName);
  };

  NF.Models.NFPageLayer.prototype.highlights = function() {
    return this.pageItem.highlights();
  };

  NF.Models.NFPageLayer.isPageLayer = function(theLayer) {
    return NF.Models.NFLayer.isCompLayer(theLayer) && theLayer.source.name.indexOf("NFPage") >= 0;
  };


  /*
   *    NF IMAGE LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFImageLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFImageLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFImageLayer.prototype.getInfo = function() {
    return "NFImageLayer: '" + this.layer.name + "'";
  };


  /*
   *    NF GAUSSY LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFGaussyLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFGaussyLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFGaussyLayer.prototype.getInfo = function() {
    return "NFGaussyLayer: '" + this.layer.name + "'";
  };


  /*
   *    NF EMPHASIS LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFEmphasisLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFEmphasisLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFEmphasisLayer.prototype.getInfo = function() {
    return "NFEmphasisLayer: '" + this.layer.name + "'";
  };


  /*
   *    NF HIGHLIGHT LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFHighlightLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    if (!NF.Models.NFHighlightLayer.isHighlightLayer(this.layer)) {
      throw "NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect";
    }
    this.name = this.layer.name;
    this.bubbled = this.highlighterEffect().property("Spacing").expressionEnabled;
    this.broken = this.highlighterEffect().property("Spacing").expressionError !== "";
    this.containingPageLayer = null;
    return this;
  };

  NF.Models.NFHighlightLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFHighlightLayer.prototype.getInfo = function() {
    return "NFHighlightLayer: '" + this.name + "'";
  };

  NF.Models.NFHighlightLayer.prototype.highlighterEffect = function() {
    return this.layer.Effects.property("AV_Highlighter");
  };

  NF.Models.NFHighlightLayer.prototype.connectedPageLayer = function() {
    var comp, compName, expression, layer, layerName;
    if (this.bubbled) {
      expression = this.highlighterEffect().property("Spacing").expression;
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression);
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression);
      comp = NF.Util.findItem(compName);
      if (comp != null) {
        layer = comp.layer(layerName);
        if (layer != null) {
          return new NF.Models.NFPageLayer(layer);
        }
      }
    }
    return null;
  };

  NF.Models.NFHighlightLayer.prototype.connectedPageLayerHighlighterEffect = function() {
    var connectedPageLayer, effect, effectName, expression;
    connectedPageLayer = this.connectedPageLayer();
    if (connectedPageLayer != null) {
      expression = this.highlighterEffect().property("Spacing").expression;
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression);
      effect = connectedPageLayer.getEffectWithName(effectName);
      return effect;
    }
    return null;
  };

  NF.Models.NFHighlightLayer.prototype.disconnect = function() {
    var effect, i, j, property, propertyCount, ref1, results;
    effect = this.highlighterEffect();
    propertyCount = effect != null ? effect.numProperties : void 0;
    results = [];
    for (i = j = 1, ref1 = propertyCount; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
      property = effect.property(i);
      results.push(property.expression = "");
    }
    return results;
  };

  NF.Models.NFHighlightLayer.isHighlightLayer = function(theLayer) {
    var ref1;
    return theLayer instanceof ShapeLayer && ((ref1 = theLayer.Effects.property(1)) != null ? ref1.matchName : void 0) === "AV_Highlighter";
  };


  /*
   *    NF PAPER PARENT LAYER
   *
   *    (inherits from NFLayer)
   */

  NF.Models.NFPaperParentLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFPaperParentLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFPaperParentLayer.prototype.getInfo = function() {
    return "NFPaperParentLayer: '" + this.layer.name + "'";
  };

  NF.Models.NFPaperParentLayer.prototype.getChildren = function() {
    var allLayers, childLayers, i, testLayer;
    allLayers = this.layer.containingComp.layers;
    childLayers = [];
    i = 1;
    while (i <= allLayers.length) {
      testLayer = new NF.Models.NFLayer(allLayers[i]);
      if (testLayer.layer.parent === this.layer) {
        testLayer = testLayer.getSpecializedLayer();
        childLayers.push(testLayer);
      }
      i++;
    }
    return childLayers;
  };


  /*
   *    NF LAYER COLLECTION
   *
   *    A collection of NF Layers
   *
   */

  NF.Models.NFLayerCollection = function(layerArr) {
    var j, len, theLayer;
    this.layers = layerArr != null ? layerArr : [];
    if (layerArr != null) {
      for (j = 0, len = layerArr.length; j < len; j++) {
        theLayer = layerArr[j];
        if (!(theLayer instanceof NF.Models.NFLayer)) {
          throw "You can only add NFLayers to an NFLayerCollection";
        }
      }
    }
    return this;
  };

  NF.Models.NFLayerCollection.prototype.getInfo = function() {
    var infoString, j, len, ref1, theLayer;
    infoString = "NFLayerCollection: [";
    ref1 = this.layers;
    for (j = 0, len = ref1.length; j < len; j++) {
      theLayer = ref1[j];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  };

  NF.Models.NFLayerCollection.prototype.addNFLayer = function(newLayer) {
    if (newLayer instanceof NF.Models.NFLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "You can only add NFLayers to an NFLayerCollection";
    }
  };

  NF.Models.NFLayerCollection.prototype.highlights = function() {
    var containingLayerArray, highlight, highlightArray, highlights, i, j, k, l, len, len1, ref1, ref2, ref3, theLayer;
    highlightArray = [];
    containingLayerArray = [];
    ref1 = this.layers;
    for (j = 0, len = ref1.length; j < len; j++) {
      theLayer = ref1[j];
      if (theLayer instanceof NF.Models.NFPageLayer) {
        ref2 = theLayer.highlights().layers;
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          highlight = ref2[k];
          highlightArray.push(highlight);
          containingLayerArray.push(theLayer);
        }
      }
    }
    highlights = new NF.Models.NFHighlightLayerCollection(highlightArray);
    for (i = l = 0, ref3 = highlights.count() - 1; 0 <= ref3 ? l <= ref3 : l >= ref3; i = 0 <= ref3 ? ++l : --l) {
      highlights.layers[i].containingPageLayer = containingLayerArray[i];
    }
    return highlights;
  };

  NF.Models.NFLayerCollection.prototype.onlyContainsPageLayers = function() {
    var j, len, ref1, theLayer;
    ref1 = this.layers;
    for (j = 0, len = ref1.length; j < len; j++) {
      theLayer = ref1[j];
      if (!(theLayer instanceof NF.Models.NFPageLayer)) {
        return false;
      }
    }
    return true;
  };

  NF.Models.NFLayerCollection.prototype.count = function() {
    return this.layers.length;
  };

  NF.Models.NFLayerCollection.collectionFromAVLayerArray = function(arr) {
    var layer, newArray, newLayer;
    newArray = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = arr.length; j < len; j++) {
        layer = arr[j];
        newLayer = new NF.Models.NFLayer(layer);
        results.push(newLayer.getSpecializedLayer());
      }
      return results;
    })();
    return new NF.Models.NFLayerCollection(newArray);
  };


  /*
   *    NF HIGHLIGHT LAYER COLLECTION
   *
   *    A collection of NF Highlight Layers
   *
   */

  NF.Models.NFHighlightLayerCollection = function(layerArr) {
    var j, len, theLayer;
    NF.Models.NFLayerCollection.call(this, layerArr);
    if (layerArr != null) {
      for (j = 0, len = layerArr.length; j < len; j++) {
        theLayer = layerArr[j];
        if (!(theLayer instanceof NF.Models.NFHighlightLayer)) {
          throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection";
        }
      }
    }
    return this;
  };

  NF.Models.NFHighlightLayerCollection.prototype = new NF.Models.NFLayerCollection();

  NF.Models.NFHighlightLayerCollection.prototype.getInfo = function() {
    var infoString, j, len, ref1, theLayer;
    infoString = "NFHighlightLayerCollection: [";
    ref1 = this.layers;
    for (j = 0, len = ref1.length; j < len; j++) {
      theLayer = ref1[j];
      infoString += theLayer.getInfo() + ", ";
    }
    return infoString += "]";
  };

  NF.Models.NFHighlightLayerCollection.prototype.addNFLayer = function(newLayer) {
    return this.addNFHighlightLayer(newLayer);
  };

  NF.Models.NFHighlightLayerCollection.prototype.addNFHighlightLayer = function(newLayer) {
    if (newLayer instanceof NF.Models.NFHighlightLayer) {
      return this.layers.push(newLayer);
    } else {
      throw "addNFHighlightLayer() can only be used to add NFHighlightLayers to an NFHighlightLayerCollection";
    }
  };

  NF.Models.NFHighlightLayerCollection.prototype.addAVLayer = function(newLayer) {
    if (true) {
      return this.layers.push(new NF.Models.NFHighlightLayer(newLayer));
    } else {
      throw "addAVLayer() can only be used to add AVLayers to an NFHighlightLayerCollection";
    }
  };

  NF.Models.NFHighlightLayerCollection.prototype.onlyContainsPageLayers = function() {
    return false;
  };

  NF.Models.NFHighlightLayerCollection.prototype.highlights = function() {
    return this;
  };

  NF.Models.NFHighlightLayerCollection.prototype.duplicateNames = function() {
    var j, len, nameArr, ref1, theLayer;
    nameArr = [];
    ref1 = this.layers;
    for (j = 0, len = ref1.length; j < len; j++) {
      theLayer = ref1[j];
      nameArr.push(theLayer.name);
    }
    return NF.Util.hasDuplicates(nameArr);
  };

  NF.Models.NFHighlightLayerCollection.collectionFromAVLayerArray = function(arr) {
    var layer, newArray, newLayer;
    newArray = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = arr.length; j < len; j++) {
        layer = arr[j];
        results.push(newLayer = new NF.Models.NFHighlightLayer(layer));
      }
      return results;
    })();
    return new NF.Models.NFHighlightLayerCollection(newArray);
  };


  /*
   *    NF PAGE ITEM
   *
   *    The composition page item
   *
   */

  NF.Models.NFPageItem = function(item) {
    this.item = item;
    return this;
  };

  NF.Models.NFPageItem.prototype.getInfo = function() {
    return "NFPageItem: '" + this.item.name + "'";
  };

  NF.Models.NFPageItem.prototype.highlights = function() {
    var highlightLayers, j, len, sourceLayers, theLayer;
    sourceLayers = NF.Util.collectionToArray(this.item.layers);
    highlightLayers = new NF.Models.NFHighlightLayerCollection();
    for (j = 0, len = sourceLayers.length; j < len; j++) {
      theLayer = sourceLayers[j];
      if (NF.Models.NFHighlightLayer.isHighlightLayer(theLayer)) {
        highlightLayers.addAVLayer(theLayer);
      }
    }
    return highlightLayers;
  };


  /*
   *    NF PDF
   *
   *    A collection of Page Items
   *
   */

  NF.Models.NFPDF = function(pageArr) {
    this.pages = pageArr;
    return this;
  };

  NF.Models.NFPDF.prototype.getInfo = function() {
    return "NFPDF: 'FIXME'";
  };

  NF.Models.NFPDF.prototype.addNFPageItem = function(newPage) {
    if (newPage instanceof NF.Models.NFPageItem) {
      return this.layers.push(newPage);
    } else {
      throw "You can only add NFPageItems to an NFPDF";
    }
  };

  app.NF = Object.assign(app.NF, NF);

}).call(this);
