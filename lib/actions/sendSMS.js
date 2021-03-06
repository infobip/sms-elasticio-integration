var HttpComponent = require('elasticio-node').HttpComponent;

exports.process = sendSMS;

function sendSMS(msg, cfg) {

	var senderAddress = msg.body.senderAddress;
    var destinationAddress = msg.body.address;
    var message = msg.body.message;
	
	if (!senderAddress) {
        errorAndEnd('Sender address is required', this);
	}

    if (!destinationAddress) {
        errorAndEnd('Destination address is required', this);
    }

    if (!message) {
        errorAndEnd('Message text is required', this);
        return;
    }

	var sendSMSUrl = 'https://oneapi.infobip.com:443/1/smsmessaging/outbound/' + senderAddress  + '/requests';

    var data = JSON.stringify(msg.body);

    var tok = cfg.username + ':' + cfg.password;

    var headers = {
        'Authorization' : "Basic " +  new Buffer(tok).toString('base64'),
        'Content-Type': "application/json"
    }

    var options = {
    	headers: headers,
        url : sendSMSUrl,
        body: data
    };

    new HttpComponent(this).post(options);
}

function errorAndEnd(message, event) {
        console.log('ovde');
        event.emit('error', new Error(message));
        event.emit('end');
        return;
}