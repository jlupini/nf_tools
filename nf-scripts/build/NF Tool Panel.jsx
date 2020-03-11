var _, cacheFileName, getPanelUI, main, openScript, panelTest, toolRegistry;

$.evalFile(File($.fileName).path + "/runtimeLibraries.jsx");

_ = {};

cacheFileName = "combinedTranscript.json";

panelTest = this;

openScript = function(targetScript) {
  var scriptFile, start_folder;
  start_folder = new Folder(new File($.fileName).parent.fsName);
  scriptFile = new File(start_folder.fsName + ("/" + targetScript));
  return $.evalFile(scriptFile.fullName);
};

toolRegistry = {
  prep: {
    name: "Prep",
    tools: {
      setupMainComp: {
        name: "Setup Main Comp",
        callbackScript: "nf_SetupMainComp.jsx"
      },
      setupHighlightLayer: {
        name: "Setup Highlight Layer",
        callbackScript: "nf_SetupHighlightLayer.jsx"
      },
      precomposePDFs: {
        name: "Precompose PDFs",
        callbackScript: "nf_Precompose PDF Pages.jsx"
      }
    }
  },
  layout: {
    name: "Layout",
    tools: {
      renamePDFPrecomps: {
        name: "Rename PDF Precomps (Deprecated)",
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
          if (app.project.file == null) {
            throw new Error("Can't find the location of the project file. This could be because the project is not saved.");
          }
          project_folder = new Folder(app.project.file.parent.fsName);
          bashFile = new File(start_folder.fsName + '/lib/stt/systemcall.sh');
          sttFolder = File(start_folder.fsName + '/lib/stt/');
          audioLayer = NFProject.mainComp().audioLayers().getBottommostLayer();
          audioFile = audioLayer.$.source.file;
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
              lineLayer.$.guideLayer = instructionLayer.$.guideLayer = true;
              lineLayer.$.enabled = instructionLayer.$.enabled = false;
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
          mainComp = NFProject.mainComp().$;
          mainComp.motionBlur = true;
          mainComp.resolutionFactor = [1, 1];
          parts = NFProject.allPartComps();
          results = [];
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            spotlightLayers = part.searchLayers("Spotlight");
            results.push(spotlightLayers.forEach((function(_this) {
              return function(spotlight) {
                return spotlight.$.enabled = true;
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
                return spotlight.$.enabled = true;
              };
            })(this));
          }
          mainComp = NFProject.mainComp().$;
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
          mainComp = NFProject.mainComp().$;
          mainComp.motionBlur = false;
          return mainComp.resolutionFactor = [2, 2];
        }
      }
    }
  },
  transitions: {
    name: "Transitions",
    tools: {
      slideIn: {
        name: "Slide In",
        description: "Creates a marker-based transition on the selected layer",
        callback: function() {
          var activeComp, selectedLayers, theLayer;
          activeComp = NFProject.activeComp();
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            return theLayer.slideIn();
          } else {
            return alert("Error\nPlease select a single Layer and try again");
          }
        }
      },
      slideOut: {
        name: "Slide Out",
        description: "Creates a marker-based transition on the selected layer",
        callback: function() {
          var activeComp, selectedLayers, theLayer;
          activeComp = NFProject.activeComp();
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            return theLayer.slideOut();
          } else {
            return alert("Error\nPlease select a single Layer and try again");
          }
        }
      },
      fadeIn: {
        name: "Fade In",
        description: "Creates a marker-based transition on the selected layer",
        callback: function() {
          var activeComp, selectedLayers, theLayer;
          activeComp = NFProject.activeComp();
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            return theLayer.fadeIn();
          } else {
            return alert("Error\nPlease select a single Layer and try again");
          }
        }
      },
      fadeOut: {
        name: "Fade Out",
        description: "Creates a marker-based transition on the selected layer",
        callback: function() {
          var activeComp, selectedLayers, theLayer;
          activeComp = NFProject.activeComp();
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            return theLayer.fadeOut();
          } else {
            return alert("Error\nPlease select a single Layer and try again");
          }
        }
      },
      clearAllTransitions: {
        name: "Clear All NF Transitions",
        description: "Removes NF In and NF Out markers on the selected layer, killing those expressions",
        callback: function() {
          var activeComp, selectedLayers, theLayer;
          activeComp = NFProject.activeComp();
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            return theLayer.removeNFMarkers();
          } else {
            return alert("Error\nPlease select a single Layer and try again");
          }
        }
      }
    }
  },
  animation: {
    name: "Animation",
    tools: {
      nullify: {
        name: "Nullify",
        callbackScript: "nf_Nullify.jsx"
      },
      singleInstruction: {
        name: "Follow Single Instruction",
        callbackScript: "nf_SingleInstruction.jsx"
      },
      pageTools: {
        name: "Page Tools",
        callbackScript: "nf_PageTools.jsx"
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
                  targetValue = !spotlight.$.enabled;
                }
                return spotlight.$.enabled = targetValue;
              };
            })(this)));
          }
          return results;
        }
      },
      showCitation: {
        name: "Add Citation Marker",
        callback: function() {
          var selectedLayers, theLayer;
          selectedLayers = NFProject.selectedLayers();
          if (selectedLayers.count() === 1) {
            theLayer = selectedLayers.get(0);
            if (theLayer instanceof NFCitationLayer) {
              return theLayer.show();
            }
          } else {
            return alert("Error\nPlease select a single Citation Layer and try again");
          }
        }
      },
      looseCitation: {
        name: "Add Loose Citation",
        callback: function() {
          var citationLayer, citationText, comp, ref;
          citationText = prompt("Please enter citation text:");
          if (citationText != null) {
            comp = NFProject.activeComp();
            citationLayer = (ref = comp.layerWithName(NFCitationLayer.nameForLoose(citationText))) != null ? ref : NFCitationLayer.newLooseCitationLayer(citationText, comp);
            return citationLayer.show();
          }
        }
      },
      updateCitations: {
        name: "Update Citations",
        callback: function() {
          var blurLayer, citeComps, comp, item, j, len, maskShape, newCiteText, pdfNum, pdfObj, results, sourceRect, suffix, textLayer;
          suffix = " - Citation";
          citeComps = NFProject.searchItems(suffix);
          results = [];
          for (j = 0, len = citeComps.length; j < len; j++) {
            item = citeComps[j];
            if (item instanceof CompItem) {
              comp = new NFComp(item);
              pdfNum = comp.getName().substr(0, comp.getName().indexOf(suffix));
              writeLn("pdf num '" + pdfNum + "'");
              pdfObj = NFPDF.fromPDFNumber(pdfNum);
              newCiteText = NFCitationLayer.fetchCitation(pdfObj);
              textLayer = comp.allLayers().getTopmostLayer();
              blurLayer = comp.allLayers().getBottommostLayer();
              textLayer.property("Text").property("Source Text").setValue(newCiteText);
              sourceRect = textLayer.sourceRect();
              maskShape = new Shape;
              maskShape.vertices = [[sourceRect.left - 20, sourceRect.maxY() + 9], [sourceRect.left - 20, sourceRect.top - 11], [sourceRect.maxX() + 25, sourceRect.top - 11], [sourceRect.maxX() + 25, sourceRect.maxY() + 9]];
              maskShape.closed = true;
              blurLayer.transform("Position").setValue([960, 540]);
              blurLayer.transform("Anchor Point").setValue([960, 540]);
              results.push(blurLayer.mask("Mask 1").maskPath.setValue(maskShape));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      },
      addGaussyLayer: {
        name: "Add Gaussy",
        callbackScript: "nf_Gaussy.jsx"
      },
      addEmphasis: {
        name: "Emphasizer",
        callbackScript: "nf_Emphasizer.jsx"
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
          var allBackings, allHighlights;
          allHighlights = NFProject.allHighlights();
          allHighlights.forEach((function(_this) {
            return function(highlight) {
              highlight.resetExpressionErrors();
              if (highlight.isBroken()) {
                highlight.disconnect();
                return NFTools.log("Disconnected highlight: " + (highlight.getName()) + " in page: " + (highlight.getPageComp().$.name) + "\n", "NFToolPanel#disconnectBrokenHighlights");
              }
            };
          })(this));
          allBackings = NFProject.allBackingLayers();
          return allBackings.forEach((function(_this) {
            return function(backing) {
              var opacityProp;
              opacityProp = backing.transform("Opacity");
              if (opacityProp.expressionError !== "") {
                return backing.remove();
              }
            };
          })(this));
        }
      },
      toggleGuideLayers: {
        name: "Toggle Guide Layers",
        description: "Toggles the guide layers on and off for highlights. if the guide layer reference comp hasn't been set up, this script does the initial setup and links all guide layers.",
        callback: function() {
          return NFProject.toggleGuideLayers();
        }
      },
      fixExtendedPageSlides: {
        name: "Fix Extended Page Slides",
        description: "Looks for any places where a bug has caused a page to slider out very very very slowly, and fixes those instances.",
        callback: function() {
          var fixedValue, threshold;
          threshold = 2.5;
          fixedValue = 2.0;
          return NFProject.activeComp().allLayers().forEach((function(_this) {
            return function(layer) {
              if (layer instanceof NFPageLayer && (layer.getOutMarkerTime() != null)) {
                if (layer.$.outPoint - layer.getOutMarkerTime() > threshold) {
                  return layer.$.outPoint = layer.getOutMarkerTime() + fixedValue;
                }
              }
            };
          })(this));
        }
      },
      migrateToFadeStyle: {
        name: "Migrate to Fade Style",
        description: "Migrates old 'front-page-only' style to new style, where we fade between pages as quotes from them appear.",
        callback: function() {
          var allLayers, lastShuffledLayer, newPageOnscreenPosition, newPageScale, offscreenPosition, oldPageOnscreenPosition, oldPageScale, updateCount;
          newPageScale = 28;
          newPageOnscreenPosition = [349, 274];
          oldPageScale = 23;
          oldPageOnscreenPosition = [439, 202];
          offscreenPosition = [1560, -150];
          updateCount = 0;
          lastShuffledLayer = null;
          allLayers = NFProject.activeComp().allLayers();
          allLayers.forEach((function(_this) {
            return function(layer) {
              var position, scale, t;
              if (layer instanceof NFPageLayer && !layer.isReferenceLayer()) {
                scale = layer.transform("Scale");
                position = layer.transform("Position");
                t = layer.$.inPoint;
                if (position.numKeys === 0) {
                  if (scale.valueAtTime(t, true)[0] === oldPageScale && scale.valueAtTime(t, true)[1] === oldPageScale) {
                    scale.setValue([newPageScale, newPageScale, newPageScale]);
                    if (position.numKeys === 0 && position.valueAtTime(t, true)[0] === oldPageOnscreenPosition[0] && position.valueAtTime(t, true)[1] === oldPageOnscreenPosition[1]) {
                      position.setValue(newPageOnscreenPosition);
                    }
                    updateCount++;
                  }
                  if (position.valueAtTime(t, true)[0] === offscreenPosition[0] && position.valueAtTime(t, true)[1] === offscreenPosition[1]) {
                    scale.setValue([newPageScale, newPageScale, newPageScale]);
                    position.setValue(newPageOnscreenPosition);
                    if (lastShuffledLayer != null) {
                      layer.moveBefore(lastShuffledLayer);
                    } else {
                      layer.moveAfter(layer.containingComp().greenscreenLayer());
                      lastShuffledLayer = layer;
                    }
                    layer.fadeIn();
                    return updateCount++;
                  }
                }
              }
            };
          })(this));
          return alert("Migration Complete!\n " + updateCount + " page layers were resized/repositioned. You'll need to manually check the fading layers and fix their ins and outs.");
        }
      },
      resetPageTransforms: {
        name: "Reset Page Transform",
        description: "Resets the selected page's position and scale to the default",
        callback: function() {
          var newPageOnscreenPosition, newPageScale, selection;
          newPageScale = 28;
          newPageOnscreenPosition = [349, 274];
          selection = NFProject.selectedLayers();
          if (selection.count() === 0) {
            return alert("Invalid selection");
          }
          return selection.forEach((function(_this) {
            return function(layer) {
              var position, scale;
              if (layer instanceof NFPageLayer) {
                scale = layer.transform("Scale");
                position = layer.transform("Position");
                if (position.numKeys !== 0) {
                  return alert("This layer has keyframes so I can't adjust. However, you can manually set the following properties:\n \n Scale: " + (newPageScale[0].toString()) + "\n Position: " + (newPageOnscreenPosition.toString()));
                }
                scale.setValue([newPageScale, newPageScale, newPageScale]);
                return position.setValue(newPageOnscreenPosition);
              }
            };
          })(this));
        }
      }
    }
  },
  development: {
    name: "Dev",
    tools: {
      updateHighlightExpressions: {
        name: "Update Highlight Expressions",
        description: "This script replaces all highlight expressions with the latest versions from the expression files.",
        callback: function() {
          var dataLayers, highlights, j, len, newDataSegment, newOpacitySegment, newPropertySegment, pageComp, pageComps, results;
          newPropertySegment = NFTools.readExpression("highlight-property-expression");
          newPropertySegment = newPropertySegment.substring(newPropertySegment.indexOf("activeBabby = null;"), newPropertySegment.indexOf("controlLayer.effect("));
          newOpacitySegment = NFTools.readExpression("highlight-opacity-expression");
          newOpacitySegment = newOpacitySegment.substring(newOpacitySegment.indexOf("controlIn = controlLayer.inPoint;"));
          newDataSegment = NFTools.readExpression("highlight-data-expression");
          newDataSegment = newDataSegment.substring(newDataSegment.indexOf("MARK_TOP = null;"));
          pageComps = NFProject.allPageComps();
          results = [];
          for (j = 0, len = pageComps.length; j < len; j++) {
            pageComp = pageComps[j];
            highlights = pageComp.highlights();
            highlights.forEach((function(_this) {
              return function(highlightLayer) {
                var currExp, k, len1, property, propertyName, ref, results1, strippedExp, strippedExpEnd, strippedExpStart;
                if (highlightLayer.isBubbled()) {
                  ref = NFHighlightLayer.highlighterProperties;
                  results1 = [];
                  for (k = 0, len1 = ref.length; k < len1; k++) {
                    propertyName = ref[k];
                    property = highlightLayer.highlighterEffect().property(propertyName);
                    currExp = property.expression;
                    if (propertyName === 'Opacity') {
                      strippedExp = currExp.substring(0, currExp.indexOf("controlIn = controlLayer.inPoint;"));
                      results1.push(property.expression = strippedExp + newOpacitySegment);
                    } else {
                      strippedExpStart = currExp.substring(0, currExp.indexOf("activeBabby = null;"));
                      strippedExpEnd = currExp.substring(currExp.indexOf("controlLayer.effect("));
                      results1.push(property.expression = strippedExpStart + newPropertySegment + strippedExpEnd);
                    }
                  }
                  return results1;
                }
              };
            })(this));
            dataLayers = pageComp.searchLayers("HighData");
            results.push(dataLayers.forEach((function(_this) {
              return function(dataLayer) {
                var currExp, property, strippedExp;
                property = dataLayer.property("Text").property("Source Text");
                currExp = property.expression;
                strippedExp = currExp.substring(0, currExp.indexOf("MARK_TOP = null;"));
                return property.expression = strippedExp + newDataSegment;
              };
            })(this)));
          }
          return results;
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
                    prop.expression = strippedExp + newMaskPathExpSegment.replace("highlightComp.duration", "540");
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
      updateBackingExpressions: {
        name: "Update Backing Expressions",
        description: "This script replaces all backing expressions with the latest versions from the expression files.",
        callback: function() {
          var backingLayers, j, len, newExpSegment, part, parts, results;
          newExpSegment = NFTools.readExpression("backing-mask-expression");
          newExpSegment = newExpSegment.substring(newExpSegment.indexOf("targetLayer = thisComp.layer(targetLayerName);"));
          parts = NFProject.allPartComps();
          backingLayers = new NFLayerCollection();
          results = [];
          for (j = 0, len = parts.length; j < len; j++) {
            part = parts[j];
            results.push(part.searchLayers("Backing for").forEach((function(_this) {
              return function(partBackingLayer) {
                var backingMask, currExp, i, k, mask, prop, ref, results1, strippedExp;
                backingMask = partBackingLayer.mask();
                results1 = [];
                for (i = k = 1, ref = backingMask.numProperties; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
                  mask = backingMask.property(i);
                  prop = mask.property("Mask Path");
                  currExp = prop.expression;
                  strippedExp = currExp.substring(0, currExp.indexOf("targetLayer = thisComp.layer(targetLayerName);"));
                  prop.expression = strippedExp + newExpSegment.replace("targetLayer = thisComp.layer(targetLayerName);", "edgePadding = 80;targetLayer = thisComp.layer(targetLayerName);");
                  prop = mask.property("Mask Expansion");
                  results1.push(prop.setValue(0));
                }
                return results1;
              };
            })(this)));
          }
          return results;
        }
      },
      scratch: {
        name: "Scratch Script",
        callbackScript: "nf_Scratch.jsx"
      },
      createAnnotations: {
        name: "Create Annotations",
        callbackScript: "nf_CreateAnnotations.jsx"
      },
      debug: {
        name: "Debug",
        callbackScript: "nf_debug.jsx"
      },
      pdfConnect: {
        name: "PDF Connect",
        callbackScript: "nf_pdfConnect.jsx"
      },
      iconFromFile: {
        name: "Create Icon Data",
        callback: function() {
          var filepath;
          filepath = prompt("Please enter the absolute file path (without quotes).\ni.e. \"~/Desktop/refresh.png\"");
          return NFTools.graphicToText([File(filepath)]);
        }
      }
    }
  }
};

main = function() {
  return _.panel = getPanelUI();
};

getPanelUI = function() {
  var buttonGroup, buttonPanel, category, goButton, helpButton, key, panel, panelType, thisCategoryNode, thisTool, thisToolItem, toolKey, treeView;
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
  buttonPanel.alignment = ['fill', 'fill'];
  treeView = buttonPanel.add('treeview', void 0);
  treeView.preferredSize = [220, 300];
  treeView.alignment = ['fill', 'fill'];
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
  buttonGroup.maximumSize = [200, 50];
  goButton = buttonGroup.add('button', void 0, 'Do it!');
  helpButton = buttonGroup.add('button', void 0, '?');
  goButton.onClick = function(w) {
    var choice, ref, ref1;
    if (((ref = treeView.selection) != null ? ref.data : void 0) && ((ref1 = treeView.selection) != null ? ref1.type : void 0) === 'item') {
      choice = treeView.selection.data;
    }
    if (choice == null) {
      return alert("No Tool Selected!");
    }
    if (choice.callback != null) {
      app.beginUndoGroup("NF Tool: " + choice.name);
      choice.callback();
      app.endUndoGroup();
    } else {
      openScript(choice.callbackScript);
    }
    return this.active = false;
  };
  helpButton.onClick = function(w) {
    var choice, description, ref, ref1, ref2;
    if (((ref = treeView.selection) != null ? ref.data : void 0) && ((ref1 = treeView.selection) != null ? ref1.type : void 0) === 'item') {
      choice = treeView.selection.data;
    }
    if (choice == null) {
      return alert("No Tool Selected!");
    }
    description = (ref2 = choice.description) != null ? ref2 : "No description provided";
    return alert("Tool Description:\n" + description);
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
