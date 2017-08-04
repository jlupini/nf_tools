(function() {
  #include "nf_functions.jsx";
  var askForChoice, getOnClickFunction, globals, importedFunctions, nf;

  importedFunctions = app.nf;

  globals = {
    mainComp: app.project.activeItem,
    undoGroupName: 'Go To Highlight',
    spotlightColor: [0.0078, 0, 0.1216],
    initialSpotlightStartOffset: -2,
    initialSpotlightLength: 7
  };

  nf = Object.assign(importedFunctions, globals);

  askForChoice = function() {
    var cancelButton, highlightRect, highlightRects, radioButton, selectedLayer, useSelectedHighlightsButton, w;
    selectedLayer = nf.mainComp.selectedLayers[0];
    w = new Window('dialog', 'Go To Highlight');
    w.alignChildren = 'left';
    highlightRects = nf.sourceRectsForHighlightsInTargetLayer(selectedLayer);
    if (highlightRects != null) {
      w.grp2 = w.add('panel', void 0, 'Highlights On Selected Page', {
        borderStyle: 'none'
      });
      w.grp2.alignChildren = 'left';
      w.grp2.margins.top = 16;
      w.grp3 = w.grp2.add('group', void 0, void 0, void 0);
      w.grp3.alignChildren = 'left';
      w.grp3.orientation = 'column';
      for (highlightRect in highlightRects) {
        radioButton = w.grp3.add('checkbox', void 0, nf.capitalizeFirstLetter(highlightRect));
      }
      useSelectedHighlightsButton = w.grp2.add('button', void 0, "Selected Highlights");
      useSelectedHighlightsButton.onClick = getOnClickFunction(nf.toKeys(highlightRects), highlightRects, w, true, w.grp3.children);
    }
    cancelButton = w.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    cancelButton.onClick = function() {
      w.close();
    };
    return w.show();
  };

  getOnClickFunction = function(name, sourceRect, w, multiple, choices) {
    if (multiple == null) {
      multiple = false;
    }
    if (choices == null) {
      choices = null;
    }
    return function() {
      var rectKeys, theRect, thisIndex;
      if (choices != null) {
        rectKeys = toKeys(sourceRect);
      }
      if (multiple) {
        for (theRect in sourceRect) {
          if (choices != null) {
            thisIndex = rectKeys.indexOf(theRect);
            write('somechoices');
          } else {
            write('else');
          }
        }
      } else {
        write('else');
      }
      w.hide();
      return false;
    };
  };

  app.beginUndoGroup(nf.undoGroupName);

  askForChoice();

  app.endUndoGroup();

  nf = {};

}).call(this);
