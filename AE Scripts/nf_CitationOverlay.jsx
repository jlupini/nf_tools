// Setup
app.beginUndoGroup("CitationOverlay");
var mainComp = app.project.activeItem;
var selectedLayer = mainComp.selectedLayers;
var citationString = prompt("Please enter the citation text");
var targetLayer = mainComp.selectedLayers[0]; //POSITION EACH LAYER RELATIVE TO THIS ONE
var nullParentLayer = targetLayer.parent;

// Create background layer and add effects
var bgLayer = mainComp.layers.addSolid([0,0,0], "colorCorrect", mainComp.width, mainComp.height,1);
bgLayer.adjustmentLayer = true;
bgLayer.name = "Bg Blur - " + citationString;
var BgBlur = bgLayer.property("Effects").addProperty("ADBE Gaussian Blur 2");
BgBlur.property("Blurriness").setValue(35);
BgBlur.property("Repeat Edge Pixels").setValue(1);
var BgBrightness = bgLayer.property("Effects").addProperty("ADBE Brightness & Contrast 2");
BgBrightness.property("Brightness").setValue(-148);

// Create and format text layer
var fontSize = 37;
var textLayer = mainComp.layers.addBoxText([(fontSize+20)*citationString.length,(fontSize+20)],citationString);
var textLayer_TextProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
var textLayer_TextDocument = textLayer_TextProp.value;
textLayer_TextDocument.resetCharStyle();
textLayer_TextDocument.fillColor = [1, 1, 1];
textLayer_TextDocument.strokeWidth = 0;
textLayer_TextDocument.font = "Avenir Next";
textLayer_TextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY; 
textLayer_TextDocument.fontSize = fontSize;
textLayer_TextDocument.applyFill =true;
textLayer_TextDocument.applyStroke = false;
textLayer_TextProp.setValue(textLayer_TextDocument);
textLayer.boxText = true;

// Position text layer
var sourceRectText = textLayer.sourceRectAtTime(0, false);
textLayer.anchorPoint.setValue([sourceRectText.left+sourceRectText.width, sourceRectText.top]);
//textLayer.position.setValue([mainComp.width,0,0]);
var textBoxSizeX = textLayer_TextDocument.boxTextSize[0];
var textBoxSizeY = textLayer_TextDocument.boxTextSize[1]; 

// Create mask and position
var maskShape = new Shape();
maskShape.vertices = [[0,sourceRectText.height+20],[0,0],[sourceRectText.width+25,0],[sourceRectText.width+25,sourceRectText.height+20]]; 
//maskShape.vertices = [[mainComp.width-textBoxSizeX,mainComp.height-textBoxSizeY], [mainComp.width-textBoxSizeX,mainComp.height], [mainComp.width,mainComp.height], [mainComp.width,mainComp.height-textBoxSizeY]]; 
maskShape.closed = true;
var bgMask = bgLayer.property("Masks").addProperty("Mask");
var maskPath = bgMask.property("Mask Path");
maskPath.setValue(maskShape); 

// Final Positions
var sourceRectBgMask = bgLayer.sourceRectAtTime(0, false);
bgLayer.anchorPoint.setValue([sourceRectText.width+25,0]);
bgLayer.position.setValue([mainComp.width,20,0]);

textLayer.position.setValue([mainComp.width-10,30,0]);

// Order Layers Correctly
bgLayer.moveAfter(nullParentLayer);
textLayer.moveBefore(bgLayer);

// Precompose
var newName = targetLayer.name.substr(0, targetLayer.name.indexOf('_')) + " - Citation";
var newComp = mainComp.layers.precompose([textLayer.index, bgLayer.index], newName, true);
var newLayer = mainComp.layers.byName(newName);

// Fnally add in and out transitions
// Create opacity expression on text layer

var trimString = "";
trimString += "if (thisComp.layer(\"" + nullParentLayer.name + "\").marker.numKeys > 0){";

var slider = nullParentLayer.property("Effects").addProperty("ADBE Slider Control");
slider.slider.setValue(75);
slider.name = "Duration";

trimString += "d = thisComp.layer(\"" + nullParentLayer.name + "\").effect(\"" + slider.name  + "\")(\"Slider\");";
trimString += "m = thisComp.layer(\"" + nullParentLayer.name + "\").marker.nearestKey(time);";
trimString += "t = m.time;";
trimString += "if (m.index%2){"; // For all in markers
trimString += "  ease(time,t,t+d*thisComp.frameDuration,0,100);";
trimString += "  }else{"; // For all out markers
trimString += "    ease(time,t,t-d*thisComp.frameDuration,100,0);";
trimString += "  }";
trimString += "}else{";
trimString += "  value;";
trimString += "}";

newLayer.transform.opacity.expression = trimString;
newLayer.collapseTransformation = true;

newLayer.startTime = targetLayer.inPoint;

// Add in and out markers

    var inMarker = new MarkerValue("Cite In"); 
    nullParentLayer.property("Marker").setValueAtTime(newLayer.startTime+5, inMarker);

    var outMarker = new MarkerValue("Cite Out"); 
    nullParentLayer.property("Marker").setValueAtTime(newLayer.startTime+10, outMarker);

