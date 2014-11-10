var elasticio = require('elasticio-node');
var HttpComponent = elasticio.HttpComponent;
var messages = elasticio.messages;

var receiveSMSUrl = 'https://oneapi.infobip.com:443/1/smsmessaging/inbound/registrations/elasticio/messages';

exports.process = receiveSMS;

function receiveSMS(msg, cfg) {

    var self = this;

    var tok = cfg.username + ':' + cfg.password;

    var headers = {
        'Authorization' : "Basic " +  new Buffer(tok).toString('base64'),
        'Content-Type': "application/json"
    }
    
    var options = {
    	headers: headers,
        url : receiveSMSUrl,
    };

   function onSuccess(response, body) {
        if (response.statusCode === 400) {
            throw new Error(JSON.stringify(body));
        }
        
        var bodyParsed = JSON.parse(body);
        var numberOfMessages =  bodyParsed.inboundSMSMessageList.inboundSMSMessage.length;
                      
        if (numberOfMessages > 0){
             var data = {
                messages : []
            };

            for (var i = 0; i < numberOfMessages; i++){
                var message = {
                    "dateTime": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].dateTime,
                    "destinationAddress": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].destinationAddress,  
                    "senderAddress": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].senderAddress,  
                    "message": bodyParsed.inboundSMSMessageList.inboundSMSMessage[i].message
                };
                data.messages.push(message);
            }
            console.log(JSON.stringify(data));
            var msg =  messages.newMessageWithBody(data);
            self.emit('data', msg);
        }

    }

    new HttpComponent(this).success(onSuccess).get(options);
}