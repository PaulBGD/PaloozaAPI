module.exports = {
    path: "from-id",
    type: "POST",
    parent: "player",
    description: "Returns a player's data from his id",
    params: {
        id: {
            type: "integer",
            description: "The player's id",
            required: true
        }
    },
    example: {
        1: {
            id: 1,
            name: "PaulBGD",
            uuid: "a4c2c06f-c35d-42d4-87e8-87d74613ae85",
            faction: "BGD",
            server: "factions",
            time: 373771
        }
    },
    handleRequest: function(_palooza, params, callback) {
        _palooza.database.execute('SELECT `name`,`uuid`,`faction`,`points`,`server`,`time` FROM `palooza`.`accounts` WHERE `id` = ?', [params.id], function(err, rows) {
            if(err) {
                _palooza.debug('Failed to select player from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.id] = {
                    id: params.id,
                    name: row.name,
                    uuid: row.uuid,
                    faction: row.faction,
                    server: row.server,
                    time: row.time
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied id not found');
            }
        });
    }
};
