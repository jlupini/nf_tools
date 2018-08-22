#include "runtimeLibraries.jsx";
var NF, main;

NF = app.NF;

app.beginUndoGroup('AutoLayout');

main = function() {
  NFTools.clearLog();
  NFTools.log("Asking for input");
  NFProject.importScript();
  NFTools.log("Done following instruction");
  NFTools.breakLog();
  return true;
};

main();

app.endUndoGroup();
