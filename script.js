// boardSize has to be an even number
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = false;
const gameMsg = document.createElement('div');
const timer = document.createElement('div');
const nameDiv = document.createElement('div');
const buttonsDiv = document.createElement('div');
const boardElement = document.createElement('div');
const scoreDiv = document.createElement('div');
let timeLeft = 180000;
let user = '';
let pairsToMatch = (boardSize ** 2) / 2;
let gameReset = false;
let gamesWon = 0;

const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleBoard = () => {
  board = [];
  // eslint-disable-next-line
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  // eslint-disable-next-line
  deck = shuffleCards(deckSubset);

  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
};

const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '' || canClick === false) {
    return;
  }

  if (firstCard === null) {
    gameMsg.innerText = 'Choose your second card!';
    firstCard = clickedCard;
    cardElement.innerText = `${firstCard.suit}${firstCard.name}`;
    firstCardElement = cardElement;
  } else {
    cardElement.innerText = `${clickedCard.suit}${clickedCard.name}`;
    canClick = false;
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      gameMsg.innerText = "It's a match! Choose another card!";
      canClick = true;
      pairsToMatch -= 1;
      if (pairsToMatch === 0) {
        gameReset = true;
        gamesWon += 1;
        scoreDiv.innerText = '';
        scoreDiv.innerText = `Score: ${gamesWon}`;
        canClick = false;
        gameMsg.innerText = 'Yay you won this round!';
        // eslint-disable-next-line
        const winMsg = setTimeout(() => {
          // eslint-disable-next-line
          resetGame();
        }, 5000);
      }
    } else {
      gameMsg.innerText = 'Meh. No match.';
      setTimeout(() => {
        canClick = true;
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        gameMsg.innerText = 'Choose another card!';
      }, 1000);
    }
    firstCard = null;
  }
};

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['❤️', '♦️', '♣️', '♠️'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

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

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

const shuffleCards = (cardDeck) => {
// Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cardDeck.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cardDeck;
};

// eslint-disable-next-line
const buildBoardElements = (board) => {
  boardElement.classList.add('board');

  for (let i = 0; i < board.length; i += 1) {
    const row = board[i];
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    for (let j = 0; j < row.length; j += 1) {
      const square = document.createElement('div');
      square.classList.add('square');

      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }
  return boardElement;
};

const msToMin = (timeMs) => {
  const timeSec = timeMs / 1000;
  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;
  const padSeconds = String(seconds).padEnd(2, 0);
  return `${minutes}:${padSeconds}`;
};

const startTimer = () => {
  gameMsg.innerText = 'Game started! Please choose a card.';
  timer.classList.add('message');
  timer.innerText = `Time left: ${msToMin(timeLeft)}`;

  canClick = true;

  const countTime = setInterval(() => { timer.innerText = `Time left: ${msToMin(timeLeft)}`;

    if (timeLeft <= 0) {
      clearInterval(countTime);
      timer.innerText = 'Times up!';
      canClick = false;
    }

    if (gameReset === true) {
      gameReset = false;
      clearInterval(countTime);
      canClick = false;
    }

    timeLeft -= 1000;
  }, 1000);
};

const resetGame = () => {
  gameMsg.innerText = `New game! ${user}, please click start to begin again.`;
  gameReset = true;

  boardElement.innerHTML = '';
  shuffleBoard();
  buildBoardElements(board);

  timeLeft = 180000;
};

const inputName = () => {
  user = document.querySelector('#userName').value;
  gameMsg.innerText = `Hello ${user}! Please click start to begin.`;
  nameDiv.innerHTML = '';

  const startButton = document.createElement('button');
  const resetButton = document.createElement('button');
  startButton.innerText = 'Start';
  resetButton.innerText = 'Reset';
  startButton.addEventListener('click', startTimer);
  resetButton.addEventListener('click', resetGame);
  buttonsDiv.appendChild(startButton);
  buttonsDiv.appendChild(resetButton);
};

const initGame = () => {
  gameMsg.classList.add('message');
  gameMsg.innerHTML = 'Welcome to Match Game! <br> Please enter your name: ';
  document.body.appendChild(gameMsg);

  const nameInput = document.createElement('input');
  nameInput.setAttribute('id', 'userName');
  const nameButton = document.createElement('button');
  nameButton.innerText = 'Submit';
  nameButton.addEventListener('click', inputName);
  nameDiv.appendChild(nameInput);
  nameDiv.appendChild(nameButton);
  document.body.appendChild(nameDiv);

  document.body.appendChild(buttonsDiv);

  document.body.appendChild(timer);

  shuffleBoard();

  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);

  scoreDiv.classList.add('message');
  scoreDiv.innerText = `Score: ${gamesWon}`;
  document.body.appendChild(scoreDiv);
};

initGame();
