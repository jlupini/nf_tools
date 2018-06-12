
/**
The After Effects LayerCollection Class
@namespace LayerCollection
 */

/**
Returns an Array of all the layers in this collection for easier manipulation
@function toArr
@memberof LayerCollection
@returns {Array} the array created from this collection
 */
LayerCollection.prototype.toArr = function() {
  var arr, i;
  arr = [];
  i = 1;
  while (i <= this.length) {
    arr.push(this[i]);
    i++;
  }
  return arr;
};


/**
The After Effects Layer Class
@namespace Property
 */


/**
Returns the index of the marker with the given comment
@memberof Property
@function expressionStringForValue
@returns {string} the expression string for the value of this property
 */

Property.prototype.expressionStringForValue = function() {
  var expString, testProperty;
  expString = ".value";
  testProperty = this;
  while (testProperty.name !== "Effects") {
    expString = ("(\"" + testProperty.name + "\")") + expString;
    testProperty = testProperty.parentProperty;
  }
  return "thisLayer(\"Effects\")" + expString;
};


/**
Eases an array of key times.
@memberof Property
@function easyEaseKeyTimes
@param {Object} model - The options
@param {float[]} keyTimes - the key times
@param {KeyframeInterpolationType | KeyframeInterpolationType[]}
[easeType=KeyframeInterpolationType.BEZIER] - the Keyframe Interpolation
Type to use, or an array of types the same length as the number of dimensions
of the property
@param {float | float[]} [easeWeight=33] - the weight of the ease, or an array
of weights the same length as the number of dimensions of the property.
@returns {Property} self
 */

Property.prototype.easyEaseKeyTimes = function(model) {
  var j, keyIndicies, keyTime, len, ref;
  keyIndicies = [];
  ref = model.keyTimes;
  for (j = 0, len = ref.length; j < len; j++) {
    keyTime = ref[j];
    keyIndicies.push(this.nearestKeyIndex(keyTime));
  }
  model.keys = keyIndicies;
  return this.easyEaseKeys(model);
};


/**
Easy Eases an array of key indicies.
@memberof Property
@function easyEaseKeys
@param {Object} model - The options
@param {int[]} keys - the key indices
@param {KeyframeInterpolationType | KeyframeInterpolationType[]}
[easeType=KeyframeInterpolationType.BEZIER] - the Keyframe Interpolation
Type to use, or an array with two objects: the in type and out type.
@param {float | float[]} [easeWeight=33] - the weight of the ease, or an array
of weights with two objects: the in weight and out weight.
@returns {Property} self
 */

Property.prototype.easyEaseKeys = function(model) {
  var easeIn, easeInType, easeInWeight, easeOut, easeOutType, easeOutWeight, i, j, key, ref, results, spatialEaseArray, temporalEaseInArray, temporalEaseOutArray;
  if (model.easeType == null) {
    model.easeType = KeyframeInterpolationType.BEZIER;
  }
  if (model.easeWeight == null) {
    model.easeWeight = 33;
  }
  if (model.easeType instanceof Array) {
    if (model.easeType.length !== 2) {
      throw new Error("Wrong number of type in easeType Array");
    }
    easeInType = model.easeType[0];
    easeOutType = model.easeType[1];
  } else {
    easeInType = easeOutType = model.easeType;
  }
  if (model.easeWeight instanceof Array) {
    if (model.easeWeight.length !== 2) {
      throw new Error("Array of weights must be the same length as the number of dimensions of the property");
    }
    easeInWeight = model.easeWeight[0];
    easeOutWeight = model.easeWeight[1];
  } else {
    easeInWeight = easeOutWeight = model.easeWeight;
  }
  easeIn = new KeyframeEase(0, easeInWeight);
  easeOut = new KeyframeEase(0, easeOutWeight);
  temporalEaseInArray = [easeIn];
  temporalEaseOutArray = [easeOut];
  if (this.propertyValueType === PropertyValueType.TwoD) {
    temporalEaseInArray = [easeIn, easeIn];
    temporalEaseOutArray = [easeOut, easeOut];
  } else if (this.propertyValueType === PropertyValueType.ThreeD) {
    temporalEaseInArray = [easeIn, easeIn, easeIn];
    temporalEaseOutArray = [easeOut, easeOut, easeOut];
  }
  spatialEaseArray = null;
  if (this.propertyValueType === PropertyValueType.TwoD_SPATIAL) {
    spatialEaseArray = [0, 0];
  } else if (this.propertyValueType === PropertyValueType.ThreeD_SPATIAL) {
    spatialEaseArray = [0, 0, 0];
  }
  results = [];
  for (i = j = 0, ref = model.keys.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    key = model.keys[i];
    this.setInterpolationTypeAtKey(key, easeInType, easeOutType);
    this.setTemporalEaseAtKey(key, temporalEaseInArray, temporalEaseOutArray);
    if (spatialEaseArray != null) {
      results.push(this.setSpatialTangentsAtKey(key, spatialEaseArray));
    } else {
      results.push(void 0);
    }
  }
  return results;
};


/**
The After Effects Layer Class
@namespace Layer
 */


/**
Returns whether or not a given Layer is an AVLayer or one of its subclasses. This is because Layer objects don't play nice with `instanceof`
@memberof Layer
@function isAVLayer
@returns {boolean} if the layer is an AVLayer
 */

Layer.prototype.isAVLayer = function() {
  return this instanceof AVLayer || this instanceof ShapeLayer || this instanceof TextLayer;
};

AVLayer.prototype.isAVLayer = function() {
  return true;
};

ShapeLayer.prototype.isAVLayer = function() {
  return true;
};

CameraLayer.prototype.isAVLayer = function() {
  return false;
};

LightLayer.prototype.isAVLayer = function() {
  return false;
};

TextLayer.prototype.isAVLayer = function() {
  return true;
};


/**
Returns the index of the marker with the given comment
@memberof Layer
@function indexOfMarker
@returns {int | null} the marker's index or null
@param {string} comment - the search string for the marker
 */

Layer.prototype.indexOfMarker = function(comment) {
  var idx, j, markers, ref;
  markers = this.property("Marker");
  if (markers.numKeys > 0) {
    for (idx = j = 1, ref = markers.numKeys; 1 <= ref ? j <= ref : j >= ref; idx = 1 <= ref ? ++j : --j) {
      if (markers.key(idx).comment === comment) {
        return idx;
      }
    }
  } else {
    return null;
  }
};


/**
Removes the marker with a given comment
@memberof Layer
@function removeMarker
@returns {Layer} self
@param {string} comment - the search string for the marker
 */

Layer.prototype.removeMarker = function(comment) {
  var index, markers;
  markers = this.property("Marker");
  index = this.indexOfMarker(comment);
  if (index != null) {
    markers.removeKey(index);
  }
  return this;
};
