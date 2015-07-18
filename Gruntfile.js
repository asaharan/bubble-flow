module.exports = function(grunt) {
	grunt.initConfig({
		bower_concat:{
		  all:{
		    dest:"build/bower.js"
		  }
		},
		watch:{
			scripts:{
				files:['js/*.js'],
				tasks:['concat:dist']
			},
			css:{
				files:['sass/*.scss','sass/*.css'],
				tasks:['sass:dist']
			}
		},
		concat: {
			options: {
				banner:"/*!\n * BubbleUp\n * http://github.com/asaharan/bubbleUp\n * @licence MIT\n*/\n'use strict';\n",
				separator: ';\n',
                stripBanner:true,
                process: function(src, filepath) {
                    return '/*!\n * ' + filepath + '\n*/\n' + src;
                }
		    },
		    dist: {
		    	src: ['js/grid.js','js/input_manager.js','js/html_actuator.js','js/tile.js','js/game_manager.js','js/application.js'],
		      	dest: 'build/game.js',
		    },
		},
        uglify:{
            options: {
                mangle: false
            },
            my_target:{
                files: {
                    'build/game.min.js': ['build/game.js']
                }
            }
        },
		sass:{
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'build/game.css': 'sass/game.scss'
				}
			}
		},
	});
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-concat');
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default',['sass','bower_concat','concat','uglify','watch'])
}