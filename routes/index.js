var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '100 Letters' });
});

router.get('/login', function(req, res) {
	res.render('login', { message: req.flash('loginMessage'),
                          title: 'Login'});
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
