// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
// Set the interval between clicks
let canClick = true;
// Create a div element for game instructions
const gameInfo = document.createElement('div');

// game play logic
// player 1 turn, if both cards match, player points =+ 1
// else, player 2 turn,player points =+ 1

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  if (canClick === false) {
    return;
  }
  if (canClick === true) {
    canClick = false;
    setTimeout(() => {
      canClick = true;
    }, 2000);
  }

  // first card is console logged, to track what was the first card.
  console.log('FIRST CARD DOM ELEMENT', firstCard);
  console.log('BOARD CLICKED CARD', board[column][row]);
  // to store clicked card.
  const clickedCard = board[column][row];
  // the user already clicked on this square, to avoid 2 entries on same square

  if (cardElement.innerText !== '') {
    return;
  }
  // Choose 2nd card
  // If havent click first card, you want to click first card
  if (firstCard === null) {
    console.log('choose 2nd cards');
    // store first card as clicked card in line 45
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = `${firstCard.name}${firstCard.suitSymbol}`;
    // hold onto this for later when it may not match
    firstCardElement = cardElement; }

  // or else second players turn
  else {
    console.log('second players turn');
    // IF IT IS A MATCH
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      // turn this card over
      cardElement.innerText = `${clickedCard.name}${clickedCard.suitSymbol}`;
      firstCardElement = null;
      firstCard = null;

      // IF IT IS NOT A MATCH (Check if point is scored)
    } else {
      cardElement.innerText = `${clickedCard.name}${clickedCard.suitSymbol}`;
      setTimeout(() => {
        firstCardElement.innerText = '';
        firstCardElement.className = 'square';
        cardElement.innerText = '';
        cardElement.className = 'square';
      }, 1000);

      console.log('NOT a match');

      // turn both cards back over after 3 seconds
      // removing innerText and changing the css class back to square, returns it to it's original state
      // reset the first card
      firstCard = null;
    } } };
// Game Initialisation

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
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit

    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    let currentSymbol;
    let currentColour = 'red';

    if (currentSuit === 'hearts') {
      currentSymbol = '❤️';
    } else if (currentSuit === 'diamonds') {
      currentSymbol = '♦️';
    } else if (currentSuit === 'clubs') {
      currentSymbol = '♣️';
      currentColour = 'black';
    } else if (currentSuit === 'spades') {
      currentSymbol = '♠️';
      currentColour = 'black';
    }

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
        suitSymbol: currentSymbol,
        colour: currentColour,
      };
      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }
  return newDeck;
};
// Get a random index ranging from 0 (inclusive) to max (exclusive).
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
const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add(cardInfo.displayName, cardInfo.colour);
  name.innerText = '3';

  const card = document.createElement('div');
  card.classList.add('card');

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

// Create a helper function for output to abstract complexity
// of DOM manipulation away from game logic

const initGame = () => {
// Gameinfo div
  gameInfo.innerText = 'Welcome to MATCH GAME! In this game the user turns cards over one at a time to find matching pairs of cards. Click the respective buttons to draw cards, ';
  document.body.appendChild(gameInfo);

  // create this special deck by getting the doubled cards and
  // making a smaller array that is (boardSize squared) number of cards
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

// git add (script.js)
// git commit -m (comment of what changes you added)
// add the new changes to github, git push origin master
// $ git push
