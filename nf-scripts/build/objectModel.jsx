
/**
Creates a new NFComp and sets its comp property.
@class NFComp
@classdesc NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFComp
@param {CompItem | NFComp} comp - the CompItem for this NFComp
@throws Will throw an error if not given a valid CompItem at initialization
 */
var NFComp;

NFComp = (function() {
  function NFComp(comp) {
    var item, ref, ref1;
    if (comp instanceof CompItem) {
      item = comp;
    } else if (comp instanceof NFComp) {
      item = comp.comp;
    } else {
      throw "Cannot create an NFComp without a valid CompItem or NFComp";
    }
    this.comp = item;
    this.name = (ref = this.comp) != null ? ref.name : void 0;
    this.id = (ref1 = this.comp) != null ? ref1.id : void 0;
    this;
  }

  NFComp.prototype.toString = function() {
    return "NFComp: '" + this.name + "'";
  };


  /**
  Checks to see if two NFComps have the same ID
  @memberof NFComp
  @param {NFComp} testComp - the comp to compare
  @returns {boolean} if they're referrring to the same object
  @throws Throws error if testComp is not an NFComp or subclass
   */

  NFComp.prototype.is = function(testComp) {
    if (!(testComp instanceof NFComp)) {
      throw "Can't compare an NFComp to a different type of object";
    }
    return this.id === testComp.id;
  };


  /**
  Gets the selected layers in this comp
  @memberof NFComp
  @returns {NFLayerCollection} collection of the selected layers in the comp
   */

  NFComp.prototype.selectedLayers = function() {
    return new NFLayerCollection(this.comp.selectedLayers);
  };


  /**
  Gets all the layers in this comp
  @memberof NFComp
  @returns {NFLayerCollection} collection of the layers in the comp
   */

  NFComp.prototype.allLayers = function() {
    return new NFLayerCollection(this.comp.layers);
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
        selectedPageLayers.addLayer(layer);
      }
    }
    return selectedPageLayers;
  };


  /**
  Gets the active NFLayers at a time (or current time by default).
  @memberof NFComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFLayerCollection} The active layers or null if none active
   */

  NFComp.prototype.activeLayers = function(time) {
    var activeLayers, i, layer, len, originalTime, ref;
    if (time != null) {
      originalTime = this.getTime();
      this.setTime(time);
    }
    activeLayers = new NFLayerCollection;
    ref = this.allLayers().layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.isActive()) {
        activeLayers.addLayer(layer);
      }
    }
    if (originalTime != null) {
      this.setTime(originalTime);
    }
    return activeLayers;
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
  @memberof NFComp
  @returns {NFLayer | null} The zoomer NFLayer or null if it doesn't exist
   */

  NFComp.prototype.getZoomer = function() {
    var zoomer;
    zoomer = this.layerWithName('Zoomer');
    return zoomer;
  };


  /**
  Sets the comp time
  @memberof NFComp
  @param {float} newTime - the new time
  @returns {NFComp} self
   */

  NFComp.prototype.setTime = function(newTime) {
    this.comp.time = newTime;
    return this;
  };


  /**
  Gets the comp time
  @memberof NFComp
  @returns {float} the time
   */

  NFComp.prototype.getTime = function(newTime) {
    return this.comp.time;
  };


  /**
   * Creates and returns a new null layer in this comp
   * @memberof NFComp
   * @returns {NFLayer} The newly created null layer
   */

  NFComp.prototype.addNull = function() {
    return this.comp.layers.addNull();
  };


  /**
  Inserts a layer into the comp at a given index at the current time. Returns
  the new layer
  @memberof NFComp
  @returns {NFLayer} the new layer
  @param {Object} model - the parameters
  @param {NFComp} model.comp - the comp to insert
  @param {NFLayer} [model.above] - the layer to insert the page above. Can use
  only one of .above, .below or .at
  @param {NFLayer} [model.below] - the layer to insert the page below. Can use
  only one of .above, .below or .at
  @param {int} [model.at=0] - the index to insert the page at. Can use only
  one of .above, .below or .at
  @throws Throw error if given values for more than one of .above, .below,
  and .at
   */

  NFComp.prototype.insertComp = function(model) {
    var index, newAVLayer, tooManyIndices;
    if (!((model.comp != null) && model.comp instanceof NFComp)) {
      throw "No comp to insert";
    }
    if ((model.above != null) && !model.above instanceof NFLayer) {
      throw "model.above must be an NFLayer";
    }
    if ((model.below != null) && !model.below instanceof NFLayer) {
      throw "model.below must be an NFLayer";
    }
    index = 0;
    tooManyIndices = false;
    if ((model.above != null) && model.above instanceof NFLayer) {
      if ((model.below != null) || (model.at != null)) {
        tooManyIndices = true;
      }
      if (model.above.containingComp().is(this)) {
        index = model.above.index();
      } else {
        throw "Cannot insert layer above a layer not in this comp";
      }
    } else if ((model.below != null) && model.below instanceof NFLayer) {
      if ((model.above != null) || (model.at != null)) {
        tooManyIndices = true;
      }
      if (model.below.containingComp().is(this)) {
        index = model.below.index();
      } else {
        throw "Cannot insert layer below a layer not in this comp";
      }
    } else if (model.at != null) {
      if ((model.above != null) || (model.below != null)) {
        tooManyIndices = true;
      }
      index = model.at;
    }
    if (tooManyIndices) {
      throw "Can only provide one of .above, .below, or .at when inserting page";
    }
    newAVLayer = this.comp.layers.add(model.comp.comp);
    newAVLayer.startTime = this.getTime();
    if (index !== 0) {
      newAVLayer.moveBefore(this.comp.layers[index + 2]);
    }
    return NFLayer.getSpecializedLayerFromAVLayer(newAVLayer);
  };

  return NFComp;

})();

