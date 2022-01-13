const boardSize = 4;
const board = [];
const totalBoardArea = boardSize * boardSize;
let firstCard = null;
let firstCardElement;
let deck;
let paused = false;
let gameOver = false;
const timeGiven = 180000;
let cardsGuessed = 0;
let clear;

const outputBox = document.createElement('div');
const output = (message) => {
  outputBox.innerText = message;
};

const clearOutput = () => {
  outputBox.innerText = '';
};

const clearFunction = () => {
  clear = setTimeout(clearOutput, 3000);
};

const winBox = document.createElement('div');

const timesUp = () => {
  if (gameOver === false) {
    console.log('game over!');
    output('Your time is up! (3 minute game time)');
    gameOver = true;
  }
};

setTimeout(timesUp, timeGiven);

const squareClick = (cardElement, column, row) => {
  if (paused === false && gameOver === false) {
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
          gameOver = true;
          winBox.innerText = 'Congratulations! You won!';
        }
      // turn this card over
      // cardElement.innerText = clickedCard.name;
      } else {
        console.log('NOT a match');
        paused = true;
        // turn this card back over
        setTimeout(() => { firstCardElement.innerText = '';
          cardElement.innerText = ''; paused = false; }, 3000);
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

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
  document.body.appendChild(outputBox);
  document.body.appendChild(winBox);
};

initGame();
