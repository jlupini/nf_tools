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
    return this.isCompLayer() && this.layer.source.name.indexOf("NFPage") >= 0;
  };

  NF.Models.NFLayer.prototype.isCompLayer = function() {
    return this.layer instanceof AVLayer && this.layer.source instanceof CompItem;
  };

  NF.Models.NFLayer.prototype.getSpecializedLayer = function() {
    if (this.isPageLayer()) {
      return new NF.Models.NFPageLayer(this.layer);
    } else {
      return this;
    }
  };

  NF.Models.NFLayer.prototype.getInfo = function() {
    return "NFLayer: '" + this.layer.name + "'";
  };


  /*
   *    NF PAGE LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFPageLayer = function(layer) {
    NF.Models.NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFPageLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFPageLayer.prototype.getInfo = function() {
    return "NFPageLayer: '" + this.layer.name + "'";
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
    return this;
  };

  NF.Models.NFHighlightLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFHighlightLayer.prototype.getInfo = function() {
    return "NFHighlightLayer: '" + this.layer.name + "'";
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
    this.layers = layerArr;
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

  NF.Models.NFLayerCollection.collectionFromLayerArray = function(arr) {
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
