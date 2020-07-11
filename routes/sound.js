var express = require('express');
var router = express.Router();
var Sound = require('../models/sound.model');
var mongoose = require('mongoose');
const multer  = require('multer') //use multer to upload blob data
const upload = multer();
const fs = require('fs')
var History = require('../models/history.model')

//Get All Sounds In Database
router.get('/', function(req, res, next) {
    Sound.find().exec().then(function (docs) {
      if (docs.length===0) res.status(200).json({message: "Nothing Found",
      error:true});
      else res.status(200).json({sound: docs,
      error:false});
    }).catch(function (err) {
        res.status(500).json({message: err,
        error: true})

    });
});


// Identify Person By Sound
router.get('/:en', function(req, res, next) {
    var en = req.params.en;
    Sound.find({encryption: en}).exec().then(function (docs) {
        if (docs) res.status(200).json({sound: docs,
        error:false});
        else res.status(200).json({message: "Nothing Found",
        error: true});
    }).catch(function (err) {
        res.status(500).json({message: err,
        error: true})

    });
});



//Create New Sound
router.post('/',function (req,res){
    var name = req.body.name;
    var en = req.body.en;
    var id = req.body.id;
    var sound = new Sound({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        encryption: en,
        id: id,
    });
    sound.save().then(function (result){
        res.status(200).json({
            message : "Sound Created",
            sound: result,
            error:false
        });
    }).catch(function (err){
        res.status(500).json({
            message:err,
            error: true
        })
    } );


});


router.post('/recognize', upload.single('soundBlob'), function (req, res, next) {
    // console.log(req.file); // see what got uploaded
    let name = new mongoose.Types.ObjectId();
    let uploadLocation = 'C:\\Users\\asus\\Documents\\JAVA\\pist\\public\\sound\\'+name+'.wav';
    fs.writeFileSync(uploadLocation, Buffer.from(req.body.file,'base64'));
    const { exec } = require('child_process');

    let line = 'py -2 C:/Users/asus/Documents/JAVA/pist/sound_recognition/test.py C:/Users/asus/Documents/JAVA/pist/public/sound/'+name+'.wav'
    exec(line, (err, stdout, stderr) => {
        stdout = JSON.parse(stdout)
        if (err) {
            console.log(err.message)
            res.status(500);
            return;
        }
        if (stderr){
            console.log(stderr.message)
            res.status(500);
            return;
        }

        // the *entire* stdout and stderr (buffered)
        let recognized_id = stdout.person;
        let place  = req.body.place;
        if (recognized_id!=='unknown'){
            console.log(recognized_id+" "+stdout.probability);
            var history = new History({
                _id: new mongoose.Types.ObjectId(),

                id: recognized_id,
                place: place
            });
            history.save().then(function (result){
                res.status(200).json({
                    Message : "History Created",
                    History: result,
                });

            }).catch(function (err){
                res.status(500).json({
                    err:err
                })
            } );



        }
        else {
            console.log('unknown'+" "+ stdout.probability);
            res.status(200).json({
                Message : "Unknown",

            })
        }

/*
        fs.unlink(uploadLocation, function (err) {
            if (err) console.log(err.message);

        });
*/
    });

})
module.exports = router;
