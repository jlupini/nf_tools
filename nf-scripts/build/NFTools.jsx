
/**
NFTools Namespace
@namespace NFTools
 */
var NFTools;

NFTools = {

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
        file_contents = fileText.replace(k, replacementDict[k]);
      }
    }
    return file_contents;
  }
};
