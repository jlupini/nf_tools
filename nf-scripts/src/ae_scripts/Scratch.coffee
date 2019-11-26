$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

testLayer = NFProject.activeComp().selectedLayers().get(0)

# Apply the Animation Preset
path = Folder(File($.fileName).parent.parent.fsName).fsName + '/lib/NF Greenscreen Preset.ffx'
gsPreset = File path
testLayer.$.applyPreset gsPreset


app.endUndoGroup()
