function createPDFPrecomps() {
   app.beginUndoGroup("Precompose PDFs");

    var selectedPages = app.project.selection;
    
    var assetsFolder  = findFolder("Assets", app.project.rootFolder);

    var precompFolderName = "PDF Precomps";
    var targetFolder = findFolder(precompFolderName, assetsFolder);
    if (targetFolder == null) {
        targetFolder = assetsFolder.items.addFolder(precompFolderName);
    }
    
    var paperBG = findItem("Paper BG");
    var contentPages = getContentPages(selectedPages);
   
    // Iterate through selected PDFs
    for (var i = 0; i < contentPages.length; i++) {
        
        thisPage = contentPages[i];
        var newComp = createCompFromPageInFolder (thisPage, targetFolder, paperBG);
    }
}

// Returns non-annotation pages
function getContentPages(selectedPages) {
    var contentPages = [];
    for (var i = selectedPages.length - 1; i >= 0; i--) {
        var thisPage = selectedPages[i];
        if (thisPage.name.indexOf("annot") == -1) {
            contentPages.push(thisPage);
        }
    }
    return contentPages;
}

// returns the annotation page for a content page, or null if none is found
function getAnnotationPageFor(contentPage) {
    var contentName = contentPage.name;
    var extensionPosition = contentName.indexOf(".pdf");
    var searchName = [contentName.slice(0, extensionPosition), "_annot", contentName.slice(extensionPosition)].join('');
    return findItem(searchName);
}

// Crates a PDF Precomp from the given page and folder, returns it
function createCompFromPageInFolder(page, folder, background) {
    // constants
    var width = 3840;
    var framerate = 29.97;
    var minutesLong = 10;
    
    var newHeight = Math.ceil(width*page.height/page.width);
    var newComp = folder.items.addComp(newNameFromPageName(thisPage.name), 3840, newHeight, 1, minutesLong * 60, framerate);
    
    var pageLayer = newComp.layers.add(page);
    pageLayer.blendingMode = BlendingMode.MULTIPLY;
    pageLayer.collapseTransformation = true;

    var scaleFactor = width*100/page.width;
    pageLayer.transform.scale.setValue([scaleFactor, scaleFactor, scaleFactor]);

    var annotationPage = getAnnotationPageFor(page);
    if (annotationPage) {
        var annotationLayer = newComp.layers.add(annotationPage);
        annotationLayer.blendingMode = BlendingMode.MULTIPLY;
        annotationLayer.collapseTransformation = true;
        annotationLayer.name = "Annotation Guide";

        var effects = annotationLayer.Effects;
        var checkbox = effects.addProperty("ADBE Checkbox Control");
        var checkboxName = "Guide Layer";
        checkbox.name = checkboxName;
        checkbox.property("Checkbox").setValue(1);

        // Set opacity expression on guide layer
        var opacityControl = annotationLayer.property("Transform").property("Opacity");
        var sourceExpression = "effect(\"Guide Layer\")(\"Checkbox\")*60";
        opacityControl.expression = sourceExpression;

        annotationLayer.transform.scale.setValue([scaleFactor, scaleFactor, scaleFactor]);
    }
    
    var backgroundLayer = newComp.layers.add(background);
    backgroundLayer.moveToEnd();
    backgroundLayer.transform.rotation.setValue(90);
    backgroundLayer.collapseTransformation = true;
    
    var scaleFactor = width*100/background.height;
    backgroundLayer.transform.scale.setValue([scaleFactor, scaleFactor, scaleFactor]);
}

function newNameFromPageName(pageName) {
    return pageName.replace(".pdf", " NFPage")
}

// Given a string with the name of a folder to find and it's parent folder, findFolderIn returns the folderItem, or null of none is found.
// FIXME: Replace this with the version in nf.functions when you convert to coffee
function findFolder(folderName, sourceFolderItem) {
    
    for (var i = 1; i <= sourceFolderItem.numItems; i++) {
        if (sourceFolderItem.item(i).name == folderName) {
            return sourceFolderItem.item(i);
        }
    }
    return null;
}

// FIXME: Replace this with the version in nf.functions when you convert to coffee
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