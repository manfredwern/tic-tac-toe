const MAX_CELL_COUNT = 9;

export function generateBoardCellsData() {
    return Array.from({ length: MAX_CELL_COUNT }, (_, index) => ({
        cellId: index + 1,
        player: "",
        className: ""
    }));
}
