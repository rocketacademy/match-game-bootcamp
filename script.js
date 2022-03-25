/* *******************
** Helper Functions **
******************** */
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

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamond', 'clubs', 'spades'];
  const suitSymbol = ['♥️', '♦️', '♣️', '♥️'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const currentSuitSymbol = suitSymbol[suitIndex];

    console.log(`current suit: ${currentSuit}`);

    let currentSuitColour = '';
    // set suit colour based on suit index
    if (suitIndex === 0 || suitIndex === 1) {
      currentSuitColour = 'red';
    } else if (suitIndex === 2 || suitIndex === 3) {
      currentSuitColour = 'black';
    }

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let currentDisplayName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        currentDisplayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        currentDisplayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        currentDisplayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        currentDisplayName = 'K';
      }

      // make a single card object variable
      const card = {
        suitSymbol: currentSuitSymbol,
        suit: currentSuit,
        name: cardName,
        displayName: currentDisplayName,
        colour: currentSuitColour,
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

// function that creates the card element
const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add('name', cardInfo.colour);
  name.innerText = cardInfo.displayName;

  const card = document.createElement('div');
  card.classList.add('card');

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

/* *******************
** Global Variables **
******************** */

const boardSize = 4;
const numPairs = (boardSize * boardSize) / 2;
let numPairsMatched = 0;
let board = [];
let boardClicked = [];
let winTotal = 0;
let firstCard = null;
let firstCardElement;
let secondCardElement;
let deck;
let canClick = true;
let boardEl;
const gameInfo = document.createElement('div');
const gameTimer = document.createElement('div');

const GAME_COMPLETE = 'COMPLETE';
const GAME_CONTINUE = 'CONTINUE';
let gameStatus = GAME_CONTINUE;

let seconds = 180;

const restartButton = document.createElement('button');

/* *****************
** Gameplay Logic **
****************** */

const squareClick = (cardElement, row, column) => {
  console.log(cardElement);
  console.log('FIRST CARD DOM ELEMENT', firstCard);
  console.log('BOARD CLICKED CARD', board[row][column]);

  const clickedCard = board[row][column];
  const ifClicked = boardClicked[row][column];

  if (canClick === true) {
    // the user already clicked on this square
    if (cardElement.innerText !== '') {
      return;
    }

    // first turn
    if (firstCard === null) {
      console.log('first turn');
      firstCard = clickedCard;
      // turn this card over
      firstCardElement = createCard(clickedCard);
      cardElement.appendChild(firstCardElement);

      gameInfo.innerText = 'Click on any box to select second card.';
      // hold onto this for later when it may not match
      firstCardElement = cardElement;

      // second turn
    } else {
      console.log('second turn');
      canClick = false;

      // if second card matches the first
      if (clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit) {
        console.log('match');

        // turn this card over
        secondCardElement = createCard(clickedCard);
        cardElement.appendChild(secondCardElement);

        // show match message
        gameInfo.innerText = 'Match!';
        // add 1 to num of matched pairs
        numPairsMatched += 1;

        if (numPairsMatched === numPairs) {
          winTotal += 1;
          gameInfo.innerText = `You win! You have won ${winTotal} time(s).`;
          gameStatus = GAME_COMPLETE;
          canClick = false;
          gameTimer.innerHTML = 'Game over. Click \'Restart Game\' button to play again.';
        } else {
          // clear match message after 3 seconds
          setTimeout(() => {
            gameInfo.innerText = 'Click on any box to flip over first card.';

            canClick = true;
          }, 3000);
        }
      } else {
        console.log('NOT a match');

        // check if second card has been clicked before
        if (ifClicked === 'N') {
        // turn this card back over
          firstCardElement.innerText = '';
          boardClicked[row][column] = 'Y';

          // show not match message
          gameInfo.innerText = 'Not a match!';
          // reset match message after 3 seconds
          setTimeout(() => {
            gameInfo.innerText = 'Click on any box to flip over first card.';
            canClick = true;
          }, 3000);
          // if second card has been clicked before
        } else if (ifClicked === 'Y') {
        // turn this card over
          secondCardElement = createCard(clickedCard);
          cardElement.appendChild(secondCardElement);

          // show not match message
          gameInfo.innerText = 'Not a match! Since you clicked the second card before, we show it for 3 seconds.';

          // clear cards after 3 seconds
          setTimeout(() => {
          // clears first card
            firstCardElement.innerHTML = '';
            // clears second card
            cardElement.innerHTML = '';
            // reset game info instructions
            gameInfo.innerText = 'Click on any box to flip over first card.';

            canClick = true;
          }, 3000);
        }
      }

      // reset the first card
      firstCard = null;
    }
  } else {
    gameInfo.innerText = 'Wait for instructions.';
  }
};

/* **********************
** Game Initialisation **
*********************** */

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');
  // assign a class to boardElement
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
      // set a class for CSS purpose
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
  document.body.appendChild(gameTimer);
  // create this special deck by getting the doubled cards and
  // make a smaller array that is (boardSize squared) number of cards
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

  // create the array to track whether each square has been clicked
  for (let i = 0; i < boardSize; i += 1) {
    boardClicked.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      boardClicked[i][j] = 'N';
    }
  }

  console.log(boardClicked);

  boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);

  gameTimer.innerText = 'Game begins - You have 180 seconds to complete the game.';
  const timer = setInterval(() => {
    if (gameStatus === GAME_CONTINUE) {
      gameTimer.innerText = `${seconds} seconds left.`;

      if (seconds <= 0) {
        gameTimer.innerText = 'Game over. Click \'Restart Game\' button to play again.';
        gameInfo.innerText = 'Game finished.';
        gameStatus = GAME_COMPLETE;
        canClick = false;
        clearInterval(timer);
      }
      seconds -= 1;
    }
  }, 1000);

  // fill game info div with starting instructions
  gameInfo.innerText = 'Click on any box to flip over first card.';
  document.body.appendChild(gameInfo);
};

restartButton.innerHTML = 'Restart Game';
document.body.appendChild(restartButton);
initGame();

restartButton.addEventListener('click', () => {
  board = [];
  boardClicked = [];
  numPairsMatched = 0;
  gameTimer.innerText = '';
  gameInfo.innerText = '';
  boardEl.innerHTML = '';
  initGame();
  seconds = 180;
  canClick = true;
});
