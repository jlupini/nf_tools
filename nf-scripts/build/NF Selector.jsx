var PADDING, _, getPanelUI, importPDFAnnotationData, loadAutoHighlightDataIntoView, loadContentIntoView, main, openScript, panelTest;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

$.evalFile(File($.fileName).path + "/NFIcon.jsx");

_ = {};

PADDING = 80;

panelTest = this;

openScript = function(targetScript) {
  var scriptFile, start_folder;
  start_folder = new Folder(new File($.fileName).parent.fsName);
  scriptFile = new File(start_folder.fsName + ("/" + targetScript));
  return $.evalFile(scriptFile.fullName);
};

importPDFAnnotationData = function() {
  return NFPDFManager.importAnnotationData();
};

loadAutoHighlightDataIntoView = function(treeView) {
  var activeComp, annotation, annotationData, contentTree, i, len, results, thisNode;
  treeView.removeAll();
  contentTree = {};
  activeComp = NFProject.activeComp();
  annotationData = NFPDFManager.getAnnotationDataForPageComp(activeComp);
  if (annotationData == null) {
    return alert("No PDF Annotation Data Found\nTry the Import button below first");
  }
  results = [];
  for (i = 0, len = annotationData.length; i < len; i++) {
    annotation = annotationData[i];
    thisNode = treeView.add('item', annotation.cleanName);
    thisNode.data = annotation;
    results.push(thisNode.image = annotation.cleanName.indexOf("Highlight") > -1 ? NFIcon.tree.highlight : NFIcon.tree.star);
  }
  return results;
};

