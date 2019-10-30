
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

module.exports = Rect = (function() {
  function Rect(model) {
    if (model == null) {
      throw new Error("No rect model supplied");
    }
    if (!(model instanceof Rect)) {
      if (!((model.left != null) && (model.top != null) && (model.width != null) && (model.height != null))) {
        throw new Error("Must specify all values for a rect on init");
      }
      if (model.width < 0 || model.height < 0) {
        throw new Error("Width and height must be positive numbers");
      }
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
  Returns a new rect that's a combination of this rect and the added one
  @memberof Rect
  @param {Rect} rectToAdd - the rect to add
  @returns {Rect} the new rect
   */

  Rect.prototype.combineWith = function(rectToAdd) {
    return new Rect({
      left: Math.min(this.left, rectToAdd.left),
      top: Math.min(this.top, rectToAdd.top),
      width: Math.max(this.maxX(), rectToAdd.maxX()) - Math.min(this.left, rectToAdd.left),
      height: Math.max(this.maxY(), rectToAdd.maxY()) - Math.min(this.top, rectToAdd.top)
    });
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
  Returns the center point of the rect
  @memberof Rect
  @returns {float[]} the center point
   */

  Rect.prototype.centerPoint = function() {
    return [this.left + this.width / 2, this.top + this.height / 2];
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
  Returns the Top Left Point
  @memberof Rect
  @returns {float[]} the point
   */

  Rect.prototype.topLeft = function() {
    return [this.left, this.top];
  };


  /**
  Returns the Top Right Point
  @memberof Rect
  @returns {float[]} the point
   */

  Rect.prototype.topRight = function() {
    return [this.maxX(), this.top];
  };


  /**
  Returns the Bottom Left Point
  @memberof Rect
  @returns {float[]} the point
   */

  Rect.prototype.bottomLeft = function() {
    return [this.left, this.maxY()];
  };


  /**
  Returns the Bottom Right Point
  @memberof Rect
  @returns {float[]} the point
   */

  Rect.prototype.bottomRight = function() {
    return [this.maxX(), this.maxY()];
  };


  /**
  Returns if this rect is left of a given rect
  @memberof Rect
  @returns {boolean} the restule
   */

  Rect.prototype.leftOf = function(testRect) {
    return this.maxX() < testRect.left;
  };


  /**
  Returns if this rect is right of a given rect
  @memberof Rect
  @returns {boolean} the restule
   */

  Rect.prototype.rightOf = function(testRect) {
    return this.left > testRect.maxX();
  };


  /**
  Returns if this rect is above a given rect
  @memberof Rect
  @returns {boolean} the restule
   */

  Rect.prototype.above = function(testRect) {
    return this.maxY() < testRect.top;
  };


  /**
  Returns if this rect is below a given rect
  @memberof Rect
  @returns {boolean} the restule
   */

  Rect.prototype.below = function(testRect) {
    return this.top > testRect.maxY();
  };


  /**
  Returns the y overlap with another rect
  @memberof Rect
  @returns {float} the overlap
   */

  Rect.prototype.yOverlapWith = function(testRect) {
    if (!(this.above(testRect) || this.below(testRect))) {
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
    if (!(this.leftOf(testRect) || this.rightOf(testRect))) {
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
  Returns the distance from any edge of this rect to the nearest edge of a given
  rect, or 0 if they intersect.
  @memberof Rect
  @param {Rect} [testRect] - the Rect to test
  @returns {boolean} the result
   */

  Rect.prototype.distanceTo = function(testRect) {
    var aAboveB, aBelowB, aLeftOfB, aRightOfB, distanceBetweenPoints;
    if (!(testRect instanceof Rect)) {
      throw new Error("Invalid rect object");
    }
    distanceBetweenPoints = function(p1, p2) {
      var a, b, c, x1, x2, y1, y2;
      x1 = p1[0];
      x2 = p2[0];
      y1 = p1[1];
      y2 = p2[1];
      a = x1 - x2;
      b = y1 - y2;
      c = Math.sqrt(a * a + b * b);
      return c;
    };
    aLeftOfB = this.leftOf(testRect);
    aRightOfB = this.rightOf(testRect);
    aBelowB = this.below(testRect);
    aAboveB = this.above(testRect);
    if (!(aLeftOfB || aRightOfB || aAboveB || aBelowB)) {
      return 0;
    }
    if (aAboveB) {
      if (aLeftOfB) {
        return distanceBetweenPoints(this.bottomRight(), testRect.topLeft());
      } else if (aRightOfB) {
        return distanceBetweenPoints(this.bottomLeft(), testRect.topRight());
      } else {
        return testRect.top - this.maxY();
      }
    } else if (aBelowB) {
      if (aLeftOfB) {
        return distanceBetweenPoints(this.topRight(), testRect.bottomLeft());
      } else if (aBelowB && aRightOfB) {
        return distanceBetweenPoints(this.topLeft(), testRect.bottomRight());
      } else {
        return this.top - testRect.maxY();
      }
    } else if (aRightOfB) {
      return this.left - testRect.maxX();
    } else if (aLeftOfB) {
      return testRect.left - this.maxX();
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
    aLeftOfB = this.leftOf(testRect);
    aRightOfB = this.rightOf(testRect);
    aBelowB = this.below(testRect);
    aAboveB = this.above(testRect);
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  };


  /**
  Returns a new rect from the intersect between the two rects. Throws an error if there's no intersect
  @memberof Rect
  @param {Rect} [otherRect] - the rect to form the intersect with
  @returns {Rect} the resulting new rect
   */

  Rect.prototype.rectFromIntersect = function(otherRect) {
    var newLeft, newTop;
    if (!(otherRect instanceof Rect)) {
      throw new Error("Invalid rect object");
    }
    if (!this.intersectsWith(otherRect)) {
      throw new Error("No intersection between rects");
    }
    newLeft = Math.max(this.left, otherRect.left);
    newTop = Math.max(this.top, otherRect.top);
    return new Rect({
      left: newLeft,
      top: newTop,
      width: Math.min(this.maxX(), otherRect.maxX()) - newLeft,
      height: Math.min(this.maxY(), otherRect.maxY()) - newTop
    });
  };

  return Rect;

})();
