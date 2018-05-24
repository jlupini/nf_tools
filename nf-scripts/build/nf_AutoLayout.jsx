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
  while (true) {
    input = prompt('Enter the instruction (without brackets):');
    if (input === "" || (input == null)) {
      break;
    }
    NFProject.followInstruction(input);
    alert('Moving on');
    time += 5;
    comp.setTime(time);
  }
  return true;
};

main();

app.endUndoGroup();
