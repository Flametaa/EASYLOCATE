var path = require('path');
var fs = require('fs');
var fr = require('face-recognition');
var mongoose = require('mongoose');

var dataPath = path.resolve('./data/faces');
var classNames = ['id_1','id_2','id_3','id_4','id_5','id_6','id_7','id_8'];


const allFiles = fs.readdirSync(dataPath)

const imagesByClass = classNames.map(c =>
    allFiles
        .filter(f => f.includes(c))
.map(f => path.join(dataPath, f))
.map(fp => fr.loadImage(fp))
)


const numTrainingFaces = 37;
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces));

const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces));
//console.log(testDataByClass)
const recognizer = fr.FaceRecognizer()

trainDataByClass.forEach((faces, label) => {
    const name = classNames[label]
    recognizer.addFaces(faces, name)
})

const modelState = recognizer.serialize()
fs.writeFileSync('model.json', JSON.stringify(modelState))