const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({

// we will remove the username and password in this 
// schema because we will use the passport module
  // username: {
  //   type: String,
  //   required: true
  // },
  // password: {
  //   type: String,
  //   require: true
  // },
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});



userSchema.plugin(passportLocalMongoose)


var User = mongoose.model('User', userSchema);

module.exports = User
