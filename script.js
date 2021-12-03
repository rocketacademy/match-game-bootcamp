// Please implement exercise logic here
// Global variables
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let boardElement;
let playerName;
let deck;
let newGame = true;
// Keep track of scores
let currentScore = 0;
const maxScore = ((boardSize * boardSize) / 2);

// DOM for input, nameDiv and submit button
const input = document.createElement('input');
const nameDiv = document.createElement('div');
const submitButton = document.createElement('button');
const instructions = document.createElement('div');
submitButton.setAttribute('id', 'submit-button');
// input.setAttribute('id', 'input-field');
submitButton.innerText = 'Submit';
instructions.innerHTML = 'Please input name to play:';

// DOM for reset button
// const resetButton = document.createElement('button');
// resetButton.innerHTML = 'Reset Game';

// Append onto nameDiv
nameDiv.appendChild(instructions);
nameDiv.appendChild(input);
nameDiv.appendChild(submitButton);

// Create nameDiv div to display message
const message = document.createElement('div');
document.body.appendChild(message);
// Helper function to display message
const updateOutput = (output) => {
  message.innerText = output;
};

// Create gameResults div to display match/non-match message
const gameResult = document.createElement('div');
// Helper function to display win/lose message
const updateResult = (gameOutput) => {
  gameResult.innerText = gameOutput;
};

// Div to show timer
const timer = document.createElement('div');

// Function to show timer in minutes and seconds
const convertMinutesAndSeconds = (value) => {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let minutes = Math.floor(sec / 60); // get minutes
  let seconds = sec - (minutes * 60); //  get seconds
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${minutes}:${seconds}`; // Return is HH : MM : SS
};

// Make card deck
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

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);
// Shuffle an array of cards
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

// Gameplay logic
const squareClick = (cardElement, column, row) => {
  // Set a timer during first click
  if (newGame === true) {
    newGame = false;
    let seconds = 2;
    // Append timer
    document.body.appendChild(timer);
    // Count down from 3 minutes
    const ref = setInterval(() => {
      timer.innerText = convertMinutesAndSeconds(seconds);
      if (seconds <= 0) {
        updateResult('Times up!');
        clearInterval(ref);
        if (currentScore < maxScore) {
          setTimeout(() => {
            updateResult('You lose!');
          }, 1000);
        }
      }
      seconds -= 1;
    }, 1000);
  }
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
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
      // Update current score
      currentScore += 1;
      // turn this card over
      cardElement.innerText = clickedCard.name;
      updateResult('Its a match!');
      if (currentScore == maxScore) {
        updateResult('You won the game!');
      }
    } else {
      console.log('NOT a match');
      // Turn card over
      cardElement.innerText = clickedCard.name;
      setTimeout(() => { cardElement.innerText = ''; }, 1000);
      // turn this card back over
      firstCardElement.innerText = '';
      updateResult('Its not a match :(');
    }
    // reset the first card
    firstCard = null;
  }
};

// Game initialisation logic
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  boardElement = document.createElement('div');

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
  updateOutput(`Hello ${playerName}, welcome to match game!`);
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
};

// const resetGame = (ref) => {
//   newGame = true;
//   // Clear timer
//   currentScore = 0;
//   board = [];
//   boardElement.remove();
//   // init game again
//   initGame();
// };

// Function to ask for playerName
const getName = () => {
  playerName = input.value;
  if (playerName === '') {
    updateOutput('You did not input a name');
  }
  else {
    message.innerText = '';
    playerName = input.value;
    startGame();
  }
  document.body.appendChild(gameResult);
  // document.body.appendChild(resetButton);
  // resetButton.addEventListener('click', resetGame);
};

// Function to display nameDiv div
const startGame = () => {
  if (playerName == null) { document.body.appendChild(nameDiv); }
  else {
    nameDiv.remove();
    initGame();
  }
};

// When submit button clicked, change input field value to playerName;
submitButton.addEventListener('click', getName);
startGame();
