// Grabs the bands variables
var authKeys = require("./keys.js");

//Requires twitter package
var Twitter = require('twitter');

//Requires inquirer
var inquirer = require("inquirer");

//Requires Spotify
var Spotify = require('node-spotify-api');

// Ask the question a series of questions
inquirer.prompt([

  {
    type: "list",
    name: "itemPicked",
    message: "What would you like to do???",
    choices: ["my-tweets","spotify-this-song","movie-this","do-what-it-says"]
  },
	{	
		type: "input",
	 	name: "songPicked",
		message: "What song would you like to look up???"
	}
  ])
.then(function(inquirerResponse) {
    // inquirerResponse.
    if (inquirerResponse.itemPicked === "my-tweets") {
      var screenName = "scottjac01";
	// Gets all of keys
	var keys = authKeys.twitterKeys;

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
	client.get('statuses/user_timeline', { screen_name: screenName , count: 20 }, function(error, tweets, response) {
	    if (!error) {
	    	for(var i = 0; i < tweets.length; i++){
	    		console.log("==============================================");
	  			console.log("Here are my tweets: \n" + tweets[i].user.name + "\n" + tweets[i].user.screen_name + "" +"\n" + tweets[i].user.friends_count + "\n" +
	  			tweets[i].user.created_at + "\n" + tweets[i].text);
	  			}
				}
				console.log(error);
			});
		}
	///Next If statement
	if (inquirerResponse.itemPicked === "spotify-this-song"){
			    var songName = inquirerResponse.songPicked;
			    var spotKeys = authKeys.spotifyKeys;
					var spotify = new Spotify({
	  				id: spotKeys.clientID,
	  				secret: spotKeys.clientSecret
					});
	 
					spotify.search({type: "track", query: songName, limit: 20 }, function(err, data) {
  				if (err) {
    				return console.log('Error occurred: ' + err);
  					}
	  				console.log(data.tracks.items[0].album.artists[0].name);
	  					//for loop
		    			for(var i = 0; i < data.tracks.items.length; i++){
		    				console.log("==============================================");
		    				console.log("Artist Name: " + data.tracks.items[i].album.artists[i].name + "\n" +
		    					"Song Name: " + data.tracks.items[i].name + "\n" +
		    					"Preview Link: " + data.tracks.items[i].album.external_urls.spotify + "\n" +
		    					"Album Name: " + data.tracks.items[i].album.name);
		    			}
 						console.log(data); 
						});
	  			}
	  		});