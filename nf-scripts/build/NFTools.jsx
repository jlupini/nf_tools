
/**
NFTools Namespace
@namespace NFTools
 */
var NFTools;

NFTools = {

  /**
  Returns the current time (of world, not comp)
  @memberof NFTools
  @returns {time} the time
   */
  now: function() {
    var d;
    d = new Date();
    return d.getTime();
  }
};