NFComp = Object.assign(NFComp, {

  /**
   * Returns a new NFComp, or a NFPartComp or NFPageComp if suitable
   * @memberof NFComp
   * @param {NFComp | CompItem}
   * @returns {NFComp | NFPageComp | NFPartComp} The new comp
   */
  specializedComp: function(comp) {
    try {
      return new NFPageComp(comp);
    } catch (undefined) {}
    try {
      return new NFPartComp(comp);
    } catch (undefined) {}
    return new NFComp;
  },
  TOP: 100,
  LEFT: 200,
  BOTTOM: 300,
  RIGHT: 400
});


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
    if (layer.isAVLayer()) {
      this.layer = layer;
    } else if (layer instanceof NFLayer) {
      this.layer = layer.layer;
    } else {
      throw "Can only create a new NFLayer with a valid AVLayer or NFLayer object";
    }
    this.layer = layer;
    this;
  }

  NFLayer.prototype.toString = function() {
    return "NFLayer: '" + this.layer.name + "'";
  };


  /**
  Returns the name of the layer
  @memberof NFLayer
  @returns {string} the layer name
   */

  NFLayer.prototype.getName = function() {
    return this.layer.name;
  };


  /**
  Checks if this layer is a valid page Layer
  @memberof NFLayer
  @returns {boolean} if this is a valid page layer
   */

  NFLayer.prototype.isPageLayer = function() {
    return NFPageLayer.isPageLayer(this.layer);
  };


  /**
  Checks if this layer is an AVLayer and ALWAYS RETURNS FALSE
  @memberof NFLayer
  @returns {boolean} if this is a valid AVLayer... so no.
   */

  NFLayer.prototype.isAVLayer = function() {
    return false;
  };


  /**
  Checks if this layer is a null layer
  @memberof NFLayer
  @returns {boolean} if this is a null layer
   */

  NFLayer.prototype.isNullLayer = function() {
    return this.layer.nullLayer;
  };


  /**
  Checks if this layer is active
  @memberof NFLayer
  @returns {boolean} if this is an active layer
   */

  NFLayer.prototype.isActive = function() {
    return this.layer.active;
  };


  /**
  Checks if this layer is a valid highlight layer
  @memberof NFLayer
  @returns {boolean} if this is a valid highlight layer
   */

  NFLayer.prototype.isHighlightLayer = function() {
    return NFHighlightLayer.isHighlightLayer(this.layer);
  };


  /**
  Checks if this layer is a valid paper parent layer
  @memberof NFLayer
  @returns {boolean} if this is a valid paper parent layer
   */

  NFLayer.prototype.isPaperParentLayer = function() {
    return NFPaperParentLayer.isPaperParentLayer(this.layer);
  };


  /**
  Returns a new layer of a specialized type for the contents of this layer
  @memberof NFLayer
  @returns {NFPageLayer | NFHighlightLayer | NFPaperParentLayer | NFLayer} the specialized layer or self if no specialized layer options
   */

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


  /**
  Shorthand for the layer's index
  @memberof NFLayer
  @returns {int} the layer's index
   */

  NFLayer.prototype.index = function() {
    return this.layer.index;
  };


  /**
  Returns true if the layer has a null parent
  @memberof NFLayer
  @returns {boolean} Whether this layer has a parent which is a null layer
   */

  NFLayer.prototype.hasNullParent = function() {
    if (this.layer.parent != null) {
      return this.layer.parent.nullLayer;
    }
    return false;
  };


  /**
  Returns the effects Property for the layer
  @memberof NFLayer
  @returns {Property} the effects property
   */

  NFLayer.prototype.effects = function() {
    return this.layer.Effects;
  };


  /**
  Returns the effect property with a given name, only one level under Effects.
  Uses `Effects.property(effectName)``
  @memberof NFLayer
  @param {string} effectName - the name of the effect to look for
  @returns {Property | null} the property or null if not found
   */

  NFLayer.prototype.effect = function(effectName) {
    return this.layer.Effects.property(effectName);
  };


  /**
  Returns the root property on the layer with the given name. Saves you a `.layer`
  when accessing in other classes
  @memberof NFLayer
  @param {string} propName - the name of the property to return
  @returns {Property | null} the property or null if not found
   */

  NFLayer.prototype.property = function(propName) {
    return this.layer.property(propName);
  };


  /**
  Checks to see if a given NFLayer's layer is the same as this one's
  For example, an NFLayer and an NFPageLayer that refer to the same layer will return true
  @memberof NFLayer
  @returns {boolean} Whether both layers are the same layer
   */

  NFLayer.prototype.is = function(testLayer) {
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
    return NFComp.specializedComp(this.layer.containingComp);
  };


  /**
  Creates a new null parent to this layer, positioned above it. Will override previous parenting.
  @memberof NFLayer
  @returns {NFLayer} the new null NFLayer
   */

  NFLayer.prototype.nullify = function() {
    var newNull;
    newNull = this.containingComp().addNull();
    this.setParent(newNull);
    newNull.moveBefore(this.layer);
    return newNull;
  };


  /**
  Returns an NFLayerCollection of child layers of this layer as specialized layers
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
    if (newParent.isAVLayer()) {
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
  Returns the marker Property
  @memberof NFLayer
  @returns {Property} Marker property
   */

  NFLayer.prototype.markers = function() {
    return this.layer.property("Marker");
  };


  /**
  Sets the given property's expression and adds In and Out markers (if not
  already on the layer) for in and out transitions. Does NOT override existing
  expressions and marker-driven in/outs
  @memberof NFLayer
  @returns {NFLayer} self
  @param {Object} options - an object with the chosen equations and in/out
  values. Equations found in easingEquations.coffee
  @param {Property} options.property - the property to use for the in/outs.
  required
  @param {float} options.length - the length of the transition. Default 2.0
  @param {string} options.startEquation - the equation to use for the in
  transition of the property.
  @param {string} options.endEquation - the equation to use for the out
  transition of the property.
  @param {any | Array} options.startValue - the value for this property
  at its inPoint. If the property is multidimensional, this should be an
  array of that many dimensions. Can also pass a slider property.
  @param {any | Array} options.endValue - the value for this property at
  its outPoint. If the property is multidimensional, this should be an
  array of that many dimensions. Can also pass a slider property.
  @throws Throws error if not given at least a start or end equation and value
  @throws Throws error if the start or end values given are the wrong
  number of dimensions for this property
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
  Returns the time in the layer's containing comp of the in marker on the layer,
  or null if there's no in marker
  @memberof NFLayer
  @returns {float | null} the in time
   */

  NFLayer.prototype.getInMarkerTime = function() {
    try {
      return this.markers().keyTime("NF In");
    } catch (undefined) {}
    return null;
  };


  /**
  Returns the time in the layer's containing comp of the out marker on the
  layer, or null if there's no out marker
  @memberof NFLayer
  @returns {float | null} the in time
   */

  NFLayer.prototype.getOutMarkerTime = function() {
    try {
      return this.markers().keyTime("NF Out");
    } catch (undefined) {}
    return null;
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


  /**
  Uses a null hack to get the source Rect of a layer relative to its
  containing comp.
  @memberof NFLayer
  @param {NFLayer | AVLayer} targetLayer - the layer to get the rect for
  @param {float} [targetTime] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
   */

  NFLayer.prototype.sourceRectForLayer = function(targetLayer, targetTime) {
    var bottomRightPoint, compTime, expressionBase, layer, rect, tempNull, topLeftPoint;
    if (targetTime == null) {
      targetTime = null;
    }
    if (targetLayer instanceof NFLayer) {
      layer = targetLayer.layer;
    } else if (targetLayer.isAVLayer()) {
      layer = targetLayer;
    } else {
      throw "Can only get source rect relative to comp of NFLayer or AVLayer objects";
    }
    compTime = this.containingComp().getTime();
    targetTime = targetTime != null ? targetTime : compTime;
    tempNull = layer.containingComp.layers.addNull();
    this.containingComp().setTime(compTime);
    expressionBase = "rect = thisComp.layer(" + layer.index + ").sourceRectAtTime(time);";
    tempNull.transform.position.expression = expressionBase + ("thisComp.layer(" + layer.index + ").toComp([rect.left, rect.top])");
    topLeftPoint = tempNull.transform.position.valueAtTime(targetTime, false);
    tempNull.transform.position.expression = expressionBase + ("thisComp.layer(" + layer.index + ").toComp([rect.left + rect.width, rect.top + rect.height])");
    bottomRightPoint = tempNull.transform.position.valueAtTime(targetTime, false);
    tempNull.remove();
    return rect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };

  return NFLayer;

})();

NFLayer = Object.assign(NFLayer, {

  /**
  Class Method: Returns a new Specialized NFLayer from an AVLayer
  @memberof NFLayer
  @param {AVLayer} theLayer - the AVLayer to use
  @returns {NFLayer | NFHighlightLayer | NFPageLayer | NFEmphasisLayer | NFGaussyLayer | NFImageLayer} the specialized layer
   */
  getSpecializedLayerFromAVLayer: function(theLayer) {
    var tmpLayer;
    if (!theLayer.isAVLayer()) {
      throw "Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer";
    }
    tmpLayer = new NFLayer(theLayer);
    return tmpLayer.getSpecializedLayer();
  },

  /**
  Class Method: Returns true if the given AVLayer is a comp layer
  @memberof NFLayer
  @param {AVLayer} theLayer - the AVLayer to check
  @returns {boolean} whether or not the AVLayer is a comp
   */
  isCompLayer: function(theLayer) {
    return theLayer.isAVLayer() && theLayer.source instanceof CompItem;
  }
});


/**
Creates a new NFLayerCollection from an array of [NFLayers]{@link NFLayer}
@class NFLayerCollection
@classdesc NF Wrapper object for a Array that contains NFLayers
@param {Array | LayerCollection | NFLayerCollection} layerArr - the array with [NFLayers]{@link NFLayer}
or an Adobe LayerCollection or an NFLayerCollection to initialize the collection with
@property {Array} layers - the array of [NFLayers]{@link NFLayer} in the collection
@throws Will throw an error if array contains non-{@link NFLayer} objects
 */
var NFLayerCollection;

