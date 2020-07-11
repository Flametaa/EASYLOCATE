var mongoose = require('mongoose');

var soundSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String ,
    encryption : [String],

});

module.exports = mongoose.model('Sound',soundSchema);
