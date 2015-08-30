module.exports = {
    path: "latest",
    type: "POST",
    parent: "servers/chat",
    description: "Retrieves the latest chat messages for a said server",
    params: {
        server: {
            type: "string",
            length: "10",
            description: "The server of the chat messages"
        },
        count: {
            type: "integer",
            length: {
                min: 1,
                max: 100
            },
            description: "The amount of messages to return",
            required: false
        },
        startAt: {
            type: "integer",
            length: {
                min: 1
            },
            description: "The message to start at",
            required: false
        }
    },
    example: {
        12: {
            id: 1,
            server: "factions",
            type: 0,
            message: "Wow this chat feature is amazing!",
            time: "2015-05-29T01:15:55.000Z",
            uid: 12
        },
        13: {
            id: 1,
            server: "factions",
            type: 0,
            message: "second message!!",
            time: "2015-05-29T01:15:55.000Z",
            uid: 13
        }
    },
    handleRequest: function (_palooza, params, callback) {
        if (params.server) {
            _palooza.database.execute('SELECT * FROM `palooza_chat`.`messages` WHERE `uid` >= ? AND `server` = ? ORDER BY `time` DESC LIMIT ?', [params.startAt || 0, params.server, params.count || 10], function (err, rows) {
                if (err) {
                    _palooza.debug('Failed to select chat messages from database"', err);
                    return callback('Internal error occurred');
                }
                var object = {};
                var length = rows.length;
                while (length--) {
                    var row = rows[length];
                    object[row.uid] = row;
                }
                callback(undefined, object);
            });
        } else {
            _palooza.database.execute('SELECT * FROM `palooza_chat`.`messages` WHERE `uid` >= ? ORDER BY `time` DESC LIMIT ?', [params.startAt || 0, params.count || 10], function (err, rows) {
                if (err) {
                    _palooza.debug('Failed to select chat messages from database"', err);
                    return callback('Internal error occurred');
                }
                var object = {};
                var length = rows.length;
                while (length--) {
                    var row = rows[length];
                    object[row.uid] = row;
                }
                callback(undefined, object);
            });
        }
    }
};
