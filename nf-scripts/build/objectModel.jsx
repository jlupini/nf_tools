
/**
Creates a new NFComp and sets its comp property.
@class NFComp
@classdesc NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFComp
@param {CompItem} comp - the CompItem for this NFComp
@throws Will throw an error if not given a valid CompItem at initialization
 */
var NFComp;

NFComp = (function() {
  function NFComp(comp) {
    var ref, ref1;
    if (!(comp instanceof CompItem)) {
      throw "Cannot create an NFComp without a valid CompItem";
    }
    this.comp = comp;
    this.name = (ref = this.comp) != null ? ref.name : void 0;
    this.id = (ref1 = this.comp) != null ? ref1.id : void 0;
    this;
  }


  /**
  Returns a string representation of the object
  @memberof NFComp
  @returns {string} string representation of the object
   */

  NFComp.prototype.getInfo = function() {
    return "NFComp: '" + this.name + "'";
  };


  /**
  Gets the selected layers in this comp
  @memberof NFComp
  @returns {NFLayerCollection} collection of the selected layers in the comp
   */

  NFComp.prototype.selectedLayers = function() {
    return NFLayerCollection.collectionFromAVLayerArray(this.comp.selectedLayers);
  };


  /**
  Gets the selected pages in this comp
  @memberof NFComp
  @returns {NFPageLayerCollection} collection of the selected NFPageLayers in the comp
   */

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


  /**
   * Returns the NFLayer in this comp with the layer name given or null if none found
   * @memberof NFComp
   * @param {string} name - The search layer's name
   * @returns {NFLayer|null} The found layer or null
   */

  NFComp.prototype.layerWithName = function(name) {
    var foundLayer, ref, theLayer;
    theLayer = (ref = this.comp.layers) != null ? ref.byName(name) : void 0;
    if (theLayer != null) {
      foundLayer = new NFLayer(theLayer);
      return foundLayer.getSpecializedLayer();
    }
    return null;
  };


  /**
  Gets the Zoomer layer
  @memberof NFPartComp
  @returns {NFLayer | null} The zoomer NFLayer or null if it doesn't exist
   */

  NFComp.prototype.getZoomer = function() {
    var zoomer;
    zoomer = this.layerWithName('Zoomer');
    return zoomer;
  };


  /**
   * Creates and returns a new null layer in this comp
   * @memberof NFComp
   * @returns {NFLayer} The newly created null layer
   */

  NFComp.prototype.addNull = function() {
    return this.comp.layers.addNull();
  };

  return NFComp;

})();


/**
Creates a new NFLayer from a given AVLayer
@class NFLayer
@classdesc NF Wrapper object for an AVLayer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer (in which case we use it's AVLayer)
@property {AVLayer} layer - the wrapped AVLayer
@throws Will throw an error if not given a valid AVLayer object
 */
var NFLayer;

