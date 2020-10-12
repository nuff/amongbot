'use strict'
module.exports = {
    errorEmbed: (message) => {
        return {
            "color": 0xf54242,
            "fields": [{
                "name": "Error!",
                "value": message
            }]
        };
    },
    warningEmbed: (message) => {
        return {
            "color": 0xecf542,
            "fields": [{
                "name": "Warning!",
                "value": message
            }]
        };
    },
    notifEmbed: (title, message) => {
        return {
            "color": 0x53e677,
            "fields": [{
                "name": title,
                "value": message
            }]
        };
    }
};
