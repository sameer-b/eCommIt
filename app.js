var express = require('express');
var um = require('./lib/userManagement.js');
var cookieParser = require('cookie-parser');
var path = require('path');
var app = express();
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.get('/register', function (request, response) {
	response.render('register')
	response.end();
 //response.end("<html><head><title></title></head><body><form action=\"/addUser\" method=\"POST\"> Name: <input name=\"name\"/> Email: <input name=\"email\"/> Password: <input name=\"password\"/> Confirm Password: <input name=\"confirmPassword\"/><button type=\"submit\">Register</button></form></body></html>");
});


app.post('/addUser', function (request, response) {
  um.handleAddUser(request, response);
});

app.get('/login', function (request, response) {
  response.render('login');
  //response.end();
  //response.end("<html><head><title></title></head><body><form action=\"/authUser\" method=\"POST\">  Email: <input name=\"email\"/> Password: <input name=\"password\"/> <button type=\"submit\">Register</button></form></body></html>");

});

app.post('/authUser', function (request, response) {
  um.handleLogin(request, response);
});

app.get('/home', function (request, response) {
    var content = "<html><head></head><body><h1>Home</h1></body></html>";
    um.authenticateUser(request.cookies, response, content);
   // response.render('home');
});


var server = app.listen(3000, function () {
  console.log('Starting eCommIt! ');
    });
