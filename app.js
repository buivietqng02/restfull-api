const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose= require('mongoose');

const indexRouter = require('./routes/index');


const app = express();
const fs= require('fs')
const morgan= require('morgan');
const { constants } = require('buffer');
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


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
  res.render('error');
});
try {
  mongoose.connect(process.env.mongoDBUrl, {useNewUrlParser: true});

}
catch (err) {
  console.log("error when connect to mongoDB");
  


}
const db= mongoose.connection;
db.once('open', ()=> console.log(`connected to mongoose db`))
db.once('error', ()=> console.log(`error when connect to mongoose db`))


module.exports = app;
