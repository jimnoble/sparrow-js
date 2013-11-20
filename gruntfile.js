
module.exports = function (grunt)
{
    grunt.initConfig(
    {
        browserify:
        {
            client:
            {
                src: ['./lib/client.js'],

                dest: './lib/content/client.js',

                options:
                {
                    alias: ['./lib/client:client']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify']);
};