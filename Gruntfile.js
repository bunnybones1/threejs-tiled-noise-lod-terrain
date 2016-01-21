'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'dev/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'dev/spec/**/*.js'


module.exports = function(grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // configurable paths
    config: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp'
    },
    banner: '/*!\n' +
            ' * <%= pkg.name %>-<%= pkg.version %>\n' +
            ' * <%= pkg.author %>\n' +
            ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' */\n\n',
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      browserify: {
        files: ['<%= config.src %>/**/*.js'],
        tasks: ['browserify:dev']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        tasks: ['copy:examples'],
        files: [
          '<%= config.src %>}/**/*.{js}',
          'examples/**/*.{js,html}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35730,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.tmp %>',
            '<%= config.src %>',
            'examples'
          ]
        }
      },
      dev: {
        options: {
          base: ['<%= config.tmp %>']
        }
      },
      dist: {
        options: {
          open: true,
          base: '',
          livereload: false
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.tmp %>',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '<%= config.tmp %>'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.src %>/scripts/**/*.js'
      ]
    },
    browserify: {
      dev: {
        src: ['<%= config.src %>/main.js'],
        dest: '<%= config.tmp %>/scripts/Vaca.js',
        options: {
          debug: true
        }
      },
      dist: {
        src: ['<%= config.src %>/main.js'],
        dest: '<%= config.dist %>/Vaca.js',
        options: {
          debug: false
        }
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.webp'
          ]
        }]
      },
      examples: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'examples',
          dest: '<%= config.tmp %>/examples/',
          src: '**/*.*'
        },
        {
          expand: true,
          dot: true,
          cwd: 'lib',
          dest: '<%= config.tmp %>/lib/',
          src: '**/*.*'
        },
        {
          expand: true,
          dot: true,
          cwd: 'assets',
          dest: '<%= config.tmp %>/assets/',
          src: ['**/*.*', '!.SyncArchive','!.SyncID', '!.SyncIgnore']
        }]
      }
    },

    concurrent: {
      server: [
        'browserify:dev'
      ],
      dev: [
        'jshint',
        'browserify:dev'
      ],
      dist: [
        'browserify'
      ]
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('dev', [
    'clean:server',
    'copy:examples',
    'concurrent:dev',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    //'uglify',
    'copy:dist',
    //'rev',
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'dev',
    'build'
  ]);

};
