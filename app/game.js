import { WIN_COMBINATIONS } from "../constants/combination";
import Players from "./players";
import Board from './board';
import { isSubset } from '../utils/isSubset';

const CELL_SELECTOR = 'div#cell';
const UNDO_BUTTON_SELECTOR = 'button#undo';
const GAME_STATUS_SELECTOR = 'div.game-status';
const HISTORY_SELECTOR = 'pre#move-logs';
const PLAYER_1 = 'X';
const PLAYER_2 = 'O';

export default class Game extends Board {

    constructor() {
        super();
        this.lastAction = {};
        this.moveHistory = [];
        this.hasWinner = false;
        this.isFirstPlayerTurn = true; // Set player 1 as the starting player
        this.players = new Players();
        this.isLogs = false; // Set to true to see move history
        this.bind();
    }

    bind() {
        this.addCellClickEvents = this.addCellClickEvents.bind(this);
        this.addUndoClickEvent = this.addUndoButtonEvent.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setCurrentPlayer = this.setCurrentPlayer.bind(this);
        this.checkForWinningPlayer = this.checkForWinningPlayer.bind(this);
        this.highlightWinBoardCells = this.highlightWinBoardCells.bind(this);
        this.onClickEvent = this.onClickEvent.bind(this);
        this.onUndoMove = this.onUndoMove.bind(this);
        this.endOfGame = this.endGame.bind(this);
    }

    initializeBoard() {
        this.createBoard();
        this.addCellClickEvents();
        this.addUndoButtonEvent();
        this.disableUndoButton(true);
        this.showLogs();
    }

    startGame() {
        // Setup Players
        this.players.addPlayer(PLAYER_1);
        this.players.addPlayer(PLAYER_2);
        this.setCurrentPlayer();
        // Game Status
        this.updateGameStatusBoard(`${this.players.currentPlayer.name} goes first`);
        this.updateMoveHistory();
    }

    addCellClickEvents() {
        for (const boardCell of this.playingBoard) {
            let cellElement = document.querySelector(CELL_SELECTOR + boardCell.cellId);
            cellElement.addEventListener('click', this.onClickEvent);
        }
    }

    removeCellClickEvents() {
        for (const boardCell of this.playingBoard) {
            let cellElement = document.querySelector(CELL_SELECTOR + boardCell.cellId);
            cellElement.removeEventListener('click', this.onClickEvent);
        }
    }

    onClickEvent(event) {
        const cellElement = event.target;
        const cellId = parseInt(cellElement.id.split(/[a-z]+/).pop());

        if (cellElement.classList.contains('clicked') || this.hasWinner) { return }
        this.markBoardCell(cellId, cellElement);
        this.disableUndoButton(false);
        this.updateMoveHistory(this.lastAction);
        this.checkForWinningPlayer(this.players.currentPlayer.name);
        this.switchPlayerTurn();
        this.updateNextPlayerStatus();
    }

    updateMoveHistory() {
        if (!this.showLogs) { return }
        document.querySelector(HISTORY_SELECTOR).innerHTML = this.moveHistory.map(move => JSON.stringify(move)).join('\n');
    }

    addUndoButtonEvent() {
        const undoBtn = document.querySelector(UNDO_BUTTON_SELECTOR);
        undoBtn.addEventListener('click', this.onUndoMove);
    }

    removeUndoButtonEvent() {
        const undoBtn = document.querySelector(UNDO_BUTTON_SELECTOR);
        undoBtn.removeEventListener('click', this.onUndoMove);
    }

    onUndoMove() {
        if (!this.moveHistory.length) { return }

        // Update Board status
        this.unmarkBoardCell(this.lastAction);
        this.switchPlayerTurn();
        this.updateNextPlayerStatus()
        this.disableUndoButton(true);
        this.updateMoveHistory();
    }

    disableUndoButton(bool = true) {
        const button = document.querySelector(UNDO_BUTTON_SELECTOR);
        bool ? button.setAttribute('disabled', '') : button.removeAttribute('disabled');
    }

    setCurrentPlayer() {
        const currentPlayer = this.isFirstPlayerTurn ? 0 : 1;
        this.players.currentPlayer = this.players.allPlayers()[currentPlayer];
    }

    switchPlayerTurn() {
        if (this.hasWinner) { return }
        this.isFirstPlayerTurn = !this.isFirstPlayerTurn;
        this.setCurrentPlayer();
    }

    updateNextPlayerStatus() {
        // Do not update if the game ends or a player wins
        if (this.hasWinner) { return }
        if (this.moveHistory.length === this.playingBoard.length) {
            this.updateGameStatusBoard('It\'s a draw!');
            this.endGame();
            return;
        }

        const suffixMessage = this.players.currentPlayer.name.match(/s$/) ? '\' turn' : '\'s turn';
        this.updateGameStatusBoard(this.players.currentPlayer.name + suffixMessage);
    }

    checkForWinningPlayer(playerName) {
        let markedBoardCells = this.playingBoard.filter(item => item.player === playerName).map(item => item.cellId);
        for (const winCombination of WIN_COMBINATIONS) {
            let winner = isSubset(markedBoardCells, winCombination);
            if (winner) {
                this.updateGameStatusBoard(`${playerName} wins!`);
                this.hasWinner = true;
                this.highlightWinBoardCells(winCombination);
                this.endGame();
                return;
            }
        }
    }

    updateGameStatusBoard(statusMessage = '') {
        const boardDiv = document.querySelector(GAME_STATUS_SELECTOR);

        // Remove added classes from the game status on a new game
        if (!this.lastAction?.className) {
            boardDiv.className = boardDiv.classList.value.split(' ').shift();
        }

        boardDiv.classList.remove(this.lastAction.className + '-background');
        boardDiv.classList.add(this.players.currentPlayer.className + '-background');
        boardDiv.innerHTML = statusMessage
    }

    showLogs() {
        if (!this.isLogs) {
            document.querySelector(HISTORY_SELECTOR).classList.add('hidden');
        }
    }

    endGame() {
        this.disableUndoButton(true);
        this.removeCellClickEvents();
        this.removeUndoButtonEvent();
    }
}

