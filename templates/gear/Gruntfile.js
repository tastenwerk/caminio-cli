var fs = require('fs');

module.exports = function(grunt) {

  /*jshint scripturl:true*/

  var gearName = 'MODNAME';
  
  var uglifyFiles = {};
  uglifyFiles['build/javascripts/'+gearName+'.min.js'] = [
    'assets/javascripts/'+gearName+'/**/*.js'
  ];

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    gearName: gearName,

    clean: {
      build: ['build']
    },

    mochaTest: {
      test: {
        options: {
          globals: ['should'],
          timeout: 3000,
          bail: true,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        },
        src: ['test/**/*.test.js']
      }
    }, 

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        //version: '<%= pkg.version %>',
        //url: '<%= pkg.homepage %>',
        options: {
          exclude: 'test,node_modules,public/javascripts/vendor',
          paths:  '.',
          outdir: './doc'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <YOUR COMPANY HERE> \n' +
            '* Available via the MIT license.\n' +
            '* see: http://opensource.org/licenses/MIT for blueprint.\n' +
            '*/\n'
      },
      build: {
        files: uglifyFiles
      }
    },

    copy: {
      img: {
        files: [
          { 
            expand: true,
            cwd: 'assets/images',
            src: ['**/*'], 
            dest: 'build/images/'
          }
        ]
      }
    },

    cssmin: {
      add_banner: {
        options: {
          banner: '/* camin.io */'
        },
      },
      combine: {
        files: {
          'build/stylesheets/<%= gearName %>.min.css': [ 'assets/stylesheets/<%= gearName %>-static/*.css', 
                                                    'assets/stylesheets/<%= gearName %>/*.css' ],
          'build/stylesheets/caminio-auth.min.css': [ 'assets/stylesheets/<%= gearName %>/authorization.css' ]
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'api/**/*.js', 'config/**/*.js', 'assets/javascripts/<%= gearName %>/app'],
      options: {
        "laxcomma": true
      }
    },

  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'runs all tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testUnit', 'runs only unit tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.unit.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testModels', 'runs only model tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*model.unit.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testApi', 'runs only api tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.api.*.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('clearLogs', function(){
    if( fs.existsSync('test.log') )
      fs.unlinkSync('test.log');
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'cssmin',
    'copy:img',
    'uglify'
  ]);

  grunt.registerTask('docs', 'yuidoc');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // Default task(s).
  grunt.registerTask('default', ['test']);

};
