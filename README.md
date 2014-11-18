# eCommIt #
Ecomm(erce)It is a simple e commerce app written in Node.js.
There exists a front end Android app and we have plans for a web version and other mobile platforms as well.

## Installation ##
Before you even clone the repo make sure you have MongoDB installed.  
Clone the repo
 `git clone "https://github.com/sameer-b/eCommIt"`  
cd into the repo directory.  
 `cd ecommit`  
Open `./lib/applicationCredentials.js`
Add mongo url to `databaseUrl`
Add password for encryption in `cookieEncryptionKey`
Get the required node packages.
`npm install `
## Running ##

Start a mongo server instance.  
`mongod --smallfiles --dbpath PATH_TO_YOUR_REPO/data`  
You can start it anywhere you like.  
Run the app with.  
`node app.js`  

##Code structure##
`/data` (empty directory to start mongodb instance.)    
`/lib`  (Contains specific application code.)    
`/public/views` (Contains the html views.)    
`/public/img` (Contains images to be served in the views.)    
`/public/css` (Contains styling for the views.)  
`/public/js` (Contains client side js code.)  
`app.js`  (Main application file.)    
`package.json`  (Required packages.)    
`README.md `  
