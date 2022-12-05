

var num_shapes; // number of shapes to chose from

const e = require('express');
var express = require('express');
const { get } = require('https');
const { send } = require('process');
var app = express();
var port = 3000;

var coins = 65;
var defaultLives = 3;
var extraLives = 0;
var hints = 1;
var users = {
    viktorofZuan: {
        Name: "Viktor of Zaun",
        HighScore: 103
    },
    miodrag: {
        Name: "Miodrag",
        HighScore: 81
    },
    michelleJones: {
        Name: "Michelle Jones",
        HighScore: 101
    },
    spiderman: {
        Name: "Spiderman",
        HighScore: 67
    },
    clarkkent: {
        Name: "Clark Kent",
        HighScore: 46
    },
    lebronjames: {
        Name: "Lebron James",
        HighScore: 29
    },
    taylorswift: {
        Name: "Taylor Swift",
        HighScore: 22
    },
    peppapig: {
        Name: "Peppa Pig",
        HighScore: 16
    },
    subjectzero: {
        Name: "Patient Zero",
        HighScore: 12
    },
    walle: {
        Name: "Wall-E",
        HighScore: 2
    }
};

var backgroundImages = {
    "bricks": "background.png",
    "plains": "plains.jpg",
    "city": "city.jpg",
    "desert": "desert.jpg"
}

var selectedBackground = "bricks";

function getHighscores() {

    let highscoreList = [];
    for (user in users) {
        highscoreList.push(users[user]);
    }

    highscoreList.sort(compare);

    return highscoreList;

}

function compare(a, b) {
    

    let result;
    if (a.HighScore > b.HighScore) {
        result = -1;
    }
    else if (a.HighScore < b.HighScore) {
        result = 1;
    }
    else
        result = 0;

    return result;
}


function addUser(nameID) {
    if(users === undefined)
        users = {};

    if (users[nameID] == null) {
        // let nameID = nameID; //  + idCounter;
        users[nameID] = {
            Name: nameID,
            Pattern: [],
            HighScore: 0
        }
    }
    return users;
}

app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("New express client");
    console.log("Received: ");
    console.log(JSON.parse(req.query['data']));
    var z = JSON.parse(req.query['data']);

    let action = z.action;

    // check if the request action is generateCode
    if (action == "initializeUser") {
        // idCounter++;
        nameID = z['name'];

        // check if user exists
        addUser(nameID);
    }
    else if (action == "initializeGame") {
        console.log("game initialized", z);
        identity = z['identity'];
        addUser(identity);
        if (z['hardMode']) {
            num_shapes = 9;
        } else {
            num_shapes = 4;
        }

        users[identity].Pattern = []; // reset pattern

        generatePattern(identity, num_shapes);

        let jsontext = JSON.stringify({
            'action': 'initializeGame',
            'nameID': identity,
            'msg': 'New pattern generated',
            'pattern': users[identity].Pattern
        });

        console.log("return item", jsontext);
        console.log("users", users);
        res.send(jsontext);
    } else if (action == "extendPattern") {
        let identity = z['identity'];

        generatePattern(identity, num_shapes);
        let jsontext = JSON.stringify({
            'action': 'extendPattern',
            'msg': 'Extended pattern',
            'pattern': users[identity].Pattern
        });

        console.log(jsontext);
        res.send(jsontext);
    } else if (action == "endGame") {
        let identity = z['identity'];
        let score = z['score'];

        coins += score;

        // update high score
        if (score > users[identity].HighScore)
            users[identity].HighScore = score;

    } else if (action == "purchase") {
        let cost = z['cost'];
        let purchaseType = z['purchaseType'];
        let purchaseSuccessful = false;
        let item = z['item'];

        if (cost <= coins) {
            coins -= cost;
            purchaseSuccessful = true;

            switch (purchaseType) {
                case "background":
                    selectedBackground = item;
                    item = backgroundImages[item];
                    break;
                case "extras":
                    if (item == "extraLife")
                        extraLives++;
                    else if (item == "hint")
                        hints++;
                    break;
                default:
                    break;
            }
        }

        let jsontext = JSON.stringify({
            'action': 'purchase',
            'coins': coins,
            'purchaseType': purchaseType,
            'success': purchaseSuccessful,
            'item': item
        });

        res.send(jsontext);
    } else if (action == "getGameSettings") {
        let jsontext = JSON.stringify({
            'action': 'getGameSettings',
            'background': selectedBackground,
            'backgroundImage': backgroundImages[selectedBackground],
            'coins': coins,
            'defaultLives': defaultLives,
            'extraLives': extraLives,
            'hints': hints
        });

        res.send(jsontext);
    } else if (action == "updateLifeCount") {
        if (extraLives > 0)
            extraLives += z['count'];
    }
    else if (action == "getHint") {
        let showHint = false;
        if (hints > 0){
            showHint = true;
            hints--;
        }

        let jsontext = JSON.stringify({
            'action': 'getHint',
            'showHint': showHint,
            "hints": hints
        });

        res.send(jsontext);
    }
    else if (action == "getHighScores"){

        let highscores = getHighscores();
        let jsontext = JSON.stringify({
            'action': 'getHighScores',
            'highscores': highscores
        });

        res.send(jsontext);
    }
    else {
        res.send(JSON.stringify({ 'msg': 'error!!!' }));
    }
}).listen(3000);
console.log("Server is running! (listening on port " + port + ")");

function generatePattern(clientName, maxNumber) {
    let randomShape = Math.floor(Math.random() * maxNumber) + 1;

    addUser(clientName); 

    // update pattern for client
    let pattern = users[clientName].Pattern;
    console.log("current pattern", pattern)
    pattern.push(randomShape);
    users[clientName].Pattern = pattern;

    return pattern;
}