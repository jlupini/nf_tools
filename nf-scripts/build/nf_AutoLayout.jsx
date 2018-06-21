#include "runtimeLibraries.jsx";
var NF, _, main;

NF = app.NF;

_ = {
  mainComp: NFProject.activeComp(),
  undoGroupName: 'AutoLayout'
};

app.beginUndoGroup(_.undoGroupName);

main = function() {
  var comp, input, time;
  $.write("AutoLayout...");
  comp = _.mainComp;
  time = comp.getTime();
  input = prompt('Enter the instruction (without brackets):');
  NFProject.followInstruction(input);
  return true;
};

main();

app.endUndoGroup();
