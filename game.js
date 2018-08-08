
var currentPlayer;
var disabledPlayerCount = 0;

function distribute_cards() {

	for(let i = 0; i < 2; i++) {
		let dealerCard = deck.pop();
		dealer.cards.push(dealerCard);
		dealer.score += dealerCard.value;
		if(dealer.score > 21) {
			dealer.score -= 10;
		}
		for (let i = 0; i < players.length; i++) {
			let card = deck.pop();
			players[i].cards.push(card);
			players[i].score += card.value;
			// to handle two aces.
			if(players[i].score > 21) {
				players[i].score -= 10;
			}
		}
	}

}

function addCard(playerId, card) {
	let val = card.value;
	if(val == 11) val = 'A'
		let cardHtml = `
	<div class="card">
	<div class="card-logo">
	<img width="15" height="15" src="${card.suit}.svg"/>
	</div> 
	<div class="card-value">${val}</div>
	</div>
	`;

	$(`#${playerId}_cards`).append(cardHtml);

}


function render_playerUi() {
	$('#player-area').empty();
	let dealer_div = `
	<div class="col-sm-12" style="padding: 0">
	<div class="col-sm-4">
	<div class="player">
	<div class="name"><strong>${dealer.name}</strong></div>
	<div id="${dealer.id}_cards">
	</div>
	<div class="score-div">
	<div class="score" id="dealer_score_1">${dealer.score}</div>
	</div>
	<div id="dealer_stay"></div>
	</div>
	</div>
	</div>`;

	$('#player-area').append(dealer_div);
	for(let k = 0; k < dealer.cards.length; k++) {
		addCard(dealer.id, dealer.cards[k]);
	}

	for(let i = 0; i < players.length; i++){
		let eachPlayer = `
		<div class="col-sm-4">
		<div class="player">
		<div class="name"><strong>${players[i].name}</strong></div>
		<div id="${players[i].id}_cards">
		</div>
		<div class="score-div">
		<div class="score" id="${players[i].id}_score_1">
		${players[i].score}
		</div>
		</div>
		<div id="${players[i].id}_stay"></div>
		<div class="bet-div">
		<div>Current Bet: 
		<span>
		<button type="button" class="btn plus-minus-btn" onclick="decreaseBet(${players[i].id})">-</button>
		<input readonly id="${players[i].id}_currentbet" class="bet-input" value="${players[i].current_bet}"/>
		<button type="button" class="btn plus-minus-btn" onclick="increaseBet(${players[i].id})">+</button>
		</span>
		</div>
		<div>Remaining Balance: 
		<strong>
		<span id="${players[i].id}_remaining">${players[i].amount_balance}</span>
		</strong>
		</div>
		</div>
		</div>
		</div>`;

		$('#player-area').append(eachPlayer);
		for(let k = 0; k < players[i].cards.length; k++) {
			addCard(players[i].id, players[i].cards[k]);
		}
	}
	setCurrentPlayer();
}

function decreaseBet(id) {
	let ind = players.findIndex(each => each.id === id);

	if(players[ind].current_bet == 0) return;
	else {
		players[ind].current_bet -= 10;
	}
	players[ind].amount_balance += 10;
	$(`#${players[ind].id}_remaining`).html(players[ind].amount_balance);
	$(`#${players[ind].id}_currentbet`).val(players[ind].current_bet);

}

function increaseBet(id) {
	let ind = players.findIndex(each => each.id === id);

	if(players[ind].current_bet == players[ind].amount_balance) return;
	else {
		players[ind].current_bet += 10;
	}
	players[ind].amount_balance -= 10;
	$(`#${players[ind].id}_remaining`).html(players[ind].amount_balance);
	$(`#${players[ind].id}_currentbet`).val(players[ind].current_bet);
}

function checkInitialBlackJack() {
	for(let i = 0; i< players.length; i++) {
		if(players[i].score == 21) {
			players[i].blackjack = true;
			players[i].stay = true;
			$(`#${players[i].id}_stay`).html("BLACK JACK !");
			$(`#${players[i].id}_stay`).css('color', 'green');
			$(`#${players[i].id}_stay`).css('text-align', 'center');
			$(`#${players[i].id}_stay`).css('font-weight', 'bold');
		}
	}
}

function setCurrentPlayer() {
	$(`#${currentPlayer.id}_score_1`).addClass('current-turn');

	if(currentPlayer.cards.length == 2){
		if(currentPlayer.cards[0].value === currentPlayer.cards[1].value 
			&& currentPlayer.cards[0].value !== 11
			&& !currentPlayer.split){
			$("#split-btn").removeClass('disabled');
	}
}
else{
	$("#split-btn").addClass('disabled');
}
}

function split() {
	currentPlayer.split = true;
	currentPlayer.score /= 2;
	let index = players.findIndex(each => each.id == currentPlayer.id);
	let playerB = {
		name: currentPlayer.name+'A',
		cards: [currentPlayer.cards[1]],
		id: currentPlayer.id+'A',
		amount_balance: 200,
		score: currentPlayer.score,
		split: true,
		stay: false,
		lost: false,
		blackjack: false,
		parent: currentPlayer.id,
		current_bet: currentPlayer.current_bet
	};
	currentPlayer.cards = [currentPlayer.cards[0]];
	players.splice(index+1, 0, playerB);
	render_playerUi();
}

