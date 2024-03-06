/**
 * @jest-environment jsdom
 */

const { beforeAll } = require("jest-circus");
const { game, newGame } = require("../game");


beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
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
    test("choices contains current ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    });
});

describe("new game works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        game.newGame();
    });
    test("score is 0", () => {
        expect(game.score).toBe(0);
    });
    test("currentGame is an empty array", () => {
        expect(game.currentGame).toEqual([]);
    });
    test("playerMoves is an empty array", () => {
        expect(game.playerMoves).toEqual([]);
    });
});

