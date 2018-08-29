#include "runtimeLibraries.jsx";
var _, getPanelUI, main, panelTest, toolRegistry;

_ = {};

panelTest = this;

toolRegistry = {
  setup: {
    name: "Setup",
    tools: {
      setupMainComp: {
        name: "Setup Main Comp",
        callback: function() {
          var script, scriptFile, start_folder;
          start_folder = new Folder(new File($.fileName).parent.fsName);
          scriptFile = new File(start_folder.fsName + '/nf_SetupMainComp.jsx');
          script = "#include '" + scriptFile.fullName + "'";
          return eval(script);
        }
      },
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
      },
      createInstructionFile: {
        name: "Create Instruction File (Mac Only)",
        callback: function() {
          var audioFile, audioLayer, bashFile, cmdLineString, command, project_folder, shouldContinue, start_folder, sttFolder, termfile;
          start_folder = new Folder(new File($.fileName).parent.parent.fsName);
          project_folder = new Folder(app.project.file.parent.fsName);
          bashFile = new File(start_folder.fsName + '/lib/stt/systemcall.sh');
          sttFolder = File(start_folder.fsName + '/lib/stt/');
          audioLayer = NFProject.mainComp().audioLayers().getBottommostLayer();
          audioFile = audioLayer.layer.source.file;
          cmdLineString = "sh '" + bashFile.fsName + "' '" + sttFolder.fsName + "' '" + audioFile.fsName + "' '" + project_folder.fsName + "'";
          termfile = new File(File($.fileName).parent.fsName + '/command.term');
          command = cmdLineString;
          termfile.open('w');
          termfile.writeln('<?xml version="1.0" encoding="UTF-8"?>\n' + '<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"' + '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' + '<plist version="1.0">\n' + '<dict>\n' + '<key>WindowSettings</key>\n' + '<array>\n' + ' <dict>\n' + '<key>CustomTitle</key>\n' + '<string>My first termfile</string>\n' + '<key>ExecutionString</key>\n' + '<string>' + command + '</string>\n' + '</dict>\n' + '</array>\n' + '</dict>\n' + '</plist>\n');
          termfile.close();
          shouldContinue = confirm("This involves running a terminal instance to perform speech to text and line up timecodes. It may take a while and you'll have to check the terminal window to follow the progress. Continue?", false, "Run Script?");
          if (shouldContinue) {
            return termfile.execute();
          }
        }
      },
      importInstructions: {
        name: "Import Script",
        callback: function() {
          return NFProject.importScript();
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
          mainComp = NFProject.mainComp().comp;
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
          mainComp = NFProject.mainComp().comp;
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
          mainComp = NFProject.mainComp().comp;
          mainComp.motionBlur = false;
          return mainComp.resolutionFactor = [2, 2];
        }
      }
    }
  },
  animation: {
    name: "Animation",
    tools: {
      toggleSpotlights: {
        name: "Toggle Spotlight Layers",
        callback: function() {
          var j, len, part, parts, results, spotlightLayers;
          parts = NFProject.allPartComps();
          results = [];
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            spotlightLayers = part.searchLayers("Spotlight");
            results.push(spotlightLayers.forEach((function(_this) {
              return function(spotlight) {
                return spotlight.layer.enabled = !spotlight.layer.enabled;
              };
            })(this)));
          }
          return results;
        }
      },
      addGaussyLayer: {
        name: "Add Gaussy",
        callback: function() {
          return NFProject.activeComp().addGaussy();
        }
      },
      addSpotlightMarker: {
        name: "Add Spotlight Marker",
        callback: function() {
          var activeComp, selectedLayers, theLayer;
          activeComp = NFProject.activeComp();
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            if (theLayer instanceof NFHighlightControlLayer) {
              return theLayer.addSpotlightMarker();
            }
          } else {
            return alert("Error\nPlease select a single Highlight Control Layer and try again");
          }
        }
      },
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
                return NFTools.log("Disconnected highlight: " + (highlight.getName()) + " in page: " + (highlight.getPageComp().comp.name) + "\n", "NFToolPanel#disconnectBrokenHighlights");
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
    thisCategoryNode.expanded = false;
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
