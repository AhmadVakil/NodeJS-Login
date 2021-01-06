var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static("public"));
var http = require('http').Server(app);
http.listen(3000, () => console.error('listening on http://localhost:3000/'));
var io = require('socket.io')(http,{ transports: ['websocket', 'polling', 'flashsocket'] });

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/login.html'));
});

// Change this depend on your db
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor',
    database : 'credentials'
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
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
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
        if (results.length > 0) {
            response.send('Username already exist!');
        } else {
              console.log("Connected!");
              var sql = 'INSERT INTO accounts (username, password, email) VALUES ('+mysql.escape(username)+', '+mysql.escape(password)+', '+mysql.escape(email)+')';
              connection.query(sql, function (err, result) {
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

io.on('connection', s => {
  console.error('socket.io connection');
  for (var t = 0; t < 3; t++)
    setTimeout(() => s.emit('message', 'message from server'), 1000*t);
  io.on('dashboard', function(){
    console.log('dashboard')
  })
  io.emit('message')
});
