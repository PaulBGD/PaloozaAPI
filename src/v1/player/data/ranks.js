var async = require('async');
var debug = require('debug')('PaloozaAPI:method');

function getRanks(row) {
    var ranks = [];
    if (!row) {
        return ranks;
    }
    if (row.director[0]) {
        ranks.push("director");
    }
    if (row.developer[0]) {
        ranks.push("developer");
    }
    if (row.admin[0]) {
        ranks.push("admin");
    }
    if (row.mod[0]) {
        ranks.push("mod");
    }
    if (row.youtuber[0]) {
        ranks.push("youtuber");
    }
    if (row.dedicated[0]) {
        ranks.push("dedicated");
    }
    if (row.committed[0]) {
        ranks.push("committed");
    }
    if (row.loyal[0]) {
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
            required: false,
            length: {
                max: 16
            }
        },
        uuid: {
            type: "string",
            description: "The player's uuid",
            required: false,
            length: 36
        },
        id: {
            type: "integer",
            description: "The player's id",
            required: false
        },
        ids: {
            type: "string",
            description: "A comma separated list of ids",
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
    handleRequest: function (_palooza, params, callback) {
        if (params.name) {
            _palooza.database.execute('SELECT `director`,`developer`,`admin`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `name` = ?', [params.name], function (err, rows) {
                if (err) {
                    debug('Failed to select player from database using name "' + params.name + '"', err);
                    return callback('Internal error occurred');
                }
                var row = rows[0];
                if (row) {
                    var object = {};
                    object[params.name] = {
                        ranks: getRanks(row)
                    };
                    callback(undefined, object);
                } else {
                    callback('Player with supplied name not found');
                }
            });
        } else if (params.uuid) {
            _palooza.database.execute('SELECT `director`,`developer`,`admin`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `uuid` = ?', [params.uuid], function (err, rows) {
                if (err) {
                    debug('Failed to select player from database using uuid "' + params.uuid + '"', err);
                    return callback('Internal error occurred');
                }
                var row = rows[0];
                if (row) {
                    var object = {};
                    object[params.uuid] = {
                        ranks: getRanks(row)
                    };
                    callback(undefined, object);
                } else {
                    callback('Player with supplied name not found');
                }
            });
        } else if (params.id) {
            _palooza.database.execute('SELECT `director`,`developer`,`admin`, `mod`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `id` = ?', [params.id], function (err, rows) {
                if (err) {
                    debug('Failed to select player from database using id "' + params.id + '"', err);
                    return callback('Internal error occurred');
                }
                var row = rows[0];
                if (row) {
                    var object = {};
                    object[params.id] = {
                        ranks: getRanks(row)
                    };
                    callback(undefined, object);
                } else {
                    callback('Player with supplied id not found');
                }
            });
        } else if (params.ids) {
            var ids = params.ids.split(',');
            ids = ids.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });
            if (ids.length > 10) {
                ids = ids.slice(0, 10);
            }
            var data = {};
            var tasks = [];
            ids.forEach(function (id) {
                tasks.push(function(callback) {
                    _palooza.database.execute('SELECT `director`,`developer`,`admin`, `mod`,`youtuber`,`dedicated`,`committed`,`loyal` FROM `palooza`.`accounts` WHERE `id` = ?', [id], function (err, rows) {
                        if (err) {
                            return callback(err);
                        }
                        var row = rows[0];
                        if (row) {
                            data[id] = {
                                ranks: getRanks(row)
                            };
                            callback();
                        } else {
                            data[id] = {
                                error: true,
                                message: 'Not found'
                            };
                            callback();
                        }
                    });
                });
            });
            async.parallel(tasks, function(err) {
                if (err) {
                    debug('Failed to select player from database', err);
                    return callback(typeof err == 'string' ? error : 'Internal error occurred');
                }
                callback(null, data);
            });
        }
        else {
            callback('Missing parameter');
        }
    }
};