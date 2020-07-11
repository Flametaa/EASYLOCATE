var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

//Selectionner tous les utilisateurs
router.get('/', function(req, res, next) {
    User.find().exec().then(function (docs) {
        if (docs.length===0) res.status(200).json({error: true,
            message: "Nothing Found",success : false});
        else res.status(200).json({user: docs,
        error: false , success: true});
    }).catch(function (err) {
        res.status(500).json({message: err,
        error: true , success : false})

    });
});

//login
router.post('/login',function (req,res) {
    var email = req.body.email;
    var pass = req.body.password;
    User.find({email:email}).exec().then(function(docs){
        if (docs.length===0) res.status(200).json({error: true, success :false,
            message: "Wrong Username"});
        else if (bcrypt.compareSync(pass, docs[0].password)===false){
            res.status(200).json({message: "Wrong Password", success : false,
                error:true});
        }
        else res.status(200).json({user: docs[0],
            error: false , success :true});
    }).catch(function (err) {
        res.status(500).json({message: err,
            error: true,success: false})

    });
});

//Créer un nouvel utilisateur
router.post('/',function (req,res){
    var fname = req.body.fname;
    var id = req.body.id;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var avatar = req.body.avatar;
    var role = req.body.role;
    var user = new User({
        _id: new mongoose.Types.ObjectId(),
        fname: fname,
        lname : lname ,
        id: id,
        email : email ,
        password: hash,
        role : role ,
        avatar : avatar
    });
    user.save().then(function (result){
        res.status(200).json({
            message : "User Created",
            User: result,
            error: false,
            success : true
        });

    }).catch(function (err){
        res.status(500).json({
            message: err,
            error: true,
            success : false
        })
    } );


})

//search
router.get('/search/:fname',(req,res)=>{

    User.findOne({
        fname:req.params.fname
    }, (err, doc) => {
        if (err) throw err;
        
        if (!doc) {
            res.json({
                message: 'user does not exist',
                success: false
            });
            return;
        }

        res.send(doc);

    });
});

//delete user

router.delete('/delete/:email',(req,res)=>{

    User.findOneAndRemove({
        email:req.params.email
    }, (err, doc) => {
        if (err) throw err;
        if (!doc) {
            res.json({
                message: 'user does not exist',
                success: false
            });
            return;
        }
        res.json({
            message: 'user deleted',
            success: true

        });
    })
});

//change password
router.post('/update/:email' , function (req,res) {
    var email = req.body.email ;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    User.updateOne({email :email},{$set :{ password: hash}},function(err,resultat){
        if (err) throw err ;
        if (!resultat) {res.json({message : 'user does not exist', success :false}); return;}
        res.json({message :'user updated',success:true});
    });

})
module.exports = router;
