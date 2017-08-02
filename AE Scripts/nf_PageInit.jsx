﻿function initializePages() {
    // Setup
    app.beginUndoGroup("Initialize Pages");
    var mainComp = app.project.activeItem;
    var selectedLayers = mainComp.selectedLayers;
    
    setSize(selectedLayers);
    setPosition(selectedLayers);

    var thisLayer;
	for (var i = 0; i < selectedLayers.length; i++) {
        thisLayer = selectedLayers[i];

        // Add Motion Blur
		thisLayer.motionBlur = true;

		setDropShadowForLayer(thisLayer);
	} 

    var name = nullName(selectedLayers[0]);
    var newParent = nullify(selectedLayers, name);
    var zoomer = zoom(newParent);

    bubbleUpHighlights(selectedLayers);
    bubbleUpGuideLayers(selectedLayers);
    
    app.endUndoGroup();

}

function setDropShadowForLayer(layer) {
	var dropShadow = layer.property("Effects").addProperty("ADBE Drop Shadow");

	dropShadow.property("Opacity").setValue(191.25);
	dropShadow.property("Direction").setValue(0);
	dropShadow.property("Distance").setValue(20);
	dropShadow.property("Softness").setValue(300);
}

function setSize(selectedLayers) {

	var thisLayer;
	for (var i = 0; i < selectedLayers.length; i++) {
        thisLayer = selectedLayers[i];
		thisLayer.property("Transform").property("Scale").setValue([50,50,50]);
	} 
}

function setPosition(selectedLayers) {

	var thisLayer;
	for (var i = 0; i < selectedLayers.length; i++) {
        thisLayer = selectedLayers[i];
		
		var layerHeight = thisLayer.height;
		var oldPosition = thisLayer.property("Transform").property("Position").value;

		var newPosition = oldPosition;
		newPosition[1] = layerHeight/4;

		thisLayer.property("Transform").property("Position").setValue(newPosition);
	} 
}

function nullName(selectedLayer) {
	var fullName = selectedLayer.name;
	var newName = fullName.substr(0, fullName.indexOf('_'));
	return newName;
}

function zoom(target) {
	var zoomName = "Zoomer";
	var zoomer = app.project.activeItem.layer(zoomName);

	if (zoomer == null) {
		zoomer = app.project.activeItem.layer(zoomName.toLowerCase());
	}

	if (zoomer == null) {
		zoomer = nullify([target], zoomName);
	} else {
		target.parent = zoomer;
	}

	return zoomer;
}

function nullify(selectedLayers, nullName) {

	var mainComp = app.project.activeItem;

	var newNull = mainComp.layers.addNull();

	newNull.name = nullName;
    
    
	newNull.moveBefore(topmostLayer(selectedLayers));

	var thisLayer;
	//$.write("new null: "+ newNull.name + "\n");
	for (var i = 1; i <= selectedLayers.length; i++)
	{
	    thisLayer = selectedLayers[i-1];
	    thisLayer.parent = newNull;
	}
   	return newNull;

}

function topmostLayer(layers) {
	var lowestIndex = layers[0].index;

	var thisLayer;
	for (var i = 1; i < layers.length; i++)
	{
	    if (layers[i].index < lowestIndex) {
	    	lowestIndex = layers[i].index;
	    }
	}

	return app.project.activeItem.layer(lowestIndex);
}

function bubbleUpGuideLayers(pagesToBubble) {
	var mainComp = app.project.activeItem;

	for (var i = pagesToBubble.length - 1; i >= 0; i--) {

		var targetLayer = pagesToBubble[i];
		var targetComp = targetLayer.source;

		// Look in selected comp
		// Grab guide layer
		var layersInPageComp = targetComp.layers;
		var guideLayer = layersInPageComp.byName("Annotation Guide");

		if (guideLayer) {

			var childGuideEffect = guideLayer.property("Effects").property("Guide Layer");
			var childGuideCheckbox;
			if (childGuideEffect) {
				childGuideCheckbox = childGuideEffect.property("Checkbox");
			}

			// FIXME: Kill this (first part of if statement) eventually. It's temporary to handle running pageInit on pages precomped with old versions of precompose PDFs
			if (!childGuideCheckbox) {
				// Add checkbox to targetLayer
				var effects = targetLayer.Effects;
				var checkbox = effects.addProperty("ADBE Checkbox Control");
				var checkboxName = "Guide Layer";
				checkbox.name = checkboxName;

				// Set checkbox to match current opacity
				// If guide layer is hidden, set the opacity to be 0
				var newValue;
				if (!guideLayer.enabled) {
					guideLayer.enabled = true;
					newValue = false;
				} else {
					newValue = true;
				}

				checkbox.property("Checkbox").setValue(newValue);

				// Set childCheckbox expression on guide layer
				var sourceExpression = "comp(\"" + mainComp.name + "\").layer(\"" + targetLayer.name + "\").effect(\"" + checkboxName + "\")(\"Checkbox\")*60";
				guideLayer.property("Transform").property("Opacity").expression = sourceExpression;

			// FIXME: Make it so that the guide layer is visible if ANY of the parent layers have this enabled
			// (basically take out this if statement and add to the existing expression each time you pageinit in a different place)
			} else if (!childGuideCheckbox.expressionEnabled) {


				// Add checkbox to targetLayer
				var effects = targetLayer.Effects;
				var checkbox = effects.addProperty("ADBE Checkbox Control");
				var checkboxName = "Guide Layer";
				checkbox.name = checkboxName;

				// Set checkbox to match current opacity
				// If guide layer is hidden, set the opacity to be 0
				var newValue;
				if (!guideLayer.enabled) {
					guideLayer.enabled = true;
					newValue = false;
				} else {
					newValue = childGuideCheckbox.value;
				}

				checkbox.property("Checkbox").setValue(newValue);

				// Set childCheckbox expression on guide layer
				var sourceExpression = "comp(\"" + mainComp.name + "\").layer(\"" + targetLayer.name + "\").effect(\"" + checkboxName + "\")(\"Checkbox\")*60";
				childGuideCheckbox.expression = sourceExpression;
			}
		}
	}
}

