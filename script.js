// boardSize has to be an even number
const boardSize = 4;
const board = [];
let gameMode = 'start';
let firstCard = null;
let firstCardElement;
let deck;
let canClick = false;
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

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
const getRandomIndex = (max) => Math.floor(Math.random() * max);
const shuffleCards = (cardDeck) => {
  // Loop over the card deck array once
  let currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex += 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

const output = document.createElement('div');
output.classList.add('output');
document.body.appendChild(output);

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  output.innerText = 'Click Start to begin';
  // eslint-disable-next-line no-use-before-define
  timerField.innerHTML = `${minutes} min ${seconds} s`;
};

// BUILD TIMER ELEMENTS
const timerContainer = document.createElement('div');
timerContainer.classList.add('timer-container');
document.body.appendChild(timerContainer);

const timerTop = document.createElement('div');
timerContainer.appendChild(timerTop);
const timerField = document.createElement('div');
timerField.classList.add('timerField');

let seconds = 0;
let minutes = 3;
let timer;
let canStart = true;
const delayInSeconds = 1000;

const startTimer = () => {
  if (canStart === false) {
    return;
  }
  output.innerText = 'Click on a square.';
  canClick = true;

  timer = setInterval(() => {
    timerField.innerText = `${minutes} min ${seconds} s`;
    if (seconds === 0) {
      minutes -= 1;
      seconds = 60;
    }
    if (minutes < 0) {
      clearInterval(timer);
      canClick = false;
      canStart = false;
      output.innerText = 'Out of time!';
    }
    seconds -= 1;
  }, delayInSeconds);
  canStart = false;
};

const stopTimer = () => {
  clearInterval(timer);
  canClick = false;
  canStart = true;
  output.innerHTML = 'Click Start to resume game';
};

const resetTimer = () => {
  minutes = 3;
  seconds = 0;
  canClick = false;
  canStart = true;
  timerField.innerHTML = `${minutes} min ${seconds} s`;
  output.innerHTML = 'Click Start to begin';
};

const resetGame = document.createElement('button');
resetGame.classList.add('button');
document.body.appendChild(resetGame);
resetGame.innerText = 'Reset Game';
resetGame.addEventListener('click', () => {
  minutes = 3;
  seconds = 0;
  output.innerText = '';
  board.splice(0, board.length);
  firstCard = null;
  initGame();
  /* const timer2 = setInterval(() => {
    timerField.innerText = `${minutes} min ${seconds} s`;
    if (seconds === 0) {
      minutes -= 1;
      seconds = 60;
    }
    if (minutes === 0) {
      clearInterval(timer2);
      output.innerText = 'Out of time!';
    }
    seconds -= 1;
  }, delayInSeconds); */
});

timerContainer.appendChild(timerField);

const timerBottom = document.createElement('div');
timerContainer.appendChild(timerBottom);

const startButton = document.createElement('button');
startButton.classList.add('button');
startButton.innerHTML = 'START';
startButton.addEventListener('click', startTimer);
timerBottom.appendChild(startButton);

const stopButton = document.createElement('button');
stopButton.classList.add('button');
stopButton.innerHTML = 'STOP';
stopButton.addEventListener('click', stopTimer);
timerBottom.appendChild(stopButton);

const resetButton = document.createElement('button');
resetButton.classList.add('button');
resetButton.innerHTML = 'RESET';
resetButton.addEventListener('click', resetTimer);
timerBottom.appendChild(resetButton);

// Gameplay Logic
const squareClick = (cardElement, column, row) => {
  console.log('BOARD CLICKED CARD', board[column][row]);
  console.log(gameMode);
  const clickedCard = board[column][row];
  if (canClick === false) {
    return;
  }
  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    if (gameMode === 'null') {
      firstCardElement.innerText = '';
    }
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name;

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
      output.innerHTML = "It's a match!";
      setTimeout(() => {
        output.innerHTML = '';
      }, 1000);
      gameMode = 'match';

      // turn this card over
      cardElement.innerText = clickedCard.name;
    } else {
      console.log('NOT a match');
      cardElement.innerText = clickedCard.name;
      // turn this card back over
      setTimeout(() => {
        firstCardElement.innerText = '';
        cardElement.innerText = '';
      }, 1000);
      gameMode = 'null';
    }

    // reset the first card
    firstCard = null;
  }
};

// Game Initialization

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (boardInput) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < boardInput.length; i += 1) {
    // make a var for just this row of cards
    const row = boardInput[i];

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

// Gameplay
initGame();
const boardEl = buildBoardElements(board);
document.body.appendChild(boardEl);
