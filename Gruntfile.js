// Gruntfile.js
// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({
    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    processhtml: {
      options: {

      },
      dist: {
        files: {
          'dist/index.html': ['index.html']
        }
      },
      dev: {
        files: {
          'src/index.html': ['index.html']
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true,
        singleRun: false
      }
    },
    // all of our configuration will go here
    jshint: {
      options: {
        //asi: true,
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },
      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', 'src/**/*.js']
    },
    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
        mangle: false
      },
      build: {
        files: [{
          expand: true,
          src: '*.js',
          dest: 'dist/js',
          cwd: 'src/js',
          ext: '.min.js'
        }]
      }
    },
    less: {
      build: {
        files: {
          'src/css/style.css': 'src/css/style.less'
        }
      }
    },
    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/css/style.min.css': 'src/css/style.css'
        }
      }
    },
    imagemin: { // Task
      options: { // Target options
        optimizationLevel: 3
      },
      dynamic: { // Another target
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: 'src/images', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,ico}'], // Actual patterns to match
          dest: 'dist/images/' // Destination path prefix
        }]
      }
    },
    watch: {
      index: {
        files: ['index.html'],
        tasks: ['processhtml']
      },
      // for images
      img: {
        files: ['src/images/**/*.{png,jpg,gif,ico}'],
        tasks: ['newer:imagemin']
      },
      // for stylesheets, watch css and less files
      // only run less and cssmin
      stylesheets: {
        files: ['src/**/*.css', 'src/**/*.less'],
        tasks: ['less', 'cssmin']
      },
      // for scripts, run jshint and uglify
      scripts: {
        files: 'src/**/*.js',
        tasks: ['jshint', 'uglify']
      },
      karma: {
        files: ['src/**/*.js', 'tests/**/*.js'],
        //tasks: ['karma:unit:run'] //NOTE the :run flag
      }
    }
  });

  grunt.registerTask('default', ['newer:imagemin', 'processhtml', 'jshint', 'uglify', 'cssmin', 'less']);
  grunt.registerTask('test', ['karma']);

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
};
