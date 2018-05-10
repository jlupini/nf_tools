(function() {
  var base, base1, base2;

  if (app.NF == null) {
    app.NF = {};
  }

  if ((base = app.NF).Models == null) {
    base.Models = {};
  }

  if ((base1 = app.NF).Util == null) {
    base1.Util = {};
  }

  if ((base2 = app.NF).Enum == null) {
    base2.Enum = {};
  }

  #include "lib/extendscript.prototypes.js";

  #include "nf_functions.jsx";

  #include "nf_objectModel.jsx";

  #include "nf_objectModelHelperFunctions.jsx";

}).call(this);
