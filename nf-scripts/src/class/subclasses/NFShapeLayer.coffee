###*
Creates a new NFShapeLayer from a given AVLayer
@class NFShapeLayer
@classdesc Subclass of {@link NFLayer} for a gaussy layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFShapeLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  toString: ->
    return "NFShapeLayer: '#{@$.name}'"

  ###*
  Adds a new rectangle to the shape layer
  @memberof NFShapeLayer
  @param {Object} model
  @param {float[]} [model.fillColor=[1,1,1]] - the solid color. Three-value array of floats
  from 0.0-1.0 in the form [R, G, B]
  @param {rect} model.rect - the rect object
  @returns {NFShapeLayer} self
  ###
  addRectangle: (model) ->
    model =
      fillColor: model.fillColor ? [1,1,1]
      rect: model.rect ? throw new Error "Rect required"
      name: model.name ? "New Rectangle"
    vectorGroup = @property("Contents").addProperty("ADBE Vector Group")
    vectorGroup.name = model.name
    rectPath = vectorGroup.property("Contents").addProperty("ADBE Vector Shape - Rect")
    # Set Rect Props
    rectPath.property("Size").setValue([model.rect.width, model.rect.height])
    rectPath.property("Position").setValue([model.rect.left, model.rect.top])
    vectorGroup.property("Transform").property("Anchor Point").setValue([-model.rect.width/2, -model.rect.height/2])
    fillProp = vectorGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill")
    fillProp.property("Color").setValue model.fillColor

    # $.level = 2
    # debugger

    return @

NFShapeLayer = Object.assign NFShapeLayer,

  ###*
  Returns whether or not the given AVLayer is a valid shape Layer
  @memberof NFShapeLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid shape layer
  ###
  isShapeLayer: (theLayer) ->
    return theLayer instanceof ShapeLayer
