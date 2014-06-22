var express = require('express');
var router = express.Router();

/* GET answer_url */

router.post('*', function(req, res) {

  console.log('POST-REQUEST: '+ req + "\nRESULT: " + res);

  return res;

});

router.get('*', function(req, res) {

  console.log('GET-REQUEST: '+ req + "\nRESULT: " + res);
  res.render('index', { title: 'Express' });
  // return res;

});


module.exports = router;
