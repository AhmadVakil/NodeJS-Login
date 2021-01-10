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
    "base": "credentials"
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
    /*if(req.session.userID != null){
      db.query("SELECT * FROM users WHERE id=?", [req.session.userID], function(err, rows, fields){
      socket.emit("logged_in", {user: rows[0].Username, pPic: rows[0].picture, userId: rows[0].id});
      });
    }*/
    var defaultProfilePic = "data:image/png;base64,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"
    socket.on("login", function(data){
      const user = data.user,
      pass = data.pass;
      db.query('SELECT * FROM account WHERE username = ? AND password = ?', [user, pass], function(error, rows, fields) {
          if(rows.length == 0){
            console.log("nothing here");
            socket.emit('incorrectUserPass')
          } else {
                console.log("here");
                const dataUser = rows[0].username,
                dataPass = rows[0].password;
              if(dataPass === null || dataUser === null){
                socket.emit("error");
              }
              if(user === dataUser && pass === dataPass){
                socket.emit("logged_in", {user: user, pPic: rows[0].picture, userId: rows[0].id});
                req.session.userID = rows[0].id;
                req.session.save();
              } else {
                socket.emit("invalid");
              }
          }
      });
    });

    socket.on("getDashboardInfo", function(data){
        db.query('SELECT * FROM account WHERE id = ?', [data.userId], function(error, rows, fields) {
          if(rows.length == 0){
            console.log("nothing here");
          } else {
            socket.emit("dashboardInfo",
            {
                username: rows[0].username,
                picture: rows[0].picture,
            })
          }
        })
    })
    socket.on("register", function(data){
        var username = data.user;
        var password = data.pass;
        var email = data.email;
        db.query('SELECT * FROM account WHERE username = ?', [username], function(error, results, fields) {
            if (results.length > 0) {
                console.log('Username already exist!');
                socket.emit('usernameInvalid')
            } else {
              console.log("Connected!");
              var sql = 'INSERT INTO account (username, password, email, picture) VALUES ('+mysql.escape(username)+', '+mysql.escape(password)+', '+mysql.escape(email)+', '+mysql.escape(defaultProfilePic)+')';
              db.query(sql, function (err, result) {
                console.log("Number of records inserted: " + result.affectedRows);
                console.log('Account created');
                socket.emit('accountCreated')
              });
            }
        })
    })
    socket.on("changeProfilePic", function(data){
        console.log(data.string)
        console.log(data.userId)
        var sql = 'UPDATE account SET picture = '+mysql.escape(data.string)+' WHERE id = '+mysql.escape(data.userId);
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            socket.emit('profilePictureChanged', {picture: data.string})
        });
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