NFLayerCollection = (function() {
  function NFLayerCollection(layerArr) {
    var expectingAVLayers, expectingNFLayers, j, layer, len, newArray, newLayer, theLayer;
    this.layers = layerArr != null ? layerArr : [];
    if (layerArr != null) {
      if (layerArr instanceof LayerCollection) {
        layerArr = layerArr.toArr();
      }
      if (layerArr instanceof NFLayerCollection) {
        layerArr = layerArr.layers;
      }
      expectingAVLayers = false;
      expectingNFLayers = false;
      for (j = 0, len = layerArr.length; j < len; j++) {
        theLayer = layerArr[j];
        if (theLayer.isAVLayer()) {
          if (expectingNFLayers) {
            throw "You can't initialize NFLayerCollection with a mix of AVLayers and NFLayers";
          }
          expectingAVLayers = true;
        } else if (theLayer instanceof NFLayer) {
          if (expectingAVLayers) {
            throw "You can't initialize NFLayerCollection with a mix of AVLayers and NFLayers";
          }
          expectingNFLayers = true;
        } else {
          throw "You can only add NFLayers or AVLayers to an NFLayerCollection";
        }
      }
      newArray = (function() {
        var k, len1, results;
        results = [];
        for (k = 0, len1 = layerArr.length; k < len1; k++) {
          layer = layerArr[k];
          if (expectingAVLayers) {
            newLayer = new NFLayer(layer);
          } else {
            newLayer = layer;
          }
          results.push(newLayer.getSpecializedLayer());
        }
        return results;
      })();
      this.layers = newArray;
    }
    this;
  }

  NFLayerCollection.prototype.toString = function() {
    var infoString, j, len, ref, theLayer;
    infoString = "NFLayerCollection: [";
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      infoString += theLayer.toString() + ", ";
    }
    return infoString += "]";
  };


  /**
  Adds an NFLayer or AVLayer to this collection. AVLayers will be added as specialized layers
  @memberof NFLayerCollection
  @param {NFLayer | AVLayer} newLayer - the layer to add
  @returns {NFLayerCollection} self
   */

  NFLayerCollection.prototype.addLayer = function(newLayer) {
    if (newLayer instanceof NFLayer) {
      this.layers.push(newLayer);
    } else if (newLayer.isAVLayer()) {
      this.layers.push(NFLayer.getSpecializedLayerFromAVLayer(newLayer));
    } else {
      throw "You can only add NFLayers or AVLayers to an NFLayerCollection";
    }
    return this;
  };


  /**
  Returns true if the collection only contains NFPageLayers and no other types of NFLayers
  @memberof NFLayerCollection
  @returns {boolean} if the layers in this collection are all {@link NFPageLayer} objects
   */

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


  /**
  Returns true if the given layer is in the collection
  @memberof NFLayerCollection
  @param {NFLayer} testLayer - the layer to check
  @returns {boolean} if the layer is in the collection
   */

  NFLayerCollection.prototype.containsLayer = function(testLayer) {
    var j, len, ref, theLayer;
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (theLayer.is(testLayer)) {
        return true;
      }
    }
    return false;
  };


  /**
  Returns true if the layers in the collection are all in the same comp
  @memberof NFLayerCollection
  @returns {boolean} if the layers in this collection are all in the same containing comp
   */

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


  /**
  Returns the containing comp for the layers, or null if #inSameComp is false
  @memberof NFLayerCollection
  @returns {NFComp | null} the containing comp
   */

  NFLayerCollection.prototype.containingComp = function() {
    if (this.inSameComp() && !this.isEmpty()) {
      return this.layers[0].containingComp();
    }
    return null;
  };


  /**
  Returns a new NFPageLayerCollection from this collection. Only call if you know
  this collection only contains NFPageLayers
  @memberof NFLayerCollection
  @returns {NFPageLayerCollection} the new collection
   */

  NFLayerCollection.prototype.getPageLayerCollection = function() {
    return new NFPageLayerCollection(this.layers);
  };


  /**
  Shortcut to access the number of layers in the collection
  @memberof NFLayerCollection
  @returns {int} the number of layers in the collection
   */

  NFLayerCollection.prototype.count = function() {
    return this.layers.length;
  };


  /**
  True if the collection is empty
  @memberof NFLayerCollection
  @returns {boolean} whether or not the collection is empty
   */

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
      if (layer.is(layerToRemove)) {
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
    var newNull, topLayer;
    if (!this.inSameComp()) {
      throw "Cannot nullify layers in different compositions at the same time";
    }
    if (this.isEmpty()) {
      throw "Cannot nullify without a given layer";
    }
    newNull = this.containingComp().addNull();
    this.setParents(newNull);
    topLayer = this.getTopmostLayer();
    newNull.moveBefore(topLayer.layer);
    return newNull;
  };

  return NFLayerCollection;

})();


/**
Creates a new NFPDF from a given array of pages
@class NFPDF
@classdesc NF Wrapper object for a group of NFPageComps
@param {NFPageComp[]} pageArr - an array of NFPageComps
@property {NFPageComp[]} pages - the array ofitems
@throws Throws error if one object in the array is not an NFPageComp
 */
var NFPDF;

NFPDF = (function() {
  function NFPDF(pageArr) {
    var i, len, newArr, page;
    pageArr = pageArr != null ? pageArr : [];
    if (pageArr.length > 0) {
      newArr = [];
      for (i = 0, len = pageArr.length; i < len; i++) {
        page = pageArr[i];
        if (page instanceof CompItem) {
          newArr.push(new NFPageComp(page));
        } else if (page instanceof NFPageComp) {
          newArr.push(page);
        } else {
          throw "You can only add NFPageComps to an NFPDF";
        }
      }
    }
    this.pages = newArr;
  }

  NFPDF.prototype.toString = function() {
    return "NFPDF: " + this.getPDFNumber;
  };


  /**
  Adds an NFPageComp to the PDF
  @memberof NFPDF
  @param {NFPageComp} newPage - the page to add
  @throws Throws error if you try to add a non-NFPageComp
  @returns {NFPDF} self
   */

  NFPDF.prototype.addNFPageComp = function(newPage) {
    if (newPage instanceof NFPageComp) {
      this.pages.push(newPage);
    } else if (newPage instanceof CompItem) {
      this.pages.push(new NFPageComp(newPage));
    } else {
      throw "You can only add NFPageComps to an NFPDF";
    }
    return this;
  };


  /**
  Returns a general use name for the PDF
  @memberof NFPDF
  @returns {string} the PDF name
   */

  NFPDF.prototype.getName = function() {
    return 'PDF ' + this.getPDFNumber();
  };


  /**
  Returns the PDF Number as a string
  @memberof NFPDF
  @returns {string} the PDF Number
  @throws Throws error if no PDF number (if this object is empty)
   */

  NFPDF.prototype.getPDFNumber = function() {
    if (this.pages.length === 0) {
      throw "NO PDF number";
    }
    return this.pages[0].getPDFNumber();
  };


  /**
  Looks for a highlight layer in the PDF
  @memberof NFPDF
  @param {string} name - the name of the highlight layer
  @returns {NFHighlightLayer | null} the found highlight or null
   */

  NFPDF.prototype.findHighlight = function(name) {
    var highlight, i, len, page, ref;
    ref = this.pages;
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      highlight = page.highlightWithName(name);
      if (highlight != null) {
        return highlight;
      }
    }
    return null;
  };


  /**
  Returns an arrayof part comps this PDF can be found in
  @memberof NFPDF
  @returns {NFPartComp[]} An array of part comps this PDF is in
   */

  NFPDF.prototype.containingPartComps = function() {
    var containingParts, folder, i, item, items, len, part;
    folder = NFProject.findItem("Parts");
    items = NFProject.searchItems("Part", folder);
    containingParts = [];
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      part = new NFPartComp(item);
      if (part.layerWithName(this.getName()) != null) {
        containingParts.push(part);
      }
    }
    return containingParts;
  };


  /**
  Returns the title page of the PDF
  @memberof NFPDF
  @returns {NFPageComp} The page in the PDF with the lowest page number
   */

  NFPDF.prototype.getTitlePage = function() {
    var count, i, len, lowestNum, lowestPage, page, ref, thisNum;
    count = this.pages.length;
    if (count === 0) {
      throw "Can't get the title page because there are no pages";
    } else if (count === 1) {
      return this.pages[0];
    } else {
      lowestPage = null;
      lowestNum = parseInt(this.pages[0].getPageNumber());
      ref = this.pages;
      for (i = 0, len = ref.length; i < len; i++) {
        page = ref[i];
        thisNum = parseInt(page.getPageNumber());
        if (thisNum <= lowestNum) {
          lowestPage = page;
        }
      }
      return lowestPage;
    }
  };

  return NFPDF;

})();

NFPDF = Object.assign(NFPDF, {

  /**
  Gets a new PDF object from a given page layer
  @memberof NFPDF
  @param {pageLayer} NFPageLayer - the page layer
  @returns {NFPDF} the new NFPDF
  @throws throws error if not given an NFPageLayer
   */
  fromPageLayer: function(pageLayer) {
    if (!(pageLayer instanceof NFPageLayer)) {
      throw "Can't make an NFPDF using fromPageLayer() without a NFPageLayer...";
    }
    return NFPDF.fromPDFNumber(pageLayer.getPDFNumber());
  },

  /**
  Gets a new PDF object from a given PDF Number string
  @memberof NFPDF
  @param {string} theNumber - the PDF Number
  @returns {NFPDF} the new NFPDF
  @throws throws error if cannot find the pages for the given number
   */
  fromPDFNumber: function(theNumber) {
    var folder, items;
    folder = NFProject.findItem("PDF Precomps");
    items = NFProject.searchItems(theNumber + "_", folder);
    if (items.length === 0) {
      throw "Cannot find PDF pages for the given number: '" + theNumber + "'";
    }
    return new NFPDF(items);
  }
});


