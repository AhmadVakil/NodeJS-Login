var express = require('express'),
  socket = require('socket.io'),
  mysql = require('mysql'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.urlencoded({extended : true}));
  app.use(bodyParser.json());
  var server = app.listen(4000, function () {
    console.log("listening to port 4000.");
  });
  var io = socket.listen(server);

  var sessionMiddleware = session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  });

  io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  app.use(sessionMiddleware);
  app.use(cookieParser());

  const config = {
    "host": "localhost",
    "user": "root",
    "password": "toor",
    "base": "nodelogin"
  };

  var db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.base
  });

  db.connect(function (error) {
    if (!!error)
    throw error;

    console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
  });

  app.use(express.static('./'));

io.sockets.on('connection', function (socket) {
    var req = socket.request;
    socket.on("login_register", function(data){
      const user = data.user,
      pass = data.pass;
      db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [user, pass], function(error, rows, fields) {
          if(rows.length == 0){
            console.log("nothing here");
          } else {
                console.log("here");
                const dataUser = rows[0].username,
                dataPass = rows[0].password;
              if(dataPass === null || dataUser === null){
                socket.emit("error");
              }
              if(user === dataUser && pass === dataPass){
                socket.emit("logged_in", {user: user});
                req.session.userID = rows[0].id;
                req.session.save();
              } else {
                socket.emit("invalid");
              }
          }
      });
    });
    socket.on("register", function(data){
        var username = data.user;
        var password = data.pass;
        var email = data.email;
        console.log(username)
        console.log(password)
        console.log(email)
        db.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
            if (results.length > 0) {
                console.log('Username already exist!');
            } else {
              console.log("Connected!");
              var sql = 'INSERT INTO accounts (username, password, email) VALUES ('+mysql.escape(username)+', '+mysql.escape(password)+', '+mysql.escape(email)+')';
              db.query(sql, function (err, result) {
                console.log("Number of records inserted: " + result.affectedRows);
                console.log('Account created');
              });
            }
        })
    })
});
/*
app.post('/auth', function(request, response) {
        var username = request.body.username;
        var password = request.body.password;
        if (username && password) {
            db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    response.redirect('/dashboard.html');

                } else {
                    // response.send('Incorrect Username and/or Password!');
                    response.redirect('/login.html'); // main page url
                }
                response.end();
            });
        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    })

    app.post('/signup', function(request, response) {
        var username = request.body.username;
        var password = request.body.password;
        var email = request.body.email;
        db.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
            if (results.length > 0) {
                response.send('Username already exist!');
            } else {
                  console.log("Connected!");
                  var sql = 'INSERT INTO accounts (username, password, email) VALUES ('+mysql.escape(username)+', '+mysql.escape(password)+', '+mysql.escape(email)+')';
                  db.query(sql, function (err, result) {
                    console.log("Number of records inserted: " + result.affectedRows);
                    response.send('Account created');
                  });
            }
        })
    });

    app.get('/home', function(request, response) {
        if (request.session.loggedin) {
            response.send('Welcome back again, ' + request.session.username + '!');
        } else {
            response.send('Please login to view this page!');
        }
        response.end();
    });
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/login.html'));
});
*/