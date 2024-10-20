var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Role = require('./models/role.model')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//Dang ky router movie
var movieRouter = require('./routes/movie');
//ket noi mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lethanhtrung28042000:1@cluster0.dtlad.mongodb.net/demo?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB Connected')
    initial();
  })
  .catch(err => console.log(`Error: ${err}`));
var app = express();

const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Nếu dùng HTTPS, bạn cần bật tùy chọn này
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//Su dung router
app.use('/movie', movieRouter);

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


const initial = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      // Thêm vai trò 'user'
      await new Role({ name: "user" }).save();
      console.log("added 'user' to roles collection");

      // Thêm vai trò 'admin'
      await new Role({ name: "admin" }).save();
      console.log("added 'admin' to roles collection");
    }
  } catch (err) {
    console.log("error", err);
  }
};
module.exports = app;
