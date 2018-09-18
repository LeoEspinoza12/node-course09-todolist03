// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const hbs = require('express-handlebars')

// const session = require('express-session')
// const FileStore = require('session-file-store')(session)



// here we will add the passport
const passport =  require('passport');
const authenticate = require('./authenticate')



var listsRouter = require('./routes/lists');
var usersRouter = require('./routes/users');


const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/toDo', { useNewUrlParser: true})

var app = express();


const {generateTime, alertThis} = require('./helpers/handlebars-helpers')

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'list', layoutsDir: __dirname + '/views/layouts/', helpers: {generateTime: generateTime, alertThis: alertThis}}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));


// session id
app.use(session({
  name: 'session-id',
  secret: '12345-67890',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

// we will use the passport to 
// initialize the session
app.use(passport.initialize());
app.use(passport.session());

// we will place this route before the authentication
// since we want this route available without authentication
app.use('/', usersRouter);

// this is the authentication
function auth(req, res, next) {
  console.log(`Response Headers App JS: `, req.headers, ` \n\n `);
    if (!req.user) {
      console.log('there was an error in the appjs')
        res.statusCode = 401;
        res.render('user/login', {
          'text': 'to do list invalid user',
          'nameAlert': 'You have to login first'
        })
    } else {
        console.log('appjs was good for the running')
        next()
    }
}

// then we will use the function auth so that we can run authorization 
// whenever someone wants to  access a route outside the users route above
app.use(auth)

// this route will be now be available in the event that the 
// authentication is verified
app.use('/lists', listsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('There was an error')
  next(createError(404));
});

// this is basically a customed middleware that is called for every 
// request and this will pass an error if there is any
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
