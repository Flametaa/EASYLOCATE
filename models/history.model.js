var mongoose = require('mongoose');

var histSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    id: String,
    date: { type: Date, default: Date.now },
    place: String

});

module.exports = mongoose.model('History',histSchema);