loadContentIntoView = function(treeView) {
  var allPageComps, contentTree, i, j, key, len, len1, pageComp, pageCompArr, pageLayers, pageNumber, pdfNumber, results, shapeLayers, thisPDFNode, thisPageNode;
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
    thisPDFNode.image = NFIcon.tree.pdf;
    pageCompArr = contentTree[key];
    for (j = 0, len1 = pageCompArr.length; j < len1; j++) {
      pageComp = pageCompArr[j];
      pageLayers = pageComp.allLayers();
      shapeLayers = new NFLayerCollection;
      pageLayers.forEach((function(_this) {
        return function(layer) {
          if (layer.layer instanceof ShapeLayer) {
            return shapeLayers.add(layer);
          }
        };
      })(this));
      pageNumber = pageComp.getPageNumber();
      if (shapeLayers.isEmpty()) {
        thisPageNode = thisPDFNode.add('item', "Page " + pageNumber);
        thisPageNode.data = pageComp;
        thisPageNode.image = NFIcon.tree.page;
      } else {
        thisPageNode = thisPDFNode.add('node', "Page " + pageNumber);
        thisPageNode.data = pageComp;
        thisPageNode.image = NFIcon.tree.page;
        shapeLayers.forEach((function(_this) {
          return function(shapeLayer) {
            var icon, itemName, thisShapeItem;
            if (shapeLayer instanceof NFHighlightLayer) {
              itemName = shapeLayer.layer.name + " (HL)";
              icon = NFIcon.tree.highlight;
            } else {
              itemName = shapeLayer.layer.name + " (Shape)";
              icon = NFIcon.tree.star;
            }
            thisShapeItem = thisPageNode.add('item', itemName);
            thisShapeItem.data = shapeLayer;
            return thisShapeItem.image = icon;
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
  var addButton, addPrepButton, animateTab, buttonGroup, buttonPanel, buttonPrepGroup, buttonPrepPanel, customPrepButton, goButton, importPrepButton, linkButton, panel, panelType, prepTab, refreshButton, refreshPrepButton, tPanel, treePrepView, treeView;
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
  tPanel = panel.add("tabbedpanel");
  tPanel.alignment = ['fill', 'fill'];
  tPanel.alignChildren = ["fill", "fill"];
  prepTab = tPanel.add("tab", void 0, "Highlight Importer");
  prepTab.alignment = ['fill', 'fill'];
  prepTab.alignChildren = "fill";
  buttonPrepPanel = prepTab.add('panel', void 0, void 0, {
    borderStyle: 'none'
  });
  buttonPrepPanel.alignment = ['fill', 'fill'];
  buttonPrepPanel.alignChildren = 'left';
  buttonPrepPanel.margins.top = 16;
  treePrepView = buttonPrepPanel.add('treeview', void 0);
  treePrepView.preferredSize = [220, 250];
  treePrepView.alignment = ['fill', 'fill'];
  buttonPrepGroup = buttonPrepPanel.add('group', void 0);
  buttonPrepGroup.maximumSize = [200, 50];
  addPrepButton = buttonPrepGroup.add('iconbutton', void 0, NFIcon.button.add);
  addPrepButton.onClick = function(w) {
    var annotationLayer, choice, ref, targetComp;
    choice = (ref = treePrepView.selection) != null ? ref.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("NF Selector");
    targetComp = NFProject.activeComp();
    annotationLayer = targetComp.addShapeLayer();
    annotationLayer.addRectangle({
      fillColor: choice.color,
      rect: choice.rect
    });
    annotationLayer.transform().scale.setValue(targetComp != null ? targetComp.getPDFLayer().transform().scale.value : void 0);
    if (choice.lineCount === 0) {
      annotationLayer.transform("Opacity").setValue(20);
      annotationLayer.setName("Imported PDF Shape: " + choice.cleanName);
    } else {
      targetComp.createHighlight({
        shapeLayer: annotationLayer,
        lines: choice.lineCount,
        name: choice.cleanName
      });
      annotationLayer.remove();
    }
    return app.endUndoGroup();
  };
  customPrepButton = buttonPrepGroup.add('iconbutton', void 0, NFIcon.button.path);
  customPrepButton.onClick = function(w) {
    var lineCount, ref, selectedLayer;
    selectedLayer = (ref = NFProject.selectedLayers()) != null ? ref.get(0) : void 0;
    if (!((selectedLayer != null) && selectedLayer instanceof NFShapeLayer)) {
      return alert("No Valid Shape Layer Selected");
    }
    lineCount = parseInt(prompt('How many initial highlight lines would you like to create?'));
    selectedLayer.containingComp().createHighlight({
      shapeLayer: selectedLayer,
      lines: lineCount,
      name: selectedLayer.getName().replace("Imported PDF Shape: ", "")
    });
    return selectedLayer.remove();
  };
  refreshPrepButton = buttonPrepGroup.add('iconbutton', void 0, NFIcon.button.refresh);
  refreshPrepButton.onClick = function(w) {
    loadAutoHighlightDataIntoView(treePrepView);
    panel.layout.resize();
    return this.active = false;
  };
  importPrepButton = buttonPrepGroup.add('iconbutton', void 0, NFIcon.button["import"]);
  importPrepButton.onClick = function(w) {
    var result;
    alert("Importing Auto Highlight Data\nThis can take a little while, so be patient.");
    result = importPDFAnnotationData();
    if (result) {
      alert("Success\nNow hit the refresh button with a PDF Comp active.");
    } else {
      alert("Failed\nLook for annotationData.json file in the PDF Pages directory");
    }
    return this.active = false;
  };
  animateTab = tPanel.add("tab", void 0, "Animator");
  animateTab.alignChildren = "fill";
  animateTab.alignment = ['fill', 'fill'];
  buttonPanel = animateTab.add('panel', void 0, void 0, {
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
  addButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.add);
  addButton.onClick = function(w) {
    var bgSolid, boxBottom, choice, choicePage, choiceRect, compBottom, controlLayer, currTime, delta, group, highlightThickness, layerAbove, layersForPage, newMask, newPageLayer, newPosition, newScale, oldPosition, oldScale, paddedChoiceRect, paddedRelRect, pickedHighlight, pickedPage, pickedShape, positionDelta, positionProp, ref, ref1, refLayer, refPosition, relRect, scaleFactor, scaleProp, shadowProp, targetPageLayer, thisPart;
    choice = (ref = treeView.selection) != null ? ref.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("NF Selector");
    pickedHighlight = choice instanceof NFHighlightLayer;
    pickedShape = choice instanceof NFLayer && !pickedHighlight;
    pickedPage = choice instanceof NFPageComp;
    if (pickedPage) {
      choicePage = choice;
    } else {
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
      newPageLayer.transform('Scale').setValue([23, 23, 23]);
      newPageLayer.transform('Position').setValue([1560, -150]);
      if (newPageLayer.effect('Drop Shadow') != null) {
        newPageLayer.effect('Drop Shadow').enabled = false;
      }
      targetPageLayer = newPageLayer;
    }
    if (pickedHighlight || pickedShape) {
      refLayer = targetPageLayer.duplicateAsReferenceLayer();
      refLayer.layer.name = (refLayer.getName()) + " (" + (choice.getName()) + ")";
      currTime = thisPart.getTime();
      choiceRect = choice.sourceRect();
      if (thisPart.getTime() !== currTime) {
        thisPart.setTime(currTime);
      }
      scaleFactor = refLayer.getScaleFactorToFrameUp({
        rect: refLayer.relativeRect(choiceRect)
      });
      scaleProp = refLayer.transform("Scale");
      oldScale = scaleProp.value;
      newScale = oldScale[0] * scaleFactor;
      scaleProp.setValue([newScale, newScale]);
      positionDelta = refLayer.getPositionDeltaToFrameUp({
        rect: refLayer.relativeRect(choiceRect)
      });
      positionProp = refLayer.transform("Position");
      oldPosition = positionProp.value;
      newPosition = [oldPosition[0] + positionDelta[0], oldPosition[1] + positionDelta[1]];
      positionProp.setValue(newPosition);
      highlightThickness = pickedHighlight ? choice.highlighterEffect().property("Thickness").value : 0;
      paddedChoiceRect = {
        left: choiceRect.left,
        top: choiceRect.top - (highlightThickness / 2),
        width: choiceRect.width,
        height: choiceRect.height + highlightThickness
      };
      newMask = refLayer.mask().addProperty("Mask");
      newMask.maskShape.setValue(NFTools.shapeFromRect(paddedChoiceRect));
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
      bgSolid.transform("Opacity").setValue(90);
      bgSolid.layer.motionBlur = true;
      relRect = refLayer.relativeRect(paddedChoiceRect);
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
      if (pickedHighlight) {
        group.assignControlLayer(choice);
      }
      if (newPageLayer == null) {
        layerAbove = (ref1 = targetPageLayer.getPaperLayerGroup().getControlLayers().getBottommostLayer()) != null ? ref1 : targetPageLayer.getPaperLayerGroup().paperParent;
        refLayer.moveAfter(layerAbove);
        refLayer.layer.inPoint = thisPart.getTime();
        refLayer.transform("Position").expression = "";
        refLayer.removeNFMarkers();
      }
      bgSolid.moveAfter(refLayer);
      group.gatherLayers(new NFLayerCollection([targetPageLayer, refLayer, bgSolid]), false);
      if (pickedHighlight) {
        controlLayer = choice.getControlLayer();
        controlLayer.removeSpotlights();
      }
    } else if (pickedPage) {
      targetPageLayer.transform('Position').setValue([439, 202]);
      targetPageLayer.slideIn();
      targetPageLayer.getPaperLayerGroup().getCitationLayer().show();
    }
    this.active = false;
    return app.endUndoGroup();
  };
  linkButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.link);
  linkButton.onClick = function(w) {
    var choice, group, pickedHighlight, ref, thisPart;
    choice = (ref = treeView.selection) != null ? ref.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("NF Selector");
    pickedHighlight = choice instanceof NFHighlightLayer;
    if (!pickedHighlight) {
      return alert("Must select a highlight layer");
    }
    thisPart = NFProject.activeComp();
    if (!(thisPart instanceof NFPartComp)) {
      return alert("This operation can only be performed in a part comp.");
    }
    group = thisPart.groupFromPDF(choice.getPDF());
    if (group == null) {
      return alert("Can't find this PDF's group (#" + (choice.getPDFNumber()) + ") in this part");
    }
    return group.assignControlLayer(choice);
  };
  goButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.play);
  goButton.onClick = function(w) {
    var choice, choicePage, dictObject, expandLookString, instruction, key, option, pickedHighlight, pickedPage, pickedShape, ref, result;
    choice = (ref = treeView.selection) != null ? ref.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("NF Selector");
    pickedHighlight = choice instanceof NFHighlightLayer;
    pickedShape = choice instanceof NFLayer && !pickedHighlight;
    pickedPage = choice instanceof NFPageComp;
    if (pickedShape) {
      return alert("Invalid Selection\nCan't go to a shape yet. Jesse should add this at some point...");
    }
    if (pickedPage) {
      choicePage = choice;
    } else {
      choicePage = choice.containingComp();
    }
    if (pickedPage) {
      dictObject = NFLayoutInstructionDict.showTitle;
    } else if (choice.getName().indexOf("Expand") >= 0) {
      dictObject = NFLayoutInstructionExpand;
      expandLookString = choice.getName();
    } else {
      for (key in NFLayoutInstructionDict) {
        option = NFLayoutInstructionDict[key];
        if ((option.look != null) && option.look === choice.getName()) {
          dictObject = option;
        }
      }
    }
    if (dictObject == null) {
      return alert("Create a valid instruction from the selection");
    }
    instruction = new NFLayoutInstruction({
      pdf: choicePage.getPDFNumber(),
      instruction: dictObject,
      expandLookString: expandLookString != null ? expandLookString : null
    });
    return result = NFProject.layoutSingleInstruction(instruction);
  };
  refreshButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.refresh);
  refreshButton.onClick = function(w) {
    loadContentIntoView(treeView);
    treeView.notify();
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
