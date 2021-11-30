// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let playerName = '';
const timeToPlayInSecs = 180;
const intervalInMS = 200;

// DOM elements
const outputEl = document.createElement('div');
const inputContainer = document.createElement('div');
const inputLabel = document.createElement('label');
const inputEl = document.createElement('input');
const inputBtn = document.createElement('button');
const scoreContainer = document.createElement('div');
const timerContainer = document.createElement('div');
const timerLabel = document.createElement('label');
const timerOutput = document.createElement('output');

const squareClick = (cardElement, column, row) => {
  // console.log(cardElement);
  // console.log('FIRST CARD DOM ELEMENT', firstCard);
  // console.log('BOARD CLICKED CARD', board[column][row]);

  // start countdown timer upon 1st click

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
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      console.log('match');

      // display 'match' immediately and remove 'match' after 3 seconds
      let counter = 3;
      outputEl.innerText = 'Match🎉';
      const ref = setInterval(() => {
        console.log(counter);
        if (counter <= 1) {
          outputEl.innerText = '';
          clearInterval(ref);
        }
        counter -= 1;
      }, 1000);

      // turn this card over
      cardElement.innerText = clickedCard.name;
    } else {
      setTimeout(() => {
        console.log('NOT a match');

        // turn this card back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
      }, intervalInMS);
    }

    // reset the first card
    firstCard = null;
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

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  // input elements
  document.body.appendChild(inputContainer);
  inputContainer.classList.add('input-container');
  inputLabel.classList.add('input-label');
  inputLabel.innerText = 'Player Name: ';
  inputContainer.appendChild(inputLabel);
  inputEl.classList.add('input-field');
  inputContainer.appendChild(inputEl);
  inputBtn.classList.add('input-button');
  inputBtn.innerText = 'Submit';
  inputContainer.appendChild(inputBtn);

  // board elements
  const boardEl = buildBoardElements(board);
  document.body.appendChild(outputEl);
  document.body.appendChild(boardEl);
  outputEl.classList.add('output');

  // timer elements
  document.body.appendChild(timerContainer);
  timerContainer.classList.add('timer-container');
  timerLabel.classList.add('timer-label');
  timerLabel.innerText = 'Time left to play (secs):';
  timerContainer.appendChild(timerLabel);
  timerOutput.classList.add('timer-output');
  timerContainer.appendChild(timerOutput);

  // score elements
  scoreContainer.classList.add('score-container');
  document.body.append(scoreContainer);

  inputBtn.addEventListener('click', function () {
    playerName = inputEl.value;
    outputEl.innerText = `Hi ${playerName}! Please start matching the cards, note the timer at the bottom.`;

    // start match timer
    matchTimer(timeToPlayInSecs);
  });
};

const matchTimer = function (timeToPlayInSecs) {
  let totalTimeInSecs = timeToPlayInSecs;
  setInterval(() => {
    timerOutput.innerText = totalTimeInSecs;

    if (totalTimeInSecs <= 0) {
      clearInterval(matchTimer);
    }

    totalTimeInSecs -= 1;
  }, 1000);
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    // console.log(`current suit: ${currentSuit}`);

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

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

const shuffleCards = function (cards) {
  for (let i = 0; i < cards.length; i++) {
    const currentCard = cards[i];
    const randomIndex = getRandomIndex(cards);
    const randomCard = cards[randomIndex];
    cards[i] = randomCard;
    cards[randomCard] = currentCard;
  }
  return cards;
};

const getRandomIndex = function (cards) {
  return Math.floor(Math.random() * cards.length);
};

initGame();
