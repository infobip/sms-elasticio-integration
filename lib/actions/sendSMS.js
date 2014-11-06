var HttpComponent = require('elasticio-node').HttpComponent;

exports.process = sendSMS;

function sendSMS(msg, cfg) {

	var sendSMSUrl = 'https://oneapi.infobip.com:443/1/smsmessaging/outbound/' + msg.senderAddress  + '/requests';

    var data =JSON.stringify(msg.body);

    var tok = cfg.username + ':' + cfg.password;
    msg.headers['Authorization'] = "Basic " +  new Buffer(tok).toString('base64');

    var options = {
    	headers: msg.headers,
        url : sendSMSUrl,
        body: data
    };

    new HttpComponent(this).post(options);
}