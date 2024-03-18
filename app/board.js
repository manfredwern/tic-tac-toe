import { generateBoardCellsData } from "../constants/playingBoard";

const BOARD_SELECTOR = 'div#board';
const CELL_SELECTOR = 'div#cell';

export default class Board {

    constructor() {
        // Use a function instead of a variable to return board cells to avoid mutation
        this.playingBoard = generateBoardCellsData();
        this.boardCellsHTML = '';
    }

    createBoard() {
        for (const boardCell of this.playingBoard) {
            let div = document.createElement('div');
            div.setAttribute('id', 'cell' + boardCell.cellId);
            div.setAttribute('class', 'cell');
            this.boardCellsHTML += div.outerHTML;
        }
        document.querySelector(BOARD_SELECTOR).innerHTML = this.boardCellsHTML;
    }

    markBoardCell(cellId, cellDiv) {
        // Apply visual indicators to the board‚
        cellDiv.classList.add('clicked');
        cellDiv.classList.add(this.players.currentPlayer.className);

        // Update Board status
        this.playingBoard.map(item => {
            if (item.cellId === cellId) {
                item.player = this.players.currentPlayer.name;
                item.className = this.players.currentPlayer.className;
                this.lastAction = item;
                this.moveHistory.push(this.lastAction);
            }
            return item;
        });
    }

    unmarkBoardCell({cellId, className}) {
        this.playingBoard.map(item => {
            if (item.cellId === cellId) {
                // Apply visual indicators to the board
                let cellDiv = document.querySelector(CELL_SELECTOR + item.cellId);
                if (cellDiv.classList.contains(className)) {
                    cellDiv.classList.remove(className);
                }
                if (cellDiv.classList.contains('clicked')) {
                    cellDiv.classList.remove('clicked');
                }

                // Update Board status
                item.player = '';
                item.className = '';
                this.moveHistory = this.moveHistory.filter(action => action !== boardCell);
            }
            return item;
        });
    }

    highlightWinBoardCells(combination = []) {
        this.playingBoard.forEach((cell) => {
            const hasWon = combination.includes(cell.cellId);
            const { className } = this.players.currentPlayer;
            const highlightClass = className + '--' + (hasWon ? 'win' : 'lose');
            document.querySelector(CELL_SELECTOR + cell.cellId).classList.add(highlightClass);
        });
    }

}