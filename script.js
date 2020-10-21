// Global setup ----------------------------------------------------
const board = [];
let firstCard = null;
const boardSize = 4; // has to be an even number
const matchesNeededToWin = (boardSize * boardSize) / 2;
let numOfMatches = 0;

// to store the square elements that the player clicked on this round
let firstClickedSquare;
let secondClickedSquare;

// to store position of first square clicked
const positionOfFirstSquareClicked = [];

let canClick = true;

let deck;

const gameInfo = document.createElement('div');

let gameStatus = 'playGame';

// display score message
const scoreMessage = document.createElement('div');

// Helper functions -----------------------------------------------
// output message
const output = (message) => {
  gameInfo.innerHTML = message;
};

// flip over cards that were clicked this round if they do not match
const flipOverSquares = (firstSquare, secondSquare) => {
  canClick = false;
  setTimeout(() => {
    console.log('turn both cards back over');
    firstSquare.innerText = '';
    secondSquare.innerText = '';

    // allow player to click on squares again
    canClick = true;
  }, 3000);
};

// create match message that will disappear after a set time
const createMatchMessage = (boardElement) => {
  const matchMessageContainer = document.createElement('div');
  matchMessageContainer.classList.add('match-message-container');
  matchMessageContainer.innerText = 'MATCH!';

  boardElement.appendChild(matchMessageContainer);

  canClick = false;

  // match message will disappear after a set time
  setTimeout(() => {
    boardElement.removeChild(matchMessageContainer);

    canClick = true;

    // tell player to click on another square
    output('It is a match! <br> Click on another square to continue!');
  }, 3000);
};

// flip cards and check for pairs when a square is clicked
const squareClick = (squareClickElement, column, row, boardElement) => {
  console.log(squareClickElement);
  console.log('FIRST CARD', firstCard);
  console.log('CLICKED CARD', board[column][row]);

  if (firstCard === null) {
    firstCard = board[column][row];
    firstClickedSquare = squareClickElement;
    positionOfFirstSquareClicked.push(column);
    positionOfFirstSquareClicked.push(row);

    // turn this card over
    firstClickedSquare.innerText = `${firstCard.display},${firstCard.suitSymbol}`;

    // let player know to click another card
    output('Click on another square to flip over the 2nd card!');
  } else if (column === positionOfFirstSquareClicked[0]
    && row === positionOfFirstSquareClicked[1]) {
    console.log('clicked on same card');
    // do nothing if player clicked on same card
  }
  else if (board[column][row].name === firstCard.name
  && board[column][row].suit === firstCard.suit) {
    secondClickedSquare = squareClickElement;

    // turn this card over
    secondClickedSquare.innerText = `${board[column][row].display},${board[column][row].suitSymbol}`;
    console.log('match');

    // increment number of matches by 1
    numOfMatches += 1;

    // display winning message and end game if player matches everything
    if (numOfMatches === matchesNeededToWin) {
      gameStatus = 'stopGame';

      const specialMessage = document.createElement('img');
      specialMessage.classList.add('special-message');
      specialMessage.src = 'https://www.birthdaywishes.expert/wp-content/uploads/2018/06/Success.jpg';
      document.body.appendChild(specialMessage);

      setTimeout(() => {
        document.body.removeChild(specialMessage);
        output('Congratulations you have matched all cards! Please refresh to play again');
      }, 5000);
    }

    // let player know that it is a match and to pick another card
    // and clear output meesage
    output('');
    createMatchMessage(boardElement);
  } else {
    // empty first card
    firstCard = null;

    secondClickedSquare = squareClickElement;

    // turn this card over
    secondClickedSquare.innerText = `${board[column][row].display},${board[column][row].suitSymbol}`;

    // let player know that it is not a match and to pick another card
    output('Oops your cards did not match! <br> Click on another square to try again!');

    // turn this card and first card back over
    flipOverSquares(firstClickedSquare, secondClickedSquare);
  }

  scoreMessage.innerText = `Number of Matches: ${numOfMatches}`;
};

// make deck
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitColors = ['red', 'red', 'black', 'black'];
  const suitSymbols = ['♥', '♦', '♣', '♠'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // make a variable for the current suit color
    const currentSuitColor = suitColors[suitIndex];

    // make a variable for the current suit symbol
    const currentSuitSymbol = suitSymbols[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let displayName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        displayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        displayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        displayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        displayName = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol: currentSuitSymbol,
        display: displayName,
        color: currentSuitColor,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// get a random index from an array given it's size
const getRandomIndex = (size) => Math.floor(Math.random() * size);

// shuffle cards
const shuffleCards = (cards) => {
  // loop over the entire cards array
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem; // giving eslint warning bc it is advised
    cards[randomIndex] = currentItem; // not to alter the contents of an input (cards).
  }

  // give back the shuffled deck
  return cards;
};

const buildBoardElements = (currentBoard) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < currentBoard.length; i += 1) {
    // make a var for just this row of cards
    const row = currentBoard[i];

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
        // do not allow clicks to work when waiting for squares to flip over.
        if (canClick === true && gameStatus === 'playGame') {
          squareClick(event.currentTarget, i, j, boardElement);
        }
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// Game initilization -------------------------------------------------
// create all the board elements that will go on the screen
// return the built board
const gameInit = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck(); // must not shuffle this deck bc you want to take out the pairs
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

  // initialize game info div with starting instructions
  gameInfo.innerText = 'Click on a square to flip over a card!';
  document.body.appendChild(gameInfo);

  document.body.appendChild(scoreMessage);
};

// start game
gameInit();

// setTimer till game ends
setTimeout(() => {
  gameStatus = 'stopGame';
  output('Sorry time is up! Please refresh the page to play again.');
}, 180000);
