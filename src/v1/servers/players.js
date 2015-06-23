var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "players",
    type: "POST",
    parent: "servers",
    description: "Returns a list of all servers and their players",
    params: {},
    example: {
        lobby: [
            1,
            6
        ],
        factions: [
            51,
            307,
            12,
            52
        ]
    },
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT `accounts`.`id`, `servers`.`server` FROM `accounts`, `servers` WHERE `accounts`.`server` = `servers`.`server`', function (err, rows) {
            if (err) {
                debug('Failed to select servers from database"', err);
                return callback('Internal error occurred');
            }
            var object = {};
            var length = rows.length;
            while (length--) {
                var row = rows[length];
                var list = object[row.server];
                if (list) {
                    list.push(row.id);
                } else {
                    list = [row.id];
                    object[row.server] = list;
                }
            }
            callback(undefined, object);
        });
    }
};
