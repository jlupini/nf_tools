#include "runtimeLibraries.jsx";
var NF, _, main;

NF = app.NF;

_ = {
  mainComp: NFProject.activeComp(),
  undoGroupName: 'AutoLayout'
};

app.beginUndoGroup(_.undoGroupName);

main = function() {
  var comp, input, opacityProp, selectedLayer, time;
  $.write("AutoLayout...");
  comp = _.mainComp;
  time = comp.getTime();
  selectedLayer = comp.selectedLayers().get(0);
  opacityProp = selectedLayer.transform().opacity;
  return selectedLayer.addInOutMarkersForProperty({
    property: opacityProp,
    startValue: 0,
    endValue: 50
  });
  input = prompt('Enter the instruction (without brackets):');
  NFProject.followInstruction(input);
  return true;
};

main();

app.endUndoGroup();
