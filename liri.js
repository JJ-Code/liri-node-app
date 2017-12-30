//Liri script
var keys = require("./keys.js");

//npm packages dependencies and files
var Twitter = require("twitter")
var Spotify = require('node-spotify-api');
var fs = require('fs'); //read and write file
var request = require('request'); // allows for requests to APIs

//take in command for what does user wants to do? (tweet, moveie, or song search)
var userCommand = process.argv[2]
//user input name of song, movie or tweet title
var lookUpTitle = process.argv[3]


//Switch statements to declare what action to excute
function switchCommand(param) {
  userCommand = userCommand || param
  switch (userCommand) {
    case "my-tweets":
      twitterGrab();
      break;

    case "spotify-this-song":
      spotifyGrab();
      break;

    case "movie-this":
      ombdGrab();
      break;

    case "do-what-it-says":
      doIt();
      break;

  }
}; //end of switch function


function twitterGrab() {
  console.log("My tweets:");
  var client = new Twitter(keys.twitterKeys);
  var parameters = {
    screen_name: "JayJLiu",
    count: 20
  };
  //call the get method on our client variable twitter instance
  client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
    if (!error) {
      for (i = 0; i < tweets.length; i++) {
        var returnedData = ('Number: ' + (i + 1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
        console.log(returnedData);
        console.log("-------------------------");
      }
    };
  });
}; //end tweetGrab;



function ombdGrab() {
  console.log("Is this the movie you are you looking for?");

  //same as above, test if search term entered
  var movieSearch;
  if (lookUpTitle === undefined) {
    movieSearch = "The Matrix";
  } else {
    movieSearch = lookUpTitle;
  };

  //store ombd request in a variable
  var ombdURL = 'http://www.omdbapi.com/?t=' + movieSearch + '&y=&plot=long&apikey=40e9cece';

  request(ombdURL, function(error, response, body) {
    // If the request is successful and not a error
    if (!error && response.statusCode == 200) {
      console.log("Title: " + JSON.parse(body)["Title"]);
      console.log("Year: " + JSON.parse(body)["Year"]);
      console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
      console.log("Country: " + JSON.parse(body)["Country"]);
      console.log("Language: " + JSON.parse(body)["Language"]);
      console.log("Plot: " + JSON.parse(body)["Plot"]);
      console.log("Actors: " + JSON.parse(body)["Actors"]);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
      console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
    }
  });
}; //end of movieGrab


function spotifyGrab() {
  console.log(keys.spotiyKeys.client_id);
  var spotify = new Spotify({
    id: keys.spotiyKeys.client_id,
    secret: keys.spotiyKeys.client_secert

  })
  console.log("Music time!");
  //variable for search term, test if defined.
  var musicSearch;
  if (lookUpTitle === undefined) {
    musicSearch = "Young Dumb & Broke";
  } else {
    musicSearch = lookUpTitle;
  }
  //launch spotify search
  spotify.search({
    type: 'track',
    query: musicSearch
  }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    } else {

      console.log("Artist: ", data.tracks.items[0].artists[0].name);
      console.log("Song: ", data.tracks.items[0].name);
      console.log("Album: ", data.tracks.items[0].album.name);
      console.log("Preview Here: ", data.tracks.items[0].preview_url);
    }
  });
}; //end spotifyGrab


function doIt() {

  console.log("Searching random.txt now");
  fs.readFile("./random.txt", "UTF8", function(error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data)
      //split data, declare variables
      var dataArr = data.split(',');
      userCommand = dataArr[0];
      lookUpTitle = dataArr[1];
      // //if multi-word search term, add.
      for (i = 2; i < dataArr.length; i++) {
        lookUpTitle = lookUpTitle + "+" + dataArr[i];
      };
      //run action
      switchCommand();

    }; //end else

  }); //end readfile

}; //end followTheTextbook

switchCommand(); //evoke switchCommand
