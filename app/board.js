import { BOARD_CELLS } from "../constants/playingBoard";

export default class Board {

    constructor() {
        this.playingBoard = [...BOARD_CELLS];
        this.boardCellsHTML = '';
    }

    createBoard() {
        for (const boardCell of BOARD_CELLS) {
            let div = document.createElement('div');
            div.setAttribute('id', 'cell' + boardCell.cellId);
            div.setAttribute('class', 'cell');

            let span = document.createElement('span');
            span.innerHTML = boardCell.cellId;

            div.appendChild(span);
            this.boardCellsHTML += div.outerHTML;
        }

        document.querySelector('#board').innerHTML = this.boardCellsHTML;
    }

    markBoardCell(boardCell, activeCell) {
        // Apply visual indicators on the board
        activeCell.classList.add('clicked');
        activeCell.classList.add(this.players.currentPlayer.class);

        // Update Board status
        this.playingBoard.map(item => {
            if (item.cellId === boardCell.cellId) {
                item.player = this.players.currentPlayer.alias;
                item.class = this.players.currentPlayer.class;
                this.lastAction = item;
                this.playersAction.push(this.lastAction);
            }
            return item;
        });
    }

    unmarkBoardCell(boardCell) {
        this.playingBoard.map(item => {
            if (item.cellId === boardCell.cellId) {
                // Apply visual indicators on the board
                let activeCell = document.querySelector('#cell' + item.cellId);
                if (activeCell.classList.contains(boardCell.class)) {
                    activeCell.classList.remove(boardCell.class);
                }
                if (activeCell.classList.contains('clicked')) {
                    activeCell.classList.remove('clicked');
                }

                item.player = '';
                item.class = '';
                this.playersAction = this.playersAction.filter(action => action !== boardCell);
            }
            return item;
        });
    }
}