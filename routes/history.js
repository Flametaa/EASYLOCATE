var express = require('express');
var router = express.Router();
var History = require('../models/history.model');
var mongoose = require('mongoose');
var User = require('../models/user.model')
//Get All Sounds In Database
router.get('/', function(req, res, next) {
    History.find().exec().then(function (docs) {
        if (docs.length===0) res.status(200).json({error: "Nothing Found"});
        else res.status(200).json(docs);
    }).catch(function (err) {
        res.status(500).json({error: err})

    });
});


// find history by user
router.get('/:email', function(req, res, next) {
    var mail = req.params.email;

    User.find({email:mail}).exec().then(docs=>{
        if (docs) {
            let  id = docs[0].id;
            History.find({id: id}).sort('-date').exec().then(function (docs) {
                if (docs) res.status(200).json({"history" : docs});
                else res.status(200).json({error: "Nothing Found"});
            }).catch(function (err) {
                res.status(500).json({error: err})
            });
        }
        else {
            res.status(200).json({error: "Nothing Found"});
            return;
        }
    } ).catch(function (err) {
        res.status(500).json({error: err})
        return;
    });
});

router.get('/byid/:id', function(req, res, next) {
    var id = req.params.id;



    History.find({id: id}).exec().then(function (docs) {
        if (docs) res.status(200).json({"history" : docs});
        else res.status(200).json({error: "Nothing Found"});
    }).catch(function (err) {
        res.status(500).json({error: err})

    });
});
//Create New History
router.post('/',function (req,res){
    var name = req.body.name;
    var id = req.body.id;
    var place = req.body.place;

    var history = new History({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        id: id,
        place: place
    });
    history.save().then(function (result){
        res.status(200).json({
            Message : "History Created",
            Sound: result
        });

    }).catch(function (err){
        res.status(500).json({
            err:err
        })
    } );

})

module.exports = router;
