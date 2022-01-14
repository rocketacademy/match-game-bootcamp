const boardSize = 4; // dictates the number of rows & columns to the grid
let board = []; // an array of all cards used in the game
const totalBoardArea = boardSize * boardSize; // total number of cards in the game
let firstCard = null; // set to null to indicate that no first card has been picked yet
let firstCardElement; // variable to hold the first card while user picks second card
let deck; // hold all 52 cards for "popping" into the board array
let paused = false; // pause while setTimeout runs so function variables do not get overwritten
let gameOver = false; // to indicate when game is over (i.e. times up or won)
const timeGiven = 180000; // time given for game 3minutes (3mins x 60seconds x 1000milliseconds)
let cardsGuessed = 0; // variable to hold number of cards correctly matched
let clear; // global variable to hold setTimeout function for access across functions
let gameOverFunction; // global variable to hold setTimeout function for access across functions
let boardEl; // global variable to hold card elements for access across functions
let playerName; // holds player name
let numOfWins = 0; // tracks number of wins

// create nameBox (will hold nameField, nameBox, numofWinsBox and resetButton)
const nameBox = document.createElement('div');
const nameField = document.createElement('input');
nameField.placeholder = 'Enter name here';
nameBox.appendChild(nameField);
const nameSubmit = document.createElement('button');
nameSubmit.innerText = 'Submit';
nameBox.appendChild(nameSubmit);
const numOfWinsBox = document.createElement('div');
numOfWinsBox.setAttribute('style', 'margin-bottom: 5px');
numOfWinsBox.innerText = 'Number of Wins: 0';
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset current game';

// create outputBox (for display of game messages)
const outputBox = document.createElement('div');

// output message function
const output = (message) => {
  outputBox.innerText = message;
};

// clearing of temporary game messages function
const clearOutput = () => {
  outputBox.innerText = '';
  resetButton.disabled = false;
};

// setTimeout function for clearing of outputBox
const clearFunction = () => {
  clear = setTimeout(clearOutput, 3000);
};

// create winning message box
const winBox = document.createElement('div');

// setting 3 minutes game
const timesUp = () => {
  if (gameOver === false) {
    output('Your time is up! (3 minute game time)');
    gameOver = true;
    resetButton.disabled = false;
  }
};

// name submit button function to trigger start of game and appending of game elements
const captureName = () => {
  playerName = nameField.value;
  nameField.remove();
  nameSubmit.remove();
  nameBox.className = 'name';
  nameBox.innerHTML = `Welcome to Match Game, ${playerName}!</br></br>`;
  nameBox.appendChild(numOfWinsBox);
  nameBox.appendChild(resetButton);
  document.body.appendChild(boardEl);
  document.body.appendChild(outputBox);
  document.body.appendChild(winBox);
  gameOverFunction = setTimeout(timesUp, timeGiven);
};
nameSubmit.addEventListener('click', captureName);

// square click function
const squareClick = (cardElement, column, row) => {
  if (paused === false && gameOver === false) {
    resetButton.disabled = true;
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
      cardElement.innerText = clickedCard.name;
      // matched
      if (
        clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
        if (outputBox.innerText === '') {
          output("It's a match!");
          clearFunction();
        } else {
          clearTimeout(clear);
          clearFunction();
        }
        cardsGuessed += 2;
        if (cardsGuessed === totalBoardArea) {
          numOfWins += 1;
          gameOver = true;
          winBox.innerText = 'Congratulations! You won!';
          setTimeout(() => { winBox.innerText = ''; }, 5000);
          numOfWinsBox.innerText = `Number of Wins: ${numOfWins}`;
          clearTimeout(gameOverFunction);
        }
      }
      // did not match
      else {
        console.log('NOT a match');
        paused = true;
        // turn this card back over
        setTimeout(() => { firstCardElement.innerText = '';
          cardElement.innerText = ''; paused = false; resetButton.disabled = false; }, 3000);
      }

      // reset the first card
      firstCard = null;
    }
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (brd) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < brd.length; i += 1) {
    // make a var for just this row of cards
    const row = brd[i];

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

const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleCards = (cardDeck) => {
  let currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    const randomIndex = getRandomIndex(cardDeck.length);
    const randomCard = cardDeck[randomIndex];
    const currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex += 1;
  }
  return cardDeck;
};

// initialise function
const initGame = () => {
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  boardEl = buildBoardElements(board);

  document.body.appendChild(nameBox);
};

// reset function
const reset = () => {
  outputBox.innerText = ''; // clear outputBox
  clearTimeout(gameOverFunction); // clear 3-minute timer
  gameOverFunction = setTimeout(timesUp, timeGiven); // reset 3-minute timer
  firstCard = null; // reset firstCard to null
  winBox.innerText = ''; // clear winBox
  gameOver = false; // switch gameOver from true to false
  board = []; // empty out previous games' cards
  const squaresArray = document.getElementsByClassName('square'); // retrieve all squares' element addresses
  for (let i = 0; i < squaresArray.length; i += 1) { // clear all squares' innerText
    squaresArray[i].innerText = '';
  }

  // generate a new set of board elements
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  boardEl = buildBoardElements(board);
};
resetButton.addEventListener('click', reset);

initGame();
