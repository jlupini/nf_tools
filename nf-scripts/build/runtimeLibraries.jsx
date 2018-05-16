var base;

if (app.NF == null) {
  app.NF = {};
}

if ((base = app.NF).Util == null) {
  base.Util = {};
}

#include "../lib/extendscript.prototypes.js";

#include "extensions.jsx";

#include "utilFunctions.jsx";

#include "objectModel.jsx";
