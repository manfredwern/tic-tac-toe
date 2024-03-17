import './style.css'
import Game from './app/game.js'

document.querySelector('#app').innerHTML = `
<div class="undo-btn">
  <button id="undo" type="button">Undo</button>
  <button id="new-game" type="button">New Game</button>
</div>

<div class="active-game"></div>

<div id="board-container"><div id="board"></div></div>

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