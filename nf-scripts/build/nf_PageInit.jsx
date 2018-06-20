#include "runtimeLibraries.jsx";
var NF, _, getCancelFunction, presentUI;

NF = app.NF;

_ = {
  mainComp: new NFPartComp(app.project.activeItem),
  undoGroupName: 'initialize Pages',
  animationDuration: 1.85
};

presentUI = function() {
  var allHighlights, animatePageCheckbox, bubButtonGroup, bubCancelButton, bubOkButton, bubblableHighlights, bubbleOnlyTab, buttonGroup, cancelButton, disButtonGroup, disCancelButton, disOkButton, disOptionsPanel, disconnectTab, displayName, highlight, highlightAlreadyConnectedToThisLayer, highlightBubbleCheckboxes, highlightBubblePanel, highlightCheckboxes, highlightDisconnectCheckboxes, highlightDisconnectPanel, highlightPanel, i, initLayerTransformsCheckbox, initTab, j, k, len, len1, len2, okButton, onlyBubbleUpCheckbox, optionsPanel, orphans, ref, ref1, ref2, removeCheckbox, shouldPresentBubbleOnlyPanel, tPanel, theLayer, w;
  if (_.mainComp.selectedLayers().onlyContainsPageLayers()) {
    _.selectedPages = _.mainComp.selectedPageLayers();
  } else {
    throw new Error("Can't initialize non-page layers");
  }
  if (!_.selectedPages.fromSamePDF()) {
    throw new Error("Can't initialize pages from different PDFs at the same time");
  }
  allHighlights = _.selectedPages.highlights();
  if (allHighlights.duplicateNames()) {
    throw new Error("Some highlights in the selected pages have the same name - Please ensure unique names");
  }
  w = new Window('dialog', 'Page Initialization');
  w.alignChildren = 'left';
  tPanel = w.add("tabbedpanel");
  tPanel.alignChildren = ["fill", "fill"];
  tPanel.preferredSize = [350, 300];
  orphans = 0;
  ref = _.selectedPages.layers;
  for (i = 0, len = ref.length; i < len; i++) {
    theLayer = ref[i];
    if (!theLayer.hasNullParent()) {
      orphans++;
    }
  }
  if ((0 < orphans && orphans < _.selectedPages.count())) {
    throw new Error("Can't run this script on both initialized and uninitialized page layers at the same time");
  }
  if (orphans > 0) {
    initTab = tPanel.add("tab", void 0, "Init Page");
    initTab.alignChildren = "fill";
    optionsPanel = initTab.add('panel', void 0, 'Options', {
      borderStyle: 'none'
    });
    optionsPanel.alignChildren = 'left';
    optionsPanel.margins.top = 16;
    animatePageCheckbox = optionsPanel.add("checkbox", void 0, "Animate In First Page");
    animatePageCheckbox.value = true;
    initLayerTransformsCheckbox = optionsPanel.add("checkbox", void 0, "Init Size and Position");
    initLayerTransformsCheckbox.value = true;
    onlyBubbleUpCheckbox = optionsPanel.add("checkbox", void 0, "Bubbleup Only");
    onlyBubbleUpCheckbox.value = false;
    onlyBubbleUpCheckbox.onClick = function() {
      if (onlyBubbleUpCheckbox.value === true) {
        animatePageCheckbox.value = initLayerTransformsCheckbox.value = false;
        return animatePageCheckbox.enabled = initLayerTransformsCheckbox.enabled = false;
      } else {
        animatePageCheckbox.value = initLayerTransformsCheckbox.value = true;
        return animatePageCheckbox.enabled = initLayerTransformsCheckbox.enabled = true;
      }
    };
    highlightPanel = initTab.add('panel', void 0, 'Highlights', {
      borderStyle: 'none'
    });
    highlightPanel.alignChildren = 'left';
    highlightPanel.margins.top = 16;
    highlightCheckboxes = {};
    ref1 = allHighlights.layers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      highlight = ref1[j];
      displayName = highlight.getName() + " - pg" + highlight.getPageComp().getPageNumber();
      highlightAlreadyConnectedToThisLayer = _.selectedPages.containsLayer(highlight.getConnectedPageLayer());
      if (highlight.isBubbled()) {
        if (highlight.isBroken()) {
          displayName += " (OVERRIDE/BROKEN)";
        } else if (highlightAlreadyConnectedToThisLayer) {
          displayName += " (ALREADY CONNECTED TO THIS PAGE LAYER)";
        } else {
          displayName += " (OVERRIDE)";
        }
      } else if (highlight.isBroken()) {
        displayName += " (BROKEN)";
      }
      highlightCheckboxes[highlight.getName()] = highlightPanel.add("checkbox {text: '" + displayName + "'}");
      highlightCheckboxes[highlight.getName()].value = !highlight.isBubbled();
      highlightCheckboxes[highlight.getName()].enabled = !highlightAlreadyConnectedToThisLayer;
    }
    buttonGroup = initTab.add('group', void 0);
    okButton = buttonGroup.add('button', void 0, 'Continue');
    cancelButton = buttonGroup.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    cancelButton.onClick = getCancelFunction(w);
    okButton.onClick = function() {
      var checkbox, curTime, highlightChoices, k, l, layer, len2, len3, newParent, ref2, ref3, topLayer;
      highlightChoices = new NFHighlightLayerCollection();
      ref2 = allHighlights.layers;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        highlight = ref2[k];
        checkbox = highlightCheckboxes[highlight.getName()];
        if (checkbox.value === true) {
          highlightChoices.add(highlight);
        }
      }
      if (onlyBubbleUpCheckbox.value === false) {
        curTime = _.mainComp.getTime();
        topLayer = _.selectedPages.getTopmostLayer();
        _.mainComp.setTime(topLayer.layer.startTime);
        if (initLayerTransformsCheckbox.value === true) {
          _.selectedPages.initLayerTransforms();
        }
        _.selectedPages.initLayers();
        newParent = _.selectedPages.assignPaperParentLayer(true);
        _.mainComp.setTime(curTime);
        if (animatePageCheckbox.value) {
          topLayer.slideIn();
          ref3 = _.selectedPages.layers;
          for (l = 0, len3 = ref3.length; l < len3; l++) {
            layer = ref3[l];
            if (!layer.is(topLayer)) {
              layer.layer.startTime = topLayer.getInMarkerTime();
            }
          }
        }
      }
      highlightChoices.disconnectHighlights();
      _.selectedPages.bubbleUpHighlights(highlightChoices);
      return w.hide();
    };
  } else {
    shouldPresentBubbleOnlyPanel = false;
    _.selectedPages.forEach(function(page) {
      var bubblableForPage;
      bubblableForPage = page.bubblableHighlights();
      if (!bubblableForPage.isEmpty()) {
        return shouldPresentBubbleOnlyPanel = true;
      }
    });
    if (shouldPresentBubbleOnlyPanel) {
      bubbleOnlyTab = tPanel.add("tab", void 0, "Bubble Only");
      bubbleOnlyTab.alignChildren = "fill";
      highlightBubblePanel = bubbleOnlyTab.add('panel', void 0, 'Highlights', {
        borderStyle: 'none'
      });
      highlightBubblePanel.alignChildren = 'left';
      highlightBubblePanel.margins.top = 16;
      bubblableHighlights = [];
      highlightBubbleCheckboxes = {};
      _.selectedPages.forEach(function(page) {
        return page.bubblableHighlights().forEach(function(highlight) {
          highlightBubbleCheckboxes[highlight.getName()] = highlightBubblePanel.add("checkbox {text: '" + (highlight.getName()) + " (" + (page.getName()) + ")'}");
          highlightBubbleCheckboxes[highlight.getName()].value = false;
          highlightBubbleCheckboxes[highlight.getName()].sourcePage = page;
          return bubblableHighlights.push(highlight);
        });
      });
      bubButtonGroup = bubbleOnlyTab.add('group', void 0);
      bubOkButton = bubButtonGroup.add('button', void 0, 'Continue');
      bubCancelButton = bubButtonGroup.add('button', void 0, 'Cancel', {
        name: 'cancel'
      });
      bubCancelButton.onClick = getCancelFunction(w);
      bubOkButton.onClick = function() {
        bubblableHighlights.forEach(function(highlight) {
          var bubbleCheckbox;
          bubbleCheckbox = highlightBubbleCheckboxes[highlight.getName()];
          if (bubbleCheckbox != null) {
            if (bubbleCheckbox.value === true) {
              return bubbleCheckbox.sourcePage.bubbleUp(highlight);
            }
          }
        });
        return w.hide();
      };
    }
  }
  if (!allHighlights.isEmpty()) {
    disconnectTab = tPanel.add("tab", void 0, "Disconnect Items");
    disconnectTab.alignChildren = "fill";
    disOptionsPanel = disconnectTab.add('panel', void 0, 'Options', {
      borderStyle: 'none'
    });
    disOptionsPanel.alignChildren = 'left';
    disOptionsPanel.margins.top = 16;
    removeCheckbox = disOptionsPanel.add("checkbox {text: 'Also Remove Controls'}");
    removeCheckbox.value = true;
    highlightDisconnectPanel = disconnectTab.add('panel', void 0, 'Highlights', {
      borderStyle: 'none'
    });
    highlightDisconnectPanel.alignChildren = 'left';
    highlightDisconnectPanel.margins.top = 16;
    highlightDisconnectCheckboxes = {};
    ref2 = allHighlights.layers;
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      highlight = ref2[k];
      if (highlight.isBubbled()) {
        highlightDisconnectCheckboxes[highlight.getName()] = highlightDisconnectPanel.add("checkbox {text: '" + (highlight.getName()) + "'}");
        highlightDisconnectCheckboxes[highlight.getName()].value = false;
      }
    }
    disButtonGroup = disconnectTab.add('group', void 0);
    disOkButton = disButtonGroup.add('button', void 0, 'Continue');
    disCancelButton = disButtonGroup.add('button', void 0, 'Cancel', {
      name: 'cancel'
    });
    disCancelButton.onClick = getCancelFunction(w);
    disOkButton.onClick = function() {
      var disconnectCheckbox, l, len3, ref3, ref4;
      ref3 = allHighlights.layers;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        highlight = ref3[l];
        disconnectCheckbox = highlightDisconnectCheckboxes[highlight.getName()];
        if (disconnectCheckbox != null) {
          if (disconnectCheckbox.value === true) {
            if (removeCheckbox.value === true) {
              if ((ref4 = highlight.connectedPageLayerHighlighterEffect()) != null) {
                ref4.remove();
              }
            }
            highlight.disconnect();
          }
        }
      }
      return w.hide();
    };
  }
  w.show();
};

getCancelFunction = function(w) {
  return function() {
    return w.close();
  };
};

app.beginUndoGroup(_.undoGroupName);

presentUI();

app.endUndoGroup();
