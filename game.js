
var url = "http://localhost:3000/post";  // http://indigo.eecs.yorku.ca:3000/post
var lifeCount;
var score;
var answer;
var guessCounter;
var tutorialMode;
var hardMode;

var instructionCounter;
var advance;

var myName;
var identity;

window.onload = function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    init();

    tutorialMode = (params.mode == "tutorial");
    hardMode = (params.mode == "hard");

    buildGameboard();

    if (tutorialMode) {
        $("#startTutorial").show();
        advance = true;
        advanceInstructions();
    }
    else {
        $('#startMessage').show();
    }
};

function init() {
    $.post(url + '?data=' + JSON.stringify({
        'action': 'getGameSettings'
    }), responseFunction);

    guessCounter = 0;
    answer = [];
    score = 0;

    $(".overlay-content").hide();
    $(".life").attr("src", "images/life.png");
    $("#score").text(score);
    $(".instruction").hide();
}

function buildGameboard() {
    let table;
    if (hardMode) {
        table = `<table>
        <tr>
            <td>
                <div id="btnShape_1" class="shape circle" tabindex="1" shape="1"></div>
            </td>
            <td>
                <div id="btnShape_2" class="shape triangle" tabindex="2" shape="2"></div>
            </td>
            <td>
                <div id="btnShape_3" class="shape square" tabindex="3" shape="3"></div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="btnShape_4" class="shape pentagon" tabindex="4" shape="4"></div>
            </td>
            <td>
                <div id="btnShape_5" class="shape cylinder" tabindex="5" shape="5"></div>
            </td>
            <td>
                <div id="btnShape_6" class="shape rectangle" tabindex="6" shape="6"></div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="btnShape_7" class="shape star" tabindex="7" shape="7"></div>
            </td>
            <td>
                <div id="btnShape_8" class="shape parallelogram " tabindex="8" shape="8"></div>
            </td>
            <td>
                <div id="btnShape_9" class="shape trapezoid" tabindex="9" shape="9"></div>
            </td>
        </tr>
    </table>`;
    } else {
        table = `<table>
            <tr>
                <td>
                    <div id="btnShape_1" class="shape square" tabindex="1" shape="1"></div>
                </td>
                <td><div id="btnShape_2" class="shape triangle" tabindex="2" shape="2"></div></td>
            </tr>
            <tr>
                <td><div id="btnShape_3" class="shape circle" tabindex="3" shape="3"></div></td>
                <td><div id="btnShape_4" class="shape trapezoid" tabindex="4" shape="4"></div></td>
            </tr>
        </table>`;
    }

    $("#gameboard").html(table);
}

function PlayAgain() {
    init();
    StartGame();
}

// tutorial
$(document).on("click", "#startTutorialButton", function () {
    $("#startTutorial").hide();
    $(".overlay").hide();

    instructionCounter = 0;
});

$(document).on("click", "#game", function () {
    if (!tutorialMode)
        return;

    console.log(instructionCounter);
    advanceInstructions();
});


