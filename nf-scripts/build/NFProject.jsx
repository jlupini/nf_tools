
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
  @returns {CompItem} the MainComp
   */
  mainComp: function() {
    var foundItems, mainComp;
    foundItems = NFProject.searchItems("MainComp");
    mainComp = foundItems[0];
    if (mainComp == null) {
      throw new Error("Cannot find MainComp! Did you change the name?");
    }
    return mainComp;
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
    var assumedLineTimecodes, assumedSentence, dirtyScriptArray, element, endIdx, growCount, growThreshold, i, instructionArray, instructionFile, instructionString, j, len, lineObj, parsedLines, rangeString, ref, scriptFile, scriptLines, scriptString, simValues, splitElement, startIdx, tc, testChar, testLine, testLineIdx, theWord, trimmed, word;
    scriptFile = "script.txt";
    instructionFile = "instructions.csv";
    if (!NFTools.testProjectFile(scriptFile)) {
      throw new Error("Cannot read " + scriptFile);
    }
    if (!NFTools.testProjectFile(instructionFile)) {
      throw new Error("Cannot read " + instructionFile);
    }
    scriptString = NFTools.readProjectFile(scriptFile);
    testChar = "\xA9";
    dirtyScriptArray = scriptString.split(testChar);
    scriptLines = [];
    for (j = 0, len = dirtyScriptArray.length; j < len; j++) {
      element = dirtyScriptArray[j];
      if (element !== "") {
        trimmed = element.trim();
        splitElement = trimmed.split(/\[(.*?)\]/g);
        lineObj = {
          instruction: splitElement[1].trim().slice(1, -1),
          text: ((ref = splitElement[2]) != null ? ref.trim() : void 0) || ""
        };
        scriptLines.push(lineObj);
      }
    }
    instructionString = NFTools.readProjectFile(instructionFile);
    instructionArray = instructionString.splitCSV();
    testLineIdx = 0;
    testLine = "";
    rangeString = "";
    startIdx = 0;
    endIdx = 0;
    growCount = 0;
    growThreshold = 3;
    simValues = [];
    parsedLines = [];
    i = 1;
    NFTools.log("Comparing lines...", "Importer");
    while (testLineIdx !== scriptLines.length) {
      if (testLineIdx === scriptLines.length - 1) {
        assumedLineTimecodes = instructionArray.slice(i);
        assumedSentence = ((function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = assumedLineTimecodes.length; k < len1; k++) {
            theWord = assumedLineTimecodes[k];
            results.push(theWord[1] + " ");
          }
          return results;
        })()).join("");
        NFTools.log("Last line - grabbing whatever's left: '" + assumedSentence + "'", "Importer");
        parsedLines.push({
          instruction: testLine.instruction,
          text: testLine.text,
          timecodes: assumedLineTimecodes
        });
        break;
      }
      if (testLine.text !== scriptLines[testLineIdx].text) {
        testLine = scriptLines[testLineIdx];
        NFTools.log("Test Line:   '" + testLine.text + "'", "Importer");
      }
      tc = instructionArray[i][0];
      word = instructionArray[i][1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
      if (rangeString === "") {
        startIdx = i;
        rangeString = word;
      } else {
        rangeString += " " + word;
      }
      simValues[i] = NFTools.similarity(rangeString, testLine.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase());
      if (simValues[i] > simValues[i - 1]) {
        growCount++;
      } else {
        growCount = 0;
      }
      if (growCount >= growThreshold) {
        simValues = simValues.stuff(1);
        endIdx = simValues.indexOf(Math.min.apply(Math, simValues));
        assumedLineTimecodes = instructionArray.slice(startIdx, endIdx + 1);
        assumedSentence = ((function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = assumedLineTimecodes.length; k < len1; k++) {
            theWord = assumedLineTimecodes[k];
            results.push(theWord[1] + " ");
          }
          return results;
        })()).join("");
        NFTools.log("Best result: '" + assumedSentence + "'", "Importer");
        parsedLines.push({
          instruction: testLine.instruction,
          text: testLine.text,
          timecodes: assumedLineTimecodes
        });
        simValues = [];
        rangeString = "";
        growCount = 0;
        i = endIdx;
        testLineIdx++;
        NFTools.log("MOVING ON...", "Importer");
      }
      i++;
    }
    NFTools.log("Done Importing!", "Importer");
    $.bp();
    return null;
  },

  /**
  Follow an instruction string (ie. "41g")
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
            case NFLayoutInstruction.SHOW_TITLE:
              NFTools.log("Following Instruction: " + instruction.display, "Parser");
              mainComp.animateTo({
                page: targetPDF.getTitlePage()
              });
              break;
            case NFLayoutInstruction.ICON_SEQUENCE:
            case NFLayoutInstruction.GAUSSY:
            case NFLayoutInstruction.FIGURE:
            case NFLayoutInstruction.TABLE:
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
