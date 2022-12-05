let url = "http://localhost:3000/post";  // http://indigo.eecs.yorku.ca:3000/post
let score = 5;

window.onload = function () {
    init();
}

function init(){
    $.post(url + '?data=' + JSON.stringify({
        'action': 'getGameSettings'
    }), responseFunction);
}

function initGame() {
    if($("#difficultySwitch").prop("checked"))
        window.open('game.html?mode=hard', "_self").focus();
    else
        window.open('game.html', "_self").focus();
}

function initTutorial() {
    window.open('game.html?mode=tutorial', "_self").focus();
}

function purchaseItem(type, cost, style){
    $.post(url + '?data=' + JSON.stringify({
        'action': 'purchase',
        'purchaseType': type,
        'item': style,
        'cost': cost
    }), responseFunction);
}

$(document).on("click", ".backgroundImage", function () {
    let cost = $(this).attr("data-cost");
    let style = $(this).attr("id");

    purchaseItem("background", cost, style);
});

$(document).on("click", ".extras", function(){
    let cost = $(this).attr("data-cost");
    let item = $(this).attr("id");

    purchaseItem("extras", cost, item);
});

function getHighScores() {
    $.post(url + '?data=' + JSON.stringify({
        'action': 'getHighScores'
    }), responseFunction);
}
function initModal(modalID){
    let modal = $("#" + modalID);
    modal.css("display", "block");
    let closeButton = modal.find(".close");

    if(modalID == "scoreModal"){
        getHighScores();
    }


    closeButton.on("click", function(){
        modal.css("display", "none");
    });

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.css("display", "none");
        }
    }
}

function initExit() {
    if (confirm("Close Window?")) {
        close();
    }
}

function responseFunction(data, status){
    var response = JSON.parse(data);
    if (response['action'] == 'getGameSettings') {
        let coins = response['coins'];
        let background = response['background']
        let backgroundImage = response['backgroundImage'];
        
        setBackground(backgroundImage);
        $("#wallet").text(coins);
        $("#" + background).prop('checked', true);
    } else if (response['action'] == 'purchase') {
        let sucessfulPurchase = response['success'];
        let coins = response['coins'];
        let purchaseType = response['purchaseType']
        $("#wallet").text(coins);

        if(sucessfulPurchase){
            if(purchaseType == "background")
                setBackground(response['item']);
        }
        else
            alert("Not enough coins to purchase");
    } else if (response['action'] == 'getHighScores') {
        let highscore = response['highscores'];
        let html = (highscore) => {
            let table = '';
            highscore.forEach((user, index) => {
                if (index < 10) {
                    table += `<p> ${index + 1}) ${user.HighScore}.................... ${user.Name}</p>`;
                }
            })
            
            return table;
        }

        let table = html(highscore);
        $('#score').html(table);
        return table;

    }
}
function setBackground(image){
    $("body").css("backgroundImage", `url(images/${image})`);
}

