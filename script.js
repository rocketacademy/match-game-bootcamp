// Notes:
// !!! reference from peers'code
// ### to indicate for Comfortable exercise
// ##### to indicate for Comfortable exercise

// create a card-matching game
// the user turns cards over one at a time to find the matching pair of cards

// ===================================================
//  Global Variables
// ===================================================

// boardSize has to be an even number
const boardSize = 4;
const board = [];
// let messageBoard;
let firstCard = null;
let firstCardElement;
let deck;
let secondCard;
let secondCardElement;
let canClick = true;
let boardElement;
// const userName = '';
// const boardElement = document.createElement('div');

// declared timer globally
let timer;

// declare frontImage globally
let backImage;

// ADDED-v1: add a gameStart to change the t/f mode of game
let gameStart = false;

// ===================================================
//  DOM elements creation
// ===================================================

// CHANGED-v2: shifted DOM elements creation to the global scope
// ##### create a 3 minutes timer element
let seconds = 180;
const delayInMilliseconds = 1000;
const timerDiv = document.createElement('div');
timerDiv.setAttribute('class', 'timer');
timerDiv.innerText = '00:00';
document.body.appendChild(timerDiv);

// create an overall game-div
const gameDiv = document.createElement('div');
// set an id to the game-div
gameDiv.id = 'game';

// create a div to store the buttons
const btnDiv = document.createElement('div');
btnDiv.classList.add('btn-div');
gameDiv.appendChild(btnDiv);

// create a stop button to stop the timer
const startBtn = document.createElement('button');
startBtn.innerHTML = 'Start';
startBtn.classList.add('button');
startBtn.setAttribute('id', 'start-btn');
// startBtn.src = './images/others/start-button.png';
btnDiv.appendChild(startBtn);
startBtn.addEventListener('click', () => {
  timer = setInterval(() => {
    startBtn.disabled = true;
    gameStart = true;
    timerDiv.innerText = `Time left: ${seconds}s remaining`;
    console.log('start timer');

    if (seconds === 0) {
    // gameMode = false;
    // remove all the boxes when time is up
      boardElement.innerText = '';
      // do not allow user to continue when time is up
      clearInterval(timer);
      // if (gameMode === false) {
      //   console.log('game over');
      //   output.innerText = 'Time is Up!';
      //   boardElement.innerText = '';
      // }
      timerDiv.innerText = 'Time is Up!';
      // ADDED-v2: enable the startBtn again
      startBtn.disabled = false;
    }
    seconds -= 1;
  }, delayInMilliseconds);
});

// create a start button to start the timer
const stopBtn = document.createElement('button');
stopBtn.innerHTML = 'Stop';
stopBtn.setAttribute('id', 'stop-btn');
stopBtn.classList.add('button');
btnDiv.appendChild(stopBtn);
stopBtn.addEventListener('click', () => clearInterval(timer));

// create a reset button to reset the game
const resetBtn = document.createElement('button');
resetBtn.setAttribute('id', 'reset-btn');
resetBtn.classList.add('button');
resetBtn.innerHTML = 'reset game';
resetBtn.addEventListener('click', () => resetGame());
btnDiv.appendChild(resetBtn);

document.body.appendChild(gameDiv);

// ===================================================
//  Gameplay Logic
// ===================================================

const squareClick = (messageBoard, cardElement, column, row) => {
  // console.log(cardElement);
  // console.log('FIRST CARD DOM ELEMENT', firstCard);
  // console.log('BOARD CLICKED CARD', board[column][row]);

  // // console.log to show the column and row
  // console.log(column);
  // console.log(row);

  const clickedCard = board[column][row];
  // clickedCard.cardPath

  // console.log(userName);

  // the user already clicked on this square or game has not started
  // ADDED-v1: check the condition of canClick here;
  // ADDED-v1: include the gameStart here
  if (cardElement.innerText !== '' || canClick !== true || gameStart !== true) {
    return null;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    // !!! reference codes to add both suitSymbol and displayName details
    cardElement.classList.add('card');

    cardElement.innerHTML = `<img src="${clickedCard.cardPath}"/>`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // !!! display message when user open the first card
    messageBoard.innerText = `You opened ${firstCard.displayName} of ${firstCard.suitSymbol}. Click on another card and see if it matches!`;

    // second turn
  } else {
    console.log('second turn');
    if (
      // clickedCard here refers to the second card clicked
      clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      console.log(clickedCard);
      console.log(firstCard);

      // !!! reference codes to add cardDisplay details
      // cardElement.innerHTML = `${clickedCard.suitSymbol}<BR>${clickedCard.displayName}`;
      cardElement.innerHTML = `<img src="${clickedCard.cardPath}"/>`;

      // cardElement.innerHTML = `<img src="${clickedCard.cardPath}"/>`;

      // !!! display message when user open the second card
      messageBoard.innerText = `You opened ${clickedCard.displayName} of ${clickedCard.suitSymbol}. Click on another card and see if it matches!`;

      // ### display match meesage
      messageBoard.innerText = 'Congrats! Its a match!';

      // ADDED-v2: enable the startBtn again
      startBtn.disabled = false;

      // ### add setTimeout to display the match message and disappear after 3s
      setTimeout(() => {
        messageBoard.innerText = '';
      }, 3000);

      // turn this card over
      // cardElement.innerText = clickedCard.name;
    } else {
      secondCard = clickedCard;
      cardElement.innerText = secondCard.name;
      secondCardElement = cardElement;
      console.log('NOT a match');

      // !!! reference codes to add cardDisplay details
      // cardElement.innerHTML = `${clickedCard.suitSymbol}<BR>${clickedCard.displayName}`;
      cardElement.innerHTML = `<img src="${clickedCard.cardPath}"/>`;

      // ### display not-match meesage
      messageBoard.innerText = 'Sorry! Its not a match!';

      // ADDED-v1 user cannot click while waiting for card to close
      canClick = false;

      // add setTimeout function to turn both cards over when they are not a match
      setTimeout(() => {
        // both functions inside setTimeout are to turn the cards back over
        // firstCardElement.innerHTML = 'images / others / PNG - cards / back.png/>';
        firstCardElement.innerHTML = '';
        secondCardElement.innerText = '';
        backImage.classList.add('back-image');
        // ### no-match message to disappear after 3s
        messageBoard.innerText = '';
        // ADDED-v1 change the canClick state to allow user to click again
        canClick = true;
      }, 3000);
      // reset the first card
      firstCard = null;
    }
  }
};

