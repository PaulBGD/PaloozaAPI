var fs = require('fs');
var path = require('path');

var ejs = require('ejs');
var express = require('express');
var router = express.Router();

var methods = [
    'faction/factions',
    'faction/by-name',

    'game/from-id',
    'game/from-winner',

    'player/from-id',
    'player/from-name',
    'player/from-uuid',
    'player/data/ranks',
    'player/auth/authenticate',

    'servers/servers',
    'servers/running',
    'servers/chat/from-user',
    'servers/chat/latest',
    'servers/chat/send'
];

var data = [];

var nav = {};
methods.forEach(function(method) {
    var object = require('../v1/' + method);
    data.push(object);
    var parent = object.parent.split('/')[0];
    if (nav[parent]) {
        nav[parent].push(object);
    } else {
        nav[parent] = [object];
    }
});

var render = ejs.render(fs.readFileSync(path.join(process.cwd(), 'views', 'index.ejs')).toString(), {methods: data, nav: nav});

router.get('/', function (req, res) {
    res.send(render);
});

module.exports = router;