function advanceInstructions() {
    if (!advance)
        return;

    instructionCounter++;


    $(".instruction").hide();
    $(".instruction-" + instructionCounter).show();

    if (instructionCounter == 2) {
        advance = false;
        setTimeout(() => {
            $(".square").addClass("active");
            setTimeout(() => {
                $(".square").removeClass("active");
                setTimeout(() => {
                    advance = true;
                    advanceInstructions();
                }, 1000);
            }, 1000);
        }, 1000);

    }

    if (instructionCounter == 3) {
        advance = false;
    }

    if (instructionCounter == 5) {
        advance = false;
        setTimeout(() => {
            $(".square").addClass("active");
            setTimeout(() => {
                $(".square").removeClass("active");
                setTimeout(() => {
                    $(".trapezoid").addClass("active");
                    setTimeout(() => {
                        $(".trapezoid").removeClass("active");
                        setTimeout(() => {
                            advance = true;
                            advanceInstructions();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);

    }

    if (instructionCounter == 6) {
        $(".square").addClass("disabled");
        advance = false;
    }

    if (instructionCounter == 7) {
        loseLife();
    }

    if (instructionCounter > 7) {
        // go back to main menu
        $(".overlay").show();
        $("#endTutorial").show();
    }
}

// gameplay

$(document).on("click", "#go", function () {
    myName = $("#name").val();

    if (myName === '') {
        return;
    }
    $("#startMessage").hide();

    initUser();
    StartGame();
});

function GoToMainMenu() {
    window.open('index.html', "_self").focus();
}

function StartGame() {
    $(".shape").addClass("disabled");

    $("#countdown").show();

    setTimeout(() => {
        $("#countdown").text(2);
        setTimeout(() => {
            $("#countdown").text(1);
            setTimeout(() => {
                $("#countdown").hide();
                $(".overlay").hide();
                setTimeout(() => {
                    initGame();
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

function initUser() {
    $.post(url + '?data=' + JSON.stringify({
        'name': myName, //client's identity on the server
        'action': 'initializeUser'
    }), responseFunction);
}

function initGame() {
    $.post(url + '?data=' + JSON.stringify({
        'identity': myName, //client's identity on the server
        'action': 'initializeGame',
        'hardMode': hardMode
    }), responseFunction);
}

function playPattern(pattern) {
    console.log("play pattern", pattern);

    $(".shape").addClass("disabled");

    pattern.forEach((shape, index) => {
        setTimeout(() => {
            lightShape(shape);
        }, (index + 1) * 1000);
    });

    setTimeout(() => {
        $(".shape").removeClass("disabled");
    }, (pattern.length + 1) * 1000 + 100);
}

function lightShape(shape) {
    $("#btnShape_" + shape).addClass("active");
    setTimeout(() => {
        $("#btnShape_" + shape).removeClass("active");
    }, 700);
}

$(document).on("click", "#hint", function () {
    $.post(url + '?data=' + JSON.stringify({
        'action': 'getHint'
    }), responseFunction);
});

$(document).on("click", ".shape", function (event) {
    setTimeout(() => {
        this.blur();
    }, 300);
    
    if ($(this).hasClass("disabled"))
        return;

    if (tutorialMode) {
        let isCircle = $(this).hasClass("circle");
        let isTriangle = $(this).hasClass("triangle");
        let isSquare = $(this).hasClass("square");
        let isTrapezoid = $(this).hasClass("trapezoid");

        if (instructionCounter == 3 && isSquare) {
            event.stopPropagation()
            advance = true;
            let score = $("#score").text();
            score++;
            $("#score").text(score);
            advanceInstructions();
        }

        if (instructionCounter == 6 && !isSquare) {
            event.stopPropagation();
            advance = true;
            advanceInstructions();
        }
    }
    else {
        let correctShape = answer[guessCounter];
        let shape = $(this).attr("shape");
        if (shape == correctShape) {
            guessCounter++;
            if (guessCounter == answer.length) {
                guessCounter = 0;
                increaseScore();
                extendPattern();
            }
        }
        else {
            loseLife();

            if (lifeCount > 0)
                replayPattern();
            else
                endGame();
        }
    }

});

function endGame() {
    $("#earnedCoins").text(score);

    $(".overlay").show();
    $("#endMessage").show();

    $.post(url + '?data=' + JSON.stringify({
        'identity': myName, //client's identity on the server
        'action': 'endGame',
        'score': score
    }));
}

function increaseScore() {
    score++;
    $("#score").text(score);
}

function extendPattern() {
    $.post(url + '?data=' + JSON.stringify(
        {
            'identity': identity, //client's identity on the server
            'action': 'extendPattern'
        }
    ), responseFunction);
}

function replayPattern() {
    playPattern(answer);
    guessCounter = 0;
}

function loseLife() {
    $("#life" + lifeCount).attr("src", "images/lostlife.png");
    lifeCount--;

    // update extra life count if any extra lives were lost
    $.post(url + '?data=' + JSON.stringify({
        'action': 'updateLifeCount',
        'count': -1
    }));
}

function responseFunction(data, status) {
    var response = JSON.parse(data);
    console.log(data);

    if (response['action'] == 'getGameSettings') {
        let coins = response['coins'];
        let background = response['background']
        let backgroundImage = response['backgroundImage'];

        let defaultLives = response['defaultLives'];
        let extraLives = response['extraLives'];
        lifeCount = defaultLives + extraLives;

        let hints = response['hints'];

        setBackground(backgroundImage);
        initLives(lifeCount);

        if (hints == 0)
            $("#hint").prop("disabled", true);

    } else if (response['action'] == 'initializeGame') {
        identity = response['nameID'];
        answer = response['pattern'];
        playPattern(response['pattern']);
    }
    else if (response['action'] == 'extendPattern') {
        answer = response['pattern'];
        playPattern(response['pattern']);
    }
    else if (response['action'] == 'getHint') {
        if (response['showHint'])
            playPattern([answer[guessCounter]]); // show the next shape

        if (response['hints'] == 0)
            $("#hint").prop("disabled", true);
    }
}

function setBackground(image) {
    document.body.style.backgroundImage = `url(images/${image})`;
}

function initLives(lives) {
    $("#lives").html(""); // reset lives display

    for (let i = lives; i > 0; i--) {
        $("#lives").append(`<img id="life${i}" class="life" src="images/life.png" />`);
    }
}


