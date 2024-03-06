/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn, playSound } = require("../game");
jest.spyOn(window, "alert").mockImplementation(() => { });

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("pre-game", () => {
    test("clicking buttons before newGame should fail", () => {
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("choices contain correct ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);
    });
    test("lastButton key exists", () => {
        expect("lastButton" in game).toBe(true);
    });
    test("turnInProgress key exists", () => {
        expect("turnInProgress" in game).toBe(true);
    });
    test("turnInProgress is false", () => {
        expect(game.turnInProgress).toBe(false);
    });    
});

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 5;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        document.getElementById("score").innerText = "5";
        newGame();
    });
    test("expect data-listener to be true", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        }
    });
    test("should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });
    test("should display 0 for the element with id of score", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });
    test("should clear the player moves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test("should add one move to the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test("should update the turn number to 0", () => {
        expect(game.turnNumber).toBe(0);
    });
    test("expect data-listener to be true", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        };
    });
});

describe("gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 5;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("should increment the score if the turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    
    test("should toggle turnInProgress to true during computer sequence", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("clicking during computer sequence should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});

describe("HTML classes and ids", () => {
    test("all circles have the correct class", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.classList).toContain("circle");
        };
    });
    test("all circles have the correct id", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.id).toMatch(/button[1-4]/);
        };
    });
    test("score has the correct id", () => {
        expect(document.getElementById("score").id).toEqual("score");
    });
    test("score has the correct class", () => {
        expect(document.getElementById("score").classList).toContain("scorebox");
    });
    test("score has the correct text", () => {
        expect(document.getElementById("score").innerHTML).toEqual("0");
    });
});

describe("HTML head", () => {
    test("css is linked", () => {
        const linkElements = document.querySelectorAll("link");
        // Check if any <link> element has href pointing to style.css
        const cssLinked = Array.from(linkElements).some(link => {
            const href = link.getAttribute("href");
            return href && href.includes("style.css");
        });
        expect(cssLinked).toBe(true);
    });
    test("title is added", () => {
        expect(document.title).toEqual("Jest Simon Game");
    });
});
// Got the solution from https://jestjs.io/docs/es6-class-mocks and https://stackoverflow.com/questions/69591847/how-do-i-mock-audio-api-in-jest-properly
describe("playSound function", () => {
     // Mock the Audio object and its play method
     const mockAudioPlay = jest.fn();
     global.Audio = jest.fn().mockImplementation(() => ({
         play: mockAudioPlay,
     }));
    test("plays sound for sound 1", () => {
        // Call the function
        playSound("sound1");
        // Expectations
        expect(global.Audio).toHaveBeenCalledWith("assets/sounds/retro-video-game-coin-pickup-38299.mp3");
        expect(mockAudioPlay).toHaveBeenCalled();
    });
    test("plays sound for sound 2", () => {
        // Call the function
        playSound("sound2");
        // Expectations
        expect(global.Audio).toHaveBeenCalledWith("assets/sounds/negative_beeps-6008.mp3");
        expect(mockAudioPlay).toHaveBeenCalled();
    });
    // Add more tests for other sound identifiers as needed
});
