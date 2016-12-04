/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

/*var mongo = process.env.VCAP_SERVICES;
var port = process.env.PORT || 3030;
var conn_str = "";
if (mongo) {
  var env = JSON.parse(mongo);
  if (env['mongodb']) {
    mongo = env['mongodb'][0]['credentials'];
    if (mongo.url) {
      conn_str = mongo.url;
      console.log("Connected to mongo at "+conn_str);
    } else {
      console.log("No mongo found");
    }  
  } else {
    conn_str = 'mongodb://localhost:27017';
  }
} else {
  conn_str = 'mongodb://localhost:27017';
}
console.log("Connected to mongo at "+conn_str);
*/

var url = require('url');  
var mongodb = require('mongodb');

//get the mongoDB url using cfenv:
var appEnv = cfenv.getAppEnv();  
var mongoServiceUrl = appEnv.getServiceURL('mongodb-service');  
var urlStr = url.format(mongoServiceUrl);

//connect using the url:
var MongoClient = mongodb.MongoClient;  
MongoClient.connect(urlStr, function(err, db) {  
  if (!err) {
    console.log('connected to mongodb!'+urlStr);
  } else {
    console.log('error: ' + err);
  }
});