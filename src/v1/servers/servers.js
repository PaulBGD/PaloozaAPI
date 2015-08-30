module.exports = {
    path: "servers",
    type: "POST",
    parent: "servers",
    description: "Returns a list of all servers",
    params: {},
    example: [
        {
            server: "lobby",
            players: 3,
            uptime: 18713
        },
        {
            server: "faction",
            players: 5,
            uptime: 113557
        }
    ],
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT * FROM `servers`', function (err, rows) {
            if (err) {
                _palooza.debug('Failed to select servers from database"', err);
                return callback('Internal error occurred');
            }
            callback(undefined, rows);
        });
    }
};
