var express = require('express');
var router = express.Router();
var passport = require('passport');
var facebook = require('../models/fbReqs.js');
var Letter = require('../models/letter.js');
var User = require('../models/user.js');
var Async = require('async');
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
       Async.waterfall([
            function (cb) {
                Letter.find({ownerID: req.user.facebook.id}, 'title recepientID', function(err, lettersSent){
                    if (err)
                        console.log(err);
                    else
                    {
                        var sentLettersUsers = []; 
                        var getUsers = function (a) 
                        {   
                            if (a < lettersSent.length) {
                            User.findOne({'facebook.id': lettersSent[a].recepientID}, 'facebook', function(err, userFound){
                                    if (err)
                                        console.log(err);
                                    else
                                    {
                                        sentLettersUsers[sentLettersUsers.length] = userFound;
                                        getUsers(a += 1);
                                    }
                                });
                            }
                            else
                            {
                                cb(null, { sentLetters: lettersSent, sentLettersUsers: sentLettersUsers });
                            }
                        };
                        getUsers(0);
                    }
                });
            },

            function (input, cb) {
                Letter.find({recepientID: req.user.facebook.id}, 'title ownerID', function(err, lettersReceived){
                    if (err)
                        console.log(err);
                    else
                    {
                        var receivedLettersUsers = [];
                        var getUsers = function (a) 
                        {   
                            if (a < lettersReceived.length) {
                                User.findOne({'facebook.id': lettersReceived[a].ownerID}, 'facebook', function(err, userFound){
                                    if (err)
                                        console.log(err);
                                    else
                                    {
                                        console.log(userFound);
                                        receivedLettersUsers[receivedLettersUsers.length] = userFound;
                                        getUsers(a += 1);
                                    }
                                });
                            }
                            else
                            {
                                input.receivedLetters = lettersReceived;
                                input.receivedLettersUsers = receivedLettersUsers;
                                cb(null, input);
                            }
                        }
                        getUsers(0);
                    }
                });
            },

            function(input, cb) {
                console.log(input);
                input.title = 'My Letters';
                res.render('viewAllLetters', input);
            }
        ]);
    }
);

router.get('/letter', function(req, res) {
    var letterid = req.query.id;
    Async.waterfall([
        function(cb)
        {
            Letter.findOne({_id: letterid}, 'title content ownerID recepientID', function(err, letterRecieved){
                if (err)
                    console.log(err);
                else
                    cb(null, {letter: letterRecieved});
            });
        },
        function(input, cb)
        {
            User.findOne({'facebook.id': input.letter.ownerID}, 'facebook', function(err, owner){
                if (err)
                    console.log(err);
                else
                {
                    input.owner = owner;
                    cb(null, input);
                }
            });
        },
        function(input, cb)
        {
            User.findOne({'facebook.id': input.letter.recepientID}, 'facebook', function(err, recepient){
                if (err)
                    console.log(err);
                else
                {
                    input.recepient = recepient;
                    cb(null, input);
                }
            });
        },
        function(input, cb) {
            console.log(input);
            res.render('letter', input);
        }    
    ]);
});

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
