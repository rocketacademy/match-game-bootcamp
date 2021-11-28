// Global variables
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let matchedPair = 0;
let milliseconds = 180000;
let userName = '';

// create a div element to display a message
const messageDiv = document.createElement('div');
messageDiv.classList.add('outputBox');
document.body.appendChild(messageDiv);
// helper function to display message
const output = (message) => {
  messageDiv.innerText = message;
};
// create a div to display the time left
const timeDiv = document.createElement('div');
timeDiv.classList.add('timeBox');

// create a input and submit button
const userDiv = document.createElement('div');
const userInput = document.createElement('input');
const submitBtn = document.createElement('button');
submitBtn.innerText = 'Submit';

// helper function to convert mill to mins and sec
function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Gameplay logic
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
  if (firstCard === null) {
    console.log('first turn');
    // assign the clicked card to firstcard
    firstCard = clickedCard;
    // turn this card over
    cardElement.classList.add('cardStyle');

    if (clickedCard.color === 'red') {
      cardElement.classList.add('red');
    }

    cardElement.innerText = `${firstCard.name}\n${firstCard.symbol}`;

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
      matchedPair += 1;
      // turn this card over
      cardElement.classList.add('cardStyle');

      if (clickedCard.color === 'red') {
        cardElement.classList.add('red');
      }

      cardElement.innerText = `${clickedCard.name}\n${clickedCard.symbol}`;
      // add in the match message
      output('MATCH!');

      // add setTimeOut to empty the div after 3 secs
      setTimeout(() => {
        messageDiv.innerText = '';
      }, 3000);
    } else {
      console.log('NOT a match');
      // turn card over
      cardElement.classList.add('cardStyle');

      if (clickedCard.color === 'red') {
        cardElement.classList.add('red');
      }
      cardElement.innerText = `${clickedCard.name}\n${clickedCard.symbol}`;
      // after 3 sec, turn the card over
      setTimeout(() => {
        // turn this card back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
      }, 1000);
    }
    // reset the first card back to null
    firstCard = null;
  }
  if (matchedPair >= ((boardSize * boardSize) / 2)) {
    output('Congrats, You matched everything! Hurray!');
    // add setTimeOut to wipe out this  message after 5 secs
    setTimeout(() => {
      messageDiv.innerText = '';
    }, 5000);
  }
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

// function to get userName
const getUserName = () => {
  userName = userInput.value;

  if (userInput === '') {
    output('Please enter a name');
  } else userDiv.remove();
  output(`Hi ${userName}, match all the cards within 3 mins to win the game!`);
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
  // timer to run when button is clicked
  const ref = setInterval(() => {
    const convertTime = millisToMinutesAndSeconds(milliseconds);
    timeDiv.innerText = `Time Left: ${convertTime}`;

    if (milliseconds <= 0) {
      clearInterval(ref);
    }

    milliseconds -= 1000;
  }, 1000);
  document.body.appendChild(timeDiv);
};
// add event listener to get the submit btn to work
submitBtn.addEventListener('click', getUserName);

// function to make the deck
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  let symbol;
  let cardColor = '';

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
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }

      if (currentSuit === 'diamonds') {
        symbol = '♦';
        cardColor = 'red';
      } else if (currentSuit === 'clubs') {
        symbol = '♣';
        cardColor = 'black';
      } else if (currentSuit === 'hearts') {
        symbol = '♥';
        cardColor = 'red';
      } else if (currentSuit === 'spades') {
        symbol = '♠';
        cardColor = 'black';
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        color: cardColor,
        symbol,
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
// function to shuffle the cards in the made deck
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
  document.body.appendChild(userDiv);
  userDiv.appendChild(userInput);
  userDiv.appendChild(submitBtn);

  output('Hi player! Please key in a username!');
};
initGame();
