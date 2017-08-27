// Grabs the bands variables
var authKeys = require("./keys.js");

//Requires twitter package
var Twitter = require('twitter');

//Requires inquirer
var inquirer = require("inquirer");

// Ask the question a series of questions
inquirer.prompt([

  {
    type: "input",
    name: "name",
    message: "Who are you???"
  },

// Gets all of keys
var keys = authKey.twitterKeys;

// assigned twitterKeys and store in variables
var consumer_key = keys.consumer_key;
var consumer_secret = keys.consumer_secret;
var access_token_key = keys.access_token_key;
var access_token_secret = keys.access_token_secret;

//create a new Twitter oobject called client
var client = new Twitter({
consumer_key: keys.consumer_key,
consumer_secret: keys.consumer_secret,
access_token_key: keys.access_token_key,
access_token_secret: keys.access_token_secret,
});


//call the twitter API
client.get('statuses/user_timeline', { screen_name: 'nodejs', count: 20 }, function(error, tweets, response) {
    if (!error) {
		throw error;
  console.log(tweets);  // The favorites. 
  console.log(response);  // Raw response object. 

