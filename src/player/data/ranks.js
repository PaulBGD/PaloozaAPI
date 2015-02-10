function getRanks(row) {
    var ranks = [];
    if(row.director[0]) {
        ranks.push("director");
    }
    if(row.developer[0]) {
        ranks.push("developer");
    }
    if(row.admin[0]) {
        ranks.push("admin");
    }
    if(row.mod[0]) {
        ranks.push("mod");
    }
    if(row.youtuber[0]) {
        ranks.push("youtuber");
    }
    if(row.dedicated[0]) {
        ranks.push("dedicated");
    }
    if(row.committed[0]) {
        ranks.push("committed");
    }
    if(row.loyal[0]) {
        ranks.push("loyal");
    }
    return ranks;
}

module.exports = {
    path: "ranks",
    type: "POST",
    parent: "player/data",
    description: "Returns a player's ranks. Requires a name, uuid, or id.",
    params: {
        name: {
            type: "string",
            description: "The player's name",
            required: false
        },
        uuid: {
            type: "string",
            description: "The player's uuid",
            required: false
        },
        id: {
            type: "integer",
            description: "The player's id",
            required: false
        }
    },
    example: {
        "PaulBGD": {
            ranks: [
                "director",
                "developer",
                "mod"
            ]
        }
    },
    handleRequest: function(app, params, connection, callback) {
        if(params.name) {
            if(params.name.length > 16) {
                return callback('Missing parameter name.');
            }
            connection.execute('SELECT `director`,`developer`,`admin`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `name` = ?', [params.name], function(err, rows) {
                if(err) {
                    app.logError('Failed to select player from database using name "' + params.name + '"');
                    return callback('Internal error occurred');
                }
                var row = rows[0];
                if(row) {
                    var object = {};
                    object[params.name] = {
                        ranks: getRanks(row)
                    };
                    callback(undefined, object);
                } else {
                    callback('Player with supplied name not found');
                }
            });
        } else if(params.uuid) {
            if(params.uuid.length != 36) {
                return callback('Missing parameter uuid. Make sure your UUID includes dashes');
            }
            connection.execute('SELECT `director`,`developer`,`admin`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `uuid` = ?', [params.uuid], function(err, rows) {
                if(err) {
                    app.logError('Failed to select player from database using uuid "' + params.uuid + '"');
                    return callback('Internal error occurred');
                }
                var row = rows[0];
                if(row) {
                    var object = {};
                    object[params.uuid] = {
                        ranks: getRanks(row)
                    };
                    callback(undefined, object);
                } else {
                    callback('Player with supplied name not found');
                }
            });
        } else if(params.id) {
            if(/^-?[0-9]+$/.test(params.id)) {
                return callback('Missing numerical parameter id');
            }
            connection.execute('SELECT `director`,`developer`,`admin`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `id` = ?', [params.id], function(err, rows) {
                if(err) {
                    app.logError('Failed to select player from database using id "' + params.name + '"');
                    return callback('Internal error occurred');
                }
                var row = rows[0];
                if(row) {
                    var object = {};
                    object[params.id] = {
                        ranks: getRanks(row)
                    };
                    callback(undefined, object);
                } else {
                    callback('Player with supplied id not found');
                }
            });
        } else {
            callback('Missing parameter');
        }
    }
};