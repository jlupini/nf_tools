
/**
NFTools Namespace
@namespace NFTools
 */
var NFTools;

NFTools = {
  logging: true,

  /**
  Returns if a given object is empty
  @memberof NFTools
  @param {object} obj - the object to test
  @returns {boolean} the result
   */
  isEmpty: function(obj) {
    var prop;
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  },

  /**
  Returns the current time (of world, not comp)
  @memberof NFTools
  @returns {time} the time
   */
  now: function() {
    var d;
    d = new Date();
    return d.getTime();
  },

  /**
  Returns the current timestamp, nicely formatted (of world, not comp)
  @memberof NFTools
  @returns {string} the timestamp
   */
  timestamp: function() {
    var date, i, now, suffix, time;
    now = new Date;
    date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    time = [now.getHours(), now.getMinutes(), now.getSeconds()];
    suffix = time[0] < 12 ? 'AM' : 'PM';
    time[0] = time[0] < 12 ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    i = 1;
    while (i < 3) {
      if (time[i] < 10) {
        time[i] = '0' + time[i];
      }
      i++;
    }
    return date.join('/') + ' ' + time.join(':') + ' ' + suffix;
  },

  /**
  Opens a file with a given path, and lets you work with the file using a
  callback function. File will be created if it does not already exist.
  Path relative to project.
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {function} fn - the callback function which should return the new file
  contents
  @example
  NFTools.editProjectFile "../log.txt", (theFileText) =>
    return "Layer number #{i} is called #{layer.getName()}"
  @returns {null} null
   */
  editProjectFile: function(filename, fn) {
    var closeCheck, encoding, file_contents, newFileText, openCheck, start_folder, theFile, theFileText, writeCheck;
    file_contents = void 0;
    start_folder = new Folder(app.project.file.parent.fsName);
    theFile = new File(start_folder.fsName + '/' + filename);
    if (theFile.exists) {
      openCheck = theFile.open("r");
      if (!openCheck) {
        throw new Error("Can't open the File with read permissions!");
      }
      theFileText = theFile.read();
      closeCheck = theFile.close();
      if (!closeCheck) {
        throw new Error("Can't close the File!");
      }
    } else {
      encoding = 'utf-8';
      theFile.encoding = encoding;
    }
    openCheck = theFile.open("w");
    if (!openCheck) {
      throw new Error("Can't open the File with write permissions");
    }
    newFileText = fn(theFileText);
    writeCheck = theFile.write(newFileText);
    if (!writeCheck) {
      throw new Error("Can't write to the File!");
    }
    closeCheck = theFile.close();
    if (!closeCheck) {
      throw new Error("Can't close the File!");
    }
    return null;
  },

  /**
  Opens a file with a given path, and lets you work with the file using a
  callback function. File will be created if it does not already exist.
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {function} fn - the callback function which should return the new file
  contents
  @example
  NFTools.editFile "../log.txt", (theFileText) =>
    return "Layer number #{i} is called #{layer.getName()}"
  @returns {null} null
   */
  editFile: function(filename, fn) {
    var closeCheck, encoding, newFileText, openCheck, parentPath, relPath, theFile, theFileText, writeCheck;
    parentPath = (new File($.fileName)).parent.fsName;
    relPath = filename[0] === "/" ? filename : "/" + filename;
    theFile = new File(parentPath + relPath);
    if (theFile.exists) {
      openCheck = theFile.open("r");
      if (!openCheck) {
        throw new Error("Can't open the File with read permissions!");
      }
      theFileText = theFile.read();
      closeCheck = theFile.close();
      if (!closeCheck) {
        throw new Error("Can't close the File!");
      }
    } else {
      encoding = 'utf-8';
      theFile.encoding = encoding;
    }
    openCheck = theFile.open("w");
    if (!openCheck) {
      throw new Error("Can't open the File with write permissions");
    }
    newFileText = fn(theFileText);
    writeCheck = theFile.write(newFileText);
    if (!writeCheck) {
      throw new Error("Can't write to the File!");
    }
    closeCheck = theFile.close();
    if (!closeCheck) {
      throw new Error("Can't close the File!");
    }
    return null;
  },

  /**
  Opens a file and clears it.
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @returns {null} null
   */
  clearFile: function(filename) {
    NFTools.editFile(filename, (function(_this) {
      return function(fileText) {
        return "";
      };
    })(this));
    return null;
  },

  /**
  Reads a file relative to the current AE project
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {boolean} [fixLineBreaks=true] replace file line breaks with standard
  js line breaks
  @example fileString = readFile "citations.csv"
  @returns {String} the file contents
   */
  readProjectFile: function(filename, fixLineBreaks) {
    var e, error, file_contents, file_handle, start_folder;
    if (fixLineBreaks == null) {
      fixLineBreaks = true;
    }
    file_contents = void 0;
    start_folder = new Folder(app.project.file.parent.fsName);
    file_handle = new File(start_folder.fsName + '/' + filename);
    if (!file_handle.exists) {
      throw new Error('I can\'t find this file: \'' + filename + '\'. \n\nI looked in here: \'' + start_folder.fsName + '\'.');
    }
    try {
      file_handle.open('r');
      file_contents = file_handle.read();
    } catch (error) {
      e = error;
      throw new Error('I couldn\'t read the given file: ' + e);
    } finally {
      file_handle.close();
    }
    if (fixLineBreaks) {
      return NFTools.fixLineBreaks(file_contents);
    } else {
      return file_contents;
    }
  },

  /**
  Checks to see if a file exists relative to the current AE project
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @returns {boolean} Whether the file can be read or not
   */
  testProjectFile: function(filename) {
    var e, error, file_contents, file_handle, start_folder;
    file_contents = void 0;
    start_folder = new Folder(app.project.file.parent.fsName);
    file_handle = new File(start_folder.fsName + '/' + filename);
    if (!file_handle.exists) {
      return false;
    }
    try {
      file_handle.open('r');
      file_contents = file_handle.read();
    } catch (error) {
      e = error;
      return false;
    } finally {
      file_handle.close();
    }
    if (file_contents != null) {
      return true;
    }
  },

  /**
  Reads a file and returns the contents as a string
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {boolean} [fixLineBreaks=true] replace file line breaks with standard
  js line breaks
  @param {boolean} [relativeToScriptFile=true] the file path is relative to the script file
  @example fileString = readFile "expressions/expressionfile.js"
  @returns {String} the file contents
   */
  readFile: function(filename, fixLineBreaks, relativeToScriptFile) {
    var e, error, file_contents, file_handle, startPath, start_folder;
    if (fixLineBreaks == null) {
      fixLineBreaks = true;
    }
    if (relativeToScriptFile == null) {
      relativeToScriptFile = true;
    }
    file_contents = void 0;
    start_folder = new Folder(new File($.fileName).parent.fsName);
    startPath = relativeToScriptFile ? start_folder.fsName + '/' : "";
    file_handle = new File(startPath + filename);
    if (!file_handle.exists) {
      throw new Error('I can\'t find this file: \'' + filename + '\'. \n\nI looked in here: \'' + start_folder.fsName + '\'.');
    }
    try {
      file_handle.open('r');
      file_contents = file_handle.read();
    } catch (error) {
      e = error;
      throw new Error('I couldn\'t read the given file: ' + e);
    } finally {
      file_handle.close();
    }
    if (fixLineBreaks) {
      return NFTools.fixLineBreaks(file_contents);
    } else {
      return file_contents;
    }
  },
  fixLineBreaks: function(text) {
    return text.replace(/\n\n/g, '\n \n');
  },

  /**
  Reads an expression .js file and returns the contents as a string. Looks in
  `expressions/` folder.
  @memberof NFTools
  @param {String} expName - The name of the script. No path or extension.
  @param {Object} [replacementDict] - a dictionary of search/replace keys in the
  file.
  @example fileString = readExpression "expressionfile",\nEXAMPLE_PLACEHOLDER: new_value
  @throw Throws error if search value could not be found
  @throw Throws error if file cannot be found
  @throw Throws error if file cannot be read
  @returns {String} the expression as a string
   */
  readExpression: function(expName, replacementDict) {
    var file_contents, filename, k;
    filename = "expressions/" + expName + ".js";
    file_contents = NFTools.readFile(filename);
    if (replacementDict != null) {
      for (k in replacementDict) {
        file_contents = file_contents.replace(k, replacementDict[k]);
      }
    }
    return file_contents;
  },

  /**
  Returns a general, 4-corner Shape object from a rect object
  @memberof NFTools
  @param {Object} [rect] - a rect object with .top, .left, .width, and .height properties
  @returns {Shape} the Shape object
   */
  shapeFromRect: function(rect) {
    var lb, lt, newShape, rb, rt;
    if (!(((rect != null ? rect.top : void 0) != null) && (rect.left != null) && (rect.width != null) && (rect.height != null))) {
      throw new Error("Invalid rect object");
    }
    lt = [rect.left, rect.top];
    lb = [rect.left, rect.top + rect.height];
    rt = [rect.left + rect.width, rect.top];
    rb = [rect.left + rect.width, rect.top + rect.height];
    newShape = new Shape();
    newShape.vertices = [lt, rt, rb, lb];
    newShape.closed = true;
    return newShape;
  },

  /**
  Returns whether or not two rect objects intersect
  @memberof NFTools
  @param {Object} [rectA] - a rect object with .top, .left, .width, and .height properties
  @param {Object} [rectB] - a rect object with .top, .left, .width, and .height properties
  @returns {Shape} the Shape object
   */
  rectsIntersect: function(rectA, rectB) {
    var aAboveB, aBelowB, aLeftOfB, aRightOfB, maxAx, maxAy, maxBx, maxBy, minAx, minAy, minBx, minBy;
    if (!(((rectA != null ? rectA.top : void 0) != null) && (rectA.left != null) && (rectA.width != null) && (rectA.height != null) && ((rectB != null ? rectB.top : void 0) != null) && (rectB.left != null) && (rectB.width != null) && (rectB.height != null))) {
      throw new Error("Invalid rect object");
    }
    minAx = rectA.left;
    minAy = rectA.top;
    maxAx = rectA.left + rectA.width;
    maxAy = rectA.top + rectA.height;
    minBx = rectB.left;
    minBy = rectB.top;
    maxBx = rectB.left + rectB.width;
    maxBy = rectB.top + rectB.height;
    aLeftOfB = maxAx < minBx;
    aRightOfB = minAx > maxBx;
    aAboveB = minAy > maxBy;
    aBelowB = maxAy < minBy;
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  },

  /**
  Logs a message to log.txt
  @memberof NFTools
  @param {String} message - The message to log
  @param {String} sender - The lender to attribute the message to
  @returns {null} null
   */
  log: function(message, sender) {
    if (sender == null) {
      sender = "";
    }
    if (!NFTools.logging) {
      return null;
    }
    NFTools.editFile("../log.txt", (function(_this) {
      return function(fileText) {
        var newEntry, now, timestamp;
        now = new Date();
        timestamp = NFTools.timestamp();
        newEntry = "[" + timestamp + "] (" + sender + ") > " + message;
        return fileText + "\r\n" + newEntry;
      };
    })(this));
    return null;
  },

  /**
  Adds a line break to the log
  @memberof NFTools
  @returns {null} null
   */
  logLine: function() {
    if (!NFTools.logging) {
      return null;
    }
    NFTools.editFile("../log.txt", (function(_this) {
      return function(fileText) {
        return fileText + "\r\n";
      };
    })(this));
    return null;
  },

  /**
  Adds a section break to log.txt
  @memberof NFTools
  @returns {null} null
   */
  breakLog: function() {
    if (!NFTools.logging) {
      return null;
    }
    NFTools.editFile("../log.txt", (function(_this) {
      return function(fileText) {
        return fileText + "\r\n-----------------------------\r\n\r\n";
      };
    })(this));
    return null;
  },

  /**
  Clears log.txt
  @memberof NFTools
  @returns {null} null
   */
  clearLog: function() {
    if (!NFTools.logging) {
      return null;
    }
    NFTools.clearFile("../log.txt");
    return null;
  },

  /**
  Parse each instruction in the parsedLines object and return an array of
  parsed instruction objects. Properties on each object are: `raw`, `pdf`,
  `flags`, `instruction`, `time`, `line`, and `assumptions`.
  @memberof NFProject
  @param {Object[]} parsedLines - the parsedLines object to parse
  @returns {NFLayoutInstruction[]} the instruction object array
   */
  parseInstructions: function(parsedLines) {
    var key, l, layoutInstruction, len1, len2, line, logString, m, pad, parsed, parsedInstructions, prevInstruction;
    parsedInstructions = [];
    prevInstruction = null;
    NFTools.log("Parsing instructions...", "parseInstructions");
    NFTools.logLine();
    for (l = 0, len1 = parsedLines.length; l < len1; l++) {
      line = parsedLines[l];
      layoutInstruction = NFTools.parseInstructionString(line.instruction);
      layoutInstruction.time = line.timecodes[0][0];
      layoutInstruction.line = line.text;
      if (prevInstruction != null) {
        layoutInstruction.prev = prevInstruction;
        prevInstruction.next = layoutInstruction;
      }
      if (prevInstruction != null) {
        parsedInstructions.push(prevInstruction);
      }
      prevInstruction = layoutInstruction;
    }
    parsedInstructions.push(prevInstruction);
    NFTools.log("Finished parsing instructions. Result:", "parseInstructions");
    for (m = 0, len2 = parsedInstructions.length; m < len2; m++) {
      parsed = parsedInstructions[m];
      pad = function(str, len) {
        str = str.toString();
        if (str.length < len) {
          return str + new Array(len - str.length).join(" ");
        } else {
          return str;
        }
      };
      logString = "At " + (pad(parsed.time, 6)) + " ";
      if (parsed.pdf != null) {
        logString += "in PDF " + (pad(parsed.pdf, 4)) + " ";
      } else {
        logString += "           ";
      }
      logString += "instruction    " + (pad(parsed.instruction.display, 20)) + " ";
      if (!NFTools.isEmpty(parsed.flags)) {
        logString += "with flags: ";
      }
      for (key in parsed.flags) {
        logString += "'" + parsed.flags[key].display + "', ";
      }
      logString += "from raw input '" + parsed.raw + "'";
      NFTools.log(logString, "parseInstructions");
    }
    NFTools.logLine();
    return parsedInstructions;
  },

  /**
  Parse an instruction string (ie. "41g"). The basic methodology here is to
  remove each peice one by one as they're recognized and see what's left at the
  end.
  @memberof NFProject
  @param {string} input - the input to parse
  @returns {NFLayoutInstruction} the instruction object
   */
  parseInstructionString: function(input) {
    var code, flagOption, flags, instruction, instructionString, key, l, len1, len2, m, option, parsedObject, ref, ref1, regexResult, shouldBreak, strippedInput, strippedString, targetPDFNumber;
    NFTools.log("Parsing instruction: '" + input + "'", "parseInstructionString");
    if (input[0] === "/") {
      NFTools.log("Ignoring instruction", "parseInstructionString");
      NFTools.logLine();
      return new NFLayoutInstruction({
        raw: input,
        flags: {},
        instruction: NFLayoutInstructionIgnore
      });
    }
    if (input[0] === "!") {
      strippedInput = input.substr(1);
      shouldBreak = true;
    } else {
      strippedInput = input;
      shouldBreak = false;
    }
    if (shouldBreak) {
      $.bp();
    }
    targetPDFNumber = /(^\d+)/i.exec(strippedInput);
    if (targetPDFNumber != null) {
      targetPDFNumber = targetPDFNumber[1];
    }
    if (targetPDFNumber != null) {
      instructionString = strippedInput.slice(targetPDFNumber.length);
      NFTools.log("Target PDF Number found: '" + targetPDFNumber + "'", "parseInstructionString");
    } else {
      instructionString = strippedInput;
    }
    flags = {};
    for (key in NFLayoutFlagDict) {
      flagOption = NFLayoutFlagDict[key];
      ref = flagOption.code;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        code = ref[l];
        if (instructionString.indexOf(code) >= 0) {
          flags[key] = flagOption;
          instructionString = instructionString.replace(code, "").trim();
          NFTools.log("Flag found: '" + flagOption.display + "'", "parseInstructionString");
        }
      }
    }
    if (instructionString !== "") {
      instruction = null;
      NFTools.log("Instruction string remaining: '" + instructionString + "'", "parseInstructionString");
      for (key in NFLayoutInstructionDict) {
        option = NFLayoutInstructionDict[key];
        ref1 = option.code;
        for (m = 0, len2 = ref1.length; m < len2; m++) {
          code = ref1[m];
          strippedString = instructionString.replace(/\s+/g, '');
          if (strippedString === code) {
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
        if ((instruction == null) && (option.regex != null)) {
          regexResult = option.regex.exec(instructionString);
          if (regexResult != null) {
            instruction = option;
          }
        }
      }
      if (instruction != null) {
        NFTools.log("Instruction found: '" + instruction.display + "'", "parseInstructionString");
      }
    }
    if (instruction == null) {
      NFTools.log("No Instruction found.", "parseInstructionString");
      if (instructionString === "") {
        if (flags.expand != null) {
          instruction = NFLayoutInstructionExpand;
        } else {
          instruction = NFLayoutInstructionNone;
        }
      } else {
        instruction = NFLayoutInstructionNotFound;
      }
      NFTools.logLine();
    }
    return parsedObject = new NFLayoutInstruction({
      raw: input,
      pdf: targetPDFNumber,
      flags: flags,
      instruction: instruction,
      "break": shouldBreak
    });
  },

  /**
  Imports the script (script.txt) and the instructions (transcript.csv) files.
  Compares the two of them to combine.
  @memberof NFTools
  @param {boolean} [detailedAnalysis=no] - if a detailed analysis should be done
  @returns {Object[]} an Array of line objects with 'instruction', 'text', and
  'timecodes' keys
   */
  readAndCombineScriptAndInstructions: function(detailedAnalysis) {
    var afterTC, averageMatch, averageTC, beforeTC, bestComparison, bestComparisonMatch, bestMatchSentence, cleanLine, comparison, comprehensiveRangeTest, dirtyScriptArray, dummy, element, findBestRange, fullSnippet, getMinSim, input, inputInt, inputMessage, instructionArray, instructionFile, instructionString, l, lastWinner, len1, len2, lineAfterSentence, lineObj, lineSentence, lookAheadIdx, lookAheadSnippet, lookBackIdx, lookBackSnippet, m, matchSum, o, parsedLine, parsedLines, rangeComparison, ref, ref1, removeLineBreaks, scriptFile, scriptLines, scriptString, sentenceFromInstructionRange, shouldQuit, splitElement, testChar, testEnd, testLine, testLineIdx, testSentence, testStart, timecodes, toPercent, trimmed, winners, wordCount;
    if (detailedAnalysis == null) {
      detailedAnalysis = false;
    }
    cleanLine = function(line) {
      var cleaned;
      cleaned = line.toLowerCase();
      cleaned = cleaned.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
      return removeLineBreaks(cleaned);
    };
    removeLineBreaks = function(line) {
      return line.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    };
    getMinSim = function(vals) {
      vals = vals.stuff(1);
      return Math.min.apply(Math, vals);
    };
    toPercent = function(ratio) {
      return Math.round((1 - ratio) * 100) + "%";
    };
    scriptFile = "script.txt";
    instructionFile = "transcript.csv";
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
    for (l = 0, len1 = dirtyScriptArray.length; l < len1; l++) {
      element = dirtyScriptArray[l];
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
    sentenceFromInstructionRange = function(fromVal, toVal) {
      var testTimecodes, theWord;
      testTimecodes = instructionArray.slice(fromVal, toVal + 1);
      return ((function() {
        var len2, m, results;
        results = [];
        for (m = 0, len2 = testTimecodes.length; m < len2; m++) {
          theWord = testTimecodes[m];
          results.push(theWord[1] + " ");
        }
        return results;
      })()).join("").trim();
    };
    rangeComparison = function(model) {
      var lineSentence, retObj, testSentence;
      testSentence = cleanLine(sentenceFromInstructionRange(model.from, model.to));
      lineSentence = cleanLine(model.line.text);
      return retObj = {
        match: NFTools.similarity(testSentence, lineSentence),
        line: model.line,
        from: model.from,
        to: model.to
      };
    };
    findBestRange = function(model) {
      var bestComparison, comparison, comparisons, growCount, growThreshold, lastComparison, len2, m, ref1, ref2, ref3, testComparison, testCount;
      model = {
        testStart: model.testStart,
        testEnd: model.testEnd,
        startDelta: (ref1 = model.startDelta) != null ? ref1 : 0,
        endDelta: (ref2 = model.endDelta) != null ? ref2 : 0,
        maxTests: (ref3 = model.maxTests) != null ? ref3 : 100,
        method: model.method
      };
      testCount = 0;
      growCount = 0;
      growThreshold = 2;
      comparisons = [];
      while (growCount <= growThreshold && testCount <= model.maxTests) {
        if (comparisons.length) {
          lastComparison = comparisons[comparisons.length - 1];
        }
        comparison = rangeComparison({
          line: testLine,
          from: testStart,
          to: testEnd
        });
        comparisons.push(comparison);
        if ((lastComparison != null ? lastComparison.match : void 0) < comparison.match) {
          growCount++;
        }
        testCount++;
        testEnd += model.endDelta;
        testStart += model.startDelta;
        if (testStart < 1 || testEnd > instructionArray.length) {
          break;
        }
        if (testEnd < testStart) {
          break;
        }
      }
      bestComparison = null;
      for (m = 0, len2 = comparisons.length; m < len2; m++) {
        testComparison = comparisons[m];
        if ((bestComparison == null) || testComparison.match < bestComparison.match) {
          bestComparison = testComparison;
        }
      }
      bestComparison.method = model.method;
      return bestComparison;
    };
    comprehensiveRangeTest = function(model) {
      var bestComparison, len2, m, testComparison, testResults;
      testResults = [];
      testResults.push(findBestRange({
        testStart: testStart,
        testEnd: testEnd,
        endDelta: 1,
        method: "Growing Tail"
      }));
      testResults.push(findBestRange({
        testStart: testStart,
        testEnd: testEnd,
        endDelta: -1,
        method: "Shrinking Tail"
      }));
      if (detailedAnalysis) {
        testResults.push(findBestRange({
          testStart: testStart,
          testEnd: testEnd,
          startDelta: -1,
          endDelta: -1,
          maxTests: 20,
          method: "Shifting Back"
        }));
        testResults.push(findBestRange({
          testStart: testStart,
          testEnd: testEnd,
          startDelta: 1,
          endDelta: 1,
          maxTests: 20,
          method: "Shifting Forward"
        }));
        testResults.push(findBestRange({
          testStart: testStart,
          testEnd: testEnd,
          startDelta: -2,
          endDelta: -1,
          maxTests: 20,
          method: "Growing Backwards"
        }));
        testResults.push(findBestRange({
          testStart: testStart,
          testEnd: testEnd,
          startDelta: 1,
          endDelta: 2,
          maxTests: 20,
          method: "Growing Forwards"
        }));
      }
      bestComparison = null;
      for (m = 0, len2 = testResults.length; m < len2; m++) {
        testComparison = testResults[m];
        if ((bestComparison == null) || testComparison.match < bestComparison.match) {
          bestComparison = testComparison;
        }
      }
      return bestComparison;
    };
    NFTools.log("Comparing lines...\n", "readAndCombineScriptAndInstructions");
    winners = [];
    matchSum = 0;
    for (testLineIdx = m = 0, ref1 = scriptLines.length - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; testLineIdx = 0 <= ref1 ? ++m : --m) {
      testLine = scriptLines[testLineIdx];
      lastWinner = winners.length ? winners[winners.length - 1] : null;
      NFTools.log("Test Line:   '" + (cleanLine(testLine.text)) + "'", "readAndCombineScriptAndInstructions");
      wordCount = testLine.text.split(' ').length;
      testStart = lastWinner != null ? lastWinner.to + 1 : 1;
      testEnd = testStart + wordCount;
      if (testLine.text === "") {
        winners.push(dummy = {
          from: testStart,
          to: testStart - 1,
          line: testLine,
          method: "None",
          match: 0
        });
        NFTools.log("Empty test line - moving on", "readAndCombineScriptAndInstructions");
      } else {
        bestComparison = comprehensiveRangeTest({
          testStart: testStart,
          testEnd: testEnd
        });
        bestComparisonMatch = bestComparison.match;
        if (bestComparisonMatch > 0.5) {
          lineSentence = cleanLine(bestComparison.line.text);
          if (!(testLineIdx + 1 >= scriptLines.length)) {
            lineAfterSentence = cleanLine(scriptLines[testLineIdx + 1].text);
          }
          bestMatchSentence = cleanLine(sentenceFromInstructionRange(bestComparison.from, bestComparison.to));
          lookBackIdx = bestComparison.from - 6;
          if (lookBackIdx < 0) {
            lookBackIdx = 0;
          }
          lookAheadIdx = bestComparison.to + 10;
          if (lookAheadIdx >= instructionArray.length) {
            lookAheadIdx = instructionArray.length - 1;
          }
          lookBackSnippet = cleanLine(sentenceFromInstructionRange(lookBackIdx, bestComparison.from - 1));
          lookAheadSnippet = cleanLine(sentenceFromInstructionRange(bestComparison.to + 1, lookAheadIdx));
          fullSnippet = lookBackSnippet + "\n<<< " + bestMatchSentence + " >>>\n" + lookAheadSnippet;
          inputMessage = "Got a bad match score on this line.\nGenerally, some words will be missing from the matches. Enter an integer to move the end brackets by. So for example, entering '-12' means 12 words will be removed from the end. Entering '+4' means the next 4 words will be added on.\n\n\n Target Line: '" + lineSentence + "'\n\n Best Match: '" + fullSnippet + "'\n\n";
          if (lineAfterSentence != null) {
            inputMessage += "Line After: " + lineAfterSentence + "\n\n";
          }
          input = prompt(inputMessage, '', 'Manual Match');
          inputInt = parseInt(input);
          if (inputInt != null) {
            bestComparison.to += inputInt;
          }
          testSentence = cleanLine(sentenceFromInstructionRange(bestComparison.from, bestComparison.to));
          lineSentence = cleanLine(bestComparison.line.text);
          bestComparison.match = NFTools.similarity(testSentence, lineSentence);
          bestComparison.method = "Manual";
        }
        winners.push(bestComparison);
        matchSum += bestComparison.match;
        NFTools.log("Best result: '" + (cleanLine(sentenceFromInstructionRange(bestComparison.from, bestComparison.to))) + "'", "readAndCombineScriptAndInstructions");
        NFTools.log("Method '" + bestComparison.method + "' is the winner, with range " + bestComparison.from + "-" + bestComparison.to + " and score of <" + bestComparison.match + ">", "readAndCombineScriptAndInstructions");
        if ((lastWinner != null) && lastWinner.to >= bestComparison.from) {
          NFTools.logLine();
          NFTools.log("NOTE: last result shifted back, so we're moving the previous one...", "readAndCombineScriptAndInstructions");
          lastWinner.to = bestComparison.from - 1;
          NFTools.log("Prev test Line:   '" + (cleanLine(lastWinner.line.text)) + "'", "readAndCombineScriptAndInstructions");
          NFTools.log("Adjusted match:   '" + (cleanLine(sentenceFromInstructionRange(lastWinner.from, lastWinner.to))) + "'", "readAndCombineScriptAndInstructions");
          matchSum -= lastWinner.match;
          testSentence = cleanLine(sentenceFromInstructionRange(lastWinner.from, lastWinner.to));
          lineSentence = cleanLine(lastWinner.line.text);
          lastWinner.match = NFTools.similarity(testSentence, lineSentence);
          matchSum += lastWinner.match;
          winners[winners.length - 2] = lastWinner;
        }
      }
      averageMatch = matchSum / winners.length;
      NFTools.log("Average match score is now <" + averageMatch + ">", "readAndCombineScriptAndInstructions");
      if (averageMatch > 0.6 && lastWinner.method !== "Manual") {
        shouldQuit = confirm("Average match score is not looking great (> 0.6), so something might be borked. Cancel?", false, "Whoops...");
        NFTools.log("------\nABORTING!!!\n----------", "readAndCombineScriptAndInstructions");
        NFTools.logLine();
      }
      if (shouldQuit) {
        break;
      }
      NFTools.logLine();
    }
    if (shouldQuit) {
      return null;
    }
    parsedLines = [];
    for (o = 0, len2 = winners.length; o < len2; o++) {
      comparison = winners[o];
      if (comparison.to < comparison.from) {
        beforeTC = comparison.to <= 1 ? 0 : instructionArray[comparison.to][0];
        afterTC = instructionArray[comparison.from][0];
        averageTC = (parseFloat(beforeTC) + parseFloat(afterTC)) / 2;
        timecodes = [[averageTC, '', '']];
      } else {
        timecodes = instructionArray.slice(comparison.from, comparison.to + 1);
      }
      parsedLine = {
        instruction: comparison.line.instruction,
        text: comparison.line.text,
        timecodes: timecodes
      };
      parsedLines.push(parsedLine);
    }
    NFTools.log("Done Importing!", "readAndCombineScriptAndInstructions");
    NFTools.logLine();
    return parsedLines;
  },

  /**
  Returns the similarity value of two strings, relative to their length.
  This number is effectively the percentage of characters that would need to
  change to make them the same
  @memberof NFTools
  @param {String} str1
  @param {String} str2
  @returns {int} the result
   */
  similarity: function(str1, str2) {
    var n, res;
    if (!(typeof str1 === 'string' && typeof str2 === 'string')) {
      throw new Error("Can't compare similarity of non-strings");
    }
    n = Math.max(str1.length, str2.length);
    res = NFTools.levenshtein(str1, str2) / n;
    return res;
  },

  /**
  Returns the levenshtein value of two strings, aka how different they are. The
  higher the number, the bigger the difference.
  @memberof NFTools
  @param {String} str1
  @param {String} str2
  @returns {int} the result
   */
  levenshtein: function(a, b) {
    var i, j, matrix;
    if (a.length === 0) {
      return b.length;
    }
    if (b.length === 0) {
      return a.length;
    }
    matrix = [];
    i = void 0;
    i = 0;
    while (i <= b.length) {
      matrix[i] = [i];
      i++;
    }
    j = void 0;
    j = 0;
    while (j <= a.length) {
      matrix[0][j] = j;
      j++;
    }
    i = 1;
    while (i <= b.length) {
      j = 1;
      while (j <= a.length) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
        j++;
      }
      i++;
    }
    return matrix[b.length][a.length];
  },
  graphicToText: function(infiles) {
    var i, outfile, re1, re2, s;
    outfile = void 0;
    s = void 0;
    re1 = /^\(new String\(/;
    re2 = /\)\)$/;
    i = 0;
    while (i < infiles.length) {
      if (infiles[i].exists) {
        outfile = File(infiles[i].fullName.replace(/\.(png|idrc)$/, '.txt'));
        outfile.open('w');
        infiles[i].encoding = 'BINARY';
        infiles[i].open('r');
        s = infiles[i].read();
        outfile.write('var ' + outfile.name.replace('.txt', '') + ' = ');
        outfile.write(s.toSource().replace(re1, '').replace(re2, ''));
        outfile.write(';');
        infiles[i].close();
        outfile.close();
      }
      i++;
    }
  }
};
