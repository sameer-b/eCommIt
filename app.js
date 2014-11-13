var express = require('express');
var um = require('./lib/userManagement.js');
var pm = require('./lib/productManagement.js');
var cookieParser = require('cookie-parser');

var util = require('util');


var path = require('path');
var app = express();
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.get('/register', function (request, response) {
	response.render('register');
});


app.post('/addUser', function (request, response) {
  um.handleAddUser(request, response);
});

app.get('/login', function (request, response) {
  response.render('login');
});

app.get('/logout' , function ( request , response ) {
  um.logUserOut(request.cookies , response );
});

app.post('/authUser', function (request, response) {
  um.handleLogin(request, response);
});


app.get('/newProduct' , function (request , response ){
  var content = 'newProduct';
  um.authenticateUser(request.cookies, response, content);
});

app.post('/addProduct', function (request, response) {

    pm.addNewProduct(request,response);
});

app.get('/product/:id', function ( request, response) {
  pm.showProduct(request,response,request.params.id,'showProduct');
});

app.get('/editProduct/:id', function ( request , response ){
  pm.showProduct(request, response, request.params.id, 'editProduct');

});

app.get('/products', function( request, response){
  pm.listProducts(request,response);
});

var server = app.listen(3000, function () {
  console.log('Starting eCommIt! ');
});
