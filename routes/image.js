var express = require('express');
var router = express.Router();
var Image = require('../models/image.model');
var mongoose = require('mongoose');
var History = require('../models/history.model')
var cv = require('opencv4nodejs')
var path = require('path');
var fs = require('fs');
var fr = require('face-recognition');
var frcv = require('face-recognition').withCv(cv)
var Last = require('../models/lastSeen.model');


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
//Get All Images In The Database
router.get('/', function(req, res, next) {
  Image.find().exec().then(function (docs) {
      if (docs) res.status(200).json({image: docs,
      error: false});
      else res.status(404).json({message: "Nothing Found",
      error: true});
  }).catch(function (err) {
    res.status(500).json({message: err,
    error: true})

  });
});

//Create New Image
router.post('/',function (req,res){

    const savePath = path.resolve('./data/faces');

    const allFiles = fs.readdirSync(savePath)

    allFiles.map(function (f) {

        const base64Image = base64_encode(savePath+"\\"+f);
        const id = f.split(" ")[0];

        var imageBD = new Image({
            _id:new mongoose.Types.ObjectId(),
            id: id,
            encryption:base64Image
        });
        imageBD.save().then(function (result){
            res.status(200).json(result);

        }).catch(function (err){
            throw err;
        } );
    })




})

//image recognize



var classNames = ['id_1','id_2','id_3','id_4','id_5','id_6','id_7','id_8'];
const recognizer = fr.FaceRecognizer()
const modelState = require('../model.json')

recognizer.load(modelState)


router.post('/recognize',function (req,res){
    var place = req.body.place;
    var encryption = req.body.image;
    var buf = Buffer.from(encryption,'base64');
    var mama = cv.imdecode(buf);
    mama = frcv.CvImage(mama);

    mama = fr.cvImageToImageRGB(mama)

            const testDataByClass = Array(mama)


            testDataByClass.forEach((face, label) => {
                const prediction = recognizer.predictBest(face)
                const distance = prediction.distance;

                const datenow = new Date(Date.now());

                if (distance<0.61){

                    console.log("person : " + prediction.className+ " probability : "+ prediction.distance);
                    Last.findOne({id:prediction.className , place:place}).exec().then(
                        docs=>{
                            if (docs){
                                if(Math.abs(docs.date.getTime()-datenow.getTime())>60000){


                                    Last.updateOne({id:prediction.className, place:place},{$set :{date:datenow}}).then(result=>{

                                    }).catch(err=>console.log(err.message))
                                    var history = new History({
                                        _id: new mongoose.Types.ObjectId(),
                                        id: prediction.className,
                                        place: place
                                    });
                                    history.save().then(function (result){
                                        res.status(200).json({
                                            Message : "History Created",
                                            History: result,

                                            "distance" : prediction.distance
                                        });

                                    }).catch(function (err){
                                        res.status(500).json({
                                            err:err
                                        })
                                    } );
                                }
                                else{

                                    res.status(500).json({err:true});
                                }


                            }
                            else {

                                var last = new Last({
                                    id: prediction.className,
                                    place: place,
                                    date: datenow
                                })
                                last.save().then(result => {
                                    console.log(result);
                                }).catch(err => console.log(err.message))
                                var history = new History({
                                    _id: new mongoose.Types.ObjectId(),

                                    id: prediction.className,
                                    place: place
                                });
                                history.save().then(function (result) {
                                    res.status(200).json({
                                        Message: "History Created",
                                        History: result,

                                        "distance": prediction.distance
                                    });

                                }).catch(function (err) {
                                    res.status(500).json({
                                        err: err
                                    })
                                });
                            }
                        }


                    ).catch(err=>{console.log(err.message)
                    res.status(500);
                    })







                }

                else {

                    console.log("person : " +"unknown" + " probability : "+ prediction.distance);
                    res.status(200).json({
                        "person": "unknown",
                        "distance": prediction.distance
                    });
                }

            });





})


module.exports = router;
