function createPDFPrecomps() {
   app.beginUndoGroup("Precompose PDFs");

    var selectedPages = app.project.selection;
    
    var assetsFolder  = findFolderIn("Assets", app.project.rootFolder);
    var targetFolder = assetsFolder.items.addFolder("PDF Precomps");
    
    var paperBG = findItem("Paper BG");
   
    // Iterate through selected PDFs
    for (var i = 0; i < selectedPages.length; i++) {
        
        thisPage = selectedPages[i];
        var newComp = createCompFromPageInFolder (thisPage, targetFolder, paperBG);
    }

}

// Crates a PDF Precomp from the given page and folder, returns it
function createCompFromPageInFolder(page, folder, background) {
    // constants
    var width = 3840;
    var framerate = 29.97;
    var minutesLong = 10;
    
    var newHeight = Math.ceil(width*page.height/page.width);
    var newComp = folder.items.addComp(thisPage.name, 3840, newHeight, 1, minutesLong * 60, framerate);
    
    var pageLayer = newComp.layers.add(page);
    pageLayer.blendingMode = BlendingMode.MULTIPLY;
    pageLayer.collapseTransformation = true;
    pageLayer.motionBlur = true;
    
    var scaleFactor = width*100/page.width;
    pageLayer.transform.scale.setValue([scaleFactor, scaleFactor, scaleFactor]);
    
    var backgroundLayer = newComp.layers.add(background);
    backgroundLayer.moveToEnd();
    backgroundLayer.transform.rotation.setValue(90);
    backgroundLayer.collapseTransformation = true;
    
    var scaleFactor = width*100/background.height;
    backgroundLayer.transform.scale.setValue([scaleFactor, scaleFactor, scaleFactor]);
}

// Given a string with the name of a folder to find and it's parent folder, findFolderIn returns the folderItem, or null of none is found.
function findFolderIn(folderName, sourceFolderItem) {
    
    for (var i = 1; i <= sourceFolderItem.numItems; i++) {
        if (sourceFolderItem.item(i).name == folderName) {
            return sourceFolderItem.item(i);
        }
    }
    return null;
}

function findItem(itemName) {
    
    for (var i = 1; i <= app.project.items.length; i++) {
        var thisItem = app.project.items[i];
        if (thisItem.name == itemName) {
            return thisItem;
        }
    }

    return null;
}

createPDFPrecomps();