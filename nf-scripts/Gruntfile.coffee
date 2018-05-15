module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean: ['build/*']
    coffeelinter:
      options:
        reportConsole: yes
      target:
        ['src/class/*.coffee']
    coffee:
      compilePanels:
        expand: true
        flatten: true
        cwd: 'src/panel'
        src: ['*']
        dest: 'build/'
        ext: '.jsx'
      compileAEScripts:
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
      compileObjectModel:
        options:
          bare: yes
        files:
          'build/objectModel.jsx': 'src/class/objectModel/*.coffee'
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

  grunt.loadNpmTasks 'grunt-coffeelinter'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Default task(s).
  grunt.registerTask 'default', ['coffee', 'copy']
  return
