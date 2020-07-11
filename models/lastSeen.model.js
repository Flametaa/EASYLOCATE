var mongoose = require('mongoose');

var lastSchema = mongoose.Schema({
    id: String,
    date:  Date ,
    place:String

});

module.exports = mongoose.model('Last',lastSchema);


