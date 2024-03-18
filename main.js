import './style.css';
import Game from './app/game.js';

const GAME_TITLE = 'Tic-Tac-Toe';
const UNDO_STR = 'Undo';
const NEW_GAME_STR = 'New Game';
const NEW_GAME_SELECTOR = 'button#new-game';

document.querySelector('#app').innerHTML = `
<h1 class="game-title">${GAME_TITLE}</h1>

<div class="game-status"></div>

<div id="board-container">
  <div id="board"></div>
</div>

<div id="game-control">
  <button id="undo" type="button">${UNDO_STR}</button>
  <button id="new-game" type="button">${NEW_GAME_STR}</button>
</div>

<pre id="move-logs"></pre>
`;

function playTitTacToe() {
  const boadGame = new Game();
  boadGame.initializeBoard();
  boadGame.startGame();
}

window.onload = () => {
  playTitTacToe();
  const newGameBtn = document.querySelector(NEW_GAME_SELECTOR);
  newGameBtn.addEventListener('click', playTitTacToe);
}