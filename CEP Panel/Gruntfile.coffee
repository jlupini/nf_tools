sass = require('node-sass')

module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean: ['client/*', 'host/*', 'server/*', 'CSXS/*']
    sass:
      options:
        implementation: sass
        sourceMap: true
      dist:
        files:
          'client/style.css': 'src/client/style.sass'
    copy:
      clientHTML:
        expand: true
        cwd: 'src/client'
        src: ['*.html']
        dest: 'client/'
      clientJS:
        expand: true
        cwd: 'src/client'
        src: ['*.js']
        dest: 'client/'
      manifest:
        expand: true
        cwd: 'src/CSXS'
        src: ['*.xml']
        dest: 'CSXS/'
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
    watch:
      scripts:
        files: 'src/**'
        tasks: ['coffee', 'sass', 'copy']


  grunt.loadNpmTasks 'grunt-coffeelinter'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-jsdoc'
  grunt.loadNpmTasks 'grunt-sass'

  # Default task(s).
  grunt.registerTask 'default', ['coffee', 'sass', 'copy']
  return
