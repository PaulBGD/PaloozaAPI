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

var data = [];
methods.forEach(function(method) {
    data.push(require('../v1/' + method));
});

router.get('/', function (req, res) {
    res.render('index', {methods: data});
});

module.exports = router;
