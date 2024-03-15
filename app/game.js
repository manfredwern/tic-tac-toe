import { BOARD_CELLS } from "../constants/playingField";
import { WIN_COMBINATIONS } from "../constants/combination";
import GameSession from "./gameStatus";
import Players from "./players";
import Board from './board';
import { isSubset } from './utils';

export default class Game {

    // Board
    lastAction;
    currentBoard;
    actionList;

    // Player
    currentPlayer;
    players;

    // Identifiers
    isFirstPlayerTurn;
    hasWinner;

    // Instances
    gameSession;
    board;

    constructor() {
        this.currentBoard = [...BOARD_CELLS];
        this.lastAction = {};
        this.actionList = [];
        this.hasWinner = false;
        this.isFirstPlayerTurn = true;
        this.bind();
    }

    bind() {
        this.addCellClickEvents = this.addCellClickEvents.bind(this);
        this.addUndoClickEvent = this.addUndoClickEvent.bind(this);
        this.initializePlayers = this.addPlayers.bind(this);
        this.getCurrentPlayer = this.getCurrentPlayer.bind(this);
    }

    setupGame() {
        // Initiate Classes
        this.gameSession = new GameSession();
        this.board = new Board();
        this.players = new Players();
        // Add components
        this.board.createBoard();
        this.addCellClickEvents();
        this.addUndoClickEvent();
        this.showActionsList();
    }
    
    startGame() {
        this.addPlayers();
    }


    addCellClickEvents() {
        for (const boardCell of BOARD_CELLS) {
            let cell = document.querySelector('#cell' + boardCell.cell);
            cell.addEventListener('click', () => {
                if (cell.classList.contains('clicked') || this.hasWinner) { return }

                this.updateBoard(boardCell, cell);
                this.enableUndoButton();
                // Actions
                document.querySelector('pre').innerHTML += JSON.stringify(this.lastAction) + '\n';
                // Check board status
                this.checkIfPlayerWon(this.getCurrentPlayer().alias);

                if (!this.hasWinner) {
                    this.switchPlayerTurn();
                    this.updatePlayerStatus();
                }
            })
        }
    }

    addUndoClickEvent() {
        const undoBtn = document.querySelector('.undo-btn button');
        undoBtn.addEventListener('click', () => {
            this.undoAction(this.lastAction);
        })
    }

    updateBoard(boardCell, activeCell) {
        // Apply visual indicators on the board
        activeCell.classList.add('clicked');
        activeCell.classList.add(this.getCurrentPlayer().class);

        // Update Board status
        this.currentBoard.map(item => {
            if (item.cell === boardCell.cell) {
                item.player = this.getCurrentPlayer().alias;
                item.class = this.getCurrentPlayer().class;
                this.lastAction = item;
                this.actionList.push(this.lastAction);
            }
            return item;
        });
    }

    undoAction(boardCell) {
        if (!this.actionList.length) { return }
        
        // Update Board status
        this.currentBoard.map(item => {
            if (item.cell === boardCell.cell) {
                // Apply visual indicators on the board
                let activeCell = document.querySelector('#cell' + item.cell);
                if (activeCell.classList.contains(this.lastAction.class)) {
                    activeCell.classList.remove(this.lastAction.class);
                }
                if (activeCell.classList.contains('clicked')) {
                    activeCell.classList.remove('clicked');
                }

                item.player = '';
                item.class = '';
                this.actionList = this.actionList.filter(action => action !== this.lastAction);
            }
            return item;
        });
        this.switchPlayerTurn();
        this.updatePlayerStatus()

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
        this.players = new Players();

        // Assign players its type
        this.players.setPlayer('Cactus', 'human');
        this.players.setPlayer('Jack');


        // Set player 1 as the starting player
        this.setCurrentPlayer();
        this.gameSession.updatePlayerInfo(this.getCurrentPlayer().alias);
    }

    getCurrentPlayer() {
        return this.players.allPlayers()[this.currentPlayer];
    }

    getPreviousPlayer() { }

    setCurrentPlayer() {
        this.currentPlayer = this.isFirstPlayerTurn ? 0 : 1;
    }

    switchPlayerTurn() {
        this.isFirstPlayerTurn = !this.isFirstPlayerTurn;
        this.setCurrentPlayer();
    }

    updatePlayerStatus() {

        // Do not update if the games ends or a player wins
        if (this.actionList.length === BOARD_CELLS.length) {
            this.gameSession.updatePlayerInfo('the end');
            return;
        }

        this.gameSession.updatePlayerInfo(this.getCurrentPlayer().alias);
    }

    checkIfPlayerWon(player) {
        let playerCells = this.currentBoard.filter(item => item.player === player).map(item => item.cell);

        for (const combination of WIN_COMBINATIONS) {
            let isMatch = isSubset(playerCells, combination);

            if (isMatch) {
                console.log('The winner is: ', player);
                this.gameSession.updatePlayerInfo('The winner is: ' + player);
                this.hasWinner = true;
                this.disableUndoButton();
                return;
            }
        }
    }


}

