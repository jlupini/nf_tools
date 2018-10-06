
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
  Returns whether there are broken highlights in the project
  @memberof NFProject
  @returns {boolean} If there are broken highlights
   */
  containsBrokenHighlights: function() {
    var allHighlights, brokenHighlights;
    allHighlights = NFProject.allHighlights();
    brokenHighlights = false;
    allHighlights.forEach((function(_this) {
      return function(highlight) {
        highlight.resetExpressionErrors();
        if (highlight.isBroken()) {
          return brokenHighlights = true;
        }
      };
    })(this));
    return brokenHighlights;
  },

  /**
  Takes a single NFLayoutInstruction and lays it out at the current time in the
  current part
  @memberof NFProject
  @param {NFLayoutInstruction} layoutInstruction
  @returns {String} A message to display to the user
   */
  layoutSingleInstruction: function(layoutInstruction) {
    var activeComp, highlight, lookString, targetPDF, titlePage;
    activeComp = NFProject.activeComp();
    if (!(activeComp instanceof NFPartComp)) {
      return "Cannot layout an instruction in a non-part comp.";
    }
    if (NFProject.containsBrokenHighlights()) {
      return "Aborting AutoLayout!\nThere are broken highlights in some page comps. Fix before running again.";
    }
    switch (layoutInstruction.instruction.type) {
      case NFLayoutType.HIGHLIGHT:
        targetPDF = NFPDF.fromPDFNumber(layoutInstruction.getPDF());
        lookString = layoutInstruction.expandLookString || layoutInstruction.instruction.look;
        highlight = targetPDF.findHighlight(lookString);
        if (highlight == null) {
          throw new Error("Can't find highlight with name '" + lookString + "' in PDF '" + (targetPDF.toString()) + "'");
        }
        NFTools.log("Animating to highlight '" + lookString + "'", "autoLayout");
        activeComp.animateTo({
          highlight: highlight,
          time: layoutInstruction.time,
          skipTitle: layoutInstruction.flags.skipTitle
        });
        break;
      case NFLayoutType.EXPAND:
        targetPDF = NFPDF.fromPDFNumber(layoutInstruction.getPDF());
        lookString = layoutInstruction.expandLookString;
        highlight = targetPDF.findHighlight(lookString);
        if (highlight == null) {
          throw new Error("Can't find highlight with name '" + lookString + "' in PDF '" + (targetPDF.toString()) + "'");
        }
        NFTools.log("Animating to highlight '" + lookString + "'", "autoLayout");
        activeComp.animateTo({
          highlight: highlight,
          time: layoutInstruction.time,
          skipTitle: layoutInstruction.flags.skipTitle
        });
        break;
      case NFLayoutType.INSTRUCTION:
        targetPDF = NFPDF.fromPDFNumber(layoutInstruction.pdf);
        switch (layoutInstruction.instruction.behavior) {
          case NFLayoutBehavior.SHOW_TITLE:
            NFTools.log("Following Instruction: " + layoutInstruction.instruction.display, "autoLayout");
            activeComp.animateTo({
              time: layoutInstruction.time,
              page: targetPDF.getTitlePage()
            });
            break;
          case NFLayoutBehavior.ICON_SEQUENCE:
          case NFLayoutBehavior.GAUSSY:
          case NFLayoutBehavior.FIGURE:
          case NFLayoutBehavior.TABLE:
            NFTools.log("Following Instruction: " + layoutInstruction.instruction.display, "autoLayout");
            activeComp.addGaussy({
              placeholder: "[" + layoutInstruction.raw + "]",
              time: layoutInstruction.time
            });
            break;
          case NFLayoutBehavior.UNRECOGNIZED:
          case NFLayoutBehavior.DO_NOTHING:
            if (targetPDF != null) {
              NFTools.log("PDF found but no instruction - animating to title page", "autoLayout");
              titlePage = targetPDF.getTitlePage();
              activeComp.animateTo({
                time: layoutInstruction.time,
                page: titlePage
              });
            }
            NFTools.log("Adding placeholder for [" + layoutInstruction.raw + "]", "autoLayout");
            activeComp.addPlaceholder({
              text: "[" + layoutInstruction.raw + "]",
              time: instructionTime
            });
            break;
          case NFLayoutBehavior.NONE:
            if (targetPDF != null) {
              NFTools.log("PDF found but no instruction - animating to title page", "autoLayout");
              titlePage = targetPDF.getTitlePage();
              activeComp.animateTo({
                time: layoutInstruction.time,
                page: titlePage
              });
            }
            break;
          default:
            throw new Error("There isn't a case for this instruction");
        }
        break;
      default:
        throw new Error("Instruction not found");
    }
    return null;
  },

  /**
  Takes a set of validated layoutInstructions and lays out the whole project.
  @memberof NFProject
  @param {NFLayoutInstruction[]} layoutInstructions
  @returns {String} A message to display to the user
   */
  autoLayout: function(layoutInstructions) {
    var allParts, existingPages, highlight, instructionTime, j, k, lastPart, layoutInstruction, len, len1, lookString, part, ref, targetPDF, thisPart, titlePage;
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
    if (NFProject.containsBrokenHighlights()) {
      return "Aborting AutoLayout!\nThere are broken highlights in some page comps. Fix before running again.";
    }
    NFTools.log("Beginning layout!", "autoLayout");
    lastPart = null;
    for (k = 0, len1 = layoutInstructions.length; k < len1; k++) {
      layoutInstruction = layoutInstructions[k];
      instructionTime = parseFloat(layoutInstruction.time);
      thisPart = NFProject.partForTime(instructionTime);
      if ((lastPart != null) && !thisPart.is(lastPart)) {
        NFTools.logLine();
        NFTools.log("New part - Trimming previous one.", "autoLayout");
        lastPart.trimTo(instructionTime + 10);
      }
      NFTools.logLine();
      NFTools.logLine();
      NFTools.log("Laying out instruction [" + layoutInstruction.raw + "] in " + (thisPart.getName()), "autoLayout");
      if (layoutInstruction["break"]) {
        $.bp();
      }
      switch (layoutInstruction.instruction.type) {
        case NFLayoutType.HIGHLIGHT:
        case NFLayoutType.EXPAND:
          targetPDF = NFPDF.fromPDFNumber(layoutInstruction.getPDF());
          lookString = (ref = layoutInstruction.expandLookString) != null ? ref : layoutInstruction.instruction.look;
          highlight = targetPDF.findHighlight(lookString);
          if (highlight == null) {
            throw new Error("Can't find highlight with name '" + lookString + "' in PDF '" + (targetPDF.toString()) + "'");
          }
          NFTools.log("Animating to highlight '" + lookString + "'", "autoLayout");
          thisPart.animateTo({
            highlight: highlight,
            time: instructionTime,
            skipTitle: layoutInstruction.flags.skipTitle,
            expand: layoutInstruction.flags.expand,
            expandUp: layoutInstruction.flags.expandUp
          });
          break;
        case NFLayoutType.INSTRUCTION:
          targetPDF = NFPDF.fromPDFNumber(layoutInstruction.pdf);
          switch (layoutInstruction.instruction.behavior) {
            case NFLayoutBehavior.SHOW_TITLE:
              NFTools.log("Following Instruction: " + layoutInstruction.instruction.display, "autoLayout");
              thisPart.animateTo({
                time: instructionTime,
                page: targetPDF.getTitlePage()
              });
              break;
            case NFLayoutBehavior.ICON_SEQUENCE:
            case NFLayoutBehavior.GAUSSY:
            case NFLayoutBehavior.FIGURE:
            case NFLayoutBehavior.TABLE:
              NFTools.log("Following Instruction: " + layoutInstruction.instruction.display, "autoLayout");
              thisPart.addGaussy({
                placeholder: "[" + layoutInstruction.raw + "]",
                time: instructionTime
              });
              break;
            case NFLayoutBehavior.UNRECOGNIZED:
            case NFLayoutBehavior.DO_NOTHING:
              if (targetPDF != null) {
                NFTools.log("PDF found but no instruction - animating to title page", "autoLayout");
                titlePage = targetPDF.getTitlePage();
                thisPart.animateTo({
                  time: instructionTime,
                  page: titlePage
                });
              }
              NFTools.log("Adding placeholder for [" + layoutInstruction.raw + "]", "autoLayout");
              thisPart.addPlaceholder({
                text: "[" + layoutInstruction.raw + "]",
                time: instructionTime
              });
              break;
            case NFLayoutBehavior.NONE:
              if (targetPDF != null) {
                NFTools.log("PDF found but no instruction - animating to title page", "autoLayout");
                titlePage = targetPDF.getTitlePage();
                thisPart.animateTo({
                  time: instructionTime,
                  page: titlePage
                });
              }
              break;
            default:
              throw new Error("There isn't a case for this instruction");
          }
          break;
        default:
          throw new Error("Instruction not found");
      }
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
      } else if (i === audioMarkers.numKeys && time >= markerTime) {
        partName += i + 1;
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
    var anyInvalid, expands, ins, j, k, len, len1, returnObj, thisValid, validatedInstructions;
    NFTools.log("Validating Instructions...", "validateInstructions");
    validatedInstructions = [];
    anyInvalid = false;
    expands = [];
    for (j = 0, len = layoutInstructions.length; j < len; j++) {
      ins = layoutInstructions[j];
      thisValid = ins.validate();
      if (!thisValid) {
        anyInvalid = true;
      }
      validatedInstructions.push(ins);
    }
    if (anyInvalid) {
      for (k = 0, len1 = layoutInstructions.length; k < len1; k++) {
        ins = layoutInstructions[k];
        if (!ins.valid) {
          NFTools.log("Invalid Instruction [" + ins.raw + "]: " + ins.validationMessage);
        }
      }
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
  Looks for PDFs that straddle the part markers.
  @memberof NFProject
  @param {Object} instructions - the parsed instructions object
  @returns {Object[] | null} A straddlers object to be passed to #fixStraddlers, or null
   */
  searchForStraddlers: function(instructions) {
    var audioLayer, audioMarkers, i, ins, j, k, len, mainComp, markerTimes, pdfBefore, ref, straddling, straddlingInstructions, subsequentInstructions, testIns;
    straddlingInstructions = [];
    mainComp = NFProject.mainComp();
    audioLayer = mainComp.audioLayers().getBottommostLayer();
    audioMarkers = audioLayer.markers();
    markerTimes = [];
    for (i = j = 1, ref = audioMarkers.numKeys; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      markerTimes.push(audioMarkers.keyTime(i));
    }
    subsequentInstructions = [];
    for (k = 0, len = instructions.length; k < len; k++) {
      ins = instructions[k];
      if (markerTimes[subsequentInstructions.length] <= ins.time) {
        subsequentInstructions.push(ins);
        pdfBefore = ins.prev.getPDF();
        testIns = ins;
        straddling = false;
        while ((testIns != null) && testIns.getPDF() === pdfBefore) {
          if (testIns.instruction.type === NFLayoutType.HIGHLIGHT || testIns.instruction.type === NFLayoutType.EXPAND) {
            straddling = true;
            break;
          }
          testIns = testIns.next;
        }
        if (straddling) {
          straddlingInstructions.push(ins);
        }
      }
      if (subsequentInstructions.length === markerTimes.length) {
        break;
      }
    }
    if (straddlingInstructions.length === 0) {
      return null;
    }
    return straddlingInstructions;
  },

  /**
  Moves the part markers to fix straddlers. Needs to be passed the output of
  #searchForStraddlers.
  @memberof NFProject
  @param {Object[]} straddlers - the straddlers object
  @returns {null}
   */
  fixStraddlers: function(straddlers) {
    var audioLayer, audioMarkers, j, keyPDF, len, mainComp, markerComment, markerValue, nearestKeyIndex, results, straddler, testIns;
    results = [];
    for (j = 0, len = straddlers.length; j < len; j++) {
      straddler = straddlers[j];
      $.bp();
      keyPDF = straddler.getPDF();
      testIns = straddler;
      while ((testIns.prev != null) && testIns.prev.getPDF() === keyPDF) {
        testIns = testIns.prev;
      }
      mainComp = NFProject.mainComp();
      audioLayer = mainComp.audioLayers().getBottommostLayer();
      audioMarkers = audioLayer.markers();
      nearestKeyIndex = audioMarkers.nearestKeyIndex(straddler.time);
      markerValue = audioMarkers.keyValue(nearestKeyIndex);
      markerComment = markerValue.comment;
      audioMarkers.removeKey(nearestKeyIndex);
      results.push(audioLayer.addMarker({
        time: testIns.time - mainComp.comp.frameDuration,
        comment: markerComment + " - ADJUSTED"
      }));
    }
    return results;
  },

  /**
  Follow a single instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
   */
  followInstruction: function(input) {
    var activePDF, instruction, lookString, result, valid;
    instruction = NFTools.parseInstructionString(input);
    instruction.time = NFProject.activeComp().getTime();
    if ((instruction.pdf == null) && instruction.instruction.type === NFLayoutType.HIGHLIGHT || instruction.instruction.type === NFLayoutType.EXPAND) {
      activePDF = NFProject.activeComp().activePDF();
      if (activePDF != null) {
        instruction.pdf = activePDF.getPDFNumber();
      }
    }
    if (instruction.flags.expand != null) {
      lookString = prompt('Enter the look string for the expand:', '', 'AutoLayout');
      if ((lookString != null) && lookString !== '') {
        instruction.expandLookString = lookString;
      } else {
        return alert("Aborting - I need to know the look string for the expand.");
      }
    }
    valid = instruction.validate();
    if (valid) {
      result = NFProject.layoutSingleInstruction(instruction);
    } else {
      return alert("Aborting - Invalid instruction.\nValidator says: " + instruction.validationMessage);
    }
    if (result != null) {
      return alert(result);
    }
  }
};
