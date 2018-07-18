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
  var comp, curr, input, postInstructionTime, time;
  curr = NFTools.now() - n;
  $.write("Boom! Time: +" + curr + "ms\nAsking for input...\n");
  comp = _.mainComp;
  time = comp.getTime();
  input = prompt('Enter the instruction (without brackets):', '', 'AutoLayout');
  postInstructionTime = NFTools.now();
  $.write("Following instruction!\n");
  if (!((input != null) && input !== "")) {
    return false;
  }
  NFProject.followInstruction(input);
  $.write("Done! Time: +" + (NFTools.now() - postInstructionTime) + "ms\n");
  return true;
};

main();

app.endUndoGroup();
