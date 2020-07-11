var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    encryption : String,
    id : String,
});

module.exports = mongoose.model('Image',imageSchema);