/**
Creates a new NFPaperLayerGroup from an NFPaperParentLayer
@class NFPaperLayerGroup
@classdesc An object that manages and manipulates a group of layers that are part of the same PDF
@param {NFPaperParentLayer} paperParent - the NFPaperParentLayer to create the group with
@property {NFPaperParentLayer} paperParent - the NFPaperParentLayer for the group
@throws Will throw an error if not created with a valid NFPaperParentLayer object
 */
var NFPaperLayerGroup;

NFPaperLayerGroup = (function() {
  function NFPaperLayerGroup(paperParent) {
    this.paperParent = paperParent;
    if (!(this.paperParent instanceof NFPaperParentLayer)) {
      throw "Not a valid paper parent";
    }
  }

  NFPaperLayerGroup.prototype.toString = function() {
    return "NFPaperLayerGroup: " + paperParent.layer.name;
  };


  /**
  Gets all the NFLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the layers
   */

  NFPaperLayerGroup.prototype.getChildren = function() {
    return this.paperParent.getChildren();
  };


  /**
  Gets all the NFPageLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFPageLayerCollection} the page layers
   */

  NFPaperLayerGroup.prototype.getPages = function() {
    var allChildren, i, layer, len, pageChildren, ref;
    allChildren = this.getChildren();
    pageChildren = new NFPageLayerCollection();
    ref = allChildren.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer instanceof NFPageLayer) {
        pageChildren.addLayer(layer);
      }
    }
    return pageChildren;
  };


  /**
  Moves the given layers into the group and parents if indicated. Layers below
  the bottommost layer in the group will go at the bottom, and layers above the
  parent will go immediately below it.
  @memberof NFPaperLayerGroup
  @param {NFLayerCollection} layersToGather - the layers to gather up
  @param {boolean} [shouldParent=true] - whether or not to parent the new layers
  to the paper parent
  @returns {NFPaperLayerGroup} self
   */

  NFPaperLayerGroup.prototype.gatherLayers = function(layersToGather, shouldParent) {
    var bottomLayer, childLayers, i, layer, layersAboveGroup, layersBelowGroup, len, ref, topLayer;
    if (shouldParent == null) {
      shouldParent = true;
    }
    childLayers = this.getChildren();
    layersAboveGroup = new NFLayerCollection();
    layersBelowGroup = new NFLayerCollection();
    ref = layersToGather.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.index() < this.paperParent.index()) {
        layersAboveGroup.addLayer(layer);
      }
      if (layer.index() > childLayers.getBottommostLayer().index()) {
        layersBelowGroup.addLayer(layer);
      }
    }
    while (layersAboveGroup.count() > 0) {
      bottomLayer = layersAboveGroup.getBottommostLayer();
      bottomLayer.moveAfter(this.paperParent);
      layersAboveGroup.remove(bottomLayer);
    }
    while (layersBelowGroup.count() > 0) {
      topLayer = layersBelowGroup.getTopmostLayer();
      topLayer.moveAfter(childLayers.getBottommostLayer());
      layersBelowGroup.remove(topLayer);
      if (shouldParent) {
        layersToGather.setParents(this.paperParent);
      }
    }
    return this;
  };

  return NFPaperLayerGroup;

})();


/**
Creates a new NFCitationLayer from a given AVLayer or NFLayer
@class NFCitationLayer
@classdesc Subclass of {@link NFLayer} for a citation layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
 */
var NFCitationLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFCitationLayer = (function(superClass) {
  extend(NFCitationLayer, superClass);

  function NFCitationLayer(layer) {
    NFLayer.call(this, layer);
    this;
  }

  NFCitationLayer.prototype.toString = function() {
    return "NFCitationLayer: '" + this.layer.name + "'";
  };

  return NFCitationLayer;

})(NFLayer);


/**
Creates a new NFEmphasisLayer from a given AVLayer
@class NFEmphasisLayer
@classdesc Subclass of {@link NFLayer} for an emphasis layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
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

  NFEmphasisLayer.prototype.toString = function() {
    return "NFEmphasisLayer: '" + this.layer.name + "'";
  };

  return NFEmphasisLayer;

})(NFLayer);


/**
Creates a new NFGaussyLayer from a given AVLayer
@class NFGaussyLayer
@classdesc Subclass of {@link NFLayer} for a gaussy layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
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

  NFGaussyLayer.prototype.toString = function() {
    return "NFGaussyLayer: '" + this.layer.name + "'";
  };

  return NFGaussyLayer;

})(NFLayer);


/**
Creates a new NFHighlightLayer from a given AVLayer
@class NFHighlightLayer
@classdesc Subclass of {@link NFLayer} for a highlight layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a highlight
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
    this;
  }

  NFHighlightLayer.prototype.toString = function() {
    return "NFHighlightLayer: '" + this.layer.name + "'";
  };


  /**
  Returns whether this highlight is bubbled up or not
  @memberof NFHighlightLayer
  @returns {boolean} if the highlight is bubbled up
   */

  NFHighlightLayer.prototype.isBubbled = function() {
    return this.highlighterEffect().property("Spacing").expressionEnabled;
  };


  /**
  Returns whether this highlight is has a broken expression
  @memberof NFHighlightLayer
  @returns {boolean} if the highlight has a broken expression
   */

  NFHighlightLayer.prototype.isBroken = function() {
    return this.highlighterEffect().property("Spacing").expressionError !== "";
  };


  /**
  Returns the connected NFPageLayer if it exists
  @memberof NFHighlightLayer
  @returns {NFPageLayer | null} the connectedPageLayer or null
   */

  NFHighlightLayer.prototype.getConnectedPageLayer = function() {
    var comp, compName, connectedPageLayer, expression, layer, layerName;
    if (this.isBubbled()) {
      expression = this.highlighterEffect().property("Spacing").expression;
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression);
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression);
      comp = NF.Util.findItem(compName);
      if (comp != null) {
        layer = comp.layer(layerName);
        if (layer != null) {
          return connectedPageLayer = new NFPageLayer(layer);
        }
      }
    }
    return connectedPageLayer;
  };


  /**
  Returns the NFPageComp this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPageComp} the containing page item for the highlight
   */

  NFHighlightLayer.prototype.getPageComp = function() {
    return new NFPageComp(this.layer.containingComp);
  };


  /**
  Returns the NFPDF this highlight lives in
  @memberof NFHighlightLayer
  @returns {NFPDF} the PDF
   */

  NFHighlightLayer.prototype.getPDF = function() {
    return NFPDF.fromPDFNumber(this.containingComp().getPDFNumber());
  };


  /**
  Returns the AV Highlighter effect
  @memberof NFHighlightLayer
  @returns {Property} the AV Highlighter Property for this highlight
   */

  NFHighlightLayer.prototype.highlighterEffect = function() {
    return this.layer.Effects.property("AV_Highlighter");
  };


  /**
  Returns the Bubbled Up AV Highlighter effect on a page layer
  @memberof NFHighlightLayer
  @returns {Property | null} the AV_Highlighter Property on an NFPageLayer if connected, null if not
   */

  NFHighlightLayer.prototype.connectedPageLayerHighlighterEffect = function() {
    var connectedPageLayer, effect, effectName, expression;
    connectedPageLayer = this.getConnectedPageLayer();
    if (connectedPageLayer != null) {
      expression = this.highlighterEffect().property("Spacing").expression;
      effectName = NF.Util.getCleanedArgumentOfPropertyFromExpression("effect", expression);
      effect = connectedPageLayer.effect(effectName);
      return effect;
    }
    return null;
  };


  /**
  Returns true if the highlight can be bubbled up. In other words, true if not currently bubbled up
  unless it's also broken
  @memberof NFHighlightLayer
  @returns {boolean} whether the highlight can be bubbled up
   */

  NFHighlightLayer.prototype.canBubbleUp = function() {
    return (!this.isBubbled()) || this.isBroken();
  };


  /**
  Fixes the expression after initting if the page layer name changed and there was already an existing expression
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
   */

  NFHighlightLayer.prototype.fixExpressionAfterInit = function() {
    var expression, j, len, property, ref;
    if (this.isBubbled()) {
      ref = NF.Util.highlighterProperties;
      for (j = 0, len = ref.length; j < len; j++) {
        property = ref[j];
        expression = this.highlighterEffect().property(property).expression;
        this.highlighterEffect().property(property).expression = expression.replace(new RegExp(" NFPage", 'g'), " [+]");
      }
    }
    return this;
  };


  /**
  Attempt to clear expresssion errors
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
   */

  NFHighlightLayer.prototype.resetExpressionErrors = function() {
    var expression, j, len, property, ref;
    if (this.isBubbled()) {
      ref = NF.Util.highlighterProperties;
      for (j = 0, len = ref.length; j < len; j++) {
        property = ref[j];
        expression = this.highlighterEffect().property(property).expression;
        this.highlighterEffect().property(property).expression = "";
        this.highlighterEffect().property(property).expression = expression;
      }
    }
    return this;
  };


  /**
  Disconnects bubbleups in this highlight layer
  @memberof NFHighlightLayer
  @returns {NFHighlightLayer} self
   */

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
    return this;
  };

  return NFHighlightLayer;

})(NFLayer);

