var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */ 

    router.get('/', function(req, res) {
  res.render('index', { title: '100 Letters' });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/login',
        failureRedirect : '/'
    }));

router.get('/login', isLoggedIn, function(req, res) {
	res.render('login', { user : req.user,
                          title: 'Login'});
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
module.exports = router;
