import { generateBoardCellsData } from "../constants/playingBoard";

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
        document.querySelector('#board').innerHTML = this.boardCellsHTML;
    }

    markBoardCell(boardCell, targetBoardCell) {
        // Apply visual indicators on the board‚
        targetBoardCell.classList.add('clicked');
        targetBoardCell.classList.add(this.players.currentPlayer.class);

        // Update Board status
        this.playingBoard.map(item => {
            if (item.cellId === boardCell.cellId) {
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
                let targetBoardCell = document.querySelector('#cell' + item.cellId);
                if (targetBoardCell.classList.contains(boardCell.class)) {
                    targetBoardCell.classList.remove(boardCell.class);
                }
                if (targetBoardCell.classList.contains('clicked')) {
                    targetBoardCell.classList.remove('clicked');
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
            let highlightClass = combination.includes(cell.cellId) ? 'win' : 'lose';
            document.getElementById('cell'+cell.cellId).classList.add(highlightClass);
        });    
    }
}