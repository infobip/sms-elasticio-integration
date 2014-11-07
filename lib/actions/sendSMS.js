var HttpComponent = require('elasticio-node').HttpComponent;

exports.process = sendSMS;

function sendSMS(msg, cfg) {

	var senderAddress = msg.body.senderAddress;
	
	if (!senderAddress) {
	    return this.emit('error', new Error('Sender Address is required'));
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