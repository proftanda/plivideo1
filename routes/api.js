var express = require('express');
var router = express.Router();
var plivo = require('plivo-node');
var manager = require('../manager');


/* API request logging */

router.post('*', function(req, res, next) { 

	console.log('API request', req.body);
	next();

});


/* Plivo answer_url handler */

router.post('/answer_url', function(req, res) {

  theresponse = manager.handleAPI(req);
  console.log('here\'s the response to send:', theresponse);
  
	res.send(theresponse);

});


/* Trigger call */

router.post('/triggercall', function(req, res) {
  
  console.log(plivo);

  var p = plivo.RestAPI(require('../../config'));

  console.log(p);

    var params = {
        from: '17852929203',
        to: '16463712714',
        answer_url: 'http://imadeatest.com:3030/api/answer_url',
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



module.exports = router;
