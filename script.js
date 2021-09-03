/* eslint-disable no-unused-vars */
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
let currentGameTime = 180000;
let username = '';
let inputName;
let boardElement;
let boardEl;
let matchCounter = 0;
let winCounter = 0;

const grid = [
  ['A', 'B'],
  ['Y', 'Z'],
];

const upperLeftPosition = grid[0][0]; // 'A'
const upperRightPosition = grid[0][1]; // 'B'
const lowerLeftPosition = grid[1][0]; // 'Y'
const lowerRightPosition = grid[1][1]; // 'Z'

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

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null && canClick === true) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (canClick === true) {
      if (
        clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
        canClick = false;
        // turn this card over
        cardElement.innerText = clickedCard.name;
        matchCounter += 2;
        if (matchCounter < 16) {
          const winRoundMessage = document.createElement('h1');
          winRoundMessage.innerText = "It's a match!";
          document.body.appendChild(winRoundMessage);
          setTimeout(() => { document.body.removeChild(winRoundMessage);
            canClick = true; }, 3000);
        }
        // user wins if 16 cards are matched
        else if (matchCounter === 16) {
          document.body.innerHTML = '';
          winCounter += 1;
          const winGameMessage = document.createElement('h1');
          winGameMessage.innerText = 'You have won the game!';
          document.body.appendChild(winGameMessage);
          setTimeout(() => { document.body.removeChild(winGameMessage);
            board.length = 0;
            canClick = true;
            matchCounter = 0;
            initGame(); }, 5000);
        }
      } else {
        canClick = false;
        cardElement.innerText = clickedCard.name;
        setTimeout(() => { console.log('NOT a match');
        // turn this card back over
          firstCardElement.innerText = '';
          cardElement.innerText = '';
          canClick = true;
        }, 3000);
      }

      // reset the first card
      firstCard = null;
    }
  }
};

// create all the board elements that will go on the screen
// return the built board
// eslint-disable-next-line no-shadow
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];
    console.log(i);
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
  currentGameTime = 180000;
  // capture the value of the text box before emptying the HTML to display the boardgame
  username = inputName.value;
  document.body.innerHTML = '';
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
  // Show the board
  boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
  const output = document.createElement('div');
  output.innerText = currentGameTime;
  document.body.appendChild(output);
  // Run the setInterval as a time limit
  const gameTimer = setInterval(() => {
    output.innerText = currentGameTime;
    if (currentGameTime <= 0) {
      document.body.innerHTML = '';
      const loseMessage = document.createElement('h1');
      loseMessage.innerText = 'Time has run out, you lost!';
      document.body.appendChild(loseMessage);
      clearInterval(gameTimer);
    }
    currentGameTime -= 1;
  }, 1);
  // Reset Button
  const resetButton = document.createElement('button');
  resetButton.innerText = 'Reset';
  resetButton.addEventListener('click', (() => {
    board.length = 0;
    initGame(); }));
  document.body.appendChild(resetButton);
  const winCounterOutput = document.createElement('h2');
  winCounterOutput.innerText = 'Your current wins:';
  const winCounterText = document.createElement('p');
  winCounterText.innerText = winCounter;
  winCounterOutput.appendChild(winCounterText);
  document.body.appendChild(winCounterOutput);
};

const gameSetUp = () => {
  // Input for name
  inputName = document.createElement('input');
  inputName.type = 'text';
  document.body.appendChild(inputName);
  // Submit name button to start game
  const submitName = document.createElement('button');
  submitName.innerText = 'Submit Name';
  document.body.appendChild(submitName);
  submitName.addEventListener('click', initGame);
};
gameSetUp();
