
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
  Follow an instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
   */
  followInstruction: function(input) {
    var activePDF, activePDFNumber, alreadyOnTargetPaper, code, flagOption, flags, highlight, instruction, instructionString, j, k, key, len, len1, mainComp, option, ref, ref1, targetPDF, targetPDFNumber, titlePage;
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
        }
      }
    }
    instruction = null;
    if (instructionString !== "") {
      for (key in NFLayoutInstructionDict) {
        option = NFLayoutInstructionDict[key];
        ref1 = option.code;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          code = ref1[k];
          if (instructionString.indexOf(code) >= 0) {
            if (instruction != null) {
              if ((option.priority != null) && (instruction.priority != null) && option.priority < instruction.priority) {
                instruction = option;
              } else if (((option.priority != null) && (instruction.priority != null)) || ((option.priority == null) && (instruction.priority == null))) {
                throw new Error("instruction matched two instruction options (" + instruction.display + " and " + option.display + ") with the same priority. Check layoutDictionary.");
              } else if (option.priority != null) {
                instruction = option;
              }
            } else {
              instruction = option;
            }
          }
        }
      }
      if (instruction == null) {
        throw new Error("No instruction matches instruction string");
      }
    }
    if ((targetPDF != null) && (instruction == null)) {
      titlePage = targetPDF.getTitlePage();
      mainComp.animateTo({
        page: titlePage
      });
    } else if (instruction.type === NFLayoutType.HIGHLIGHT) {
      highlight = targetPDF.findHighlight(instruction.look);
      if (highlight == null) {
        throw new Error("Can't find highlight with name '" + instruction.look + "' in PDF '" + (targetPDF.toString()) + "'");
      }
      mainComp.animateTo({
        highlight: highlight,
        skipTitle: flags.skipTitle
      });
    } else if (instruction.type === NFLayoutType.INSTRUCTION) {
      if (instruction.instruction === NFLayoutInstruction.SHOW_TITLE) {
        mainComp.animateTo({
          page: targetPDF.getTitlePage()
        });
      } else {
        this;
      }
      this;
    }
    return this;
  }
};
