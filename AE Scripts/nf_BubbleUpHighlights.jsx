//FIXME: Change to 'BubbleUpProperties', and include the functionality to bubble up the guide layer (code in nf_PageInit)

//FIXME: Ask which highlights you want to capture

var mainComp = app.project.activeItem;
var pagesToBubble = mainComp.selectedLayers;

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

			var highlighterProperties = ["Spacing", "Thickness", "Color", "Start Offset", "Completion", "Offset", "Opacity"];

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