function start() {
	create_players(numOfPlayers);
	currentPlayer = players[0];
	init_deck();
	shuffle_deck();
	render_playerUi();
	init_btns();

	$("#info").html("Place initial bets");
}

function betsReceived() {
	init_game();
	$("#bets-btn").addClass('disabled');
	$(".bet-div").addClass('disabled');
	$(".plus-minus-btn").addClass('disabled');
	$("#info").html('');
}

function init_game() {
	distribute_cards();
	render_playerUi();
	checkInitialBlackJack();
}

function init_btns() {

	$("#hit-btn").off('click'); 
	$("#stay-btn").off('click');
	$("#split-btn").off('click');
	$("#reset-btn").off('click');
	$("#bets-btn").off('click');

	$("#hit-btn").on('click', hit);
	$("#stay-btn").on('click', stay);
	$("#split-btn").on('click', split);
	$("#reset-btn").on('click', reset);
	$("#bets-btn").on('click', betsReceived);

}

function reset() {
	players = null;
	deck = null;
	currentPlayer = null;
	disabledPlayerCount = 0;
	$("#player-area").empty();
	$('.mybtn').addClass('disabled');
	$('#start-btn').removeClass('disabled');
}

function nextPlayer() {
	let index = players.findIndex(each => each.id === currentPlayer.id);
	if(index === players.length-1){
		currentPlayer = dealer;
		dealerTurn();
	}
	else {
		if(currentPlayer.id === 'dealer'){
			currentPlayer = players[0];
		}
		else currentPlayer = players[index+1];
	}

	if(disabledPlayerCount === players.length+1) {
		handleGameOver();
	}

	if(currentPlayer.stay === true || currentPlayer.lost === true){
		disabledPlayerCount++;
		nextPlayer();
		return;
	}

	$('.score').removeClass('current-turn');
	setCurrentPlayer();
}

function handleDealerBusted() {
	alert("Dealer Busted");
	handleGameOver();
}

function handleGameOver() {
	$("#info").html('Game Over');

	for(let i = 0; i< players.length; i++) {
		if(dealer.blackjack){
			if(players[i].blackjack){
				players[i].amount_balance += players[i].current_bet;
				players[i].current_bet = 0;
			} 
		}
		else {
			if(dealer.lost) {
				if(!players[i].lost) {
					players[i].amount_balance += 2*players[i].current_bet;
					players[i].current_bet = 0;
				}
			}
			else {
				if(!players[i].lost) {
					if(players[i].score > dealer.score){
						players[i].amount_balance += 2*players[i].current_bet;
						players[i].current_bet = 0;
					}
					if(players[i].score == dealer.score) {
						players[i].amount_balance += players[i].current_bet;
						players[i].current_bet = 0;
					}
				}
			}
		}
	}
	render_playerUi();
}

function dealerTurn() {
	if(dealer.stay) return;
	if(dealer.score >= 17) {
		dealer.stay = true;
		handlePlayerStays(currentPlayer.id);
	}
	else {
		hit();
	}
	return;
}

function hit() {
	let card = getCard();
	currentPlayer.cards.push(card);
	currentPlayer.score += card.value;
	addCard(currentPlayer.id, card);
	$(`#${currentPlayer.id}_score_1`).html(currentPlayer.score);
	if(currentPlayer.score > 21){
		currentPlayer.lost = true;
		$(`#${currentPlayer.id}_stay`).html("LOST");
		$(`#${currentPlayer.id}_stay`).css('color', 'red');
		$(`#${currentPlayer.id}_stay`).css('text-align', 'center');
		$(`#${currentPlayer.id}_stay`).css('font-weight', 'bold');

		if(currentPlayer.id === dealer.id) {
			handleDealerBusted();
			return;
		}
	}
	if(currentPlayer.score == 21) {
		currentPlayer.stay = true;
		$(`#${currentPlayer.id}_stay`).html("WON");
		$(`#${currentPlayer.id}_stay`).css('color', 'green');
		$(`#${currentPlayer.id}_stay`).css('text-align', 'center');
		$(`#${currentPlayer.id}_stay`).css('font-weight', 'bold');
	}

	if(currentPlayer.score<21 && currentPlayer.id === dealer.id) {
		if(currentPlayer.score >= 17) {
			handlePlayerStays(currentPlayer.id);
		}

	}
	nextPlayer();
}

function stay() {
	currentPlayer.stay = true;
	handlePlayerStays(currentPlayer.id);
	nextPlayer();
}

function handlePlayerStays(id) {
	$(`#${id}_stay`).html("STAYED");
	$(`#${id}_stay`).css('color', 'red');
	$(`#${id}_stay`).css('text-align', 'center');
	$(`#${id}_stay`).css('font-weight', 'bold');
}

function setNumOfPlayers() {
	numOfPlayers = parseInt($("#numPlayers").val());
	$("#num-div").css("display", "none");
	$("#start-btn").removeClass('disabled');
}