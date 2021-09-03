// ###### set global variables ######
// #################################

const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let userName;
let score = 0;
let numberOfMatches = 0;
let gameTime = 180;
const minutes = Number(Math.floor(gameTime / 60));
const seconds = (Number(gameTime % 60));

// define DOM elements with ID
const gameInfo = document.createElement('div');
gameInfo.setAttribute('id', 'gameInfo');

const gameInfo2 = document.createElement('div');
gameInfo2.setAttribute('id', 'gameInfo2');

const field = document.createElement('input');
field.setAttribute('id', 'userInput');

const submitButton = document.createElement('button');
submitButton.setAttribute('id', 'submit');

const resetButton = document.createElement('button');
resetButton.setAttribute('id', 'reset');

const timer = document.createElement('div');
timer.setAttribute('id', 'timer');

// ##############################
// ####### Helper Functions #####
// ##############################

// standard make deck
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['diamonds', 'hearts', 'clubs', 'spades'];

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
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }

      let icon = suitIndex;
      if (suitIndex === 0) {
        icon = '♦️';
      } else if (suitIndex === 1) {
        icon = '♥️';
      } else if (suitIndex === 2) {
        icon = '♣️';
      } else if (suitIndex === 3) {
        icon = '♠️';
      }

      let cardColor = suitIndex;
      if (suitIndex === 0 || suitIndex === 1) {
        cardColor = 'red';
      } else {
        cardColor = 'black';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        suitSymbol: icon,
        rank: rankCounter,
        colour: cardColor,
      };
      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }
  return newDeck;
};

// standard shuffle cards
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

const getRandomIndex = (max) => Math.floor(Math.random() * max);

// functions to help display messages
const output = (message) => {
  gameInfo.innerHTML = message;
};
const output2 = (message) => {
  gameInfo2.innerHTML = message;
};

// function to get DOM element by ID
const getElement = (a) => document.getElementById(`${a}`);

// function to grab input and assign to UserName
const capture = () => {
  // query select the id for input field
  const input = document.querySelector('#userInput');
  // assign value to userName
  userName = input.value;
  initGame();
};

// function to reset the game
const resetGame = () => {
  deck = [];
  board = [];
  gameTime = 0;
  // remove DOM elements to prevent multiple elements in HTML
  getElement('boardEl').remove();
  getElement('gameInfo').remove();
  getElement('gameInfo2').remove();
  getElement('timer').remove();
  document.body.appendChild(field);
  document.body.appendChild(submitButton);
  initGame();
  numberOfMatches = 0;
};

// function for interaction when squars are clicked
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  console.log('FIRST CARD DOM ELEMENT', firstCard);
  console.log('BOARD CLICKED CARD', board[column][row]);
  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerHTML !== '') {
    output('Please select your second square');
    return;
  }
  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = cardDisplay(clickedCard);

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // message to guide user
    output('Select your second card');

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      // turn this card over
      cardElement.innerHTML = cardDisplay(clickedCard);
      // message to guide user
      output('Great! Lets go again!');
      output2('YOU HAVE A MATCH!🥳');
      setTimeout(() => {
        output2('');
      }, 1000);
      // counter to know when all matches have been made
      numberOfMatches += 1;
    } else {
      console.log('NOT a match');
      cardElement.innerHTML = cardDisplay(clickedCard);
      setTimeout(() => {
        cardElement.innerHTML = '';
      }, 1000);
      // turn this card back over
      firstCardElement.innerHTML = '';
      output('Sorry not a match. Lets try again!');
    }

    // when all matches are made, display message and score
    if (numberOfMatches === ((boardSize * boardSize) / 2)) {
      score += 1;
      output(`🍾🎉 YOU WON 🍾🎉 <br><br> Your current score is ${score}`);
      output2('');
      console.log('score', score);
      setTimeout(() => {
        output('');
      }, 5000);
    }
    // reset first card
    firstCard = null;
  }
};

// function to display card with suit
const cardDisplay = (card) => {
  const output = `${card.name}${card.suitSymbol}`;
  return output;
};

// create all the board elements that will go on the screen
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

// username funtion, for user to input their username
const userNameGame = () => {
  // generate reset button
  resetButton.innerHTML = 'Reset';
  document.body.appendChild(resetButton);
  resetButton.addEventListener('click', resetGame);

  gameInfo.innerHTML = 'Let us know your name.';
  document.body.appendChild(gameInfo);

  // input field to put name
  document.body.appendChild(field);

  submitButton.innerHTML = 'Submit';
  document.body.appendChild(submitButton);
  submitButton.addEventListener('click', capture);
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
  // remove the field and submit buttons
  getElement('userInput').remove();
  getElement('submit').remove();

  // set game time
  gameTime = 180;

  // call timeout function
  timeOut();

  // generate timer message that counts down
  timer.innerHTML = `⏱ You have ${minutes} mins ${seconds} secs to complete this game ⏱`;
  document.body.appendChild(timer);

  const boardEl = buildBoardElements(board);
  boardEl.setAttribute('id', 'boardEl');
  document.body.appendChild(boardEl);

  gameInfo.innerHTML = `Hello 👋🏻 ${userName}. Click on a square to begin!`;
  document.body.appendChild(gameInfo);

  gameInfo2.innerHTML = '';
  document.body.appendChild(gameInfo2);
};

userNameGame();

// function to set the Timer
const timeOut = () => {
  const ref = setInterval(() => {
    const minutes = Number(Math.floor(gameTime / 60));
    const seconds = Number(gameTime % 60);
    timer.innerHTML = `⏱ You have ${minutes} mins ${seconds} secs to complete this game ⏱`;
    if (gameTime <= 0) {
      clearInterval(ref);
      resetGame();
      output('⏰ TIME HAS RUN OUT! Please try again!');
    }
    gameTime -= 1;
  }, 1000);
};
