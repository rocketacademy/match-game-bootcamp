// Please implement exercise logic here

/** *****************
 * GLOBAL VARIABLES *
 ****************** */

// boardSize has to be an even number and not more than 10x10 due to size limitation
const boardSize = 4;
const board = [];
let gameInfo;
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;

/** *****************
 *  DECK CREATION   *
 ****************** */
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['♥️', '♦️', '♣️', '♠️'];

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

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// function to generate random number to shuffle card
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// function to shuffle cards (linked to getRandomIndex)
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

/** *****************
 * GAMEPLAY LOGIC *
 ****************** */
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
    canClick = false;
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${firstCard.name}<br>${firstCard.suit}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // Print game state to select 2nd card
    gameInfo.innerText = 'Please click on a 2nd card. Click to begin!';
    // second turn

    const delayClick = () => {
      canClick = true;
    };
    setTimeout(delayClick, 3500);
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');

      // turn this card over
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;

      // Print game state that it matches
      gameInfo.innerText = "It's a match! Please select a new card";

      // Set delay to make message dissapear
      const dissapearMessage = () => {
        gameInfo.innerText = '';
      };

      setTimeout(dissapearMessage, 3000);
    } else {
      console.log('NOT a match');
      // Print game state that it matches
      gameInfo.innerText = "It's not a match. Please select a new card.";
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;

      // Delay card flip for 3 seconds before hiding it
      const delayCardTurn = () => {
        firstCardElement.innerHTML = '';
        cardElement.innerHTML = '';
      };

      setTimeout(delayCardTurn, 3000);
    }

    // reset the first card
    firstCard = null;
  }
};

/** *****************
 * GAME INIT LOGIC *
 ****************** */

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
      square.addEventListener("click", (event) => {
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
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize); // slice function ([start index], [end index])
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

  gameInfo = document.createElement('div');
  gameInfo.classList.add('textContainer');
  gameInfo.innerText = 'Its player 1 turn. Click to begin!';
  document.body.appendChild(gameInfo);
};

// Initialize Game Function to run
initGame();
