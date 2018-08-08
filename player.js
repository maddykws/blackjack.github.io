
var players = new Array();

var dealer = null;

var numOfPlayers = 0;

function init_dealer() {
	dealer = {
		name: 'Dealer',
		cards: new Array(),
		id: 'dealer',
		score: 0,
		split: false,
		stay: false,
		lost: false,
		blackjack: false
	};
}

function create_players(num) {
	init_dealer();
	players = new Array();

	for(let i = 1; i<= num; i++) {
		let cards = new Array();
		players.push(
		{
			name: 'Player '+i,
			cards: cards,
			id: i,
			amount_balance: 200,
			score: 0,
			split: false,
			stay: false,
			lost: false,
			blackjack: false,
			parent: null,
			current_bet: 0
		});

	}
}