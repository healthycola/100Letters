var express = require('express');
var router = express.Router();
var passport = require('passport');
var facebook = require('../models/fbReqs.js');
var Letter = require('../models/letter.js');
var User = require('../models/user.js');
/* GET home page. */ 

router.get('/', function(req, res) {
  res.render('index', { title: '100 Letters' });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends' ] }));

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
    facebook.fbAPI(req.user.facebook.token, function(data) {
        console.log(data);
        res.render('writeLetter', 
            { user : req.user,
              title: 'Write a Letter', 
              friends: data});
    });
    }
);

router.get('/viewAllLetters', isLoggedIn, 
    function(req, res) {
        Letter.find({ownerID: req.user.facebook.id}, 'title', function(err, lettersSent){
            if (err)
                console.log(err);
            else
            {
                console.log(lettersSent);
                Letter.find({recepientID: req.user.facebook.id}, 'title', function(err, lettersReceived){
                    if (err)
                        console.log(err);
                    else
                    {
                        res.render('viewAllLetters', { sentLetters : lettersSent,
                            receivedLetters: lettersReceived,
                            title: 'All Letters'});
                    }
                });
            }
        });
    }
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    {
        return next();
    }

    res.redirect('/');
}

router.post('/newLetter', function(req, res) {
    var letter = new Letter();
    //console.log(req.body);
    letter.ownerID = req.user.facebook.id;
    letter.recepientID = req.body.recipient;
    letter.title = req.body.letterTitle;
    letter.content = req.body.letterContent;

    letter.save(function(err){
        if (err)
            throw err;
    });
    res.redirect('/');

    /*
    User.findOne({ 'facebook.id' : req.body.recipient}, '_id', function(err, person)
    {
        if (err) return handleError(err);
        saveLetter(person._id);
    });
    */
    
});
module.exports = router;
