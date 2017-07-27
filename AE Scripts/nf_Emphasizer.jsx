var mainComp = app.project.activeItem;
var defaults = {
					matchName: "",
					displayName: "",
					stroke: true,
					fill: false,
					blendMode: 4, // (set by item number in blend mode dropdown)
					lineCap: 1, // (set by item number in line cap dropdown)
					lineJoin: 1, // (set by item number in line join dropdown)
					controls: {
						strokeWidth: "Thickness",
						strokeColor: "Color"
					},
					keyframes: {
						opacity: {
							duration: 1,
							delay: 0
						},
						trimStart: {
							duration: 1,
							delay: 0,
							easeType: false,
							easeIn: false,
							easeOut: false,
							easeWeight: 33
						},
						trimEnd: {
							duration: 1,
							delay: 0,
							easeType: false,
							easeIn: false,
							easeOut: false,
							easeWeight: 33
						}
					}
				};

// Add any new supported values to the defaults tree as well, and fall back them if nothing is found
var markupTypes = {
					scribble:{
						matchName: "AV_Scribble",
						displayName: "Scribble",
						stroke: true,
						blendMode: 4, // Multiply (set by item number in blend mode dropdown)
						lineCap: 2, // Round Cap
						lineJoin: 2, // Round Join
						controls: {
							strokeWidth: "Thickness",
							strokeColor: "Color"
						},
						keyframes: {
							opacity: {
								duration: 0.17
							},
							trimEnd: {
								duration: 0.75,
								easeOut: true,
								easeType: KeyframeInterpolationType.BEZIER
							}
						}
					},
					penLine: {
						matchName: "AV_Pen_Line",
						displayName: "Pen Line (Underline/Circle)",
						stroke: true,
						blendMode: 4, // Multiply
						lineCap: 2, // Round Cap
						lineJoin: 2, // Round Join
						controls: {
							strokeWidth: "Thickness",
							strokeColor: "Color"
						},
						keyframes: {
							trimEnd: {
								duration: 0.75,
								easeOut: true,
								easeType: KeyframeInterpolationType.BEZIER
							}
						}
					},
					cylon: {
						matchName: "AV_Cylon",
						displayName: "Cylon (By Your Command)",
						stroke: true,
						blendMode: 4, // Multiply
						lineCap: 1, // Butt Cap
						lineJoin: 1, // Miter Join
						controls: {
							strokeWidth: "Thickness",
							strokeColor: "Color"
						},
						keyframes: {
							trimStart: {
								duration: 1.2,
								delay: 0.3,
								easeOut: true,
								easeIn: true,
								easeType: KeyframeInterpolationType.BEZIER
							},
							trimEnd: {
								duration: 1.2,
								easeOut: true,
								easeIn: true,
								easeType: KeyframeInterpolationType.BEZIER
							}
						}
					}
				  };


function emphasizeContent() {
    // Setup
    app.beginUndoGroup("Emphasize");
    var selectedLayers = mainComp.selectedLayers;
    var selectedLayer = selectedLayers[0];

    if (!(selectedLayer instanceof ShapeLayer))
    {
    	createShapeLayer(selectedLayer);
    	return true;
    }
    
    var w = new Window ("dialog");  
	w.alignChildren = "left";

	for (var markupType in markupTypes) {
	    var radioButton = w.add("radiobutton", undefined, markupTypes[markupType].displayName);
	    radioButton.onClick = getOnClickFunction(markupTypes[markupType], w);
	}

	var cancelButton = w.add ("button", undefined, "Cancel", {name: "cancel"});
	cancelButton.onClick = function() {w.close();}

	w.show();
    app.endUndoGroup();
}

function getOnClickFunction(markupTypeDictionary, w) {
	return function() {
		buildEffect(markupTypeDictionary);
		w.hide();
		return false;
	}
}

