// Please implement exercise logic here
/* ####################
## HELPER FUNCTIONS ##
#################### */
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // initialise variable suitSymbol
    let currentSymbol;

    // set suit symbol to match current suit
    if (currentSuit === 'hearts') {
      currentSymbol = '♥️';
    } else if (currentSuit === 'spades') {
      currentSymbol = '♠️';
    } else if (currentSuit === 'clubs') {
      currentSymbol = '♣️';
    } else {
      currentSymbol = '♦️';
    }

    // set the color of the card (used later to determine the css class which in turn determines the color)
    // does not directly set the color of the card
    let cardColor;
    if (currentSymbol === '♥️' || currentSymbol === '♦️') {
      cardColor = 'red';
    } else {
      cardColor = 'black';
    }

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

      // make a single card object variable
      const cardInfo = {
        suitSymbol: currentSymbol,
        suit: currentSuit,
        name: cardName,
        color: cardColor,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(cardInfo); // add double the cardInfos to the deck
      // newDeck.push(cardInfo);
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

/* #######################
## GLOBAL VARIABLES #####
####################### */
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

/* ###########################
## PLAYER ACTION CALLBACKS ##
########################### */
const squareClick = (messageBoard, cardElement, column, row) => {
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
    cardElement.classList.add('card');
    cardElement.innerHTML = `${firstCard.name}<br>${firstCard.suitSymbol}`;
    messageBoard.innerText = 'Click on Another Card';
    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    // condition is met, first card matches second card
    if (
      clickedCard.name === firstCard.name
    // && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      // display match message
      // messageBoard.innerText = 'it\'s a match!';
      messageBoard.innerHTML = '<img src="/Users/grahamlim/Documents/bootcamp/week-02/day-003/pre-class/match-game-bootcamp/doge_card.gif" />';
      // apply css class and card's name and suit to cardElement so that it looks like the card has been turned over
      cardElement.classList.add('card');
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suitSymbol}`;
      card;
    } else {
      console.log('NOT a match');
      messageBoard.innerText = 'no match, try again';
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suitSymbol}`;
      cardElement.classList.add('card');

      // turn both cards back over after 3 seconds
      // removing innerText and changing the css class back to square, returns it to it's original state
      setTimeout(() => {
        firstCardElement.innerText = '';
        firstCardElement.className = 'square';
        cardElement.innerText = '';
        cardElement.className = 'square';
      }, 3000);
    }

    // reset the first card
    firstCard = null;
  }
};

/* ########################
## GAME INITIALISATION ###
######################## */
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');
  boardElement.setAttribute('id', 'gamespace');
  // create the div where messages will be shown to the user
  const messageBoard = document.createElement('div');
  messageBoard.classList.add('messages');
  messageBoard.innerText = `${timeoutDuration} Milliseconds to Play! Click on a Card`;
  boardElement.appendChild(messageBoard);

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.setAttribute('id', 'gamerow');
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
        squareClick(messageBoard, event.currentTarget, i, j);
        // event.currentTarget will log
        // the current part of what you're clicking.
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
  let initialDeck = makeDeck();
  initialDeck = shuffleCards(initialDeck);
  // const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = initialDeck.slice(0, (boardSize * boardSize));

  // deck = shuffleCards(deckSubset);

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

const removeElements = (elms) => elms.forEach((el) => el.remove());

// Use like:
// removeElements(document.querySelectorAll('.remove'));

function boardCleaner() {
  removeElements(document.querySelectorAll('.board'));
  removeElements(document.querySelectorAll('.row'));
}

const timeoutDuration = 60000; // in milliseconds

function playerStart() {
// #########################################
// initialise game by calling initGame function
  initGame();

  const startButton = document.querySelector('button');
  startButton.parentElement.removeChild(startButton);

  // const messageSearch = document.querySelector('messages');
  // messageSearch.innerText = '10 Seconds to Play!';

  setTimeout(boardCleaner,
    timeoutDuration);// actual 3 minute delay to wipe everything out

  setTimeout(buttonSpawner,
    timeoutDuration);// actual 3 minute delay to wipe everything out
}

function buttonSpawner() {
  const startButton = document.createElement('button');
  startButton.innerHTML = `Start Game! Ends ${timeoutDuration} Milliseconds After You Click`;
  startButton.setAttribute('class', 'button');
  document.body.appendChild(startButton);
  startButton.addEventListener('click', playerStart);
}

buttonSpawner();
