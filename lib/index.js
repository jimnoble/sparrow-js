
var logger = require('./logger');

module.exports =
{
    start: function (config)
    {
        var appRoot = process.cwd();

        var http = require('http');

        http.globalAgent.maxSockets = 100;

        logger.log('Starting HTTP server...');

        var express = require('express');

        var application = express();

        application.use(express.bodyParser());

        application.use('/', express.static(appRoot + '/content'));

        application.use('/', express.static(__dirname + '/content'));

        var router = require('./router');

        var serviceRequestHandler = function (request, response)
        {
            logger.log(request.method + ' ' + request.url);

            try
            {
                router.tryRoute(
                    request,
                    response,
                    function success(error, result)
                    {
                        if(error)
                        {
                            logger.log('error', 'An error occurred while handling a request.', error);

                            response
                                .status(500)
                                .send('An error occurred');
                        }
                        else
                        {
                            response.send(result);
                        }                        
                    },
                    function failure(message)
                    {
                        response
                            .status(404)
                            .send('Not found');
                    });
            }
            catch (ex)
            {
                logger.log('error', 'Error on response.', ex);

                throw ex;
            }
        }

        application.delete('/service/*', serviceRequestHandler);

        application.get('/service/*', serviceRequestHandler);

        application.post('/service/*', serviceRequestHandler);

        application.put('/service/*', serviceRequestHandler);

        var port = 1337;

        application.listen(port);

        logger.log('HTTP server listening on port ' + port + '.');
    }
};