var request = require("request");
var Q = require("q");
var _ = require("underscore");
var messages = require('./messages.js');

exports.HttpComponent = HttpComponent;

function HttpComponent(component) {
    this.component = component;
    this.onSuccess = onSuccess.bind(component);
}

HttpComponent.prototype.success = function success(onSuccess) {
    if (!this.onSuccess) {
        throw new Error("Response handler is required. Please set it through HttpComponent.success");
    }

    this.onSuccess = onSuccess;

    return this;
};

HttpComponent.prototype.get = function get(requestOptions) {
    doRequest.apply(this, ['get', requestOptions]);
};

HttpComponent.prototype.put = function put(requestOptions) {
    doRequest.apply(this, ['put', requestOptions]);
};

HttpComponent.prototype.post = function post(requestOptions) {
    doRequest.apply(this, ['post', requestOptions]);
};

function doRequest(method, requestOptions) {
    var self = this;
    var emitter = this.component;

    Q.nfcall(request[method], requestOptions)
        .spread(self.onSuccess)
        .fail(handleError)
        .done(done);

    function handleError(err) {
        emitter.emit('error', err);
    }

    function done() {
        emitter.emit('end');
    }
}

function onSuccess(response, body) {

    if (!~[200, 201].indexOf(response.statusCode)) {
        throw new Error(typeof body === 'string' ? body : JSON.stringify(body));
    }

    var msg =  messages.newMessageWithBody(body);

    this.emit('data', msg);
}