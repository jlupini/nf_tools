module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean: ['client/*', 'host/*', 'server/*']
    coffee:
      compileClient:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'src/client'
        src: ['*.coffee']
        dest: 'client/'
        ext: '.js'
      compileHost:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'src/host'
        src: ['*.coffee']
        dest: 'host/'
        ext: '.jsx'
      compileServer:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'src/server'
        src: ['*.coffee']
        dest: 'server/'
        ext: '.js'
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
        src: ['superestclasses/*', 'superclasses/*', 'subclasses/*']
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
  grunt.registerTask 'default', ['coffee']
  return
