var path = require('path');

var express = require('express');
var router = express.Router();

var methods = [
    'game/from-id',
    'game/from-winner',

    'player/from-id',
    'player/from-name',
    'player/from-uuid',
    'player/data/ranks'
];

methods.forEach(function (method) {
    var object = require(path.join(process.cwd(), './src/v1', method));
    router.use('/' + path.join(object.parent, object.path).replace(/\\/g, '/'), function (req, res) {
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
                                return res.json({error: true, message: 'Parameter ' + property + ' has a minimum length of ' + param.min});
                            }
                        }
                        if (param.max) {
                            if (value.length > param.length.max) {
                                return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.max});
                            }
                        }
                    } else if (typeof param.length == 'number') {
                        if (value.length > param.length) {
                            return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.max});
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
                                    return res.json({error: true, message: 'Parameter ' + property + ' has a minimum length of ' + param.min});
                                }
                            }
                            if (param.max) {
                                if (value > param.length.max) {
                                    return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.max});
                                }
                            }
                        } else if (typeof param.length == 'number') {
                            if (value > param.length) {
                                return res.json({error: true, message: 'Parameter ' + property + ' has a max length of ' + param.max});
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
    });
});

router.use('*', function (req, res) {
    res.json({
        error: true,
        message: 'Method not found'
    });
});

router.get('*', function (req, res) {
    res.json({hi: "hi"});
});

module.exports = router;
