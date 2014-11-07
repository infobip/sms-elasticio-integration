var uuid = require('node-uuid');
var Q = require('q');

exports.newEmptyMessage = newEmptyMessage;
exports.newMessageWithBody = newMessageWithBody;

function newEmptyMessage() {

    var msg = {
        id: uuid.v1(),
        attachments: {},
        body: {},
        headers: {},
        metadata: {}
    };

    return msg;
}

function newMessageWithBody(body) {

    var msg = newEmptyMessage();

    msg.body = body;
    
    return msg;
}