NFLayer = (function() {
  function NFLayer(layer) {
    if (NFLayer.isAVLayer(layer)) {
      this.layer = layer;
    } else if (layer instanceof NFLayer) {
      this.layer = layer.layer;
    } else {
      throw "Can only create a new NFLayer with a valid AVLayer or NFLayer object";
    }
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

  NFLayer.prototype.index = function() {
    return this.layer.index;
  };

  NFLayer.prototype.hasNullParent = function() {
    if (this.layer.parent != null) {
      return this.layer.parent.nullLayer;
    }
    return false;
  };

  NFLayer.prototype.effects = function() {
    return this.layer.Effects;
  };

  NFLayer.prototype.getEffectWithName = function(effectName) {
    return this.layer.Effects.property(effectName);
  };

  NFLayer.prototype.sameLayerAs = function(testLayer) {
    if (testLayer == null) {
      return false;
    }
    return this.layer.index === testLayer.layer.index && this.layer.containingComp.id === testLayer.layer.containingComp.id;
  };


  /**
  Returns the containing NFComp
  @memberof NFLayer
  @returns {NFComp} the containing comp
   */

  NFLayer.prototype.containingComp = function() {
    return new NFComp(this.layer.containingComp);
  };


  /**
  Returns an NFLayerCollection of child layers of this layer
  @memberof NFLayer
  @returns {NFLayerCollection} the collection of child layers
   */

  NFLayer.prototype.getChildren = function() {
    var allLayers, childLayers, i, len, testLayer, theLayer;
    allLayers = this.containingComp().comp.layers.toArr();
    childLayers = [];
    for (i = 0, len = allLayers.length; i < len; i++) {
      theLayer = allLayers[i];
      testLayer = new NFLayer(theLayer);
      if (testLayer.layer.parent === this.layer) {
        testLayer = testLayer.getSpecializedLayer();
        childLayers.push(testLayer);
      }
    }
    return new NFLayerCollection(childLayers);
  };


  /**
  Gets the layer's parent NFLayer, if any
  @memberof NFLayer
  @returns {NFLayer | null} the parent layer, or null if no parent
   */

  NFLayer.prototype.getParent = function() {
    if (this.layer.parent != null) {
      return new NFLayer(this.layer.parent);
    }
    return null;
  };


  /**
  Sets the layer's parent to a given NFLayer
  @memberof NFLayer
  @param {NFLayer | AVLayer | null} newParent - the new parent NFLayer or AVLayer for this layer. Null to set no parent
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer or null
   */

  NFLayer.prototype.setParent = function(newParent) {
    if (NFLayer.isAVLayer(newParent)) {
      this.layer.parent = newParent;
    } else if (newParent instanceof NFLayer) {
      this.layer.parent = newParent != null ? newParent.layer : void 0;
    } else {
      if (!(newParent instanceof NFLayer)) {
        throw "Can only set an NFLayer's parent to another NFLayer or AVLayer";
      }
    }
    return this;
  };


  /**
  Sets the layer's parent to the zoomer if this layer is in an NFPartComp
  @memberof NFLayer
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer or null
   */

  NFLayer.prototype.setZoomer = function() {
    var zoomer;
    zoomer = this.containingComp().getZoomer();
    if (zoomer != null) {
      this.setParent(zoomer);
    }
    return this;
  };


  /**
  Moves this layer's index to immediately before the provided target layer
  @memberof NFLayer
  @param {NFLayer} targetLayer - the layer to move this layer before
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer
   */

  NFLayer.prototype.moveBefore = function(targetLayer) {
    if (!(targetLayer instanceof NFLayer)) {
      throw "Can't run moveBefore on a non-NFLayer";
    }
    this.layer.moveBefore(targetLayer.layer);
    return this;
  };


  /**
  Moves this layer's index to immediately after the provided target layer
  @memberof NFLayer
  @param {NFLayer} targetLayer - the layer to move this layer after
  @returns {NFLayer} self
  @throws Will throw an error if not given an NFLayer
   */

  NFLayer.prototype.moveAfter = function(targetLayer) {
    if (!(targetLayer instanceof NFLayer)) {
      throw "Can't run moveAfter on a non-NFLayer";
    }
    this.layer.moveAfter(targetLayer.layer);
    return this;
  };


  /**
  Moves this layer's index to immediately after the provided target layer
  @memberof NFLayer
  @returns {Property} Marker property
   */

  NFLayer.prototype.markers = function() {
    return this.layer.property("Marker");
  };


  /**
  Sets the given property's expression and adds In and Out markers (if not already on the layer) for in and out transitions. Overrides previous expressions
  @memberof NFLayer
  @returns {NFLayer} self
  @param {Object} options - an object with the chosen equations and in/out values. Equations found in easingEquations.coffee
  @param {Property} options.property - the property to use for the in/outs. required
  @param {float} options.length - the length of the transition. Default 2.0
  @param {string} options.startEquation - the equation to use for the in transition of the property.
  @param {string} options.endEquation - the equation to use for the out transition of the property.
  @param {any | Array} options.startValue - the value for this property at its inPoint. If the property is multidimensional, this should be an array of that many dimensions. Can also pass a slider property.
  @param {any | Array} options.endValue - the value for this property at its outPoint. If the property is multidimensional, this should be an array of that many dimensions. Can also pass a slider property.
  @throws Throws error if not given at least a start or end equation and value
  @throws Throws error if the start or end values given are the wrong number of dimensions for this property
   */

  NFLayer.prototype.addInOutMarkersForProperty = function(options) {
    var e, element, error, error1, expression, fileText, i, idx, inComm, inMarker, inValueString, j, markers, outComm, outMarker, outValueString, ref, ref1, shouldFail;
    if (!((options.property != null) && options.property instanceof Property)) {
      throw "Invalid property";
    }
    if (!(((options.startEquation != null) && (options.startValue != null)) || ((options.endEquation != null) && (options.endValue != null)))) {
      throw "Can't run makeEasedInOutFromMarkers() without at least a start or end equation and value";
    }
    shouldFail = false;
    if (options.property.value instanceof Array) {
      if (options.startValue != null) {
        if (!(options.startValue instanceof Array && options.startValue.length === options.property.value.length)) {
          shouldFail = true;
        }
      }
      if (options.endValue != null) {
        if (!(options.endValue instanceof Array && options.endValue.length === options.property.value.length)) {
          shouldFail = true;
        }
      }
    } else {
      if ((options.startValue != null) && options.startValue instanceof Array) {
        shouldFail = true;
      }
      if ((options.endValue != null) && options.endValue instanceof Array) {
        shouldFail = true;
      }
    }
    if (shouldFail) {
      throw "Given start or end value type doesn't match property value";
    }
    if (options.length == null) {
      options.length = 2.0;
    }
    inComm = "NF In";
    outComm = "NF Out";
    markers = this.markers();
    inMarker = outMarker = null;
    try {
      inMarker = markers.keyValue(inComm);
    } catch (error) {
      e = error;
    }
    try {
      outMarker = markers.keyValue(outComm);
    } catch (error1) {
      e = error1;
    }
    if (options.startValue != null) {
      if (inMarker == null) {
        markers.setValueAtTime(this.layer.inPoint + options.length, new MarkerValue(inComm));
      }
    } else if (inMarker != null) {
      this.layer.removeMarker(inComm);
    }
    if (options.endValue != null) {
      if (outMarker == null) {
        markers.setValueAtTime(this.layer.outPoint - options.length, new MarkerValue(outComm));
      }
    } else if (outMarker != null) {
      this.layer.removeMarker(outComm);
    }
    fileText = NF.Util.readFile("expressions/marker-animation-main-function.js");
    fileText = NF.Util.fixLineBreaks(fileText);
    expression = fileText;
    if (options.startEquation != null) {
      expression = ("var startEquationString = '" + options.startEquation + "';\n") + expression;
      if (options.startValue instanceof Array) {
        inValueString = "[";
        for (idx = i = 0, ref = options.startValue.length - 1; 0 <= ref ? i <= ref : i >= ref; idx = 0 <= ref ? ++i : --i) {
          element = options.startValue[idx];
          if (element instanceof Property) {
            inValueString += options.startValue[idx].expressionStringForValue();
          } else {
            inValueString += options.startValue[idx];
          }
          if (idx < options.startValue.length - 1) {
            inValueString += ",";
          }
        }
        inValueString += "]";
      } else if (options.startValue instanceof Property) {
        inValueString = options.startValue.expressionStringForValue();
      } else {
        inValueString = options.startValue;
      }
      expression = ("var inValue = " + inValueString + ";\n") + expression;
    }
    if (options.endEquation != null) {
      expression = ("var endEquationString = '" + options.endEquation + "';\n") + expression;
      if (options.endValue instanceof Array) {
        outValueString = "[";
        for (idx = j = 0, ref1 = options.endValue.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; idx = 0 <= ref1 ? ++j : --j) {
          element = options.endValue[idx];
          if (element instanceof Property) {
            outValueString += options.endValue[idx].expressionStringForValue();
          } else {
            outValueString += options.endValue[idx];
          }
          if (idx < options.endValue.length - 1) {
            outValueString += ",";
          }
        }
        outValueString += "]";
      } else if (options.endValue instanceof Property) {
        outValueString = options.endValue.expressionStringForValue();
      } else {
        outValueString = options.endValue;
      }
      expression = ("var outValue = " + outValueString + ";\n") + expression;
    }
    if (!options.property.canSetExpression) {
      throw "Can't set expression on this property";
    }
    options.property.expression = expression;
    return this;
  };


  /**
  Creates and returns a slider effect on the layer
  @memberof NFLayer
  @param {string} name - the slider name
  @param {float} value - the initial value of the slider
  @returns {Property} the slider property
   */

  NFLayer.prototype.addSlider = function(name, value) {
    var slider;
    slider = this.effects().addProperty("ADBE Slider Control");
    slider.slider.setValue(value);
    slider.name = name;
    return slider;
  };

  return NFLayer;

})();

NFLayer = Object.assign(NFLayer, {
  getSpecializedLayerFromAVLayer: function(theLayer) {
    var tmpLayer;
    if (!NFLayer.isAVLayer(theLayer)) {
      throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer";
    }
    tmpLayer = new NFLayer(theLayer);
    return tmpLayer.getSpecializedLayer();
  },
  isCompLayer: function(theLayer) {
    return NFLayer.isAVLayer(theLayer) && theLayer.source instanceof CompItem;
  },

  /**
  Returns whether or not a given Layer is an AVLayer or one of its subclasses. This is because Layer objects don't play nice with `instanceof`
  @memberof NFLayer
  @param {Layer} layer - the Layer to check
  @returns {boolean} the result
   */
  isAVLayer: function(layer) {
    return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
  }
});


/**
Creates a new NFLayerCollection from an array of [NFLayers]{@link NFLayer}
@class NFLayerCollection
@classdesc NF Wrapper object for a Array that contains NFLayers
@param {Array} layerArr - the array with [NFLayers]{@link NFLayer} to initialize the collection with
@property {Array} layers - the array of [NFLayers]{@link NFLayer} in the collection
@throws Will throw an error if array contains non-{@link NFLayer} objects
 */
var NFLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFLayerCollection = (function(superClass) {
  extend(NFLayerCollection, superClass);

  function NFLayerCollection(layerArr) {
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
    this;
  }

  NFLayerCollection.prototype.getInfo = function() {
    var infoString, j, len, ref, theLayer;
    infoString = "NFLayerCollection: [";
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
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
    var j, len, ref, theLayer;
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (!(theLayer instanceof NFPageLayer)) {
        return false;
      }
    }
    return true;
  };

  NFLayerCollection.prototype.inSameComp = function() {
    var j, layer, len, ref, testID;
    if (this.isEmpty()) {
      return true;
    }
    testID = this.layers[0].containingComp().id;
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
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


  /**
  Removes a given layer from this collection
  @memberof NFLayerCollection
  @returns {NFLayerCollection} self
  @param {NFLayer} layerToRemove the layer to be removed
  @throws Throws an error if the layers couldn't be found in this collection
   */

  NFLayerCollection.prototype.remove = function(layerToRemove) {
    var i, j, layer, ref;
    for (i = j = 0, ref = this.count() - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      layer = this.layers[i];
      if (layer.sameLayerAs(layerToRemove)) {
        this.layers.splice(i, 1);
        return this;
      }
    }
    throw "Couldn't find layer to remove";
  };


  /**
  Gets the topmost NFLayer in this collection
  @memberof NFLayerCollection
  @returns {NFLayer | null} the topmost layer or null if empty
  @throws Throws an error if the layers are in different comps
   */

  NFLayerCollection.prototype.getTopmostLayer = function() {
    var j, layer, len, ref, topmostLayer;
    if (this.isEmpty()) {
      return null;
    }
    if (!this.inSameComp()) {
      throw "Can't get topmost layer of layers in different comps";
    }
    topmostLayer = this.layers[0];
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
      if (layer.layer.index < topmostLayer.layer.index) {
        topmostLayer = layer;
      }
    }
    return topmostLayer;
  };


  /**
  Gets the bottommost NFLayer in this collection
  @memberof NFLayerCollection
  @returns {NFLayer | null} the bottommost layer or null if empty
  @throws Throws an error if the layers are in different comps
   */

  NFLayerCollection.prototype.getBottommostLayer = function() {
    var bottommostLayer, j, layer, len, ref;
    if (this.isEmpty()) {
      return null;
    }
    if (!this.inSameComp()) {
      throw "Can't get bottommost layer of layers in different comps";
    }
    bottommostLayer = this.layers[0];
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
      if (layer.layer.index > bottommostLayer.layer.index) {
        bottommostLayer = layer;
      }
    }
    return bottommostLayer;
  };


  /**
  Sets all member layers' parents to a given {@link NFLayer} or null
  @memberof NFLayerCollection
  @param {NFLayer | null} newParent - the new parent for the member layers
  @returns {NFLayerCollection} self
   */

  NFLayerCollection.prototype.setParents = function(newParent) {
    var j, layer, len, ref;
    if (!this.isEmpty()) {
      ref = this.layers;
      for (j = 0, len = ref.length; j < len; j++) {
        layer = ref[j];
        layer.setParent(newParent);
      }
    }
    return this;
  };


  /**
  Creates a new null parent to all the layers in the collection, positioned above the one with the lowest index. Will override previous parenting.
  @memberof NFLayerCollection
  @returns {NFLayer} the new null NFLayer
   */

  NFLayerCollection.prototype.nullify = function() {
    var newNull;
    if (!this.inSameComp()) {
      throw "Cannot nullify layers in different compositions at the same time";
    }
    if (this.isEmpty()) {
      throw "Cannot nullify without a given layer";
    }
    newNull = this.containingComp().addNull();
    this.setParents(newNull);
    newNull.moveBefore(this.getTopmostLayer().layer);
    return newNull;
  };

  return NFLayerCollection;

})(Array);


