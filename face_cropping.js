
var path = require('path');
var fs = require('fs');
var fr = require('face-recognition');


const dataPath = path.resolve('./data/toCrop/');
const savePath = path.resolve('./data/test/');

const allFiles = fs.readdirSync(dataPath);
allFiles.map(function (f) {

    const image = fr.loadImage(dataPath+"\\"+f);
    const detector = fr.FaceDetector();
    const targetSize = 150;
    const faceImages = detector.detectFaces(image, targetSize);
    faceImages.forEach((img) => fr.saveImage(savePath+"\\" + f, img));
    fs.unlink(dataPath+"\\"+f, function (err) {

        if (err) throw err;
        console.log("image created");
    });
})
