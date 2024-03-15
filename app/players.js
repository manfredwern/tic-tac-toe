export default class Players {

    players;

    constructor() {
        this.players = [];
    }

    setPlayer(alias, type = 'ai') {
        const playerNumber = this.players.length + 1;
        this.players.push({
            alias,
            class: 'player' + playerNumber,
            type
        })
    }

    allPlayers() {
        return this.players;
    }

}