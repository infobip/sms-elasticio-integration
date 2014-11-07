describe('Http Component', function () {

    var nock = require('nock');
    var elasticio = require('../elasticio.js');
    var HttpComponent = elasticio.HttpComponent;
    var messages = elasticio.messages;

    it('GET 200 OK', function () {

        nock('http://foobarbazbarney.com')
            .get('/api')
            .reply(200, JSON.stringify({
                foo: 'bar',
                baz: 'barney'
            }));


        var emitter = jasmine.createSpyObj('emitter', ['emit']);

        var options = {
            url: 'http://foobarbazbarney.com/api',
            json: true
        };

        var component = new HttpComponent(emitter);

        runAndExpect(
            function () {
                component.get(options);
            },
            function () {
                return emitter.emit.callCount === 2;
            },
            function () {
                var emitCalls = emitter.emit.calls;

                var emitDataArgs = emitCalls[0].args;

                expect(emitDataArgs[0]).toEqual('data');
                expect(emitDataArgs[1].body).toEqual({
                    foo: 'bar',
                    baz: 'barney'
                });

                expect(emitCalls[1].args).toEqual(['end']);
            });
    });

    it('GET 201 Created', function () {

        nock('http://foobarbazbarney.com')
            .get('/api')
            .reply(201, JSON.stringify({
                foo: 'bar',
                baz: 'barney'
            }));


        var emitter = jasmine.createSpyObj('emitter', ['emit']);

        var options = {
            url: 'http://foobarbazbarney.com/api',
            json: true
        };

        var component = new HttpComponent(emitter);

        runAndExpect(
            function () {
                component.get(options);
            },
            function () {
                return emitter.emit.callCount === 2;
            },
            function () {
                var emitCalls = emitter.emit.calls;

                var emitDataArgs = emitCalls[0].args;

                expect(emitDataArgs[0]).toEqual('data');
                expect(emitDataArgs[1].body).toEqual({
                    foo: 'bar',
                    baz: 'barney'
                });

                expect(emitCalls[1].args).toEqual(['end']);
            });
    });

    it('POST', function () {

        nock('http://foobarbazbarney.com')
            .post('/api')
            .reply(200, JSON.stringify({
                foo: 'bar',
                baz: 'barney'
            }));


        var emitter = jasmine.createSpyObj('emitter', ['emit']);

        var options = {
            url: 'http://foobarbazbarney.com/api',
            json: true
        };

        var component = new HttpComponent(emitter);

        runAndExpect(
            function () {
                component.post(options);
            },
            function () {
                return emitter.emit.callCount === 2;
            },
            function () {
                var emitCalls = emitter.emit.calls;

                var emitDataArgs = emitCalls[0].args;

                expect(emitDataArgs[0]).toEqual('data');
                expect(emitDataArgs[1].body).toEqual({
                    foo: 'bar',
                    baz: 'barney'
                });

                expect(emitCalls[1].args).toEqual(['end']);
            });
    });

    it('PUT', function () {

        nock('http://foobarbazbarney.com')
            .put('/api')
            .reply(200, JSON.stringify({
                foo: 'bar',
                baz: 'barney'
            }));


        var emitter = jasmine.createSpyObj('emitter', ['emit']);

        var options = {
            url: 'http://foobarbazbarney.com/api',
            json: true
        };

        var component = new HttpComponent(emitter);

        runAndExpect(
            function () {
                component.put(options);
            },
            function () {
                return emitter.emit.callCount === 2;
            },
            function () {
                var emitCalls = emitter.emit.calls;

                var emitDataArgs = emitCalls[0].args;

                expect(emitDataArgs[0]).toEqual('data');
                expect(emitDataArgs[1].body).toEqual({
                    foo: 'bar',
                    baz: 'barney'
                });

                expect(emitCalls[1].args).toEqual(['end']);
            });
    });

    it('404', function () {

        nock('http://foobarbazbarney.com')
            .put('/api')
            .reply(404, "Ouch");


        var emitter = jasmine.createSpyObj('emitter', ['emit']);

        var options = {
            url: 'http://foobarbazbarney.com/api',
            json: true
        };

        var component = new HttpComponent(emitter);

        runAndExpect(
            function () {
                component.put(options);
            },
            function () {
                return emitter.emit.callCount === 2;
            },
            function () {
                var emitCalls = emitter.emit.calls;

                var emitDataArgs = emitCalls[0].args;

                expect(emitDataArgs[0]).toEqual('error');
                expect(emitDataArgs[1]).toEqual(new Error("Ouch"));

                expect(emitCalls[1].args).toEqual(['end']);
            });
    });

    it('Override success handler', function () {

        nock('http://foobarbazbarney.com')
            .get('/api')
            .reply(200, JSON.stringify({
                foo: 'bar',
                baz: 'barney'
            }));


        var emitter = jasmine.createSpyObj('emitter', ['emit']);

        var options = {
            url: 'http://foobarbazbarney.com/api',
            json: true
        };

        function onSuccess(response, body) {
            var msg = messages.newMessageWithBody({
                wrappedBody : body
            });

            emitter.emit('data', msg);
        }

        var component = new HttpComponent(emitter).success(onSuccess);

        runAndExpect(
            function () {
                component.get(options);
            },
            function () {
                return emitter.emit.callCount === 2;
            },
            function () {
                var emitCalls = emitter.emit.calls;

                var emitDataArgs = emitCalls[0].args;

                expect(emitDataArgs[0]).toEqual('data');
                expect(emitDataArgs[1].body).toEqual({
                    wrappedBody : {
                        foo: 'bar',
                        baz: 'barney'
                    }
                });

                expect(emitCalls[1].args).toEqual(['end']);
            });
    });

    function runAndExpect(runner, waiter, expector) {

        var next = jasmine.createSpy('next');

        runs(runner);

        waitsFor(waiter, 5000);

        runs(expector);
    }
});