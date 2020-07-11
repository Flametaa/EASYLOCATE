var path = require('path');
var fs = require('fs');
var fr = require('face-recognition');
var mongoose = require('mongoose');


var dataPath = path.resolve('./data/faces');

var classNames = ['id_1','id_2','id_3','id_4','id_5','id_6','id_7','id_8'];


const allFiles = fs.readdirSync(dataPath)

const testDataByClass = allFiles
        .map(f => path.join(dataPath, f))
        .map(fp => fr.loadImage(fp))



const recognizer = fr.FaceRecognizer()
const modelState = require('./model.json')

recognizer.load(modelState)

const errors = classNames.map(_ => [])
testDataByClass.forEach((face, label) => {
    const name = classNames[label]
    console.log('testing %s', allFiles[label])

        const prediction = recognizer.predictBest(face)
        const distance = prediction.distance;
       //console.log('%s (%s)', prediction.className, (prediction.distance*100).valueOf());
          if (distance<0.6)
       // if (prediction.className === name )
              console.log(prediction.className);
        else console.log("unknown");

    });

