var BOTTOM_PADDING, EDGE_PADDING, _, getPanelUI, importPDFAnnotationData, loadAutoHighlightDataIntoView, loadContentIntoView, main, openScript, panelTest;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

$.evalFile(File($.fileName).path + "/NFIcon.jsx");

_ = {};

EDGE_PADDING = 80;

BOTTOM_PADDING = 150;

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
    if (annotation.expand != null) {
      results.push(thisNode.image = NFIcon.tree.expand);
    } else if (annotation.cleanName.indexOf("Highlight") > -1) {
      results.push(thisNode.image = NFIcon.tree.highlight);
    } else {
      results.push(thisNode.image = NFIcon.tree.star);
    }
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
    thisPDFNode.data = NFPDF.fromPDFNumber(key);
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
  var addButton, addPrepButton, animateTab, buttonGroup, buttonPanel, buttonPrepGroup, buttonPrepPanel, circle, citeButton, customPrepButton, goButton, hideButton, importPrepButton, linkButton, looseFocus, panel, panelType, prepTab, refreshButton, refreshPrepButton, tPanel, tightFocus, treePrepView, treeView, visGroup;
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
    var annotationLayer, choice, key, newColor, ref1, ref2, targetComp, testColor;
    choice = (ref1 = treePrepView.selection) != null ? ref1.data : void 0;
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
      ref2 = NFHighlightLayer.COLOR;
      for (key in ref2) {
        testColor = ref2[key];
        if (choice.colorName.indexOf(testColor.str) >= 0) {
          newColor = testColor;
        }
      }
      targetComp.createHighlight({
        shapeLayer: annotationLayer,
        lines: choice.lineCount,
        name: choice.cleanName,
        color: newColor
      });
      annotationLayer.remove();
    }
    return app.endUndoGroup();
  };
  customPrepButton = buttonPrepGroup.add('iconbutton', void 0, NFIcon.button.path);
  customPrepButton.onClick = function(w) {
    var key, lineCount, newColor, newName, ref1, ref2, selectedLayer, testColor;
    selectedLayer = (ref1 = NFProject.selectedLayers()) != null ? ref1.get(0) : void 0;
    if (!((selectedLayer != null) && selectedLayer instanceof NFShapeLayer)) {
      return alert("No Valid Shape Layer Selected");
    }
    lineCount = parseInt(prompt('How many initial highlight lines would you like to create?'));
    newName = selectedLayer.getName().replace("Imported PDF Shape: ", "");
    ref2 = NFHighlightLayer.COLOR;
    for (key in ref2) {
      testColor = ref2[key];
      if (newName.indexOf(testColor.str) >= 0) {
        newColor = testColor;
      }
    }
    selectedLayer.containingComp().createHighlight({
      shapeLayer: selectedLayer,
      lines: lineCount,
      name: newName,
      color: newColor != null ? newColor : NFHighlightLayer.COLOR.YELLOW
    });
    return selectedLayer.remove();
  };
  refreshPrepButton = buttonPrepGroup.add('iconbutton', void 0, NFIcon.button.refresh);
  refreshPrepButton.onClick = function(w) {
    loadAutoHighlightDataIntoView(treePrepView);
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
  buttonGroup = buttonPanel.add('group', void 0);
  buttonGroup.maximumSize = [300, 50];
  addButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.add);
  addButton.onClick = function(w) {
    var activeHighlight, activeHighlightRect, activeRefComp, activeRefs, anchorProp, anchorValues, bgSolid, boxBottom, choice, choicePage, choiceRect, compBottom, controlLayer, currTime, delta, group, gsLayer, highlightThickness, keyIn, keyOut, layerAbove, layersForPage, mask, newMask, newPageLayer, newPosition, newScale, paddedChoiceRect, pickedHighlight, pickedPage, pickedShape, positionProp, ref1, ref2, refLayer, refLayers, refPosition, refTargetName, relRect, scaleProp, shadowProp, shouldExpand, startTime, targetPageLayer, thisPart;
    choice = (ref1 = treeView.selection) != null ? ref1.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("NF Selector");
    pickedHighlight = choice instanceof NFHighlightLayer;
    pickedShape = choice instanceof NFLayer && !pickedHighlight;
    pickedPage = choice instanceof NFPageComp;
    if (pickedPage) {
      choicePage = choice;
    } else if (pickedShape || pickedHighlight) {
      choicePage = choice.containingComp();
    } else {
      throw new Error("Looks like you picked something, but we can't figure out what it is. Hit the refresh button and try again");
    }
    thisPart = NFProject.activeComp();
    if (!(thisPart instanceof NFPartComp)) {
      throw new Error("This operation can only be performed in a part comp.");
    }
    currTime = thisPart.getTime();
    layersForPage = thisPart.layersForPage(choicePage);
    targetPageLayer = null;
    startTime = null;
    if (!layersForPage.isEmpty()) {
      layersForPage.forEach((function(_this) {
        return function(layer) {
          startTime = layer.layer.startTime;
          if (layer.isActive()) {
            return targetPageLayer = layer;
          }
        };
      })(this));
    }
    shouldExpand = false;
    bgSolid = null;
    if ((targetPageLayer != null) && pickedHighlight && choice.getName().indexOf("Expand") >= 0) {
      refLayers = thisPart.searchLayers("[ref]");
      if (!refLayers.isEmpty()) {
        activeRefs = new NFLayerCollection();
        refLayers.forEach((function(_this) {
          return function(ref) {
            if (ref.isActive()) {
              if (ref.getName().indexOf("Backing") < 0) {
                return activeRefs.add(ref);
              } else {
                return bgSolid = ref;
              }
            }
          };
        })(this));
        if (activeRefs.count() > 1) {
          return alert("Error\nCan't animate an expand if multiple matching refs are active");
        } else if (activeRefs.count() === 1) {
          refLayer = activeRefs.get(0);
          refTargetName = refLayer.getName().match(/\<(.*?)\>/)[1];
          if (choice.getName().indexOf(refTargetName) >= 0) {
            shouldExpand = true;
            keyIn = currTime - 0.5;
            keyOut = currTime + 0.5;
          }
        }
      }
    }
    if (targetPageLayer == null) {
      newPageLayer = thisPart.insertPage({
        page: choicePage,
        continuous: true
      });
      if (startTime != null) {
        newPageLayer.layer.startTime = startTime;
        newPageLayer.layer.inPoint = currTime;
      }
      group = newPageLayer.getPaperLayerGroup();
      newPageLayer.transform('Scale').setValue([23, 23, 23]);
      newPageLayer.transform('Position').setValue([1560, -150]);
      if (newPageLayer.effect('Drop Shadow') != null) {
        newPageLayer.effect('Drop Shadow').enabled = false;
      }
      targetPageLayer = newPageLayer;
    }
    if (pickedHighlight || pickedShape) {
      if (!shouldExpand) {
        refLayer = targetPageLayer.duplicateAsReferenceLayer();
        refLayer.layer.name = (refLayer.getName()) + " <" + (choice.getName()) + ">";
        if (newPageLayer == null) {
          refLayer.transform("Position").expression = "";
        }
      }
      choiceRect = choice.sourceRect();
      if (shouldExpand) {
        activeRefComp = new NFPageComp(refLayer.layer.source);
        activeHighlight = activeRefComp.layerWithName(refTargetName);
        activeHighlightRect = activeHighlight.sourceRect();
        choiceRect = choiceRect.combineWith(activeHighlightRect);
      }
      if (thisPart.getTime() !== currTime) {
        thisPart.setTime(currTime);
      }
      scaleProp = refLayer.transform("Scale");
      newScale = refLayer.getAbsoluteScaleToFrameUp({
        rect: refLayer.relativeRect(choiceRect),
        fillPercentage: 75,
        maxScale: 100
      });
      if (shouldExpand) {
        scaleProp.setValuesAtTimes([keyIn, keyOut], [scaleProp.valueAtTime(currTime, true), [newScale, newScale]]);
        scaleProp.easyEaseKeyTimes({
          keyTimes: [keyIn, keyOut]
        });
      } else {
        scaleProp.setValue([newScale, newScale]);
      }
      positionProp = refLayer.transform("Position");
      newPosition = refLayer.getAbsolutePositionToFrameUp({
        rect: refLayer.relativeRect(choiceRect)
      });
      if (shouldExpand) {
        positionProp.setValuesAtTimes([keyIn, keyOut], [positionProp.valueAtTime(currTime, true), newPosition]);
        positionProp.easyEaseKeyTimes({
          keyTimes: [keyIn, keyOut]
        });
      } else {
        positionProp.setValue(newPosition);
      }
      highlightThickness = pickedHighlight ? choice.highlighterEffect().property("Thickness").value : 0;
      paddedChoiceRect = {
        left: choiceRect.left,
        top: choiceRect.top - (highlightThickness / 2),
        width: choiceRect.width,
        height: choiceRect.height + highlightThickness
      };
      if (shouldExpand) {
        mask = refLayer.mask().property(1);
        mask.maskShape.setValuesAtTimes([keyIn, keyOut], [mask.maskShape.valueAtTime(currTime, true), NFTools.shapeFromRect(paddedChoiceRect)]);
        mask.maskShape.easyEaseKeyTimes({
          keyTimes: [keyIn, keyOut]
        });
      } else {
        newMask = refLayer.mask().addProperty("Mask");
        newMask.maskShape.setValue(NFTools.shapeFromRect(paddedChoiceRect));
        newMask.maskFeather.setValue([20, 20]);
        newMask.maskExpansion.setValue(3);
        refLayer.effect("Drop Shadow").remove();
        refLayer.effects().addProperty("ADBE Brightness & Contrast 2").property("Contrast").setValue(99);
        refLayer.layer.blendingMode = BlendingMode.DARKEN;
      }
      if (!shouldExpand) {
        bgSolid = thisPart.addSolid({
          color: [1, 1, 1],
          name: "Backing for '" + refLayer.layer.name + "'"
        });
        bgSolid.transform("Opacity").setValue(90);
        bgSolid.layer.motionBlur = true;
        bgSolid.setShy(true);
        newMask = bgSolid.mask().addProperty("Mask");
        newMask.maskShape.expression = NFTools.readExpression("backing-mask-expression", {
          TARGET_LAYER_NAME: refLayer.getName(),
          EDGE_PADDING: EDGE_PADDING
        });
        newMask.maskExpansion.setValue(24);
        bgSolid.transform("Opacity").expression = NFTools.readExpression("backing-opacity-expression", {
          TARGET_LAYER_NAME: refLayer.getName()
        });
        shadowProp = bgSolid.addDropShadow();
      }
      if (shouldExpand) {
        anchorValues = refLayer.getCenterAnchorPointValue(true, keyOut);
        anchorProp = refLayer.transform("Anchor Point");
        anchorProp.setValuesAtTimes([keyIn, keyOut], [anchorProp.valueAtTime(keyIn, true), anchorValues[1]]);
        anchorProp.easyEaseKeyTimes({
          keyTimes: [keyIn, keyOut]
        });
        relRect = refLayer.relativeRect(paddedChoiceRect, keyOut);
      } else {
        relRect = refLayer.relativeRect(paddedChoiceRect);
      }
      boxBottom = relRect.top + relRect.height + (EDGE_PADDING / 4);
      compBottom = thisPart.comp.height;
      delta = compBottom - boxBottom;
      if (shouldExpand) {
        refPosition = positionProp.valueAtTime(keyOut, true);
        positionProp.setValuesAtTimes([keyIn, keyOut], [positionProp.valueAtTime(keyIn, true), [refPosition[0], refPosition[1] + delta - BOTTOM_PADDING]]);
        positionProp.easyEaseKeyTimes({
          keyTimes: [keyIn, keyOut]
        });
      } else {
        refPosition = positionProp.value;
        positionProp.setValue([refPosition[0], refPosition[1] + delta - BOTTOM_PADDING]);
      }
      group = targetPageLayer.getPaperLayerGroup();
      if (pickedHighlight) {
        group.assignControlLayer(choice, null, false);
      }
      if (newPageLayer == null) {
        layerAbove = (ref2 = targetPageLayer.getPaperLayerGroup().getControlLayers().getBottommostLayer()) != null ? ref2 : targetPageLayer.getPaperLayerGroup().paperParent;
        refLayer.moveAfter(layerAbove);
        if (!shouldExpand) {
          refLayer.layer.inPoint = thisPart.getTime();
        }
      }
      if (!shouldExpand) {
        refLayer.centerAnchorPoint();
        refLayer.removeNFMarkers();
        refLayer.addInOutMarkersForProperty({
          property: refLayer.transform("Scale"),
          startEquation: EasingEquation.quart.out,
          startValue: [0, 0, 0],
          length: 1
        });
        refLayer.addInOutMarkersForProperty({
          property: refLayer.transform("Opacity"),
          startEquation: EasingEquation.quart.out,
          startValue: 0,
          length: 1
        });
        bgSolid.moveAfter(refLayer);
      }
      group.gatherLayers(new NFLayerCollection([targetPageLayer, refLayer, bgSolid]), false);
      if (pickedHighlight) {
        controlLayer = choice.getControlLayer();
        controlLayer.removeSpotlights();
      }
    } else if (pickedPage) {
      targetPageLayer.transform('Position').setValue([439, 202]);
      targetPageLayer.slideIn();
      targetPageLayer.getPaperLayerGroup().getCitationLayer().show();
      gsLayer = thisPart.greenscreenLayer();
      if (gsLayer != null) {
        targetPageLayer.moveAfter(gsLayer);
      }
    }
    this.active = false;
    return app.endUndoGroup();
  };
  linkButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.link);
  linkButton.onClick = function(w) {
    var choice, controlLayer, group, pickedHighlight, ref1, thisPart;
    choice = (ref1 = treeView.selection) != null ? ref1.data : void 0;
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
    group.assignControlLayer(choice, null, false);
    controlLayer = choice.getControlLayer();
    return controlLayer.removeSpotlights();
  };
  goButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.play);
  goButton.onClick = function(w) {
    var choice, choicePage, dictObject, expandLookString, instruction, key, option, pickedHighlight, pickedPage, pickedShape, ref1, result;
    choice = (ref1 = treeView.selection) != null ? ref1.data : void 0;
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
  hideButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.hide);
  hideButton.onClick = function(w) {
    var controlLayers, group, highlightName, layersToTrim, matchingPageLayers, partComp, pdfNumber, refLayers, selectedLayer, selectedLayers, time;
    app.beginUndoGroup("Hide Element (via NF Selector)");
    partComp = NFProject.activeComp();
    if (!(partComp instanceof NFPartComp)) {
      return alert("Can only do this in a part comp");
    }
    time = partComp.getTime();
    selectedLayers = NFProject.selectedLayers();
    if (selectedLayers.count() !== 1) {
      return alert("Wrong number of selected layers. Please select a single layer and run again");
    } else {
      selectedLayer = selectedLayers.get(0);
      if (selectedLayer instanceof NFHighlightControlLayer) {
        group = new NFPaperLayerGroup(selectedLayer.getParent());
        refLayers = group.getChildren().searchLayers("[ref]").searchLayers(selectedLayer.highlightName());
        if (refLayers.count() !== 1) {
          return alert("I couldn't find the layers to trim. Try selecting only the ref layer and trying again");
        }
        selectedLayer = refLayers.get(0);
      }
      if (selectedLayer instanceof NFPageLayer) {
        if (selectedLayer.getName().indexOf("[+]") >= 0 && partComp.getRect().intersectsWith(selectedLayer.sourceRect(time))) {
          if (selectedLayer.layer.outPoint >= time) {
            selectedLayer.layer.outPoint = time;
            selectedLayer.slideOut();
          }
        } else if (selectedLayer.getName().indexOf("[ref]") >= 0) {
          layersToTrim = selectedLayer.getChildren().add(selectedLayer);
          highlightName = selectedLayer.getName().match(/\<(.*?)\>/)[1];
          pdfNumber = selectedLayer.getPDFNumber();
          controlLayers = partComp.searchLayers(NFHighlightControlLayer.nameForPDFNumberAndHighlight(pdfNumber, highlightName));
          if (controlLayers.count() !== 0) {
            controlLayers.forEach((function(_this) {
              return function(cLayer) {
                return layersToTrim.add(cLayer);
              };
            })(this));
          }
          matchingPageLayers = partComp.layersForPage(selectedLayer.getPageComp());
          if (matchingPageLayers.count() !== 0) {
            matchingPageLayers.forEach((function(_this) {
              return function(pLayer) {
                if (!partComp.getRect().intersectsWith(pLayer.sourceRect(time))) {
                  return layersToTrim.add(pLayer);
                }
              };
            })(this));
          }
          layersToTrim.forEach((function(_this) {
            return function(layer) {
              return layer.layer.outPoint = time;
            };
          })(this));
          selectedLayer.addInOutMarkersForProperty({
            property: selectedLayer.transform("Scale"),
            endEquation: EasingEquation.quart["in"],
            endValue: [0, 0, 0],
            length: 1
          });
          selectedLayer.addInOutMarkersForProperty({
            property: selectedLayer.transform("Opacity"),
            endEquation: EasingEquation.quart["in"],
            endValue: 0,
            length: 1
          });
        } else {
          throw new Error("Something's wrong with this layer's name...");
        }
      }
    }
    return app.endUndoGroup();
  };
  citeButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.book);
  citeButton.onClick = function(w) {
    var choice, citationLayer, group, nullLayer, paperParentLayer, parentLayer, ref1, thisPart;
    choice = (ref1 = treeView.selection) != null ? ref1.data : void 0;
    if (choice == null) {
      return alert("Invalid Selection!");
    }
    app.beginUndoGroup("Add Citation (via NF Selector)");
    if (choice instanceof NFPDF) {
      thisPart = NFProject.activeComp();
      parentLayer = thisPart.layerWithName(choice.getName());
      if (parentLayer != null) {
        group = parentLayer.getGroup();
      } else {
        nullLayer = thisPart.addSolid({
          color: [1, 0, 0.7],
          width: 10,
          height: 10
        });
        nullLayer.layer.enabled = false;
        nullLayer.setName(NFPaperParentLayer.getPaperParentNameForObject(choice));
        paperParentLayer = new NFPaperParentLayer(nullLayer);
        group = new NFPaperLayerGroup(paperParentLayer);
      }
      citationLayer = group.assignCitationLayer();
      citationLayer.show();
    } else {
      alert("Error\nMake sure you've selected a PDF to cite, or try refreshing the Selector Panel");
    }
    return app.endUndoGroup();
  };
  refreshButton = buttonGroup.add('iconbutton', void 0, NFIcon.button.refresh);
  refreshButton.onClick = function(w) {
    loadContentIntoView(treeView);
    treeView.notify();
    return this.active = false;
  };
  visGroup = buttonPanel.add('group', void 0);
  visGroup.maximumSize = [300, 50];
  circle = visGroup.add('iconbutton', void 0, NFIcon.button.circle);
  circle.onClick = function(w) {
    app.beginUndoGroup("Unshy all (NF Selector)");
    NFProject.activeComp().allLayers().forEach((function(_this) {
      return function(layer) {
        if (!(layer.getName().indexOf("Backing for") >= 0)) {
          return layer.setShy(false);
        }
      };
    })(this));
    NFProject.activeComp().comp.hideShyLayers = true;
    return app.endUndoGroup();
  };
  looseFocus = visGroup.add('iconbutton', void 0, NFIcon.button.looseFocus);
  looseFocus.onClick = function(w) {
    var activeComp, activeLayers, looseLayers;
    app.beginUndoGroup("Loose Focus (NF Selector)");
    activeComp = NFProject.activeComp();
    activeLayers = activeComp.activeLayers();
    if (activeLayers.isEmpty()) {
      return alert("No layers active!");
    }
    looseLayers = new NFLayerCollection;
    activeLayers.forEach((function(_this) {
      return function(layer) {
        var group;
        if (!(layer instanceof NFCitationLayer || layer.getName().indexOf("Backing for") >= 0)) {
          looseLayers.add(layer);
        }
        looseLayers.add(layer.getChildren(true));
        if (layer instanceof NFPageLayer) {
          group = layer.getPaperLayerGroup();
          looseLayers.add(group.getMembers());
          return looseLayers.add(group.paperParent);
        }
      };
    })(this));
    activeComp.allLayers().forEach((function(_this) {
      return function(layer) {
        return layer.setShy(!looseLayers.containsLayer(layer));
      };
    })(this));
    activeComp.comp.hideShyLayers = true;
    return app.endUndoGroup();
  };
  tightFocus = visGroup.add('iconbutton', void 0, NFIcon.button.tightFocus);
  tightFocus.onClick = function(w) {
    var activeComp, activeLayers, tightLayers;
    app.beginUndoGroup("Tight Focus (NF Selector)");
    activeComp = NFProject.activeComp();
    activeLayers = activeComp.activeLayers();
    if (activeLayers.isEmpty()) {
      return alert("No layers active!");
    }
    tightLayers = new NFLayerCollection;
    activeLayers.forEach((function(_this) {
      return function(layer) {
        var group, time;
        if (!(layer instanceof NFCitationLayer || layer.getName().indexOf("Backing for") >= 0)) {
          tightLayers.add(layer);
        }
        if (layer instanceof NFPageLayer) {
          group = layer.getPaperLayerGroup();
          tightLayers.add(group.paperParent);
          tightLayers.add(group.getCitationLayer());
          time = activeComp.getTime();
          return group.getControlLayers().forEach(function(control) {
            if (control.layer.inPoint <= time && control.layer.outPoint >= time) {
              return tightLayers.add(control);
            }
          });
        }
      };
    })(this));
    activeComp.allLayers().forEach((function(_this) {
      return function(layer) {
        return layer.setShy(!tightLayers.containsLayer(layer));
      };
    })(this));
    activeComp.comp.hideShyLayers = true;
    return app.endUndoGroup();
  };
  panel.layout.layout(true);
  panel.layout.resize();
  tPanel.selection = animateTab;
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
