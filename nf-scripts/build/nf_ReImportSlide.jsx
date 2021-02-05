var comp, entry, failArr, failString, filename, finalString, i, item, j, k, l, len, len1, len2, mainComp, newCompItem, newCompLayersFolder, newCompLayersFolderName, oldCompLayersFolder, oldFlag, oldSlideFolder, oldSlideFolderName, options, ref, ref1, slideFolder, slideLayersFolder, startFolder, successArr, successString, theFile;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

app.beginUndoGroup('Re-Import Slide');

oldFlag = "[old]";

oldSlideFolderName = "Old Slide Versions";

oldSlideFolder = (ref = NFProject.findItem(oldSlideFolderName)) != null ? ref : NFProject.findItem("Slides").items.addFolder(oldSlideFolderName);

mainComp = new NFComp(NFProject.findItem("MedCram Animated MainComp"));

successArr = [];

failArr = [];

ref1 = app.project.selection;
for (j = 0, len = ref1.length; j < len; j++) {
  item = ref1[j];
  if (item instanceof CompItem) {
    comp = new NFComp(item);
    slideFolder = item.parentFolder;
    slideLayersFolder = NFProject.findItem("Slide Layers");
    newCompLayersFolderName = (comp.getName()) + " Layers";
    filename = comp.getName() + ".psd";
    startFolder = new Folder(app.project.file.parent.fsName);
    theFile = new File(startFolder.fsName + '/../../Slides/02.\ V1/' + filename);
    if (theFile.exists) {
      comp.$.name += oldFlag;
      comp.$.parentFolder = oldSlideFolder;
      oldCompLayersFolder = NFProject.findItem(newCompLayersFolderName);
      oldCompLayersFolder.name += oldFlag;
      options = new ImportOptions(theFile);
      options.importAs = ImportAsType.COMP;
      newCompItem = app.project.importFile(options);
      newCompItem.parentFolder = slideFolder;
      newCompLayersFolder = NFProject.findItem(newCompLayersFolderName);
      newCompLayersFolder.parentFolder = slideLayersFolder;
      mainComp.allLayers().forEach((function(_this) {
        return function(layer) {
          var layerSourceComp;
          if (layer.$.isAVLayer()) {
            if ((layer.$.source != null) && layer.$.source instanceof CompItem) {
              layerSourceComp = new NFComp(layer.$.source);
              if (layerSourceComp.is(comp)) {
                layer.$.replaceSource(newCompItem, false);
                return successArr.push(comp);
              }
            }
          }
        };
      })(this));
    } else {
      failArr.push({
        item: comp,
        reason: "Could not find file '" + theFile.name + "' at path " + theFile.fsName
      });
    }
  } else {
    failArr.push({
      item: item,
      reason: "Item " + item.name + " is not a CompItem"
    });
  }
}

successString = "Successfully replaced sources for: ";

failString = "Failures:\n";

for (i = k = 0, len1 = successArr.length; k < len1; i = ++k) {
  comp = successArr[i];
  successString += comp.getName();
  if (i === successArr.length - 1) {
    successString += ".";
  } else {
    successString += ", ";
  }
}

successString += "\n";

for (i = l = 0, len2 = failArr.length; l < len2; i = ++l) {
  entry = failArr[i];
  failString += entry.reason + "\n";
}

finalString = failArr.length > 0 ? successString + failString : successString;

alert(finalString);

app.endUndoGroup();
