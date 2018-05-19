
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
