var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var fr = require('face-recognition')

var soundRouter = require('./routes/sound');
var imageRouter = require('./routes/image');
var userRouter = require('./routes/user');
var historyRouter = require('./routes/history');
var cors = require('cors')
var app = express();

// view engine setup

mongoose.connect('mongodb://localhost:27017/Piste', { useNewUrlParser: true }).then(function (result) {
  console.log("connected to DB");
}).catch(function (err) {
  console.log(err);
});
mongoose.Promise = global.Promise;
app.use(cors());
app.use(express.static('uploads'))
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true , parameterLimit : 50000 }));
app.use(bodyParser.json()) ;
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sounds', soundRouter);
app.use('/images', imageRouter);
app.use('/users', userRouter);
app.use('/history',historyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({"message" : err.message,
  "error": err});
});

module.exports = app;
