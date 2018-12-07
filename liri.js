require("dotenv").config();
var moment = require("moment")
var fs = require("fs");
var keys = require("./keys.js")
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdbKey = "&apikey=" + keys.omdbKey
var bandsKey = "app_id=" + keys.bandsInTown

function logUserInput() {
    var input = process.argv.slice(2).join(" ")
    fs.appendFile("log.txt", input + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}
logUserInput()

function main() {
    if (process.argv[2] === "movie-this") {
        getMovie(userInput())
    }
    if (process.argv[2] === "concert-this") {
        getBand(userInput())
    }
    if (process.argv[2] === "spotify-this-song") {
        getMusic(userInput())
    }
    if (process.argv[2] === "do-what-it-says")
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            console.log(data);
            var dataArr = data.split(", ");
            console.log(dataArr);
            var randomNum = Math.random() //I wasn't sure of instructions here. to make liri choose music/band/movie randomly or 
            // to make the user type "do-what-it-says spotify-this-song" and get a spotified song from random file instead of user input
            if (randomNum > .66) {
                getMusic(dataArr[1])
            }
            else if (randomNum < .33) {
                getMovie(dataArr[3])
            }
            else {
                getBand(dataArr[5])
            }
        });

}

main();

function userInput() {
    return process.argv.slice(3).join(" ")
}

function getMusic(music) {
    if (userInput() === "") {
        spotify.search({ type: 'track', query: "The Sign" }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist: " + data.tracks.items[8].artists[0].name)
            console.log("Song Name: " + data.tracks.items[8].name)
            console.log("Album Name: " + data.tracks.items[8].album.name)
            console.log("Spotify URL: " + data.tracks.items[8].preview_url)

        });
    }
    else {
        spotify.search({ type: 'track', query: music }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            debugger;
            // console.log(data)
            console.log("Artist: " + data.tracks.items[0].artists[0].name)
            console.log("Song Name: " + data.tracks.items[0].name)
            console.log("Album Name: " + data.tracks.items[0].album.name)
            console.log("Spotify URL: " + data.tracks.items[0].preview_url)
            debugger;

        });
    }
}
function getMovie(movie) {
    if (userInput() === "") {
        axios.get("http://www.omdbapi.com/?" + omdbKey + "&t=" + "Mr. Nobody").then(
            function (response) {
                console.log("Title: " + response.data.Title)
                console.log("Year: " + response.data.Year)
                console.log("IMDB Rating: " + response.data.imdbRating)
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
                console.log("Country or Countries Produced: " + response.data.Country)
                console.log("Language(s): " + response.data.Language)
                console.log("Plot: " + response.data.Plot)
                console.log("Actors: " + response.data.Actors)
            });
    }
    else {
        axios.get("http://www.omdbapi.com/?" + omdbKey + "&t=" + movie).then(
            function (response) {
                console.log("Title: " + response.data.Title)
                console.log("Year: " + response.data.Year)
                console.log("IMDB Rating: " + response.data.imdbRating)
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
                console.log("Country or Countries Produced: " + response.data.Country)
                console.log("Language(s): " + response.data.Language)
                console.log("Plot: " + response.data.Plot)
                console.log("Actors: " + response.data.Actors)
            });
    }
}

function getBand(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?" + bandsKey).then(
        function (response) {
            // console.log(response.data)
            for (var i = 0; i < response.data.length; i++) {
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("City: " + response.data[i].venue.city);
                console.log("Date: " + moment(response.data[i].datetime).format("MM-DD-YYYY"));
            }
        },
        function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    );

}

