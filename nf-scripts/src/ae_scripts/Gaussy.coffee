try `#include "runtimeLibraries.jsx"`

app.beginUndoGroup 'Create Gaussy Layer'
NFProject.activeComp().addGaussy()
app.endUndoGroup()
