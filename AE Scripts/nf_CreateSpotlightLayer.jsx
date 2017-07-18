﻿function createSpotlightLayer() {
    
    app.beginUndoGroup("Create Spotlight Layer");

    var mainComp = app.project.activeItem;
    var targetLayer = mainComp.selectedLayers[0];
    
    var spotlightName = newSpotlightNameForLayer(targetLayer);

    // Grab last Mask path
    var spotlightMask = targetLayer.mask(targetLayer.mask.numProperties);


    spotlightMask.name = spotlightName;
    var spotlightPath = spotlightMask.maskPath;
    
    // create new solid
    var spotlightLayer = mainComp.layers.addSolid([0.0078, 0, 0.1216], spotlightName, targetLayer.width, targetLayer.height, 1);
    spotlightLayer.moveBefore(targetLayer);
    
    // Set layer properties
    spotlightLayer.transform.rotation.setValue(targetLayer.transform.rotation.value);
    spotlightLayer.transform.anchorPoint.setValue(targetLayer.transform.anchorPoint.value);
    
    // Hack to get the absolute position of the target layer
    spotlightLayer.transform.position.expression = "L = thisComp.layer(\"" + targetLayer.name + "\"); L.toComp(L.anchorPoint);";
    var targetPosition = spotlightLayer.transform.position;
    spotlightLayer.transform.position.setValue(targetPosition.value);
    spotlightLayer.transform.position.expression = "";
    
    // Hack to get the absolute scale of the target layer
    spotlightLayer.transform.scale.setValue(absoluteScaleOfLayer (targetLayer));

    var spotlightLayerMask = spotlightLayer.mask.addProperty("ADBE Mask Atom");
    //spotlightLayerMask.maskPath.expression = "thisComp.layer(\"" + targetLayer.name + "\").mask(" + spotlightMask.propertyIndex + ").maskPath";
    spotlightLayerMask.maskPath.setValue(spotlightPath.value);

    spotlightLayerMask.maskMode = MaskMode.SUBTRACT;
    
    //spotlightMask.maskMode = MaskMode.NONE;
    spotlightMask.remove();
    
    spotlightLayer.motionBlur = true;
    //spotlightLayer.shy = true;
    
    //mainComp.hideShyLayers = true;
    
    // Create layer Controls
    var effects = targetLayer.Effects;
    
    // Create opacity controls and expression
    var trimString = "";
    trimString += "if (thisComp.layer(\"" + spotlightLayer.name + "\").marker.numKeys > 0){";

    slider = effects.addProperty("ADBE Slider Control");
    slider.slider.setValue(35);
    slider.name = spotlightName + " Opacity";

    trimString += "o = thisComp.layer(\"" + targetLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";

    slider = effects.addProperty("ADBE Slider Control");
    slider.slider.setValue(75);
    slider.name = spotlightName + " Duration";

    trimString += "d = thisComp.layer(\"" + targetLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";
    trimString += "  m = thisComp.layer(\"" + spotlightLayer.name + "\").marker.nearestKey(time);";
    trimString += "  t = m.time;";
    trimString += "  if (m.index%2){"; // For all in markers
    trimString += "    ease(time,t,t+d*thisComp.frameDuration,0,o);";
    trimString += "  }else{"; // For all out markers
    trimString += "    ease(time,t,t-d*thisComp.frameDuration,o,0);";
    trimString += "  }";
    trimString += "}else{";
    trimString += "  value;";
    trimString += "}";
    spotlightLayer.transform.opacity.expression = trimString;

    // Create feather controls and expression
    trimString = "";
    trimString += "if (thisComp.layer(\"" + spotlightLayer.name + "\").marker.numKeys > 0){";
    trimString += "d = thisComp.layer(\"" + targetLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";
    trimString += "  m = thisComp.layer(\"" + spotlightLayer.name + "\").marker.nearestKey(time);";
    trimString += "t = m.time;";

    slider = effects.addProperty("ADBE Slider Control");
    slider.slider.setValue(80);
    slider.name = spotlightName + " Feather";

    trimString += "f = thisComp.layer(\"" + targetLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";
    trimString += "if (m.index%2){"; // For all in markers
    trimString += "ease(time,t,t+d*thisComp.frameDuration,[300, 300],[f, f])";
    trimString += "}else{"; // For all out markers
    trimString += "ease(time,t,t-d*thisComp.frameDuration,[f, f],[300, 300])";
    trimString += "}";
    trimString += "}else{";
    trimString += "value";
    trimString += "}";

    spotlightLayerMask.maskFeather.expression = trimString; 

    spotlightLayer.parent = targetLayer;
    spotlightLayer.startTime = targetLayer.startTime;
    
    targetLayer.selected = true;
    spotlightLayer.selected = false;
    //spotlightLayer.locked = true;

    // Create in/out markers in target layer

    var inMarker = new MarkerValue("Fade In"); 
    spotlightLayer.property("Marker").setValueAtTime(mainComp.time, inMarker);

    var outMarker = new MarkerValue("Fade Out"); 
    spotlightLayer.property("Marker").setValueAtTime(mainComp.time+5, outMarker);


}

function newSpotlightNameForLayer(targetLayer) {
    var layerName = targetLayer.name;
    var shortName = layerName.substr(0, layerName.indexOf('.'));
    var name = "Spotlight" + shortName;

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

function absoluteScaleOfLayer(targetLayer) {
    var scale = targetLayer.transform.scale.value;
    var testLayer = targetLayer;
    while (testLayer.parent != null) {
        scale = [scale[0] * testLayer.parent.scale.value[0] / 100,
                    scale[1] * testLayer.parent.scale.value[1] / 100,
                    scale[2] * testLayer.parent.scale.value[2] / 100];
        testLayer = testLayer.parent;
    }
    return scale;
}

createSpotlightLayer();

