var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId ,
    fname : String,
    lname : String ,
    id :  String,
    email :String ,
    password : String,
    avatar : String,
    role : String
});

module.exports = mongoose.model('User',userSchema);
