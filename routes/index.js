var express = require('express');
var router = express.Router();
var passport = require('passport');
var facebook = require('../models/fbReqs.js')
/* GET home page. */ 

router.get('/', function(req, res) {
  res.render('index', { title: '100 Letters' });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends' ]}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    })
);

router.get('/profile', isLoggedIn, 
    function(req, res) {
	res.render('profile', { user : req.user,
                          title: 'My Profile'});
    }
);

router.get('/logout', 
    function(req, res) {
	req.logout();
	res.redirect('/');
    }
);

router.get('/writeLetter', isLoggedIn, 
    function(req, res) {
    facebook.fbAPI(req.user.facebook.token);
    res.render('writeLetter', { user : req.user,
                          title: 'Write a Letter'});
    }
);

router.get('/viewAllLetters', isLoggedIn, 
    function(req, res) {
    res.render('viewAllLetters', { user : req.user,
                          title: 'All Letters'});
    }
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    {
        return next();
    }

    res.redirect('/');
}

module.exports = router;
