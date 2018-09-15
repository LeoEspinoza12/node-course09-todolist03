const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todolist: {
    type: String,
    required: true
  },
  status: {
    type: String,
    require: true
  }
}, {
  timestamps: true
});


// later we must POPULATE THE USER INFORMATION 

var ToDoList = mongoose.model('ToDoList', todoSchema);

module.exports = ToDoList





