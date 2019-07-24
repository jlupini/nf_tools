app.NF ?= {}
app.NF.Util ?= {}

dev = yes

if dev
  $.write ">> Dev mode: loading libraries!\n"
  eval '#include "../lib/extendscript.prototypes.js"'
  eval '#include "../lib/json3.js"'
  eval '#include "easingEquations.jsx"'
  eval '#include "utilFunctions.jsx"'
  eval '#include "objectModel.jsx"'
  eval '#include "extensions.jsx"'
  eval '#include "layoutDictionary.jsx"'
  eval '#include "NFProject.jsx"'
  eval '#include "NFTools.jsx"'
else
  $.write ">> Prod mode: not loading libraries!\n"
