#include "runtimeLibraries.jsx";
var NF, _, main;

NF = app.NF;

_ = {
  mainComp: new NFPartComp(app.project.activeItem),
  undoGroupName: 'AutoLayout'
};

app.beginUndoGroup(_.undoGroupName);

main = function() {
  return $.write("AutoLayout...");
};

main();

app.endUndoGroup();
