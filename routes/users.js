var express = require('express');
const bodyParser = require('body-parser');
var usersRouter = express.Router();

const passport = require('passport');

const User = require('../models/users')

usersRouter.use(bodyParser.json())

// setting the layout for the users
usersRouter.all('/*', (req, res, next)=> {
  req.app.locals.layout = 'user';
  next();
})

// setting the users registration
usersRouter.get('/', (req, res, next) => {
  res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
      res.render('user/login', {'text': 'to do list'})
})

// usersRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
//   console.log('Request headers LOGIN: ', req.headers);
//   console.log('Request session LOGIN: ', req.session);
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.render('user/login', {'text': 'to do list LOGIN'});
// })

usersRouter.post('/login', (req, res, next) => {
  console.log('login response.header: ', res.header)
  passport.authenticate('local', {
    successRedirect: '/lists',
    failureRedirect: '/',
  })(req, res, next);
});

// setting the users login
usersRouter.route('/register')
  .get((req, res, next) => {
    res.render('user/register', {'text': 'to do list'});
})
.post((req, res, next) => {
  var username = req.body.username;
    var password = req.body.password;

  // here we will use the register method to register the user
  // but take note that this method does not use a promise(then)
    User.register(new User({username: username}), password, (err, user) => {
      if(err){
        console.log('this is the error:  ', err)
          console.log('this is the user:  ', user)
            console.log('Request headers Register: ', req.headers);
              console.log('Response headers Register: ', res.headers);
        res.statusCode = 405
          res.setHeader('Content-Type', 'text/html');
            res.render('user/register', {
              'text': 'to do list error', 
              'nameAlert': 'Username already exists',
              'username': username,
              'password': password})
      } else {
        passport.authenticate('local')(req, res, () => {
          console.log('this is the error:  ', err)
           console.log('this is the user:  ', user)
              console.log('Request headers Register: ', req.headers);
                console.log('Response headers Register: ', res.headers);
          res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
              res.render('user/login', {'text': 'You are registered'});
              // res.redirect('/lists')
        })
      }
    })
})





usersRouter.get('/logout', (req, res, next) => {
  if (req.session){
    res.statusCode = 200;
    req.session.destroy();
      res.clearCookie('session-id');
        res.redirect('/')
  } else {
    var err = new Error('You are not logged in');
      next(err)
  }
})





module.exports = usersRouter;









