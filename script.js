// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
const gameMsg = document.createElement('div');

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  console.log('FIRST CARD DOM ELEMENT', firstCard);
  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '' || canClick === false) {
    return;
  }

  if (firstCard === null) {
    console.log('first turn');
    gameMsg.innerText = 'Choose your second card!';
    firstCard = clickedCard;
    cardElement.innerText = `${firstCard.suit}${firstCard.name}`;
    firstCardElement = cardElement;
  } else {
    console.log('second turn');
    cardElement.innerText = `${clickedCard.suit}${clickedCard.name}`;
    canClick = false;
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      gameMsg.innerText = "It's a match! Choose another card!";
    } else {
      console.log('NOT a match');
      gameMsg.innerText = 'Meh. No match.';
      setTimeout(() => {
        canClick = true;
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        gameMsg.innerText = 'Choose another card!';
      }, 3000);
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

const getRandomIndex = (max) => Math.floor(Math.random() * max);

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
  const boardElement = document.createElement('div');
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

const initGame = () => {
  gameMsg.classList.add('message');
  gameMsg.innerText = 'Welcome to Match Game! Click any card to begin.';
  document.body.appendChild(gameMsg);

  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
};

initGame();
