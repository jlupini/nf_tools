#include "runtimeLibraries.jsx";
var NF, _, main;

NF = app.NF;

_ = {
  mainComp: NFProject.activeComp(),
  undoGroupName: 'AutoLayout'
};

app.beginUndoGroup(_.undoGroupName);

main = function() {
  var comp, e, error, input, time;
  $.write("AutoLayout...");
  comp = _.mainComp;
  time = comp.getTime();
  input = prompt('Enter the instruction (without brackets):');
  try {
    NFProject.followInstruction(input);
  } catch (error) {
    e = error;
    alert("Ah shit... Error message:\n\"" + e.message + "\"\n\nFrom line #" + e.line + " in file '" + e.fileName + "'");
  }
  return true;
};

main();

app.endUndoGroup();
