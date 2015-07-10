var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

var render = fs.readFileSync(path.join(process.cwd(), 'views', 'live.ejs')).toString();

router.get('/image.png', function (req, res, next) {
    res.set('Content-Type', 'image/png');
    fs.readFile(path.join(process.cwd(), 'traffic.png'), function (err, image) {
        if (err) {
            return next(err);
        }
        res.send(image);
    });
});

router.get('/', function (req, res) {
    res.send(render);
});

module.exports = router;
