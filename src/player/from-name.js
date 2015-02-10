module.exports = {
    path: "from-name",
    type: "POST",
    parent: "player",
    description: "Returns a player's data from his name",
    params: {
        name: {
            type: "string",
            description: "The player's name"
        }
    },
    example: {
        "PaulBGD": {
            id: 1,
            name: "PaulBGD",
            uuid: "a4c2c06f-c35d-42d4-87e8-87d74613ae85"
        }
    },
    handleRequest: function(app, params, connection, callback) {
        if(!params.name || params.name.length > 16) {
            return callback('Missing parameter name.');
        }
        connection.execute('SELECT `id`,`uuid` FROM `palooza`.`accounts` WHERE `name` = ?', [params.name], function(err, rows) {
            if(err) {
                app.logError('Failed to select player from database using name "' + params.name + '"');
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.name] = {
                    id: row.id,
                    name: params.name,
                    uuid: row.uuid
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied name not found');
            }
        });
    }
};