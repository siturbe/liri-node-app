require("dotenv").config();
const keys = require("./keys.js");
let fs = require("fs");
let Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require('moment');



let command = process.argv[2];
let parameter;


switchCase1();


function switchCase1(){
    switch (command){
        case 'concert-this':
            parameter = process.argv.slice(3).join('%20');
            break;

        case 'spotify-this-song':
            parameter = process.argv.slice(3).join('+')
            break;

        case 'movie-this':
            parameter = process.argv.slice(3).join('+');
            break;

    };
};



// OMDB MOVIE INFORMATION
function getMovieData(){
    let queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy";

    axios
    .get(queryUrl)
    .then(function(response){
        console.log("\n-----------------\n");
        console.log("Title:                  " + response.data.Title);
        console.log("Year Released:          " + response.data.Year);
        console.log("IMDB Rating:            " + response.data.imdbRating);
        console.log("Rotton Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country produced:       " + response.data.Country);
        console.log("Language:               " + response.data.Language);
        console.log("Plot:                   " + response.data.Plot);
        console.log("Actor:                  " + response.data.Actors);
        console.log("\n-----------------\n");
    })
    .catch(function(err){
        console.log(err);
    })

}

//BANDS IN TOWN
function getConcertData(){
    let queryUrl = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp";

    axios
    .get(queryUrl)
    .then(function(response){
        let JS = response.data;
        for (i=0; i < JS.length; i++){
            console.log("\n-----------------\n");
            console.log("Your Artist: " + JS[i].lineup);
            console.log("Name of Venue: " + JS[i].venue.name);
            console.log("Venue Location: " + JS[i].venue.city + ", " + JS[i].venue.region);
            let momentTime = moment(JS[i].datetime).format("MM/DD/YYYY  h:mm a");
            console.log("Date of the Event: " + momentTime);  //if have time, return and improve date formatting
            console.log("\n-----------------\n");
        }
    })
    .catch(function(err){
        console.log(err);
    })
}



//Spotify Funcitonality
function getSongData(){
    var searchTrack;
    if (parameter === undefined) {
      searchTrack = "Ace of Base The Sign";
    } else {
      searchTrack = parameter;
    };

    spotify.search({
        type: 'track',
        query: searchTrack
    }, function(error, data){
        if(error){
            console.log('Error recorded:  ' + error);
            return;
        } else {
            let trackArray = data.tracks.items;
            for(j=0; j < trackArray.length; j++){
                console.log("\n-----------------\n");
                console.log("Artist:  " + data.tracks.items[j].artists[0].name);
                console.log("Song:    " + data.tracks.items[j].name);
                console.log("Preview: " + data.tracks.items[j].preview_url);
                console.log("Album:   " + data.tracks.items[j].album.name);
                console.log("\n-----------------\n");
            }
        }
    });

}



///  DO WHAT RANDOM.TXT SAYA
function getRandom() {
    fs.readFile('random.txt', "utf8", function(error, data){
       if (error) {
           return display(error);
         }
   
        const dataArr = data.split(",");
        command = dataArr[0].trim();
        parameter = dataArr[1].trim().slice(1,-1);

        switchCase2();
      
      
    });
   
};




function switchCase(){
    switch (command){
        case 'concert-this':            
            getConcertData();
            break;

        case 'spotify-this-song':            
            getSongData();
            break;

        case 'movie-this':         
            getMovieData();
            break;

        case 'do-what-it-says':
            getRandom();
            break;
    };
};


function switchCase2(){
    switch (command){
        case 'concert-this':
            getConcertData();
            break;

        case 'spotify-this-song':
            getSongData();
            break;

        case 'movie-this':
            getMovieData();
            break;

    };
};



//Code to run functions

switchCase();