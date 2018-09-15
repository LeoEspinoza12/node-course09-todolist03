// require passport module
const passport = require('passport')
// require passport-local module
const LocalStrategy = require('passport-local').Strategy
// require the users model
const User = require('./models/users');



// we will authentica the user and the we will export 
// the it so that we can use this module
exports.local = passport.use(new LocalStrategy(User.authenticate()))

// then we will serialize the user
passport.serializeUser(User.serializeUser())

// then we will deserialize the user
passport.deserializeUser(User.deserializeUser())