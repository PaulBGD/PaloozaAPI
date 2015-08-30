module.exports = {
    path: "punishments",
    type: "POST",
    parent: "player/data",
    description: "Returns a list of all the player's punishments",
    params: {
        id: {
            type: "integer",
            description: "The player's id",
            required: true
        }
    },
    example: {
        749: [
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
        ]
    },
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT `punisher`,`time`,`date`,`type`,`reason`,`cleared`,`uid` FROM `punishments` WHERE `id` = ?', [params.id], function (err, rows) {
            if (err) {
                _palooza.debug('Failed to select punishments from database"', err);
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
            var object = {};
            object[params.id] = punishments;
            callback(undefined, object);
        });
    }
};
