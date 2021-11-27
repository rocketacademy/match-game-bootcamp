// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let isMatching = false;

const displayMessage = (message) => {
  const gameState = document.getElementById('game-state');
  gameState.innerText = message;
};

const revealCard = (cardElement, cardInfo) => {
  const name = document.createElement('div');
  name.classList.add('name', cardInfo.colour);
  name.innerText = cardInfo.displayName;

  const suit = document.createElement('div');
  suit.classList.add('suit', cardInfo.colour);
  suit.innerText = cardInfo.suitSymbol;

  cardElement.appendChild(name);
  cardElement.appendChild(suit);

  return cardElement;
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if ((cardElement.innerText !== '') || isMatching) {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;

    // turn this card over
    // cardElement.innerText = firstCard.name;
    revealCard(cardElement, firstCard);

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    displayMessage('Click on another card to find match.');

  // second turn
  } else {
    console.log('second turn');
    isMatching = true;

    revealCard(cardElement, clickedCard);

    if (clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit) {
      console.log('match');
      displayMessage('That is a match.');
      isMatching = false;

      setTimeout(() => {
        displayMessage('Click any card to continue playing.');
      }, 3000);
      // turn this card over
      // cardElement.innerText = clickedCard.name;
    } else {
      console.log('NOT a match');
      displayMessage('That is not a match.');

      // turn this card over
      // cardElement.innerText = clickedCard.name;

      // turn this card back over, after 3 seconds
      setTimeout(() => {
        // firstCardElement.innerText = '';
        firstCardElement.innerHTML = '';
        // cardElement.innerText = '';
        cardElement.innerHTML = '';
        displayMessage('Click any card to continue playing.');
        isMatching = false;
      }, 3000);
    }

    // reset the first card
    firstCard = null;
  }
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

/**
 * Shuffle an array of cards
 * @param {*} cards Deck of cards
 * @returns Shuffled cards
 */
const shuffleCards = (cards) => {
  const shuffledCards = cards;

  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    shuffledCards[currentIndex] = randomCard;
    shuffledCards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return shuffledCards;
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // add area for state of game information
  const stateOfGameElement = document.createElement('div');
  stateOfGameElement.setAttribute('id', 'game-state');
  stateOfGameElement.classList.add('game-state');
  stateOfGameElement.innerText = 'Click on any card to play the game.';
  boardElement.appendChild(stateOfGameElement);

  // // add area for buttons
  // const buttonsElement = document.createElement('div');
  // buttonsElement.classList.add('buttons');

  // // add start game button
  // const startButtonElement = document.createElement('button');
  // startButtonElement.innerText = 'Start Game';
  // startButtonElement.classList.add('button');
  // buttonsElement.appendChild(startButtonElement);

  // // add reset game button
  // const resetButtonElement = document.createElement('button');
  // resetButtonElement.innerText = 'Reset Game';
  // resetButtonElement.classList.add('button');
  // buttonsElement.appendChild(resetButtonElement);

  // boardElement.appendChild(buttonsElement);

  // // add area for scores
  // const scoresElement = document.createElement('div');
  // scoresElement.classList.add('scores');
  // boardElement.appendChild(scoresElement);

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
      square.classList.add('card');

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

/**
 * Make a new card deck
 * @returns An array of cards
 */
const makeDeck = (cardAmount) => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitsSymbol = ['♥️', '♦️', '♣️', '♠️'];

  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let cardDisplayName = `${rankCounter}`;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        cardDisplayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplayName = 'K';
      }

      let cardColour = 'black';
      if ((suits[suitIndex] === 'hearts') || (suits[suitIndex] === 'diamonds')) {
        cardColour = 'red';
      }

      // Create a new card info with the suit symbol ('♦️'), suit ('diamond'),
      // name ('queen'), display name ('Q'), colour ('red'), and rank (12).
      const card = {
        suitSymbol: suitsSymbol[suitIndex],
        suit: currentSuit,
        name: cardName,
        displayName: cardDisplayName,
        colour: cardColour,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // Add the new card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  // Return the completed card deck
  return newDeck;
};

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
};
initGame();
