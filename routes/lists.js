var express = require('express');
const bodyParser = require('body-parser');
var listsRouter = express.Router();

const ToDoList = require('../models/toDoList')



listsRouter.use(bodyParser.json())

// setting the layouts for all listRouter routes
listsRouter.all('/*', (req, res, next) => {
  req.app.locals.layout = 'index';
  next();
})


listsRouter.route('/')
.get((req, res, next) => {
   var todos = [];
   var doneList = [];
  ToDoList.find({})
    .then((lists) => {
      lists.forEach((list) => {
        if (list.status == 'done') {
          doneList.push(list)
        } else {
          todos.push(list)
        }
      })
      res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html')
          res.render('lists/index', {lists: todos, done: doneList})
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
  var todos = [];
  var doneList = [];

    ToDoList.create(req.body)
      .then((toDo) => {
        if (toDo) {
          ToDoList.find({})
            .then((lists) => {
              lists.forEach((list) => {
                if (list.status == 'done') {
                  doneList.push(list)
                } else {
                  todos.push(list)
                }
              })
                res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/html')
                    res.render('lists/index', {lists: todos, done: doneList})
            })
        }
      console.log(`You have entered new list ${toDo}`)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
    res.end('PUT Operation is not supported');
})
.delete((req, res, next) => {
  res.statusCode = 403;
    res.end('DELETE Operation is not supported')
})




/////////////////////////////////////////////////////////
listsRouter.get('/edit:_id', (req, res, next) => {
  var todos = [];
    var doneList = [];
      var editlist = [];
  
  ToDoList.find({})
    .then((lists) => {
      lists.forEach((list) => {
        if(list._id == req.params._id) {
          editlist.push(list)
        } else if (list.status == 'done') {
          doneList.push(list)
        } else {
          todos.push(list)
        }
      })
      res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html')
          res.render('lists/edit', {lists: todos, done: doneList, edit: editlist})
  }, (err) => next(err))
    .catch((err) => next(err))
})

listsRouter.post('/edit', (req, res, next) => {
  var todos = [];
    var doneList = [];
  ToDoList.findById(req.body._id)
  .then((list) => {
    console.log(list)
      list.todolist = req.body.todolist;
      list.status = req.body.status;
      list.save()
        .then((newlist) => {
          ToDoList.find({})
            .then((lists) => {
              lists.forEach((list) => {
                if (list.status == 'done') {
                  doneList.push(list)
                } else {
                  todos.push(list)
                }
              })
              res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html')
                res.render('lists/index', { lists: todos, done: doneList })
            })
        })
    }, (err) => next(err))
    .catch((err) => next(err))
})

listsRouter.post('/:id', (req, res, next) => {
  ToDoList.findByIdAndRemove(req.params.id)
    .then((resp) => {
      console.log(`response after delete: ${resp}`);
        res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
            res.redirect('/lists')
    }, (err) => next(err))
      .catch((err) => next(err))
})


listsRouter.post('/change/:id', (req, res, next) => {
  var todos = [];
    var doneList = [];
      var editlist = [];
  
  ToDoList.findById(req.params.id)
    .then((list) => {
      list.status = 'pending';
      list.save()
        .then((newlist) => {
          ToDoList.find({})
            .then((lists) => {
              lists.forEach((list) => {
                if (list._id == req.params.id) {
                  editlist.push(list)
                } else if (list.status == 'done'){
                  doneList.push(list)
                } else {
                  todos.push(list)
                }
              })
          res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html')
              res.render('lists/edit', {lists: todos, done: doneList, edit: editlist})
        })
      })
    })
})


module.exports = listsRouter;
