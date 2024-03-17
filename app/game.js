import { WIN_COMBINATIONS } from "../constants/combination";
import Players from "./players";
import Board from './board';
import { isSubset } from '../utils/isSubset';

const UNDO_BUTTON = 'button#undo';
const ACTIVE_PLAYER = 'div.active-player';
const HISTORY = 'pre#move-logs';

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
        this.addUndoClickEvent = this.addUndoClickEvent.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setCurrentPlayer = this.setCurrentPlayer.bind(this);
        this.checkForWinningPlayer = this.checkForWinningPlayer.bind(this);
        this.highlightWinBoardCells = this.highlightWinBoardCells.bind(this);
        this.onClickEvent = this.onClickEvent.bind(this);
        this.endOfGame = this.endGame.bind(this);
        this.undoAction = this.undoAction.bind(this);
    }

    setupGame() {
        this.createBoard();
        this.addCellClickEvents();
        this.addUndoClickEvent();
        this.disableUndoButton(true);
        this.showLogs();
    }

    startGame() {
        // Setup Players
        this.players.addPlayer('X', 'human');
        this.players.addPlayer('0', 'human');
        this.setCurrentPlayer();
        this.updatePlayerInfo(`${this.players.currentPlayer.name} goes first`);
        this.updateMoveHistory();
    }

    addCellClickEvents() {
        for (const boardCell of this.playingBoard) {
            let cellElement = document.querySelector('#cell' + boardCell.cellId);
            cellElement.addEventListener('click', this.onClickEvent);
        }
    }

    removeCellClickEvents() {
        for (const boardCell of this.playingBoard) {
            let cellElement = document.querySelector('#cell' + boardCell.cellId);
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
        document.querySelector(HISTORY).innerHTML = this.moveHistory.map(move => JSON.stringify(move)).join('\n');
    }

    addUndoClickEvent() {
        const undoBtn = document.querySelector(UNDO_BUTTON);
        undoBtn.addEventListener('click', this.undoAction);
    }

    undoAction() {
        if (!this.moveHistory.length) { return }

        // Update Board status
        this.unmarkBoardCell(this.lastAction);
        this.switchPlayerTurn();
        this.updateNextPlayerStatus()
        this.disableUndoButton(true);
        this.updateMoveHistory();
    }

    disableUndoButton(bool = true) {
        const button = document.querySelector(UNDO_BUTTON);
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
        if (this.hasWinner) { return }
        // Do not update if the games ends or a player wins
        if (this.moveHistory.length === this.playingBoard.length) {
            this.updatePlayerInfo('It\'s a draw!');
            this.endGame();
            return;
        }

        const suffixMessage = this.players.currentPlayer.name.match(/s$/) ? '\' turn' : '\'s turn';
        this.updatePlayerInfo(this.players.currentPlayer.name + suffixMessage);
    }

    checkForWinningPlayer(playerName) {
        let markedBoardCells = this.playingBoard.filter(item => item.player === playerName).map(item => item.cellId);
        for (const winCombination of WIN_COMBINATIONS) {
            let winner = isSubset(markedBoardCells, winCombination);
            if (winner) {
                this.updatePlayerInfo(`${playerName} wins!`);
                this.hasWinner = true;
                this.highlightWinBoardCells(winCombination);
                this.endGame();
                return;
            }
        }
    }

    updatePlayerInfo(player) {
        console.log(this.lastAction.class);
        const playerInfoElement = document.querySelector(ACTIVE_PLAYER);

        // Remove added classes from the player info
        if (!this.lastAction?.class) {
            playerInfoElement.className = playerInfoElement.classList.value.split(' ').shift();
        }

        playerInfoElement.classList.remove(this.lastAction.class + '-background');
        playerInfoElement.classList.add(this.players.currentPlayer.class + '-background');
        playerInfoElement.innerHTML = player
    }

    showLogs() {
        if (!this.isLogs) {
            document.querySelector(HISTORY).classList.add('hidden');
        }
    }

    endGame() {
        this.disableUndoButton(true);
        this.removeCellClickEvents();
    }
}

