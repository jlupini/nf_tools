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
  var comp, input;
  NFTools.log("Asking for input");
  comp = _.mainComp;
  input = prompt('Enter the instruction (without brackets):', '', 'AutoLayout');
  NFTools.log("Following Instruction");
  if (!((input != null) && input !== "")) {
    return false;
  }
  NFProject.followInstruction(input);
  NFTools.log("Done following instruction");
  NFTools.breakLog();
  return true;
};

main();

app.endUndoGroup();
