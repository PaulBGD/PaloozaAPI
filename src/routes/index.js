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

    'servers/servers',
    'servers/running'
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

router.get('/', function (req, res) {
    res.render('index', {methods: data, nav: nav});
});

module.exports = router;
