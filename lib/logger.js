
var level = 6;

var logger = require('caterpillar').createLogger({ level: level });

var filter = require('caterpillar-filter').createFilter();

var human = require('caterpillar-human').createHuman();

if(typeof window === 'undefined') 
{
    logger
        .pipe(filter)
        .pipe(human)
        .pipe(process.stdout);

    logger
        .pipe(require('fs')
        .createWriteStream('./sparrow.log', { flags: 'a' }));
}
else
{
    logger
        .pipe(filter)
        .pipe(human)
        .pipe(require('caterpillar-browser').createBrowser());
}

module.exports = logger;