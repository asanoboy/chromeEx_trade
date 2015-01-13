module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['options_src/**/*'],
            tasks: ['exec:compile']
        },
        exec: {
            compile: 'jekyll build -s options_src -d options'
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
};