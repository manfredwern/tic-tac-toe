import { BOARD_CELLS } from "../constants/playingBoard";
import { WIN_COMBINATIONS } from "../constants/combination";
import Players from "./players";
import Board from './board';
import { isSubset } from './utils';

export default class Game extends Board {

    constructor() {
        super();
        this.lastAction = {};
        this.playersAction = [];
        this.hasWinner = false;
        this.isFirstPlayerTurn = true; // Set player 1 as the starting player
        this.players = new Players();
        this.bind();
    }

    bind() {
        this.addCellClickEvents = this.addCellClickEvents.bind(this);
        this.addUndoClickEvent = this.addUndoClickEvent.bind(this);
        this.initializePlayers = this.addPlayers.bind(this);
        this.setCurrentPlayer = this.setCurrentPlayer.bind(this);
    }

    setupGame() {
        this.createBoard();
        this.addCellClickEvents();
        this.addUndoClickEvent();
        this.showActionsList();
    }

    startGame() {
        this.addPlayers();
        this.setCurrentPlayer();
        this.updatePlayerInfo(this.players.currentPlayer.alias);
    }

    addCellClickEvents() {
        for (const boardCell of BOARD_CELLS) {
            let cellElement = document.querySelector('#cell' + boardCell.cellId);
            cellElement.addEventListener('click', () => {
                if (cellElement.classList.contains('clicked') || this.hasWinner) { return }

                this.markBoardCell(boardCell, cellElement);
                this.enableUndoButton();

                document.querySelector('pre').innerHTML += JSON.stringify(this.lastAction) + '\n';
                this.checkIfPlayerWon(this.players.currentPlayer.alias);
                this.switchPlayerTurn();
                this.updateNextPlayerStatus();
            })
        }
    }

    addUndoClickEvent() {
        const undoBtn = document.querySelector('.undo-btn button');
        undoBtn.addEventListener('click', () => {
            this.undoAction(this.lastAction);
        })
    }

    undoAction(lastAction) {
        if (!this.playersAction.length) { return }

        // Update Board status
        this.unmarkBoardCell(lastAction);
        this.switchPlayerTurn();
        this.updateNextPlayerStatus()
        this.disableUndoButton();
    }

    disableUndoButton() {
        document.querySelector('.undo-btn button').setAttribute('disabled', true);
    }

    enableUndoButton() {
        document.querySelector('.undo-btn button').removeAttribute('disabled');
    }

    showActionsList() {
        const pre = document.createElement('pre');
        document.querySelector('#app').appendChild(pre);
    }

    // initialize players
    addPlayers() {
        this.players.setPlayer('Cactus', 'human');
        this.players.setPlayer('Jack');
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
        if (this.playersAction.length === BOARD_CELLS.length) {
            this.updatePlayerInfo('the end');
            return;
        }

        this.updatePlayerInfo(this.players.currentPlayer.alias);
    }

    checkIfPlayerWon(player) {
        let playerCells = this.playingBoard.filter(item => item.player === player).map(item => item.cellId);

        for (const combination of WIN_COMBINATIONS) {
            let isMatch = isSubset(playerCells, combination);

            if (isMatch) {
                console.log('The winner is: ', player);
                this.updatePlayerInfo('The winner is: ' + player);
                this.hasWinner = true;
                this.disableUndoButton();
                return;
            }
        }
    }

    updatePlayerInfo(player) {
        document.querySelector('.active-game').innerHTML = player
    }

}