NFHighlightLayer = Object.assign(NFHighlightLayer, {

  /**
  Returns whether or not the given AVLayer is a valid Highlight Layer
  @memberof NFHighlightLayer
  @returns {boolean} whether the AV layer is a valid highlight layer
   */
  isHighlightLayer: function(theLayer) {
    var ref;
    return theLayer instanceof ShapeLayer && ((ref = theLayer.Effects.property(1)) != null ? ref.matchName : void 0) === "AV_Highlighter";
  }
});


/**
Creates a new NFHighlightLayerCollection from a given array of NFHighlightLayers
@class NFHighlightLayerCollection
@classdesc Subclass of {@link NFLayerCollection} for highlight layers
@param {NFHighlightLayer[]} layerArr - array of layers to use
@property {NFHighlightLayer[]} layers - array of layers
@extends NFLayerCollection
@throws Will throw an error if the array does not contain valid highlight layers
 */
var NFHighlightLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFHighlightLayerCollection = (function(superClass) {
  extend(NFHighlightLayerCollection, superClass);

  function NFHighlightLayerCollection(layerArr) {
    var i, len, ref, theLayer;
    NFLayerCollection.call(this, layerArr);
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      if (!(theLayer instanceof NFHighlightLayer)) {
        throw "You can only add NFHighlightLayers to an NFHighlightLayerCollection";
      }
    }
    this;
  }

  NFHighlightLayerCollection.prototype.toString = function() {
    var i, infoString, len, ref, theLayer;
    infoString = "NFHighlightLayerCollection: [";
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      infoString += theLayer.toString() + ", ";
    }
    return infoString += "]";
  };


  /**
  Adds an NFHighlightLayer or AVLayer to this collection
  @memberof NFHighlightLayerCollection
  @param {NFHighlightLayer | AVLayer} newLayer - the layer to add to this collection
  @override
  @returns {NFHighlightLayerCollection} self
  @throws Throws error if not given an NFHighlightLayer or valid highlight AVLayer (ShapeLayer)
   */

  NFHighlightLayerCollection.prototype.addLayer = function(newLayer) {
    if (newLayer.isAVLayer()) {
      this.layers.push(new NFHighlightLayer(newLayer));
    } else if (newLayer instanceof NFHighlightLayer) {
      this.layers.push(newLayer);
    } else {
      throw "addLayer() can only be used to add AVLayers or NFHighlightLayers to an NFHighlightLayerCollection";
    }
    return this;
  };


  /**
  Always returns false since this object cannot contain page layers
  @memberof NFHighlightLayerCollection
  @override
  @returns {boolean} false
   */

  NFHighlightLayerCollection.prototype.onlyContainsPageLayers = function() {
    return false;
  };


  /**
  Checks to see if any highlights in the collection share the same name
  @memberof NFHighlightLayerCollection
  @returns {boolean} whether or not any highlights in the collection share the same name
   */

  NFHighlightLayerCollection.prototype.duplicateNames = function() {
    var i, len, nameArr, ref, theLayer;
    nameArr = [];
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      nameArr.push(theLayer.getName());
    }
    return NF.Util.hasDuplicates(nameArr);
  };


  /**
  Disconnect all highlights in all layers
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
   */

  NFHighlightLayerCollection.prototype.disconnectHighlights = function() {
    var highlight, i, len, ref;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      highlight.disconnect();
    }
    return this;
  };


  /**
  Returns a new NFHighlightLayerCollection with all the highlights for a given page item
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} the new collection
  @param {NFPageComp} page - the page the resulting highlights are in
  @throws Throw error if page is not an NFPageComp
   */

  NFHighlightLayerCollection.prototype.getHighlightsInPage = function(page) {
    var highlight, highlightsInPage, i, len, ref;
    if (!(page instanceof NFPageComp)) {
      throw "Can't getHighlightsInPage() when not given an NFPageComp";
    }
    highlightsInPage = new NFHighlightLayerCollection();
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      if (highlight.getPageComp().is(page)) {
        highlightsInPage.addLayer(highlight);
      }
    }
    return highlightsInPage;
  };


  /**
  Reset expression error status for all highlights. This is to be called after #fixExpressionAfterInit.
  Because of the way AE handles scripting, if a script breaks an expression, then even if it fixes it,
  the expression error will be there when the script finishes. This just clears that. If there's still
  an expression error after the script finishes, that'll still appear.
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
   */

  NFHighlightLayerCollection.prototype.resetExpressionErrors = function() {
    var highlight, i, len, ref;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      highlight.resetExpressionErrors();
    }
    return this;
  };


  /**
  Updates the expressions on highlights to account for the new name of the layer after being
  initialized. Call #resetExpressionErrors after this to prevent incorrect error warnings.
  @memberof NFHighlightLayerCollection
  @returns {NFHighlightLayerCollection} self
   */

  NFHighlightLayerCollection.prototype.fixExpressionsAfterInit = function() {
    var highlight, i, len, ref, results;
    ref = this.layers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      results.push(highlight.fixExpressionAfterInit());
    }
    return results;
  };

  return NFHighlightLayerCollection;

})(NFLayerCollection);


/**
Creates a new NFImageLayer from a given AVLayer
@class NFImageLayer
@classdesc Subclass of {@link NFLayer} for an image layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
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

  NFImageLayer.prototype.toString = function() {
    return "NFImageLayer: '" + this.layer.name + "'";
  };

  return NFImageLayer;

})(NFLayer);


/**
Creates a new NFPageComp from a given CompItem
@class NFPageComp
@classdesc NF Wrapper object for a page CompItem
@extends NFComp
@param {CompItem} comp - the CompItem to wrap
@property {CompItem} comp - the CompItem
 */
