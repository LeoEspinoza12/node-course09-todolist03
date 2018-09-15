const moment = require('moment');

module.exports = {


  generateTime: function (date, format) {
    return moment(date).format(format);
  },

  alertThis: function(){
    
    
    console.log('it is working')
  }
};