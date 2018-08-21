###*
The Javascript Array class
@namespace Array
###

###*
Gets the index of a value in the array
@function indexOf
@memberof Array
@param {Any} searchElement - the element to look for
@param {int} fromIndex - the start index to search at
@returns {int} the index found, or -1 if not found
###
Array::indexOf = (searchElement, fromIndex) ->
  k = undefined
  if this == null
    throw new TypeError('"this" is null or not defined')
  o = Object(this)
  len = o.length >>> 0
  if len == 0
    return -1
  n = fromIndex | 0
  if n >= len
    return -1
  k = Math.max(if n >= 0 then n else len - Math.abs(n))
  while k < len
    if k of o and o[k] == searchElement
      return k
    k++
  -1

###*
Stuffs a given value into undefined indecies in the array. Returns a new array.
@function stuff
@memberof Array
@param {Any} item - what to put in the empty indecies
@returns {Array} the resulting array
###
Array::stuff = (item) ->
  stuffedArr = []
  for idx in [0..@length-1]
    if this[idx] is undefined or ""
      stuffedArr[idx] = item
    else
      stuffedArr[idx] = this[idx]
  stuffedArr


###*
The Javascript String class
@namespace String
###

###*
Converts a string in csv format to an array
@function splitCSV
@memberof String
@returns {Array} the array created from this string
###
String::splitCSV = (sep) ->
  fullArr = []
  splitByLine = @split("\n")
  for line in splitByLine
    foo = line.split(sep = sep or ',')
    x = foo.length - 1
    tl = undefined
    while x >= 0
      if foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"'
        if (tl = foo[x].replace(/^\s+"/, '"')).length > 1 and tl.charAt(0) == '"'
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"')
        else if x
          foo.splice x - 1, 2, [
            foo[x - 1]
            foo[x]
          ].join(sep)
        else
          foo = foo.shift().split(sep).concat(foo)
      else
        foo[x].replace /""/g, '"'
      x--
    fullArr.push foo
  fullArr

###*
The After Effects LayerCollection Class
@namespace LayerCollection
###

###*
Returns an Array of all the layers in this collection for easier manipulation
@function toArr
@memberof LayerCollection
@returns {Array} the array created from this collection
###
LayerCollection::toArr = ->
  arr = []
  i = 1
  while i <= @length
    arr.push @[i]
    i++
  return arr

###*
The After Effects Layer Class
@namespace Property
###

###*
Returns the index of the marker with the given comment
@memberof Property
@function expressionStringForValue
@returns {string} the expression string for the value of this property
###
Property::expressionStringForValue = ->
  expString = ".value"
  testProperty = @
  while testProperty.name isnt "Effects"
    expString = "(\"#{testProperty.name}\")" + expString
    testProperty = testProperty.parentProperty
  return "thisLayer(\"Effects\")" + expString

###*
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
###
Property::easyEaseKeyTimes = (model) ->
  keyIndicies = []
  for keyTime in model.keyTimes
    keyIndicies.push @nearestKeyIndex keyTime
  model.keys = keyIndicies

  @easyEaseKeys model

###*
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
###
Property::easyEaseKeys = (model) ->
  model.easeType ?= KeyframeInterpolationType.BEZIER
  model.easeWeight ?= 33

  if model.easeType instanceof Array
    throw new Error "Wrong number of type in easeType Array" unless model.easeType.length is 2
    easeInType = model.easeType[0]
    easeOutType = model.easeType[1]
  else
    easeInType = easeOutType = model.easeType

  if model.easeWeight instanceof Array
    throw new Error "Array of weights must be the same length as the number of dimensions of the property" unless model.easeWeight.length is 2
    easeInWeight = model.easeWeight[0]
    easeOutWeight = model.easeWeight[1]
  else
    easeInWeight = easeOutWeight = model.easeWeight

  easeIn = new KeyframeEase 0, easeInWeight
  easeOut = new KeyframeEase 0, easeOutWeight
  temporalEaseInArray = [easeIn]
  temporalEaseOutArray = [easeOut]
  if @propertyValueType is PropertyValueType.TwoD
    temporalEaseInArray = [easeIn, easeIn]
    temporalEaseOutArray = [easeOut, easeOut]
  else if @propertyValueType is PropertyValueType.ThreeD
    temporalEaseInArray = [easeIn, easeIn, easeIn]
    temporalEaseOutArray = [easeOut, easeOut, easeOut]


  spatialEaseArray = null
  if @propertyValueType is PropertyValueType.TwoD_SPATIAL
    spatialEaseArray = [0,0]
  else if @propertyValueType is PropertyValueType.ThreeD_SPATIAL
    spatialEaseArray = [0,0,0]

  for i in [0..(model.keys.length-1)]
    key = model.keys[i]

    @setInterpolationTypeAtKey key, easeInType, easeOutType
    @setTemporalEaseAtKey key, temporalEaseInArray, temporalEaseOutArray
    @setSpatialTangentsAtKey key, spatialEaseArray if spatialEaseArray?

###*
The After Effects Layer Class
@namespace Layer
###

###*
Returns whether or not the layer is a solid
@memberof Layer
@function isSolid
@returns {boolean} if the layer is a solid
###
Layer::isSolid = ->
  @source?.mainSource instanceof SolidSource
AVLayer::isSolid = ShapeLayer::isSolid = TextLayer::isSolid = Layer::isSolid



###*
Returns whether or not a given Layer is an AVLayer or one of its subclasses. This is because Layer objects don't play nice with `instanceof`
@memberof Layer
@function isAVLayer
@returns {boolean} if the layer is an AVLayer
###
Layer::isAVLayer = ->
  return @ instanceof AVLayer or @ instanceof ShapeLayer or @ instanceof TextLayer
AVLayer::isAVLayer = ->
  yes
ShapeLayer::isAVLayer = ->
  yes
CameraLayer::isAVLayer = ->
  no
LightLayer::isAVLayer = ->
  no
TextLayer::isAVLayer = ->
  yes

###*
Returns the index of the marker with the given comment
@memberof Layer
@function indexOfMarker
@returns {int | null} the marker's index or null
@param {string} comment - the search string for the marker
###
Layer::indexOfMarker = (comment) ->
  markers = @property("Marker")
  if markers.numKeys > 0
    for idx in [1..markers.numKeys]
      return idx if markers.keyValue(idx).comment is comment
  else
    return null
AVLayer::indexOfMarker = ShapeLayer::indexOfMarker = TextLayer::indexOfMarker = Layer::indexOfMarker

###*
Removes the marker with a given comment
@memberof Layer
@function removeMarker
@returns {Layer} self
@param {string} comment - the search string for the marker
###
Layer::removeMarker = (comment) ->
  markers = @property("Marker")
  index = @indexOfMarker comment
  if index?
    markers.removeKey index

  return @
AVLayer::removeMarker = ShapeLayer::removeMarker = TextLayer::removeMarker = Layer::removeMarker
