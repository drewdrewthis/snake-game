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

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				background: true,
				singleRun: false
			}
		},
		sync: {
			main: {
				files: [{
					src: [
						'index.html'
					],
					dest: 'dist',
				}, {
					src: [
						'node_modules/font-awesome/css/font-awesome.min.css',
						'node_modules/bootstrap/dist/css/bootstrap.min.css',
						'node_modules/jquery/dist/jquery.min.js',
						'node_modules/bootstrap/dist/js/bootstrap.min.js'
					],
					dest: 'dist/',
				}],
				pretend: false, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much. 
				verbose: true // Display log messages when copying files 
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
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/js/script.min.js': 'src/**/*.js'
				}
			}
		},
		less: {
			build: {
				files: {
					'dist/css/style.css': 'src/css/style.less'
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
					'dist/css/style.min.css': 'dist/css/style.css'
				}
			}
		},
		reload: {
			port: 8080,
			proxy: {
				host: 'localhost',
			}
		},
		watch: {
			files: ['index.html'],
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
				tasks: ['karma:unit:run'] //NOTE the :run flag
			}
		}
	});

	grunt.registerTask('default', ['sync', 'jshint', 'uglify', 'cssmin', 'less']);
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
	grunt.loadNpmTasks('grunt-sync');
	//grunt.loadNpmTasks('grunt-reload');
};