require("dotenv").config();
const keys = require("./keys.js");
let fs = require("fs");
let Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require('moment');
const inquirer = require('inquirer');
let output;
let choice;

let command;
let parameter;



console.log("Hi!  I'm Liri!  I can help you with a few search requests. \n");

inquirer
    .prompt([
        {
            type: "list",
            message: "Which of the following would you want me to help you with? \n",
            choices:[
                "Find a concert",
                "Research a movie",
                "Find a song on Spotify",
                "Read command from text file"
            ],
            name: 'selection'
        }
    ])
    .then(function(inquirerResponse){
        choice = inquirerResponse.selection;
        switchChoice();  
    })



function switchChoice(){
    switch (choice){
        case "Find a concert":
            command = 'concert-this';
            inquirer
            .prompt([
                {
                    type: 'input',
                    message: "What band or artist do you want to see?",
                    name: 'artist'
                }
            ]).then(function(inquirerResponse){
                parameter = inquirerResponse.artist.replace(' ','%20');
                logInput();
            });
            break;

        case "Find a song on Spotify":
            command = 'spotify-this-song';
            inquirer
            .prompt([
                {
                    type: 'input',
                    message: "What song are you looking for?",
                    name: 'song'
                }
            ]).then(function(inquirerResponse){
                parameter = inquirerResponse.song.replace(' ','+');
                logInput();
            });
            break;

        case "Research a movie":
            command = 'movie-this';
            inquirer
            .prompt([
                {
                    type: 'input',
                    message: "What movie do you want to research?",
                    name: 'movie'
                }
            ]).then(function(inquirerResponse){
                parameter = inquirerResponse.movie.replace(' ','+');
                logInput();
            });
            break;

        case "Read command from text file":
            command = 'do-what-it-says';
            logInput();
            break;

    };
};
 

// function askConcert(){
//     inquirer
//         .prompt([
//             {
//                 type: 'input',
//                 message: "What band or artist do you want to see?",
//                 name: 'artist'
//             }
//         ]).then(function(inquirerResponse){
//             parameter = inquirerResponse.artist.replace(' ','%20');
//         })
// }


// function askSong(){
//     inquirer
//         .prompt([
//             {
//                 type: 'input',
//                 message: "What song are you looking for?",
//                 name: 'song'
//             }
//         ]).then(function(inquirerResponse){
//             parameter = inquirerResponse.song.replace(' ','+');
//         })
// }

// function askMovie(){
//     inquirer
//         .prompt([
//             {
//                 type: 'input',
//                 message: "What movie do you want to research?",
//                 name: 'movie'
//             }
//         ]).then(function(inquirerResponse){
//             parameter = inquirerResponse.movie.replace(' ','+');
//         })
// }



// function switchCase1(){
//     switch (command){
//         case 'concert-this':
//             parameter = process.argv.slice(3).join('%20');
//             break;

//         case 'spotify-this-song':
//             parameter = process.argv.slice(3).join('+')
//             break;

//         case 'movie-this':
//             parameter = process.argv.slice(3).join('+');
//             break;

//     };
// };

function logInput(){
    fs.appendFile("log.txt", "\n---------------------------------------------\nUser Inputs: " + command + ", " + parameter + "\nOutput:",function(err){
        if(err) { return console.log(err);}
    });
    switchCase();
    
}



// OMDB MOVIE INFORMATION
function getMovieData(){
    let queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy";

    axios
    .get(queryUrl)
    .then(function(response){
        output = "\n-----------------\nTitle:                  " + response.data.Title +"\nYear Released:          " + response.data.Year + "\nIMDB Rating:            " + response.data.imdbRating + "\nRotton Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry produced:       " + response.data.Country + "\nLanguage:               " + response.data.Language + "\nPlot:                   " + response.data.Plot + "\nActor:                  " + response.data.Actors + "\n-----------------\n";
        console.log(output);
        fs.appendFile("log.txt", output, function(err){
            if(err) { return console.log(err);}
        });
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
            let momentTime = moment(JS[i].datetime).format("MM/DD/YYYY  h:mm a");
            output = "\n-----------------\nYour Artist: " + JS[i].lineup + "\nName of Venue: " + JS[i].venue.name + "\nVenue Location: " + JS[i].venue.city + ", " + JS[i].venue.region + "\nDate of the Event: " + momentTime + "\n-----------------\n";
            console.log(output);
            fs.appendFile("log.txt", output, function(err){
                if(err) { return console.log(err);}
            }); 
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
                output = "\n-----------------\nArtist:  " + data.tracks.items[j].artists[0].name + "\nSong:    " + data.tracks.items[j].name + "\nPreview: " + data.tracks.items[j].preview_url + "\nAlbum:   " + data.tracks.items[j].album.name + "\n-----------------\n";
                console.log(output);
                fs.appendFile("log.txt", output, function(err){
                    if(err) { return console.log(err);}
                });                 
            
            }
        }

    })
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





