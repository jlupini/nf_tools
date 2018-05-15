# grunt-coffeelinter

> A grunt plugin for coffeelint your coffeescript projects.

grunt-coffeelinter is a [coffeelint](http://www.coffeelint.org) based grunt task. It is a grunt multitask. It supports loading configuration from external file like in jshint, report output as json and/or to the console.


## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-coffeelinter --save-dev
```

Add this line to your project's `Gruntfile.coffee`:

```coffee
grunt.loadNpmTasks 'grunt-coffeelinter'
```

## The "coffeelinter" task

### Overview
In your project's Gruntfile, add a section named `coffeelinter`.

```coffee
grunt.initConfig
  coffeelinter: 
    options: 
      # Task-specific options go here.
   
    target: 
      # Target-specific file lists and/or options go here.
    
```

### Options

#### options.force
Type: `Boolean`
Default value: false

Set `force` to `true` to report CoffeeLint errors but not fail the task.


#### options.reportConsole
Type: `Boolean`
Default value: false

Set `reportConsole` to `true` to report CoffeeLint errors to the console.


#### options.reporterOutput
Type: `String` or `null`
Default value: null

Specify a filepath to output the results of a reporter. the report is generated as json. 
Set to null or false if you don't want to generate a json report.


#### options.configFile
Type: `String` or `null`
Default value: null

Specify a filepath to coffeelint configuration. For available options see [coffeelint homepage](http://www.coffeelint.org/#options).
The file must be valid JSON and looks something like this:

```json
{
    "arrow_spacing"                      : {"level": "warn"},
    "camel_case_classes"                 : {"level":"warn"},
    "coffeescript_error"                 : {"level":"error"},
    "colon_assignment_spacing"           : {"level":"warn"},
    "no_trailing_whitespace"             : {"level":"warn"},
    "no_unnecessary_fat_arrows"          : {"level":"warn"},
    "non_empty_constructor_needs_parens" : {"level":"warn"},
    "space_operators"                    : {"level":"warn"}
}
```

An alternative to load configuration from external file is to pass it in the options:

```coffee
    coffeelinter:
      options:
        force: yes
        'no_trailing_semicolons':
          'level': 'error'
        'camel_case_classes':                 
          'level': 'warn'
        'coffeescript_error':                 
          'level':'error'

      target: ['path/to/entry.coffee']
```
*Be aware that `.coffeelintrc` (or any other external config file) settings are not merged with your Grunt options.*

### Usage Examples

#### Basic usage
In this example, the default options are used. The files array can have many src/dest file objects. src path glob patterns are supported by [minimatch](https://github.com/isaacs/minimatch). In this example no config is specified so default coffeelint configuration is assumed.

```coffee
    coffeelinter:
      target: ['path/to/some.coffee', 'path/to/other.coffee']
```

#### Custom Options
example with all the options
```coffee
    coffeelinter:
      options:
        force: yes
        configFile: '.coffeelintrc'
        reportConsole: no
        reporterOutput: 'coffeelinter/report.json'
      target: ['path/to/some.coffee', 'path/to/other.coffee']
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## Issues
Please use the [github issues list](https://github.com/xl8/grunt-coffeelinter/issues) to report any issues. If possible, please include a link to an open github repo with the smallest failing example of your issue. Even better, fork the project, create a failing test case and issue a pull request with the issue number referenced in the pull request. Super better, fork the project create a failing test case, fix the problem, and issue a pull request with the test and fix referencing the issue number. 
