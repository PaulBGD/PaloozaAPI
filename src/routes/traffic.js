var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

router.get('/image.png', function (req, res) {
    res.set('Content-Type', 'image/png');
    res.send(_palooza.image);
});

var render = fs.readFileSync(path.join(process.cwd(), 'views', 'live.ejs')).toString();

router.get('/live', function (req, res) {
    res.send(render);
});

module.exports = router;
