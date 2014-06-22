
// DOM Ready =============================================================

$(document).ready(function() {

   // Update User button click
    $('#btnTriggerCall').on('click', APP.triggerCall);

});


var APP = {};


// Functions =============================================================

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





