// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
const gameInfo = document.createElement('div');
let matchCounter = 0;

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

const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  let cardColor;
  let symbol;
  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];

    if (currentSuit === 'diamonds') {
      symbol = '♦️';
      cardColor = 'red';
    } else if (currentSuit === 'clubs') {
      symbol = '♣';
      cardColor = 'black';
    } else if (currentSuit === 'hearts') {
      symbol = '❤️';
      cardColor = 'red';
    } else if (currentSuit === 'spades') {
      symbol = '♠';
      cardColor = 'black';
    }

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
    // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }

      const cardInfo = {
        suitSymbol: symbol,
        suit: currentSuit,
        name: cardName,
        color: cardColor,
        rank: rankCounter,
      };

      // Add the new card to the deck
      newDeck.push(cardInfo);
      newDeck.push(cardInfo);
    }
  }

  // Return the completed card deck
  return newDeck;
};

const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add('name', cardInfo.color);
  console.log(cardInfo.name);
  console.log(cardInfo.color);
  name.innerText = cardInfo.name;

  const card = document.createElement('div');
  card.classList.add('card');

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

const output = (message) => {
  gameInfo.innerHTML = message;
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  console.log(column);
  console.log(row);

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
    // cardElement.innerHTML = firstCard.name;
    cardElement.appendChild(createCard(firstCard));

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    output('<br><b>Please click another card to see if it matches.</b>');

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      matchCounter += 1;
      output("<br><b>You've got a match!</b>");

      setTimeout(() => {
        output('');
      }, 3000);

      // turn this card over
      // cardElement.innerText = clickedCard.name;
      cardElement.appendChild(createCard(clickedCard));
    } else {
      cardElement.appendChild(createCard(clickedCard));
      const secondCardElement = cardElement;

      setTimeout(() => {
        secondCardElement.innerText = '';
      }, 3000);

      console.log('NOT a match');
      // turn this card back over
      firstCardElement.innerText = '';
      output('<br><b>Sorry, not a match. Please try again.</b>');
    }

    // reset the first card
    firstCard = null;
  }
  if (matchCounter === 8) {
    output('<br><b>You won! Everything matches!</b>');
  }
};

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
      }, false);

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// Game timer for 3 mins
let seconds = 180;
const delayInMilliseconds = 1000;

const timer = document.createElement('div');
document.body.appendChild(timer);

const displayTime = document.createElement('div');
document.body.appendChild(displayTime);

const ref = setInterval(() => {
  timer.innerHTML = '<b>Timer:</b>';
  displayTime.innerHTML = seconds;

  if (seconds <= 0) {
    clearInterval(ref);
    output('<br><b>Oops! You ran out of time!<b>');
  }
  seconds -= 1;
}, delayInMilliseconds);

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

  gameInfo.innerHTML = '<br><b>Please click a square to draw a card.</b>';
  document.body.appendChild(gameInfo);
};

initGame();
