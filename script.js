// Please implement exercise logic here
// <--------- GLOBAL VARIABLES --------->
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
// eslint-disable-next-line prefer-const
let playerName;
let input;
let numPairs = 0;

const gameInfo = document.createElement('div');
gameInfo.classList.add('messages');

const boardElement = document.createElement('div');

const inputContainer = document.createElement('div');

const inputField = document.createElement('input');
input = inputField.innerText;

const submitButton = document.createElement('button');
submitButton.innerText = 'Submit';
submitButton.classList.add('button');

// const timerContainer = document.createElement('div');

// const timer = document.createElement('div');

// <--------- HELPER FUNCTIONS --------->
// Function for output to abstract complexity of DOM manipulation away from game logic
const output = (message) => {
  gameInfo.innerText = message;
};

// Function to create deck
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    let currentSymbol;
    let currentColor = 'red';

    if (currentSuit === 'hearts') {
      currentSymbol = '\u2665';
    } else if (currentSuit === 'diamonds') {
      currentSymbol = '\u2666';
    } else if (currentSuit === 'clubs') {
      currentSymbol = '\u2663';
      currentColor = 'black';
    } else if (currentSuit === 'spades') {
      currentSymbol = '\u2660';
      currentColor = 'black';
    }

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let cardDisplay = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        cardDisplay = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplay = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplay = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplay = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol: currentSymbol,
        displayName: cardDisplay,
        color: currentColor,
      };

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// Function to get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Function to shuffle cards
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

// Function for flipping and matching cards at click
const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerHTML !== '') {
    return;
  }

  if (canClick === true) {
  // first turn
    if (firstCard === null) {
      console.log('first turn');
      output('Click on another card to find its match!');
      firstCard = clickedCard;
      // turn this card over
      cardElement.classList.add('cardfront', firstCard.color);
      cardElement.innerHTML = `${firstCard.displayName}<br>${firstCard.suitSymbol}`;
      // hold onto this for later when it may not match
      firstCardElement = cardElement;

    // second turn
    } else {
      console.log('second turn');
      cardElement.classList.add('cardfront', clickedCard.color);
      cardElement.innerHTML = `${clickedCard.displayName}<br>${clickedCard.suitSymbol}`;
      if (
        clickedCard.displayName === firstCard.displayName
        && clickedCard.suit === firstCard.suit
      ) {
        numPairs += 1;
        console.log('match');
        output('You got a match! The cards will disappear in 3 seconds.');
        canClick = false;
        setTimeout(() => {
          // make card "disappear"
          firstCardElement.innerHTML = '';
          cardElement.innerHTML = '';
          firstCardElement.className = 'cardmatched';
          cardElement.className = 'cardmatched';
          // output respective message
          if (numPairs === 8) {
            output('Congratulations! You win!');
          } else {
            output('Now click another card!');
            canClick = true;
          }
        }, 3000);
      } else {
        output('That\'s not a match! You got 3 seconds to remember the cards!');
        console.log('NOT a match');
        canClick = false;
        setTimeout(() => {
        // turn this card back over
          firstCardElement.innerHTML = '';
          cardElement.innerHTML = '';
          firstCardElement.className = 'cardback';
          cardElement.className = 'cardback';
          canClick = true;
        }, 3000);
      }
      // reset the first card
      firstCard = null;
    }
  }
};

// Function to create all the board elements that will go on the screen and return the built board
const buildBoardElements = () => {
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
      square.classList.add('cardback');

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

// Function to get player name
const getPlayerName = () => {
  input = inputField.value;
  playerName = input;

  if (input === '') {
    output('You gotta type in a name!');
  } else if (input !== '') {
    inputContainer.remove();
    output(`Hi ${playerName}! Click a card and find its matching pair!`);
    const boardEl = buildBoardElements(board);
    document.body.appendChild(boardEl);
  }
};

// GAME INITIALISATION

const initGame = () => {
  output('Welcome! Let\'s get your name before we begin :)');
  document.body.appendChild(gameInfo);
  inputContainer.appendChild(inputField);
  inputContainer.appendChild(submitButton);
  document.body.appendChild(inputContainer);
  submitButton.addEventListener('click', getPlayerName);
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
};

initGame();

// const grid = [
//   ['A', 'B'],
//   ['Y', 'Z'],
// ];

// const upperLeftPosition = grid[0][0]; // 'A'
// const upperRightPosition = grid[0][1]; // 'B'
// const lowerLeftPosition = grid[1][0]; // 'Y'
// const lowerRightPosition = grid[1][1]; // 'Z'
