// module dependencies
var plivo = require('plivo-node');

// this module

var manager = {};

// vars

var p = plivo.RestAPI(require('../config'));
var sequence = 1;
var clients = [];


// functions

manager.initClient=function(io, thisSocket) {
   
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
            answer_url: 'http://imadeatest.com:3002/api/answer_url',
        };

        // make the call
        console.log('Making the call...');

        p.make_call(params, function(status, response) {

            var err = null;

            if (status >= 200 && status < 300) {
                console.log('Successfully made call request.');
                console.log('Response:', response);

                // associate currentCall with a successful dial out response
                currentCall = response;   

            } else {
                console.log('Oops! Something went wrong.');
                console.log('Status:', status);
                console.log('Response:', response);

                err = response;
            };

            thisSocket.emit('trigger call', response);
        
        });

    });
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


// private functions




module.exports = manager;
