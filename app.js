const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

require('./config/passport');

const auth = require('./middlewares/auth');

const userRouter = require('./routes/users');
const jobOpeningRouter = require('./routes/jobOpenings').router;
const jobDetailsRouter = require('./routes/jobDetails');

const app = express();

const db = require('./database/db');
db.connectToDatabase("mongodb://127.0.0.1/nagp-employee-portal");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth.isAuthenticated());

app.get('/ui/register', function (req, res) {
  res.render('register');
});

app.get('/ui/login', function (req, res) {
  res.render('login');
});

app.get('/', function (req, res) {
  res.render('home');
});

app.use('/users', userRouter);
app.use('/jobs', jobOpeningRouter);
app.use('/ui/jobDetails', jobDetailsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
