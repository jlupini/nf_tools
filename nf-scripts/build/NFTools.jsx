
/**
NFTools Namespace
@namespace NFTools
 */
var NFTools;

NFTools = {
  logging: true,

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
  @memberof NFTools
  @param {String} filename - the path to the file as a string. No leading
  slashes are necessary
  @param {function} fn - the callback function which should return the new file
  contents
  @example
  NFTools.openFile "../log.txt", (theFileText) =>
    return "Layer number #{i} is called #{layer.getName()}"
  @returns {null} null
   */
  editFile: function(filename, fn) {
    var closeCheck, encoding, newFileText, openCheck, theFile, theFileText, writeCheck;
    theFile = new File(filename);
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
  @param {Object} replacementDict - a dictionary of search/replace keys in the
  file. Error thrown if one is not found
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
        return fileText + "\n" + newEntry;
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
        return fileText + "\n-----------------------------\n\n\n";
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
  Converts a String from a CSV file to an array of arrays
  @memberof NFTools
  @returns {Array} the array from the CSV
   */
  parseCSV: function(sep) {
    var foo, tl, x;
    foo = this.split(sep = sep || ',');
    x = foo.length - 1;
    tl = void 0;
    while (x >= 0) {
      if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
        if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
        } else {
          foo = foo.shift().split(sep).concat(foo);
        }
      } else {
        foo[x].replace(/""/g, '"');
      }
      x--;
    }
    return foo;
  }
};
