
var async = require('async');

var Handlebars = require('handlebars');

require('./extensions');

var internal =
{
    bindHashChange: function ()
    {
        $(window).on('hashchange', function ()
        {
            internal.loadRouteFromHash();
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
        var route = internal.getRouteFromHash();

        module.exports.loadRoute(
            route,
            function (result)
            {
            });
    },

    getViewUrlFromRoute: function (route)
    {
        if (route == '') route = '_';

        return 'views/' + route + '.html';
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
        return $('[data-frame=\'main\']').first();
    }
};

module.exports =
{
    onError: function (error)
    {
        alert('ERROR ' + error);
    },

    start: function ()
    {
        internal.bindHashChange();

        internal.loadRouteFromHash();
    },

    loadRoute: function (route)
    {
        async.parallel(
            {
                model: function (end)
                {
                    module.exports.getModel(route, function (result)
                    {
                        end(null, result);
                    });
                },

                view: function (end)
                {
                    module.exports.getView(route, function (result)
                    {
                        end(null, internal.compileView(result));
                    });
                }
            },
            function (error, results)
            {
                var output = results.view(results.model);

                internal.getMainFrame().html(output);
            });
    },

    getView: function (route, success)
    {
        $.ajax(
            {
                url: internal.getViewUrlFromRoute(route),

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
                module.exports.onError(textStatus + ' ' + errorThrown);
            });
    },

    getModel: function (route, success)
    {
        $.ajax(
            {
                url: internal.getModelUrlFromRoute(route),

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
                module.exports.onError(textStatus + ' ' + errorThrown);
            });
    }
};