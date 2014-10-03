var mongoose = require('mongoose');
var Letter = require('../models/user.js')

var letterSchema = mongoose.Schema({
    id: Number,
    _ownerID: { type: Number, ref: 'User' },
    _recepientID: { type: Number, ref: 'User' },
    title: String,
    content: String
});

module.exports = mongoose.model('Letter', letterSchema);