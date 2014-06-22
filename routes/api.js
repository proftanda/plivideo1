var express = require('express');
var router = express.Router();
var plivo = require('plivo-node');
var currentCall = {};

/* API request logging */

router.post('*', function(req, res, next) { 

	console.log('API request', req.body);
	next();

});

/* Trigger call */

router.post('/triggercall', function(req, res) {
	
	console.log(plivo);

	var p = plivo.RestAPI(require('../../config'));

	console.log(p);

    var params = {
        from: '17852929203',
        to: '16463712714',
        answer_url: 'http://imadeatest.com:3002/api/answer_url',
    };

	// make the call
   	console.log('Making the call!');

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
        }

        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });

});


/* Plivo answer_url handler */

router.post('/answer_url', function(req, res) {

	var r = plivo.Response();

  	// is it currentCall?
  	if (req.body.RequestUUID === currentCall.request_uuid) {
  		
  		console.log('RequestUUID matches currentCall');
  		console.log('Event:', req.body.Event);


  		// is it someone picking up? 
  		if (req.body.Event === 'StartApp') {

		 	// Yes...
			
  			// create a response

  			// add the Speak element
  			// Speak accepts both "body" and "attributes" as params.
  			// note that "loop" is a valid attribute for Speak element - https://www.plivo.com/docs/xml/speak/
  			r.addSpeak('Hello world!', { loop: 2 });

  			// add the Wait element
  			// Wait accepts only "attributes" as a param - https://www.plivo.com/docs/xml/wait/
  			r.addWait({ length: 3 });

  			// add the DTMF element
  			// DTMF accepts only "body" as a param - https://www.plivo.com/docs/xml/dtmf/
  			r.addDTMF('12345');


  			console.log(r.toXML());
  		
  			// render as Plivo XML
  			res.send(r.toXML());

  		}


  	} else {

  		console.log('RequestUUID doesn\'t match');

  	}

});





module.exports = router;
