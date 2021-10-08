// Global variables
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let shuffledDeck;
let secondCardElement;
let userName = '';
let seconds = 0;

// Gameplay Logic
const squareClick = (cardElement, row, column) => {
  const clickedCard = board[row][column];
  // the user already clicked on this square
  if (cardElement.innerHTML !== '') {
    // Inform player to select a diff card
    output(`<name> ${userName}! </name><br> You have already selected this card. <br> Please select another one!`);
    return;
  }
  // first turn
  if (firstCard === null) {
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${firstCard.displayName}  ${firstCard.suitSymbol} `;
    // Inform player of selected card
    output(`<name> ${userName}! </name><br> You selected a ${firstCard.name} of ${firstCard.suitSymbol} <br> Try to find the same number!`);
    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // second turn
  } else {
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      // turn this card over
      cardElement.innerHTML = `${clickedCard.displayName} ${clickedCard.suitSymbol} `;
      output(`<name> ${userName}! </name><br> WOOOOO! <br> You found a match!`);
      // Show match message for 3 sec
      matchInfo.innerHTML = 'MATCH!!!!!!!!!';
      document.body.appendChild(matchInfo);
      // Timeout to empty out element content
      setTimeout(() => {
        matchInfo.innerHTML = '';
      }, 3000);
    } else {
      // turn this card back over
      firstCardElement.innerHTML = '';
      output(`<name> ${userName}! </name><br> Darn! It wasn\'t a match... <br> Try again!`);
      // Show wrong card for 3 sec
      secondCardElement = cardElement;
      secondCardElement.innerHTML = `${clickedCard.displayName} ${clickedCard.suitSymbol} `;
      setTimeout(() => {
        secondCardElement.innerHTML = '';
      }, 1000);
    }

    // reset the first card
    firstCard = null;
  }
};

// Create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');
  // give it a class for CSS purposes
  boardElement.classList.add('board');
  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];
    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');
      // set a class for CSS purposes
      square.classList.add('square');
      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });
      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// Create double decks
const makeDeck = () => {
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitEmoji = ['❤️', '♦️', '♣️', '♠️'];
  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit & suit emoji in a variable
    const currentSuit = suits[suitIndex];
    const currentEmoji = suitEmoji[suitIndex];
    // Loop from 1 to 13 to create all cards for a given suit
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      let shortName = `${rankCounter}`;

      if (shortName === '1') {
        shortName = 'A';
      } else if (shortName === '11') {
        shortName = 'J';
      } else if (shortName === '12') {
        shortName = 'Q';
      } else if (shortName === '13') {
        shortName = 'K';
      }

      let cardName = `${rankCounter}`;
      if (cardName === '1') {
        cardName = 'ace';
      } else if (cardName === '11') {
        cardName = 'jack';
      } else if (cardName === '12') {
        cardName = 'queen';
      } else if (cardName === '13') {
        cardName = 'king';
      }
      let emojiColour = '';

      if (currentSuit === 'hearts') {
        emojiColour = 'red';
      } else if (currentSuit === 'diamonds') {
        emojiColour = 'red';
      } else if (currentSuit === 'spades') {
        emojiColour = 'black';
      } else if (currentSuit === 'clubs') {
        emojiColour = 'black';
      }
      // Create a new card with the current name, suit, and rank, colour, displayName and emoji
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol: currentEmoji,
        displayName: shortName,
        colour: emojiColour,
      };
      // add double the cards to the deck
      newDeck.push(card);
      newDeck.push(card);
    }
  }
  return newDeck;
};

const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleCards = (deckSubset) => {
  for (let currentIndex = 0; currentIndex < deckSubset.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(deckSubset.length);
    const randomCard = deckSubset[randomIndex];
    const currentCard = deckSubset[currentIndex];
    deckSubset[currentIndex] = randomCard;
    deckSubset[randomIndex] = currentCard;
  }
  return deckSubset;
};

// Create line break between game board and game info
const brk = document.createElement('br');

// Create element for game info
const gameInfo = document.createElement('div');
// Add class to make visual changes in CSS
gameInfo.classList.add('gameInfo');

// Create element for 'MATCH!' pop up message
const matchInfo = document.createElement('div');
// Add class to make visual changes in CSS
matchInfo.classList.add('matchInfo');

// Create function to help change output message
const output = (message) => {
  gameInfo.innerHTML = message;
};

// Create element for game timer
const gameTimer = document.createElement('div');
// Add class to make visual changes in CSS
gameTimer.classList.add('gameTimer');
seconds = 180;
// setInterval to stop timer after 180 secs
const countdown = setInterval(() => {
  gameTimer.innerHTML = `Try to complete the board in 3 min!: <timer> ${seconds} </timer>`;

  if (seconds === 0) {
    clearInterval(countdown);
  }
  seconds -= 1;
}, 1000);

// Create input button to take user's name
const playerName = document.createElement('input');
playerName.placeholder = 'Please enter your name';
// Create submit button
const submit = document.createElement('button');
submit.innerHTML = 'Submit';

// Create reset button
const reset = document.createElement('button');
reset.innerText = 'Reset';

// Start timer and game after name is input
const startGame = () => {
  userName = playerName.value;
  playerName.value = '';
  playerName.placeholder = 'Enjoy the game!';
  gameInfo.innerHTML = `<name> Hello ${userName}! 😊</name><br> Try to pick two of the same cards in a row. <br> Pick all the cards correctly to win!`;
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  shuffledDeck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(shuffledDeck.pop());
    }
  }
  // Append all elements to body
  const boardEl = buildBoardElements(board);
  document.body.appendChild(playerName);
  document.body.appendChild(submit);
  document.body.appendChild(reset);
  document.body.appendChild(boardEl);
  document.body.appendChild(gameTimer);
  document.body.appendChild(brk);
  document.body.appendChild(gameInfo);

  // // Callback function to reset game
  const resetGame = () => {
    // Clear out array with cards
    board.length = 0;
    // Clear out shuffled deck
    shuffledDeck.length = 0;
    // Create new shuffled deck
    const doubleDeck = makeDeck();
    const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
    shuffledDeck = shuffleCards(deckSubset);

    // Deal cards to array again
    for (let i = 0; i < boardSize; i += 1) {
      board.push([]);
      for (let j = 0; j < boardSize; j += 1) {
        board[i].push(shuffledDeck.pop());
      }
    }
    // Create element ?array which selects all squares
    const allSquares = document.querySelectorAll('.square');
    // Clear out all square elements so that board appears empty
    for (let k = 0; k < allSquares.length; k += 1) {
      allSquares[k].innerHTML = '';
    }

    gameInfo.innerHTML = `<name> ${userName}! 😊</name><br> The game has been reset! <br> Enjoy the next round!`;
    seconds = 180;
  };
  submit.addEventListener('click', () => startGame());
  reset.addEventListener('click', () => resetGame());
};

initGame();
