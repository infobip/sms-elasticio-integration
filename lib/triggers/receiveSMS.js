var HttpComponent = require('elasticio-node').HttpComponent;

var receiveSMSUrl = 'https://oneapi.infobip.com:443/1/smsmessaging/inbound/registrations/elasticio/messages';

exports.process = receiveSMS;

function receiveSMS(msg, cfg) {

    var tok = cfg.username + ':' + cfg.password;
    msg.headers['Authorization'] = "Basic " +  new Buffer(tok).toString('base64');
    
    var options = {
    	headers: msg.headers,
        url : receiveSMSUrl,
    };

   function onSuccess(response, body) {
        if (response.statusCode === 400) {
            throw new Error(JSON.stringify(body));
        }
        
        var bodyParsed = JSON.parse(body);
        console.log('Number of messages: ' + bodyParsed.inboundSMSMessageList.inboundSMSMessage.length);
        var numberOfMessages =  bodyParsed.inboundSMSMessageList.inboundSMSMessage.length;
                      
        if (numberOfMessages > 0){
            var data = [];
            for (var i = 0; i < numberOfMessages; i++){
                var message = {
                    "dateTime": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].dateTime,
                    "destinationAddress": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].destinationAddress,  
                    "senderAddress": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].senderAddress,  
                    "message": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].message
                };
                data.push(message);
            }
            console.log(JSON.stringify(data));
            return JSON.stringify(data);
        }

    }

    new HttpComponent(this).success(onSuccess).get(options);
}