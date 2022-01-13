// ----- GLOBAL VARIABLES -----------------------
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
let timerStarted = false;

// 1 min = 60 000 ms
// 3 mins = 180 000ms
let milliseconds = 180000; // 3 minutes
const delayInMilliseconds = 100; // 0.1 second

// For game information
const gameInfoContainer = document.createElement('div');
const gameInfo = document.createElement('div');
const timerContainer = document.createElement('div');
const timer = document.createElement('div');

// ----- HELPER FUNCTIONS -----------------------
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Create deck
const makeDeck = () => {
	const newDeck = [];
	const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
	const suitSymbols = ['♥️', '♦️', '♣️', '♠️'];
	const cardName = [
		'A',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'J',
		'Q',
		'K',
	];
	const cardRank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

	// Loop over the suits array
	for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
		// Store the current suit in a variable
		const currentSuit = suits[suitIndex];

		for (let i = 0; i < 13; i += 1) {
			// Set suit color
			let suitColor = 'black';
			if (currentSuit === 'hearts' || currentSuit === 'diamonds') {
				suitColor = 'red';
			}

			// Create a new card with the current name, suit, and rank
			const card = {
				name: cardName[i],
				suit: currentSuit,
				symbol: suitSymbols[suitIndex],
				color: suitColor,
				rank: cardRank[i],
			};

			// Add the new card to the deck
			newDeck.push(card);
			newDeck.push(card);
		}
	}

	// Return the completed card deck
	return newDeck;
};

// Shuffle cards
const shuffleCards = (cards) => {
	// Loop over the card deck array once
	for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
		// Select a random index in the deck
		const randomIndex = getRandomIndex(cards.length);
		// Select the card that corresponds to randomIndex
		const randomCard = cards[randomIndex];
		// Select the card that corresponds to currentIndex
		const currentCard = cards[currentIndex];
		// Swap positions of randomCard and currentCard in the deck
		cards[currentIndex] = randomCard;
		cards[randomIndex] = currentCard;
	}
	// Return the shuffled deck
	return cards;
};

// Format timer
const formatTimer = (ms) => {
	// Show min:sec
	// calculate minutes
	let min = Math.floor((ms / 1000 / 60) % 60);
	// calculate seconds
	let sec = Math.floor((ms / 1000) % 60);

	// add leading 0
	if (min < 10) {
		min = '0' + min;
	}
	if (sec < 10) {
		sec = '0' + sec;
	}
	return `${min}:${sec}`;
};

// ----- GAMEPLAY LOGIC -------------------------

// What happens when user clicks on a square
const openCard = (cardElement, row, column) => {
	// Start timer on first ever card clicked
	if (timerStarted === false) {
		startTimer();
		timerStarted = true;
	}

	// Store the clicked card
	const clickedCard = board[row][column];

	// If this card is already open (user has already clicked this square)
	if (cardElement.innerText !== '') {
		return;
	}

	if (canClick === true) {
		// First turn
		if (firstCard === null) {
			console.log('First card picked');
			// Set the firstCard to the card that was clicked
			firstCard = clickedCard;
			console.log(firstCard);

			// "Turn the card over" by showing the card name in the square
			cardElement.innerText = `${clickedCard.name}${clickedCard.symbol}`;
			cardElement.classList.add('open-card');

			// Hold on to this first in case second card doesn't match
			firstCardElement = cardElement;

			// Update game info
			updateGameInfo(`Great, click another card to match`);
		}

		// Second turn
		else {
			console.log('Second card picked...');
			canClick = false;

			// If it's a match
			if (
				clickedCard.name === firstCard.name &&
				clickedCard.suit === firstCard.suit
			) {
				console.log(clickedCard);

				// "Turn the card over" by showing the card name in the square
				cardElement.innerText = `${clickedCard.name}${clickedCard.symbol}`;
				cardElement.classList.add('open-card');

				updateGameInfo(`Noice, it's a match!`);

				// Update game info
				setTimeout(() => {
					updateGameInfo(
						`Click a card to continue, or refresh the page to restart`
					);
				}, 2000);

				canClick = true;
			}

			// If it's not a match
			else {
				console.log(clickedCard);

				// "Turn the card over" by showing the card name in the square
				cardElement.innerText = `${clickedCard.name}${clickedCard.symbol}`;
				cardElement.classList.add('open-card');

				setTimeout(() => {
					// "Turn cards over" by removing card name in square
					cardElement.innerText = ``;
					firstCardElement.innerText = ``;

					cardElement.classList.remove('open-card');
					firstCardElement.classList.remove('open-card');

					updateGameInfo(`Click a card`);
					canClick = true;
				}, 2000);

				// Update game info
				updateGameInfo(`Sorry, try again`);
			}

			// Reset the cards
			firstCard = null;
			console.log(firstCard);
		}
	}
};

