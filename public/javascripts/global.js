var APP = {};

// DOM Ready =============================================================

$(document).ready(function() {

    // init socket.io
    APP.socket = io();
    console.log(APP.socket);

    // load script!

    

    // start script!

    APP.socket.on('ping', function(msg) { console.log(msg); } ); 
    APP.socket.on('trigger call', function(msg) { console.log(msg); } );
    APP.socket.on('script', function(msg) { console.log(msg); } );
    
   
});


// Functions =============================================================

// Trigger Call with socket

APP.triggerCallio = function(event) {

    var response ='';

    console.log("Triggering call io..1");

    event.preventDefault();

    // Basic validation - increase errorCount if a field is blank
    var errorCount = 0;
    $('#phoneForm input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // check if errorCount is zero
    if (errorCount === 0) {

        // Yes...
        console.log("Triggering call io..2");

        // make object with call details

        callDetails = {"to": $('#inputPhoneNumber').val() };

        //  send object to socket

        response = APP.socket.emit('trigger call', callDetails);
        console.log(response);
        return true;
    
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in the fields');
        return false;
    }
};    




