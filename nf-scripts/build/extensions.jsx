#include "../lib/extendscript.prototypes.js";
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
