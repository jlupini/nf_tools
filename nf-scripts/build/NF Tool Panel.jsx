#include "runtimeLibraries.jsx";
var _, getPanelUI, main, panelTest, toolRegistry;

_ = {};

panelTest = this;

toolRegistry = {
  setup: {
    name: "Setup",
    tools: {
      renamePDFPrecomps: {
        name: "Rename PDF Precomps",
        callback: function() {
          var i, item, j, precompFolder, ref, results;
          precompFolder = NFProject.findItem("PDF Precomps");
          if ((precompFolder != null ? precompFolder.typeName : void 0) !== "Folder") {
            throw new Error("Couldn't get the PDF Precomp folder");
          }
          results = [];
          for (i = j = 1, ref = precompFolder.numItems; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            item = precompFolder.item(i);
            results.push(item.name = item.name.replace('.pdf', ' NFPage'));
          }
          return results;
        }
      }
    }
  },
  render: {
    name: "Render",
    tools: {
      prepareForSafeRender: {
        name: "Arm Settings for Software Render",
        callback: function() {
          var mainComp;
          if (app.availableGPUAccelTypes.indexOf(GpuAccelType.SOFTWARE >= 0)) {
            app.project.gpuAccelType = GpuAccelType.SOFTWARE;
          }
          mainComp = NFProject.mainComp();
          mainComp.motionBlur = true;
          return mainComp.resolutionFactor = [1, 1];
        }
      },
      prepareForStandardRender: {
        name: "Arm Settings for Fast Render",
        callback: function() {
          var mainComp;
          if (app.availableGPUAccelTypes.indexOf(GpuAccelType.OPENCL >= 0)) {
            app.project.gpuAccelType = GpuAccelType.OPENCL;
          } else if (app.availableGPUAccelTypes.indexOf(GpuAccelType.CUDA >= 0)) {
            app.project.gpuAccelType = GpuAccelType.CUDA;
          }
          mainComp = NFProject.mainComp();
          mainComp.motionBlur = true;
          return mainComp.resolutionFactor = [1, 1];
        }
      },
      prepareForEditing: {
        name: "Arm Settings for Editing",
        callback: function() {
          var mainComp;
          if (app.availableGPUAccelTypes.indexOf(GpuAccelType.OPENCL >= 0)) {
            app.project.gpuAccelType = GpuAccelType.OPENCL;
          } else if (app.availableGPUAccelTypes.indexOf(GpuAccelType.CUDA >= 0)) {
            app.project.gpuAccelType = GpuAccelType.CUDA;
          }
          mainComp = NFProject.mainComp();
          mainComp.motionBlur = false;
          return mainComp.resolutionFactor = [2, 2];
        }
      }
    }
  },
  misc: {
    name: "Misc",
    tools: {
      disconnectBrokenHighlights: {
        name: "Disconnect Broken Highlights",
        callback: function() {
          var allHighlights;
          allHighlights = NFProject.allHighlights();
          return allHighlights.forEach((function(_this) {
            return function(highlight) {
              highlight.resetExpressionErrors();
              if (highlight.isBroken()) {
                highlight.disconnect();
                return $.write("Disconnected highlight: " + (highlight.getName()) + " in page: " + (highlight.getPageComp().comp.name) + "\n");
              }
            };
          })(this));
        }
      }
    }
  }
};

main = function() {
  return _.panel = getPanelUI();
};

getPanelUI = function() {
  var buttonGroup, buttonPanel, category, goButton, key, panel, panelType, thisCategoryNode, thisTool, thisToolItem, toolKey, treeView;
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
  buttonPanel = panel.add('panel', void 0, 'Tools', {
    borderStyle: 'none'
  });
  buttonPanel.alignChildren = 'left';
  buttonPanel.margins.top = 16;
  treeView = buttonPanel.add('treeview', void 0);
  treeView.preferredSize = [220, 150];
  for (key in toolRegistry) {
    category = toolRegistry[key];
    thisCategoryNode = treeView.add('node', category.name);
    for (toolKey in category.tools) {
      thisTool = category.tools[toolKey];
      thisToolItem = thisCategoryNode.add('item', thisTool.name);
      thisToolItem.data = thisTool;
    }
    thisCategoryNode.expanded = true;
  }
  buttonGroup = buttonPanel.add('group', void 0);
  goButton = buttonGroup.add('button', void 0, 'Do it!');
  goButton.onClick = function(w) {
    var choice, ref, ref1;
    if (((ref = treeView.selection) != null ? ref.data : void 0) && ((ref1 = treeView.selection) != null ? ref1.type : void 0) === 'item') {
      choice = treeView.selection.data;
    }
    if (choice == null) {
      return alert("No Tool Selected!");
    }
    app.beginUndoGroup("NF Tool: " + choice.name);
    choice.callback();
    this.active = false;
    return app.endUndoGroup();
  };
  panel.layout.layout(true);
  treeView.minimumSize = treeView.size;
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
