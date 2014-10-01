var mongoose = require('mongoose');

var letterSchema = mongoose.Schema({
    id: integer,
    ownerID: string,
    recepientID: string,
    title: String,
    content: String
});

module.exports = mongoose.model('Letter', letterSchema);