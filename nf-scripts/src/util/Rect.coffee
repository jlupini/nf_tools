###*
Creates a new Rect
@class Rect
@classdesc Rect object
@property {float} top
@property {float} left
@property {float} width
@property {float} height
###
class Rect
  constructor: (model) ->
    throw new Error "No rect model supplied" unless model?
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
  Returns the maximum x value of the rect
  @memberof Rect
  @returns {boolean} the result
  ###
  maxX: ->
    return @left + @width

  ###*
  Returns the maximum y value of the rect
  @memberof Rect
  @returns {boolean} the result
  ###
  maxY: ->
    return @top + @height

  ###*
  Returns the y overlap with another rect
  @memberof Rect
  @returns {float} the overlap
  ###
  yOverlapWith: (testRect) ->
    aAboveB = @top > testRect.maxY()
    aBelowB = @maxY() < testRect.top
    if !(aAboveB or aBelowB)
      return Math.min(@maxY(), testRect.maxY()) - Math.max(@top, testRect.top)
    else
      return 0

  ###*
  Returns the x overlap with another rect
  @memberof Rect
  @returns {float} the overlap
  ###
  xOverlapWith: (testRect) ->
    aLeftOfB = @maxX() < testRect.left
    aRightOfB = @left > testRect.maxX()
    if !(aLeftOfB or aRightOfB)
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
  Returns whether or not the given rect intersects with this one
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
  ###
  intersectsWith: (testRect) ->
    throw new Error "Invalid rect object" unless testRect instanceof Rect

    aLeftOfB = @maxX() < testRect.left
    aRightOfB = @left > testRect.maxX()
    aAboveB = @top > testRect.maxY()
    aBelowB = @maxY() < testRect.top

    return !( aLeftOfB or aRightOfB or aAboveB or aBelowB )
