var setupMainComp;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

setupMainComp = function() {
  var backdropFile, backdropFileName, backdropLayer, bgLayer, currentMarker, currentTime, dotOverlayFile, dotOverlayFileName, dotOverlayLayer, duplicatedFootageLayer, fadeLayer, fadeOpacity, fileName, footageFile, footageLayer, footageLayerName, gsPreset, i, j, mainComp, mainCompName, markerCount, markerStream, newComp, newCompLayer, newCompName, newComps, partsFolder, path, precomposedFootageLayer, prevTime, ref, rootFolder;
  fileName = decodeURIComponent(app.project.file.name);
  mainCompName = fileName.substr(0, fileName.indexOf('.')) + ' - MainComp';
  footageFile = app.project.selection[0];
  if (footageFile == null) {
    return alert("Error\nNo footage file selected!");
  }
  backdropFileName = "nf-bg-v01.ai";
  dotOverlayFileName = "particular-bg-overlay-v01.mov";
  footageLayerName = "GREENSCREEN";
  backdropFile = NFProject.findItem(backdropFileName);
  dotOverlayFile = NFProject.findItem(dotOverlayFileName);
  if (!((backdropFile != null) && (dotOverlayFile != null))) {
    return alert("Error\nCan't find dependent files (backdrop and dot overlay) in the project.");
  }
  mainComp = app.project.items.addComp(mainCompName, 1920, 1080, 1.0, footageFile.duration, 29.9700012207031);
  mainComp.hideShyLayers = true;
  footageLayer = mainComp.layers.add(footageFile);
  footageLayer.name = footageLayerName;
  footageLayer.property('Transform').property("Scale").setValue([50, 50]);
  markerStream = footageLayer.property('Marker');
  markerCount = markerStream.numKeys;
  bgLayer = mainComp.layers.addSolid([1, 1, 1], 'Background', 1920, 1080, 1);
  bgLayer.moveBefore(footageLayer);
  newComps = [];
  prevTime = 0;
  rootFolder = app.project.rootFolder;
  partsFolder = app.project.items.addFolder('Parts');
  for (i = j = 1, ref = markerCount + 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
    duplicatedFootageLayer = footageLayer.duplicate();
    duplicatedFootageLayer.name = footageLayerName;
    duplicatedFootageLayer.inPoint = prevTime;
    if (i === markerCount + 1) {
      currentTime = duplicatedFootageLayer.outPoint = mainComp.duration;
    } else {
      currentMarker = markerStream.keyValue(i);
      currentTime = duplicatedFootageLayer.outPoint = markerStream.keyTime(i);
    }
    newCompName = "Part " + i;
    newComp = mainComp.layers.precompose([duplicatedFootageLayer.index], newCompName, true);
    precomposedFootageLayer = newComp.layers[1];
    path = Folder(File($.fileName).parent.parent.fsName).fsName + '/lib/NF Greenscreen Preset.ffx';
    gsPreset = File(path);
    precomposedFootageLayer.selected = true;
    precomposedFootageLayer.applyPreset(gsPreset);
    precomposedFootageLayer.selected = false;
    backdropLayer = newComp.layers.add(backdropFile);
    dotOverlayLayer = newComp.layers.add(dotOverlayFile);
    backdropLayer.name = "NF Backdrop";
    dotOverlayLayer.name = "Dot Overlay";
    dotOverlayLayer.blendingMode = BlendingMode.SCREEN;
    dotOverlayLayer.moveAfter(precomposedFootageLayer);
    backdropLayer.moveAfter(dotOverlayLayer);
    newComps.push(newComp);
    newComp.parentFolder = partsFolder;
    newCompLayer = mainComp.layers.byName(newCompName);
    if (markerCount !== 0) {
      newCompLayer.inPoint = prevTime - 3;
      newCompLayer.outPoint = currentTime + 10;
    }
    newCompLayer.audioEnabled = false;
    newComp.bgColor = [1, 1, 1];
    newCompLayer.moveToBeginning();
    prevTime = currentTime;
  }
  fadeLayer = mainComp.layers.addSolid([1, 1, 1], 'Fade In/Out', 1920, 1080, 1);
  fadeOpacity = fadeLayer.property('Transform').property('Opacity');
  fadeOpacity.setValuesAtTimes([0, 1, mainComp.duration - 2.5, mainComp.duration], [100, 0, 0, 100]);
  fadeLayer.moveToBeginning();
  return footageLayer.remove();
};

app.beginUndoGroup('Setup Main Comp');

setupMainComp();

app.endUndoGroup();
