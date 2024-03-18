export const WIN_COMBINATIONS = [
    // Horizontal wins
    [1, 2, 3], // Top row
    [4, 5, 6], // Middle row
    [7, 8, 9], // Bottom row

    // Vertical wins
    [1, 4, 7], // Left column
    [2, 5, 8], // Middle column
    [3, 6, 9], // Right column

    // Diagonal wins
    [1, 5, 9], // Top-left to bottom-right diagonal
    [3, 5, 7]  // Top-right to bottom-left diagonal
];