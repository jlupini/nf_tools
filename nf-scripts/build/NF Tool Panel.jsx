#include "runtimeLibraries.jsx";
var _, cacheFileName, getPanelUI, main, openScript, panelTest, toolRegistry;

_ = {};

cacheFileName = "combinedTranscript.json";

panelTest = this;

openScript = function(targetScript) {
  var script, scriptFile, start_folder;
  start_folder = new Folder(new File($.fileName).parent.fsName);
  scriptFile = new File(start_folder.fsName + ("/" + targetScript));
  script = "#include '" + scriptFile.fullName + "'";
  return eval(script);
};

toolRegistry = {
  setup: {
    name: "Setup",
    tools: {
      setupMainComp: {
        name: "Setup Main Comp",
        callback: function() {
          return openScript("nf_SetupMainComp.jsx");
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
          $.bp();
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
        name: "Import Script/Instructions",
        callback: function() {
          var parsedLines, shouldUseDetail;
          NFTools.log("Importing from files...", "importScript");
          NFTools.logLine();
          shouldUseDetail = confirm("Would you like to do a detailed analysis on the script? Accuracy is higher but it takes twice as long to process. Only do this if standard analysis gave messed up results.", true, "Detailed Analysis");
          parsedLines = NFTools.readAndCombineScriptAndInstructions(shouldUseDetail);
          NFTools.editProjectFile(cacheFileName, (function(_this) {
            return function(theFileText) {
              return JSON.stringify(parsedLines, null, 4);
            };
          })(this));
          alert("Import complete!\nImported data is located in the project directory in the file '" + cacheFileName + "'. Edit the instruction strings on this new file if you want to change things without having to run Import again.");
          return null;
        }
      },
      validateInstructions: {
        name: "Validate Instructions",
        callback: function() {
          var cacheJSON, errorString, i, j, parsedInstructions, parsedLines, ref, shouldFix, straddlers, thisIns, validationResult;
          if (NFTools.testProjectFile(cacheFileName)) {
            cacheJSON = NFTools.readProjectFile(cacheFileName);
            parsedLines = JSON.parse(cacheJSON);
            parsedInstructions = NFTools.parseInstructions(parsedLines);
            validationResult = NFProject.validateInstructions(parsedInstructions);
            if (!validationResult.valid) {
              errorString = "";
              for (i = j = 0, ref = validationResult.layoutInstructions.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                thisIns = validationResult.layoutInstructions[i];
                if (!thisIns.valid) {
                  if (errorString !== "") {
                    errorString += "\n\n";
                  }
                  errorString += "❌ Instruction #" + (i + 1) + ": [" + thisIns.raw + "] - " + thisIns.validationMessage;
                }
              }
              alert("Validation failed!\n\nErrors:\n" + errorString);
              return null;
            } else {
              straddlers = NFProject.searchForStraddlers(parsedInstructions);
              if (straddlers != null) {
                shouldFix = confirm("Validation was successful, but we found a few PDFs that straddle the part markers.\n\nWould you like to automatically fix these?", false, "Fix Straddlers?");
                if (shouldFix) {
                  NFProject.fixStraddlers(straddlers);
                }
              }
              return alert("Validation Complete!\nEverything looks good to go, so run 'Auto Layout' whenever you're ready.");
            }
          } else {
            return alert("No import data found!\nRun 'Import Script/Instructions' before validating or laying out.");
          }
        }
      },
      autoLayout: {
        name: "Auto Layout",
        callback: function() {
          var allParts, autoLayoutStatus, cacheJSON, ins, instructionLayer, j, k, len, len1, lineInstruction, lineLayer, lineText, lineWrap, parsedInstructions, parsedLines, part, validationResult;
          if (NFTools.testProjectFile(cacheFileName)) {
            cacheJSON = NFTools.readProjectFile(cacheFileName);
            parsedLines = JSON.parse(cacheJSON);
            parsedInstructions = NFTools.parseInstructions(parsedLines);
            validationResult = NFProject.validateInstructions(parsedInstructions);
            if (!validationResult.valid) {
              alert("Validation failed!\n Aborting layout - Check log for details.");
              return null;
            }
            allParts = NFProject.allPartComps();
            lineWrap = "...\n";
            for (j = 0, len = allParts.length; j < len; j++) {
              part = allParts[j];
              lineLayer = part.addSolid({
                color: [0, 1, 0.2],
                name: "Lines"
              });
              lineLayer.moveBefore(part.allLayers().getBottommostLayer());
              instructionLayer = part.addSolid({
                color: [0, 0.8, 0.4],
                name: "Instructions"
              });
              instructionLayer.moveBefore(lineLayer);
              lineLayer.layer.guideLayer = instructionLayer.layer.guideLayer = true;
              lineLayer.layer.enabled = instructionLayer.layer.enabled = false;
              for (k = 0, len1 = parsedInstructions.length; k < len1; k++) {
                ins = parsedInstructions[k];
                lineText = ins.line.length > 15 ? ins.line.insertAt(15, lineWrap) : ins.line;
                lineInstruction = ins.raw.length > 15 ? ins.raw.insertAt(15, lineWrap) : ins.raw;
                lineLayer.addMarker({
                  time: ins.time,
                  comment: lineText
                });
                instructionLayer.addMarker({
                  time: ins.time,
                  comment: lineInstruction
                });
              }
            }
            autoLayoutStatus = NFProject.autoLayout(validationResult.layoutInstructions);
            return alert(autoLayoutStatus);
          } else {
            return alert("No import data found!\nRun 'Import Script/Instructions' before validating or laying out.");
          }
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
          var j, len, mainComp, part, parts, results, spotlightLayers;
          if (app.availableGPUAccelTypes.indexOf(GpuAccelType.SOFTWARE >= 0)) {
            app.project.gpuAccelType = GpuAccelType.SOFTWARE;
          }
          mainComp = NFProject.mainComp().comp;
          mainComp.motionBlur = true;
          mainComp.resolutionFactor = [1, 1];
          parts = NFProject.allPartComps();
          results = [];
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            spotlightLayers = part.searchLayers("Spotlight");
            results.push(spotlightLayers.forEach((function(_this) {
              return function(spotlight) {
                return spotlight.layer.enabled = true;
              };
            })(this)));
          }
          return results;
        }
      },
      prepareForStandardRender: {
        name: "Arm Settings for Fast Render",
        callback: function() {
          var j, len, mainComp, part, parts, spotlightLayers;
          if (app.availableGPUAccelTypes.indexOf(GpuAccelType.OPENCL >= 0)) {
            app.project.gpuAccelType = GpuAccelType.OPENCL;
          } else if (app.availableGPUAccelTypes.indexOf(GpuAccelType.CUDA >= 0)) {
            app.project.gpuAccelType = GpuAccelType.CUDA;
          }
          parts = NFProject.allPartComps();
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            spotlightLayers = part.searchLayers("Spotlight");
            spotlightLayers.forEach((function(_this) {
              return function(spotlight) {
                return spotlight.layer.enabled = true;
              };
            })(this));
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
      singleInstruction: {
        name: "Follow Single Instruction",
        automaticUndo: false,
        callback: function() {
          return openScript("nf_SingleInstruction.jsx");
        }
      },
      pageTools: {
        name: "Page Tools",
        automaticUndo: false,
        callback: function() {
          return openScript("nf_PageTools.jsx");
        }
      },
      toggleSpotlights: {
        name: "Toggle Spotlight Layers",
        callback: function() {
          var j, len, part, parts, results, spotlightLayers, targetValue;
          parts = NFProject.allPartComps();
          targetValue = null;
          results = [];
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            spotlightLayers = part.searchLayers("Spotlight");
            results.push(spotlightLayers.forEach((function(_this) {
              return function(spotlight) {
                if (targetValue === null) {
                  targetValue = !spotlight.layer.enabled;
                }
                return spotlight.layer.enabled = targetValue;
              };
            })(this)));
          }
          return results;
        }
      },
      addGaussyLayer: {
        name: "Add Gaussy",
        automaticUndo: false,
        callback: function() {
          return openScript("nf_Gaussy.jsx");
        }
      },
      addEmphasis: {
        name: "Emphasizer",
        automaticUndo: false,
        callback: function() {
          return openScript("nf_Emphasizer.jsx");
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
      },
      updateSpotlightExpressions: {
        name: "Update Spotlight Expressions",
        description: "This script replaces all spotlight expressions with the latest versions from the expression files.",
        callback: function() {
          var j, len, newMaskOpacityExpSegment, newMaskPathExpSegment, newMasterOpacityExpSegment, part, parts, results, spotlightLayers;
          newMaskOpacityExpSegment = NFTools.readExpression("spotlight-mask-opacity-expression");
          newMaskOpacityExpSegment = newMaskOpacityExpSegment.substring(newMaskOpacityExpSegment.indexOf("inFunc = function(mark)"));
          newMaskPathExpSegment = NFTools.readExpression("spotlight-mask-expression");
          newMaskPathExpSegment = newMaskPathExpSegment.substring(newMaskPathExpSegment.indexOf("numLayers = thisComp.numLayers;"));
          newMasterOpacityExpSegment = NFTools.readExpression("spotlight-master-opacity-expression");
          newMasterOpacityExpSegment = newMasterOpacityExpSegment.substring(newMasterOpacityExpSegment.indexOf("babbies = [];"));
          parts = NFProject.allPartComps();
          spotlightLayers = new NFLayerCollection();
          results = [];
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            results.push(part.searchLayers("Spotlight").forEach((function(_this) {
              return function(partSpotLayer) {
                var currExp, i, k, mask, prop, ref, results1, spotMasks, strippedExp;
                spotMasks = partSpotLayer.mask();
                results1 = [];
                for (i = k = 1, ref = spotMasks.numProperties; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
                  mask = spotMasks.property(i);
                  if (mask.name === "Dummy") {
                    prop = mask.property("Mask Opacity");
                    currExp = prop.expression;
                    strippedExp = currExp.substring(0, currExp.indexOf("babbies = [];"));
                    results1.push(prop.expression = strippedExp + newMasterOpacityExpSegment);
                  } else {
                    prop = mask.property("Mask Path");
                    currExp = prop.expression;
                    strippedExp = currExp.substring(0, currExp.indexOf("numLayers = thisComp.numLayers;"));
                    strippedExp = prop.expression = strippedExp + newMaskPathExpSegment.replace("highlightComp.duration", "540");
                    prop = mask.property("Mask Opacity");
                    currExp = prop.expression;
                    strippedExp = currExp.substring(0, currExp.indexOf("inFunc = function(mark)"));
                    results1.push(prop.expression = strippedExp + newMaskOpacityExpSegment);
                  }
                }
                return results1;
              };
            })(this)));
          }
          return results;
        }
      },
      toggleGuideLayers: {
        name: "Toggle Guide Layers",
        description: "Toggles the guide layers on and off for highlights. if the guide layer reference comp hasn't been set up, this script does the initial setup and links all guide layers.",
        callback: function() {
          var guideAVComp, guideCompFolderName, guideCompName, guideEffect, guideLayer, guideLayerName, j, k, len, len1, newLayer, oldEffectName, opacityProp, precompsFolder, ref, ref1, thePageComp, thePartComp;
          guideCompFolderName = "Precomps";
          guideLayerName = "Guide Visibility";
          guideCompName = "Guide Reference";
          oldEffectName = "Guide Layer";
          guideAVComp = NFProject.findItem(guideCompName);
          if (guideAVComp == null) {
            precompsFolder = NFProject.findItem(guideCompFolderName);
            if (precompsFolder == null) {
              precompsFolder = NFProject.findItem("Assets").item.addFolder(guideCompFolderName);
            }
            guideAVComp = precompsFolder.items.addComp(guideCompName, 100, 100, 1.0, 1, 30);
            newLayer = guideAVComp.layers.addNull();
            newLayer.name = guideLayerName;
            ref = NFProject.allPageComps();
            for (j = 0, len = ref.length; j < len; j++) {
              thePageComp = ref[j];
              guideLayer = thePageComp.layerWithName("Annotation Guide");
              if (guideLayer != null) {
                guideEffect = guideLayer.effect(oldEffectName);
                if (guideEffect != null) {
                  guideEffect.remove();
                }
                opacityProp = guideLayer.property("Transform").property("Opacity");
                opacityProp.expression = "comp(\"" + guideCompName + "\") .layer(\"" + guideLayerName + "\") .enabled * 60";
              }
            }
            ref1 = NFProject.allPartComps();
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              thePartComp = ref1[k];
              thePartComp.allLayers().forEach((function(_this) {
                return function(layer) {
                  var ref2;
                  return (ref2 = layer.effect(oldEffectName)) != null ? ref2.remove() : void 0;
                };
              })(this));
            }
          }
          return guideAVComp.layers[1].enabled = !guideAVComp.layers[1].enabled;
        }
      },
      scratch: {
        name: "Scratch Script",
        automaticUndo: false,
        callback: function() {
          return openScript("nf_Scratch.jsx");
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
  treeView.preferredSize = [220, 200];
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
    if (choice.automaticUndo !== false) {
      app.beginUndoGroup("NF Tool: " + choice.name);
    }
    choice.callback();
    this.active = false;
    if (choice.automaticUndo !== false) {
      return app.endUndoGroup();
    }
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
