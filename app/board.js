import { BOARD_CELLS } from "../constants/playingField";

export default class Board {

    boardCellsHTML

    constructor() {
        this.boardCellsHTML = '';
    }

    createBoard() {
        for (const boardCell of BOARD_CELLS) {
            let div = document.createElement('div');
            div.setAttribute('id', 'cell' + boardCell.cell);
            div.setAttribute('class', 'cell');

            let span = document.createElement('span');
            span.innerHTML = boardCell.cell;

            div.appendChild(span);
            this.boardCellsHTML += div.outerHTML;
        }

        document.querySelector('#board').innerHTML = this.boardCellsHTML;
    }
}