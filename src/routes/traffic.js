var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

var render = fs.readFileSync(path.join(process.cwd(), 'views', 'live.ejs')).toString();

router.get('/', function (req, res) {
    res.send(render);
});

module.exports = router;
