// Grabs the bands variables
var authKeys = require("./keys.js");

//Requires twitter package
var Twitter = require('twitter');

//Requires inquirer
var inquirer = require("inquirer");

//Requires Spotify
var Spotify = require('node-spotify-api');

//Requires fs
var fs = require("fs");
var logfile = "logfile.txt";

//Requires request
var request = require("request");

// Ask the question a series of questions

function processAnswers(answers){
  console.log("And your answers are:", answers);
}

function validateName(name){
        return name !== "";
    }

var questions = [
 {
    type: "list",
    name: "itemPicked",
    message: "What would you like to do???",
    choices: ["my-tweets","spotify-this-song","movie-this","do-what-it-says"]
  },{
    message: "Enter in my screen name scottjac01 or anyones screen name",
    type: "input",
    name: "tweetHandle",
    validate: validateName,
    when: function(answers){
    	return answers.itemPicked === "my-tweets";
    }
},{	
		type: "input",
	 	name: "songPicked",
		message: "What song would you like to look up???",
		default: "The Sign",
		validate: validateName,
		when: function(answers) {
                return answers.itemPicked === "spotify-this-song";
              }
	},{
		type: "input",
	 	name: "moviePicked",
		message: "What movie would you like to look up???",
		validate: validateName,
		when: function(answers) {
                return answers.itemPicked === "movie-this";
              }
	},{
		type: "confirm",
	 	name: "liriCmd",
		message: "You want me to just do-what-it-says???",
		default: true,
		when: function(answers) {
                return answers.itemPicked === "do-what-it-says";
              }
	}

];
// Inquirer questions and answers.
inquirer.prompt(questions, processAnswers).then(function(inquirerResponse) {
    
    if (inquirerResponse.itemPicked === "my-tweets") {
      var screenName = inquirerResponse.tweetHandle;

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
	client.get('statuses/user_timeline', { screen_name: screenName , count: 5 }, function(error, tweets, response) {
	    if (!error) {
	    	for(var i = 0; i < tweets.length; i++){
	    		console.log("==============================================");
	  			console.log("Here are my tweets: \n" + tweets[i].user.name + "\n" + tweets[i].user.screen_name + "" +"\n" + 
	  				tweets[i].user.friends_count + "\n" +
	  				tweets[i].user.created_at + "\n" + tweets[i].text);
	  				}
				}
				console.log(error);
		});
		fs.appendFile(logfile, "Tweet Handle: " + inquirerResponse.tweetHandle + "\n", function(err) {
			// If an error was experienced we say it.
		  if (err) {
		    console.log(err);
		  	}
			});
	}
	///Next If statement
	if (inquirerResponse.itemPicked === "spotify-this-song"  || inquirerResponse.itemPicked === "do-what-it-says"){
			    if(inquirerResponse.liriCmd){
				var songName;
			    	fs.readFile("random.txt", "utf8", function(error, data) {
  					// If the code experiences any errors it will log the error to the console.
  					if (error) {
    					return console.log(error);
  						}
			    	songName = data[0];
			    });
			    } else {
			    	songName = inquirerResponse.songPicked;
			    }
			    var spotKeys = authKeys.spotifyKeys;
					var spotify = new Spotify({
	  				id: spotKeys.clientID,
	  				secret: spotKeys.clientSecret
					});
	 
					spotify.search({type: "track", query: songName, limit: 5 }, function(err, data) {
  				if (err) {
    				return console.log('Error occurred: ' + err);
  					}
	  					//for loop
		    			for(var i = 0; i < data.tracks.items.length; i++){
		    				console.log("==============================================");
		    				console.log("Artist Name: " + data.tracks.items[i].album.artists[0].name + "\n" +
		    					"Song Name: " + data.tracks.items[i].name + "\n" +
		    					"Preview Link: " + data.tracks.items[i].album.external_urls.spotify + "\n" +
		    					"Album Name: " + data.tracks.items[i].album.name);
		    			} 
						});
					fs.appendFile(logfile, "Spotify Song: " + inquirerResponse.songPicked + "\n", function(err) {
						// If an error was experienced we say it.
					  if (err) {
					    console.log(err);
					  	}
						});
	  			}
	  ///Next if statement
	  // Then run a request to the OMDB API with the movie specified
	if (inquirerResponse.itemPicked === "movie-this"){
					var movieName = inquirerResponse.moviePicked;
			    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
					request(queryUrl, function(error, response, body) {

					  // If the request is successful
					  if (!error && response.statusCode === 200) {
					  	//console.log(JSON.parse(body));
					    // Parse the body of the site and recover just the imdbRating
					    console.log("==============================================");
					    console.log("Title: " + JSON.parse(body).Title + "\n" +
					    	"Year: " + JSON.parse(body).Year + "\n" +
					    	"IMDB Rating: " + JSON.parse(body).Ratings[0].Source + "\n" +
					    	"Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Source + "\n" +
					    	"Country Movie was Made: " + JSON.parse(body).Country + "\n" +
					    	"Language: " + JSON.parse(body).Language + "\n" +
					    	"Plot: " + JSON.parse(body).Plot + "\n" +
					    	"Actors: " + JSON.parse(body).Actors);
						console.log("==============================================");
					  	}
						});
					fs.appendFile(logfile, "Movie : " + inquirerResponse.moviePicked + "\n", function(err) {
						// If an error was experienced we say it.
					  if (err) {
					    console.log(err);
					  	}
						});
	  			}
	  	});
