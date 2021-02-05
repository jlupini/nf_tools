$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Re-Import Slide'

oldFlag = "[old]"

oldSlideFolderName = "Old Slide Versions"
oldSlideFolder = NFProject.findItem(oldSlideFolderName) ? NFProject.findItem("Slides").items.addFolder(oldSlideFolderName)

mainComp = new NFComp NFProject.findItem("MedCram Animated MainComp")

successArr = []
failArr = []
for item in app.project.selection
  if item instanceof CompItem
    comp = new NFComp item
    slideFolder = item.parentFolder
    slideLayersFolder = NFProject.findItem("Slide Layers")
    newCompLayersFolderName = "#{comp.getName()} Layers"

    # Look for the psd
    filename = comp.getName() + ".psd"
    startFolder = new Folder(app.project.file.parent.fsName)
    theFile = new File(startFolder.fsName + '/../../Slides/02.\ V1/' + filename)

    if theFile.exists
      # alert "file #{theFile.name} exists!"
      # rename the old comp temporarily
      comp.$.name += oldFlag
      comp.$.parentFolder = oldSlideFolder

      oldCompLayersFolder = NFProject.findItem newCompLayersFolderName
      oldCompLayersFolder.name += oldFlag

      options = new ImportOptions(theFile)
      options.importAs = ImportAsType.COMP

      newCompItem = app.project.importFile options
      newCompItem.parentFolder = slideFolder

      newCompLayersFolder = NFProject.findItem newCompLayersFolderName
      newCompLayersFolder.parentFolder = slideLayersFolder

      mainComp.allLayers().forEach (layer) =>
        if layer.$.isAVLayer()
          if layer.$.source? and layer.$.source instanceof CompItem
            layerSourceComp = new NFComp layer.$.source
            if layerSourceComp.is comp
              layer.$.replaceSource newCompItem, false
              successArr.push comp
    else
      failArr.push
        item: comp
        reason: "Could not find file '#{theFile.name}' at path #{theFile.fsName}"
  else
    failArr.push
      item: item
      reason: "Item #{item.name} is not a CompItem"

successString = "Successfully replaced sources for: "
failString = "Failures:\n"
for comp, i in successArr
  successString += comp.getName()
  if i is successArr.length - 1
    successString += "."
  else
    successString += ", "
successString += "\n"
for entry, i in failArr
  failString += entry.reason + "\n"

finalString = if failArr.length > 0 then successString + failString else successString
alert finalString

app.endUndoGroup()
