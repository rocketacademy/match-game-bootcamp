let inputContainer;
let resetBtnContainer;
const getRandomIndex = (max) => Math.floor(Math.random() * max);
let scoreIndex = 0;
let playerScore = 0;
const winMessage = document.createElement('div');
let displayMsgCounter = false;
// boardSize has to be an even number\
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
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
        color: 'red',
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};
const shortMessage = (displayMsgCounter) => {
  winMessage.innerHTML = 'Match!';
  if (displayMsgCounter === true) {
    winMessage.innerText = '';
  }
  if (displayMsgCounter === false) {
    winMessage.innerText = 'you win all cards';
    console.log('test3');
  }
  document.body.appendChild(winMessage);
};
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
  if (firstCard === null && canClick) {
    console.log('first turn');
    firstCard = clickedCard;
    console.log(firstCard);
    // turn this card over
    cardElement.innerText = `${firstCard.name}\n${firstCard.suit}`;

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
      let showMatch = '';
      scoreIndex += 1;
      updatingScore();
      console.log(scoreIndex < 8);
      console.log(scoreIndex === 1);
      if (scoreIndex < 8) {
        cardElement.innerText = `${clickedCard.name}\n${firstCard.suit}`;
        cardElement.classList.add(clickedCard.colour);
        console.log('test');
        showMatch = shortMessage();
        displayMsgCounter = true;
        showMatch = setTimeout(() => {
          shortMessage(displayMsgCounter);
        }, 3000);
        // turn this card over
      }
      if (scoreIndex === 8) {
        console.log('test2');
        cardElement.innerText = `${clickedCard.name}\n${firstCard.suit}`;
        cardElement.classList.add(clickedCard.colour);
        displayMsgCounter = false;
        showMatch = shortMessage(displayMsgCounter);
        displayMsgCounter = true;
        showMatch = setTimeout(() => {
          shortMessage(displayMsgCounter);
        }, 50000);
        console.log('1 point');
        playerScore += 1;
        scoreIndex = 0;
      }
    } else {
      canClick = false;
      console.log('NOT a match');
      cardElement.innerText = `${clickedCard.name}\n${firstCard.suit}`;
      cardElement.classList.add(clickedCard.colour);
      setTimeout(() => {
        cardElement.innerText = '';
        canClick = true;
      }, 3000);

      // turn this card back over

      firstCardElement.innerText = '';
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
        squareClick(event.currentTarget, i, j, scoreIndex);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};
const makeBoard = () => {
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  const board = [];
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  return board;
};
const initGame = () => {
  const playerName = window.prompt('Enter your name');

  inputContainer = document.createElement('div');
  resetBtnContainer = document.createElement('div');
  const inputBtnName = document.createElement('div');
  const resetbuttom = document.createElement('button');
  const msgWarming = document.createElement('div');
  const output = document.createElement('div');
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  board = makeBoard();

  const boardEl = buildBoardElements(board);

  resetbuttom.innerText = 'reset';

  resetbuttom.addEventListener('click', resetGame);

  updatingScore = () => {
    msgWarming.innerText = `${playerName}, you have 3 minutes(120 seconds) to complete the game match! Your current score ${scoreIndex}`;
  };
  msgWarming.innerText = `${playerName}, you have 3 minutes to complete the game match(120 seconds)! Your current score ${scoreIndex}`;

  //
  let milliseconds = 0;
  const delayInMilliseconds = 1000;

  output.innerText = milliseconds;
  inputBtnName.innerText = `Welcome, ${playerName}!`;
  document.body.appendChild(boardEl);
  document.body.appendChild(inputContainer);
  document.body.appendChild(resetBtnContainer);
  inputContainer.appendChild(inputBtnName);
  resetBtnContainer.appendChild(resetbuttom);
  document.body.appendChild(msgWarming);
  document.body.appendChild(output);
  const ref = setInterval(() => {
    output.innerText = `${milliseconds} seconds`;

    if (milliseconds >= 180) {
      clearInterval(ref);
      const timeMsg = document.createElement('div');
      timeMsg.innerText = 'TIMES UP!';
      document.body.appendChild(timeMsg);
    }

    milliseconds += 1;
  }, delayInMilliseconds);
  //
};
const resetGame = () => {
  window.location.reload();
};
initGame();
// const input = document.querySelector('#input-field');
// const result = main(input.value);

// // Display result in output element
// const output = document.querySelector('#output-div');
// output.innerHTML = result;
