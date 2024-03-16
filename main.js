import './style.css'
import Game from './app/game.js'

document.querySelector('#app').innerHTML = `
<div class="undo-btn">
  <button type="button">Undo</button>
</div>

<div class="active-game"></div>

<div id="board-container"><div id="board"></div></div>`;

// Initialize Board Game
const newGame = new Game();
newGame.setupGame();
newGame.startGame();
