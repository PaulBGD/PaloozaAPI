module.exports = {
    path: "from-id",
    type: "POST",
    parent: "game",
    description: "Returns a games' data from it's id",
    params: {
        id: {
            type: "integer",
            description: "The games' id"
        }
    },
    example: {
        1: {
            id: 1,
            type: "MCBrawl",
            winner: "a4c2c06f-c35d-42d4-87e8-87d74613ae85"
        }
    },
    handleRequest: function(app, params, connection, callback) {
        if(!params.id || /^-?[0-9]+$/.test(params.id)) {
            return callback('Missing numerical parameter id');
        }
        connection.execute('SELECT `type`.`winner` FROM `palooza`.`game_records` WHERE `game` = ?', [params.id], function(err, rows) {
            if(err) {
                app.logError('Failed to select game from database using id "' + params.id + '"');
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.id] = {
                    id: params.id,
                    type: row.type,
                    winner: row.winner
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied id not found');
            }
        });
    }
};