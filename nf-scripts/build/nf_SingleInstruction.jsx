var NF, main;

try {
  #include "runtimeLibraries.jsx";
} catch (undefined) {}

NF = app.NF;

app.beginUndoGroup('Follow Single Instruction');

main = function() {
  var input;
  NFTools.clearLog();
  NFTools.log("Asking for input");
  input = prompt('Enter the instruction (without brackets):', '', 'AutoLayout');
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