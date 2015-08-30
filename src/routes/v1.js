var path = require('path');

var express = require('express');
var router = express.Router();

var methods = [
    'faction/factions',
    'faction/by-name',

    'game/from-id',
    'game/from-winner',
    'game/info/maps',
    'game/info/modes',

    'player/from-id',
    'player/from-ids',
    'player/from-name',
    'player/from-uuid',
    'player/stats/global',
    'player/data/friends',
    'player/data/traffic',
    'player/data/ranks',
    'player/data/punishments',
    'player/auth/authenticate',

    'servers/servers',
    'servers/running',
    'servers/players',
    'servers/traffic',
    'servers/punishments',
    'servers/chat/from-user',
    'servers/chat/latest',
    'servers/chat/send'
];

methods.forEach(function (method) {
    var object = require(path.join(process.cwd(), './src/v1', method));
    var request = function (req, res) {
        var params;
        if (req.body.length > 0) {
            params = req.body;
        } else {
            params = req.query;
        }
        for (var property in object.params) {
            var param = object.params[property];
            if (param.required && !params[property]) {
                return res.json({error: true, message: 'Missing parameter ' + property});
            }
            var value = params[property];
            if (param.type == 'string') {
                value = String(value);
                if (param.length) {
                    if (typeof param.length == 'object') {
                        if (param.length.min) {
                            if (value.length < param.length.min) {
                                return res.json({error: true, message: 'Parameter ' + property + ' has a minimum length of ' + param.length.min});
                            }
                        }
                        if (param.max) {
                            if (value.length > param.length.max) {
                                return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.length.max});
                            }
                        }
                    } else if (typeof param.length == 'number') {
                        if (value.length > param.length) {
                            return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.length.max});
                        }
                    }
                }
            } else if (param.type == 'integer') {
                if (typeof value == 'string') {
                    if (!/^-?[0-9]+$/.test(value)) {
                        return res.json({error: true, message: 'Parameter ' + property + ' must be an integer'});
                    }
                    value = parseInt(value);
                    if (param.length) {
                        if (typeof param.length == 'object') {
                            if (param.length.min) {
                                if (value < param.length.min) {
                                    return res.json({error: true, message: 'Parameter ' + property + ' has a minimum length of ' + param.length.min});
                                }
                            }
                            if (param.length.max) {
                                if (value > param.length.max) {
                                    return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.length.max});
                                }
                            }
                        } else if (typeof param.length == 'number') {
                            if (value > param.length) {
                                return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.length});
                            }
                        }
                    }
                }
            }
        }
        object.handleRequest(global._palooza, params, function (err, response) {
            if (err) {
                return res.json({error: true, message: err});
            }
            return res.json(response);
        })
    };
    router.use('/' + object.parent + '/' + object.path, request);
    router.use('/' + object.parent + '/' + object.path + '.json', request); // for things that require the extension
});

var data = [];
methods.forEach(function (method) {
    data.push(require('../v1/' + method));
});

router.use('/methods', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 3));
});

router.use('*', function (req, res) {
    res.json({
        error: true,
        message: 'Method not found'
    });
});

module.exports = router;