var NFPageComp,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPageComp = (function(superClass) {
  extend(NFPageComp, superClass);

  function NFPageComp(comp) {
    NFComp.call(this, comp);
    if (!(this.name.indexOf("NFPage") >= 0)) {
      throw "Can't create an NFPageComp from a non-page comp";
    }
    this;
  }

  NFPageComp.prototype.toString = function() {
    return "NFPageComp: '" + this.name + "'";
  };


  /**
  Returns the PDF number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the PDF number
   */

  NFPageComp.prototype.getPDFNumber = function() {
    var endIdx;
    endIdx = this.name.indexOf("_");
    if (endIdx > 0) {
      return this.name.substr(0, endIdx);
    }
    throw "Could not get the PDF Number from this NFPageComp";
  };


  /**
  Returns the page number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the page number
   */

  NFPageComp.prototype.getPageNumber = function() {
    var searchIndex;
    searchIndex = this.name.indexOf("pg");
    if (searchIndex > 0) {
      return this.name.substr(searchIndex + 2, 2);
    }
    throw "Could not get the Page Number from this NFPageComp";
  };


  /**
  Gets the Highlight layers in this item
  @memberof NFPageComp
  @returns {NFHighlightLayerCollection} highlight layers in this pageComp
   */

  NFPageComp.prototype.highlights = function() {
    var highlightLayers, i, len, sourceLayers, theLayer;
    sourceLayers = NF.Util.collectionToArray(this.comp.layers);
    highlightLayers = new NFHighlightLayerCollection();
    for (i = 0, len = sourceLayers.length; i < len; i++) {
      theLayer = sourceLayers[i];
      if (NFHighlightLayer.isHighlightLayer(theLayer)) {
        highlightLayers.addLayer(theLayer);
      }
    }
    return highlightLayers;
  };


  /**
  Returns the NFHighlight with a given name in this comp, or null if none found
  @memberof NFPageComp
  @param {string} name - the name to search for
  @returns {NFHighlightLayer | null} The found highlight or null
   */

  NFPageComp.prototype.highlightWithName = function(name) {
    var highlight, i, len, ref;
    ref = this.highlights().layers;
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      if (highlight.getName() === name) {
        return highlight;
      }
    }
    return null;
  };

  return NFPageComp;

})(NFComp);


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
    this.pageComp = new NFPageComp(layer.source);
    this;
  }

  NFPageLayer.prototype.toString = function() {
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
  Gets the comp this layer is in
  @memberof NFPageLayer
  @override
  @returns {NFComp} The containing Comp
   */

  NFPageLayer.prototype.containingComp = function() {
    return new NFComp(this.layer.containingComp);
  };


  /**
  Returns the pageComp for this layer
  @memberof NFPageLayer
  @returns {NFPageComp} The page item
   */

  NFPageLayer.prototype.getPageComp = function() {
    return this.pageComp;
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


  /**
  Returns NFHighlightLayerCollection of all highlights in this page
  @memberof NFPageLayer
  @returns {NFHighlightLayerCollection} The collection of highlights
   */

  NFPageLayer.prototype.highlights = function() {
    return this.pageComp.highlights();
  };


  /**
  Returns NFHighlightLayerCollection of all highlights bubbled onto this page layer
  @memberof NFPageLayer
  @returns {NFHighlightLayerCollection} The collection of highlights
   */

  NFPageLayer.prototype.bubbledHighlights = function() {
    var bubbledHighlights, highlight, i, len, ref, ref1;
    bubbledHighlights = [];
    ref = this.highlights().layers;
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      if (highlight.isBubbled() && ((ref1 = highlight.getConnectedPageLayer()) != null ? ref1.is(this) : void 0)) {
        bubbledHighlights.push(highlight);
      }
    }
    return new NFHighlightLayerCollection(bubbledHighlights);
  };


  /**
  Bubbles up given highlights or highlight to this layer.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {NFHighlightLayer | NFHighlightLayerCollection}
  @throws Throw error if any highlight choices are connected and not broken,
  so you should have disconnected them first
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
   */

  NFPageLayer.prototype.bubbleUp = function(highlightsToBubble) {
    var highlight, highlighterProperty, i, j, len, len1, ref, ref1, sourceEffect, sourceExpression, sourceValue, targetComp, targetHighlighterEffect, targetPageLayerEffects;
    if (highlightsToBubble instanceof NFHighlightLayer) {
      highlightsToBubble = new NFHighlightLayerCollection([highlightsToBubble]);
    }
    if (!highlightsToBubble.isEmpty()) {
      ref = highlightsToBubble.layers;
      for (i = 0, len = ref.length; i < len; i++) {
        highlight = ref[i];
        if (!highlight.canBubbleUp()) {
          throw "Cannot bubble highlight if already connected and not broken. Disconnect first";
        }
        if (!this.getPageComp().is(highlight.getPageComp())) {
          throw "Cannot bubble highlight because it is not in this page!";
        }
        targetPageLayerEffects = this.effects();
        sourceEffect = highlight.highlighterEffect();
        targetHighlighterEffect = targetPageLayerEffects.addProperty('AV_Highlighter');
        targetHighlighterEffect.name = highlight.layer.name;
        targetComp = this.containingComp();
        ref1 = NF.Util.highlighterProperties;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          highlighterProperty = ref1[j];
          sourceValue = sourceEffect.property(highlighterProperty).value;
          targetHighlighterEffect.property(highlighterProperty).setValue(sourceValue);
          sourceExpression = "var offsetTime = comp(\"" + targetComp.comp.name + "\").layer(\"" + this.layer.name + "\").startTime; comp(\"" + targetComp.comp.name + "\").layer(\"" + this.layer.name + "\").effect(\"" + (highlight.getName()) + "\")(\"" + highlighterProperty + "\").valueAtTime(time+offsetTime)";
          sourceEffect.property(highlighterProperty).expression = sourceExpression;
        }
      }
    }
    return this;
  };


  /**
  Returns whether or not the page has been initted with the below methods
  @memberof NFPageLayer
  @returns {boolean} the init state
   */

  NFPageLayer.prototype.isInitted = function() {
    return this.layer.name.indexOf("[+]") >= 0;
  };


  /**
  Changes the page name to mark the page layer as initted, and updates bubbled highlights
  @memberof NFPageLayer
  @returns {NFPageLayer} self
   */

  NFPageLayer.prototype.markInitted = function() {
    var bubbledHighlights;
    if (!this.isInitted()) {
      bubbledHighlights = this.bubbledHighlights();
      if (bubbledHighlights.count() > 0) {
        bubbledHighlights.fixExpressionsAfterInit();
      }
      this.layer.name = this.layer.name.replace(" NFPage", " [+]");
      bubbledHighlights.resetExpressionErrors();
    }
    return this;
  };


  /**
  Adds the non-transform init properties (dropshadow, motion blur, etc)
  @memberof NFPageLayer
  @returns {NFPageLayer} self
   */

  NFPageLayer.prototype.init = function() {
    this.layer.motionBlur = true;
    this.setDropShadow();
    this.markInitted();
    return this;
  };


  /**
  Sets the drop shadow for the layer
  @memberof NFPageLayer
  @returns {NFPageLayer} self
   */

  NFPageLayer.prototype.setDropShadow = function() {
    var ref, shadowProp;
    shadowProp = (ref = this.effects().property('ADBE Drop Shadow')) != null ? ref : this.effects().addProperty('ADBE Drop Shadow');
    shadowProp.property('Opacity').setValue(191.25);
    shadowProp.property('Direction').setValue(0);
    shadowProp.property('Distance').setValue(20);
    shadowProp.property('Softness').setValue(300);
    return this;
  };


  /**
  Adds the transform init properties (size, position)
  @memberof NFPageLayer
  @returns {NFPageLayer} self
   */

  NFPageLayer.prototype.initTransforms = function() {
    this.setInitSize();
    this.setInitPosition();
    return this;
  };


  /**
  Sets the size of the layer to the Init size. Returns false and doesn't set size if there are existing keyframes
  @memberof NFPageLayer
  @returns {boolean} whether or not the size was updated
   */

  NFPageLayer.prototype.setInitSize = function() {
    if (this.layer.property('Transform').property('Scale').numKeys > 0) {
      return false;
    }
    this.layer.property('Transform').property('Scale').setValue([50, 50, 50]);
    return true;
  };


  /**
  Sets the position of the layer to the Init position. Returns false and doesn't set position if there are existing keyframes
  @memberof NFPageLayer
  @returns {boolean} whether or not the position was updated
   */

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


  /**
  Returns the PDF number as a String
  @memberof NFPageLayer
  @returns {string} the PDF number of the page
   */

  NFPageLayer.prototype.getPDFNumber = function() {
    return this.pageComp.getPDFNumber();
  };


  /**
  Returns the page number as a String
  @memberof NFPageLayer
  @returns {string} the page number of the page
   */

  NFPageLayer.prototype.getPageNumber = function() {
    return this.pageComp.getPageNumber();
  };


  /**
  Returns the NFPDF object for this layer
  @memberof NFPageLayer
  @returns {NFPDF} the PDF object for the page
   */

  NFPageLayer.prototype.getPDF = function() {
    return NFPDF.fromPageLayer(this);
  };


  /**
  Returns the source rect of this layer's 'full top' frame.
  @memberof NFPageLayer
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
   */

  NFPageLayer.prototype.sourceRectForFullTop = function() {
    var rect;
    return rect = {
      left: 0,
      top: 0,
      width: this.layer.source.width,
      height: this.containingComp().comp.height,
      padding: 0
    };
  };


  /**
  Returns the source rect of a given highlight relative to this layer's
  parent comp.
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
  @throws Throw error if highlight is not in page
   */

  NFPageLayer.prototype.sourceRectForHighlight = function(highlight) {
    if (!this.containsHighlight(highlight)) {
      throw "Can't get source rect for this highlight since it's not in the layer";
    }
    return this.sourceRectForLayer(highlight);
  };


  /**
  Returns whether a given highlight is in this layer
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
   */

  NFPageLayer.prototype.containsHighlight = function(highlight) {
    var i, len, ref, testHighlight;
    ref = this.highlights().layers;
    for (i = 0, len = ref.length; i < len; i++) {
      testHighlight = ref[i];
      if (testHighlight.is(highlight)) {
        return true;
      }
    }
    return false;
  };


  /**
  Returns the page turn status at the current time
  @memberof NFPageLayer
  @param {float} [time=Current Time] - the time to check the status at
  @returns {ENUM} the page turn status (found in NFPageLayer)
   */

  NFPageLayer.prototype.pageTurnStatus = function(time) {
    var foldPosition, foldPositionProperty, pageTurnEffect, threshold;
    if (time == null) {
      time = this.containingComp().getTime();
    }
    pageTurnEffect = this.effect("CC Page Turn");
    foldPositionProperty = pageTurnEffect != null ? pageTurnEffect.property("Fold Position") : void 0;
    foldPosition = foldPositionProperty != null ? foldPositionProperty.valueAtTime(time) : void 0;
    threshold = 3840;
    if (pageTurnEffect == null) {
      return NFPageLayer.PAGETURN_NONE;
    } else if (foldPosition[0] >= threshold) {
      return NFPageLayer.PAGETURN_FLIPPED_DOWN;
    } else if (foldPosition[0] <= threshold * -1) {
      return NFPageLayer.PAGETURN_FLIPPED_UP;
    } else if (foldPositionProperty.numKeys !== 0) {
      return NFPageLayer.PAGETURN_TURNING;
    } else {
      return NFPageLayer.PAGETURN_BROKEN;
    }
  };


  /**
  Checks for an existing valid paper parent layer for this page. Sets it as
  the parent if it exists, otherwise creates a new one and parents it to
  the zoomer.
  @memberof NFPageLayer
  @returns {NFPaperParentLayer} the paper parent layer
  @param {boolean} [shouldMove=false] - whether or not the layer should move below its parent
   */

  NFPageLayer.prototype.assignPaperParentLayer = function(shouldMove) {
    var paperLayerGroup, paperParentLayer;
    if (shouldMove == null) {
      shouldMove = false;
    }
    paperParentLayer = this.findPaperParentLayer();
    if (paperParentLayer != null) {
      this.setParent(paperParentLayer);
      if (shouldMove) {
        paperLayerGroup = new NFPaperLayerGroup(paperParentLayer);
        paperLayerGroup.gatherLayers(this);
      }
    } else {
      paperParentLayer = new NFPaperParentLayer(this.nullify()).setName();
      paperParentLayer.setZoomer();
    }
    return paperParentLayer;
  };


  /**
  Slides in the pageLayer using markers. Overrides existing markers!!!
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.fromEdge=NFComp.RIGHT] - The direction to slide in from.
  Default is the right.
   */

  NFPageLayer.prototype.slideIn = function(model) {
    var positionProperty, slider;
    if (model == null) {
      model = [];
    }
    if (model.fromEdge == null) {
      model.fromEdge = NFComp.RIGHT;
    }
    positionProperty = this.layer.property("Transform").property("Position");
    slider = this.addSlider("Start Offset", 3000);
    this.addInOutMarkersForProperty({
      property: positionProperty,
      startEquation: NF.Util.easingEquations.out_quint,
      startValue: [slider.property("Slider"), positionProperty.value[1], positionProperty.value[2]]
    });
    return this;
  };


  /**
  Animates a page turn, essentially toggling the current page turn status.
  Throws an error if the page is not all the way up or down at the start time.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {float} [model.time=The current time] - The time to start the turn at
  @param {float} [model.duration=1.5] - The duration of the pageturn
  @param {boolean} [model.trim] - Trim the layer after the turn is complete.
  Defaults to YES if we're folding up, and NO if we're folding down.
   */

  NFPageLayer.prototype.animatePageTurn = function(model) {
    var downPosition, dropShadowEffect, dropShadowMatchName, endStatus, endTime, foldPosition, forceMotionBlurEffect, forceMotionBlurMatchName, pageSize, pageTurnEffect, pageTurnMatchName, positions, startStatus, startTime, targetStatus, times, upPosition;
    if (model == null) {
      model = [];
    }
    if (model.time == null) {
      model.time = this.containingComp().getTime();
    }
    if (model.duration == null) {
      model.duration = 1.5;
    }
    startTime = model.time;
    endTime = startTime + model.duration;
    startStatus = this.pageTurnStatus(startTime);
    endStatus = this.pageTurnStatus(endTime);
    if (startStatus === NFPageLayer.PAGETURN_NONE) {
      forceMotionBlurMatchName = "CC Force Motion Blur";
      dropShadowMatchName = "ADBE Drop Shadow";
      pageTurnMatchName = "CC Page Turn";
      pageTurnEffect = this.effect(pageTurnMatchName);
      if (pageTurnEffect == null) {
        pageTurnEffect = this.effects().addProperty(pageTurnMatchName);
        pageTurnEffect.property("Fold Radius").setValue(500);
      }
      forceMotionBlurEffect = this.effect(forceMotionBlurMatchName);
      if (forceMotionBlurEffect == null) {
        forceMotionBlurEffect = this.effects().addProperty(forceMotionBlurMatchName);
        forceMotionBlurEffect.property("Override Shutter Angle").setValue(0);
      }
      dropShadowEffect = this.effect(dropShadowMatchName);
      if (dropShadowEffect != null) {
        dropShadowEffect.remove();
      }
      dropShadowEffect = this.effects().addProperty(dropShadowMatchName);
      dropShadowEffect.property("Opacity").setValue(0.75 * 255);
      dropShadowEffect.property("Direction").setValue(125);
      dropShadowEffect.property("Distance").setValue(20);
      dropShadowEffect.property("Softness").setValue(300);
    }
    if (startStatus === NFPageLayer.PAGETURN_BROKEN) {
      throw "Page turn keyframes seem broken...";
    }
    if (startStatus === NFPageLayer.PAGETURN_TURNING || endStatus === NFPageLayer.PAGETURN_TURNING) {
      throw "Page is already turning at start or end time of new turn";
    }
    pageSize = {
      width: this.getPageComp().comp.width,
      height: this.getPageComp().comp.height
    };
    downPosition = [pageSize.width, pageSize.height];
    upPosition = [-pageSize.width, -pageSize.height];
    positions = [downPosition, upPosition];
    if (startStatus === NFPageLayer.PAGETURN_FLIPPED_UP) {
      targetStatus = NFPageLayer.PAGETURN_FLIPPED_DOWN;
    } else if (startStatus === NFPageLayer.PAGETURN_FLIPPED_DOWN) {
      targetStatus = NFPageLayer.PAGETURN_FLIPPED_UP;
    }
    if (targetStatus === NFPageLayer.PAGETURN_FLIPPED_DOWN) {
      positions.reverse();
      if (model.trim == null) {
        model.trim = false;
      }
    }
    times = [startTime, endTime];
    foldPosition = this.effect("CC Page Turn").property("Fold Position");
    foldPosition.setValuesAtTimes(times, positions);
    foldPosition.easyEaseKeyTimes({
      keyTimes: times
    });
    if (model.trim !== false) {
      this.layer.outPoint = endTime;
    }
    return this;
  };

  return NFPageLayer;

})(NFLayer);

