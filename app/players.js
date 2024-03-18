export default class Players {

    constructor() {
        this._players = [];
        this._currentPlayer = {};
    }

    get currentPlayer() {
        return this._currentPlayer;
    }

    set currentPlayer(player) {
        this._currentPlayer = player;
    }

    addPlayer(playerName) {
        const playerNumber = this._players.length + 1;
        this._players.push({
            name: playerName,
            className: 'player' + playerNumber
        })
    }

    allPlayers() {
        return this._players;
    }
    
}