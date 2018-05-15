﻿//var audio = app.project.selection[0];
//var newComp = app.project.items.addComp("MainComp", 1920, 1080, 1.0, audio.duration, 30);

app.beginUndoGroup("Nullify");

var mainComp = app.project.activeItem;
var selectedLayers = mainComp.selectedLayers;

var nullName = prompt("Please enter a name for your Null");
var newNull = mainComp.layers.addNull();

newNull.name = nullName;

var thisLayer;
//$.write("new null: "+ newNull.name + "\n");
//$.write("there are " + selectedLayers.length + " selected layers");
for (var i = 1; i <= selectedLayers.length; i++)
{
    thisLayer = selectedLayers[i-1];
    //$.write("making " + newNull.name + " the parent of "+ thisLayer.name + "\n");
    thisLayer.parent = newNull;
}

//$.write("\n\n\n\n\n");