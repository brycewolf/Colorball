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


var http = require('http');
var host = "localhost";
var port = 3030;
var cloudant = {
	url: "https://a9a0ed3a-e818-48a1-a198-e59de0d69ed7-bluemix:30055c0da5efa47b2d04eb3d3ac9736b14cd9747ea91e627328efe8a7a7a64e2@a9a0ed3a-e818-48a1-a198-e59de0d69ed7-bluemix.cloudant.com"
}
if (process.env.hasOwnProperty("VCAP_SERVICES")) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var host = process.env.VCAP_APP_HOST;
	var port = process.env.VCAP_APP_PORT;
	cloudant = env['cloudantNoSQLDB'][0].credentials;
}

//The following code was adapted from the IBM tutorial http://www.ibm.com/developerworks/cloud/library/cl-guesstheword-app/
var nano = require('nano')(cloudant.url);
var db = nano.db.use('hiscores')
var db1 = nano.db.use('colorballscores')

app.get('/hiscores', function(request, response) {					//request function to get the scores from hyperscores
  db.view('top_scores', 'top_scores_index', function(err, body) {
  if (!err) {
    var scores = [];
      body.rows.forEach(function(doc) {
        scores.push(doc.value);		      
      });
      response.send(JSON.stringify(scores));
    }
  });
});

app.get('/save_score', function(request, response) {			//save new scores to hyperscore cloudant
  var name = request.query.name;
  var score = request.query.score;

  var scoreRecord = { 'name': name, 'score' : parseInt(score), 'date': new Date() };
  db.insert(scoreRecord, function(err, body, header) {
    if (!err) {       
      response.send('Successfully added one score to the DB');
    }
  });
});



app.get('/colorballscores', function(request, response) {		//request function to get scores from colorballscores cloudant
  db1.view('colorballScores', 'colorballScores_index', function(err, body) {
  if (!err) {
    var scores = [];
      body.rows.forEach(function(doc) {
        scores.push(doc.value);		      
      });
      response.send(JSON.stringify(scores));
    }
  });
});

app.get('/save_cScore', function(request, response) {		//function to save new colorballscores to cloudant
  var name = request.query.name;
  var score = request.query.score;

  var scoreRecord = { 'name': name, 'score' : parseInt(score), 'date': new Date() };
  db1.insert(scoreRecord, function(err, body, header) {
    if (!err) {       
      response.send('Successfully added one score to the DB');
    }
  });
});