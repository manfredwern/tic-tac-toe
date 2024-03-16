export default class Players {

    constructor() {
        this._players = [];
        this._currentPlayer = '';
    }

    get currentPlayer() {
        return this._currentPlayer;
    }

    set currentPlayer(player) {
        this._currentPlayer = player;
    }

    setPlayer(alias, type = 'ai') {
        const playerNumber = this._players.length + 1;
        this._players.push({
            alias,
            class: 'player' + playerNumber,
            type
        })
    }

    allPlayers() {
        return this._players;
    }

}