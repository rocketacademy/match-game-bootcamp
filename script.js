// completed => Match Game setTimeout / Match Game Match /Full Match Game /Match Game Timer

// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let state;
let timer;
const firstClick = true;
const milliseconds = 1;
const delayInMilliseconds = 1;
let submitBtn;
let inputBox;
let count = 0;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function squareClick(cardElement, column, row) {
  if (firstClick) {
    const threeMins = 60 * 3;
    display = timer;
    timerCountDown(threeMins, display);
  }
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
    state.innerText = 'first turn';
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    state.innerText = ' second turn';
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      state.innerText = 'match';
      cardElement.innerText = clickedCard.name;
      count++;
      countElement.innerHTML = `current score = ${count}`;
      await sleep(1000);
      state.innerText = '';
      // turn this card over
    } else {
      cardElement.innerText = clickedCard.name;
      state.innerText = 'not a match try another pair';
      await sleep(1000);
      console.log('NOT a match');
      state.innerText = '';
      // turn this card back over
      cardElement.innerText = '';
      firstCardElement.innerText = '';
    }

    // reset the first card
    firstCard = null;
    canClick = true;
  }
}

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = () => {
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
      const currentCard = board[i][j];
      const suit = document.createElement('div');
      suit.classList.add('suit');
      square.appendChild(suit);
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

      let cardColor;
      if (currentSymbol === '♥️' || currentSymbol === '♦️') {
        cardColor = 'red';
      } else {
        cardColor = 'black';
      }

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
        color: cardColor,
        suitSymbol: currentSymbol,
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
let userName;
let resetBtn;
let countElement;
const initGame = () => {
  // create reset button
  const resetButtonDiv = document.createElement('div');
  resetBtn = document.createElement('button');
  resetBtn.innerHTML = 'reset';
  document.body.appendChild(resetButtonDiv).appendChild(resetBtn);
  resetBtn.addEventListener('click', reset);
  // create count element
  countElement = document.createElement('h3');
  countElement.innerHTML = `current score =  ${count}`;
  document.body.appendChild(resetButtonDiv).appendChild(countElement);
  // create name
  const userNameDiv = document.createElement('div');
  userName = document.createElement('h3');
  document.body.appendChild(userNameDiv).appendChild(userName);
  // create input box
  const inputBoxDiv = document.createElement('div');
  inputBox = document.createElement('input');
  submitBtn = document.createElement('button');
  const name = document.createElement('span');
  name.innerHTML = 'Input Name :';
  submitBtn.innerHTML = 'submit';
  document.body.appendChild(inputBoxDiv).appendChild(name);
  document.body.appendChild(inputBoxDiv).appendChild(inputBox);
  document.body.appendChild(inputBoxDiv).appendChild(submitBtn);
  submitBtn.addEventListener('click', onclick);
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      const currentCard = deck.pop();
      board[i].push(currentCard);
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
  // set timer element
  timer = document.createElement('div');
  timer.className = 'timer';
  document.body.appendChild(timer);
  // set state element
  state = document.createElement('div');
  state.className = 'currentState';
  document.body.appendChild(state);
};

const timerCountDown = (duration, display) => {
  let timer = duration; let minutes; let
    seconds;
  setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    display.textContent = `${minutes}:${seconds}`;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
};

const onclick = () => {
  const getName = inputBox.value;
  console.log(getName);
  if (getName === '') {
    window.alert('please input name');
  } else {
    userName.innerHTML = `welcome ${getName}`;
  }
};

const reset = () => {
  console.log('reset');
  window.location.reload();
};

initGame();
