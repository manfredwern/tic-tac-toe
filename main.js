import './style.css'
import Game from './app/game.js'


document.querySelector('#app').innerHTML = `
<h1 class="game-title">Tic-Tac-Toe</h1>

<div class="active-player"></div>

<div id="board-container"><div id="board"></div></div>

<div id="game-control">
  <button id="undo" type="button">Undo</button>
  <button id="new-game" type="button">New Game</button>
</div>

<pre id="action-list"></pre>
`;

function addClickEventToNewGameBtn() {
  const newGameBtn = document.querySelector('button#new-game');
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