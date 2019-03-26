try {
  #include "runtimeLibraries.jsx";
} catch (undefined) {}

app.beginUndoGroup('Create Gaussy Layer');

NFProject.activeComp().addGaussy();

app.endUndoGroup();
