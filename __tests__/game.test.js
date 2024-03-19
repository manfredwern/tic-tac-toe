import Game from '../app/game';
import { describe, expect, it, beforeEach, beforeAll } from 'vitest';

describe('Test Game', () => {

    let game;
    const CELL_SELECTOR = 'div#cell';
    const GAME_STATUS_SELECTOR = 'div.game-status';
    const UNDO_BUTTON_SELECTOR = 'button#undo';

    beforeAll(() => {
        const div = document.createElement('div');
        div.setAttribute('id', 'app');
        div.innerHTML = `
            <h1 class="game-title">TIC-TAC-TOE</h1>
            <div class="game-status"></div>
            <div id="board-container">
            <div id="board"></div>
            </div>
            <div id="game-control">
            <button id="undo" type="button">Undo</button>
            <button id="new-game" type="button">New Game</button>
            </div>
            <pre id="move-logs"></pre>
        `;
        document.body.append(div);
    })

    beforeEach(() => {
        game = new Game();
        game.initializeBoard();
        game.startGame();
    });

    it('should initialize game with an empty board', () => {
        expect(game.playingBoard.every(cell => cell.player === '')).toBe(true);
    });

    it("should update the board correctly when a player makes a move", () => {
        // Get the first cell element
        const cellElement = document.querySelector(CELL_SELECTOR + game.playingBoard[0].cellId);

        // Simulate a click event on the first cell
        cellElement.click();

        // Check if the cell has been marked correctly
        expect(cellElement.classList.contains('clicked')).toBe(true);
        expect(cellElement.classList.contains('player1')).toBe(true);
        expect(game.playingBoard[0].className).toBe(game.lastAction.className);
        expect(game.moveHistory.length).toBe(1);
        expect(game.moveHistory[0]).toEqual(game.playingBoard[0]);
    });

    // game correctly identifies a winning condition
    it("should correctly identify a winning condition", () => {
        // Simulate click events to form a winning combination
        const moves = [1, 4, 2, 5, 3];

        moves.forEach(move => document.querySelector(CELL_SELECTOR + move).click());

        // Check if the game correctly identifies the winning condition
        expect(game.hasWinner).toBe(true);
        expect(document.querySelector(GAME_STATUS_SELECTOR).innerHTML).toBe(`${game.players.currentPlayer.name} wins!`);
    });

    it("should correctly identify a draw condition", () => {
        // Simulate click events on all cells
        const moves = [1, 2, 5, 3, 6, 4, 7, 9, 8];

        moves.forEach(move => document.querySelector(CELL_SELECTOR + move).click());

        // Check if the game correctly identifies the draw condition
        expect(game.hasWinner).toBe(false);
        expect(document.querySelector(GAME_STATUS_SELECTOR).innerHTML).toBe("It's a draw!");
    });

    it("should reverts the last move successfully on undo", () => {
        // Simulate click events on all cells
        const moves = [1, 2];
        const player2Move = moves[1];
        const undoBtn = document.querySelector(UNDO_BUTTON_SELECTOR);

        moves.forEach(move => document.querySelector(CELL_SELECTOR + move).click());

        // Before Undo
        const previousMoveHistoryLength = game.moveHistory.length;
        expect(document.querySelector(CELL_SELECTOR + player2Move).classList).toContain('clicked');

        undoBtn.click();

        // After Undo
        expect(document.querySelector(CELL_SELECTOR + player2Move).classList).not.toContain('clicked');

        // Check if the game correctly identifies the draw condition
        expect(game.moveHistory.length).toBeLessThan(previousMoveHistoryLength);
    });
});