module.exports = {
    path: "from-uuid",
    type: "POST",
    parent: "player",
    description: "Returns a player's data from his uuid",
    params: {
        uuid: {
            type: "string",
            description: "The player's uuid"
        }
    },
    example: {
        "a4c2c06f-c35d-42d4-87e8-87d74613ae85": {
            id: 1,
            name: "PaulBGD",
            uuid: "a4c2c06f-c35d-42d4-87e8-87d74613ae85"
        }
    },
    handleRequest: function(app, params, connection, callback) {
        if(!params.uuid || params.uuid.length != 36) {
            return callback('Missing parameter uuid. Make sure your UUID includes dashes');
        }
        connection.execute('SELECT `name`,`uuid` FROM `palooza`.`accounts` WHERE `uuid` = ?', [params.uuid], function(err, rows) {
            if(err) {
                app.logError('Failed to select player from database using uuid "' + params.uuid + '"');
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.uuid] = {
                    id: row.id,
                    name: row.name,
                    uuid: params.uuid
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied uuid not found');
            }
        });
    }
};