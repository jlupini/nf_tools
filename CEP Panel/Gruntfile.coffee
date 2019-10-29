module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean: ['client/*', 'host/*', 'server/*']
    sass:
      options:
        implementation: sass
        sourceMap: true
      dist:
        files:
          'client/style.css': 'src/client/style.sass'
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
        tasks: ['coffee', 'sass']


  grunt.loadNpmTasks 'grunt-coffeelinter'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-jsdoc'
  grunt.loadNpmTasks 'grunt-sass'

  # Default task(s).
  grunt.registerTask 'default', ['coffee']
  return
