var APP = {};

// DOM Ready =============================================================

$(document).ready(function() {

    // init socket.io
    APP.socket = io();
    console.log(APP.socket);

    // Update User button click
    $('#btnTriggerCall').on('click', APP.triggerCall);

    // Update User button click
    $('#btnTriggerCallio').on('click', APP.triggerCallio);

    // Update Test button click
    $('#btnTestPost').on('click', APP.testPost);

    // Handle incoming messages
    APP.socket.on('ping', function(msg) { console.log(msg); } );
   
    APP.socket.on('trigger call', function(msg) { console.log(msg); } );

    APP.socket.on('play', function(msg) { console.log(msg); } );
   
});


// Functions =============================================================

// Trigger Call with socket

APP.testPost = function (event) {

    event.preventDefault();


    var body = { TotalCost: '0.01200',
        Direction: 'inbound',
        HangupCause: 'NORMAL_CLEARING',
        From: '17852929203',
        Duration: '3',
        ALegUUID: 'ff32aee4-fbb8-11e3-8a2f-076b8ee5485e',
        BillDuration: '60',
        BillRate: '0.01200',
        To: '16463712714',
        AnswerTime: '2014-06-24 16:02:59',
        StartTime: '2014-06-24 16:02:52',
        CallUUID: 'ff32aee4-fbb8-11e3-8a2f-076b8ee5485e',
        ALegRequestUUID: '2f28bf07-fe71-4ef3-ba55-4603cc8fb131',
        RequestUUID: '2f28bf07-fe71-4ef3-ba55-4603cc8fb131',
        EndTime: '2014-06-24 16:03:01',
        CallStatus: 'completed',
        Event: 'StartApp'
    }

    console.log('ajax post');

    $.ajax({
            type: 'POST',
            data: body,
            url: 'api/answer_url',
            dataType: 'JSON'
        }).done(function( response ) {

            console.log('ajax response:', response);

        });
};

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


// Trigger Call

APP.triggerCall = function(event) {

    console.log("Triggering call..1");

    event.preventDefault();

    // Basic validation - increase errorCount if a field is blank
    var errorCount = 0;
    $('#phoneForm input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // check if errorCount is zero
    if (errorCount === 0) {

        // Yes...
        console.log("Triggering call..2");

        // make object with call details

        callDetails = {"to": $('#phoneForm fieldset inputPhoneNumber').val() };

        //  use Ajax to post object

        $.ajax({
            type: 'POST',
            data: callDetails,
            url: 'api/triggercall',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // If something goes wrong, alert the error message that our service returned
                alert('Triggered the call');

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in the fields');
        return false;
    }
};    





