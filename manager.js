// DEPENDENCIES
// ============

var plivo = require('plivo-node');


// VARS
// ====

var manager = {};
var sequence = 1;
var calls = {};
var callRequests = {};
var p;
var io;
var performances = {};
var performanceScript = {
    "1-1":"showPhone",
    "1-2" : "callListener1-2",
    "1-3" : "callListener1-3",
    "2-1" : "clearListeners",
    "2-2" : "callListener2-2",
    "2-3" : "callListener2-3",
    "2-4" : "callListener2-4",
    "2-5" : "clearUI",
    "2-6" : "playVideo2-6",
    "3-1" : "clearListeners",
    "3-2" : "callListener3-2",
    "3-3" : "playVideo3-3",
};


// PUBLIC FUNCTIONS
// ================

// initialise manager with socketio instance

manager.init = function (theio){

    // add instance to manager
    io = theio;

    // add callback for connections
    io.on('connection', function(socket){   
        initClient(socket);
    });

    // add plivo instance
    p = plivo.RestAPI(require('../config'));

}

//clientmanager.init();

// PRIVATE FUNCTIONS
// =================


function initClient(thisSocket) {

    // create a new 'performance'
    var thisPerformance = {};


    // add the socket to the performance
    thisPerformance.socket = thisSocket;

    // add socket handlers
    addSocketHandlers(thisSocket);

    // open performance-script
    thisPerformance.script = function (script) {

        // save a copy to this performance
        return script;

    }(performanceScript);
    
    // add to performances using socket.id as the key?
    performances[thisSocket.id] = thisPerformance;
    console.log('New connection:' + thisSocket.id);

    // send script to client 
    thisSocket.emit('script', thisPerformance.script);

}


function addSocketHandlers(thisSocket) {
   
    // socket disconnects
    thisSocket.on('disconnect', function() {

        console.log('Disconnect:' + thisSocket.id);

        if (performances[thisSocket.id]) {

            delete performances[thisSocket.id];
            console.info('Performance deleted for:' + thisSocket.id);

        } else {

            console.info('No performance found for:' + thisSocket.id);

        }

    });

    // a generic message from the client
    thisSocket.on('message', function() {

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

                    console.log('Received hangup. Deleting call from calls...', calls); 
                    delete calls[req.body.CallUUID];

                } else {

                    console.log('Can\'t find call to hang up');

                }
                
                console.log('Here\'s all the current calls after the hang-up: ', calls);                

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

    // choose a random key
    var randomKey,
        keys = Object.keys(performances);

    if (keys.length != 0) {

        randomKey = keys[Math.floor(Math.random() * keys.length)];

        performances[randomKey].socket.emit('ping', sequence++);
        console.log("Ping " + randomKey, sequence);
        
        
    }

}, 1000);

//manager.clients = clients;
//manager.calls = calls;



module.exports = manager;
