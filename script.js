// ================================================================================================
// ================================================================================================
// ================================================================================================
//           ========================== HELPER FUNCTIONS ============================
// ================================================================================================
// ================================================================================================
// ================================================================================================
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
// ================================================================================================
// ================================================================================================
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

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
      } else if (cardName === '11') {
        cardName = 'jack';
      } else if (cardName === '12') {
        cardName = 'queen';
      } else if (cardName === '13') {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

const gameInfo = document.createElement('div');
gameInfo.classList.add('styling');
const output = (message) => {
  gameInfo.innerText = message;
};

// ================================================================================================
// ================================================================================================
// ================================================================================================
//           ========================== GLOBAL VARIABLES ============================
// ================================================================================================
// ================================================================================================
// ================================================================================================
// boardSize has to be an even number. this is the one that controls the array size!!
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

// ================================================================================================
// ================================================================================================
// ================================================================================================
//           ========================== GAMEPLAY LOGIC ============================
// ================================================================================================
// ================================================================================================
// ================================================================================================
const squareClick = (cardElement, row, column) => {
  // how come i need not declare variable cardElement for it to be active? ie: 'let cardElement'
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  const clickedCard = board[row][column];

  console.log('BOARD CLICKED CARD', board[row][column]);

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${firstCard.name} <br> ${firstCard.name}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      output('MATCHHHHHHHHH!');

      // turn this second card over
      cardElement.innerText = clickedCard.name;
    } else {
      console.log('NOT a match');
      output("It's not a match. Try again!");
      firstCardElement.innerText = '';
    }

    // reset the first card
    firstCard = null;
  }
};

// setTimeout = if the second card != first card, show it to the user for 3s then turn it back over

// ================================================================================================
// ================================================================================================
// ================================================================================================
//           ========================== GAME INITIALISATION ============================
// ================================================================================================
// ================================================================================================
// ================================================================================================
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (theBoard) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < theBoard.length; i += 1) {
    // make a var for just this row of cards
    const row = theBoard[i];

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

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  // holy sheet this console.table is damn cool???
  console.table(deck);
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
  // fill game info div with starting instructions
  gameInfo.innerHTML = 'Match Game - How to play? <br><br> 1. Click on the squares to reveal a number <br> 2. Click on another square to see if it matches with the first card!';
  document.body.appendChild(gameInfo);
};

initGame();