NFPageLayer = Object.assign(NFPageLayer, {

  /**
  Returns true if the given AVLayer is a Page Layer
  @memberof NFPageLayer
  @param {AVLayer} theLayer - the layer to test
  @returns {boolean} if the given layer is a page layer
   */
  isPageLayer: function(theLayer) {
    return NFLayer.isCompLayer(theLayer) && theLayer.source.name.indexOf("NFPage") >= 0;
  },
  PAGETURN_FLIPPED_UP: 100,
  PAGETURN_FLIPPED_DOWN: 200,
  PAGETURN_TURNING: 300,
  PAGETURN_NONE: 400,
  PAGETURN_BROKEN: 500
});


/**
Creates a new NFPageLayerCollection from a given array of NFPageLayers
@class NFPageLayerCollection
@classdesc Subclass of {@link NFLayerCollection} for page layers
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
    var i, len, ref, theLayer;
    NFLayerCollection.call(this, layerArr);
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      if (!(theLayer instanceof NFPageLayer)) {
        throw "You can only add NFPageLayers to an NFPageLayerCollection";
      }
    }
    this;
  }

  NFPageLayerCollection.prototype.toString = function() {
    var i, infoString, len, ref, theLayer;
    infoString = "NFPageLayerCollection: [";
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      infoString += theLayer.toString() + ", ";
    }
    return infoString += "]";
  };


  /**
  Adds an NFLayer or AVLayer to this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  @override
  @param {NFPageLayer | AVLayer} newLayer - the layer to add
  @throws Throw error if not adding a NFPageLayer or an AVLayer that's a valid NFPageLayer
   */

  NFPageLayerCollection.prototype.addLayer = function(newLayer) {
    if (newLayer.isAVLayer()) {
      this.layers.push(new NFPageLayer(newLayer));
    } else if (newLayer instanceof NFPageLayer) {
      this.layers.push(newLayer);
    } else {
      throw "addLayer() can only be used to add AVLayers or NFPageLayers to an NFPageLayerCollection";
    }
    return this;
  };


  /**
  Returns NFHighlightLayerCollection of all highlights in all pages in the collection
  @memberof NFPageLayerCollection
  @returns {NFHighlightLayerCollection} all highlights in all pages in this collection
  @param {AVLayer} newLayer - the layer to add
   */

  NFPageLayerCollection.prototype.highlights = function() {
    var containingLayerArray, highlight, highlightArray, highlights, i, j, len, len1, ref, ref1, theLayer;
    highlightArray = [];
    containingLayerArray = [];
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      theLayer = ref[i];
      if (theLayer instanceof NFPageLayer) {
        ref1 = theLayer.highlights().layers;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          highlight = ref1[j];
          highlightArray.push(highlight);
          containingLayerArray.push(theLayer);
        }
      }
    }
    highlights = new NFHighlightLayerCollection(highlightArray);
    return highlights;
  };


  /**
  Bubbles up the highlights in the given NFHighlightLayerCollection onto the
  page layers in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  @param {NFHighlightLayerCollection} highlightCollection - the highlights to bubble up
   */

  NFPageLayerCollection.prototype.bubbleUpHighlights = function(highlightCollection) {
    var i, layer, len, pageHighlights, ref;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      pageHighlights = highlightCollection.getHighlightsInPage(layer.getPageComp());
      layer.bubbleUp(pageHighlights);
    }
    return this;
  };


  /**
  Returns true if the collection only contains pages from the same PDF
  @memberof NFPageLayerCollection
  @returns {boolean} whether all pages in this collection are from the same PDF
   */

  NFPageLayerCollection.prototype.fromSamePDF = function() {
    var i, layer, len, ref, testNumber;
    if (this.count() === 0) {
      return true;
    }
    testNumber = this.layers[0].getPDFNumber();
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.getPDFNumber() !== testNumber) {
        return false;
      }
    }
    return true;
  };


  /**
  Always returns true. Overrides the function in NFLayerCollection
  @memberof NFPageLayerCollection
  @override
  @returns {boolean} true (because this has to contain only page layers)
   */

  NFPageLayerCollection.prototype.onlyContainsPageLayers = function() {
    return true;
  };


  /**
  Run NFPageLayer#init on every page in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
   */

  NFPageLayerCollection.prototype.initLayers = function() {
    var i, len, page, ref;
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      page.init();
    }
    return this;
  };


  /**
  Run NFPageLayer#initLayerTransforms on every page in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
   */

  NFPageLayerCollection.prototype.initLayerTransforms = function() {
    var i, len, page, ref, results;
    ref = this.layers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      page = ref[i];
      results.push(page.initTransforms());
    }
    return results;
  };


  /**
  Creates a new {@link NFPaperParentLayer} from this collection. probably
  best not to call this directly (use assignPaperParentLayer() instead) unless
  you really know what you're doing...
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
  @param {boolean} [shouldMove=false] - whether or not the layers should move below their parent
  @throws Throw error if this collection is empty
  @throws Throw error if this collection contains layers from different PDFs
   */

  NFPageLayerCollection.prototype.assignPaperParentLayer = function(shouldMove) {
    var paperLayerGroup, paperParentLayer;
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
        paperLayerGroup = new NFPaperLayerGroup(paperParentLayer);
        paperLayerGroup.gatherLayers(this);
      }
    } else {
      paperParentLayer = this.newPaperParentLayer();
    }
    return paperParentLayer;
  };

  return NFPageLayerCollection;

})(NFLayerCollection);


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

  NFPaperParentLayer.prototype.toString = function() {
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
    if (!(this.name.indexOf("Part") >= 0)) {
      throw "Can't create an NFPartComp from a non-part comp";
    }
    this;
  }

  NFPartComp.prototype.toString = function() {
    return "NFPartComp: '" + this.name + "'";
  };


  /**
  Animates to a given highlight, with options.
  @memberof NFPartComp
  @param {Object} model - the model object
  @param {NFHighlightLayer} model.highlight - the highlight to animate to
  @param {float} [model.animationDuration=3] - the length of the move and scale
  @param {float} [model.pageTurnDuration=2] - the length of the pageturn
  @param {float} [model.maxPageScale=115] - the maximum a page will scale
  @param {boolean} [model.skipTitle=false] - whether we should skip going to the
  title page if this PDF is new in the project
  @returns {NFPartComp} self
   */

  NFPartComp.prototype.animateToHighlight = function(model) {
    var containingPartComps, ref, ref1, ref2, ref3, targetPDF, targetPage, targetPageLayer, titlePage, titlePageLayer;
    if (!(model.highlight instanceof NFHighlightLayer)) {
      throw "Can't animate to a highlight because I don't have one...";
    }
    model = {
      highlight: model.highlight,
      duration: (ref = model.animationDuration) != null ? ref : 3,
      pageTurnDuration: (ref1 = model.pageTurnDuration) != null ? ref1 : 2,
      maxPageScale: (ref2 = model.maxPageScale) != null ? ref2 : 115,
      skipTitle: (ref3 = model.skipTitle) != null ? ref3 : false
    };
    targetPDF = model.highlight.getPDF();
    containingPartComps = targetPDF.containingPartComps();
    if (containingPartComps.length === 0) {
      if (model.skipTitle === false) {
        titlePage = targetPDF.getTitlePage();
        titlePageLayer = this.insertPage({
          page: titlePage,
          animate: true
        });
        targetPage = model.highlight.getPageComp();
        if (targetPage.is(titlePage)) {
          titlePageLayer.bubbleUp(model.highlight);
          this.setTime(titlePageLayer.getInMarkerTime());
        } else {
          this.setTime(titlePageLayer.getInMarkerTime() - 0.4);
          targetPageLayer = this.insertPage({
            page: targetPage,
            below: titlePageLayer
          });
          targetPageLayer.bubbleUp(model.highlight);
          titlePageLayer.animatePageTurn();
        }
      } else {
        this;
      }
    } else {
      this;
    }
    return this;
  };


  /**
  Inserts a page at the current time
  @memberof NFPartComp
  @returns {NFPageLayer} the new page layer
  @param {Object} model - the parameters
  @param {NFPageComp} model.page - the page to insert
  @param {boolean} [model.init=yes] - if the page should be initialized
  @param {NFLayer} [model.above] - the layer to insert the page above. Can use
  only one of .above, .below or .at
  @param {NFLayer} [model.below] - the layer to insert the page below. Can use
  only one of .above, .below or .at
  @param {int} [model.at=1] - the index to insert the page at. Can use only
  one of .above, .below or .at
  @param {boolean} [model.animate=no] whether to animate the page in
  @throws Throw error if given values for more than one of .above, .below,
  and .at
   */

  NFPartComp.prototype.insertPage = function(model) {
    var pageLayer;
    if (!((model.page != null) && model.page instanceof NFPageComp)) {
      throw "No page given to insert...";
    }
    if (!((model.above != null) || (model.below != null) || (model.at != null))) {
      model.at = 1;
    }
    pageLayer = this.insertComp({
      comp: model.page,
      above: model.above,
      below: model.below,
      at: model.at
    });
    if (model.init !== false) {
      pageLayer.initTransforms().init();
      pageLayer.assignPaperParentLayer();
    }
    if (model.animate === true) {
      pageLayer.slideIn();
    }
    return pageLayer;
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


  /**
  Gets the active PDF at an optional time
  @memberof NFPartComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFPDF | null} The active PDF or null if none active
   */

  NFPartComp.prototype.activePDF = function(time) {
    var activePage;
    activePage = this.activePage(time);
    return activePage != null ? activePage.getPDF() : void 0;
  };


  /**
  Gets the active NFPageLayer at a time (or current time by default). In this
  case, that means the topmost Page Layer that is not folded back, invisible,
  disabled, pre-start or post-end.
  @memberof NFPartComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFPageLayer | null} The active page layer or null if none
   */

  NFPartComp.prototype.activePage = function(time) {
    var activeLayers, activePage, originalTime, topLayer;
    if (time != null) {
      originalTime = this.getTime();
      this.setTime(time);
    }
    activePage = null;
    activeLayers = this.activeLayers();
    while (!activeLayers.isEmpty()) {
      topLayer = activeLayers.getTopmostLayer();
      if (topLayer instanceof NFPageLayer) {
        if (topLayer.pageTurnStatus() !== NFPageLayer.PAGETURN_FLIPPED_UP && topLayer.property("Transform").property("Opacity").value === 100) {
          activePage = topLayer;
          break;
        }
      }
      activeLayers.remove(topLayer);
    }
    if (originalTime != null) {
      this.setTime(originalTime);
    }
    return activePage;
  };

  return NFPartComp;

})(NFComp);
