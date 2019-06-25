#include "runtimeLibraries.jsx";
var PADDING, _, getPanelUI, loadContentIntoView, main, openScript, panelTest;

_ = {};

PADDING = 80;

panelTest = this;

openScript = function(targetScript) {
  var script, scriptFile, start_folder;
  start_folder = new Folder(new File($.fileName).parent.fsName);
  scriptFile = new File(start_folder.fsName + ("/" + targetScript));
  script = "#include '" + scriptFile.fullName + "'";
  return eval(script);
};

loadContentIntoView = function(treeView) {
  var allPageComps, contentTree, i, j, key, len, len1, pageComp, pageCompArr, pageHighlights, pageNumber, pdfNumber, results, thisPDFNode, thisPageNode;
  treeView.removeAll();
  contentTree = {};
  allPageComps = NFProject.allPageComps();
  for (i = 0, len = allPageComps.length; i < len; i++) {
    pageComp = allPageComps[i];
    pdfNumber = pageComp.getPDFNumber();
    if (contentTree[pdfNumber] == null) {
      contentTree[pdfNumber] = [];
    }
    contentTree[pdfNumber].push(pageComp);
  }
  results = [];
  for (key in contentTree) {
    thisPDFNode = treeView.add('node', "PDF " + key);
    pageCompArr = contentTree[key];
    for (j = 0, len1 = pageCompArr.length; j < len1; j++) {
      pageComp = pageCompArr[j];
      pageHighlights = pageComp.highlights();
      pageNumber = pageComp.getPageNumber();
      if (pageHighlights.isEmpty()) {
        thisPageNode = thisPDFNode.add('item', "Page " + pageNumber);
        thisPageNode.data = pageComp;
      } else {
        thisPageNode = thisPDFNode.add('node', "Page " + pageNumber);
        thisPageNode.data = pageComp;
        pageHighlights.forEach((function(_this) {
          return function(highlight) {
            var thisHighlightItem;
            thisHighlightItem = thisPageNode.add('item', highlight.layer.name);
            return thisHighlightItem.data = highlight;
          };
        })(this));
        thisPageNode.expanded = false;
      }
    }
    results.push(thisPDFNode.expanded = false);
  }
  return results;
};

main = function() {
  return _.panel = getPanelUI();
};

