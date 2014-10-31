var mongo = require('mongodb');
var crypt = require('crypto');
var qs = require('querystring');
var cookieParser = require('cookie-parser');

var databaseUrl = "localhost:27017/ecommit"; // "username:password@example.com/mydb"
var collections = ["users"];
var db = require("mongojs").connect(databaseUrl, collections);


var isValidName = function (fullName) {
	var regex = /^[a-z ,.'-]+$/i;
	return regex.test(fullName);
	
}
 
var IsEmail = function (email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
}

addNewUser = function (name, email, password) {
	var user={'name': name, 'email': email , 'password': password};
	db.users.save(user, function (err, saved) {
  		if( saved ) {
			console.log("User  saved");
  		}

  		else
  			console.log("User not saved");
	});

}

encryptCookieData = function (input) {
	var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
	var key = 'password';
	var cipher = crypt.createCipher(algorithm, key);
	var encrypted = cipher.update(input, 'utf8', 'hex') + cipher.final('hex');
	return encrypted;
}

decryptCookieData = function (input) {
	var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
	var key = 'password';
	var decipher = crypt.createDecipher(algorithm, key);
	var decrypted = decipher.update(input, 'hex', 'utf8') + decipher.final('utf8');
	return decrypted;
}


hashPassword = function (plainTextPassword) {
	var shasum=crypt.createHash('sha1');
	shasum.update(plainTextPassword);
	return (shasum.digest('hex'));
}


validateUser = function (name, email, password, confirmPassword, request, response) {

	if(!isValidName(name)) {
		response.render('error', {message : ' Invalid Name! ' } );
		return;
	}

	if(password!==confirmPassword) {
		response.render('error', {message : 'Sorry passwords do not match! ' } );
		return;
	}

	if(!IsEmail(email)) {
		response.render('error', {message : 'Invalid email address! ' } );
		return;
	}


	db.users.find( { email: { $in: [ email ] } }, function (err,user){

		if ( user.length>0 ){
			response.render('message' , { message : ' Sorry email already exists! '});
			return;
		}
		else{

			response.cookie('ecommit_email', encryptCookieData(email) , { expires: false } );
			response.cookie('ecommit_passwordHash', encryptCookieData(hashPassword(password)), { expires: false } );
			addNewUser(name, email, hashPassword(password));
			response.render('message' , { message : ' You have successfully registered! '});
			return;
		}

	});
}

exports.logUserOut = function ( request , response ) {
	response.clearCookie('ecommit_email');
	response.clearCookie('ecommit_passwordHash');
	response.render( 'message' , { message : "You are not logged out! " });
}


exports.handleAddUser = function (request,response) {
    var body = '';
    request.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        if (body.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
        var post = qs.parse(body);
        validateUser(post.name, post.email , post.password, post.confirmPassword,request,response);
    });
}

exports.handleLogin = function(request,response){

	var body = '';
    request.on('data', function (data) {
    	body += data;

       	// Too much POST data, kill the connection!
        if (body.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
        var post = qs.parse(body);
        var email = post.email;
        var passwordHash = hashPassword(post.password);
        var rememberMe = false;
        db.users.find( { email: { $in: [ email ] } }, function(err,user){
			if(user[0].password!==passwordHash){
				console.log("Login failed!");
				response.redirect("/login");
			}
			else{
				console.log("Login successful ");
	

				if(typeof (post.rememberMe)==='undefined') {
					rememberMe = false; 
				}
				else if ((post.rememberMe)==='on') {
					rememberMe = true;
				}

				if(rememberMe === true ) {
					response.cookie('ecommit_email', encryptCookieData(user[0].email) , { maxAge: (7 * 24 * 60 * 60 * 1000) });
					response.cookie('ecommit_passwordHash', encryptCookieData(user[0].password), { maxAge: (7 * 24 * 60 * 60 * 1000) });
					response.render('message', {message : 'You are now logged in! ' } );
				}
				else if ( rememberMe === false ) {
					response.cookie('ecommit_email', encryptCookieData(user[0].email) , { expires: false });
					response.cookie('ecommit_passwordHash', encryptCookieData(user[0].password), { expires: false });
					response.render('message', {message : 'You are now logged in! ' } );				
				}
			}
		});
    });

}


exports.authenticateUser = function ( userCookie , response , content ){

	var cookieData = cookieParser.JSONCookies(userCookie);
	if( ((typeof userCookie.ecommit_email)==='undefined') || ((typeof userCookie.ecommit_passwordHash)==='undefined') ) {
		response.redirect('/login');
		return false;
	}
	else{
		var userEmail = decryptCookieData(userCookie.ecommit_email);
		var passwordHash = decryptCookieData(userCookie.ecommit_passwordHash);


  			db.users.find( { email: { $in: [ userEmail ] } }, function(err,user){
				if(user[0].password!==passwordHash){
					response.redirect('/login');
					response.end();
			}
			else{
				response.render(content);
			}
		});
	}

}
