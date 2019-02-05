require("dotenv").config();
var Spotify = require("node-spotify-api");

var keys = require("./keys");

var axios = require("axios");

var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var artistNames = function(artist) {
    return artist.name;
  };
  
var getSpotify = function(songName) {
    if (songName === undefined) {
      songName = "Venom";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(artistNames));
          console.log("song name: " + songs[i].name);
          console.log("preview song: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
          console.log("-----------------------------------");
        }
      }
    );
  };
  
  var getBands = function(artist) {
    var bitID = "5346d090d0199e9e812442bf175954a5";
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bitID;
  
    axios.get(queryURL).then(
      function(response) {
        var returnInfo = response.data;
  
        if (!returnInfo.length) {
          console.log("No results found for " + artist);
          return;
        }
  
        console.log("Upcoming Shows for " + artist + ":");
  
        for (var i = 0; i < returnInfo.length; i++) {
          var show = returnInfo[i];
  
          // Print data about each concert
          // If a concert doesn't have a region, display the country instead
          // Use moment to format the date
          console.log(
            show.venue.city +
              "," +
              (show.venue.region || show.venue.country) +
              " at " +
              show.venue.name +
              " " +
              moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    );
  };
  
  // Function for running a Movie Search
  var getMovie = function(movieName) {
    if (movieName === undefined) {
      movieName = "The Grinch";
    }
  
    var omdbKey = "434e62c4";
    var urlHit =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=" + omdbKey;
  
    axios.get(urlHit).then(
      function(response) {
        var returnInfo = response.data;
  
        console.log("Title: " + returnInfo.Title);
        console.log("Year: " + returnInfo.Year);
        console.log("Rated: " + returnInfo.Rated);
        console.log("IMDB Rating: " + returnInfo.imdbRating);
        console.log("Country: " + returnInfo.Country);
        console.log("Language: " + returnInfo.Language);
        console.log("Plot: " + returnInfo.Plot);
        console.log("Actors: " + returnInfo.Actors);
        console.log("Rotten Tomatoes Rating: " + returnInfo.Ratings[1].Value);
      }
    );
  };
  
  // Function for running a command based on text file
  var doThis = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };
  
  // Function for determining which command is executed
  var pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      getBands(functionData);
      break;
    case "spotify-this-song":
      getSpotify(functionData);
      break;
    case "movie-this":
      getMovie(functionData);
      break;
    case "do-what-it-says":
      doThis();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  
  // Function which takes in command line arguments and executes correct function accordingly
  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  // MAIN PROCESS
  // =====================================
  runThis(process.argv[2], process.argv.slice(3).join(" "));
  