getPanelUI = function() {
  var buttonGroup, buttonPanel, goButton, panel, panelType, refreshButton, treeView;
  if (_.panel != null) {
    return _.panel;
  }
  panel = void 0;
  if (panelTest instanceof Panel) {
    panel = panelTest;
    _.isUIPanel = true;
  } else {
    panelType = _.debug ? "dialog" : "palette";
    panel = new Window("dialog", "NF Tools");
    _.isUIPanel = false;
  }
  panel.alignChildren = 'left';
  buttonPanel = panel.add('panel', void 0, 'Selector', {
    borderStyle: 'none'
  });
  buttonPanel.alignment = ['fill', 'fill'];
  buttonPanel.alignChildren = 'left';
  buttonPanel.margins.top = 16;
  treeView = buttonPanel.add('treeview', void 0);
  treeView.preferredSize = [220, 250];
  treeView.alignment = ['fill', 'fill'];
  loadContentIntoView(treeView);
  buttonGroup = buttonPanel.add('group', void 0);
  buttonGroup.maximumSize = [200, 50];
  goButton = buttonGroup.add('button', void 0, 'Show');
  goButton.onClick = function(w) {
    var bgSolid, boxBottom, choice, choicePage, compBottom, controlLayer, currTime, delta, group, highlightRect, highlightThickness, layersForPage, newMask, newPageLayer, newPosition, newScale, oldPosition, oldScale, paddedHighlightRect, paddedRelRect, pickedHighlight, pickedPage, positionDelta, positionProp, ref, refLayer, refPosition, relRect, scaleFactor, scaleProp, shadowProp, targetPageLayer, thisPart;
    choice = (ref = treeView.selection) != null ? ref.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("NF Selector");
    pickedHighlight = choice instanceof NFHighlightLayer;
    pickedPage = choice instanceof NFPageComp;
    if (pickedPage) {
      choicePage = choice;
    } else if (pickedHighlight) {
      choicePage = choice.containingComp();
    }
    thisPart = NFProject.activeComp();
    if (!(thisPart instanceof NFPartComp)) {
      throw new Error("This operation can only be performed in a part comp.");
    }
    layersForPage = thisPart.layersForPage(choicePage);
    targetPageLayer = null;
    if (!layersForPage.isEmpty()) {
      layersForPage.forEach((function(_this) {
        return function(layer) {
          if (layer.isActive()) {
            return targetPageLayer = layer;
          }
        };
      })(this));
    }
    if (targetPageLayer == null) {
      newPageLayer = thisPart.insertPage({
        page: choicePage,
        continuous: true
      });
      group = newPageLayer.getPaperLayerGroup();
      group.setConnectionToZoomer({
        connected: false
      });
      newPageLayer.transform('Scale').setValue([20, 20, 20]);
      newPageLayer.transform('Position').setValue([1560, -150]);
      targetPageLayer = newPageLayer;
    }
    if (pickedHighlight) {
      refLayer = targetPageLayer.duplicateAsReferenceLayer();
      refLayer.layer.name = (refLayer.getName()) + " (" + (choice.getName()) + ")";
      if (newPageLayer == null) {
        refLayer.moveAfter(targetPageLayer.getPaperLayerGroup().getControlLayers().getBottommostLayer());
        refLayer.layer.inPoint = thisPart.getTime();
        refLayer.transform("Position").expression = "";
        refLayer.removeNFMarkers();
      }
      scaleFactor = refLayer.getScaleFactorToFrameUp({
        highlight: choice
      });
      scaleProp = refLayer.transform("Scale");
      oldScale = scaleProp.value;
      newScale = oldScale[0] * scaleFactor;
      scaleProp.setValue([newScale, newScale]);
      positionDelta = refLayer.getPositionDeltaToFrameUp({
        highlight: choice
      });
      positionProp = refLayer.transform("Position");
      oldPosition = positionProp.value;
      newPosition = [oldPosition[0] + positionDelta[0], oldPosition[1] + positionDelta[1]];
      positionProp.setValue(newPosition);
      currTime = thisPart.getTime();
      highlightRect = choice.sourceRect();
      if (thisPart.getTime() !== currTime) {
        thisPart.setTime(currTime);
      }
      highlightThickness = choice.highlighterEffect().property("Thickness").value;
      paddedHighlightRect = {
        left: highlightRect.left,
        top: highlightRect.top - (highlightThickness / 2),
        width: highlightRect.width,
        height: highlightRect.height + highlightThickness
      };
      newMask = refLayer.mask().addProperty("Mask");
      newMask.maskShape.setValue(NFTools.shapeFromRect(paddedHighlightRect));
      newMask.maskFeather.setValue([20, 20]);
      newMask.maskExpansion.setValue(3);
      refLayer.effect("Drop Shadow").remove();
      refLayer.effects().addProperty("ADBE Brightness & Contrast 2").property("Contrast").setValue(99);
      refLayer.layer.blendingMode = BlendingMode.DARKEN;
      bgSolid = thisPart.addSolid({
        color: [1, 1, 1],
        name: "^ Backing"
      });
      bgSolid.layer.inPoint = currTime;
      bgSolid.moveAfter(refLayer);
      bgSolid.transform("Opacity").setValue(90);
      relRect = refLayer.relativeRect(paddedHighlightRect);
      paddedRelRect = {
        left: relRect.left - (PADDING / 2),
        top: relRect.top - (PADDING / 4),
        width: relRect.width + PADDING,
        height: relRect.height + (PADDING / 2)
      };
      newMask = bgSolid.mask().addProperty("Mask");
      newMask.maskShape.setValue(NFTools.shapeFromRect(paddedRelRect));
      bgSolid.setParent(refLayer);
      bgSolid.transform("Opacity").expression = NFTools.readExpression("backing-opacity-expression");
      shadowProp = bgSolid.effects().addProperty('ADBE Drop Shadow');
      shadowProp.property('Opacity').setValue(76.5);
      shadowProp.property('Direction').setValue(152);
      shadowProp.property('Distance').setValue(20);
      shadowProp.property('Softness').setValue(100);
      boxBottom = paddedRelRect.top + paddedRelRect.height;
      compBottom = thisPart.comp.height;
      delta = compBottom - boxBottom;
      refPosition = refLayer.transform("Position").value;
      refLayer.transform("Position").setValue([refPosition[0], refPosition[1] + delta - PADDING]);
      group = targetPageLayer.getPaperLayerGroup();
      group.assignControlLayer(choice);
      group.gatherLayers(new NFLayerCollection([targetPageLayer, refLayer, bgSolid]), false);
      controlLayer = choice.getControlLayer();
      controlLayer.removeSpotlights();
    } else if (pickedPage) {
      targetPageLayer.transform('Position').setValue([525, -150]);
      targetPageLayer.slideIn();
    }
    this.active = false;
    return app.endUndoGroup();
  };
  refreshButton = buttonGroup.add('button', void 0, 'Refresh');
  refreshButton.onClick = function(w) {
    loadContentIntoView(treeView);
    return this.active = false;
  };
  panel.layout.layout(true);
  panel.layout.resize();
  panel.onResizing = panel.onResize = function() {
    this.layout.resize();
  };
  if (!_.isUIPanel) {
    panel.center();
    panel.show();
  }
  return panel;
};

main();
