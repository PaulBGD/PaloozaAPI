module.exports = {
    path: "friends",
    type: "POST",
    parent: "player/data",
    description: "Returns all friends a player has",
    params: {
        id: {
            type: "integer",
            description: "The player's id",
            required: true
        }
    },
    example: {
        1: [
            2,
            3,
            1005,
            1520
        ]
    },
    handleRequest: function(_palooza, params, callback) {
        _palooza.database.execute('SELECT * FROM `palooza`.`friends` WHERE `friendly` = ? OR `friend` = ?', [params.id, params.id], function(err, rows) {
            if(err) {
                _palooza.debug('Failed to select friends from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var friends = [];
            var length = rows.length;
            while (length--) {
                var row = rows[length];
                if (row.friend == params.id) {
                    friends[length] = row.friendly;
                } else {
                    friends[length] = row.friend;
                }
            }
            var object = {};
            object[params.id] = friends;
            callback(null, object);
        });
    }
};
