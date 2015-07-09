var debug = require('debug')('PaloozaAPI:method');
var Long = require('long');

var originalTime = Long.fromString('1436402032706');

module.exports = {
    path: "traffic",
    type: "POST",
    parent: "servers",
    description: "Returns the traffic from a certain chunk of time",
    params: {
        chunks: {
            type: "string",
            length: "10",
            description: "A list of chunks to retrieve, max length of 250. Defaults to the last 10"
        }
    },
    example: {
        3: [
            1,
            231,
            63
        ]
    },
    handleRequest: function (_palooza, params, callback) {
        if (params.chunks) {
            var chunks = params.chunks.split(',');
            chunks = chunks.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            });
            if (chunks.length > 250) {
                return callback('Please do not request more than 250 chunks');
            }
            var length = chunks.length;
            while (length--) {
                if (!/^-?[0-9]+$/.test(chunks[length]) || chunks[length] < 0) {
                    return callback('Invalid chunk ' + chunks[length]);
                }
            }
            _palooza.database.execute('SELECT * FROM `traffic` WHERE `time` IN (' + chunks.join(',') + ')', function (err, rows) {
                if (err) {
                    debug('Failed to select traffic from database"', err);
                    return callback('Internal error occurred');
                }
                var object = {};
                var length = chunks.length;
                while (length--) {
                    object[chunks[length]] = [];
                }
                length = rows.length;
                while (length--) {
                    var row = rows[length];
                    if (object[row.time]) {
                        object[row.time].push(row.id);
                    } else {
                        object[row.time] = [row.id];
                    }
                }
                callback(undefined, object);
            });
        } else {
            var minutesSince = Long.fromValue(Date.now()).subtract(originalTime).div(1000).div(60);
            var current = minutesSince.subtract(minutesSince.modulo(30)).div(30);
            _palooza.database.execute('SELECT * FROM `traffic` WHERE `time` > ?', [current.subtract(10).toString()], function (err, rows) {
                if (err) {
                    debug('Failed to select traffic from database"', err);
                    return callback('Internal error occurred');
                }
                var object = {};
                var length = rows.length;
                while (length--) {
                    var row = rows[length];
                    if (object[row.time]) {
                        object[row.time].push(row.id);
                    } else {
                        object[row.time] = [row.id];
                    }
                }
                callback(undefined, object);
            });
        }
    }
};
