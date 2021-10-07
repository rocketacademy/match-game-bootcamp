// Global variables
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let shuffledDeck;
let secondCard;
let secondCardElement;

// Gameplay Logic
const squareClick = (cardElement, row, column) => {
  const clickedCard = board[row][column];
  // the user already clicked on this square
  if (cardElement.innerHTML !== '') {
    // Inform player to select a diff card
    output('You have already selected this card. <br> Please select another one!');
    return;
  }
  // first turn
  if (firstCard === null) {
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${firstCard.displayName}  ${firstCard.suitSymbol} `;
    // Inform player of selected card
    output(`You selected a ${firstCard.name} of ${firstCard.suitSymbol} <br> Try to find the same number!`);
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
      output('WOOOOO! <br> You found a match!');
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
      output('Darn! It wasn\'t a match... <br> Try again!');
      // Show wrong card for 3 sec
      secondCard = clickedCard;
      secondCardElement = cardElement;
      secondCardElement.innerHTML = `${clickedCard.displayName} ${clickedCard.suitSymbol} `;
      setTimeout(() => {
        secondCardElement.innerHTML = '';
      }, 3000);
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
gameInfo.classList.add('gameInfo');

gameInfo.innerHTML = 'Player! <br> Try to pick two of the same card in a row. <br> Pick all the cards correctly to win!';

// Create element for 'MATCH!' pop up message
const matchInfo = document.createElement('div');
matchInfo.classList.add('matchInfo');

// Create function to help change output message
const output = (message) => {
  gameInfo.innerHTML = message;
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

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
  document.body.appendChild(brk);
  document.body.appendChild(gameInfo);
};

initGame();