// ===================================================
//  Helper Functions
// ===================================================

// // ADDED-v2: create helper function to display card image
const displayFrontCard = (name, suit) => `./images/cards/PNG-cards/${name}_of_${suit}.png`

;

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

// ===================================================
//  New Make Deck
// ===================================================

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitSymbols = ['♥', '♦️', '♣', '♠'];
  const suitColours = ['red', 'red', 'black', 'black'];

  // #### reverse the for loop for rankCounter and for loop for suitIndex so that both cards
  // will have different suits
  // refer to console.log in line 317

  // Loop from 1 to 13 to create all cards for a given suit
  // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
  // This is an example of a loop without an array.
  for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
    // Convert rankCounter to string
    let cardName = `${rankCounter}`;
    const displayName = `${rankCounter}`;
    // following code will keep display heart suits
    // let suitSymbol = `${currentSuitSymbol}`;

    for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
      // make a variable of the current suit
      const currentSuit = suits[suitIndex];
      console.log(`current suit: ${currentSuit}`);
      const currentSuitSymbol = suitSymbols[suitIndex];
      const currentColour = suitColours[suitIndex];

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

      // set the color of the card
      // (used later to determine the css class which in turn determines the color)
      // does not directly set the color of the card
      // let cardColor;
      // if (currentSuitSymbol === '♥️' || currentSuitSymbol === '♦️') {
      //   currentColour = 'red';
      // } else {
      //   currentColour = 'black';
      // }

      // // create a image element
      // const picOfCard = document.createElement('img');
      // picOfCard.classList.add('front-card');
      // cardElement.appendChild(picOfCard);

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        colour: currentColour,
        cardPath: displayFrontCard(cardName, currentSuit),
        displayName,
        suitSymbol: currentSuitSymbol,
        // suitSymbol: displayFrontCard(cardName, currentSuit, card),
      };

      // // create a cardFront element
      // card = document.createElement('img');
      // card.id = 'card-front';
      // card.src = `./images/cards/PNG-cards/${cardName}_of_${currentSuit}.png`;

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// ===================================================
//  callBack functions for eventListeners
// ===================================================

// create resetGame function to reset the game
const resetGame = () => {
  // timeLeftInSeconds = 180;
  // clearInterval(timeInterval);
  // board.length = 0;
  // deck.length = 0;
  // firstCard = null;
  // console.log('reset?');

  // reload the whole page
  window.location.reload();

  // initGame();
};

// ===================================================
//  Game Initialisation Logic
// ===================================================

// create all the board elements that will go on the screen
// return the built board
// ### for comfortable qns > create a messageboard element
const buildBoardElements = (board) => {
  // if (gameMode === true) {
  // create the element that everything will go inside of
  boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');
  boardElement.id = 'gameBoard';

  // ### create a messageboard element
  const messageBoard = document.createElement('div');
  messageBoard.id = 'message';
  messageBoard.classList.add('messageBoard');
  messageBoard.innerText = 'Click on the boxes to play the game. You have 3 minutes for the game!';

  // CHANGED-v1: moved the timer elements and btn elements to the global setting

  // document.body.appendChild(gameDiv);
  boardElement.appendChild(messageBoard);

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];
    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.id = 'row-div';
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      // square.classList.add('square');
      square.setAttribute('id', 'square');

      // ADDED-v2: create element for backside of Image
      backImage = document.createElement('img');
      backImage.classList.add('back-image');
      backImage.setAttribute('id', 'back-image');
      backImage.src = './images/cards/PNG-cards/back.png';
      square.appendChild(backImage);

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {

        backImage.classList.remove('back-image');
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"

        // ~~~ .currentTarget refers to the particular element
        // box at the moment out of the entire 16 element boxes
        squareClick(messageBoard, event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// ===================================================
//  Initiate the game
// ===================================================
const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  console.log(doubleDeck);

  // to get 16 cards (boardSize * boardSize) out of the deck
  const deckSubset = doubleDeck.slice(0, (boardSize * boardSize));
  deck = shuffleCards(deckSubset);
  console.log(deck);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
};

// initiate the gameplay
initGame();
