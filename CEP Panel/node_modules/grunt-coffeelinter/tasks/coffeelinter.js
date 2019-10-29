module.exports = function(grunt) {

    var path = require('path');
    var coffeelint = require('coffeelint')

    grunt.registerMultiTask('coffeelinter', 'Validate coffeescript with coffeelint.', function() {

        var errors = []
        var errorFilesCount = 0;
        var files = this.filesSrc;
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            force: false,
            reportConsole: false,
            reporterOutput: null,
            configFile: null
        });

        // Report coffeelint errors but don't fail the task
        var force = options.force;
        delete options.force;

        // Whether to output the report to a file
        var reporterOutput = options.reporterOutput;
        delete options.reporterOutput;

        // Whether to report lint results to console
        var reportConsole = options.reportConsole
        delete options.reportConsole;

        // Whether to take the config from file
        var configFile = options.configFile
        delete options.configFile;


        if (configFile) {
            var config = grunt.file.readJSON(configFile);
            for (var key in options) {
                config[key] = options[key];
            }
            options = config;
        }

        // Coffeelint the files

        files.forEach(function(file) {
            var fileErrors = coffeelint.lint(grunt.file.read(file), options)
            if(fileErrors.length) {
                errorFilesCount += 1
                errors.push({file: file, fileErrors: fileErrors});
            }
        });

        // report to file or console
        var logError = 'found ' + errors.length + ' error' +  (errors.length > 1 ? 's' : '') +
            ' in ' + errorFilesCount + ' file' + (errorFilesCount.length > 1 ? 's' : '');

        // if no errors, log lint free message and exit
        if (!errors.length) {
            grunt.log.ok(files.length + ' file' + (files.length > 1 ? 's' : '') + ' lint free.');
            return;
        }

        // report error to file
        if(reporterOutput) {
            grunt.log.error(logError);
            var destDir = path.dirname(reporterOutput);
            if (!grunt.file.exists(destDir)) {
                grunt.file.mkdir(destDir);
            }
            grunt.file.write(reporterOutput, JSON.stringify(errors));
            grunt.log.writeln('report available at: ' + reporterOutput);
        }

        // report error to console
        if(reportConsole) {
            errors.forEach(function(error){
                error.fileErrors.forEach(function(fileError) {
                    var status, message;

                    if (fileError.level === 'error') {
                        status = "[error]".red;
                    } else if (fileError.level === 'warn') {
                        status = "[warn]".yellow;
                    } else {
                        return;
                    }

                    message = error.file + ':' + fileError.lineNumber + ' ' + fileError.message +
                        ' (' + fileError.rule + ')';

                    grunt.log.writeln(status + ' ' + message);
                });
            });
        }
        // abort all tasks if lint failed
        if (errors.length && !force) {
            grunt.fail.warn(logError ,3)
        }
    });
};
