module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean: ['build/*', 'doc/*']
    jsdoc:
      dist:
        src: [
          'build/objectModel.jsx'
          'build/utilFunctions.jsx'
          'build/extensions.jsx'
          'build/easingEquations.jsx'
          'build/NFProject.jsx'
          'build/NFTools.jsx'
          'build/NFPDFManager.jsx'
          'build/Rect.jsx'
        ]
        options:
          destination: 'doc'
          template : "node_modules/@pixi/jsdoc-template",
    coffeelinter:
      options:
        reportConsole: yes
      target:
        ['src/class/*.coffee']
    coffee:
      compileExpressions:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'src/expressions'
        src: ['*']
        dest: 'build/expressions'
        ext: '.js'
      compilePanels:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'src/panel'
        src: ['*']
        dest: 'build/'
        ext: '.jsx'
      compileAEScripts:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'src/ae_scripts'
        src: ['*']
        dest: 'build/'
        ext: '.jsx'
        rename: (dest, src) ->
          dest + "nf_" + src
      compileUtilities:
        expand: true
        flatten: true
        cwd: 'src/util'
        src: ['*']
        dest: 'build/'
        ext: '.jsx'
        options:
          bare: yes
      compilePDFTools:
        expand: true
        flatten: true
        cwd: 'src/pdf_tools'
        src: ['*']
        dest: 'build/pdf_tools'
        ext: '.js'
        options:
          bare: yes
      compileObjectModel:
        options:
          bare: true
        expand: true
        flatten: false
        cwd: 'src/class'
        src: ['superestclasses/*', 'superclasses/*', 'subclasses/*', 'subsubclasses/*']
        dest: 'build/'
        ext: '.jsx'
        rename: (dest, src) ->
          dest + "objectModel.jsx"
    copy:
      oldScripts:
        expand: true
        cwd: 'src/old_scripts'
        src: ['**']
        dest: 'build/'
    watch:
      scripts:
        files: 'src/**'
        tasks: ['coffee', 'copy']
      scriptsDocs:
        files: 'src/**'
        tasks: ['coffee', 'copy', 'jsdoc']

  grunt.loadNpmTasks 'grunt-coffeelinter'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-jsdoc'

  # Default task(s).
  grunt.registerTask 'default', ['coffee', 'copy']
  return
