// Please implement exercise logic here

// ================== HELPER FUNCTIONS ===================
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// make card deck
const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    let symbol = '';
    let color = '';

    if (currentSuit === 'hearts') {
      symbol = '♥️';
      color = 'red';
    } else if (currentSuit === 'diamonds') {
      symbol = '♦️';
      color = 'red';
    } else if (currentSuit === 'clubs') {
      symbol = '♣️';
      color = 'black';
    } else if (currentSuit === 'spades') {
      symbol = '♠️';
      color = 'black';
    }

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let shortForm = `${rankCounter}`;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        shortForm = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        shortForm = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        shortForm = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        shortForm = 'K';
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        displayName: shortForm,
        suitSymbol: symbol,
        suitColour: color,
      };

      // Add the new card to the deck
      newDeck.push(card);
      newDeck.push(card);
    }
  }

  // Return the completed card deck
  return newDeck;
};

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

const gameInfo = document.createElement('div');

const output = (message) => {
  gameInfo.innerHTML = message;
};

// =============== GLOBAL VARIABLES =================
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;

// =============== GAMEPLAY LOGIC ==================
const squareClick = (cardElement, column, row) => {
  // console.log(cardElement);
  // console.log('FIRST CARD DOM ELEMENT', firstCard);
  // console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  if (canClick === true) {
    // first turn
    if (firstCard === null) {
      console.log('first turn');
      firstCard = clickedCard;
      // turn this card over
      cardElement.innerHTML = `${firstCard.displayName}<br>${firstCard.suitSymbol}`;
      cardElement.classList.add('squareFace', firstCard.suitColour);
      output('Click on another card to find its matching pair.');

      // hold onto this for later when it may not match
      firstCardElement = cardElement;

    // second turn
    } else {
      console.log('second turn');
      if (
        clickedCard.displayName === firstCard.displayName
        && clickedCard.suit === firstCard.suit
      ) {
        canClick = false;

        setTimeout(() => {
          output('Click on any card to continue pairing all cards in the board.');
          canClick = true;
        }, 3000);

        output('Nice! You\'ve got a match!');
        console.log('match');

        // turn this card over
        cardElement.innerHTML = `${clickedCard.displayName}<br>${clickedCard.suitSymbol}`;
        cardElement.classList.add('squareFace', firstCard.suitColour);
      } else {
        output('Oops, that wasn\'t a match.');
        console.log('NOT a match');
        canClick = false;
        // turn this card over
        cardElement.innerHTML = `${clickedCard.displayName}<br>${clickedCard.suitSymbol}`;
        cardElement.classList.add('squareFace', firstCard.suitColour);

        setTimeout(() => {
          // turn this card back over
          firstCardElement.innerText = '';
          firstCardElement.classList.remove('squareFace');
          cardElement.innerText = '';
          cardElement.classList.remove('squareFace');
          output('Click on any card to continue.');
          canClick = true; }, 3000); }
      // reset the first card
      firstCard = null; }
  }
};

// =============== GAME INITIALIZATION ===================
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

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const initGame = () => {
  gameInfo.innerHTML = 'Find all matching pairs of cards in the board below!<br>Click on any of the cards below to begin.';
  gameInfo.classList.add('info');
  document.body.appendChild(gameInfo);

  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    console.log(board);
    board.push([]);
    console.log(board);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

buildBoardElements();
initGame();
