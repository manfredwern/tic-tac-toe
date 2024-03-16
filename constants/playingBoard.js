const MAX_CELL_COUNT = 9;

function generatePlayingField() {
    let cells = [];
    for (let index = 1; index <= MAX_CELL_COUNT; index++) {
        cells.push({
            cellId: index,
            player: "",
            class: ""
        });
    }
    return cells;
}

export const BOARD_CELLS = generatePlayingField();
