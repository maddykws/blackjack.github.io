
var deck = new Array();

function init_deck() {
	let numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10","J", "Q", "K"];
	let symbols = ["spades", "diamonds", "clubs", "hearts"];

	deck = new Array();
	let num_decks = players.length / 6;
	for (let k = 0; k <= num_decks; k++) {
		for (let i = 0; i < symbols.length; i++) {
			let suit = symbols[i];
			for(let j=0; j< numbers.length;j++){
				let name = numbers[j];
				let value = 0;
				if(numbers[j] === 'A') {
					value = 11;
				}
				else { 
					if(numbers[j] === 'K' 
						|| numbers[j] === 'Q'
						|| numbers[j] === 'J') {
						value = 10;
				}
				else {
					value = parseInt(numbers[j]);}
				}

				deck.push({
					name: name,
					value: value,
					suit: suit
				});

			}
		}
	}

	
}

//simple shuffle
function shuffle_deck() {

	let n = deck.length-1;

	while( n >= 0) {
		let ind = Math.floor(Math.random() * n);
		let temp = deck[ind];
		deck[ind] = deck[n];
		deck[n] = temp;
		n--;
	}
}

function getCard() {
	let card = deck.pop();
	return card;
}