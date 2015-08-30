module.exports = {
    path: "punishments",
    type: "POST",
    parent: "servers",
    description: "Returns a sorted list of punishments",
    params: {
        type: {
            type: "string",
            description: "Type of punishment. Currently chat, ban, or both. Defaults to both",
            length: {
                min: 3,
                max: 4
            }
        },
        start: {
            type: "integer",
            description: "The uid to start at.",
            length: {
                min: 0
            }
        },
        count: {
            type: "integer",
            description: "How many bans to retrieve. Default value 10.",
            length: {
                min: 1,
                max: 100
            }
        },
        sort: {
            type: "string",
            description: "How to sort. Currently latest or oldest",
            length: {
                min: 6,
                max: 6
            }
        }
    },
    example: [
        {
            punisher: 1,
            time: 3600000,
            date: 1439936414118,
            type: 'chat',
            reason: 'muted for reason',
            cleared: false,
            uid: 1
        },
        {
            punisher: 1,
            time: -1,
            date: 1439936414118,
            type: 'ban',
            reason: 'permabanned for hacking',
            cleared: true,
            uid: 2
        }
    ],
    handleRequest: function (_palooza, params, callback) {
        var type = -1;
        if (params.type) {
            params.type = params.type.toLowerCase();
            if (params.type == 'chat') {
                type = 1;
            } else if (params.type == 'ban') {
                type = 0;
            }
        }
        var sort = 'DESC';
        if (params.sort) {
            params.sort = params.sort.toLowerCase();
            if (params.sort == 'oldest') {
                sort = 'ASC';
            }
        }

        if (params.start !== undefined) {
            if (params.count !== undefined) {
                if (type == -1) {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `uid` > ? ORDER BY `uid` ' + sort + ' LIMIT ' + params.count, [params.start], function (err, rows) {
                        handle(err, rows, callback);
                    });
                } else {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `uid` > ? AND `type` = ? ORDER BY `uid` ' + sort + ' LIMIT ' + params.count, [params.start, type], function (err, rows) {
                        handle(err, rows, callback);
                    });
                }
            } else {
                if (type == -1) {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `uid` > ? ORDER BY `uid` ' + sort, [params.start], function (err, rows) {
                        handle(err, rows, callback);
                    });
                } else {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `uid` > ? AND `type` = ? ORDER BY `uid` ' + sort, [params.start, type], function (err, rows) {
                        handle(err, rows, callback);
                    });
                }
            }
        } else {
            if (params.count !== undefined) {
                if (type == -1) {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` ORDER BY `uid` ' + sort + ' LIMIT ' + params.count, function (err, rows) {
                        handle(err, rows, callback);
                    });
                } else {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `type` = ? ORDER BY `uid` ' + sort + ' LIMIT ' + params.count, [type], function (err, rows) {
                        handle(err, rows, callback);
                    });
                }
            } else {
                if (type == -1) {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` ORDER BY `uid` ' + sort, function (err, rows) {
                        handle(err, rows, callback);
                    });
                } else {
                    _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `type` = ? ORDER BY `uid` ' + sort, [type], function (err, rows) {
                        handle(err, rows, callback);
                    });
                }
            }
        }

    }
};

function handle(err, rows, callback) {
    if (err) {
        _palooza.debug('Failed to select punishments from database', err);
        return callback('Internal error occurred');
    }

    var punishments = [];
    var length = rows.length;
    while (length--) {
        var row = rows[length];
        if (row.type == 0) {
            row.type = 'ban';
        } else if (row.type == 1) {
            row.type = 'chat';
        } else {
            row.type = 'unknown';
        }
        row.cleared = !!row.cleared[0];
        punishments[length] = row;
    }
    callback(undefined, punishments);
}
