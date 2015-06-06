var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    console.log(JSON.stringify(req.body.text));
    var parameters = (req.body.text || '').split(' ');
    if (parameters.length === 0) {
        res.send('Available subcommands: servers');
    } else if (parameters[0].toLowerCase() == 'servers') {
        _palooza.database.execute('SELECT * FROM `servers`', function (err, rows) {
            if (err) {
                debug('Failed to select servers from database"', err);
                return 'Internal error occurred';
            }
            var arr = [];
            rows.forEach(function (row) {
                arr.push(row.server + ' ' + row.players + ' Players');
            });
            res.send(arr.join('\n'));
        });
    } else {
        res.send('Invalid subcommand. Type /palooza for help.');
    }
});

module.exports = router;
