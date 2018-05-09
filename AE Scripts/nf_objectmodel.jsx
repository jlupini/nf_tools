(function() {
  var NF, ref, testFunction;

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
    return "NFLayer: " + this.layer.name;
  };


  /*
   *    NF PAGE LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFPageLayer = function(layer) {
    NFLayer.call(this, layer);
    return this;
  };

  NFPageLayer.prototype = new NFLayer();

  NF.Models.NFPageLayer.prototype.getInfo = function() {
    return "NFPageLayer: " + this.layer.name;
  };


  /*
   *    NF IMAGE LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFImageLayer = function(layer) {
    NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFImageLayer.prototype = new NFLayer();

  NF.Models.NFImageLayer.prototype.getInfo = function() {
    return "NFImageLayer: " + this.layer.name;
  };


  /*
   *    NF GAUSSY LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFGaussyLayer = function(layer) {
    NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFGaussyLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFGaussyLayer.prototype.getInfo = function() {
    return "NFGaussyLayer: " + this.layer.name;
  };


  /*
   *    NF EMPHASIS LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFEmphasisLayer = function(layer) {
    NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFEmphasisLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFEmphasisLayer.prototype.getInfo = function() {
    return "NFEmphasisLayer: " + this.layer.name;
  };


  /*
   *    NF HIGHLIGHT LAYER
   *
   *    (inherits from NFLayer)
   *
   */

  NF.Models.NFHighlightLayer = function(layer) {
    NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFHighlightLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFHighlightLayer.prototype.getInfo = function() {
    return "NFHighlightLayer: " + this.layer.name;
  };


  /*
   *    NF PAPER PARENT LAYER
   *
   *    (inherits from NFLayer)
   */

  NF.Models.NFPaperParentLayer = function(layer) {
    NFLayer.call(this, layer);
    return this;
  };

  NF.Models.NFPaperParentLayer.prototype = new NF.Models.NFLayer();

  NF.Models.NFPaperParentLayer.prototype.getInfo = function() {
    return "NFPaperParentLayer: " + this.layer.name;
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
    return "NFPageItem: " + this.item.name;
  };

  testFunction = function() {
    var children, i, parentLayer, results, selectedLayer;
    $.writeln('\n\nRunning...');
    selectedLayer = NF.mainComp.selectedLayers[0];
    parentLayer = new NF.Models.NFPaperParentLayer(selectedLayer);
    children = parentLayer.getChildren();
    i = 0;
    results = [];
    while (i < children.length) {
      $.writeln(children[i].getInfo());
      results.push(i++);
    }
    return results;
  };

  testFunction();

  app.NF = Object.assign(app.NF, NF);

}).call(this);
