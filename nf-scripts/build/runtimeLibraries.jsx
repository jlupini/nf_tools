var base, dev;

if (app.NF == null) {
  app.NF = {};
}

if ((base = app.NF).Util == null) {
  base.Util = {};
}

dev = true;

if (dev) {
  $.write(">> Dev mode: loading libraries!\n");
  eval('#include "../lib/extendscript.prototypes.js"');
  eval('#include "easingEquations.jsx"');
  eval('#include "utilFunctions.jsx"');
  eval('#include "objectModel.jsx"');
  eval('#include "extensions.jsx"');
  eval('#include "layoutDictionary.jsx"');
  eval('#include "NFProject.jsx"');
  eval('#include "NFTools.jsx"');
} else {
  $.write(">> Prod mode: not loading libraries!\n");
}