/**
Class Method which returns a new NFLayerCollection from an array of AVLayers
@memberof NFLayerCollection
@returns {NFLayerCollection} the new layer collection
@throws Throw error if the given array doesn't contain only AVLayers
 */

NFLayerCollection = Object.assign(NFLayerCollection, {
  collectionFromAVLayerArray: function(arr) {
    var layer, newArray, newLayer;
    newArray = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = arr.length; j < len; j++) {
        layer = arr[j];
        if (!NFLayer.isAVLayer(layer)) {
          throw "Cannot run collectionFromAVLayerArray() because not all layers provided are AVLayers";
        }
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


/**
Creates a new NFPageLayer from a given AVLayer
@class NFPageLayer
@classdesc Subclass of {@link NFLayer} for a page layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a source (aka a comp layer)
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


  /**
  Returns a connected paper parent layer. Not to be confused with {@link NFPageLayer#findPaperParentLayer} which will return a non-connected one
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
   */

  NFPageLayer.prototype.getPaperParentLayer = function() {
    if (this.layer.parent != null) {
      return new NFPaperParentLayer(this.layer.parent);
    } else {
      return null;
    }
  };


  /**
  Returns the paperParentLayer for this layer, if it exists, REGARDLESS OF WHETHER ITS CONNECTED. Not to be confused with {@link NFPageLayer#getPaperParentLayer}
  @memberof NFPageLayer
  @returns {NFPaperParentLayer | null} The paper parent layer if found
   */

  NFPageLayer.prototype.findPaperParentLayer = function() {
    var paperParent;
    paperParent = this.getPaperParentLayer();
    if (paperParent == null) {
      paperParent = this.containingComp().layerWithName(NFPaperParentLayer.getPaperParentNameForPageLayer(this));
    }
    return paperParent;
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

  return NFPageLayer;

})(NFLayer);

NFPageLayer = Object.assign(NFPageLayer, {
  isPageLayer: function(theLayer) {
    return NFLayer.isCompLayer(theLayer) && theLayer.source.name.indexOf("NFPage") >= 0;
  }
});


/**
Creates a new NFPageLayerCollection from a given array of NFPageLayers
@class NFPageLayerCollection
@classdesc Subclass of {@link NFLayer} for the parent null layer of a group of page layers from the same PDF
@param {NFPageLayer[]} layerArr - array of layers to use
@property {NFPageLayer[]} layers - array of layers
@extends NFLayerCollection
@throws Will throw an error if the array does not contain valid page layers
 */
var NFPageLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPageLayerCollection = (function(superClass) {
  extend(NFPageLayerCollection, superClass);

  function NFPageLayerCollection(layerArr) {
    var j, len, ref, theLayer;
    NFLayerCollection.call(this, layerArr);
    if (this.layers != null) {
      ref = this.layers;
      for (j = 0, len = ref.length; j < len; j++) {
        theLayer = ref[j];
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
    if (NFLayer.isAVLayer(newLayer)) {
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


  /**
  Creates a new {@link NFPaperParentLayer} from this collection
  @memberof NFPageLayerCollection
  @returns {NFPaperParentLayer} the new Paper Parent layer
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
   */

  NFPageLayerCollection.prototype.newPaperParentLayer = function() {
    var newPaperParent;
    if (this.isEmpty()) {
      throw "Can't create a paper parent layer with no target layers";
    }
    if (!this.fromSamePDF()) {
      throw "Can't create a single paper parent layer for page layers from different PDFs";
    }
    newPaperParent = new NFPaperParentLayer(this.nullify()).setName();
    return newPaperParent;
  };


  /**
  Checks for an existing valid paper parent layer for these pages. Sets it as
  the parent if it exists, otherwise creates a new one.
  @memberof NFPageLayerCollection
  @returns {NFPaperParentLayer} the paper parent layer
  @param {boolean} [shouldMove] - whether or not the layers should move below their parent
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
   */

  NFPageLayerCollection.prototype.assignPaperParentLayer = function(shouldMove) {
    var bottomLayer, j, layer, layersAboveGroup, layersBelowGroup, len, paperLayerGroup, paperParentLayer, ref, topLayer;
    if (shouldMove == null) {
      shouldMove = false;
    }
    if (this.isEmpty()) {
      throw "Can't create a paper parent layer with no target layers";
    }
    if (!this.fromSamePDF()) {
      throw "Can't create a single paper parent layer for page layers from different PDFs";
    }
    paperParentLayer = this.layers[0].findPaperParentLayer();
    if (paperParentLayer != null) {
      if (shouldMove) {
        paperLayerGroup = paperParentLayer.getChildren();
        layersAboveGroup = new NFLayerCollection();
        layersBelowGroup = new NFLayerCollection();
        ref = this.layers;
        for (j = 0, len = ref.length; j < len; j++) {
          layer = ref[j];
          if (layer.index() < paperParentLayer.index()) {
            layersAboveGroup.addNFLayer(layer);
          }
          if (layer.index() > paperParentLayer.index()) {
            layersBelowGroup.addNFLayer(layer);
          }
        }
        while (layersAboveGroup.count() > 0) {
          bottomLayer = layersAboveGroup.getBottommostLayer();
          bottomLayer.moveAfter(paperParentLayer);
          layersAboveGroup.remove(bottomLayer);
        }
        while (layersBelowGroup.count() > 0) {
          topLayer = layersBelowGroup.getTopmostLayer();
          topLayer.moveAfter(paperLayerGroup.getBottommostLayer());
          layersBelowGroup.remove(topLayer);
        }
      }
      this.setParents(paperParentLayer);
    } else {
      paperParentLayer = this.newPaperParentLayer();
    }
    return paperParentLayer;
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


/**
Creates a new NFPaperParentLayer from a given null AVLayer
@class NFPaperParentLayer
@classdesc Subclass of {@link NFLayer} for the parent null layer of a group of page layers from the same PDF
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer that's a null layer or an NFLayer with a similar layer property
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


  /**
  Sets the name of this paper parent layer to the correct name.
  @memberof NFPaperParentLayer
  @returns {NFPaperParentLayer} self
  @throws Throws error if there are no child layers
   */

  NFPaperParentLayer.prototype.setName = function() {
    var children, newName;
    children = this.getChildren();
    if (children.isEmpty()) {
      throw "Cannot set paper parent layer name because it has no child layers";
    }
    newName = 'PDF ' + children.layers[0].getPDFNumber();
    this.layer.name = newName;
    return this;
  };

  return NFPaperParentLayer;

})(NFLayer);

NFPaperParentLayer = Object.assign(NFPaperParentLayer, {

  /**
  Class Method. Tests an AV layer to see if it can be a paper parent Layer
  @memberof NFPaperParentLayer
  @param {AVLayer} layer - the AVLayer to test
  @returns {boolean} whether or not the layer is a valid paper parent
   */
  isPaperParentLayer: function(layer) {
    return layer.nullLayer && layer.name.indexOf('PDF' >= 0);
  },

  /**
  Class Method. Returns the name string for the paper parent for a given layer
  @memberof NFPaperParentLayer
  @param {NFPageLayer} pageLayer - the page layer to use to determine the name
  @returns {string} The name of the paperParentLayer for the given layer
   */
  getPaperParentNameForPageLayer: function(pageLayer) {
    return 'PDF ' + pageLayer.getPDFNumber();
  }
});


/**
Creates a new NFPartComp and sets its comp property.
@class NFPartComp
@classdesc NF Wrapper object for a CompItem used as a part comp that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFPartComp
@param {CompItem} comp - the CompItem for this NFPartComp
@extends NFComp
@throws Will throw an error if not given a valid CompItem at initialization
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


  /**
  Returns a string representation of the object
  @memberof NFPartComp
  @override
  @returns {string} string representation of the object
   */

  NFPartComp.prototype.getInfo = function() {
    return "NFPartComp: '" + this.name + "'";
  };


  /**
  Gets the zoomer layer
  @memberof NFPartComp
  @override
  @throws Will throw an error if the zoomer comp cannot be found
  @returns {NFLayer} The zoomer NFLayer
   */

  NFPartComp.prototype.getZoomer = function() {
    var zoomer;
    zoomer = this.layerWithName('Zoomer');
    if (zoomer == null) {
      throw "This NFPartComp has no zoomer!";
    }
    return zoomer;
  };

  return NFPartComp;

})(NFComp);
