var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index-v010', { title: 'PLIVIDEO1' });
});

router.get('/test', function(req, res) {
  res.render('test', { title: 'Test Post' });
});

router.get('/video', function(req, res) {
  res.render('video', { title: 'Video Player' });
});


module.exports = router;
