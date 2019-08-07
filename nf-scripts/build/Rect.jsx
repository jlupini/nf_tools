
/**
Creates a new Rect
@class Rect
@classdesc Rect object
@property {float} top
@property {float} left
@property {float} width
@property {float} height
 */
var Rect;

Rect = (function() {
  function Rect(model) {
    if (model == null) {
      throw new Error("No rect model supplied");
    }
    if (!((model.left != null) && (model.top != null) && (model.width != null) && (model.height != null))) {
      throw new Error("Must specify all values for a rect on init");
    }
    if (model.width < 0 || model.height < 0) {
      throw new Error("Width and height must be positive numbers");
    }
    this.left = model.left;
    this.top = model.top;
    this.width = model.width;
    this.height = model.height;
    this;
  }

  Rect.prototype.toString = function() {
    return "Rect: " + this.left + ", " + this.top + ", " + this.width + ", " + this.height;
  };


  /**
  Returns the area of the rect
  @memberof Rect
  @returns {float} the area
   */

  Rect.prototype.area = function() {
    return this.width * this.height;
  };


  /**
  Returns the maximum x value of the rect
  @memberof Rect
  @returns {boolean} the result
   */

  Rect.prototype.maxX = function() {
    return this.left + this.width;
  };


  /**
  Returns the maximum y value of the rect
  @memberof Rect
  @returns {boolean} the result
   */

  Rect.prototype.maxY = function() {
    return this.top + this.height;
  };


  /**
  Returns the y overlap with another rect
  @memberof Rect
  @returns {float} the overlap
   */

  Rect.prototype.yOverlapWith = function(testRect) {
    var aAboveB, aBelowB;
    aAboveB = this.top > testRect.maxY();
    aBelowB = this.maxY() < testRect.top;
    if (!(aAboveB || aBelowB)) {
      return Math.min(this.maxY(), testRect.maxY()) - Math.max(this.top, testRect.top);
    } else {
      return 0;
    }
  };


  /**
  Returns the x overlap with another rect
  @memberof Rect
  @returns {float} the overlap
   */

  Rect.prototype.xOverlapWith = function(testRect) {
    var aLeftOfB, aRightOfB;
    aLeftOfB = this.maxX() < testRect.left;
    aRightOfB = this.left > testRect.maxX();
    if (!(aLeftOfB || aRightOfB)) {
      return Math.min(this.maxX(), testRect.maxX()) - Math.max(this.left, testRect.left);
    } else {
      return 0;
    }
  };


  /**
  Returns true if more than half of the testRect is inside this rect
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
   */

  Rect.prototype.contains = function(testRect) {
    var overlapArea, xOverlap, yOverlap;
    if (!(testRect instanceof Rect)) {
      throw new Error("Invalid rect object");
    }
    xOverlap = this.xOverlapWith(testRect);
    yOverlap = this.yOverlapWith(testRect);
    if (xOverlap > 0 && yOverlap > 0) {
      overlapArea = xOverlap * yOverlap;
      return overlapArea > testRect.area() / 2;
    } else {
      return false;
    }
  };


  /**
  Returns whether or not the given rect intersects with this one
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
   */

  Rect.prototype.intersectsWith = function(testRect) {
    var aAboveB, aBelowB, aLeftOfB, aRightOfB;
    if (!(testRect instanceof Rect)) {
      throw new Error("Invalid rect object");
    }
    aLeftOfB = this.maxX() < testRect.left;
    aRightOfB = this.left > testRect.maxX();
    aAboveB = this.top > testRect.maxY();
    aBelowB = this.maxY() < testRect.top;
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  };

  return Rect;

})();
