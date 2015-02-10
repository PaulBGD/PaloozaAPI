module.exports = {
    path: "from-id",
    type: "POST",
    parent: "player",
    description: "Returns a player's data from his id",
    params: {
        id: {
            type: "integer",
            description: "The player's id"
        }
    },
    example: {
        1: {
            id: 1,
            name: "PaulBGD",
            uuid: "a4c2c06f-c35d-42d4-87e8-87d74613ae85"
        }
    },
    handleRequest: function(app, params, connection, callback) {
        if(!params.id || /^-?[0-9]+$/.test(params.id)) {
            return callback('Missing numerical parameter id');
        }
        connection.execute('SELECT `name`,`uuid` FROM `palooza`.`accounts` WHERE `id` = ?', [params.id], function(err, rows) {
            if(err) {
                app.logError('Failed to select player from database using id "' + params.id + '"');
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.id] = {
                    id: params.id,
                    name: row.name,
                    uuid: row.uuid
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied id not found');
            }
        });
    }
};