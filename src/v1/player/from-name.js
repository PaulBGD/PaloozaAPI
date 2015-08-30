module.exports = {
    path: "from-name",
    type: "POST",
    parent: "player",
    description: "Returns a player's data from his name",
    params: {
        name: {
            type: "string",
            description: "The player's name",
            length: {
                max: 16
            },
            required: true
        }
    },
    example: {
        "PaulBGD": {
            id: 1,
            name: "PaulBGD",
            uuid: "a4c2c06f-c35d-42d4-87e8-87d74613ae85",
            faction: "BGD",
            server: "factions",
            time: 373771
        }
    },
    handleRequest: function(_palooza, params, callback) {
        _palooza.database.execute('SELECT `id`,`uuid`,`faction`,`points`,`server`,`time` FROM `palooza`.`accounts` WHERE `name` = ?', [params.name], function(err, rows) {
            if(err) {
                _palooza.debug('Failed to select player from database using name "' + params.name + '"', err);
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.name] = {
                    id: row.id,
                    name: params.name,
                    uuid: row.uuid,
                    faction: row.faction,
                    server: row.server,
                    time: row.time
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied name not found');
            }
        });
    }
};