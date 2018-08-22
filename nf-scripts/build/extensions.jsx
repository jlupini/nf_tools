
/**
The Javascript Array class
@namespace Array
 */

/**
Gets the index of a value in the array
@function indexOf
@memberof Array
@param {Any} searchElement - the element to look for
@param {int} fromIndex - the start index to search at
@returns {int} the index found, or -1 if not found
 */
Array.prototype.indexOf = function(searchElement, fromIndex) {
  var k, len, n, o;
  k = void 0;
  if (this === null) {
    throw new TypeError('"this" is null or not defined');
  }
  o = Object(this);
  len = o.length >>> 0;
  if (len === 0) {
    return -1;
  }
  n = fromIndex | 0;
  if (n >= len) {
    return -1;
  }
  k = Math.max(n >= 0 ? n : len - Math.abs(n));
  while (k < len) {
    if (k in o && o[k] === searchElement) {
      return k;
    }
    k++;
  }
  return -1;
};


/**
Stuffs a given value into undefined indecies in the array. Returns a new array.
@function stuff
@memberof Array
@param {Any} item - what to put in the empty indecies
@returns {Array} the resulting array
 */

Array.prototype.stuff = function(item) {
  var idx, j, ref, stuffedArr;
  stuffedArr = [];
  for (idx = j = 0, ref = this.length - 1; 0 <= ref ? j <= ref : j >= ref; idx = 0 <= ref ? ++j : --j) {
    if (this[idx] === void 0 || "") {
      stuffedArr[idx] = item;
    } else {
      stuffedArr[idx] = this[idx];
    }
  }
  return stuffedArr;
};


/**
The Javascript String class
@namespace String
 */


/**
Converts a string in csv format to an array
@function splitCSV
@memberof String
@returns {Array} the array created from this string
 */

String.prototype.splitCSV = function(sep) {
  var foo, fullArr, j, len1, line, splitByLine, tl, x;
  fullArr = [];
  splitByLine = this.split("\n");
  for (j = 0, len1 = splitByLine.length; j < len1; j++) {
    line = splitByLine[j];
    foo = line.split(sep = sep || ',');
    x = foo.length - 1;
    tl = void 0;
    while (x >= 0) {
      if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
        if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
        } else {
          foo = foo.shift().split(sep).concat(foo);
        }
      } else {
        foo[x].replace(/""/g, '"');
      }
      x--;
    }
    fullArr.push(foo);
  }
  return fullArr;
};


/**
Inserts a string at an index in the string
@function insertAt
@memberof String
@param {int} index
@param {String} string - the string to insert
@returns {String} self
 */

String.prototype.insertAt = function(index, string) {
  return this.substr(0, index) + string + this.substr(index);
};


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
  var j, keyIndicies, keyTime, len1, ref;
  keyIndicies = [];
  ref = model.keyTimes;
  for (j = 0, len1 = ref.length; j < len1; j++) {
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
Returns whether or not the layer is a solid
@memberof Layer
@function isSolid
@returns {boolean} if the layer is a solid
 */

Layer.prototype.isSolid = function() {
  var ref;
  return ((ref = this.source) != null ? ref.mainSource : void 0) instanceof SolidSource;
};

AVLayer.prototype.isSolid = ShapeLayer.prototype.isSolid = TextLayer.prototype.isSolid = Layer.prototype.isSolid;


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
      if (markers.keyValue(idx).comment === comment) {
        return idx;
      }
    }
  } else {
    return null;
  }
};

AVLayer.prototype.indexOfMarker = ShapeLayer.prototype.indexOfMarker = TextLayer.prototype.indexOfMarker = Layer.prototype.indexOfMarker;


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

AVLayer.prototype.removeMarker = ShapeLayer.prototype.removeMarker = TextLayer.prototype.removeMarker = Layer.prototype.removeMarker;
