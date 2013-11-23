
var logger = require('./logger');

var async = require('async');

var Handlebars = require('handlebars');

require('./extensions');

var sparrow =
{
    logger: logger,

    bindHashChange: function ()
    {
        $(window).on('hashchange', function ()
        {
            sparrow.loadRouteFromHash();
        });
    },

    getRouteFromHash: function ()
    {
        var hash = window.location.hash;

        if (hash.startsWith('#!')) return hash.substring(2);

        if (hash.startsWith('#')) return hash.substring(1);
        
        return hash;
    },

    loadRouteFromHash: function ()
    {
        var route = sparrow.getRouteFromHash();

        this.loadRoute(
            route,
            function (result)
            {
            });
    },

    getViewUrlFromRoute: function (route)
    {
        if (route == '') return 'views/view.html';

        return 'views/' + route + '/view.html';
    },

    getModelUrlFromRoute: function (route)
    {
        return 'service/' + route;
    },

    compileView: function (view)
    {
        return Handlebars.compile(view);
    },

    getMainFrame: function ()
    {
        return $('main');
    },

    onError: function (error)
    {
        alert('ERROR ' + error);
    },

    loadRoute: function (route)
    {
        async.parallel(
            {
                model: function (end)
                {
                    sparrow.getModel(route, function (result)
                    {
                        end(null, result);
                    });
                },

                view: function (end)
                {
                    sparrow.getView(route, function (result)
                    {
                        end(null, sparrow.compileView(result));
                    });
                }
            },
            function (error, results)
            {
                var output = results.view(results.model);

                sparrow.getMainFrame().html(output);
            });
    },

    getView: function (route, success)
    {
        $.ajax(
            {
                url: sparrow.getViewUrlFromRoute(route),

                type: 'GET'
            })
            .done(function (
                response,
                textStatus,
                jqXhr)
            {
                success(response);
            })
            .fail(function (
                jqXhr,
                textStatus,
                errorThrown)
            {
                sparrow.onError('getView failed for ' + route + '. ' + textStatus + ' ' + errorThrown);
            });
    },

    getModel: function (route, success)
    {
        $.ajax(
            {
                url: sparrow.getModelUrlFromRoute(route),

                type: 'GET'
            })
            .done(function (
                response,
                textStatus,
                jqXhr)
            {
                success(response);
            })
            .fail(function (
                jqXhr,
                textStatus,
                errorThrown)
            {
                sparrow.onError(
                    'getModel failed for \'' + route + '\' | ' + 
                    jqXhr.response + ' | ' +
                    jqXhr.responseText + ' | ' +
                    jqXhr.status + ' | ' + 
                    jqXhr.statusText + ' | ' + 
                    textStatus + ' | ' + 
                    errorThrown);
            });
    }
};

sparrow.bindHashChange();

sparrow.loadRouteFromHash();

console.log('sparrow initialized.');

module.exports = sparrow;

