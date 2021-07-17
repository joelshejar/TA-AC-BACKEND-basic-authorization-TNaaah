var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var multer  = require('multer')

var mongoose = require('mongoose');
var auth = require('./middlewares/auth');

var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');

require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var podcastRouter = require('./routes/podcasts');

// mongoose.connect(
//   process.env.MONGO_DB,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   (err) => {
//     console.log(err ? err : 'Connected to database');
//   }
// );
mongoose.connect(
  'mongodb+srv://abhi:abhi1234@cluster0.u6ogw.mongodb.net/podcast?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log(err ? err : 'Connected to database');
  }
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(flash());

app.use(auth.userInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/podcasts', podcastRouter);
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