function buildEffect(effectDict) {

	var highlightLayer = mainComp.selectedLayers[0];
	highlightLayer.motionBlur = true;
	var latestShape = highlightLayer.property("Contents").property(1);

	// Set fill, stroke, blend mode, cap, join
	latestShape.property("Contents").property("Stroke 1").enabled = effectDict.stroke || defaults.stroke;
	latestShape.property("Contents").property("Fill 1").enabled = effectDict.fill || defaults.fill;
	latestShape.property("Contents").property("Stroke 1").property("Blend Mode").setValue(effectDict.blendMode || defaults.blendMode);
	latestShape.property("Contents").property("Stroke 1").property("Line Cap").setValue(effectDict.lineCap || defaults.lineCap);
    latestShape.property("Contents").property("Stroke 1").property("Line Join").setValue(effectDict.lineJoin || defaults.lineCap);

	// Add a trim
	var trim1 = latestShape.property("Contents").addProperty("ADBE Vector Filter - Trim");

	// Set Keyframes
	if (effectDict.keyframes) {
		if (effectDict.keyframes.opacity) {
			var opacityProperty = latestShape.property("Transform").property("Opacity");
			setKeyframes(opacityProperty, effectDict.keyframes.opacity, defaults.keyframes.opacity);
		}
		if (effectDict.keyframes.trimEnd) {
			var trimEnd = latestShape.property("Contents").property("Trim Paths 1").property("End");
			setKeyframes(trimEnd, effectDict.keyframes.trimEnd, defaults.keyframes.trimEnd);
		}
		if (effectDict.keyframes.trimStart) {
			var trimStart = latestShape.property("Contents").property("Trim Paths 1").property("Start");
			setKeyframes(trimStart, effectDict.keyframes.trimStart, defaults.keyframes.trimStart);
		}
	}

	// Add and hook up Pseudo Effects
	var controlEffect = highlightLayer.property("Effects").addProperty(effectDict.matchName);
	var controlName = controlEffect.name + getControlNumber(highlightLayer, effectDict);
	controlEffect.name = controlName;
	if (effectDict.controls.strokeWidth) {
		latestShape.property("Contents").property("Stroke 1").property("Stroke Width").expression = "effect(\"" + controlName + "\")(\"" + effectDict.controls.strokeWidth + "\")";
	}
	if (effectDict.controls.strokeColor) {
		latestShape.property("Contents").property("Stroke 1").property("Color").expression = "effect(\"" + controlName + "\")(\"" + effectDict.controls.strokeColor + "\")";
	}
	if (effectDict.controls.fillColor) {
		latestShape.property("Contents").property("Fill 1").property("Color").expression = "effect(\"" + controlName + "\")(\"" + effectDict.controls.fillColor + "\")";
	}
}

function setKeyframes(property, options, defaultOptions) {
	var startTime = mainComp.time;
	property.setValueAtTime(startTime + (options.delay || defaultOptions.delay), 0);
	property.setValueAtTime(startTime + (options.delay || defaultOptions.delay) + (options.duration || defaultOptions.duration), 100);

	var propertyEaseType = options.easeType || defaultOptions.easeType;
	if (propertyEaseType) {
		var easeKeys = [];
		var easeIn = options.easeIn || defaultOptions.easeIn;
		var easeOut = options.easeOut || defaultOptions.easeOut;
		if (easeIn) {
			easeKeys.push(1);
		}
		if (easeOut) {
			easeKeys.push(2);
		}

		for (var i = easeKeys.length - 1; i >= 0; i--) {
			property.setInterpolationTypeAtKey(easeKeys[i], propertyEaseType, propertyEaseType);
			var ease = new KeyframeEase(0, (options.easeWeight || defaultOptions.easeWeight));
			property.setTemporalEaseAtKey(easeKeys[i], [ease]);
		}
	}
}

function createShapeLayer(targetLayer) {
	var newShape = app.project.activeItem.layers.addShape();
	if (targetLayer) {
		newShape.moveBefore(targetLayer);
		newShape.name = pageNameFor(targetLayer) + " - Emphasis";
		newShape.parent = targetLayer;
		newShape.startTime = targetLayer.inPoint;
	} else {
		newShape.name = "Emphasis";
	}
}

function pageNameFor(targetLayer) {
	return targetLayer.name.substr(0, targetLayer.name.indexOf('.'));
}

function getControlNumber(shapeLayer, effectDict) {
	// FIXME: This should return the number for this particular type of emphasis
	var effects = shapeLayer.property("Effects");
	return effects.numProperties; 
}

emphasizeContent();