const startTimer = () => {
	const ref = setInterval(() => {
		if (milliseconds <= 0) {
			clearInterval(ref);
			updateGameInfo(`Time's up!`);
			canClick = false;
		}

		timer.innerHTML = formatTimer(milliseconds);
		milliseconds -= delayInMilliseconds;
	}, delayInMilliseconds);
};

// ----- GAME INITIALISATION --------------------

// Create container for timer
const createTimerContainer = () => {
	timerContainer.classList.add('timer-container');
	timerContainer.innerHTML = `<p>You have 3 minutes to match all card pairs, starting from when you open your first card.</p>`;
	document.body.appendChild(timerContainer);

	timer.classList.add('timer');
	timer.innerHTML = formatTimer(milliseconds);
	timerContainer.appendChild(timer);
};

// Create container for game info
const createGameInfoContainer = () => {
	gameInfoContainer.classList.add('game-info-container');
	gameInfo.classList.add('game-info');

	gameInfo.innerHTML = `Click on the squares to match cards.`;

	gameInfoContainer.appendChild(gameInfo);
	document.body.appendChild(gameInfoContainer);
};

const updateGameInfo = (msgText) => {
	gameInfo.innerHTML = msgText;
	gameInfoContainer.appendChild(gameInfo);
};

// Create container for board elements
const createBoardContainer = (board) => {
	// Create main container
	const boardContainer = document.createElement('div');
	boardContainer.classList.add('board-container');

	// Create the board grid with 2 loops ------
	// First for row and second for column
	for (let i = 0; i < board.length; i += 1) {
		// Create variable to hold cards in this row
		const row = board[i];

		// Create div for the row
		const rowDiv = document.createElement('div');
		rowDiv.classList.add('row');

		// Start second loop --------
		// to create the columns (cards / squares) in the row
		for (let j = 0; j < row.length; j += 1) {
			// Create the square (card)
			const square = document.createElement('div');
			square.classList.add('square');

			// Add event listener to the square
			square.addEventListener('click', (e) => {
				openCard(e.currentTarget, i, j);
			});

			// Append the square to the row
			rowDiv.appendChild(square);
		}

		// Append row to the board
		boardContainer.appendChild(rowDiv);
	}
	document.body.appendChild(boardContainer);
};

// Game initialisation
const initGame = () => {
	// Prepare the deck ----------
	// Create a deck with twice the number of cards
	let doubleDeck = makeDeck();

	// Select enough to make a smaller deck
	let deckSubset = doubleDeck.slice(0, boardSize * boardSize);

	// Shuffle the cards
	deck = shuffleCards(deckSubset);

	// Deal cards to the board data structure (nested array) -----
	for (let i = 0; i < boardSize; i += 1) {
		// Create the array for each row
		board.push([]);

		// Deal the cards per row
		for (let j = 0; j < boardSize; j += 1) {
			board[i].push(deck.pop());
		}
	}

	createTimerContainer();
	createGameInfoContainer();
	createBoardContainer(board);
};

initGame();
