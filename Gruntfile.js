module.exports = function(grunt) {

    grunt.initConfig({
        watchify: {
            options: {
                debug: true
            },
            dev: {
                src: './app.js',
                dest: 'bundle.js'
            },
            dist: {
                src: './src/bowerify.js',
                dest: 'xml-display-component.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-watchify');

    grunt.registerTask('dist', ['watchify:dist']);
    grunt.registerTask('default', ['watchify:dev:keepalive']);
};
