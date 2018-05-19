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
The After Effects Layer Class
@namespace Layer
###

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
      return idx if markers.key(idx).comment is comment
  else
    return null

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
