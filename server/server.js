const request = require('request');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const port = 3001;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
useMongoClient=true;
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '../../pages/log.html'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3003, function () {
  console.log('Express app listening on port 3003');
});


//server.listen(process.env.PORT || port);
//server.listen(port, '192.168.1.10');
server.listen(process.env.PORT || port, '0.0.0.0');
console.log(`Server running on port: ${port} ...`);

app.use(express.static(__dirname + '/public'));

//sample presentation
const presentation = {
  username: 'Dr.suhel',
  url: 'http://192.168.1.10:3001/seminars/default',
  size: 9,
  num: 1,
  event: 'first'
};

//list of current joined users
users = [];

function emitPresentation(p){
  io.emit('presentation',
    {
      username: p.username,
      url: p.url,
      size: p.size,
      num: p.num,
      event: p.event
    }
  )
}

io.on('connection', (socket) => {

  socket.on('disconnect', function () {
    console.log(socket.username + ' has left');
    if (socket.username) {
      users.splice(users.indexOf(socket.username), 1);
      console.log('remaining users : '+ users);
      io.emit('users-changed',
        {
          user: socket.username,
          event: 'left'
        });
    }
  });

  socket.on('set-username', username => {
    if (username in users) return;
    socket.username = username;
    users.push(username);
    console.log('upated users : '+ users);
    
    console.log(socket.username + ' has joined');
    io.emit('users-changed',
      {
        username: username,
        event: 'join'
      });
  });

  socket.on('which-presentation', () => {
    console.log('which presentation from ' + socket.username);
    console.log(JSON.stringify(presentation))
    emitPresentation(presentation);
  });


  socket.on('set-presentation', (url) => {
    console.log('set-presentation, configUrl: ' + url);

    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (error) {
        console.error(error);
        return;
      };
      presentation.username = body.username;
      presentation.url = body.url;
      presentation.size = body.size;
      presentation.num = body.num;
      presentation.event = body.event;

      console.log(presentation);
      emitPresentation(presentation);
    })
  });

  socket.on('set-slide', p => {
    console.log('set-slide ' + JSON.stringify(p));

    // if (p.username !== this.presentation.username)
    //   return;
    if (p.event === 'next') {
      if (presentation.num >= presentation.size)
        return;
      presentation.num += 1;
    }else if (p.event === 'prev') {
      if (presentation.num <= 1) return;
      presentation.num -= 1;
    } else if (p.event === 'last') {
      if (presentation.num >= presentation.size)
        return;
      presentation.num = presentation.size;
    } else if (p.event === 'first') {
      if (presentation.num <= 1) return
      presentation.num = 1;
    }
    emitPresentation(presentation)
  });

});


