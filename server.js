var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var crypto = require('crypto');
var multer = require('multer');
var mime = require('mime');

// var connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3307,
//     user: 'root',
//     password: '',
//     database: 'matcha'
// });

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'matcha'
});
connection.connect();

app.use(session({ 
          secret: 'ssshhhhh',
          resave: false,
          proxy: true,
          saveUninitialized: true
        }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/node_modules'));
app.set('view engine', 'ejs');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/user_img')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage, limits: { fileSize: 1500000 }}).single('uploadingFile');

app.post('/upload', function (req,res) {
    upload(req, res, function(err){
      if (err)
        res.send('false');
      else
      {
        var snap = 'user_snap'+req.body.id_snap;
        connection.query('SELECT user_snap_profile, user_snap1, user_snap2, user_snap3, user_snap4, user_snap5 FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
        {
          if (req.body.id_snap == 1)
          {
            if (!rows[0]['user_snap_profile'] && !rows[0]['user_snap2'] && !rows[0]['user_snap3'] && !rows[0]['user_snap4'] && !rows[0]['user_snap5'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap1: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else if (rows[0]['user_snap_profile'] == rows[0]['user_snap1'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap1: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap1: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            req.session.user.snap = req.file.filename;
            res.send(req.file.filename);
          }
          else if (req.body.id_snap == 2)
          {
            if (!rows[0]['user_snap_profile'] && !rows[0]['user_snap1'] && !rows[0]['user_snap3'] && !rows[0]['user_snap4'] && !rows[0]['user_snap5'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap2: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else if (rows[0]['user_snap_profile'] == rows[0]['user_snap2'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap2: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap2: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            req.session.user.snap = req.file.filename;
            res.send(req.file.filename);
          }
          else if (req.body.id_snap == 3)
          {
            if (!rows[0]['user_snap_profile'] && !rows[0]['user_snap1'] && !rows[0]['user_snap2'] && !rows[0]['user_snap4'] && !rows[0]['user_snap5'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap3: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else if (rows[0]['user_snap_profile'] == rows[0]['user_snap3'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap3: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap3: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            req.session.user.snap = req.file.filename;
            res.send(req.file.filename);
          }
          else if (req.body.id_snap == 4)
          {
            if (!rows[0]['user_snap_profile'] && !rows[0]['user_snap1'] && !rows[0]['user_snap2'] && !rows[0]['user_snap3'] && !rows[0]['user_snap5'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap4: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else if (rows[0]['user_snap_profile'] == rows[0]['user_snap4'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap4: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);

            else
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap4: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            req.session.user.snap = req.file.filename;
            res.send(req.file.filename);
          }
          else if (req.body.id_snap == 5)
          {
            if (!rows[0]['user_snap_profile'] && !rows[0]['user_snap1'] && !rows[0]['user_snap2'] && !rows[0]['user_snap3'] && !rows[0]['user_snap4'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap5: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else if (rows[0]['user_snap_profile'] == rows[0]['user_snap5'])
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap_profile: req.file.filename, user_snap5: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            else
              connection.query('UPDATE users SET ? WHERE ?', [{ user_snap5: req.file.filename }, { user_socket: req.session.user['socket_key'] }]);
            req.session.user.snap = req.file.filename;
            res.send(req.file.filename);
          }
        });
      }
    });
});

require('./routes/routes.js')(app, io, connection, http);

io.on('connect', function (socket) {

    var user_socket;

    socket.on('disconnect', function () {
        var today = new Date();
        var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        connection.query('UPDATE users SET ? WHERE ?', [{ user_connect: 0, user_last_activity: activity}, { user_socket: user_socket }]);
    });

    socket.on('save_user', function (msg)
    {
        user_socket = msg;
        connection.query('UPDATE users SET ? WHERE ?', [{ user_connect: 1 }, { user_socket: user_socket }]);
    });

});

app.get('*', function(req, res){
  res.redirect('/');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
