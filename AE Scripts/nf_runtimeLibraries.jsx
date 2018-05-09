(function() {
  var NF, ref;

  NF = (ref = app.NF) != null ? ref : {};

  if (NF.Models == null) {
    NF.Models = {};
  }

  if (NF.Util == null) {
    NF.Util = {};
  }

  if (NF.Enum == null) {
    NF.Enum = {};
  }

  #include "lib/extendscript.prototypes.js";

  #include "nf_functions.jsx";

  #include "nf_objectmodel.jsx";

}).call(this);
