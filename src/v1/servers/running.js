var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "running",
    type: "POST",
    parent: "servers",
    description: "Returns a list of all running minigames",
    params: {},
    example: [
        {
            server: "mcbrawl1",
            game: "mcbrawl",
            players: 2,
            running: false
        },
        {
            server: "mcbrawl2",
            game: "mcbrawl",
            players: 6,
            running: true
        }
    ],
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT `server`,`game`,`players`,`running`,`map`,`mode` FROM `games` WHERE `test` = 0 AND `ready` = 1', function (err, rows) {
            if (err) {
                debug('Failed to select running minigames from database"', err);
                return callback('Internal error occurred');
            }
            var array = [];
            var length = rows.length;
            while (length--) {
                var row = rows[length];
                row.running = !!row.running[0]; // since we store it as a bit, convert it
                array[length] = row;
            }
            callback(undefined, array);
        });
    }
};
