import { WIN_COMBINATIONS } from "../constants/combination";
import Players from "./players";
import Board from './board';
import { isSubset } from '../utils/isSubset';

export default class Game extends Board {

    constructor() {
        super();
        this.lastAction = {};
        this.moveHistory = [];
        this.hasWinner = false;
        this.isFirstPlayerTurn = true; // Set player 1 as the starting player
        this.players = new Players();
        this.bind();
    }

    bind() {
        this.addCellClickEvents = this.addCellClickEvents.bind(this);
        this.addUndoClickEvent = this.addUndoClickEvent.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setCurrentPlayer = this.setCurrentPlayer.bind(this);
        this.checkForWinningPlayer = this.checkForWinningPlayer.bind(this);
        this.highlightWinBoardCells = this.highlightWinBoardCells.bind(this);
    }

    setupGame() {
        this.createBoard();
        this.addCellClickEvents();
        this.addUndoClickEvent();
        this.disableUndoButton(true);
    }

    startGame() {
        // Setup Players
        this.players.addPlayer('Cactus', 'human');
        this.players.addPlayer('Jack');
        this.setCurrentPlayer();
        this.updatePlayerInfo(this.players.currentPlayer.name + ' starts the game');
        this.updateMoveHistory();
    }

    addCellClickEvents() {
        console.log('addCellClickEvents', this.playingBoard);
        for (const boardCell of this.playingBoard) {
            let cellElement = document.querySelector('#cell' + boardCell.cellId);
            cellElement.addEventListener('click', () => {
                if (cellElement.classList.contains('clicked') || this.hasWinner) { return }

                this.markBoardCell(boardCell, cellElement);
                this.disableUndoButton(false);
                this.updateMoveHistory(this.lastAction);
                this.checkForWinningPlayer(this.players.currentPlayer.name);
                this.switchPlayerTurn();
                this.updateNextPlayerStatus();
            });
        }
    }

    updateMoveHistory() {
        document.querySelector('pre#action-list').innerHTML = this.moveHistory.map(move => JSON.stringify(move)).join('\n');
    }

    addUndoClickEvent() {
        const undoBtn = document.querySelector('button#undo');
        undoBtn.addEventListener('click', () => {
            this.undoAction(this.lastAction);
        })
    }

    undoAction(lastAction) {
        if (!this.moveHistory.length) { return }

        // Update Board status
        this.unmarkBoardCell(lastAction);
        this.switchPlayerTurn();
        this.updateNextPlayerStatus()
        this.disableUndoButton(true);
        this.updateMoveHistory();
    }

    disableUndoButton(bool = true) {
        const button = document.querySelector('button#undo');
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
            this.disableUndoButton(true);
            return;
        }

        const suffixMessage = this.players.currentPlayer.name.match(/s$/) ? '\' turn' : '\'s turn';
        this.updatePlayerInfo(this.players.currentPlayer.name + suffixMessage);
    }

    checkForWinningPlayer(playerName) {
        let markedBoardCells = this.playingBoard.filter(item => item.player === playerName).map(item => item.cellId);
        console.log('board: ', this.playingBoard);
        console.log('marked: ', markedBoardCells);
        for (const winCombination of WIN_COMBINATIONS) {
            let winner = isSubset(markedBoardCells, winCombination);
            if (winner) {
                console.log('winner', winner);
                console.log('winner', markedBoardCells);
                console.log('winner', winCombination);
                this.updatePlayerInfo('The winner is: ' + playerName);
                this.hasWinner = true;
                this.disableUndoButton(true);
                this.highlightWinBoardCells(winCombination);
                return;
            }
        }
    }

    updatePlayerInfo(player) {
        document.querySelector('.active-game').innerHTML = player
    }
}

