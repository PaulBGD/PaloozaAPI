var fs = require('fs');

function Application() {
    setInterval(this.saveLogs, 2000);
}

Application.prototype.log = [];

Application.prototype.logError = function (message, error) {
    if (!error) {
        error = message;
        message = '';
    }
    this.log.push({message: message, error: error});
};

Application.prototype.saveLogs = function() {
    if(this.log.length) {
        var log = [];
        for(var i = 0; i < this.log.length; i++) {
            var entry = this.log[i];
            log.push('[ERROR] ');
            log.push(entry.message);
            log.push('\n');
            log.push(entry.error);
            log.push('\n');
        }
        fs.appendFile('./log.txt', log.join(), function(err) {
            if(err) {
                console.error(err.stack); // nothing else to do at this point
            }
        });
        this.logs = [];
    }
};