function bubbleUpHighlights(pagesToBubble) {

	//FIXME: Ask which highlights you want to capture

	var mainComp = app.project.activeItem;

	for (var i = pagesToBubble.length - 1; i >= 0; i--) {

		var targetLayer = pagesToBubble[i];
		var targetComp = targetLayer.source;

		// Look in selected comp
		// Grab Array of highlight layers
		var layersInPageComp = targetComp.layers;
		var highlightLayersInPageComp = [];
		for (var k = layersInPageComp.length; k >= 1; k--) {

			testLayer = layersInPageComp[k];
			if (testLayer.property("Effects").property("AV Highlighter")) {
				highlightLayersInPageComp.push(testLayer);
			} else if (testLayer.property("Effects").property("Completion")) {
				upgradeHighlightLayer(testLayer);
				highlightLayersInPageComp.push(testLayer);
			}
		}

		// Create layer Controls
		var effects = targetLayer.Effects;
		for (var j = highlightLayersInPageComp.length - 1; j >= 0; j--) {

			// Add Controls
			var sourceHighlighterEffect = highlightLayersInPageComp[j].property("Effects").property("AV Highlighter");

			// Only do this if it's not already hooked up to another parent comp
			if (!sourceHighlighterEffect.property("Completion").expressionEnabled) {
				var targetHighlighterEffect = effects.addProperty("AV_Highlighter");

				var newName = highlightLayersInPageComp[j].name + " Highlighter";
				targetHighlighterEffect.name = newName;
				var highlighterProperties = ["Spacing", "Thickness", "Start Offset", "Completion", "Offset", "Opacity", "Highlight Colour"];

				for (var l = highlighterProperties.length - 1; l >= 0; l--) {
					
					var highlighterProperty = highlighterProperties[l];
					var sourceHighlighterPropertyValue = sourceHighlighterEffect.property(highlighterProperty).value;
					targetHighlighterEffect.property(highlighterProperty).setValue(sourceHighlighterPropertyValue);

					var sourceExpression = "";
					sourceExpression += "var offsetTime = comp(\"" + mainComp.name + "\").layer(\"" + targetLayer.name + "\").startTime;";
					sourceExpression += "comp(\"" + mainComp.name + "\").layer(\"" + targetLayer.name + "\").effect(\"" + newName + "\")(\"" + highlighterProperty + "\")";
					sourceExpression += ".valueAtTime(time+offsetTime)";
					sourceHighlighterEffect.property(highlighterProperty).expression = sourceExpression;
				}		
			}
		}
	}
}

// Deprecate soon - Upgrades a highlight layer from the old style to the new, pseudo-effect style
// Returns the highlight layer
function upgradeHighlightLayer(highlightLayer) {

	var mainComp = app.project.activeItem;

	// Create layer Controls
	var effects = highlightLayer.Effects;
	effects.addProperty("AV_Highlighter");

	var spacingSlider = effects.property("Spacing").property("Slider");
	var thicknessSlider = effects.property("Thickness").property("Slider");
	var colorPicker = effects.property("Color").property("Color");
	var offsetSlider = effects.property("Start Offset").property("Slider");
	var completionSlider = effects.property("Completion").property("Slider");

	effects.property("AV Highlighter").property("Spacing").setValue(spacingSlider.value);
	effects.property("AV Highlighter").property("Thickness").setValue(thicknessSlider.value);
	effects.property("AV Highlighter").property("Color").setValue(colorPicker.value);
	effects.property("AV Highlighter").property("Start Offset").setValue(offsetSlider.value);
	effects.property("AV Highlighter").property("Completion").setValue(completionSlider.value);

	spacingSlider.expression = "effect(\"AV Highlighter\")(\"Spacing\")";
	thicknessSlider.expression = "effect(\"AV Highlighter\")(\"Thickness\")";
	colorPicker.expression = "effect(\"AV Highlighter\")(\"Color\")";
	offsetSlider.expression = "effect(\"AV Highlighter\")(\"Start Offset\")";
	completionSlider.expression = "effect(\"AV Highlighter\")(\"Completion\")";

	highlightLayer.property("Transform").property("Opacity").expression = "effect(\"AV Highlighter\")(\"Opacity\")";

	var offsetString = "";
	offsetString += "[transform.position[0]+ effect(\"AV Highlighter\")(\"Offset\")[0],";
	offsetString += " transform.position[1]+ effect(\"AV Highlighter\")(\"Offset\")[1]]";
	highlightLayer.property("Transform").property("Position").expression = offsetString;
}

initializePages();