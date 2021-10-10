// GLOBAL VARIABLES
const boardSize = 6;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

// Game interface
const gameInterface = document.createElement('div');
gameInterface.classList.add('gameUi');

// Timer
const delayInMilliseconds = 1000;
const gameTimer = document.createElement('div');
gameTimer.classList.add('timer');
let timeCounter = 180;
let timerStarted = 0;

// Click Validation
let canClick = true;

// Username
let username;

// Win-Lose
let playerWin;

// GAMEPLAY LOGIC
const startCountdownTimer = () => {
  console.log('timer started!');
  timerStarted = 1;
  const ref = setInterval(() => {
    timeCounter -= 1;
    console.log(timeCounter);
    console.log(delayInMilliseconds);
    gameTimer.innerText = `GAME TIME LIMIT
  ${timeCounter}`;
    if (timeCounter === 0) {
      clearInterval(ref);
      playerWin = 0;
      gameInterface.innerText = 'Time is up, you lost! Try again?';
    }
  }, delayInMilliseconds);
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // first click start timer.
  if (timerStarted === 0) {
    timerStarted = 1;
    startCountdownTimer();
  }

  // user clicked same square - tell user to pick another
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = `${firstCard.displayName}
    ${firstCard.symbol}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    gameInterface.innerText = `You picked ${firstCard.name} of ${firstCard.suit}. Let's hope you pick its pair, click on another blank card!`;
    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      gameInterface.innerText = 'They matched, well done!! On to the next pair!';

      // turn this card over
      cardElement.innerText = `${clickedCard.displayName} 
      ${clickedCard.symbol}`;
      setTimeout(() => {
        gameInterface.innerText = '';
      }, (delayInMilliseconds * 3));
    } else {
      console.log('NOT a match');
      gameInterface.innerText = `It did not match, try again!
      You have a 3 seconds penalty and must wait until the cards flip back.`;
      canClick = false;
      // turn this card over
      cardElement.innerText = `${clickedCard.displayName} 
      ${clickedCard.symbol}`;

      // turn this both cards back over AFTER DELAY
      setTimeout(() => {
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        gameInterface.innerText = '';
        canClick = true;
      }, (delayInMilliseconds * 3));
    }

    // reset the first card
    firstCard = null;
  }
};

// GAME INITIALISATION LOGIC
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

      // color
      if (square.suit === 'diamonds' || square.suit === 'hearts') {
        square.classList.add('red');
      }

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        if (canClick === true) {
          squareClick(event.currentTarget, i, j);
        }
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const createDeck = () => {
  // newDeck array to contain cards
  const newDeck = [];

  // outer loop. four suits; suit symbols; suit colors
  const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
  const suitSymbols = ['♦️', '♣️', '♥️', '♠️'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    const currentSymbol = suitSymbols[suitIndex];

    let suitColor = '';
    if (currentSuit === 'diamonds' || currentSuit === 'hearts') {
      suitColor = 'red';
    } else if (currentSuit === 'clubs' || currentSuit === 'spades') {
      suitColor = 'black';
    }
    // inner loop. 1 to 13 ranks;
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Define card names
      let cardName = `${rankCounter}`;
      let shortName = `${rankCounter}`;
      // Define exceptions for card name
      if (cardName === '1') {
        cardName = 'ace';
      } else if (cardName === '11') {
        cardName = 'jack';
      } else if (cardName === '12') {
        cardName = 'queen';
      } else if (cardName === '13') {
        cardName = 'king';
      }

      // Define exceptions for display name
      if (shortName === '1') {
        shortName = 'A';
      } else if (shortName === '11') {
        shortName = 'J';
      } else if (shortName === '12') {
        shortName = 'Q';
      } else if (shortName === '13') {
        shortName = 'K';
      }

      // Create Card
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        symbol: currentSymbol,
        color: suitColor,
        displayName: shortName,
      };

      // add card to deck through push function.
      newDeck.push(card);
      newDeck.push(card); // for pairs
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

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  document.body.appendChild(gameTimer);
  document.body.appendChild(gameInterface);
  gameTimer.innerText = `GAME TIME LIMIT
  ${timeCounter}`;

  gameInterface.innerText = `Hello ${username}, welcome to Match Game.
  The rules are simple, find all the pairs to win!
  
  Click to begin playing :)`;
  const doubleDeck = createDeck();
  console.log(doubleDeck);
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  console.log(deck);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  console.log(board);
  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

const preGame = () => {
  // Username
  const userInputDisplay = document.createElement('div');
  document.body.appendChild(userInputDisplay);

  const pregameMessage = document.createElement('p');
  userInputDisplay.appendChild(pregameMessage);
  pregameMessage.innerText = '';

  const usernameBox = document.createElement('input');
  usernameBox.setAttribute('type', 'text');
  usernameBox.setAttribute('placeholder', 'type your name here');
  // set id to retrieve user's name
  usernameBox.setAttribute('id', 'username');
  userInputDisplay.appendChild(usernameBox);

  const inputButton = document.createElement('button');
  inputButton.innerText = 'submit name';
  userInputDisplay.appendChild(inputButton);
  inputButton.addEventListener('click', () => {
    const userInput = document.querySelector('#username');
    console.log(userInput);
    username = userInput.value;
    document.body.removeChild(userInputDisplay);
    initGame();
  });
};
preGame();
