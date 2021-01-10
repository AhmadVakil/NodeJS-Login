var express = require('express'),
  socket = require('socket.io'),
  mysql = require('mysql'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  app = express(),
  password = require('password-hash-and-salt');

fs.readFile('serverConfig.json', 'utf8', function (err, serverConfig) {
  if (err) throw err;
  serverConfig = JSON.parse(serverConfig);
  app.use(bodyParser.urlencoded({extended : serverConfig.urlencodedExtended}));
  app.use(bodyParser.json());
  var server = app.listen(serverConfig.port, function () {console.log(serverConfig.serverIsListeningNotification)});
  var io = socket.listen(server);
  var sessionMiddleware = session(serverConfig.sessionMiddleware);
  io.use( function (socket, next) {sessionMiddleware(socket.request, socket.request.res, next)});
  app.use(sessionMiddleware);
  app.use(cookieParser());
  var db = mysql.createConnection(serverConfig.databaseConfig);
  db.connect( function (error) {
    if (!!error)
    throw error;
    console.log('mysql connected to ' + serverConfig.databaseConfig.host + ", user " + serverConfig.databaseConfig.user + ", database " + serverConfig.databaseConfig.base);
  });
  app.use(express.static(serverConfig.servingPathToClient));
  io.sockets.on('connection', function (socket) {
    var req = socket.request;
    socket.on("login", function(data){
      const user = data.user,
      pass = data.pass;
      db.query('SELECT * FROM account WHERE username = ?', [user], function(error, rows, fields) {
        if(rows.length == 0){
          socket.emit('incorrectUserPass')
        } else {
          const dataUser = rows[0].username,
          dataPass = rows[0].password;
          if(dataPass === null || dataUser === null){
            socket.emit('incorrectUserPass')
          }
          password(pass).verifyAgainst(dataPass, function(error, verified) {
            if(error)
                throw new Error('Something went wrong!');
            if(verified) {
                console.log("great");
            }
            if(user === dataUser && verified){
              socket.emit("logged_in", {user: user, pPic: rows[0].picture, userId: rows[0].id});
              req.session.userID = rows[0].id;
              req.session.save();
            } else {
              socket.emit("invalid");
              socket.emit('incorrectUserPass')
            }
          });
        }
      });
    });
    socket.on("getDashboardInfo", function(data){
      db.query('SELECT * FROM account WHERE id = ?', [data.userId], function(error, rows, fields) {
        if(rows.length == 0){
          console.log("Wrong Credential");
        } else {
          socket.emit("dashboardInfo", {username: rows[0].username, picture: rows[0].picture})
        }
      })
    })
    socket.on("register", function(data){
      var username = data.user;
      //var password = data.pass;
      var email = data.email;
      //console.log(typeof password)
      db.query('SELECT * FROM account WHERE username = ?', [username], function(error, results, fields) {
        if (results.length > 0) {
          console.log('usernameInvalid');
          socket.emit('usernameInvalid')
        } else {
          password(data.pass).hash(function(error, encryptedPass) {
            if(error)
              throw new Error('Hashing Failed!');

            var sql = 'INSERT INTO account (username, password, email, picture) VALUES ('+mysql.escape(username)+', '+mysql.escape(encryptedPass)+', '+mysql.escape(email)+', '+mysql.escape(serverConfig.defaultProfilePic)+')';
            db.query(sql, function (err, result) {
              socket.emit('accountCreated')
            });
          });
        }
      })
    })
    socket.on("changeProfilePic", function(data){
      var sql = 'UPDATE account SET picture = '+mysql.escape(data.string)+' WHERE id = '+mysql.escape(data.userId);
      db.query(sql, function (err, result) {
        if (err) throw err;
        socket.emit('profilePictureChanged', {picture: data.string})
      });
    })
  });
})
