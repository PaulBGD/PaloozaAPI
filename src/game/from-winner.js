module.exports = {
    path: "from-winner",
    type: "POST",
    parent: "game",
    description: "Returns all the games won by the specified winner",
    params: {
        id: {
            type: "integer",
            description: "The player's id"
        }
    },
    example: {
        games: [
            {
                id: 1,
                type: "MCBrawl"
            }
        ]
    },
    handleRequest: function(app, params, connection, callback) {
        if(!params.id || /^-?[0-9]+$/.test(params.id)) {
            return callback('Missing numerical parameter id');
        }
        connection.execute('SELECT `game`,`type` FROM `palooza`.`game_records` WHERE `winner` = (SELECT `uuid` FROM `palooza`.`accounts` WHERE `id` = ?)', [params.id], function(err, rows) {
            if(err) {
                app.logError('Failed to select game from database using id "' + params.id + '"');
                return callback('Internal error occurred');
            }
            var object = {
                games: rows
            };
            callback(undefined, object);
        });
    }
};