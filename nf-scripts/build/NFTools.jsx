
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
  @example fileString = readFile "expressions/expressionfile.js"
  @returns {String} the file contents
   */
  readFile: function(filename, fixLineBreaks) {
    var e, error, file_contents, file_handle, start_folder;
    if (fixLineBreaks == null) {
      fixLineBreaks = true;
    }
    file_contents = void 0;
    start_folder = new Folder(new File($.fileName).parent.fsName);
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
  @example fileString = readExpression "expressionfile"
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
    var code, flagOption, flags, instruction, instructionString, key, l, len1, len2, m, option, parsedObject, ref, ref1, regexResult, shouldBreak, strippedInput, targetPDFNumber;
    NFTools.log("Parsing instruction: '" + input + "'", "parseInstructionString");
    if (input[0] === "\\") {
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
    var afterTC, averageTC, beforeTC, bestComparison, cleanLine, comparison, comprehensiveRangeTest, dirtyScriptArray, dummy, element, findBestRange, getMinSim, instructionArray, instructionFile, instructionString, l, lastWinner, len1, len2, lineObj, m, o, parsedLine, parsedLines, rangeComparison, ref, ref1, removeLineBreaks, scriptFile, scriptLines, scriptString, sentenceFromInstructionRange, splitElement, testChar, testEnd, testLine, testLineIdx, testStart, timecodes, toPercent, trimmed, winners, wordCount;
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
        winners.push(bestComparison);
        NFTools.log("Best result: '" + (cleanLine(sentenceFromInstructionRange(bestComparison.from, bestComparison.to))) + "'", "readAndCombineScriptAndInstructions");
        NFTools.log("Method '" + bestComparison.method + "' is the winner, with range " + bestComparison.from + "-" + bestComparison.to, "readAndCombineScriptAndInstructions");
        if ((lastWinner != null) && lastWinner.to >= bestComparison.from) {
          NFTools.logLine();
          NFTools.log("NOTE: last result shifted back, so we're moving the previous one...", "readAndCombineScriptAndInstructions");
          lastWinner.to = bestComparison.from - 1;
          NFTools.log("Prev test Line:   '" + (cleanLine(lastWinner.line.text)) + "'", "readAndCombineScriptAndInstructions");
          NFTools.log("Adjusted match:   '" + (cleanLine(sentenceFromInstructionRange(lastWinner.from, lastWinner.to))) + "'", "readAndCombineScriptAndInstructions");
          winners[winners.length - 2] = lastWinner;
        }
      }
      NFTools.logLine();
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
  }
};
