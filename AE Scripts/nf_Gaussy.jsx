(function() {
  #include "nf_functions.jsx";
  var createGaussyLayer, globals, importedFunctions, newGaussyNameForLayer, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Create Gaussy Layer',
    defaults: {
      duration: 25,
      blur: 115
    }
  };

  nf = Object.assign(importedFunctions, globals);

  createGaussyLayer = function() {
    var effects, gaussianBlur, gaussyLayer, gaussyName, hueSatEffect, inMarker, masterLightness, masterSaturation, outMarker, slider, targetLayer, trimString;
    targetLayer = nf.mainComp.selectedLayers[0];
    gaussyName = newGaussyNameForLayer(targetLayer);
    gaussyLayer = nf.mainComp.layers.addSolid([1, 1, 1], gaussyName, targetLayer.width, targetLayer.height, 1);
    gaussyLayer.adjustmentLayer = true;
    gaussyLayer.moveBefore(targetLayer);
    gaussianBlur = gaussyLayer.property('Effects').addProperty('Gaussian Blur');
    gaussianBlur.property('Repeat Edge Pixels').setValue(true);
    effects = gaussyLayer.Effects;
    slider = effects.addProperty('ADBE Slider Control');
    slider.slider.setValue(nf.defaults.duration);
    slider.name = gaussyName + ' Duration';
    trimString = "if (thisComp.layer(\"" + gaussyLayer.name + "\").marker.numKeys > 0) {\n d = thisComp.layer(\"" + gaussyLayer.name + "\").effect(\"" + slider.name + "\")(\"Slider\");\n m = thisComp.layer(\"" + gaussyLayer.name + "\").marker.nearestKey(time);\n t = m.time;\n";
    slider = effects.addProperty('ADBE Slider Control');
    slider.slider.setValue(nf.defaults.blur);
    slider.name = gaussyName + ' Blur';
    trimString += "    f = thisComp.layer(\"" + gaussyLayer.name + "\").effect(\"" + slider.name + "\")(\"Slider\");\n if (m.index%2) {\n // For all in markers\n ease(time,t,t+d*thisComp.frameDuration,0,f)\n } else {\n // For all out markers\n ease(time,t,t-d*thisComp.frameDuration,f,0)\n }\n } else {\n value\n }";
    gaussyLayer.property('Effects').property('Gaussian Blur').property('Blurriness').expression = trimString;
    gaussyLayer.startTime = targetLayer.startTime;
    targetLayer.selected = true;
    gaussyLayer.selected = false;
    inMarker = new MarkerValue('Blur In');
    gaussyLayer.property('Marker').setValueAtTime(nf.mainComp.time, inMarker);
    outMarker = new MarkerValue('Blur Out');
    gaussyLayer.property('Marker').setValueAtTime(nf.mainComp.time + 5, outMarker);
    hueSatEffect = effects.addProperty("ADBE HUE SATURATION");
    masterSaturation = hueSatEffect.property(4);
    masterLightness = hueSatEffect.property(5);
    masterSaturation.setValue(-90);
    masterLightness.setValue(50);
  };

  newGaussyNameForLayer = function(targetLayer) {
    var i, layerName, name, shortName, testName;
    layerName = targetLayer.name;
    shortName = layerName.substr(0, layerName.indexOf('.'));
    name = 'Blur' + shortName;
    if (targetLayer.mask(name) === null) {
      return name;
    } else {
      i = 2;
      while (i <= targetLayer.mask.numProperties) {
        testName = name + ' ' + i;
        if (targetLayer.mask(testName) === null) {
          return testName;
        }
        i++;
      }
    }
    return name;
  };

  app.beginUndoGroup(nf.undoGroupName);

  createGaussyLayer();

  app.endUndoGroup();

}).call(this);
