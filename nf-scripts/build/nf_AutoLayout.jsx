var NF, _, d, main, n;

d = new Date();

n = d.getTime();

$.write("\n\nSTARTING\n----------------\nInitializing Libraries!\n");

#include "runtimeLibraries.jsx";

$.write("Setting up Script: +" + (NFTools.now() - n) + "ms\n");

NF = app.NF;

_ = {
  mainComp: NFProject.activeComp(),
  undoGroupName: 'AutoLayout'
};

app.beginUndoGroup(_.undoGroupName);

main = function() {
  var comp;
  NFTools.log("Asking for input");
  comp = _.mainComp;
  NFProject.importScript();
  NFTools.log("Done following instruction");
  NFTools.breakLog();
  return true;
};

main();

app.endUndoGroup();
