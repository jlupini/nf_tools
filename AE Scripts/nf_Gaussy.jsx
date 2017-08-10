function createGaussyLayer() {
    
    app.beginUndoGroup("Create Gaussy Layer");

    var mainComp = app.project.activeItem;
    var targetLayer = mainComp.selectedLayers[0];
    
    var gaussyName = newGaussyNameForLayer(targetLayer);
    
    // create new adjustment layer
    var gaussyLayer = mainComp.layers.addSolid([1, 1, 1], gaussyName, targetLayer.width, targetLayer.height, 1);
    gaussyLayer.adjustmentLayer = true;
    gaussyLayer.moveBefore(targetLayer);
    var gaussianBlur = gaussyLayer.property("Effects").addProperty("Gaussian Blur");
    gaussianBlur.property("Repeat Edge Pixels").setValue(true);

    // Create layer Controls
    var effects = gaussyLayer.Effects;

    // Create blur controls and expression

    slider = effects.addProperty("ADBE Slider Control");
    slider.slider.setValue(25);
    slider.name = gaussyName + " Duration";

    trimString = "";
    trimString += "if (thisComp.layer(\"" + gaussyLayer.name + "\").marker.numKeys > 0){";
    trimString += "d = thisComp.layer(\"" + gaussyLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";
    trimString += "  m = thisComp.layer(\"" + gaussyLayer.name + "\").marker.nearestKey(time);";
    trimString += "t = m.time;";

    slider = effects.addProperty("ADBE Slider Control");
    slider.slider.setValue(115);
    slider.name = gaussyName + " Blur";

    trimString += "f = thisComp.layer(\"" + gaussyLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";
    trimString += "if (m.index%2){"; // For all in markers
    trimString += "ease(time,t,t+d*thisComp.frameDuration,0,f)";
    trimString += "}else{"; // For all out markers
    trimString += "ease(time,t,t-d*thisComp.frameDuration,f,0)";
    trimString += "}";
    trimString += "}else{";
    trimString += "value";
    trimString += "}";

    gaussyLayer.property("Effects").property("Gaussian Blur").property("Blurriness").expression = trimString;
    //gaussianBlur.property("Blurriness").expression = trimString; 

    gaussyLayer.startTime = targetLayer.startTime;
    
    targetLayer.selected = true;
    gaussyLayer.selected = false;

    // Create in/out markers in target layer
    var inMarker = new MarkerValue("Blur In"); 
    gaussyLayer.property("Marker").setValueAtTime(mainComp.time, inMarker);

    var outMarker = new MarkerValue("Blur Out"); 
    gaussyLayer.property("Marker").setValueAtTime(mainComp.time+5, outMarker);


}

function newGaussyNameForLayer(targetLayer) {
    var layerName = targetLayer.name;
    var shortName = layerName.substr(0, layerName.indexOf('.'));
    var name = "Blur" + shortName;

    if (targetLayer.mask(name) == null) {
        return name;
    } else {
        for (var i = 2; i <= targetLayer.mask.numProperties; i++) {
            var testName = name + " " + i;
            if (targetLayer.mask(testName) == null) {
                return testName;
            }
        }
    }
    return name;
}

createGaussyLayer();

