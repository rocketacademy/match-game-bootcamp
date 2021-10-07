let boardSize;
let board = [];
let firstCard = null;
let firstCardElement = null;
let deck = [];
let canClick = true;

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const symbols = ['♥', '♦', '♣', '♠'];

const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset');
const boardSizeInput = document.querySelectorAll('input[name="board-size"]');
const timeInput = document.querySelectorAll('input[name="time"]');
const boardElement = document.createElement('div');

const createCardUI = (card, cardElement) => {
  const suit = document.createElement('div');
  suit.classList.add('suit', card.colour);
  suit.innerText = card.suitSymbol;

  const name = document.createElement('div');
  name.classList.add('name', card.colour);
  name.innerText = card.displayName;

  cardElement.appendChild(name);
  cardElement.appendChild(suit);
};

const squareClick = (cardElement, column, row) => {
  if (canClick) {
    const clickedCard = board[column][row];

    // the user already clicked on this square
    if (cardElement.innerHTML !== '') {
      return;
    }

    // first turn
    if (firstCard === null) {
      firstCard = clickedCard;
      // turn this card over
      createCardUI(firstCard, cardElement);

      // hold onto this for later when it may not match
      firstCardElement = cardElement;

      // second turn
    } else {
      canClick = false;
      createCardUI(clickedCard, cardElement);

      setTimeout(() => {
        if (clickedCard.name !== firstCard.name || clickedCard.suit !== firstCard.suit) {
          cardElement.innerHTML = '';
          firstCardElement.innerHTML = '';
        }
        // reset the first card
        firstCard = null;
        canClick = true;
      }, 1000);
    }
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = () => {
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
      square.classList.add('card');

      // set the click event
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
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

const generateCard = (cardRank, suit) => {
  let cardName = '';
  let cardDisplay = '';
  switch (cardRank) {
    case 1:
      cardName = 'Ace';
      cardDisplay = 'A';
      break;
    case 11:
      cardName = 'Jack';
      cardDisplay = 'J';
      break;
    case 12:
      cardName = 'Queen';
      cardDisplay = 'Q';
      break;
    case 13:
      cardName = 'King';
      cardDisplay = 'K';
      break;
    default:
      cardName = cardRank;
      cardDisplay = cardRank;
  }

  const cardColor = suit < 2 ? 'red' : 'black';

  const card = {
    suitSymbol: symbols[suit],
    suit: suits[suit],
    name: cardName,
    displayName: cardDisplay,
    colour: cardColor,
    rank: cardRank,
  };
  return card;
};

// generate a shuffled standard deck of cards
function makeDeck() {
  const tempDeck = [];
  for (let i = 1; i <= 13; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      // generates cards and inserts randomly into deck
      tempDeck.splice(getRandomIndex(tempDeck.length + 1), 0, generateCard(i, j));
    }
  }

  const numUniqueCards = (boardSize * boardSize) / 2;
  for (let k = 0; k < numUniqueCards; k += 1) {
    const randCard = tempDeck.pop();
    deck.splice(getRandomIndex(deck.length + 1), 0, randCard);
    deck.splice(getRandomIndex(deck.length + 1), 0, randCard);
  }
}

const resetGame = () => {
  board = [];
  firstCard = null;
  firstCardElement = null;
  deck = [];
  canClick = true;

  boardSizeInput.forEach((radio) => { radio.disabled = false; });
  timeInput.forEach((radio) => { radio.disabled = false; });
  startButton.disabled = false;
  resetButton.disabled = true;
  boardElement.innerHTML = '';
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards

  startButton.addEventListener('click', () => {
    boardSize = Number(document.querySelector('input[name="board-size"]:checked').value);
    makeDeck();
    // deal the cards out to the board data structure
    for (let i = 0; i < boardSize; i += 1) {
      board.push([]);
      for (let j = 0; j < boardSize; j += 1) {
        board[i].push(deck.pop());
      }
    }
    boardElement.classList.add('board');
    document.body.appendChild(boardElement);
    buildBoardElements(board);

    boardSizeInput.forEach((radio) => { radio.disabled = true; });
    timeInput.forEach((radio) => { radio.disabled = true; });
    startButton.disabled = true;
    resetButton.disabled = false;
  });

  resetButton.addEventListener('click', resetGame);
};

initGame();
