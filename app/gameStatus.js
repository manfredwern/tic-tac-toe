export default class GameSession {
    constructor()  {}
    
    updatePlayerInfo(player) {
        document.querySelector('.active-game').innerHTML = player
    }
}

