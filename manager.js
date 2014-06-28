// module dependencies
var plivo = require('plivo-node');

// this module

var manager = {};

// vars

//var myio = {};
var p = plivo.RestAPI(require('../config'));
var sequence = 1;
var clients = [];
var calls = {};
var callRequests = {};
//var theio = {};

// functions

//manager.init = function(io){

  //  theio = io;
//}

manager.initClient=function(thisSocket) {
   
    // add this socket to the clients list
    clients.push(thisSocket);
    console.log('New connection:' + thisSocket.id);
     
    // the eventhandlers...
   
    // socket disconnects

    thisSocket.on('disconnect', function() {

        console.log('Disconnect:' + thisSocket.id);
        var index = clients.indexOf(thisSocket);

        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client removed ' + thisSocket.id);
        }
    });


    // trigger call
    thisSocket.on('trigger call', function (msg){

        var params = {
            from: '17852929203',
            to: msg.to,
            answer_url: 'http://imadeatest.com:3030/api/answer_url',
        };

        console.log('Making the call...');

        p.make_call(params, function(status, response) {

            var thisCallRequest = {
                phone: msg.to,
                client: thisSocket
            };

            var err = null;

            if (status >= 200 && status < 300) {
                console.log('Successfully made call request.');
                console.log('Response:', response);

                // bind a call to this socketid
                callRequests[response.request_uuid] = thisCallRequest ;   

            } else {
                console.log('Oops! Something went wrong.');
                console.log('Status:', status);
                console.log('Response:', response);

                err = response;
            };

            thisSocket.emit('trigger call', response);
            
            console.log(calls);
                
        });

    });
};

manager.handleAPI = function (req, res) {

    var thisCallRequest = {};
    var thisCall = {};
    var index = null;

    var r = plivo.Response();

    // OUTBOUND CALL REQUESTS

    // is it an existing call request?
    if (callRequests[req.body.RequestUUID]) {
        
        // take this request
        thisCallRequest = callRequests[req.body.RequestUUID];
      
        // add it to a call object
        var thisCall = {
            call: req.body,
            client: thisCallRequest.client
        };


        console.log('RequestUUID matches a call request');
        console.log('Event:', req.body.Event);

        switch(req.body.Event) {

            // someone picking up 
            case 'StartApp':

                // add this call to calls
                calls[req.body.CallUUID] = thisCall;

                // remove the call request
                delete thisCallRequest;

                // trigger fucking video at last
                thisCall.client.emit('play', 'church.mp4');
                
                // generate call content

                // add the Speak element
                // Speak accepts both "body" and "attributes" as params.
                // note that "loop" is a valid attribute for Speak element - https://www.plivo.com/docs/xml/speak/
                r.addSpeak('Hello, this is your mother calling. Watch this video please.', { loop: 2 });

                // add the Wait element
                // Wait accepts only "attributes" as a param - https://www.plivo.com/docs/xml/wait/
                r.addWait({ length: 3 });

                // add the DTMF element
                // DTMF accepts only "body" as a param - https://www.plivo.com/docs/xml/dtmf/
                r.addDTMF('12345');

               
                break;

            // someone hanging up   
            case 'Hangup':

                // This shouldn't happen
                console.log('Hangup for a call request that had no call associated');
        
                // delete call from calls
                break;


            // unknown
            default:     

            console.log("Unknown API event");
                
        }

        console.log(r.toXML());
        
        // return Plivo XML
        return r.toXML();



    // INBOUND CALL EVENTS

    } else {

        console.log('Inbound/new call');

        // create call object
        var thisCall = {
            call: req.body,
            client: null
        };

        // if there is a client bind the call object to the first client
        if (clients.length > 0) {
            thisCall.client = clients[0];
            //console.log(thisCall);      
        };


        switch(req.body.Event) {

            // start of call 
            case 'StartApp':

                console.log('Catch1');


                // add this call to calls
                calls[req.body.CallUUID] = thisCall;
                console.log('Catch2');

                // trigger fucking video at last
                //
                //thisClient = clients[thisCall.client.id];
                //console.log(clients);
                //console.log(theio.sockets);
                
                //thisClient.emit('play', 'church.mp4');
                clients[0].emit('play', 'church.mp4');
                
                thisCall.client.emit('play', 'church.mp4');
                
                // generate call content

                // add the Speak element
                r.addSpeak('Hello, this is your mother speaking. I\' busy right now. Watch this video though. Please.', { loop: 2 });
                r.addWait({ length: 3 });

                
                break;

            // someone hanging up   
            case 'Hangup':

                // delete call from calls
                if (calls[req.body.CallUUID]) {

                    delete calls[req.body.CallUUID];

                } else {

                    console.log('Can\'t find call to hang up');

                }

                break;

            // unknown
            default:

            console.log("Unknown API event");
                
        }

        //console.log(r.toXML());
        
        // return Plivo XML
        return r.toXML();


    }


};

// Ping a random client...
setInterval(function() {

    var randomClient;

    if (clients.length > 0) {

        randomClient = Math.floor(Math.random() * clients.length);
        clients[randomClient].emit('ping', sequence++);
        
        console.log("Ping " + clients[randomClient].id, sequence);

    }

}, 10000);

//manager.clients = clients;
//manager.calls = calls;



module.exports = manager;
