module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadTasks('tasks');

  var processedConstants = Object.create(null);
  var rawConstants = grunt.file.readJSON('src/constants.json');

  for (var c in rawConstants) {
    processedConstants['__PW_' + c] = rawConstants[c];
  }

  var files = {
    engine: [
      '<%= dirs.engine %>/objects.js',
      '<%= dirs.engine %>/utils.js',
      '<%= dirs.engine %>/events.js',
      '<%= dirs.engine %>/entities.js',
      '<%= dirs.engine %>/systems.js',
      '<%= dirs.engine %>/input.js',
      '<%= dirs.engine %>/rendering.js',
    ],
    game: [
      '<%= dirs.game %>/dungeon.js',
      '<%= dirs.game %>/states.js',
      '<%= dirs.game %>/main.js',
      '<%= dirs.game %>/components.js',
      '<%= dirs.game %>/systems.js',
    ],
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      build: 'dist',
      engine: 'src/engine',
      game: 'src/game',
    },
    clean: {
      build: ['dist/'],
    },
    jshint: {
      options: {
        '-W018': true,
        '-W120': true,
      },
      files: ['Gruntfile.js', '<%= dirs.engine %>/*.js', '<%= dirs.game %>/*.js'],
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['dev'],
    },
    compress: {
      dist: {
        options: {
          archive: 'dist/pixelwars.zip',
          mode: 'zip',
          level: 9,
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['pixelwars.min.js', 'index.html']},
          {expand: true, flatten: true, src: ['assets/*.png']},
        ],
      },
    },
    concat: {
      dist: {
        options: {
          banner: "var Pixelwars = (function(window, document, Math) {\n",
          footer: "return Pixelwars;\n})(window, document, Math)\n",
        },
        files: {
          'dist/pixelwars.js': [files.engine, files.game],
        },
      },
    },
    constants: {
      dev: {
        options: {
          namespace: '__PW_',
        },
        files: {
          'dist/constants.js': ['src/constants.json', 'src/constants.dev.json'],
        },
      },
    },
    uglify: {
      dist: {
        options: {
          report: 'min',
          compress: {
            global_defs: processedConstants,
          },
        },
        files: {
          'dist/pixelwars.min.js': ['dist/pixelwars.js'],
        },
      },
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          removeComments: true,
        },
        files: {
          'dist/index.html': 'src/index.html',
        },
      },
    },
  });

  grunt.registerTask('dev', ['jshint', 'constants']);
  grunt.registerTask('package', ['concat', 'uglify', 'htmlmin', 'compress']);

  grunt.registerTask('default', ['clean', 'dev', 'package']);

};