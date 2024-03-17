import { generateBoardCellsData } from "../constants/playingBoard";

const BOARD = 'div#board';
const CELL = 'div#cell';

export default class Board {
    constructor() {
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
        document.querySelector(BOARD).innerHTML = this.boardCellsHTML;
    }

    markBoardCell(cellId, cellDivElement) {
        // Apply visual indicators on the board‚
        cellDivElement.classList.add('clicked');
        cellDivElement.classList.add(this.players.currentPlayer.class);

        // Update Board status
        this.playingBoard.map(item => {
            if (item.cellId === cellId) {
                item.player = this.players.currentPlayer.name;
                item.class = this.players.currentPlayer.class;
                this.lastAction = item;
                this.moveHistory.push(this.lastAction);
            }
            return item;
        });
    }

    unmarkBoardCell(boardCell) {
        this.playingBoard.map(item => {
            if (item.cellId === boardCell.cellId) {
                // Apply visual indicators on the board
                let cellDivElement = document.querySelector(CELL + item.cellId);
                if (cellDivElement.classList.contains(boardCell.class)) {
                    cellDivElement.classList.remove(boardCell.class);
                }
                if (cellDivElement.classList.contains('clicked')) {
                    cellDivElement.classList.remove('clicked');
                }

                item.player = '';
                item.class = '';
                this.moveHistory = this.moveHistory.filter(action => action !== boardCell);
            }
            return item;
        });
    }

    highlightWinBoardCells(combination = []) {
        this.playingBoard.forEach((cell) => {
            let highlightClass = this.players.currentPlayer.class + '--' + (combination.includes(cell.cellId) ? 'win' : 'lose');
            document.querySelector(CELL+cell.cellId).classList.add(highlightClass);
        });    
    }
}