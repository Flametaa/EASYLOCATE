
var process = require('child_process').spawn('python', ['face_datasets1.py']);
let ws = require('ws');
const con = new ws('ws://localhost:3000/path', {
    perMessageDeflate: false
});
let result = '';
con.on('open', function open() {
    console.log("opened")

    })

process.stdout.on('data', data => {
    result += data.toString();
    try {
        // If JSON handle the data
        let jj = JSON.parse(result);
        var tutu = result;
        result = "";
        console.log(jj);
        con.send(tutu);

    } catch (e) {
        // Otherwise treat as a log entry
        //console.log(result);
    }
    // Or Buffer.concat if you prefer.
});
