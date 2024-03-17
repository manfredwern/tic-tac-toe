import './style.css'
import Game from './app/game.js'

const GAME_TITLE = 'Tic-Tac-Toe';
const NEW_GAME_BTN = 'button#new-game';

document.querySelector('#app').innerHTML = `
<h1 class="game-title">${GAME_TITLE}</h1>

<div class="active-player"></div>

<div id="board-container"><div id="board"></div></div>

<div id="game-control">
  <button id="undo" type="button">Undo</button>
  <button id="new-game" type="button">New Game</button>
</div>

<pre id="move-logs"></pre>
`;

function addClickEventToNewGameBtn() {
  const newGameBtn = document.querySelector(NEW_GAME_BTN);
  newGameBtn.addEventListener('click', startNewGame);
}

function startNewGame() {
  const newGame = new Game();
  newGame.setupGame();
  newGame.startGame();
}

window.onload = () => {
  startNewGame();
  addClickEventToNewGameBtn();
}