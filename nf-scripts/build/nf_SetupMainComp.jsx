// FIXME: Add a second or two of time before a marker in part comps

var audio = app.project.selection[0];
var newName = audio.name.substr(0, audio.name.indexOf('.')) + " - MainComp";
var compLength = audio.duration+3.5;
var newComp = app.project.items.addComp(newName, 1920, 1080, 1.0, compLength, 29.9700012207031);
newComp.layers.add(audio);

var mainComp = newComp;
var audioLayer = mainComp.layers[1];

// Get number of markers on layer

var markerStream = audioLayer.property("Marker");
var markerCount = markerStream.numKeys;

// If we're dealing with a comp instead of audio file...
if (markerCount == 0 && audio instanceof CompItem) {
  compMarkerStream = audio.markerProperty;
  markerCount = compMarkerStream.numKeys;
  for (var i = 1; i <= markerCount; i++)
  {
    thisMarkerTime = compMarkerStream.keyTime(i);
    markerStream.setValueAtTime(thisMarkerTime, new MarkerValue("Marker " + i));
  }
}

var endTime = mainComp.duration;

// create new background layer
var bgLayer = mainComp.layers.addSolid([1, 1, 1], "Background", 1920, 1080, 1);
bgLayer.moveBefore(audioLayer);


if (markerCount == 0)
{
    alert("No Markers on selected Layer");
} else {

    var newComps = [];
    var prevTime = 0;

    // Make a folder for the new Precomps
    var rootFolder = app.project.rootFolder
    var newFolder = app.project.items.addFolder("Parts");

    // Add a temporary Zoomer
    var zoomer = mainComp.layers.addNull();
    var zoomerScale = zoomer.property("Transform").property("Scale");
    zoomerScale.setValueAtTime(0, [100,100]);
    zoomerScale.setValueAtTime(mainComp.duration, [mainComp.duration, mainComp.duration]);

    // For each marker, duplicate the audio layer, set in and out points, then precompose
    for (var i = 1; i <= markerCount+1; i++)
    {
            var duplicatedAudioLayer = audioLayer.duplicate();
            var duplicatedZoomerLayer = zoomer.duplicate();
            duplicatedZoomerLayer.name = "Zoomer";

            // Set audio in and out points
            duplicatedAudioLayer.inPoint = prevTime;

            if (i==markerCount+1) {
                    duplicatedAudioLayer.outPoint = endTime;
                    currentTime=endTime;
                } else {
                    var currentMarker = markerStream.keyValue(i);
                    var currentTime = markerStream.keyTime(i);
                    duplicatedAudioLayer.outPoint = currentTime;
                }

            var compName = "Part" + i;

            // Precompose and add to the folder
            newComp = mainComp.layers.precompose([duplicatedAudioLayer.index, duplicatedZoomerLayer.index], compName, true);
            newComps.push(newComp);
            newComp.parentFolder = newFolder;

            // Set part comp in and out points, with a 10-second handle at the end
            var newCompLayer = mainComp.layers.byName(compName);
            newCompLayer.inPoint = prevTime - 3;
            newCompLayer.outPoint = currentTime + 10;

            // Disable audio
            newCompLayer.audioEnabled = false;

            // Change comp bg
            newComp.bgColor = [1.0,1.0,1.0];

            // Move to top
            newCompLayer.moveToBeginning();

            prevTime = currentTime;
    }

    zoomer.remove();
}

// create vignette layer
var vigLayer = mainComp.layers.addSolid([1, 1, 1], "Vignette", 1920, 1080, 1);
vigLayer.property("Effects").addProperty("CC Vignette");
vigLayer.blendingMode = BlendingMode.MULTIPLY;
vigLayer.property("Effects").property("CC Vignette").property("Amount").setValueAtTime(0, 50);
vigLayer.property("Transform").property("Opacity").setValueAtTime(0, 0);
vigLayer.property("Transform").property("Opacity").setValueAtTime(0, 0);
vigLayer.property("Transform").property("Opacity").setValueAtTime(0.5, 0);
vigLayer.property("Transform").property("Opacity").setValueAtTime(1.5, 100);
vigLayer.moveToBeginning;

// create fade out layer
var fadeLayer = mainComp.layers.addSolid([1, 1, 1], "Fade Out", 1920, 1080, 1);
fadeLayer.property("Transform").property("Opacity").setValueAtTime(endTime-2.5, 0);
fadeLayer.property("Transform").property("Opacity").setValueAtTime(endTime-0.5, 100);
fadeLayer.moveToBeginning;
