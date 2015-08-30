module.exports = {
    path: "factions",
    type: "POST",
    parent: "faction",
    description: "Returns a list of all factions",
    params: {},
    example: [
        "BGD",
        "Minions",
        "Developers"
    ],
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT DISTINCT `faction` FROM `accounts` WHERE `faction` IS NOT NULL ORDER BY `faction`', function (err, rows) {
            if (err) {
                _palooza.debug('Failed to select Factions from database"', err);
                return callback('Internal error occurred');
            }
            var array = [];
            var length = rows.length;
            while (length--) {
                array[length] = rows[length].faction;
            }
            callback(undefined, array);
        });
    }
};
