// Global variables
let board = [];
let firstCard = null;
let firstCardElement = null;
let deck = [];
let canClick = true;
let totalPairs = 0;
let matchedPairs = 0;
let time;

// UI elements
const gameContainer = document.getElementById('container');
const boardSizeInput = document.querySelectorAll('input[name="board-size"]');
const timeInput = document.querySelectorAll('input[name="time"]');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset');

const timer = document.createElement('div');
const boardElement = document.createElement('div');
const output = document.createElement('p');

timer.id = 'timer';
timer.innerText = '0:00';
gameContainer.appendChild(timer);

boardElement.classList.add('board');
gameContainer.appendChild(boardElement);

output.id = 'output';
gameContainer.appendChild(output);

// Helper function to output message
const print = (message) => {
  output.innerHTML = message;
};

// Create the appearance of a card by adding name and suit to the existing face-down cards
const createCardUI = (card, cardElement) => {
  const suit = document.createElement('div');
  suit.classList.add('suit', card.colour);
  suit.innerText = card.suit;

  const name = document.createElement('div');
  name.classList.add('name', card.colour);
  name.innerText = card.name;

  cardElement.appendChild(name);
  cardElement.appendChild(suit);
  cardElement.classList.add('face-up');
};

// Helper function to reset global variables and UI
const resetGame = () => {
  board = [];
  firstCard = null;
  firstCardElement = null;
  deck = [];
  canClick = true;
  totalPairs = 0;
  matchedPairs = 0;

  boardSizeInput.forEach((radio) => { radio.disabled = false; });
  timeInput.forEach((radio) => { radio.disabled = false; });
  startButton.disabled = false;
  resetButton.disabled = true;
  print('');
};

// Called after the user clicks on the second card
const setUIEffects = (clickedCard, cardElement) => {
  const match = clickedCard.name === firstCard.name && clickedCard.suit === firstCard.suit;
  if (match) {
    matchedPairs += 1;
    let message = 'Match!';
    cardElement.classList.add('match');
    firstCardElement.classList.add('match');
    if (matchedPairs === totalPairs) {
      // This means user won, clear timer
      message += '<br>You win!!!';
      clearInterval(time);
    }
    print(message);
  } else {
    cardElement.classList.add('no-match');
    firstCardElement.classList.add('no-match');
    print('No match!');
  }

  setTimeout(() => {
    // The effects set above last for 1 sec and will be removed here

    // Remove green / red border for matched / unmatched pairs
    cardElement.classList.remove('match');
    firstCardElement.classList.remove('match');
    cardElement.classList.remove('no-match');
    firstCardElement.classList.remove('no-match');

    if (matchedPairs === totalPairs) { resetGame(); }
    else if (!match) {
      cardElement.innerHTML = '';
      firstCardElement.innerHTML = '';
      cardElement.classList.remove('face-up');
      firstCardElement.classList.remove('face-up');
    }
    firstCard = null;
    canClick = true;
    print('');
  }, 1000);
};

// Called on each click of a card
const cardClick = (cardElement, row, column) => {
  if (canClick) {
    const clickedCard = board[row][column];

    // the user already clicked on this card
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
      // don't allow the user to click until the ui effects are done
      canClick = false;
      createCardUI(clickedCard, cardElement);
      setUIEffects(clickedCard, cardElement);
    }
  }
};

// Create all the board elements that will go on the screen
const buildBoardElements = () => {
  for (let i = 0; i < board.length; i += 1) {
    // make a container for a row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the cards for this row
    for (let j = 0; j < board[i].length; j += 1) {
      // create the card element
      const card = document.createElement('div');
      card.classList.add('card', 'face-down');

      card.addEventListener('click', (event) => {
        cardClick(event.currentTarget, i, j);
      });
      rowElement.appendChild(card);
    }
    boardElement.appendChild(rowElement);
  }
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

const generateCard = (cardRank, suit) => {
  const symbols = ['♥', '♦', '♣', '♠'];
  let cardName = '';
  switch (cardRank) {
    case 1:
      cardName = 'A';
      break;
    case 11:
      cardName = 'J';
      break;
    case 12:
      cardName = 'Q';
      break;
    case 13:
      cardName = 'K';
      break;
    default:
      cardName = cardRank;
  }

  const card = {
    suit: symbols[suit],
    name: cardName,
    colour: suit < 2 ? 'red' : 'black',
    rank: cardRank,
  };
  return card;
};

// generate the deck for gameplay
const makeDeck = () => {
  const tempDeck = [];
  for (let i = 1; i <= 13; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      // generates cards and inserts randomly to get a 52-card deck
      tempDeck.splice(getRandomIndex(tempDeck.length + 1), 0, generateCard(i, j));
    }
  }

  // get random cards from the tempdeck and insert 2 of it randomly into deck
  for (let k = 0; k < totalPairs; k += 1) {
    const randCard = tempDeck.pop();
    deck.splice(getRandomIndex(deck.length + 1), 0, randCard);
    deck.splice(getRandomIndex(deck.length + 1), 0, randCard);
  }
};

// Initialise game board
const initBoard = () => {
  boardElement.innerHTML = '';
  const boardSize = Number(document.querySelector('input[name="board-size"]:checked').value);
  totalPairs = (boardSize * boardSize) / 2;
  makeDeck();
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  buildBoardElements(board);

  boardSizeInput.forEach((radio) => { radio.disabled = true; });
};

// Initialise timer
const initTimer = () => {
  const minutes = Number(document.querySelector('input[name="time"]:checked').value);
  let seconds = minutes * 60;
  timer.innerText = `${minutes}:00`;
  time = setInterval(() => {
    seconds -= 1;
    const secondsLeft = seconds % 60;
    const minutesLeft = Math.floor(seconds / 60);

    if (secondsLeft >= 10) {
      timer.innerText = `${minutesLeft}:${secondsLeft}`;
    } else {
      timer.innerText = `${minutesLeft}:0${secondsLeft}`;
    }

    if (seconds <= 0) {
      clearInterval(time);
      canClick = false;
      print("Time's up! You lose.");
      setTimeout(resetGame, 1000);
    }
  }, 1000);

  timeInput.forEach((radio) => { radio.disabled = true; });
  startButton.disabled = true;
  resetButton.disabled = false;
};

startButton.addEventListener('click', () => {
  initBoard();
  initTimer();
});

resetButton.addEventListener('click', () => {
  clearInterval(time);
  resetGame();
  boardElement.innerHTML = '';
  timer.innerText = '0:00';
});
