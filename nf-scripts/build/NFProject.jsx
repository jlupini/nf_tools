
/**
NFProject Namespace
@namespace NFProject
 */
var NFProject;

NFProject = {

  /**
  Looks for all items which contain the search string and returns an array of
  them.
  @memberof NFProject
  @param {string} searchString - the string to search for
  @param {FolderItem} [sourceFolder] - optional source folder
  @returns {Item[]} array of matches or an empty array
   */
  searchItems: function(searchString, sourceFolder) {
    var allItems, i, searchBase, thisItem;
    searchBase = sourceFolder != null ? sourceFolder : app.project;
    allItems = [];
    i = 1;
    while (i <= searchBase.items.length) {
      thisItem = searchBase.items[i];
      if (thisItem.name.indexOf(searchString) >= 0) {
        allItems.push(thisItem);
      }
      i++;
    }
    return allItems;
  },

  /**
  Looks for an item globally in the project. Returns first item found. Exact name
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
   */
  findItem: function(itemName) {
    var i, thisItem;
    i = 1;
    while (i <= app.project.items.length) {
      thisItem = app.project.items[i];
      if (thisItem.name === itemName) {
        return thisItem;
      }
      i++;
    }
    return null;
  },

  /**
  Returns the MainComp
  @memberof NFProject
  @returns {NFComp} the MainComp
   */
  mainComp: function() {
    var foundItems, mainComp;
    foundItems = NFProject.searchItems("MainComp");
    mainComp = foundItems[0];
    if (mainComp == null) {
      throw new Error("Cannot find MainComp! Did you change the name?");
    }
    return new NFComp(mainComp);
  },

  /**
  Returns an array of all part comps in the project
  @memberof NFProject
  @returns {NFPartComp[]} An array of part comps
   */
  allPartComps: function() {
    var folder, item, items, j, len, parts;
    folder = NFProject.findItem("Parts");
    items = NFProject.searchItems("Part", folder);
    parts = [];
    for (j = 0, len = items.length; j < len; j++) {
      item = items[j];
      parts.push(new NFPartComp(item));
    }
    return parts;
  },

  /**
  Returns the Active Comp
  @memberof NFProject
  @returns {CompItem | null} the active CompItem or null
   */
  activeComp: function() {
    var activeItem;
    activeItem = app.project.activeItem;
    if (activeItem instanceof CompItem) {
      return new NFComp(activeItem);
    } else {
      return null;
    }
  },

  /**
  Returns an NFLayerCollection of selected layers in the active comp
  @memberof NFProject
  @returns {NFLayerCollection} - the selected layers
   */
  selectedLayers: function() {
    return NFProject.activeComp().selectedLayers();
  },

  /**
  Given a string with the name of an item to find and it's parent folder,
  returns the folderItem, or null of none is found.
  @memberof NFProject
  @param {string} itemName - the string to search for
  @param {FolderItem} sourceFolderItem - the folder to look in
  @returns {Item | null} the found item or null
   */
  findItemIn: function(itemName, sourceFolderItem) {
    var i;
    i = 1;
    while (i <= sourceFolderItem.numItems) {
      if (sourceFolderItem.item(i).name === itemName) {
        return sourceFolderItem.item(i);
      }
      i++;
    }
    return null;
  },

  /**
  Returns the currently active NFComp
  @memberof NFProject
  @returns {NFComp | NFPartComp | NFPageComp} the found item or null
   */
  activeComp: function() {
    return NFComp.specializedComp(app.project.activeItem);
  },

  /**
  Returns all the page comps in the project
  @memberof NFProject
  @returns {NFPageComp[]} an array of NFPageComp items
   */
  allPageComps: function() {
    var i, item, j, pageComps, precompFolder, ref;
    pageComps = [];
    precompFolder = NFProject.findItem("PDF Precomps");
    if ((precompFolder != null ? precompFolder.typeName : void 0) !== "Folder") {
      throw new Error("Couldn't find the PDF Precomp folder");
    }
    for (i = j = 1, ref = precompFolder.numItems; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      item = precompFolder.item(i);
      pageComps.push(new NFPageComp(item));
    }
    return pageComps;
  },

  /**
  Returns all the highlight layers in the project
  @memberof NFProject
  @returns {NFHighlightLayerCollection} the collection of highlight layers
   */
  allHighlights: function() {
    var allHighlights, j, len, pageComp, pageComps, pageHighlights;
    pageComps = NFProject.allPageComps();
    allHighlights = new NFHighlightLayerCollection();
    for (j = 0, len = pageComps.length; j < len; j++) {
      pageComp = pageComps[j];
      pageHighlights = pageComp.highlights();
      pageHighlights.forEach(function(highlight) {
        return allHighlights.add(highlight);
      });
    }
    return allHighlights;
  },

  /**
  Imports the script (script.txt) and the instructions (instructions.csv) files.
  Adds the guide layers for both to each part comp.
  @memberof NFProject
  @throws Throw error if script.txt or instructions.csv are not in the project
  directory or cannot be read.
  @returns {null} nothin'
   */
  importScript: function() {
    var allParts, autoLayoutStatus, ins, instructionLayer, j, k, len, len1, lineInstruction, lineLayer, lineText, lineWrap, parsedInstructions, parsedLines, part, ref, shouldContinue, shouldUseCache, validationResult;
    alert("About to import and combine the script and instructions.\nThis can take a few minutes, so check 'log.txt' to stay updated as it runs.");
    shouldUseCache = false;
    if (((ref = app.tmp) != null ? ref.parsedLines : void 0) != null) {
      shouldUseCache = confirm("Cached script/instruction data found. Use the cached data? Select NO if you've changed the script.txt or instructions.csv files since the last import.", false, "Cached Data");
    }
    if (shouldUseCache) {
      NFTools.log("Loading cached script/instructions...", "importScript");
      NFTools.logLine();
      parsedLines = app.tmp.parsedLines;
    } else {
      NFTools.log("Importing from files...", "importScript");
      NFTools.logLine();
      parsedLines = NFTools.readAndCombineScriptAndInstructions();
    }
    app.tmp = {
      parsedLines: parsedLines
    };
    parsedInstructions = NFTools.parseInstructions(parsedLines);
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
    shouldContinue = confirm("Import complete! Continue to Validation?", false, 'Validation');
    if (!shouldContinue) {
      return null;
    }
    validationResult = NFProject.validateInstructions(parsedInstructions);
    if (!validationResult.valid) {
      alert("Validation failed!\nCheck log for details. I've cached the import data, so as long as you just need to fix things in the AE project, you won't need to wait for all the script matching next time. However, if you modify anything in the instructions.csv or script.txt files, you'll need to re-import.");
      return null;
    } else {
      shouldContinue = confirm("Validation successful!\nWould you like to run AutoLayout now? It takes a while and you won't be able to stop the process once it begins.", false, 'AutoLayout');
    }
    if (!shouldContinue) {
      return null;
    }
    autoLayoutStatus = NFProject.autoLayout(validationResult.layoutInstructions);
    alert(autoLayoutStatus);
    return null;
  },

  /**
  Takes a set of validated layoutInstructions and lays out the whole project.
  @memberof NFProject
  @param {NFLayoutInstruction[]} layoutInstructions
  @returns {String} A message to display to the user
   */
  autoLayout: function(layoutInstructions) {
    var activePDF, activePDFNumber, allParts, alreadyOnTargetPaper, existingPages, j, k, lastPart, layoutInstruction, len, len1, part, targetPDF, thisPart;
    allParts = NFProject.allPartComps();
    existingPages = false;
    for (j = 0, len = allParts.length; j < len; j++) {
      part = allParts[j];
      part.allLayers().forEach((function(_this) {
        return function(layer) {
          if (layer instanceof NFPageLayer) {
            return existingPages = true;
          }
        };
      })(this));
    }
    if (existingPages) {
      return "Aborting AutoLayout!\nIt looks like there are already pages in one or more part comps. Clean up and try again.";
    }
    NFTools.log("Beginning layout!", "autoLayout");
    lastPart = null;
    for (k = 0, len1 = layoutInstructions.length; k < len1; k++) {
      layoutInstruction = layoutInstructions[k];
      thisPart = NFProject.partForTime(layoutInstruction.time);
      if ((lastPart != null) && !thisPart.is(lastPart)) {
        NFTools.log("New part - Trimming previous one.", "autoLayout");
        thisPart.trimTo(layoutInstruction.time + 10);
      }
      NFTools.log("Laying out instruction [" + layoutInstruction.raw + "] in " + (thisPart.getName()), "autoLayout");
      activePDF = thisPart.activePDF();
      activePDFNumber = activePDF != null ? activePDF.getPDFNumber() : void 0;
      alreadyOnTargetPaper = layoutInstruction.pdf != null ? activePDFNumber === layoutInstruction.pdf : true;
      targetPDF = alreadyOnTargetPaper ? activePDF : NFPDF.fromPDFNumber(layoutInstruction.pdf);
      lastPart = thisPart;
    }
    return "AutoLayout Complete";
  },

  /**
  Returns the part comp that contains a given time
  @memberof NFProject
  @param {float} time - the time to find the part for
  @returns {NFPartComp} The matching NFPartComp
   */
  partForTime: function(time) {
    var audioLayer, audioMarkers, i, j, mainComp, markerTime, matchingPart, partName, ref;
    mainComp = NFProject.mainComp();
    audioLayer = mainComp.audioLayers().getBottommostLayer();
    audioMarkers = audioLayer.markers();
    partName = "Part";
    for (i = j = 1, ref = audioMarkers.numKeys; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      markerTime = audioMarkers.keyTime(i);
      if (time < markerTime) {
        partName += i;
        break;
      }
    }
    matchingPart = null;
    NFProject.allPartComps().forEach((function(_this) {
      return function(partComp) {
        if (partComp.getName() === partName) {
          return matchingPart = partComp;
        }
      };
    })(this));
    return matchingPart;
  },

  /**
  Checks the instructions against the project to make sure there aren't any
  missing highlights/expands, etc.
  @memberof NFProject
  @param {NFLayoutInstruction[]} layoutInstructions
  @returns {Object} An object with the validated 'layoutInstructions' and
  a boolean value 'valid' to indicate success or failure
   */
  validateInstructions: function(layoutInstructions) {
    var anyInvalid, exp, expands, highlight, highlightLook, ins, j, k, l, len, len1, len2, lookString, matchedExpands, returnObj, sameInstruction, samePDF, targetPDF, validatedInstructions;
    NFTools.log("Validating Instructions...", "validateInstructions");
    validatedInstructions = [];
    anyInvalid = false;
    expands = [];
    for (j = 0, len = layoutInstructions.length; j < len; j++) {
      ins = layoutInstructions[j];
      ins.valid = true;
      ins.validationMessage = "";
      if (ins.pdf != null) {
        targetPDF = NFPDF.fromPDFNumber(ins.pdf);
        if (targetPDF == null) {
          ins.valid = false;
          ins.validationMessage += "Missing PDF: '" + ins.pdf + "'. ";
        }
      } else {
        targetPDF = null;
      }
      if (ins.getInstruction().type === NFLayoutType.HIGHLIGHT) {
        if (targetPDF == null) {
          targetPDF = NFPDF.fromPDFNumber(ins.getPDF());
        }
        highlightLook = ins.getInstruction().look;
        if (ins.flags.expand != null) {
          if (ins.flags.expandUp != null) {
            matchedExpands = [];
            for (k = 0, len1 = expands.length; k < len1; k++) {
              exp = expands[k];
              sameInstruction = exp.getInstruction().look === highlightLook;
              samePDF = exp.getPDF() === ins.getPDF();
              if (sameInstruction && samePDF && (exp.flags.expandUp != null)) {
                matchedExpands.push(exp);
              }
            }
            ins.expandUpNumber = matchedExpands.length + 1;
            if (ins.expandUpNumber === 1) {
              lookString = highlightLook + " Expand Up";
            } else {
              lookString = highlightLook + " Expand Up " + ins.expandUpNumber;
            }
            highlight = targetPDF != null ? targetPDF.findHighlight(lookString) : void 0;
          } else {
            matchedExpands = [];
            for (l = 0, len2 = expands.length; l < len2; l++) {
              exp = expands[l];
              sameInstruction = exp.getInstruction().look === highlightLook;
              samePDF = exp.getPDF() === ins.getPDF();
              if (sameInstruction && samePDF && (exp.flags.expandUp == null)) {
                matchedExpands.push(exp);
              }
            }
            ins.expandNumber = matchedExpands.length + 1;
            if (ins.expandNumber === 1) {
              lookString = highlightLook + " Expand";
            } else {
              lookString = highlightLook + " Expand " + ins.expandNumber;
            }
            highlight = targetPDF != null ? targetPDF.findHighlight(lookString) : void 0;
          }
          expands.push(ins);
          if (highlight == null) {
            ins.valid = false;
            ins.validationMessage += "Missing expand '" + lookString + "' in PDF " + (ins.getPDF());
          }
        } else {
          highlight = targetPDF != null ? targetPDF.findHighlight(ins.instruction.look) : void 0;
          if (highlight == null) {
            ins.valid = false;
            ins.validationMessage += "Missing highlight '" + ins.instruction.look + "' in PDF " + (ins.getPDF());
          }
        }
      }
      if (ins.valid === false) {
        anyInvalid = true;
        NFTools.log("Invalid Instruction [" + ins.raw + "]. Reasons: " + ins.validationMessage, "validateInstructions");
      }
      ins.validated = true;
      validatedInstructions.push(ins);
    }
    if (anyInvalid) {
      NFTools.log("Validation completed with errors!", "validateInstructions");
    } else {
      NFTools.log("Validation completed with no errors!", "validateInstructions");
    }
    NFTools.logLine();
    return returnObj = {
      layoutInstructions: validatedInstructions,
      valid: !anyInvalid
    };
  },

  /**
  Follow a single instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
   */
  followInstruction: function(input) {
    var activePDF, activePDFNumber, alreadyOnTargetPaper, code, flagOption, flags, highlight, instruction, instructionString, j, k, key, len, len1, mainComp, option, ref, ref1, targetPDF, targetPDFNumber, titlePage;
    NFTools.log("Parsing input: '" + input + "'", "Parser");
    mainComp = this.activeComp();
    if (!(mainComp instanceof NFPartComp)) {
      throw new Error("Can only run instruction on a part comp");
    }
    targetPDFNumber = /(^\d+)/i.exec(input);
    if (targetPDFNumber != null) {
      targetPDFNumber = targetPDFNumber[1];
    }
    if (targetPDFNumber != null) {
      instructionString = input.slice(targetPDFNumber.length);
      NFTools.log("Target PDF Number found: '" + targetPDFNumber + "'", "Parser");
    } else {
      instructionString = input;
    }
    activePDF = mainComp.activePDF();
    activePDFNumber = activePDF != null ? activePDF.getPDFNumber() : void 0;
    alreadyOnTargetPaper = targetPDFNumber != null ? activePDFNumber === targetPDFNumber : true;
    targetPDF = alreadyOnTargetPaper ? activePDF : NFPDF.fromPDFNumber(targetPDFNumber);
    flags = {};
    for (key in NFLayoutFlagDict) {
      flagOption = NFLayoutFlagDict[key];
      ref = flagOption.code;
      for (j = 0, len = ref.length; j < len; j++) {
        code = ref[j];
        if (instructionString.indexOf(code) >= 0) {
          flags[key] = flagOption;
          instructionString = instructionString.replace(code, "").trim();
          NFTools.log("Flag found: '" + flagOption.display + "'", "Parser");
        }
      }
    }
    if (instructionString === "") {
      if (flags.expand != null) {
        NFTools.log("No instruction remaining. Converting Flag '" + flags.expand.display + "' to Instruction", "Parser");
        instruction = NFLayoutInstructionDict.expand;
        delete flags.expand;
      } else {
        throw new Error("No instructionString remaining after parsing flags and PDF");
      }
    } else {
      instruction = null;
      NFTools.log("Instruction string remaining is: '" + instructionString + "'", "Parser");
      for (key in NFLayoutInstructionDict) {
        option = NFLayoutInstructionDict[key];
        ref1 = option.code;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          code = ref1[k];
          if (instructionString === code) {
            if (instruction != null) {
              if ((option.priority != null) && (instruction.priority != null) && option.priority < instruction.priority) {
                instruction = option;
              } else if (((option.priority != null) && (instruction.priority != null)) || ((option.priority == null) && (instruction.priority == null))) {
                throw new Error("instruction matched two instruction options (" + instruction.display + " and " + option.display + ") with the same priority. Fix layoutDictionary.");
              } else if (option.priority != null) {
                instruction = option;
              }
            } else {
              instruction = option;
            }
          }
        }
      }
      if (instruction != null) {
        NFTools.log("Instruction found: '" + instruction.display + "'", "Parser");
      } else {
        throw new Error("No instruction matches instruction string");
      }
    }
    if ((targetPDF != null) && (instruction == null)) {
      NFTools.log("PDF found but no instruction - animating to title page", "Parser");
      titlePage = targetPDF.getTitlePage();
      mainComp.animateTo({
        page: titlePage
      });
    } else {
      switch (instruction.type) {
        case NFLayoutType.HIGHLIGHT:
          highlight = targetPDF.findHighlight(instruction.look);
          if (highlight == null) {
            throw new Error("Can't find highlight with name '" + instruction.look + "' in PDF '" + (targetPDF.toString()) + "'");
          }
          NFTools.log("Animating to " + instruction.display, "Parser");
          mainComp.animateTo({
            highlight: highlight,
            skipTitle: flags.skipTitle,
            expand: flags.expand,
            expandUp: flags.expandUp
          });
          break;
        case NFLayoutType.EXPAND:
          NFTools.log("Animating to " + instruction.display, "Parser");
          break;
        case NFLayoutType.INSTRUCTION:
          switch (instruction.instruction) {
            case NFLayoutBehavior.SHOW_TITLE:
              NFTools.log("Following Instruction: " + instruction.display, "Parser");
              mainComp.animateTo({
                page: targetPDF.getTitlePage()
              });
              break;
            case NFLayoutBehavior.ICON_SEQUENCE:
            case NFLayoutBehavior.GAUSSY:
            case NFLayoutBehavior.FIGURE:
            case NFLayoutBehavior.TABLE:
              NFTools.log("Following Instruction: " + instruction.display, "Parser");
              mainComp.addGaussy({
                placeholder: instruction.display
              });
              break;
            default:
              throw new Error("There isn't a case for this instruction");
          }
          this;
          break;
        default:
          throw new Error("Instruction not found");
      }
    }
    return this;
  }
};
