
let game = {
    currentGame: [],
    playerMoves: [],
    score: 0,
    choices: ["button1", "button2", "button3", "button4"],
    turnNumber: 0,
    lastButton: "",
    turnInProgress: false
};


const soundSources = {
    sound1: "assets/sounds/retro-video-game-coin-pickup-38299.mp3",
    sound2: "assets/sounds/negative_beeps-6008.mp3"
};
function playSound(sound) {
    const audio = new Audio(soundSources[sound]);
    audio.play();
}

function newGame() {
    game.currentGame = [];
    game.playerMoves = [];
    game.score = 0;
    for (let circle of document.getElementsByClassName("circle")) {
        if (circle.getAttribute("data-listener") !== "true") {
            circle.addEventListener("click", (e) => {
                if (game.currentGame.length > 0 && !game.turnInProgress) {
                    let move = e.target.getAttribute("id");
                    game.lastButton = move;
                    lightsOn(move);
                    game.playerMoves.push(move);
                    playerTurn();
                };
            });
            circle.setAttribute("data-listener", "true");
        };
    };
    showScore();
    addTurn();
};
function addTurn() {
    game.playerMoves = [];
    game.currentGame.push(game.choices[(Math.floor(Math.random() * 4))]);
    showTurns();
};

function showScore() {
    document.getElementById("score").innerText = game.score;
};

function lightsOn(circ) {
    document.getElementById(circ).classList.add("light");
    playSound('sound1');
    setTimeout(() => {       
        document.getElementById(circ).classList.remove("light");
    }, 1000);
};

function showTurns() {
    game.turnInProgress = true;
    game.turnNumber = 0;
    let turns = setInterval(() => {
        lightsOn(game.currentGame[game.turnNumber]);
        game.turnNumber++;
        if (game.turnNumber >= game.currentGame.length) {
            clearInterval(turns);
            game.turnInProgress = false;
        }
    }, 1000);
};

function playerTurn() {
    let i = game.playerMoves.length - 1;
    if (game.playerMoves[i] === game.currentGame[i]) {
        if (game.playerMoves.length == game.currentGame.length) {
            game.score++;
            showScore();
            addTurn();
        }
    }else {
        playSound("sound2"); 
        setTimeout(() => {
            alert("Wrong move!");
            newGame(); 
        }, 1000); // Delay of 1000 milliseconds (1 second)
    }
};

module.exports = { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn, playSound};