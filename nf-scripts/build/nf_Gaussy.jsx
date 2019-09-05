$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

app.beginUndoGroup('Create Gaussy Layer');

NFProject.activeComp().addGaussy();

app.endUndoGroup();
