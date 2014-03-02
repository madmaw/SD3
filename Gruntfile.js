module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            lib: {
                src: ['src/main/ts/**/*.ts', 'src/main/d.ts/**/*.d.ts'],
                dest: 'build/dd.sd3.js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    base_path: 'src/main/ts',
                    sourcemap: true,
                    declaration: true
                }
            },
            unittest: {
                src: ['src/test/ts/**/*.ts', 'src/test/d.ts/**/*.d.ts', 'build/*.d.ts'],
                dest: 'build/dd.sd3.unittest.js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    base_path: 'src/test/ts',
                    sourcemap: true,
                    declaration: true
                }
            }
        },
        qunit: {
            unittest:['unittests.html']
        },
        clean: {
            all:["build"]
        },
        uglify: {
            dist: {
                files: {
                    'build/dd.sd3.min.js': ['build/dd.sd3.js']
                }
            }
        }
    });

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "qunit" task.
    grunt.loadNpmTasks('grunt-contrib-qunit');
    // Load the plugin that provides the "TS" task.
    grunt.loadNpmTasks('grunt-typescript');

    // Default task(s).
    grunt.registerTask('reset', ['clean']);
    grunt.registerTask('build', ['typescript:lib']);
    grunt.registerTask('unittest', ['typescript:unittest', 'qunit']);
    grunt.registerTask('dist', ['typescript:lib', 'uglify']);
    grunt.registerTask('default', ['build']);

};