###*
Creates a new Rect
@class Rect
@classdesc Rect object
@property {float} top
@property {float} left
@property {float} width
@property {float} height
###
module.exports = class Rect
  constructor: (model) ->
    throw new Error "No rect model supplied" unless model?
    unless model instanceof Rect
      throw new Error "Must specify all values for a rect on init" unless model.left? and model.top? and model.width? and model.height?
      throw new Error "Width and height must be positive numbers" if model.width < 0 or model.height < 0

    @left = model.left
    @top = model.top
    @width = model.width
    @height = model.height
    @

  # MARK: Instance Methods
  toString: ->
    return "Rect: #{@left}, #{@top}, #{@width}, #{@height}"

  ###*
  Returns the area of the rect
  @memberof Rect
  @returns {float} the area
  ###
  area: ->
    return @width * @height

  ###*
  Returns a new rect that's a combination of this rect and the added one
  @memberof Rect
  @param {Rect} rectToAdd - the rect to add
  @returns {Rect} the new rect
  ###
  combineWith: (rectToAdd) ->
    return new Rect
      left: Math.min(@left, rectToAdd.left)
      top: Math.min(@top, rectToAdd.top)
      width: Math.max(@maxX(), rectToAdd.maxX()) - Math.min(@left, rectToAdd.left)
      height: Math.max(@maxY(), rectToAdd.maxY()) - Math.min(@top, rectToAdd.top)

  ###*
  Returns the maximum x value of the rect
  @memberof Rect
  @returns {boolean} the result
  ###
  maxX: ->
    return @left + @width

  ###*
  Returns the center point of the rect
  @memberof Rect
  @returns {float[]} the center point
  ###
  centerPoint: ->
    return [@left + @width / 2, @top + @height / 2]

  ###*
  Returns the maximum y value of the rect
  @memberof Rect
  @returns {boolean} the result
  ###
  maxY: ->
    return @top + @height

  ###*
  Returns the Top Left Point
  @memberof Rect
  @returns {float[]} the point
  ###
  topLeft: ->
    return [@left, @top]

  ###*
  Returns the Top Right Point
  @memberof Rect
  @returns {float[]} the point
  ###
  topRight: ->
    return [@maxX(), @top]

  ###*
  Returns the Bottom Left Point
  @memberof Rect
  @returns {float[]} the point
  ###
  bottomLeft: ->
    return [@left, @maxY()]

  ###*
  Returns the Bottom Right Point
  @memberof Rect
  @returns {float[]} the point
  ###
  bottomRight: ->
    return [@maxX(), @maxY()]

  ###*
  Returns if this rect is left of a given rect
  @memberof Rect
  @returns {boolean} the restule
  ###
  leftOf: (testRect) ->
    return @maxX() < testRect.left

  ###*
  Returns if this rect is right of a given rect
  @memberof Rect
  @returns {boolean} the restule
  ###
  rightOf: (testRect) ->
    return @left > testRect.maxX()

  ###*
  Returns if this rect is above a given rect
  @memberof Rect
  @returns {boolean} the restule
  ###
  above: (testRect) ->
    return @maxY() < testRect.top

  ###*
  Returns if this rect is below a given rect
  @memberof Rect
  @returns {boolean} the restule
  ###
  below: (testRect) ->
    return @top > testRect.maxY()

  ###*
  Returns the y overlap with another rect
  @memberof Rect
  @returns {float} the overlap
  ###
  yOverlapWith: (testRect) ->
    if !(@above(testRect) or @below(testRect))
      return Math.min(@maxY(), testRect.maxY()) - Math.max(@top, testRect.top)
    else
      return 0

  ###*
  Returns the x overlap with another rect
  @memberof Rect
  @returns {float} the overlap
  ###
  xOverlapWith: (testRect) ->
    if !(@leftOf(testRect) or @rightOf(testRect))
      return Math.min(@maxX(), testRect.maxX()) - Math.max(@left, testRect.left)
    else
      return 0

  ###*
  Returns true if more than half of the testRect is inside this rect
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
  ###
  contains: (testRect) ->
    throw new Error "Invalid rect object" unless testRect instanceof Rect

    xOverlap = @xOverlapWith testRect
    yOverlap = @yOverlapWith testRect

    if xOverlap > 0 and yOverlap > 0
      overlapArea = xOverlap * yOverlap
      return overlapArea > testRect.area() / 2
    else
      return false

  ###*
  Returns the distance from any edge of this rect to the nearest edge of a given
  rect, or 0 if they intersect.
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
  ###
  distanceTo: (testRect) ->
    throw new Error "Invalid rect object" unless testRect instanceof Rect

    distanceBetweenPoints = (p1, p2) ->
      x1 = p1[0]
      x2 = p2[0]
      y1 = p1[1]
      y2 = p2[1]

      a = x1 - x2
      b = y1 - y2
      c = Math.sqrt(a * a + b * b)
      return c

    # $.level = 2
    # debugger

    aLeftOfB = @leftOf testRect
    aRightOfB = @rightOf testRect
    aBelowB = @below testRect
    aAboveB = @above testRect

    # Rects intersect
    return 0 if !( aLeftOfB or aRightOfB or aAboveB or aBelowB )

    # TestRect has neither x nor y overlap
    if aAboveB
      if aLeftOfB
        #bottom right of A to top left of B
        return distanceBetweenPoints @bottomRight(), testRect.topLeft()
      else if aRightOfB
        #bottom left of a to top right of B
        return distanceBetweenPoints @bottomLeft(), testRect.topRight()
      else
        #bottom of A to top of B
        return testRect.top - @maxY()
    else if aBelowB
      if aLeftOfB
        #top right of A to bottom left of B
        return distanceBetweenPoints @topRight(), testRect.bottomLeft()
      else if aBelowB and aRightOfB
        #top left of A to bottom right of B
        return distanceBetweenPoints @topLeft(), testRect.bottomRight()
      else
        #bottom of B to top of A
        return @top - testRect.maxY()
    else if aRightOfB
      #left of A minus right of B
      return @left - testRect.maxX()
    else if aLeftOfB
      #left of B minus right of A
      return testRect.left - @maxX()



  ###*
  Returns whether or not the given rect intersects with this one
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
  ###
  intersectsWith: (testRect) ->
    throw new Error "Invalid rect object" unless testRect instanceof Rect

    aLeftOfB = @leftOf testRect
    aRightOfB = @rightOf testRect
    aBelowB = @below testRect
    aAboveB = @above testRect

    return !( aLeftOfB or aRightOfB or aAboveB or aBelowB )

  ###*
  Returns a new rect from the intersect between the two rects. Throws an error if there's no intersect
  @memberof Rect
  @param {Rect} [otherRect] - the rect to form the intersect with
  @returns {Rect} the resulting new rect
  ###
  rectFromIntersect: (otherRect) ->
    throw new Error "Invalid rect object" unless otherRect instanceof Rect
    throw new Error "No intersection between rects" unless @intersectsWith otherRect

    newLeft = Math.max(@left, otherRect.left)
    newTop = Math.max(@top, otherRect.top)

    return new Rect
      left: newLeft
      top: newTop
      width: Math.min(@maxX(), otherRect.maxX()) - newLeft
      height: Math.min(@maxY(), otherRect.maxY()) - newTop
