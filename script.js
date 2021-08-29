// ========================== VARIABLES DECLARATION ==========================

// boardSize has to be an even number
const boardSize = 2;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
const gameInfo = document.createElement('div');
gameInfo.classList.add('message-display');
let userName = '';
let numMatches = 0;
let totalWin = 0;

// ========================== DECK CREATION FUNCTION ==========================

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['❤️', '♦️', '♣️', '♠️'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    let cardColor;
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // Assign color of the card according to the suits.
    if (currentSuit === '❤️' || currentSuit === '♦️') {
      cardColor = 'red';
    } else {
      cardColor = 'black';
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
        displayName: cardName,
        suitSymbol: currentSuit,
        rank: rankCounter,
        color: cardColor,
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

// Create DOM element with card visual
const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add(cardInfo.displayName, cardInfo.color);
  name.innerText = cardInfo.displayName;

  const card = document.createElement('div');
  card.classList.add('card');

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

// ========================== GAMEPLAY LOGIC ==========================

// Function to create game state message.
const messageDisplay = (message) => {
  gameInfo.innerText = message;
};

// Function to check card match and turn cards over.
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
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.appendChild(createCard(firstCard));

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // Update game state message after first card selected.
    messageDisplay('Select the next card.');

    // second turn
  } else {
    console.log('second turn');

    if (
      clickedCard.displayName === firstCard.displayName
        && clickedCard.suitSymbol === firstCard.suitSymbol
    ) {
      console.log('match');
      numMatches += 1;

      // If player has matched all cards, he has won this round, display a winning message.
      if (numMatches === (boardSize ** 2) / 2) {
        totalWin += 1;
        messageDisplay(`${userName}!! You have matched all cards! You win!!`);
        setTimeout(() => {
          messageDisplay(`You have won the game ${totalWin} times. Click reset to play again!`);
        }, 5000);
      } else {
        messageDisplay('You found a match!');
        setTimeout(() => {
          messageDisplay('');
        }, 3000);
      }

      // turn this card over
      cardElement.appendChild(createCard(clickedCard));
    } else {
      console.log('NOT a match');
      messageDisplay('Oops, no match! Try again!');

      // turn the second card over for 3s
      cardElement.appendChild(createCard(clickedCard));
      setTimeout(() => {
        cardElement.innerText = '';
      }, 3000);

      // turn the first card back over after 3 s
      setTimeout(() => {
        firstCardElement.innerText = '';
      }, 3000);
    }

    // reset the first card
    firstCard = null;
  }
};

// ========================== GAME INITIALISATION ==========================
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (inpuBoard) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < inpuBoard.length; i += 1) {
    // make a var for just this row of cards
    const row = inpuBoard[i];

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

const getName = () => {
  messageDisplay('Please input your name :)');

  const userNameInput = document.createElement('input');
  userNameInput.setAttribute('placeholder', 'Your Name');

  const submitButton = document.createElement('button');
  submitButton.innerText = 'Submit';
  submitButton.addEventListener('click', () => {
    userName = userNameInput.value;
    // Remove the name input and submit buttons.
    userNameInput.remove();
    submitButton.remove();
    initGame();
  });

  document.body.appendChild(gameInfo);
  document.body.appendChild(userNameInput);
  document.body.appendChild(submitButton);
};

const gamePlay = () => {
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
  boardEl.setAttribute('id', 'main-board');

  document.body.appendChild(boardEl);

  gameInfo.innerText = `Hello ${userName}! Select the first card to begin.`;
  document.body.appendChild(gameInfo);

  // Set up a timer for 3mins. Once 3mins is up, the board will disappear.
  setTimeout(() => {
    if (totalWin === 0) {
      boardEl.innerHTML = '';
      messageDisplay(`Sorry ${userName}... Time's up! Better luck next time!`);
    } else {
      boardEl.innerHTML = '';
      messageDisplay(`Thanks for playing ${userName}! Time's up! You won ${totalWin} times! Nice!`);
    }
  }, 180000);
};

const initGame = () => {
  // Create a reset game button, will reset current grid on click.
  const resetButton = document.createElement('button');
  resetButton.innerText = 'Reset this game';
  resetButton.addEventListener('click', () => {
    document.querySelector('#main-board').remove();
    board = [];
    numMatches = 0;
    gamePlay();
  });

  // If player name is not recorded, Get player to input their name.
  if (userName === '') {
    getName();
  } else {
    gamePlay();
    document.body.appendChild(resetButton);
  }
};

initGame();
