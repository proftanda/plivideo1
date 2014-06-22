var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'PLIVIDEO1' });
});


/* POST make call */
router.post('/triggercall', function(req, res) {

	var p = req.p; // p is the plivo api connection object
	
    var params = {
        from: '17852929203',
        to: '16463712714',
        answer_url: 'http://imadeatest.com:3002/api/answer_url',
    };

	// make the call
   	console.log("Making the call!");

    p.make_call(params, function(status, response) {

    	var err = null;

        if (status >= 200 && status < 300) {
            console.log('Successfully made call request.');
            console.log('Response:', response);           
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
