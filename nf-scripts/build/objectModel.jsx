
/**
Creates a new NFObject
@class NFObject
@classdesc Superclass for all NF objects
 */
var NFObject;

NFObject = (function() {
  function NFObject() {
    this;
  }

  NFObject.prototype.toString = function() {
    return "NFObject";
  };


  /**
  Logs a message to log.txt
  @memberof NFObject
  @param {String} message - The message to log
  @returns {null} null
   */

  NFObject.prototype.log = function(message) {
    return NFTools.log(message, this.toString());
  };


  /**
  Clears log.txt
  @memberof NFObject
  @returns {null} null
   */

  NFObject.prototype.clearLog = function() {
    return NFTools.clearLog();
  };


  /**
  Adds a section break to log.txt
  @memberof NFObject
  @returns {null} null
   */

  NFObject.prototype.breakLog = function() {
    return NFTools.breakLog();
  };

  return NFObject;

})();


/**
Creates a new NFComp and sets its comp property.
@class NFComp
@classdesc NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFComp
@property {String} name - the name of the comp
@property {String} id - the comp's ID
@param {CompItem | NFComp} comp - the CompItem for this NFComp
@throws Will throw an error if not given a valid CompItem at initialization
 */
var NFComp,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFComp = (function(superClass) {
  extend(NFComp, superClass);

  function NFComp(comp) {
    var item, ref, ref1;
    NFObject.call(this);
    if (comp instanceof CompItem) {
      item = comp;
    } else if (comp instanceof NFComp) {
      item = comp.comp;
    } else {
      throw new Error("Cannot create an NFComp without a valid CompItem or NFComp");
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
      throw new Error("Can't compare an NFComp to a different type of object");
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
    var selectedPageLayers;
    selectedPageLayers = new NFPageLayerCollection;
    this.selectedLayers().forEach((function(_this) {
      return function(layer) {
        if (layer instanceof NFPageLayer) {
          return selectedPageLayers.add(layer);
        }
      };
    })(this));
    return selectedPageLayers;
  };


  /**
  Gets the active NFLayers at a time (or current time by default).
  @memberof NFComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFLayerCollection} The active layers or null if none active
   */

  NFComp.prototype.activeLayers = function(time) {
    var activeLayers, originalTime;
    if (time != null) {
      originalTime = this.getTime();
      this.setTime(time);
    }
    activeLayers = new NFLayerCollection;
    this.allLayers().forEach((function(_this) {
      return function(layer) {
        if (layer.isActive()) {
          return activeLayers.add(layer);
        }
      };
    })(this));
    if (originalTime != null) {
      this.setTime(originalTime);
    }
    return activeLayers;
  };


  /**
   * Returns the first NFLayer in this comp with the layer name given or null
   * if none found. Use #layersWithName if there's the possibility of multiple
   * layers with the given name.
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
   * Returns an NFLayerCollection with the NFLayers in this comp with the layer
   * name given or null if none found
   * @memberof NFComp
   * @param {string} name - The search layer's name
   * @returns {NFLayerCollection} The found layers
   */

  NFComp.prototype.layersWithName = function(name) {
    var foundLayers;
    foundLayers = new NFLayerCollection;
    this.allLayers().forEach((function(_this) {
      return function(layer) {
        if (layer.getName() === name) {
          return foundLayers.add(layer);
        }
      };
    })(this));
    return foundLayers;
  };


  /**
   * Returns an NFLayerCollection with the NFLayers in this comp that contain
   * the searchString in their name
   * @memberof NFComp
   * @param {string} searchString - The search string
   * @returns {NFLayerCollection} The found layers
   */

  NFComp.prototype.searchLayers = function(searchString) {
    var foundLayers;
    foundLayers = new NFLayerCollection;
    this.allLayers().forEach((function(_this) {
      return function(layer) {
        if (layer.getName().indexOf(searchString) >= 0) {
          return foundLayers.add(layer);
        }
      };
    })(this));
    return foundLayers;
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
  Gets the center point of the comp
  @memberof NFComp
  @returns {Point} the center point
   */

  NFComp.prototype.centerPoint = function() {
    return [this.comp.width / 2, this.comp.height / 2];
  };


  /**
   * Creates and returns a new null layer in this comp
   * @memberof NFComp
   * @returns {NFLayer} The newly created null layer
   */

  NFComp.prototype.addNull = function() {
    return new NFLayer(this.comp.layers.addNull());
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
  @param {float} [model.time=Current Time] - the time to insert the comp at
  @throws Throw error if given values for more than one of .above, .below,
  and .at
   */

  NFComp.prototype.insertComp = function(model) {
    var index, newAVLayer, ref, tooManyIndices;
    if (!((model.comp != null) && model.comp instanceof NFComp)) {
      throw new Error("No comp to insert");
    }
    if ((model.above != null) && !model.above instanceof NFLayer) {
      throw new Error("model.above must be an NFLayer");
    }
    if ((model.below != null) && !model.below instanceof NFLayer) {
      throw new Error("model.below must be an NFLayer");
    }
    index = 0;
    tooManyIndices = false;
    if ((model.above != null) && model.above instanceof NFLayer) {
      if ((model.below != null) || (model.at != null)) {
        tooManyIndices = true;
      }
      if (model.above.containingComp().is(this)) {
        index = model.above.index() - 1;
      } else {
        throw new Error("Cannot insert layer above a layer not in this comp");
      }
    } else if ((model.below != null) && model.below instanceof NFLayer) {
      if ((model.above != null) || (model.at != null)) {
        tooManyIndices = true;
      }
      if (model.below.containingComp().is(this)) {
        index = model.below.index();
      } else {
        throw new Error("Cannot insert layer below a layer not in this comp");
      }
    } else if (model.at != null) {
      if ((model.above != null) || (model.below != null)) {
        tooManyIndices = true;
      }
      index = model.at;
    }
    if (tooManyIndices) {
      throw new Error("Can only provide one of .above, .below, or .at when inserting page");
    }
    newAVLayer = this.comp.layers.add(model.comp.comp);
    newAVLayer.startTime = (ref = model.time) != null ? ref : this.getTime();
    if (index !== 0) {
      newAVLayer.moveBefore(this.comp.layers[index + 2]);
    }
    return NFLayer.getSpecializedLayerFromAVLayer(newAVLayer);
  };

  return NFComp;

})(NFObject);

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
  RIGHT: 400,
  AUTO: 500
});


/**
Creates a new NFLayer from a given AVLayer
@class NFLayer
@classdesc NF Wrapper object for an AVLayer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer (in which case we use it's AVLayer)
@property {AVLayer} layer - the wrapped AVLayer
@throws Will throw an error if not given a valid AVLayer object
 */
var NFLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFLayer = (function(superClass) {
  extend(NFLayer, superClass);

  function NFLayer(layer) {
    NFObject.call(this);
    if (layer.isAVLayer()) {
      this.layer = layer;
    } else if (layer instanceof NFLayer) {
      this.layer = layer.layer;
    } else {
      throw new Error("Can only create a new NFLayer with a valid AVLayer or NFLayer object");
    }
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
  Checks if this layer is active
  @memberof NFLayer
  @param {float} time - the time to check at
  @returns {boolean} if this is an active layer
   */

  NFLayer.prototype.isActiveAtTime = function(time) {
    var currentTime, isActive;
    currentTime = this.containingComp().getTime();
    this.containingComp().setTime(time);
    isActive = this.isActive();
    this.containingComp().setTime(currentTime);
    return isActive;
  };

  NFLayer.prototype.isHighlightLayer = function() {
    return NFHighlightLayer.isHighlightLayer(this.layer);
  };

  NFLayer.prototype.isPaperParentLayer = function() {
    return NFPaperParentLayer.isPaperParentLayer(this.layer);
  };

  NFLayer.prototype.isHighlightControlLayer = function() {
    return NFHighlightControlLayer.isHighlightControlLayer(this.layer);
  };

  NFLayer.prototype.isSpotlightLayer = function() {
    return NFSpotlightLayer.isSpotlightLayer(this.layer);
  };

  NFLayer.prototype.isCitationLayer = function() {
    return NFCitationLayer.isCitationLayer(this.layer);
  };

  NFLayer.prototype.isPageLayer = function() {
    return NFPageLayer.isPageLayer(this.layer);
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
    } else if (this.isHighlightControlLayer()) {
      return new NFHighlightControlLayer(this.layer);
    } else if (this.isSpotlightLayer()) {
      return new NFSpotlightLayer(this.layer);
    } else if (this.isCitationLayer()) {
      return new NFCitationLayer(this.layer);
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
  Returns the mask Property for the layer, or a given mask if provided
  @memberof NFLayer
  @param {String} [maskName] - the mask name
  @returns {Property | null} the mask property or null if not found
   */

  NFLayer.prototype.mask = function(maskName) {
    var mask;
    if (maskName != null) {
      mask = this.layer.mask(maskName);
      if (mask != null) {
        return mask;
      } else {
        return null;
      }
    } else {
      return this.layer.mask;
    }
  };


  /**
  Returns the transform Property for the layer
  @memberof NFLayer
  @returns {Property} the transform property
   */

  NFLayer.prototype.transform = function() {
    return this.layer.transform;
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
    newNull.moveBefore(this);
    return newNull;
  };


  /**
  Returns an NFLayerCollection of child layers of this layer as specialized layers
  @memberof NFLayer
  @returns {NFLayerCollection} the collection of child layers
  @param {boolean} [recursive=no] - whether to look recursively (to include)
  children of children.
   */

  NFLayer.prototype.getChildren = function(recursive) {
    var allLayers, childLayers, i, len, testLayer, theLayer;
    if (recursive == null) {
      recursive = false;
    }
    allLayers = this.containingComp().comp.layers.toArr();
    childLayers = [];
    for (i = 0, len = allLayers.length; i < len; i++) {
      theLayer = allLayers[i];
      testLayer = new NFLayer(theLayer);
      if (testLayer.layer.parent === this.layer) {
        testLayer = testLayer.getSpecializedLayer();
        childLayers.push(testLayer);
        if (recursive) {
          testLayer.getChildren(true).forEach((function(_this) {
            return function(recLayer) {
              return childLayers.push(recLayer);
            };
          })(this));
        }
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
    if (newParent == null) {
      this.layer.parent = null;
    } else if (newParent.isAVLayer()) {
      this.layer.parent = newParent;
    } else if (newParent instanceof NFLayer) {
      this.layer.parent = newParent != null ? newParent.layer : void 0;
    } else {
      throw new Error("Can only set an NFLayer's parent to another NFLayer or AVLayer");
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
      throw new Error("Can't run moveBefore on a non-NFLayer");
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
      throw new Error("Can't run moveAfter on a non-NFLayer");
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
  Adds a marker at a given time.
  @memberof NFLayer
  @param {Object} model
  @param {String} model.comment - the marker comment
  @param {float} [model.duration=0] - the duration
  @param {float} model.time - the time to add the marker
  @throw Throws error if marker already exists at given time
  @returns {Property} The marker property
   */

  NFLayer.prototype.addMarker = function(model) {
    var markerValue, markers, nearestMarkerIdx, nearestMarkerTime;
    if (!(((model != null ? model.comment : void 0) != null) && (model.time != null))) {
      throw new Error("Invalid properties for new marker");
    }
    markers = this.markers();
    if (markers.numKeys > 0) {
      nearestMarkerIdx = markers.nearestKeyIndex(model.time);
      nearestMarkerTime = markers.keyTime(nearestMarkerIdx);
      if (nearestMarkerTime === model.time) {
        throw new Error("Already marker at this time");
      }
    }
    markerValue = new MarkerValue(model.comment);
    if (model.duration != null) {
      markerValue.duration = model.duration;
    }
    markers.setValueAtTime(model.time, markerValue);
    return markers;
  };


  /**
  Returns the layer's absolute scale, which is the scale of the layer if it had
  no parent.
  @memberof NFLayer
  @returns {float} The absolute scale
   */

  NFLayer.prototype.getAbsoluteScale = function() {
    var absoluteScale, layerParent;
    layerParent = this.layer.parent;
    this.layer.parent = null;
    absoluteScale = this.transform().scale.value;
    this.layer.parent = layerParent;
    return absoluteScale;
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
  @param {float} [options.length=2.0] - the length of the transition. Default 2.0
  @param {string} [options.startEquation=EasingEquation.quint.out] - the equation to use for the in
  transition of the property.
  @param {string} [options.endEquation=EasingEquation.quint.in] - the equation to use for the out
  transition of the property.
  @param {any | Array} [options.startValue] - the value for this property
  at its inPoint. If the property is multidimensional, this should be an
  array of that many dimensions. Can also pass a slider property.
  @param {any | Array} [options.endValue] - the value for this property at
  its outPoint. If the property is multidimensional, this should be an
  array of that many dimensions. Can also pass a slider property.
  @throws Throws error if not given at least a start or end equation and value
  @throws Throws error if the start or end values given are the wrong
  number of dimensions for this property
   */

  NFLayer.prototype.addInOutMarkersForProperty = function(options) {
    var alreadyContainsInValue, alreadyContainsOutValue, e, element, error, error1, expression, i, idx, inComm, inMarker, inValueString, j, markers, outComm, outMarker, outValueString, prevExpression, ref, ref1, shouldFail, shouldPreserveInValue, shouldPreserveOutValue;
    if (!((options.property != null) && options.property instanceof Property)) {
      throw new Error("Invalid property");
    }
    if (!options.property.canSetExpression) {
      throw new Error("Can't set expression on this property");
    }
    if (!((options.startValue != null) || (options.endValue != null))) {
      throw new Error("Can't run makeEasedInOutFromMarkers() without at least a start or end value");
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
      throw new Error("Given start or end value type doesn't match property value");
    }
    if (options.length == null) {
      options.length = 2.0;
    }
    if (options.startEquation == null) {
      options.startEquation = EasingEquation.quint.out;
    }
    if (options.endEquation == null) {
      options.endEquation = EasingEquation.quint["in"];
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
    if ((options.startValue != null) && (inMarker == null)) {
      this.addMarker({
        time: this.layer.inPoint + options.length,
        comment: inComm
      });
    }
    if ((options.endValue != null) && (outMarker == null)) {
      this.addMarker({
        time: this.layer.outPoint - options.length,
        comment: outComm
      });
    }
    prevExpression = options.property.expression;
    alreadyContainsInValue = prevExpression.indexOf("var inValue") >= 0;
    alreadyContainsOutValue = prevExpression.indexOf("var outValue") >= 0;
    shouldPreserveInValue = (options.startValue == null) && alreadyContainsInValue;
    shouldPreserveOutValue = (options.endValue == null) && alreadyContainsOutValue;
    if (shouldPreserveInValue || shouldPreserveOutValue) {
      expression = prevExpression;
    } else {
      expression = NFTools.readExpression("marker-animation-main-function");
    }
    if (options.startValue != null) {
      expression = ("var startEquationFunc = " + options.startEquation + "\n") + expression;
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
    if (options.endValue != null) {
      expression = ("var endEquationFunc = " + options.endEquation + "\n") + expression;
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
  Removes the layer from its parent comp
  @memberof NFLayer
  @returns {null} null
   */

  NFLayer.prototype.remove = function() {
    this.layer.remove();
    return null;
  };


  /**
  Moves startTime of a layer without moving the inPoint such that the inPoint
  is the given time in the layer's composition
  @memberof NFLayer
  @returns {NFLayer} self
   */

  NFLayer.prototype.beginAt = function(time) {
    this.layer.startTime = this.layer.inPoint - time;
    this.layer.inPoint = this.layer.startTime + time;
    return this;
  };


  /**
  Returns the time in the layer's page comp that this layer ends.
  @memberof NFLayer
  @returns {float} the result
   */

  NFLayer.prototype.internalEndTime = function() {
    return this.layer.outPoint - this.layer.startTime;
  };


  /**
  Returns the time in the layer's page comp that this layer starts.
  @memberof NFLayer
  @returns {float} the result
   */

  NFLayer.prototype.internalStartTime = function() {
    return this.layer.inPoint - this.layer.startTime;
  };


  /**
  Uses a null hack to get the source Rect of the layer in it's containing comp.
  Optional time parameter. WARNING: This method is very likely to cause the time
  of whatever comp you're working with to jump around. It's strongly recommended
  to save and restore the current time of the comp you're working in before
  and after calling this. That happens when you're in a time-sensitive comp
  (like a part comp) and you end up calling this function (even through other)
  functions.
  @memberof NFLayer
  @param {float} [time=Current time] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .hight, .top
   */

  NFLayer.prototype.sourceRect = function(time) {
    var bottomRightPoint, compTime, expressionBase, rect, tempNull, topLeftPoint;
    compTime = this.containingComp().getTime();
    time = time != null ? time : compTime;
    tempNull = this.containingComp().addNull();
    expressionBase = "rect = thisComp.layer(" + (this.index()) + ").sourceRectAtTime(time);";
    tempNull.transform().position.expression = expressionBase + ("thisComp.layer(" + (this.index()) + ").toComp([rect.left, rect.top])");
    topLeftPoint = tempNull.transform().position.valueAtTime(time, false);
    tempNull.transform().position.expression = expressionBase + ("thisComp.layer(" + (this.index()) + ").toComp([rect.left + rect.width, rect.top + rect.height])");
    bottomRightPoint = tempNull.transform().position.valueAtTime(time, false);
    tempNull.remove();
    return rect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };


  /**
  Returns a rect object in this layer's containing comp that matches
  a given rect in this layer
  @memberof NFLayer
  @param {Rect} rect - the rect with .left, .top, .width, and .height values
  @param {float} [targetTime=Current Time] - the optional time of the
  containing comp to check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .height and .top values
   */

  NFLayer.prototype.relativeRect = function(rect, targetTime) {
    var bottomRightPoint, newRect, topLeftPoint;
    if (targetTime == null) {
      targetTime = null;
    }
    if (!((rect.left != null) && (rect.top != null) && (rect.width != null) && (rect.height != null))) {
      throw new Error("Missing values on the rect");
    }
    topLeftPoint = this.relativePoint([rect.left, rect.top], targetTime);
    bottomRightPoint = this.relativePoint([rect.left + rect.width, rect.top + rect.height], targetTime);
    return newRect = {
      left: topLeftPoint[0],
      top: topLeftPoint[1],
      width: bottomRightPoint[0] - topLeftPoint[0],
      height: bottomRightPoint[1] - topLeftPoint[1]
    };
  };


  /**
  Uses a null hack to get a point in this layer's containing comp that matches
  a given point on this layer
  @memberof NFLayer
  @param {Point} sourcePoint - the point to use
  @param {float} [targetTime=Current Time] - the optional time of the
  containing comp to check at. Default is the current time of the containingComp.
  @returns {Point} the resulting Point
   */

  NFLayer.prototype.relativePoint = function(sourcePoint, targetTime) {
    var newPoint, tempNull;
    if (targetTime == null) {
      targetTime = null;
    }
    targetTime = targetTime != null ? targetTime : this.containingComp().getTime();
    tempNull = this.containingComp().addNull();
    tempNull.transform().position.expression = "a = thisComp.layer(" + this.layer.index + ").toComp([" + sourcePoint[0] + ", " + sourcePoint[1] + "]);\na";
    newPoint = tempNull.transform().position.valueAtTime(targetTime, false);
    tempNull.remove();
    return newPoint;
  };


  /**
  Uses a null hack to get the center point of this layer in it's containing comp
  @memberof NFLayer
  @param {float} [targetTime=Current Time] - the optional time of the
  containing comp to check at. Default is the current time of the containingComp.
  @returns {Point} the resulting Point
   */

  NFLayer.prototype.relativeCenterPoint = function(targetTime) {
    var sourceRect;
    if (targetTime == null) {
      targetTime = null;
    }
    sourceRect = this.sourceRect(targetTime);
    return [sourceRect.left + sourceRect.width / 2, sourceRect.top + sourceRect.height / 2];
  };

  return NFLayer;

})(NFObject);

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
      throw new Error("Can't run getSpecializedLayerFromAVLayer() on a non-AVLayer");
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
var NFLayerCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFLayerCollection = (function(superClass) {
  extend(NFLayerCollection, superClass);

  function NFLayerCollection(layerArr) {
    var expectingAVLayers, expectingNFLayers, j, layer, len, newArray, newLayer, theLayer;
    NFObject.call(this);
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
            throw new Error("You can't initialize NFLayerCollection with a mix of AVLayers and NFLayers");
          }
          expectingAVLayers = true;
        } else if (theLayer instanceof NFLayer) {
          if (expectingAVLayers) {
            throw new Error("You can't initialize NFLayerCollection with a mix of AVLayers and NFLayers");
          }
          expectingNFLayers = true;
        } else {
          throw new Error("You can only add NFLayers or AVLayers to an NFLayerCollection");
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

  NFLayerCollection.prototype.add = function(newLayer) {
    if (newLayer instanceof NFLayer) {
      this.layers.push(newLayer);
    } else if (newLayer.isAVLayer()) {
      this.layers.push(NFLayer.getSpecializedLayerFromAVLayer(newLayer));
    } else {
      throw new Error("You can only add NFLayers or AVLayers to an NFLayerCollection");
    }
    return this;
  };


  /**
  Returns the layer at the given index
  @memberof NFLayerCollection
  @param {int} idx - the layer index to access
  @returns {NFLayerCollection} self
   */

  NFLayerCollection.prototype.get = function(idx) {
    if (idx >= this.count()) {
      throw new Error("Index is out of bounds");
    }
    return this.layers[idx];
  };


  /**
  Iterates through each layer in the collection. The given function can take
  three parameters: layer, i, and layers. None of the parameters are required.
  IMPORTANT: Should be used with a fat arrow to call the callback function, so
  that scope is preserved. Don't add returns inside the function plz...
  @example
  myCollection.forEach (layer, i, layers) =>
    return "Layer number #{i} is called #{layer.getName()}"
  @memberof NFLayerCollection
  @param {function} fn - the function to use
  @returns {NFLayerCollection} self
   */

  NFLayerCollection.prototype.forEach = function(fn) {
    var i, j, ref;
    if (this.isEmpty()) {
      return null;
    }
    for (i = j = 0, ref = this.count() - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      fn(this.layers[i], i, this.layers);
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
    throw new Error("Couldn't find layer to remove");
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
      throw new Error("Can't get topmost layer of layers in different comps");
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
      throw new Error("Can't get bottommost layer of layers in different comps");
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
      throw new Error("Cannot nullify layers in different compositions at the same time");
    }
    if (this.isEmpty()) {
      throw new Error("Cannot nullify without a given layer");
    }
    newNull = this.containingComp().addNull();
    this.setParents(newNull);
    topLayer = this.getTopmostLayer();
    newNull.moveBefore(topLayer);
    return newNull;
  };


  /**
  Gets the earliest appearing NFLayer in this collection
  @memberof NFLayerCollection
  @returns {NFLayer | null} the topmost layer or null if empty
  @throws Throws an error if the layers are in different comps
   */

  NFLayerCollection.prototype.getEarliestLayer = function() {
    var earliestLayer, j, layer, len, ref;
    if (this.isEmpty()) {
      return null;
    }
    if (!this.inSameComp()) {
      throw new Error("Can't get earliest layer of layers in different comps");
    }
    earliestLayer = this.layers[0];
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
      if (layer.layer.inPoint < earliestLayer.layer.inPoint) {
        earliestLayer = layer;
      }
    }
    return earliestLayer;
  };


  /**
  Gets the latest appearing NFLayer in this collection. Only returns one layer
  even if two layers have the same outPoint
  @memberof NFLayerCollection
  @returns {NFLayer | null} the topmost layer or null if empty
  @throws Throws an error if the layers are in different comps
   */

  NFLayerCollection.prototype.getLatestLayer = function() {
    var j, latestLayer, layer, len, ref;
    if (this.isEmpty()) {
      return null;
    }
    if (!this.inSameComp()) {
      throw new Error("Can't get latest layer of layers in different comps");
    }
    latestLayer = this.layers[0];
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      layer = ref[j];
      if (layer.layer.outPoint > latestLayer.layer.outPoint) {
        latestLayer = layer;
      }
    }
    return earliestLayer;
  };

  return NFLayerCollection;

})(NFObject);


/**
Creates a new NFPDF from a given array of pages
@class NFPDF
@classdesc NF Wrapper object for a group of NFPageComps
@param {NFPageComp[]} pageArr - an array of NFPageComps
@property {NFPageComp[]} pages - the array ofitems
@throws Throws error if one object in the array is not an NFPageComp
 */
var NFPDF,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPDF = (function(superClass) {
  extend(NFPDF, superClass);

  function NFPDF(pageArr) {
    var i, len, newArr, page;
    NFObject.call(this);
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
          throw new Error("You can only add NFPageComps to an NFPDF");
        }
      }
    }
    this.pages = newArr;
    this;
  }

  NFPDF.prototype.toString = function() {
    return "NFPDF: " + (this.getPDFNumber());
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
      throw new Error("You can only add NFPageComps to an NFPDF");
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
  Checks to see if two NFPDFs are the PDF
  @memberof NFPDF
  @returns {boolean} whether they're equal
  @param {NFPDF} testPDF - the PDF to test
   */

  NFPDF.prototype.is = function(testPDF) {
    if (testPDF != null) {
      if (!(testPDF instanceof NFPDF)) {
        throw new Error("testPDF must be an NFPDF");
      }
      return this.getPDFNumber() === testPDF.getPDFNumber();
    } else {
      return false;
    }
  };


  /**
  Returns the PDF Number as a string
  @memberof NFPDF
  @returns {string} the PDF Number
  @throws Throws error if no PDF number (if this object is empty)
   */

  NFPDF.prototype.getPDFNumber = function() {
    if (this.pages.length === 0) {
      throw new Error("NO PDF number");
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
      throw new Error("Can't get the title page because there are no pages");
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

})(NFObject);

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
      throw new Error("Can't make an NFPDF using fromPageLayer() without a NFPageLayer...");
    }
    return NFPDF.fromPDFNumber(pageLayer.getPDFNumber());
  },

  /**
  Gets a new PDF object from a given layer group
  @memberof NFPDF
  @param {group} NFPaperLayerGroup - the group
  @returns {NFPDF} the new NFPDF
  @throws throws error if not given an NFPaperLayerGroup
   */
  fromGroup: function(group) {
    if (!(group instanceof NFPaperLayerGroup)) {
      throw new Error("Can't make an NFPDF using fromGroup() without a NFPaperLayerGroup...");
    }
    return NFPDF.fromPDFNumber(group.getPDFNumber());
  },

  /**
  Gets a new PDF object from a given PDF Number string
  @memberof NFPDF
  @param {string} theNumber - the PDF Number
  @returns {NFPDF} the new NFPDF
  @throws throws error if cannot find the pages for the given number
   */
  fromPDFNumber: function(theNumber) {
    var filteredItems, folder, i, item, items, len, searchString;
    searchString = theNumber + "_";
    folder = NFProject.findItem("PDF Precomps");
    items = NFProject.searchItems(searchString, folder);
    filteredItems = [];
    if (items.length !== 0) {
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        if (item.name.startsWith(searchString)) {
          filteredItems.push(item);
        }
      }
    }
    if (filteredItems.length === 0) {
      throw new Error("Cannot find PDF pages for the given number: '" + theNumber + "'");
    }
    return new NFPDF(filteredItems);
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
var NFPaperLayerGroup,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFPaperLayerGroup = (function(superClass) {
  extend(NFPaperLayerGroup, superClass);

  function NFPaperLayerGroup(paperParent) {
    NFObject.call(this);
    this.paperParent = paperParent;
    if (!(this.paperParent instanceof NFPaperParentLayer)) {
      throw new Error("Not a valid paper parent");
    }
    this;
  }

  NFPaperLayerGroup.prototype.toString = function() {
    return "NFPaperLayerGroup: " + this.paperParent.layer.name;
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
  Returns the PDF Number
  @memberof NFPaperLayerGroup
  @returns {String} the pdf number
   */

  NFPaperLayerGroup.prototype.getPDFNumber = function() {
    var children, i, layer, len, ref;
    children = this.getChildren();
    ref = children.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer instanceof NFPageLayer) {
        return layer.getPDFNumber();
      }
    }
    return null;
  };


  /**
  Gets all the NFPageLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFPageLayerCollection} the page layers
   */

  NFPaperLayerGroup.prototype.getPages = function() {
    var allChildren, pageChildren;
    allChildren = this.getChildren();
    pageChildren = new NFPageLayerCollection();
    allChildren.forEach((function(_this) {
      return function(layer) {
        if (layer instanceof NFPageLayer) {
          return pageChildren.add(layer);
        }
      };
    })(this));
    return pageChildren;
  };


  /**
  Gets all the NFHighlightControlLayer in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the control layers
   */

  NFPaperLayerGroup.prototype.getControlLayers = function() {
    var allChildren, controlChildren;
    allChildren = this.getChildren();
    controlChildren = new NFLayerCollection();
    allChildren.forEach((function(_this) {
      return function(layer) {
        if (layer instanceof NFHighlightControlLayer) {
          return controlChildren.add(layer);
        }
      };
    })(this));
    return controlChildren;
  };


  /**
  Returns whether a given highlight is in one of the group's layers
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
   */

  NFPaperLayerGroup.prototype.containsHighlight = function(highlight) {
    var foundHighlight;
    foundHighlight = false;
    this.getPages().forEach((function(_this) {
      return function(pageLayer) {
        return pageLayer.highlights().forEach(function(testHighlight) {
          if (testHighlight.is(highlight)) {
            return foundHighlight = true;
          }
        });
      };
    })(this));
    return foundHighlight;
  };


  /**
  Returns the containing NFComp
  @memberof NFPaperLayerGroup
  @returns {NFComp} the containing comp
   */

  NFPaperLayerGroup.prototype.containingComp = function() {
    return this.paperParent.containingComp();
  };


  /**
  Returns the spotlight layer if it exists
  @memberof NFPaperLayerGroup
  @returns {NFSpotlightLayer | null} the spotlight layer
   */

  NFPaperLayerGroup.prototype.getSpotlight = function() {
    return this.containingComp().layerWithName(NFSpotlightLayer.nameForPDFNumber(this.getPDFNumber()));
  };


  /**
  Returns the NFPDF for the group
  @memberof NFPaperLayerGroup
  @returns {NFPDF} the PDF for the group
   */

  NFPaperLayerGroup.prototype.getPDF = function() {
    return NFPDF.fromGroup(this);
  };


  /**
  Looks for and returns the citation layer for this group if it exists. Does not
  create one. For that use #assignCitationLayer
  @memberof NFPaperLayerGroup
  @returns {NFCitationLayer | null} the citation layer or null
   */

  NFPaperLayerGroup.prototype.getCitationLayer = function() {
    return this.containingComp().layerWithName(NFCitationLayer.nameFor(this.getPDF()));
  };


  /**
  Gives this group a citation layer unless one already exists
  @memberof NFPaperLayerGroup
  @returns {NFCitationLayer} the citation layer
   */

  NFPaperLayerGroup.prototype.assignCitationLayer = function() {
    var citeLayer;
    citeLayer = (this.getCitationLayer() != null) || NFCitationLayer.newCitationLayer(this);
    return citeLayer;
  };


  /**
  Adds a spotlight for the given highlight.
  @memberof NFPaperLayerGroup
  @param {NFHighlightLayer} highlight - the highlight to spotlight
  @returns {NFSpotlightLayer} the spotlight layer
   */

  NFPaperLayerGroup.prototype.addSpotlight = function(highlight) {
    var spotlightLayer;
    if (!(highlight instanceof NFHighlightLayer)) {
      throw new Error("Must provide a highlight to create a spotlight");
    }
    spotlightLayer = this.getSpotlight();
    if (spotlightLayer == null) {
      return NFSpotlightLayer.newSpotlightLayer(this);
    }
  };


  /**
  Returns a NFLayerCollection of NFHighlightControlLayer with
  active spotlights at the given time.
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFLayerCollection} collection of NFHighlightControlLayer with active
  spotlights at time
   */

  NFPaperLayerGroup.prototype.getActiveSpotlights = function(time) {
    var activeControlLayers, allControlLayers;
    time = time != null ? time : this.containingComp().getTime();
    allControlLayers = this.getControlLayers();
    activeControlLayers = new NFLayerCollection();
    allControlLayers.forEach((function(_this) {
      return function(layer) {
        var end, marker, start;
        marker = layer.spotlightMarker();
        start = marker.time;
        end = marker.time + marker.value.duration;
        if ((start <= time && time < end)) {
          return activeControlLayers.add(layer);
        }
      };
    })(this));
    return activeControlLayers;
  };


  /**
  Trims any active spotlights in the group to the given time
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFPaperLayerGroup} self
   */

  NFPaperLayerGroup.prototype.trimActiveSpotlights = function(time) {
    var activeSpots;
    this.log("Trimming active spotlights at time: " + time);
    time = time != null ? time : this.containingComp().getTime();
    activeSpots = this.getActiveSpotlights(time);
    if (!activeSpots.isEmpty()) {
      activeSpots.forEach((function(_this) {
        return function(controlLayer) {
          return controlLayer.setSpotlightMarkerOutPoint(time);
        };
      })(this));
    }
    return this;
  };


  /**
  Trims all layers in this group to the given time. Call #extend to restore
  layers to a given time. Spotlights will end just before the group does
  @memberof NFPaperLayerGroup
  @param {float} [time=currTime] - the time to check at, or the current time by
  default
  @returns {NFPaperLayerGroup} self
   */

  NFPaperLayerGroup.prototype.trim = function(time) {
    this.log("Trimming group at time: " + time);
    time = time != null ? time : this.containingComp().getTime();
    this.trimActiveSpotlights(time - 0.75);
    this.getChildren().forEach((function(_this) {
      return function(layer) {
        return layer.layer.outPoint = time;
      };
    })(this));
    return this;
  };


  /**
  Bubbles up given highlights or highlight to this comp by creating an
  NFHighlightControlLayer.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {NFHighlightLayer | NFHighlightLayerCollection} highlightsToBubble - the highlights to bubble up
  @param {float} [time] - the time to create the control layer at
  @throws Throw error if any highlight choices are connected and not broken,
  so you should have disconnected them first
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
   */

  NFPaperLayerGroup.prototype.bubbleUp = function(highlightsToBubble, time) {
    this.log("Bubbling up highlights: " + (highlightsToBubble.toString()));
    if (highlightsToBubble instanceof NFHighlightLayer) {
      highlightsToBubble = new NFHighlightLayerCollection([highlightsToBubble]);
    }
    if (!highlightsToBubble.isEmpty()) {
      highlightsToBubble.forEach((function(_this) {
        return function(highlight) {
          var controlLayer, highlightIsInGroup, highlighterEffect, highlighterProperty, i, len, propExpressionName, ref, ref1, sourceEffect, sourceExpression, sourceValue, spotlightLayer, targetComp;
          if (!highlight.canBubbleUp()) {
            throw new Error("Cannot bubble highlight if already connected and not broken. Disconnect first");
          }
          highlightIsInGroup = false;
          _this.getPages().forEach(function(pageInGroup) {
            if (pageInGroup.getPageComp().is(highlight.getPageComp())) {
              return highlightIsInGroup = true;
            }
          });
          if (!highlightIsInGroup) {
            throw new Error("Cannot bubble highlight because it is not in this group!");
          }
          sourceEffect = highlight.highlighterEffect();
          targetComp = _this.containingComp();
          controlLayer = NFHighlightControlLayer.newHighlightControlLayer({
            group: _this,
            highlight: highlight,
            time: time != null ? time : null
          });
          highlighterEffect = controlLayer.highlighterEffect();
          ref = NFHighlightLayer.highlighterProperties;
          for (i = 0, len = ref.length; i < len; i++) {
            highlighterProperty = ref[i];
            sourceValue = sourceEffect.property(highlighterProperty).value;
            highlighterEffect.property(highlighterProperty).setValue(sourceValue);
            if (highlighterProperty === "Opacity") {
              propExpressionName = "highlight-opacity-expression";
            } else {
              propExpressionName = "highlight-property-expression";
            }
            sourceExpression = NFTools.readExpression(propExpressionName, {
              TARGET_COMP_NAME: targetComp.comp.name,
              CONTROL_LAYER_NAME: controlLayer.layer.name,
              PAGE_BASE_NAME: highlight.getPageComp().getPageBaseName(),
              HIGHLIGHT_NAME: highlight.getName(),
              HIGHLIGHTER_PROPERTY: highlighterProperty
            });
            sourceEffect.property(highlighterProperty).expression = sourceExpression;
          }
          spotlightLayer = (ref1 = _this.getSpotlight()) != null ? ref1 : _this.addSpotlight(highlight);
          return spotlightLayer.trackHighlight(highlight);
        };
      })(this));
    }
    return this;
  };


  /**
  Animates the parent layer starting at the given time such that a given
  highlight is visible and centered in frame, via the page parent layer.
  Always adds keyframes. Will NOT add page layers and will throw an
  error if the given highlight is not in this group already. use NFPartComp's
  animateTo() instead to perform all the page addition,
  pageturns, etc.
  @memberof NFPaperLayerGroup
  @returns {NFPaperLayerGroup} self
  @param {Object} model - The options
  @param {NFHighlightLayer} model.highlight - The highlight to move to
  @param {float} [model.time=The current time] - The time to start the
  movement at
  @param {float} [model.duration=3.0] - The duration of the move
  @param {float} [model.maxScale=115] - The maximum a page will scale in this move
  @param {float} [model.fillPercentage=85] - the percentage of the width of the
  comp the highlight should fill
  @throws Throws error if not given a NFHighlightLayer as model.highlight
   */

  NFPaperLayerGroup.prototype.moveToHighlight = function(model) {
    var activePageLayer, initialPosition, initialScale, keyframePositions, keyframeScales, keyframeTimes, originalParent, originalTime, positionDelta, positionProp, possibleLayers, ref, ref1, ref2, ref3, scaleFactor, scaleProp, targetPosition, targetScale;
    if (!((model != null ? model.highlight : void 0) instanceof NFHighlightLayer && this.containsHighlight(model.highlight))) {
      throw new Error("\nInvalid highlight");
    }
    this.log("Moving to highlight: " + (model.highlight.toString()));
    model = {
      highlight: model.highlight,
      time: (ref = model.time) != null ? ref : this.containingComp().getTime(),
      duration: (ref1 = model.duration) != null ? ref1 : 3.0,
      maxScale: (ref2 = model.maxScale) != null ? ref2 : 115,
      fillPercentage: (ref3 = model.fillPercentage) != null ? ref3 : 85
    };
    positionProp = this.paperParent.transform().position;
    scaleProp = this.paperParent.transform().scale;
    originalTime = this.containingComp().getTime();
    this.containingComp().setTime(model.time);
    originalParent = this.paperParent.getParent();
    this.paperParent.setParent(null);
    possibleLayers = this.getPages().layersWithHighlight(model.highlight);
    activePageLayer = null;
    possibleLayers.forEach((function(_this) {
      return function(theLayer) {
        if (theLayer.isActiveAtTime(model.time)) {
          return activePageLayer = theLayer;
        }
      };
    })(this));
    keyframeTimes = [model.time, model.time + model.duration];
    scaleFactor = activePageLayer.getScaleFactorToFrameUpHighlight({
      highlight: model.highlight,
      time: keyframeTimes[1],
      maxScale: model.maxScale,
      fillPercentage: model.fillPercentage
    });
    initialScale = scaleProp.valueAtTime(model.time, false);
    targetScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor];
    keyframeScales = [scaleProp.valueAtTime(model.time, false), targetScale];
    scaleProp.setValuesAtTimes(keyframeTimes, keyframeScales);
    positionDelta = activePageLayer.getPositionDeltaToFrameUpHighlight({
      highlight: model.highlight,
      time: keyframeTimes[1]
    });
    initialPosition = positionProp.valueAtTime(model.time, false);
    targetPosition = [initialPosition[0] + positionDelta[0], initialPosition[1] + positionDelta[1]];
    keyframePositions = [positionProp.valueAtTime(model.time, false), targetPosition];
    positionProp.setValuesAtTimes(keyframeTimes, keyframePositions);
    scaleProp.easyEaseKeyTimes({
      keyTimes: keyframeTimes
    });
    positionProp.easyEaseKeyTimes({
      keyTimes: keyframeTimes
    });
    this.containingComp().setTime(originalTime);
    this.paperParent.setParent(originalParent);
    return this;
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
    var bottomLayer, childLayers, controlLayers, layerAbove, layersAboveGroup, layersBelowGroup, topLayer;
    if (shouldParent == null) {
      shouldParent = true;
    }
    this.log("Gathering layers: " + (layersToGather.toString()));
    childLayers = this.getChildren();
    layersAboveGroup = new NFLayerCollection();
    layersBelowGroup = new NFLayerCollection();
    layersToGather.forEach((function(_this) {
      return function(layer) {
        if (layer.index() < _this.paperParent.index()) {
          layersAboveGroup.add(layer);
        }
        if (layer.index() > childLayers.getBottommostLayer().index()) {
          return layersBelowGroup.add(layer);
        }
      };
    })(this));
    while (layersAboveGroup.count() > 0) {
      controlLayers = this.getControlLayers();
      if (controlLayers.isEmpty()) {
        layerAbove = this.paperParent;
      } else {
        layerAbove = controlLayers.getBottommostLayer();
      }
      bottomLayer = layersAboveGroup.getBottommostLayer();
      bottomLayer.moveAfter(layerAbove);
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

})(NFObject);


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


  /**
  Adds a citation visible marker at the given time
  @memberof NFCitationLayer
  @param {float} [time=currTime] - the time to add the marker
  @param {float} [duration=5] - the duration of the marker
  @returns {NFCitationLayer} self
   */

  NFCitationLayer.prototype.show = function(time, duration) {
    var citationMarkers, delta, endTime, i, idx, markers, newDuration, ref, thisEndTime, thisMarker, thisTime;
    time = time || this.containingComp().getTime();
    duration = duration || 5;
    endTime = time + duration;
    markers = this.markers();
    citationMarkers = [];
    if (markers.numKeys > 0) {
      for (idx = i = 1, ref = markers.numKeys; 1 <= ref ? i <= ref : i >= ref; idx = 1 <= ref ? ++i : --i) {
        thisMarker = markers.keyValue(idx);
        thisTime = markers.keyTime(idx);
        thisEndTime = thisTime + thisMarker.duration;
        if (thisMarker.comment === "Citation") {
          if ((thisTime <= time && time < thisEndTime)) {
            newDuration = endTime - thisTime;
            if (newDuration > thisMarker.duration) {
              thisMarker.duration = newDuration;
            }
            return this;
          }
          if ((thisTime <= endTime && endTime < thisEndTime)) {
            delta = thisTime - time;
            newDuration = thisMarker.duration + delta;
            thisMarker.remove();
            this.addMarker({
              time: time,
              comment: "Citation",
              duration: newDuration
            });
            return this;
          }
        }
      }
    }
    this.addMarker({
      time: time,
      comment: "Citation",
      duration: duration
    });
    return this;
  };

  return NFCitationLayer;

})(NFLayer);

NFCitationLayer = Object.assign(NFCitationLayer, {

  /**
  Returns whether or not the given AVLayer is a valid Citation Layer
  @memberof NFCitationLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid citation layer
   */
  isCitationLayer: function(theLayer) {
    return theLayer.name.indexOf("Citation") >= 0;
  },

  /**
  Returns the folder where citation comps live. Makes one if it doesn't exist.
  @memberof NFCitationLayer
  @returns {FolderItem} the folder where the cite comps live
   */
  folder: function() {
    var assetsFolder, citeFolder;
    citeFolder = NFProject.findItem("Citations");
    if (!citeFolder) {
      assetsFolder = NFProject.findItem("Assets");
      citeFolder = assetsFolder.items.addFolder("Citations");
    }
    return citeFolder;
  },

  /**
  Fetches the citation from the citations.csv file found in the project
  directory.
  @memberof NFCitationLayer
  @param {NFPDF} thePDF - the PDF to make the comp for
  @returns {NFComp} the new comp
  @throw Throws an error if citations.csv could not be found or empty
   */
  fetchCitation: function(thePDF) {
    var citationArray, citationsFile, citeLine, citeLineItem, citeLineItemIdx, citeObj, i, j, len, newKey, newVal, pdfKey, ref, startColumn;
    pdfKey = thePDF.getPDFNumber();
    if (NFTools.testProjectFile("citations.csv")) {
      citationsFile = NFTools.readProjectFile("citations.csv", true);
      citationArray = citationsFile.splitCSV();
      if (!(citationArray.length > 0)) {
        throw new Error("Empty Citation array");
      }
      startColumn = 0;
      if (!(citationArray[0].length > 0)) {
        throw new Error("Not enough columns");
      }
      for (citeLineItemIdx = i = 0, ref = citationArray[0].length - 1; 0 <= ref ? i <= ref : i >= ref; citeLineItemIdx = 0 <= ref ? ++i : --i) {
        citeLineItem = citationArray[0][citeLineItemIdx];
        if (citeLineItem !== "") {
          startColumn = citeLineItemIdx;
          break;
        }
      }
      if (!(citationArray[0].length >= startColumn)) {
        throw new Error("Not enough columns");
      }
      citeObj = {};
      for (j = 0, len = citationArray.length; j < len; j++) {
        citeLine = citationArray[j];
        newKey = citeLine[startColumn];
        newVal = citeLine[startColumn + 1];
        citeObj[newKey] = newVal;
      }
      if (citeObj[pdfKey] != null) {
        return citeObj[pdfKey];
      }
    }
    throw new Error("No citation found for PDF " + (thePDF.getPDFNumber()));
  },

  /**
  Returns the citation layer/comp name for a given PDF
  @memberof NFCitationLayer
  @param {NFPDF} thePDF - the PDF to make the name for
  @returns {String} the citation layer/comp name
   */
  nameFor: function(thePDF) {
    return (thePDF.getPDFNumber()) + " - Citation";
  },

  /**
  Creates a new citation composition. Note that citation comps, while NFComps,
  do not have their own unique wrapper class.
  @memberof NFCitationLayer
  @param {NFPDF} thePDF - the PDF to make the comp for
  @returns {NFComp} the new comp
   */
  newCitationComp: function(thePDF) {
    var bgBlur, bgBrightness, bgMask, bgSolid, citationString, citeComp, citeFolder, fontSize, maskPath, maskShape, sourceRectBgMask, sourceRectText, textBoxSizeX, textBoxSizeY, textLayer, textLayer_TextDocument, textLayer_TextProp;
    if (!(thePDF instanceof NFPDF)) {
      throw new Error("Missing parameters");
    }
    NFTools.log("Creating new citation comp for PDF: " + (thePDF.toString()), "NFCitationLayer");
    citationString = NFCitationLayer.fetchCitation(thePDF);
    citeFolder = NFCitationLayer.folder();
    citeComp = citeFolder.items.addComp(NFCitationLayer.nameFor(thePDF), 1920, 1080, 1, 600, 30);
    bgSolid = citeComp.layers.addSolid([0, 0, 0], 'colorCorrect', citeComp.width, citeComp.height, 1);
    bgSolid.adjustmentLayer = true;
    bgSolid.name = 'Background Blur';
    bgBlur = bgSolid.property('Effects').addProperty('ADBE Gaussian Blur 2');
    bgBlur.property('Blurriness').setValue(35);
    bgBrightness = bgSolid.property('Effects').addProperty('ADBE Brightness & Contrast 2');
    bgBrightness.property('Brightness').setValue(-148);
    fontSize = 37;
    textLayer = citeComp.layers.addBoxText([(fontSize + 20) * citationString.length, fontSize + 20], citationString);
    textLayer_TextProp = textLayer.property('ADBE Text Properties').property('ADBE Text Document');
    textLayer_TextDocument = textLayer_TextProp.value;
    textLayer_TextDocument.resetCharStyle();
    textLayer_TextDocument.fillColor = [1, 1, 1];
    textLayer_TextDocument.strokeWidth = 0;
    textLayer_TextDocument.font = 'Avenir Next';
    textLayer_TextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY;
    textLayer_TextDocument.fontSize = fontSize;
    textLayer_TextDocument.applyFill = true;
    textLayer_TextDocument.applyStroke = false;
    textLayer_TextProp.setValue(textLayer_TextDocument);
    textLayer.boxText = true;
    sourceRectText = textLayer.sourceRectAtTime(0, false);
    textLayer.anchorPoint.setValue([sourceRectText.left + sourceRectText.width, sourceRectText.top]);
    textBoxSizeX = textLayer_TextDocument.boxTextSize[0];
    textBoxSizeY = textLayer_TextDocument.boxTextSize[1];
    maskShape = new Shape;
    maskShape.vertices = [[0, sourceRectText.height + 20], [0, 0], [sourceRectText.width + 25, 0], [sourceRectText.width + 25, sourceRectText.height + 20]];
    maskShape.closed = true;
    bgMask = bgSolid.property('Masks').addProperty('Mask');
    maskPath = bgMask.property('Mask Path');
    maskPath.setValue(maskShape);
    sourceRectBgMask = bgSolid.sourceRectAtTime(0, false);
    bgSolid.anchorPoint.setValue([sourceRectText.width + 25, 0]);
    bgSolid.position.setValue([citeComp.width, 20, 0]);
    textLayer.position.setValue([citeComp.width - 10, 30, 0]);
    textLayer.moveBefore(bgSolid);
    return citeComp;
  },

  /**
  Creates a new NFCitationLayer for the given group
  @memberof NFCitationLayer
  @param {NFPaperLayerGroup} group - the group to make the citation layer for
  @returns {NFCitationLayer} the new citation layer
   */
  newCitationLayer: function(group) {
    var citationComp, citeLayer, compName, sourceExpression, thePDF;
    if (!(group instanceof NFPaperLayerGroup)) {
      throw new Error("Missing group");
    }
    thePDF = NFPDF.fromGroup(group);
    compName = NFCitationLayer.nameFor(thePDF);
    citationComp = NFProject.findItem(compName);
    if (citationComp == null) {
      citationComp = NFCitationLayer.newCitationComp(thePDF);
    }
    NFTools.log("Creating new citation layer for Group: " + (group.toString()), "NFCitationLayer");
    citeLayer = group.containingComp().insertComp({
      comp: new NFComp(citationComp),
      below: group.paperParent,
      time: group.paperParent.layer.inPoint
    });
    citeLayer.layer.collapseTransformation = true;
    sourceExpression = NFTools.readExpression("citation-opacity-expression");
    citeLayer.transform().property("Opacity").expression = sourceExpression;
    return citeLayer;
  }
});


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
Creates a new NFHighlightControlLayer from a given AVLayer
@class NFHighlightControlLayer
@classdesc Subclass of {@link NFLayer} for a highlight control layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@property {NFHighlightLayer} highlight - the highlight this layer controls
@extends NFLayer
@throws Will throw an error if not given an AVLayer with a highlight control
 */
var NFHighlightControlLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFHighlightControlLayer = (function(superClass) {
  extend(NFHighlightControlLayer, superClass);

  function NFHighlightControlLayer(layer) {
    NFLayer.call(this, layer);
    if (!NFHighlightControlLayer.isHighlightControlLayer(this.layer)) {
      throw new Error("NF Highlight Control Layer is invalid and the wrapper class cannot be created");
    }
    this;
  }

  NFHighlightControlLayer.prototype.toString = function() {
    return "NFHighlightControlLayer: '" + this.layer.name + "'";
  };


  /**
  Returns the spotlight marker
  @memberof NFHighlightControlLayer
  @returns {Object} the object for the spotlight marker with 'time' and 'value' keys
   */

  NFHighlightControlLayer.prototype.spotlightMarker = function() {
    var markerObject;
    markerObject = {
      value: this.markers().keyValue("Spotlight"),
      time: this.markers().keyTime("Spotlight")
    };
    return markerObject;
  };


  /**
  Sets the in point of the spotlight marker, keeping the out point where it is.
  If the new in point is after the current out point, the duration will become
  0 and the out point will move
  @memberof NFHighlightControlLayer
  @returns {NFHighlightControlLayer} self
  @param {float} newInPoint - the new in point
   */

  NFHighlightControlLayer.prototype.setSpotlightMarkerInPoint = function(newInPoint) {
    var newDuration, oldMarker, startDelta;
    oldMarker = this.spotlightMarker();
    startDelta = newInPoint - oldMarker.time;
    newDuration = oldMarker.value.duration - startDelta;
    if (newDuration < 0) {
      newDuration = 0;
    }
    this.markers().removeKey(this.layer.indexOfMarker("Spotlight"));
    this.addMarker({
      comment: "Spotlight",
      time: newInPoint,
      duration: newDuration
    });
    return this;
  };


  /**
  Sets the out point of the spotlight marker, keeping the in point where it is.
  If the new out point is before the current in point, the whole marker will
  move to the new out point with a duration of 0.
  @memberof NFHighlightControlLayer
  @returns {NFHighlightControlLayer} self
  @param {float} newOutPoint - the new out point
   */

  NFHighlightControlLayer.prototype.setSpotlightMarkerOutPoint = function(newOutPoint) {
    var currentOutPoint, delta, duration, newInPoint, oldMarker;
    oldMarker = this.spotlightMarker();
    if (newOutPoint < oldMarker.time) {
      newInPoint = newOutPoint;
      duration = 0;
    } else {
      newInPoint = oldMarker.time;
      currentOutPoint = oldMarker.time + oldMarker.value.duration;
      delta = newOutPoint - currentOutPoint;
      duration = oldMarker.value.duration + delta;
    }
    this.markers().removeKey(this.layer.indexOfMarker("Spotlight"));
    this.addMarker({
      comment: "Spotlight",
      time: newInPoint,
      duration: duration
    });
    return this;
  };


  /**
  Returns the AV Highlighter effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Highlighter Property on the control layer
   */

  NFHighlightControlLayer.prototype.highlighterEffect = function() {
    return this.layer.Effects.property("AV_Highlighter");
  };


  /**
  Returns the AV Highlight Control effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Highlighter Control property on the control layer
   */

  NFHighlightControlLayer.prototype.highlightControlEffect = function() {
    return this.layer.Effects.property("AV_Highlight_Control");
  };


  /**
  Returns the AV Spotlight effect
  @memberof NFHighlightControlLayer
  @returns {Property} the AV Spotlight property on the control layer
   */

  NFHighlightControlLayer.prototype.spotlightEffect = function() {
    return this.layer.Effects.property("AV_Spotlight");
  };

  return NFHighlightControlLayer;

})(NFLayer);

NFHighlightControlLayer = Object.assign(NFHighlightControlLayer, {

  /**
  Returns the name for a control layer for a given PDF Number and highlight
  @memberof NFHighlightControlLayer
  @returns {String} the appropriate name
   */
  nameForPDFNumberAndHighlight: function(num, highlight) {
    return num + " - " + highlight.layer.name + " Highlight Control";
  },

  /**
  Returns whether or not the given AVLayer is a valid Highlight Control Layer
  @memberof NFHighlightControlLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid highlight layer
   */
  isHighlightControlLayer: function(theLayer) {
    return theLayer.nullLayer && theLayer.name.indexOf("Highlight Control") >= 0;
  },

  /**
  Creates a new NFHighlightControlLayer for the given page, at the given time,
  for the given highlight
  @memberof NFHighlightControlLayer
  @param {Object} model - the model
  @param {NFPaperLayerGroup} model.group - the layer group
  @param {NFHighlightLayer} model.highlight - the highlight
  @param {float} model.time - the start time for the control
  @returns {NFHighlightControlLayer} the new control layer
   */
  newHighlightControlLayer: function(model) {
    var controlEffect, controlLayer, effects, existingControlLayers, highlighterEffect, partComp, ref;
    if (!(((model != null ? model.group : void 0) != null) && (model.highlight != null))) {
      throw new Error("Missing parameters");
    }
    NFTools.log("Creating new control layer for highlight: " + (model.highlight.toString()));
    partComp = model.group.containingComp();
    controlLayer = partComp.addNull();
    controlLayer.layer.name = NFHighlightControlLayer.nameForPDFNumberAndHighlight(model.group.getPDFNumber(), model.highlight);
    controlLayer = new NFHighlightControlLayer(controlLayer);
    existingControlLayers = model.group.getControlLayers();
    if (existingControlLayers.isEmpty()) {
      controlLayer.moveAfter(model.group.paperParent);
    } else {
      controlLayer.moveBefore(existingControlLayers.getTopmostLayer());
    }
    controlLayer.layer.startTime = (ref = model.time) != null ? ref : partComp.getTime();
    controlLayer.layer.endTime = controlLayer.layer.startTime + 5;
    controlLayer.setParent(model.group.paperParent);
    effects = controlLayer.effects();
    highlighterEffect = effects.addProperty("AV_Highlighter");
    highlighterEffect.name = model.highlight.layer.name;
    controlEffect = effects.addProperty("AV_Highlight_Control");
    controlEffect.name = "Highlight Control";
    controlEffect.property("Endless").setValue(true);
    controlLayer.addMarker({
      comment: "Spotlight",
      time: controlLayer.layer.startTime + 1,
      duration: 10
    });
    return controlLayer;
  }
});


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
      throw new Error("NF Highlight Layer must contain a shape layer with the 'AV Highlighter' effect");
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
  Returns the connected NFHighlightControlLayer if it exists
  @memberof NFHighlightLayer
  @returns {NFHighlightControlLayer | null} the control layer or null
   */

  NFHighlightLayer.prototype.getControlLayer = function() {
    var comp, compName, expression, layerName, possibleLayers;
    if (this.isBubbled()) {
      expression = this.highlighterEffect().property("Spacing").expression;
      compName = NF.Util.getCleanedArgumentOfPropertyFromExpression("comp", expression);
      layerName = NF.Util.getCleanedArgumentOfPropertyFromExpression("layer", expression);
      comp = new NFComp(NF.Util.findItem(compName));
      if (comp != null) {
        possibleLayers = comp.layersWithName(layerName);
        if (possibleLayers.isEmpty()) {
          return null;
        } else {
          return possibleLayers.get(0);
        }
      }
    }
  };


  /**
  Returns an array of Spotlight mask Properties that reference this layer
  @memberof NFHighlightLayer
  @returns {Property[]} a potentially empty array of spotlight
  mask Property objects
   */

  NFHighlightLayer.prototype.getSpotlightMasks = function() {
    var folder, item, items, j, len, part, spotlightLayer, spotlightLayers, targetMasks;
    folder = NFProject.findItem("Parts");
    items = NFProject.searchItems("Part", folder);
    spotlightLayers = new NFLayerCollection;
    for (j = 0, len = items.length; j < len; j++) {
      item = items[j];
      part = new NFPartComp(item);
      spotlightLayer = part.layerWithName(NFSpotlightLayer.nameForPDFNumber(this.getPDFNumber()));
      if (spotlightLayer != null) {
        spotlightLayers.add(spotlightLayer);
      }
    }
    if (spotlightLayers.isEmpty()) {
      return [];
    } else {
      targetMasks = [];
      spotlightLayers.forEach((function(_this) {
        return function(spotlight) {
          var possibleMask;
          possibleMask = spotlight.mask(_this.getName());
          if (possibleMask != null) {
            return targetMasks.push(possibleMask);
          }
        };
      })(this));
      return targetMasks;
    }
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
    return NFPDF.fromPDFNumber(this.getPDFNumber());
  };


  /**
  Returns the PDF number for the containing comp
  @memberof NFHighlightLayer
  @returns {String} the PDF number
   */

  NFHighlightLayer.prototype.getPDFNumber = function() {
    return this.containingComp().getPDFNumber();
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
      ref = NFHighlightLayer.highlighterProperties;
      for (j = 0, len = ref.length; j < len; j++) {
        property = ref[j];
        expression = this.highlighterEffect().property(property).expression;
        this.highlighterEffect().property(property).expression = expression.replace(new RegExp(" NFPage", 'g'), " [+]");
      }
    }
    return this;
  };


  /**
  Fixes the expression after initting if the page layer name changed and there was already an existing expression
  @memberof NFHighlightLayer
  @param {String} diffLetter - the letter to add
  @returns {NFHighlightLayer} self
   */

  NFHighlightLayer.prototype.fixExpressionWithDiffLetter = function(diffLetter) {
    var expression, j, len, property, ref, replString;
    if (this.isBubbled()) {
      ref = NFHighlightLayer.highlighterProperties;
      for (j = 0, len = ref.length; j < len; j++) {
        property = ref[j];
        expression = this.highlighterEffect().property(property).expression;
        replString = " [+] (" + diffLetter + ")\"";
        this.highlighterEffect().property(property).expression = expression.replace(" [+]\"", replString).replace(" [+]\"", replString);
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
      ref = NFHighlightLayer.highlighterProperties;
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
    var effect, i, j, k, len, mask, masks, property, propertyCount, ref, ref1;
    if ((ref = this.getControlLayer()) != null) {
      ref.remove();
    }
    masks = this.getSpotlightMasks();
    for (j = 0, len = masks.length; j < len; j++) {
      mask = masks[j];
      mask.remove();
    }
    effect = this.highlighterEffect();
    propertyCount = effect != null ? effect.numProperties : void 0;
    for (i = k = 1, ref1 = propertyCount; 1 <= ref1 ? k <= ref1 : k >= ref1; i = 1 <= ref1 ? ++k : --k) {
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
    return theLayer instanceof ShapeLayer && theLayer.Effects.numProperties > 0 && ((ref = theLayer.Effects.property(1)) != null ? ref.matchName : void 0) === "AV_Highlighter";
  },
  highlighterProperties: ['Spacing', 'Thickness', 'Start Offset', 'Completion', 'Offset', 'Opacity', 'Highlight Colour', 'End Offset']
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
        throw new Error("You can only add NFHighlightLayers to an NFHighlightLayerCollection");
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

  NFHighlightLayerCollection.prototype.add = function(newLayer) {
    if (newLayer.isAVLayer()) {
      this.layers.push(new NFHighlightLayer(newLayer));
    } else if (newLayer instanceof NFHighlightLayer) {
      this.layers.push(newLayer);
    } else {
      throw new Error("add() can only be used to add AVLayers or NFHighlightLayers to an NFHighlightLayerCollection");
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
      throw new Error("Can't getHighlightsInPage() when not given an NFPageComp");
    }
    highlightsInPage = new NFHighlightLayerCollection();
    ref = this.layers;
    for (i = 0, len = ref.length; i < len; i++) {
      highlight = ref[i];
      if (highlight.getPageComp().is(page)) {
        highlightsInPage.add(highlight);
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
      throw new Error("Can't create an NFPageComp from a non-page comp");
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
    throw new Error("Could not get the PDF Number from this NFPageComp");
  };


  /**
  Returns the page number as a String
  @memberof NFPageComp
  @throws Throws error if the number could not be found in this item
  @returns {string} the page number
   */

  NFPageComp.prototype.getPageNumber = function() {
    var endIdx, searchIndex;
    searchIndex = this.name.indexOf("pg");
    endIdx = this.name.indexOf(" NFPage");
    if (searchIndex > 0) {
      return this.name.substr(searchIndex + 2, endIdx);
    }
    throw new Error("Could not get the Page Number from this NFPageComp");
  };


  /**
  Returns the NFPDF this page lives in
  @memberof NFPageComp
  @returns {NFPDF} the PDF
   */

  NFPageComp.prototype.getPDF = function() {
    return NFPDF.fromPDFNumber(this.getPDFNumber());
  };


  /**
  Returns the base page name (everything before the space)
  @memberof NFPageComp
  @returns {String} the page base name
   */

  NFPageComp.prototype.getPageBaseName = function() {
    return this.name.substr(0, this.name.indexOf(' '));
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
        highlightLayers.add(theLayer);
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
    var foundHighlight;
    foundHighlight = null;
    this.highlights().forEach((function(_this) {
      return function(highlight) {
        if (highlight.getName() === name) {
          return foundHighlight = highlight;
        }
      };
    })(this));
    return foundHighlight;
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
      throw new Error("Cannot create an NFPageLayer from a layer without a source");
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
    var bubbledHighlights;
    bubbledHighlights = [];
    this.highlights().forEach((function(_this) {
      return function(highlight) {
        var ref;
        if (highlight.isBubbled() && ((ref = highlight.getControlLayer()) != null ? ref.containingComp().is(_this.containingComp()) : void 0)) {
          return bubbledHighlights.push(highlight);
        }
      };
    })(this));
    return new NFHighlightLayerCollection(bubbledHighlights);
  };


  /**
  Returns NFHighlightLayerCollection of all highlights that can be bubbled (aka
  not bubbled already and not broken)
  @memberof NFPageLayer
  @returns {NFHighlightLayerCollection} The collection of highlights
   */

  NFPageLayer.prototype.bubblableHighlights = function() {
    var bubblableHighlights;
    bubblableHighlights = [];
    this.highlights().forEach((function(_this) {
      return function(highlight) {
        if (!(highlight.isBubbled() && !highlight.isBroken())) {
          return bubblableHighlights.push(highlight);
        }
      };
    })(this));
    return new NFHighlightLayerCollection(bubblableHighlights);
  };


  /**
  Bubbles up given highlights or highlight to this comp by creating an
  NFHighlightControlLayer.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {NFHighlightLayer | NFHighlightLayerCollection}
  @throws Throw error if any highlight choices are connected and not broken,
  so you should have disconnected them first
  @throws Throw error if the given highlight is not in this page
  @throws Throw error if not given an NFHighlightLayer or NFHighlightLayerCollection
  @deprecated replaced by NFPaperLayerGroup#bubbleUp
   */

  NFPageLayer.prototype.bubbleUp = function(highlightsToBubble) {
    this.getPaperLayerGroup().bubbleUp(highlightsToBubble);
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
  Returns the base page name (everything before the space)
  @memberof NFPageLayer
  @returns {String} the page base name
   */

  NFPageLayer.prototype.getPageBaseName = function() {
    return this.layer.name.substr(0, this.layer.name.indexOf(' '));
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
  @param {float} [targetTime=Current Time] - the optional time of the containing comp to
  check at. Default is the current time of the containingComp.
  @returns {Object} the rect object with .left, .width, .hight, .top and
  .padding values
  @throws Throw error if highlight is not in page
   */

  NFPageLayer.prototype.sourceRectForHighlight = function(highlight, targetTime) {
    var currentTime, highlightRect;
    if (targetTime == null) {
      targetTime = null;
    }
    if (!this.containsHighlight(highlight)) {
      throw new Error("Can't get source rect for this highlight since it's not in the layer");
    }
    currentTime = this.containingComp().getTime();
    highlightRect = highlight.sourceRect();
    this.containingComp().setTime(currentTime);
    return this.relativeRect(highlightRect, targetTime);
  };


  /**
  Returns whether a given highlight is in this layer
  @memberof NFPageLayer
  @param {NFHighlightLayer} highlight - the highlight
  @returns {boolean} the result
   */

  NFPageLayer.prototype.containsHighlight = function(highlight) {
    var foundHighlight;
    foundHighlight = false;
    this.highlights().forEach((function(_this) {
      return function(testHighlight) {
        if (testHighlight.is(highlight)) {
          return foundHighlight = true;
        }
      };
    })(this));
    return foundHighlight;
  };


  /**
  Sets the start point of the layer to be the first frame of the page comp that
  we haven't seen before.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
   */

  NFPageLayer.prototype.makeContinuous = function() {
    var i, latestInternalEndTime, layerInstances, layersInComp, len, partComp, partComps, thePDF, thisPage;
    thisPage = this.getPageComp();
    thePDF = NFPDF.fromPageLayer(this);
    partComps = thePDF.containingPartComps();
    layerInstances = new NFPageLayerCollection;
    for (i = 0, len = partComps.length; i < len; i++) {
      partComp = partComps[i];
      layersInComp = partComp.layersForPage(thisPage);
      if (!layersInComp.isEmpty()) {
        layersInComp.forEach((function(_this) {
          return function(theLayer) {
            return layerInstances.add(theLayer);
          };
        })(this));
      }
    }
    if (!layerInstances.isEmpty()) {
      latestInternalEndTime = 0;
      layerInstances.forEach((function(_this) {
        return function(theInstance) {
          var internalEndTime;
          if (!theInstance.is(_this)) {
            internalEndTime = theInstance.internalEndTime();
            if (internalEndTime > latestInternalEndTime) {
              return latestInternalEndTime = internalEndTime;
            }
          }
        };
      })(this));
    }
    this.beginAt(latestInternalEndTime + this.containingComp().comp.frameDuration);
    return this;
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
    foldPosition = foldPositionProperty != null ? foldPositionProperty.valueAtTime(time, false) : void 0;
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
  Returns the NFPaperLayerGroup for this page, if it exists. Will not create one
  @memberof NFPageLayer
  @returns {NFPaperLayerGroup} the paper layer group
   */

  NFPageLayer.prototype.getPaperLayerGroup = function() {
    var paperParentLayer;
    paperParentLayer = this.getPaperParentLayer();
    if (paperParentLayer != null) {
      return new NFPaperLayerGroup(paperParentLayer);
    }
  };


  /**
  Slides in or out the pageLayer using markers. #slideIn and #slideOut both
  call this method
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.fromEdge=NFComp.AUTO] - The direction to slide in from.
  Default if page is centered is the right.
  @param {boolean} [model.in=yes] - If page should slide in. No means out
   */

  NFPageLayer.prototype.slide = function(model) {
    var animatingX, animatingY, compCenter, endEquation, endValue, layerCenter, positionProperty, slider, startEquation, startOffset, startValue, xVal, yVal, zVal;
    this.log("Sliding myself");
    if (model == null) {
      model = [];
    }
    if (model.fromEdge == null) {
      model.fromEdge = NFComp.AUTO;
    }
    if (model["in"] == null) {
      model["in"] = true;
    }
    if (model.fromEdge === NFComp.AUTO) {
      layerCenter = this.relativeCenterPoint();
      layerCenter = [Math.round(layerCenter[0], Math.round(layerCenter[1]))];
      compCenter = this.containingComp().centerPoint();
      compCenter = [Math.round(compCenter[0], Math.round(compCenter[1]))];
      if (layerCenter[0] < compCenter[0]) {
        model.fromEdge = NFComp.LEFT;
      } else {
        model.fromEdge = NFComp.RIGHT;
      }
    }
    positionProperty = this.layer.property("Transform").property("Position");
    animatingX = model.fromEdge === NFComp.RIGHT || model.fromEdge === NFComp.LEFT;
    animatingY = model.fromEdge === NFComp.TOP || model.fromEdge === NFComp.BOTTOM;
    if (!(animatingX || animatingY)) {
      throw new Error("Invalid Edge");
    }
    startOffset = (function() {
      switch (false) {
        case model.fromEdge !== NFComp.RIGHT:
          return 3000;
        case model.fromEdge !== NFComp.LEFT:
          return -3000;
        case model.fromEdge !== NFComp.BOTTOM:
          return this.containingComp().comp.height * 1.1;
        case model.fromEdge !== NFComp.TOP:
          return this.sourceRect().height * 1.1;
        default:
          return 0;
      }
    }).call(this);
    slider = this.addSlider("Start Offset", startOffset);
    xVal = (function() {
      switch (false) {
        case !animatingX:
          return slider.property("Slider");
        default:
          return positionProperty.value[0];
      }
    })();
    yVal = (function() {
      switch (false) {
        case !animatingY:
          return slider.property("Slider");
        default:
          return positionProperty.value[1];
      }
    })();
    zVal = positionProperty.value[2];
    if (model["in"]) {
      startEquation = EasingEquation.quint.out;
      startValue = [xVal, yVal, zVal];
    } else {
      endEquation = EasingEquation.quint["in"];
      endValue = [xVal, yVal, zVal];
    }
    this.addInOutMarkersForProperty({
      property: positionProperty,
      startEquation: startEquation,
      startValue: startValue,
      endEquation: endEquation,
      endValue: endValue
    });
    return this;
  };


  /**
  Slides in the pageLayer using markers.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.fromEdge=NFComp.AUTO] - The direction to slide in from.
  Default if page is centered is the right.
   */

  NFPageLayer.prototype.slideIn = function(model) {
    return this.slide({
      "in": true,
      fromEdge: model != null ? model.fromEdge : void 0
    });
  };


  /**
  Slides out the pageLayer using markers.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {enum} [model.toEdge=NFComp.AUTO] - The direction to slide out to.
  Default if page is centered is the right.
   */

  NFPageLayer.prototype.slideOut = function(model) {
    return this.slide({
      "in": false,
      fromEdge: model != null ? model.toEdge : void 0
    });
  };


  /**
  Adds the pageturn effect, motion blur effect and drop shadow to the layer in
  a given pageturn status. Overwrites existing drop shadow effects, but leaves
  existing force motion blur and page turns
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Enum} [pageTurnStatus=NFPageLayer.PAGETURN_FLIPPED_DOWN] - The status
  to set the turn up with
   */

  NFPageLayer.prototype.setupPageTurnEffect = function(pageTurnStatus) {
    var dropShadowEffect, dropShadowMatchName, foldPosition, forceMotionBlurEffect, forceMotionBlurMatchName, pageTurnEffect, pageTurnMatchName;
    this.log("Setting up page turn effect");
    forceMotionBlurMatchName = "CC Force Motion Blur";
    dropShadowMatchName = "ADBE Drop Shadow";
    pageTurnMatchName = "CC Page Turn";
    pageTurnEffect = this.effect(pageTurnMatchName);
    if (pageTurnEffect == null) {
      pageTurnEffect = this.effects().addProperty(pageTurnMatchName);
      pageTurnEffect.property("Fold Radius").setValue(500);
      foldPosition = pageTurnEffect.property("Fold Position");
      if (pageTurnStatus === NFPageLayer.PAGETURN_FLIPPED_UP) {
        foldPosition.setValue(this.pageTurnUpPosition());
      } else if (pageTurnStatus === NFPageLayer.PAGETURN_FLIPPED_DOWN || (pageTurnStatus == null)) {
        foldPosition.setValue(this.pageTurnDownPosition());
      } else {
        throw new Error("Invalid page turn type for initial position");
      }
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
    return this;
  };


  /**
  Simply calculates and returns the property values for CC page turn's position
  for which the page is flipped down.
  @memberof NFPageLayer
  @returns {float[]} the position property of the pageturn effect when this page
  is flipped down
   */

  NFPageLayer.prototype.pageTurnDownPosition = function() {
    var comp, downPosition, pageSize;
    comp = this.getPageComp();
    pageSize = {
      width: comp.comp.width,
      height: comp.comp.height
    };
    return downPosition = [pageSize.width, pageSize.height];
  };


  /**
  Simply calculates and returns the property values for CC page turn's position
  for which the page is flipped up.
  @memberof NFPageLayer
  @returns {float[]} the position property of the pageturn effect when this page
  is flipped up
   */

  NFPageLayer.prototype.pageTurnUpPosition = function() {
    var comp, pageSize, upPosition;
    comp = this.getPageComp();
    pageSize = {
      width: comp.comp.width,
      height: comp.comp.height
    };
    return upPosition = [-pageSize.width, -pageSize.height];
  };


  /**
  Animates a page turn, essentially toggling the current page turn status.
  Throws an error if the page is not all the way up or down at the start time.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} [model] - The options
  @param {float} [model.time=The current time] - The time to start the turn at
  @param {float} [model.duration=1.5] - The duration of the pageturn
  @param {boolean} [model.trim=no] - Trim the layer after the turn is complete.
  Defaults to YES if we're folding up, and NO if we're folding down.
   */

  NFPageLayer.prototype.animatePageTurn = function(model) {
    var endStatus, endTime, foldPosition, positions, startStatus, startTime, targetStatus, times;
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
      this.setupPageTurnEffect();
    }
    if (startStatus === NFPageLayer.PAGETURN_BROKEN) {
      throw new Error("Page turn keyframes seem broken...");
    }
    if (startStatus === NFPageLayer.PAGETURN_TURNING || endStatus === NFPageLayer.PAGETURN_TURNING) {
      throw new Error("Page is already turning at start or end time of new turn");
    }
    positions = [this.pageTurnDownPosition(), this.pageTurnUpPosition()];
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
    this.log("Animating page turn");
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


  /**
  Moves the layer so that a given highlight is visible and centered in frame,
  at the given time. Adds keyframes only if keyframes already exist on the
  layer's position or scale properties.
  @memberof NFPageLayer
  @returns {NFPageLayer} self
  @param {Object} model - The options
  @param {NFHighlightLayer} model.highlight - The highlight to move to
  @param {float} [model.time=The current time] - The time to frame up at
  @param {float} [model.fillPercentage=85] - Percentage of the comp width the
  highlight should take up
  @param {float} [model.maxScale=115] - The maximum that a page layer will scale
  @throws Throws error if not given a NFHighlightLayer as model.highlight or
  given highlight is not on this page.
   */

  NFPageLayer.prototype.frameUpHighlight = function(model) {
    var hasPositionKeyframes, hasScaleKeyframes, initialPosition, initialScale, originalParent, originalTime, positionDelta, positionProp, ref, scaleFactor, scaleProp, targetPosition, targetScale;
    if (!((model != null ? model.highlight : void 0) instanceof NFHighlightLayer && this.containsHighlight(model.highlight))) {
      throw new Error("Invalid highlight");
    }
    this.log("Framing up highlight: " + (model.highlight.toString()));
    positionProp = this.transform().position;
    scaleProp = this.transform().scale;
    originalTime = this.containingComp().getTime();
    model.time = (ref = model.time) != null ? ref : originalTime;
    this.containingComp().setTime(model.time);
    originalParent = this.getParent();
    this.setParent(null);
    hasPositionKeyframes = positionProp.numKeys !== 0;
    hasScaleKeyframes = scaleProp.numKeys !== 0;
    scaleFactor = this.getScaleFactorToFrameUpHighlight(model);
    initialScale = scaleProp.valueAtTime(model.time, false);
    targetScale = [initialScale[0] * scaleFactor, initialScale[1] * scaleFactor];
    if (hasScaleKeyframes) {
      scaleProp.setValueAtTime(model.time, targetScale);
    } else {
      scaleProp.setValue(targetScale);
    }
    positionDelta = this.getPositionDeltaToFrameUpHighlight(model);
    initialPosition = positionProp.valueAtTime(model.time, false);
    targetPosition = [initialPosition[0] + positionDelta[0], initialPosition[1] + positionDelta[1]];
    if (hasPositionKeyframes) {
      positionProp.setValueAtTime(model.time, targetPosition);
    } else {
      positionProp.setValue(targetPosition);
    }
    this.setParent(originalParent);
    this.containingComp().setTime(originalTime);
    return this;
  };


  /**
  Returns the multiplier, or scale factor required to frame up the given
  highlight in this layer's Containing comp. Basically, multiplying the scale
  of this layer by the result of this number will make the highlight fit in
  frame perfectly.
  @memberof NFPageLayer
  @returns {float} the scale factor
  @param {Object} model - the options
  @param {NFHighlightLayer} model.highlight - The highlight to get the scale
  factor for.
  @param {float} [model.time=The current time] - The time to calculate at
  @param {float} [model.fillPercentage=85] - Percentage of the comp width the
  highlight should take up
  @param {float} [model.maxScale=115] - The maximum that a page layer will scale
  @throws Throws error if not given a NFHighlightLayer or
  given highlight is not on this page.
   */

  NFPageLayer.prototype.getScaleFactorToFrameUpHighlight = function(model) {
    var absoluteScale, adjustedScaleFactor, calculatedScale, compWidth, highlightRect, ref, ref1, ref2, ref3, scaleFactor, targetHighlightWidth;
    model = {
      highlight: (function() {
        if ((ref = model.highlight) != null) {
          return ref;
        } else {
          throw new Error("No highlight!");
        }
      })(),
      time: (ref1 = model.time) != null ? ref1 : this.containingComp().getTime(),
      fillPercentage: (ref2 = model.fillPercentage) != null ? ref2 : 85,
      maxScale: (ref3 = model.maxScale) != null ? ref3 : 115
    };
    if (!(model.highlight instanceof NFHighlightLayer && this.containsHighlight(model.highlight))) {
      throw new Error("Invalid highlight");
    }
    highlightRect = this.sourceRectForHighlight(model.highlight, model.time);
    compWidth = this.containingComp().comp.width;
    targetHighlightWidth = model.fillPercentage / 100 * compWidth;
    scaleFactor = targetHighlightWidth / highlightRect.width;
    absoluteScale = this.getAbsoluteScale();
    calculatedScale = scaleFactor * absoluteScale[0];
    if (calculatedScale > model.maxScale) {
      adjustedScaleFactor = model.maxScale / absoluteScale[0];
    } else if (calculatedScale < 50) {
      adjustedScaleFactor = 50 / absoluteScale[0];
    } else {
      adjustedScaleFactor = scaleFactor;
    }
    return adjustedScaleFactor;
  };


  /**
  Returns a length-2 array with x and y 'nudge' values to make the given
  highlight be centered in frame *at the current scale of the layer*.
  @memberof NFPageLayer
  @returns {float[]} the x and y nudge values
  @param {Object} model - The options
  @param {NFHighlightLayer} model.highlight - The highlight to get the scale
  factor for.
  @param {float} [model.time=The current time] - The time to calculate at
  @throws Throws error if not given a NFHighlightLayer or
  given highlight is not on this page.
   */

  NFPageLayer.prototype.getPositionDeltaToFrameUpHighlight = function(model) {
    var compCenterPoint, delta, highlightCenterPoint, highlightRect, rectAfterReposition;
    if (!(model.highlight instanceof NFHighlightLayer && this.containsHighlight(model.highlight))) {
      throw new Error("Invalid highlight");
    }
    highlightRect = this.sourceRectForHighlight(model.highlight, model.time);
    highlightCenterPoint = [highlightRect.left + highlightRect.width / 2, highlightRect.top + highlightRect.height / 2];
    compCenterPoint = [this.containingComp().comp.width / 2, this.containingComp().comp.height / 2];
    delta = [compCenterPoint[0] - highlightCenterPoint[0], compCenterPoint[1] - highlightCenterPoint[1]];
    rectAfterReposition = this.sourceRect(model.time);
    rectAfterReposition.left += delta[0];
    rectAfterReposition.top += delta[1];
    if (rectAfterReposition.left > 0) {
      delta[0] -= rectAfterReposition.left;
    }
    if (rectAfterReposition.top > 0) {
      delta[1] -= rectAfterReposition.top;
    }
    if (rectAfterReposition.left + rectAfterReposition.width < this.containingComp().comp.width) {
      delta[0] += this.containingComp().comp.width - (rectAfterReposition.left + rectAfterReposition.width);
    }
    if (rectAfterReposition.top + rectAfterReposition.height < this.containingComp().comp.height) {
      delta[1] += this.containingComp().comp.height - (rectAfterReposition.top + rectAfterReposition.height);
    }
    return delta;
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
    var j, len, ref, theLayer;
    NFLayerCollection.call(this, layerArr);
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (!(theLayer instanceof NFPageLayer)) {
        throw new Error("You can only add NFPageLayers to an NFPageLayerCollection");
      }
    }
    this;
  }

  NFPageLayerCollection.prototype.toString = function() {
    var infoString, j, len, ref, theLayer;
    infoString = "NFPageLayerCollection: [";
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
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

  NFPageLayerCollection.prototype.add = function(newLayer) {
    if (newLayer.isAVLayer()) {
      this.layers.push(new NFPageLayer(newLayer));
    } else if (newLayer instanceof NFPageLayer) {
      this.layers.push(newLayer);
    } else {
      throw new Error("add() can only be used to add AVLayers or NFPageLayers to an NFPageLayerCollection");
    }
    return this;
  };


  /**
  Returns NFHighlightLayerCollection of all highlights in all pages in the collection
  @memberof NFPageLayerCollection
  @returns {NFHighlightLayerCollection} all highlights in all pages in this collection
   */

  NFPageLayerCollection.prototype.highlights = function() {
    var containingLayerArray, highlightArray, highlights;
    highlightArray = [];
    containingLayerArray = [];
    this.forEach((function(_this) {
      return function(theLayer) {
        if (theLayer instanceof NFPageLayer) {
          return theLayer.highlights().forEach(function(highlight) {
            highlightArray.push(highlight);
            return containingLayerArray.push(theLayer);
          });
        }
      };
    })(this));
    highlights = new NFHighlightLayerCollection(highlightArray);
    return highlights;
  };


  /**
  Returns the NFPageLayerCollection of the pagelayers in the collection with
  the given highlight in them
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} the layers with the highlight
  @param {NFHighlightLayer} highlight - the highlight to look for
   */

  NFPageLayerCollection.prototype.layersWithHighlight = function(highlight) {
    var foundHighlights;
    foundHighlights = new NFPageLayerCollection;
    this.forEach((function(_this) {
      return function(theLayer) {
        if (theLayer instanceof NFPageLayer) {
          return theLayer.highlights().forEach(function(testHighlight) {
            if (highlight.is(testHighlight)) {
              return foundHighlights.add(theLayer);
            }
          });
        }
      };
    })(this));
    return foundHighlights;
  };


  /**
  Bubbles up the highlights in the given NFHighlightLayerCollection onto the
  page layers in this collection
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
  @param {NFHighlightLayerCollection} highlightCollection - the highlights to bubble up
  @deprecated replaced by NFPaperLayerGroup#bubbleUp
   */

  NFPageLayerCollection.prototype.bubbleUpHighlights = function(highlightCollection) {
    this.getPaperLayerGroup().bubbleUp(highlightCollection);
    return this;
  };


  /**
  Returns true if the collection only contains pages from the same PDF
  @memberof NFPageLayerCollection
  @returns {boolean} whether all pages in this collection are from the same PDF
   */

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
    var j, len, page, ref;
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      page = ref[j];
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
    var j, len, page, ref;
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      page = ref[j];
      page.initTransforms();
    }
    return this;
  };


  /**
  Gives unique names to each layer and updates bubbled highlights
  @memberof NFPageLayerCollection
  @returns {NFPageLayerCollection} self
   */

  NFPageLayerCollection.prototype.differentiate = function() {
    var alphabet, bubbledToFix, i, j, k, l, lastUsedLetterIndex, len, letteredNames, noLetterNames, ref, ref1, ref2, theLayer;
    if (this.isEmpty()) {
      return this;
    }
    noLetterNames = new NFPageLayerCollection;
    letteredNames = new NFPageLayerCollection;
    ref = this.layers;
    for (j = 0, len = ref.length; j < len; j++) {
      theLayer = ref[j];
      if (theLayer.getName().indexOf("(") >= 0 && theLayer.getName().indexOf(")") >= 0) {
        letteredNames.add(theLayer);
      } else {
        noLetterNames.add(theLayer);
      }
    }
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    if (letteredNames.isEmpty()) {
      for (i = k = 0, ref1 = noLetterNames.count() - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        theLayer = noLetterNames.layers[i];
        bubbledToFix = theLayer.bubbledHighlights();
        if (!bubbledToFix.isEmpty()) {
          bubbledToFix.forEach((function(_this) {
            return function(highlight) {
              return highlight.fixExpressionWithDiffLetter(alphabet[i]);
            };
          })(this));
        }
        theLayer.layer.name += " (" + alphabet[i] + ")";
        bubbledToFix.resetExpressionErrors();
      }
    } else {
      lastUsedLetterIndex = null;
      letteredNames.forEach((function(_this) {
        return function(theLayer) {
          var lastUsedLetter, letterIndex;
          lastUsedLetter = theLayer.getName().charAt(theLayer.getName().indexOf("(") + 1);
          letterIndex = alphabet.indexOf(lastUsedLetter);
          if (lastUsedLetterIndex != null) {
            if (letterIndex > lastUsedLetterIndex) {
              return lastUsedLetterIndex = letterIndex;
            }
          } else {
            return lastUsedLetterIndex = letterIndex;
          }
        };
      })(this));
      if (lastUsedLetterIndex == null) {
        throw new Error("Something is wrong with the layer naming...");
      }
      for (i = l = 0, ref2 = noLetterNames.count() - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; i = 0 <= ref2 ? ++l : --l) {
        theLayer = noLetterNames.layers[i];
        bubbledToFix = theLayer.bubbledHighlights();
        if (!bubbledToFix.isEmpty()) {
          bubbledToFix.forEach((function(_this) {
            return function(highlight) {
              return highlight.fixExpressionWithDiffLetter(alphabet[lastUsedLetterIndex + 1]).resetExpressionErrors();
            };
          })(this));
        }
        theLayer.layer.name += " (" + alphabet[lastUsedLetterIndex + 1] + ")";
        bubbledToFix.resetExpressionErrors();
      }
    }
    return this;
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
      throw new Error("Can't create a paper parent layer with no target layers");
    }
    if (!this.fromSamePDF()) {
      throw new Error("Can't create a single paper parent layer for page layers from different PDFs");
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
      throw new Error("Can't create a paper parent layer with no target layers");
    }
    if (!this.fromSamePDF()) {
      throw new Error("Can't create a single paper parent layer for page layers from different PDFs");
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
      throw new Error("Can only create a NFPaperParentLayer from a null layer");
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
      throw new Error("Cannot set paper parent layer name because it has no child layers");
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
    return layer.nullLayer && layer.name.indexOf('PDF') >= 0;
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
      throw new Error("Can't create an NFPartComp from a non-part comp");
    }
    this;
  }

  NFPartComp.prototype.toString = function() {
    return "NFPartComp: '" + this.name + "'";
  };


  /**
  Animates to a given highlight or page, with options. Will throw an error if
  there are
  other animations that take place after the current time on the same PDF in
  this comp. Must include one of model.highlight or model.page
  @memberof NFPartComp
  @param {Object} model - the model object
  @param {NFHighlightLayer} [model.highlight] - the highlight to animate to
  @param {NFPageComp} [model.page] - the page to animate to
  @param {float} [model.animationDuration=3] - the length of the move and scale
  @param {float} [model.pageTurnDuration=2] - the length of the pageturn
  @param {float} [model.maxPageScale=115] - the maximum a page will scale
  @param {float} [model.fillPercentage=85] - the percentage of the comp width
  for the final highlight to take up
  @param {boolean} [model.skipTitle=false] - whether we should skip going to the
  title page if this PDF is new in the project
  @throws Throw error if not given a highlight
  @throws Throw error if there is movement on the target page parent layer
  after the current comp time in this comp.
  @returns {NFPageLayer|NFHighlightLayer} model.page or model.highlight
   */

  NFPartComp.prototype.animateTo = function(model) {
    var activePDF, activePageLayer, alreadyInThisPart, containingPartComps, group, i, isTitlePage, isUsedInPartAboveCurrentLayer, j, layersForPage, pageTurnDuration, posProp, preAnimationTime, prevGroup, ref, ref1, ref2, ref3, ref4, ref5, ref6, targetGroup, targetPDF, targetPage, targetPageLayer, titlePage, titlePageLayer;
    model = {
      highlight: model.highlight,
      page: model.page,
      animationDuration: (ref = model.animationDuration) != null ? ref : 3,
      pageTurnDuration: (ref1 = model.pageTurnDuration) != null ? ref1 : 2,
      maxPageScale: (ref2 = model.maxPageScale) != null ? ref2 : 115,
      skipTitle: (ref3 = model.skipTitle) != null ? ref3 : false,
      fillPercentage: (ref4 = model.fillPercentage) != null ? ref4 : 85
    };
    if (!((model.highlight != null) || (model.page != null))) {
      throw new Error("No highlight or page to animate to");
    }
    if ((model.highlight != null) && (model.page != null)) {
      throw new Error("Cannot animate to both a page and highlight.");
    }
    if (model.page != null) {
      if (!(model.page instanceof NFPageComp)) {
        throw new Error("Page is of wrong type");
      }
      targetPDF = model.page.getPDF();
    } else if (model.highlight != null) {
      if (!(model.highlight instanceof NFHighlightLayer)) {
        throw new Error("Highlight is of wrong type");
      }
      targetPDF = model.highlight.getPDF();
    }
    containingPartComps = targetPDF.containingPartComps();
    targetPage = (ref5 = model.page) != null ? ref5 : model.highlight.getPageComp();
    preAnimationTime = this.getTime();
    activePDF = this.activePDF();
    if (activePDF != null) {
      prevGroup = this.groupFromPDF(activePDF);
    }
    if (containingPartComps.length === 0) {
      activePageLayer = this.activePage();
      if (model.skipTitle === false) {
        titlePage = targetPDF.getTitlePage();
        titlePageLayer = this.insertPage({
          page: titlePage,
          animate: true
        });
        if (prevGroup != null) {
          prevGroup.trim(titlePageLayer.getInMarkerTime());
        }
        group = new NFPaperLayerGroup(titlePageLayer.getPaperParentLayer());
        group.getCitationLayer().show(this.getTime() + 0.5);
        if (model.highlight != null) {
          if (targetPage.is(titlePage)) {
            this.setTime(titlePageLayer.getInMarkerTime());
            group.bubbleUp(model.highlight, this.getTime() - 0.5);
            group.moveToHighlight({
              highlight: model.highlight,
              duration: model.animationDuration,
              maxScale: model.maxPageScale,
              fillPercentage: model.fillPercentage
            });
          } else {
            this.setTime(titlePageLayer.getInMarkerTime() - 0.4);
            targetPageLayer = this.insertPage({
              page: targetPage,
              below: titlePageLayer,
              frameUp: {
                highlight: model.highlight,
                fillPercentage: model.fillPercentage * 0.7
              }
            });
            if ((model.highlight != null) && !model.highlight.isBubbled()) {
              group.bubbleUp(model.highlight, titlePageLayer.getInMarkerTime() + 0.5);
            }
            titlePageLayer.animatePageTurn();
            if (model.highlight != null) {
              group.moveToHighlight({
                highlight: model.highlight,
                duration: model.animationDuration,
                fillPercentage: model.fillPercentage,
                maxScale: model.maxPageScale
              });
            }
          }
        }
      } else {
        targetPageLayer = this.insertPage({
          page: targetPage,
          animate: true,
          frameUp: {
            highlight: model.highlight,
            fillPercentage: model.fillPercentage
          }
        });
        group = new NFPaperLayerGroup(targetPageLayer.getPaperParentLayer());
        group.getCitationLayer().show(this.getTime() + 0.5);
        prevGroup.trim(targetPageLayer.getInMarkerTime());
        if ((model.highlight != null) && !model.highlight.isBubbled()) {
          group.bubbleUp(model.highlight, this.getTime() + 0.25);
        }
      }
    } else {
      targetGroup = this.groupFromPDF(targetPDF);
      if (targetGroup != null) {
        posProp = targetGroup.paperParent.transform().position;
        if (posProp.numKeys > 0) {
          for (i = j = 1, ref6 = posProp.numKeys; 1 <= ref6 ? j <= ref6 : j >= ref6; i = 1 <= ref6 ? ++j : --j) {
            if (posProp.keyTime(i) > this.getTime()) {
              throw new Error("Can't animate to page or highlight because animations exist in the FUTURE on the target PDF");
            }
          }
        }
      }
      if (this.activePDF().is(targetPDF)) {
        activePageLayer = this.activePage();
        group = new NFPaperLayerGroup(activePageLayer.getPaperParentLayer());
        if (targetPage.is(activePageLayer.getPageComp())) {
          if (model.highlight != null) {
            group.moveToHighlight({
              highlight: model.highlight,
              duration: model.animationDuration,
              fillPercentage: model.fillPercentage,
              maxScale: model.maxPageScale
            });
          }
          group.trimActiveSpotlights(this.getTime() + (model.animationDuration / 2));
          if ((model.highlight != null) && !model.highlight.isBubbled()) {
            group.bubbleUp(model.highlight, this.getTime() + (model.animationDuration / 2));
            model.highlight.getControlLayer().setSpotlightMarkerInPoint(this.getTime() + (model.animationDuration / 2));
          }
        } else {
          layersForPage = this.layersForPage(targetPage);
          isUsedInPartAboveCurrentLayer = layersForPage.count() > 0 && layersForPage.layers[0].index() < activePageLayer.index();
          isTitlePage = targetPDF.getTitlePage().getPageNumber() === targetPage.getPageNumber();
          if (isUsedInPartAboveCurrentLayer || isTitlePage) {
            targetPageLayer = this.insertPage({
              page: targetPage,
              above: activePageLayer,
              time: this.getTime() - 0.5,
              pageTurn: NFPageLayer.PAGETURN_FLIPPED_UP,
              continuous: true,
              frameUp: {
                highlight: model.highlight,
                fillPercentage: model.fillPercentage * 2
              }
            });
            pageTurnDuration = 2.0;
            targetPageLayer.animatePageTurn({
              time: this.getTime() - 0.5,
              duration: pageTurnDuration
            });
            if (model.highlight != null) {
              group.moveToHighlight({
                highlight: model.highlight,
                duration: model.animationDuration,
                fillPercentage: model.fillPercentage
              });
            }
            group.trim(this.getTime() - 0.5 + 2.0);
            if ((model.highlight != null) && !model.highlight.isBubbled()) {
              group.bubbleUp(model.highlight, this.getTime() + 0.5);
              model.highlight.getControlLayer().setSpotlightMarkerInPoint(this.getTime() + 0.5);
            }
          } else {
            targetPageLayer = this.insertPage({
              page: targetPage,
              below: activePageLayer,
              time: this.getTime() - 0.5,
              continuous: true,
              frameUp: {
                highlight: model.highlight,
                fillPercentage: model.fillPercentage * 0.7
              }
            });
            activePageLayer.animatePageTurn({
              time: this.getTime() - 0.5,
              duration: 2.0
            });
            if (model.highlight != null) {
              group.moveToHighlight({
                highlight: model.highlight,
                duration: model.animationDuration,
                fillPercentage: model.fillPercentage
              });
            }
            group.trimActiveSpotlights(this.getTime() + 0.5);
            if ((model.highlight != null) && !model.highlight.isBubbled()) {
              group.bubbleUp(model.highlight, this.getTime() + 0.5);
              model.highlight.getControlLayer().setSpotlightMarkerInPoint(this.getTime() + 0.5);
            }
          }
        }
      } else {
        activePageLayer = this.activePage();
        targetGroup = this.groupFromPDF(targetPDF);
        activePDF = this.activePDF();
        if (activePDF != null) {
          prevGroup = this.groupFromPDF(activePDF);
        }
        alreadyInThisPart = targetGroup != null;
        targetPageLayer = this.insertPage({
          page: targetPage,
          continuous: true,
          frameUp: {
            highlight: model.highlight,
            fillPercentage: model.fillPercentage
          }
        });
        targetGroup = this.groupFromPDF(targetPDF);
        targetGroup.getCitationLayer().show(this.getTime() + 0.5);
        if (alreadyInThisPart) {
          targetGroup.gatherLayers(new NFLayerCollection([targetPageLayer]));
          if (targetPageLayer.index() < activePageLayer.index()) {
            targetPageLayer.slideIn();
            if (prevGroup != null) {
              prevGroup.trim(targetPageLayer.getInMarkerTime());
            }
          } else {
            if (prevGroup != null) {
              prevGroup.trim(targetPageLayer.layer.inPoint + 2.0);
            }
            activePageLayer.slideOut();
          }
        } else {
          targetPageLayer.slideIn();
          if (prevGroup != null) {
            prevGroup.trim(targetPageLayer.getInMarkerTime());
          }
        }
        if ((model.highlight != null) && !model.highlight.isBubbled()) {
          targetGroup.bubbleUp(model.highlight, this.getTime() + 0.25);
        }
      }
    }
    this.setTime(preAnimationTime);
    return model.page || model.highlight;
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
  @param {float} [model.time=Current Time] The time to insert at
  @param {Enum} [model.pageTurn=PAGETURN_NONE] the pageTurn of the page
  @param {boolean} [model.continuous=no] whether to start the page at the
  first frame of it's composition that we haven't seen yet.
  @throws Throw error if given values for more than one of .above, .below,
  and .at
   */

  NFPartComp.prototype.insertPage = function(model) {
    var group, layersForPage, pageLayer, ref, ref1, ref2;
    this.log("Inserting page: " + model.page.comp.name);
    if (!((model.page != null) && model.page instanceof NFPageComp)) {
      throw new Error("No page given to insert...");
    }
    if (!((model.above != null) || (model.below != null) || (model.at != null))) {
      model.at = 1;
    }
    model.time = (ref = model.time) != null ? ref : this.getTime();
    model.pageTurn = (ref1 = model.pageTurn) != null ? ref1 : NFPageLayer.PAGETURN_NONE;
    model.continuous = (ref2 = model.continuous) != null ? ref2 : false;
    pageLayer = this.insertComp({
      comp: model.page,
      above: model.above,
      below: model.below,
      at: model.at,
      time: model.time
    });
    if (model.init !== false) {
      pageLayer.initTransforms().init();
      group = new NFPaperLayerGroup(pageLayer.assignPaperParentLayer());
      group.assignCitationLayer();
    }
    if ((model.frameUp != null) && (model.frameUp.highlight != null)) {
      pageLayer.frameUpHighlight(model.frameUp);
    }
    if (model.animate === true) {
      pageLayer.slideIn();
    }
    if (model.pageTurn === NFPageLayer.PAGETURN_FLIPPED_UP || model.pageTurn === NFPageLayer.PAGETURN_FLIPPED_DOWN) {
      pageLayer.setupPageTurnEffect(model.pageTurn);
    } else if (model.pageTurn !== NFPageLayer.PAGETURN_NONE) {
      throw new Error("Invalid pageturn type to insert page with");
    }
    if (model.continuous) {
      pageLayer.makeContinuous();
    }
    layersForPage = this.layersForPage(model.page);
    if (!(layersForPage.count() < 2)) {
      layersForPage.differentiate();
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
      throw new Error("This NFPartComp has no zoomer!");
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


  /**
  Returns an NFPaperLayerGroup for a given PDF in the part comp
  @memberof NFPartComp
  @param {NFPDF} pdf - the PDF to look for
  @returns {NFPaperLayerGroup | null} The found group
   */

  NFPartComp.prototype.groupFromPDF = function(pdf) {
    var matchedLayers, parentLayer;
    if (!(pdf instanceof NFPDF)) {
      throw new Error("given pdf is not an NFPDF");
    }
    matchedLayers = new NFLayerCollection;
    parentLayer = this.layerWithName(pdf.getName());
    if (parentLayer != null) {
      return new NFPaperLayerGroup(parentLayer);
    } else {
      return null;
    }
  };


  /**
  Returns an NFPageLayerCollection of NFPageLayers in this comp that
  contain the given NFPageComp
  @memberof NFPartComp
  @param {NFPageComp} page - the page to look for
  @returns {NFPageLayerCollection} The found page layers
   */

  NFPartComp.prototype.layersForPage = function(page) {
    var matchedPages;
    if (!(page instanceof NFPageComp)) {
      throw new Error("given page is not an NFPageComp");
    }
    matchedPages = new NFPageLayerCollection;
    this.allLayers().forEach((function(_this) {
      return function(theLayer) {
        if (theLayer instanceof NFPageLayer && theLayer.getPageComp().is(page)) {
          return matchedPages.add(theLayer);
        }
      };
    })(this));
    return matchedPages;
  };

  return NFPartComp;

})(NFComp);


/**
Creates a new NFSpotlightLayer from a given AVLayer
@class NFSpotlightLayer
@classdesc Subclass of {@link NFLayer} for a spotlight layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
 */
var NFSpotlightLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NFSpotlightLayer = (function(superClass) {
  extend(NFSpotlightLayer, superClass);

  function NFSpotlightLayer(layer) {
    NFLayer.call(this, layer);
    if (!NFSpotlightLayer.isSpotlightLayer(this.layer)) {
      throw new Error("NF Spotlight Layer is invalid and the wrapper class cannot be created");
    }
    this;
  }

  NFSpotlightLayer.prototype.toString = function() {
    return "NFSpotlightLayer: '" + this.layer.name + "'";
  };


  /**
  Start tracking a highlight
  @memberof NFSpotlightLayer
  @param {NFHighlightLayer} highlight - the new highlight to track
  @throw Throws error if highlight is already being tracked
  @returns {NFSpotlightLayer} self
   */

  NFSpotlightLayer.prototype.trackHighlight = function(highlight) {
    var expression, newMask;
    if (!(highlight instanceof NFHighlightLayer)) {
      throw new Error("Highlight invalid to track");
    }
    if (this.mask().property(highlight.getName()) != null) {
      throw new Error("Already tracking highlight");
    }
    expression = NFTools.readExpression("spotlight-mask-expression", {
      TARGET_PAGE: highlight.getPageComp().getPageBaseName(),
      COMP_NAME: highlight.getPageComp().name,
      HIGHLIGHT_LAYER_NAME: highlight.getName(),
      HIGHLIGHT_CONTROL_LAYER_NAME: highlight.getControlLayer().getName(),
      HIGHLIGHT_CONTROL_HIGHLIGHT_EFFECT_NAME: highlight.getName()
    });
    newMask = this.mask().addProperty("Mask");
    newMask.name = highlight.getName();
    newMask.maskShape.expression = expression;
    newMask.maskMode = MaskMode.SUBTRACT;
    newMask.maskFeather.setValue([80, 80]);
    newMask.maskExpansion.setValue(45);
    expression = NFTools.readExpression("spotlight-mask-opacity-expression", {
      ON_VALUE: "100",
      HIGHLIGHT_CONTROL_LAYER_NAME: highlight.getControlLayer().getName(),
      ANIMATION_DURATION: NFSpotlightLayer.duration,
      PDF_NUMBER: highlight.getPDFNumber()
    });
    newMask.maskOpacity.expression = expression;
    return this;
  };


  /**
  Stop tracking a highlight
  @memberof NFSpotlightLayer
  @param {NFHighlightLayer} the highlight to stop tracking
  @returns {NFSpotlightLayer} self
   */

  NFSpotlightLayer.prototype.stopTrackingHighlight = function(highlight) {
    var existingMask;
    if (!(highlight instanceof NFHighlightLayer)) {
      throw new Error("Highlight invalid to stop tracking");
    }
    existingMask = this.mask().property(highlight.getName());
    if (existingMask != null) {
      existingMask.remove();
    } else {
      throw new Error("Can't stop tracking highlight because it's not currently being tracked");
    }
    return this;
  };

  return NFSpotlightLayer;

})(NFLayer);

NFSpotlightLayer = Object.assign(NFSpotlightLayer, {
  duration: 1,

  /**
  Returns whether or not the given AVLayer is a valid Spotlight Layer
  @memberof NFSpotlightLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid spotlight layer
   */
  isSpotlightLayer: function(theLayer) {
    var ref;
    return theLayer.isAVLayer() && ((ref = theLayer.source) != null ? ref.mainSource : void 0) instanceof SolidSource;
  },

  /**
  Returns the name for a spotlight layer for a given PDF Number
  @memberof NFSpotlightLayer
  @returns {String} the appropriate name
   */
  nameForPDFNumber: function(num) {
    return num + " - Spotlight";
  },

  /**
  Creates a new Spotlight layer for the given NFPaperLayerGroup
  @memberof NFSpotlightLayer
  @param {NFPaperLayerGroup} group - the paper layer group
  @returns {NFSpotlightLayer} the new spotlight layer
   */
  newSpotlightLayer: function(group) {
    var controlLayers, existingSpot, expression, newMask, newSolidAVLayer, props, spotlightLayer;
    if (!(group instanceof NFPaperLayerGroup)) {
      throw new Error("group must be an NFPaperLayerGroup");
    }
    existingSpot = group.getSpotlight();
    if (existingSpot != null) {
      return existingSpot;
    }
    props = {
      color: [0.0078, 0, 0.1216],
      name: NFSpotlightLayer.nameForPDFNumber(group.getPDFNumber()),
      width: group.containingComp().comp.width,
      height: group.containingComp().comp.height,
      pixelAspect: 1
    };
    newSolidAVLayer = group.containingComp().comp.layers.addSolid(props.color, props.name, props.width, props.height, props.pixelAspect);
    spotlightLayer = new NFSpotlightLayer(newSolidAVLayer);
    controlLayers = group.getControlLayers();
    if (controlLayers.isEmpty()) {
      spotlightLayer.moveAfter(group.paperParent);
    } else {
      spotlightLayer.moveBefore(controlLayers.getTopmostLayer());
    }
    spotlightLayer.layer.startTime = group.getPages().getEarliestLayer().layer.inPoint;
    newMask = spotlightLayer.mask().addProperty("Mask");
    newMask.name = "Dummy";
    newMask.maskShape.expression = "ori = [0, 0];createPath(points = [ori, ori, ori, ori], inTangents = [], outTangents = [], is_closed = true);";
    newMask.maskMode = MaskMode.SUBTRACT;
    newMask.maskOpacity.setValue(35);
    expression = NFTools.readExpression("spotlight-master-opacity-expression", {
      ANIMATION_DURATION: NFSpotlightLayer.duration,
      PDF_NUMBER: group.getPDFNumber()
    });
    newMask.maskOpacity.expression = expression;
    return spotlightLayer;
  }
});
