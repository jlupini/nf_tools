createHighlighter();

function createHighlighter () {

    app.beginUndoGroup("Create Highlight Layer");

    var highlightColorYELLOW = [255, 221,   3, 255];
    var highlightColorBLUE   = [152, 218, 255, 255];
    var highlightColorPURPLE = [236, 152, 255, 255];
    var highlightColorGREEN  = [157, 255, 160, 255];
    var highlightColorPINK   = [255, 152, 202, 255];
    var highlightColorORANGE = [255, 175, 104, 255];
    var highlightColorRED    = [255, 157, 157, 255];

    var highlightColorOptions = [highlightColorYELLOW,
                                 highlightColorBLUE,
                                 highlightColorPURPLE,
                                 highlightColorGREEN,
                                 highlightColorPINK,
                                 highlightColorYELLOW,
                                 highlightColorRED];

    var mainComp = app.project.activeItem;
    var highlightLayer = mainComp.selectedLayers[0];

    if (!(highlightLayer instanceof ShapeLayer)) // If this is not being run on a shape layer, create one
        {
            createShapeLayer(highlightLayer);
            return true;
        }

    var highlightLinesCount = parseInt(prompt("How many initial highlight lines would you like to create?"));

    highlightLayer.name = "Highlighter";
    highlightLayer.blendingMode = BlendingMode.MULTIPLY;
    //highlightLayer.motionBlur = true;

    var shape1 = highlightLayer.property("Contents").property("Shape 1");

    // Remove the fill
    shape1.property("Contents").property("Fill 1").remove();

    // Add a trim
    var trim1 = shape1.property("Contents").addProperty("ADBE Vector Filter - Trim");

    // Create layer Controls
    var effects = highlightLayer.Effects;
    effects.addProperty("AV_Highlighter");

    // Start to set properties
    shape1.property("Contents").property("Stroke 1").property("Stroke Width").expression = "effect(\"AV Highlighter\")(\"Thickness\")";
    shape1.property("Contents").property("Trim Paths 1").property("Start").expression = "effect(\"AV Highlighter\")(\"Start Offset\")";
    highlightLayer.property("Transform").property("Opacity").expression = "effect(\"AV Highlighter\")(\"Opacity\")";

    // Set colour property based on variables at top of script
    var trimString = "";
    trimString += "popup_val = effect(\"AV Highlighter\")(\"Highlight Colour\");";
    for (var i = 0; i < highlightColorOptions.length; i++) {
        if (i != 0) {
            trimString += "else ";
        }
        if (i != (highlightColorOptions.length - 1)) {
            trimString += "if (popup_val == " + (i+1) + ") ";
        }
        trimString += "{ [" + highlightColorOptions[i].toString() + "]/255; } ";
    }
    trimString += ";";

    shape1.property("Contents").property("Stroke 1").property("Color").expression = trimString;

    var offsetString = "";
    offsetString += "[transform.position[0]+ effect(\"AV Highlighter\")(\"Offset\")[0],";
    offsetString += " transform.position[1]+ effect(\"AV Highlighter\")(\"Offset\")[1]]";
    highlightLayer.property("Transform").property("Position").expression = offsetString;

    // Set the expression for line 1
    var trimString = "";
    trimString += "slider_val = effect(\"AV Highlighter\")(\"Completion\") / 10;";
    trimString += "start_offset = effect(\"AV Highlighter\")(\"Start Offset\");";
    trimString += "line_count = " + highlightLinesCount +";";
    trimString += "this_line = " + 1 + ";";
    trimString += "total_points = line_count * 100;";
    trimString += "gross_points = total_points - start_offset; ";
    trimString += "points_per_line = gross_points/line_count*100;";
    trimString += "total_percent = (slider_val / 100 * gross_points + start_offset) / total_points * 100;";
    trimString += "min_percent = 100/line_count*(this_line-1);";
    trimString += "max_percent = 100/line_count*this_line;";

    trimString += "if (total_percent <= min_percent) {0;} ";
    trimString += "else if ( total_percent >= max_percent ) { 100; } ";
    trimString += "else { (total_percent - min_percent) / (max_percent - min_percent) * 100; } ";

    shape1.property("Contents").property("Trim Paths 1").property("End").expression = trimString;

    // Make the additional lines
    for (var i = 2; i <= highlightLinesCount; i++)
    {
        // Duplicate the shape and offset its position
        var newShape = highlightLayer.property("Contents").property(1).duplicate();
        newShape.property("Transform").property("Position").expression = "[content(\"Shape 1\").transform.position[0], effect(\"AV Highlighter\")(\"Spacing\")*" + (i-1) + "]";
        
        // Make the new slider and make it control the new shape's trim paths property
        newShape.property("Contents").property("Trim Paths 1").property("Start").expression = "";
        
        trimString = "";
        trimString += "slider_val = effect(\"AV Highlighter\")(\"Completion\") / 10;"; 
        trimString += "start_offset = effect(\"AV Highlighter\")(\"Start Offset\");";
        trimString += "line_count = " + highlightLinesCount +";";
        trimString += "this_line = " + i + ";";
        trimString += "total_points = line_count * 100;";
        trimString += "gross_points = total_points - start_offset; ";
        trimString += "points_per_line = gross_points/line_count*100;";
        trimString += "total_percent = (slider_val / 100 * gross_points + start_offset) / total_points * 100;";
        trimString += "min_percent = 100/line_count*(this_line-1);";
        trimString += "max_percent = 100/line_count*this_line;";

        trimString += "if (total_percent <= min_percent) {0;} ";
        trimString += "else if ( total_percent >= max_percent ) { 100; } ";
        trimString += "else { (total_percent - min_percent) / (max_percent - min_percent) * 100; } ";
        
        newShape.property("Contents").property("Trim Paths 1").property("End").expression = trimString;
   
   }
}

function createShapeLayer(targetLayer) {

    var newShape = app.project.activeItem.layers.addShape();
    newShape.moveBefore(targetLayer);
    newShape.name = "Highlighter";
    newShape.parent = targetLayer;
    newShape.startTime = targetLayer.inPoint;
}

