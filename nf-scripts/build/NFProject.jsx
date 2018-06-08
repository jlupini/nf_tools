
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
  Looks for an item globally in the project
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
  Follow an instruction string (ie. "41g")
  @memberof NFProject
  @param {string} itemName - the string to search for
  @returns {Item | null} the found item or null
   */
  followInstruction: function(input) {
    var activePDF, activePDFNumber, alreadyOnTargetPaper, code, flagOption, flags, group, highlight, instruction, instructionString, j, k, key, l, len, len1, len2, mainComp, option, outPoint, ref, ref1, ref2, results, targetPDF, targetPDFNumber, theLayer, titlePage, titlePageLayer;
    mainComp = this.activeComp();
    if (!(mainComp instanceof NFPartComp)) {
      throw "Can only run instruction on a part comp";
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
                throw "instruction matched two instruction options (" + instruction.display + " and " + option.display + ") with the same priority. Check layoutDictionary.";
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
        throw "No instruction matches instruction string";
      }
    }
    if ((targetPDF != null) && (instruction == null)) {
      titlePage = targetPDF.getTitlePage();
      titlePageLayer = mainComp.insertPage({
        page: titlePage,
        animate: true
      });
      if (activePDF != null) {
        outPoint = titlePageLayer.markers().keyTime("NF In");
        group = mainComp.groupFromPDF(activePDF);
        ref2 = group.getChildren(true).layers;
        results = [];
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          theLayer = ref2[l];
          results.push(theLayer.layer.outPoint = outPoint);
        }
        return results;
      }
    } else if (instruction.type = NFLayoutType.HIGHLIGHT) {
      highlight = targetPDF.findHighlight(instruction.look);
      if (highlight == null) {
        throw "Can't find highlight with name '" + instruction.look + "' in PDF '" + (targetPDF.toString()) + "'";
      }
      return mainComp.animateToHighlight({
        highlight: highlight,
        skipTitle: flags.skipTitle
      });
    } else {
      return this;
    }
  }
};
