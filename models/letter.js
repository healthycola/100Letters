var mongoose = require('mongoose');
var Letter = require('../models/user.js')

var letterSchema = mongoose.Schema({
    id: Number,
    ownerID: String,
    recepientID: String,
    title: String,
    content: String
});

module.exports = mongoose.model('Letter', letterSchema);