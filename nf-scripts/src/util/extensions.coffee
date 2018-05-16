`#include "../lib/extendscript.prototypes.js"`

LayerCollection::toArr = ->
  arr = []
  i = 1
  while i <= @length
    arr.push @[i]
    i++
  return arr
