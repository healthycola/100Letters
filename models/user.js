var mongoose = require('mongoose');
var Letter = require('../models/letter.js')

var userSchema = mongoose.Schema({
    facebook : {
        id: String,
        token: String,
        email: String,
        name: String,        
    },
    lettersWritten : [{type: mongoose.Schema.Types.ObjectId, ref: 'Letter'}]
});

//userSchema.index({facebook.id: 1});

module.exports = mongoose.model('User', userSchema);