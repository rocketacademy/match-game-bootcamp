// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

// game state variables
let isMatching = false;
let isGameInProgress = false;
let score = 0;

// timer variables
const threeminutes = 180000;
let timer;
let milliseconds = threeminutes;

/**
 * Display game state message.
 * @param {*} message Message
 * @param {*} color Color of message text
 */
const displayMessage = (message, color = 'black') => {
  const gameState = document.getElementById('game-state');
  gameState.innerText = message;
  gameState.style.color = color;
};

/**
 * Reveal card to player
 * @param {*} cardElement Card
 * @param {*} cardInfo Card information
 * @returns Card
 */
const revealCard = (cardElement, cardInfo) => {
  cardElement.innerText = '';

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

const closeCard = (cardElement) => {
  const frontOfCard = document.createElement('div');
  frontOfCard.innerText = '⭘△☐';
  frontOfCard.style.setProperty('writing-mode', 'vertical-rl');
  frontOfCard.style.setProperty('text-orientation', 'sideways');
  cardElement.appendChild(frontOfCard);
};

/**
 * Check if all cards have been matched.
 * @returns True, if match is done. False, otherwise.
 */
const isMatchDone = () => {
  const cards = document.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i += 1) {
    if (cards[i].innerText === '⭘△☐') return false;
  }
  return true;
};

/**
 * Add score after a match game win.
 */
const updateScore = (diff = 1) => {
  score += diff;

  const scores = document.getElementById('scores');
  scores.innerText = `Score: ${score}`;
};

/**
 * Enable/disable start game and reset game buttons.
 */
const switchButtons = () => {
  // enable reset game button
  document.getElementById('reset-button').disabled = (isGameInProgress) ? '' : 'disabled';

  // disable start game button
  document.getElementById('start-button').disabled = (isGameInProgress) ? 'disabled' : '';
};

// store timeout variable so we can cancel when needed
let matchTimeout;
let mismatchTimeout;

/**
 * Handle card click
 * @param {*} cardElement Card
 * @param {*} column Column index of card in grid
 * @param {*} row Row index of card in grid
 */
const cardClick = (cardElement, column, row) => {
  console.log(cardElement);
  console.log('FIRST CARD DOM ELEMENT', firstCard);
  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (((cardElement.innerText !== '') && (cardElement.innerText !== '⭘△☐')) || isMatching) {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;

    // turn this card over
    revealCard(cardElement, firstCard);

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    displayMessage('Click another card 🤔 to find match.');

  // second turn
  } else {
    console.log('second turn');
    isMatching = true;

    revealCard(cardElement, clickedCard);

    if (clickedCard.name === firstCard.name
      && clickedCard.suit === firstCard.suit) {
      console.log('match');
      isMatching = false;

      if (isMatchDone()) {
        isGameInProgress = false;
        clearInterval(timer);
        updateScore();
        switchButtons();
        clearTimeout(matchTimeout);
        clearTimeout(mismatchTimeout);
        displayMessage('🎉Congratulations! You\'ve won the game.🎉');

        setTimeout(() => {
          displayMessage('Click ⬇️ start game button to start a new game.');
        }, 5000);
      } else {
        displayMessage('That is a match.😊', 'green');
        matchTimeout = setTimeout(() => {
          displayMessage('Click any card 🤔 to play.');
        }, 3000);
      }
    } else {
      console.log('NOT a match');
      displayMessage('That is not a match.😭', 'red');

      // turn this card back over, after 3 seconds
      mismatchTimeout = setTimeout(() => {
        firstCardElement.innerHTML = '';
        cardElement.innerHTML = '';
        closeCard(firstCardElement);
        closeCard(cardElement);
        displayMessage('Click any card 🤔 to play.');
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
 * Shuffle an array of cards.
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

/**
 * Set cards to be clickable or not clickable.
 * @param {*} isCardClickable True, if clickable. False, otherwise.
 */
const setCardClickable = (isCardClickable) => {
  const cards = document.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i += 1) {
    if (isCardClickable) {
      cards[i].style.setProperty('pointer-events', 'auto');
    } else {
      cards[i].style.setProperty('pointer-events', 'none');
    }
  }
};

/**
 * Format time information (m:ss).
 * @param {*} millisec Time in milliseconds
 * @returns Time information in specified format
 */
const changeTimeFormat = (millisec) => {
  let seconds = millisec / 1000;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return `${minutes}:${seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  })}`;
};

/**
 * Set time value into new time.
 * @param {*} newTime New time
 */
const setTime = (newTime) => {
  document.getElementById('timer').innerText = `Time: ${newTime}`;
};

/**
 * Reset game.
 */
const resetGame = () => {
  if (!isGameInProgress) return;

  // reset board
  board.length = 0;
  document.querySelector('.board').remove();

  // reinitialize game
  // eslint-disable-next-line
  initGame();

  // redraw score info after board reset
  updateScore(0);

  setCardClickable(true);

  switchButtons();

  // reset timer
  milliseconds = threeminutes;
  setInterval(timer);

  displayMessage('Click any card 🤔 to play.');
};

/**
 * Start game.
 */
const startGame = () => {
  isGameInProgress = true;
  resetGame();

  // start timer
  const delayInMilliseconds = 1000;

  timer = setInterval(() => {
    setTime(changeTimeFormat(milliseconds));

    if (milliseconds <= 0) {
      clearInterval(timer);
      setCardClickable(false);
      isGameInProgress = false;
      switchButtons();
      displayMessage('Sorry, you\'re out of time. ⏳');

      setTimeout(() => {
        displayMessage('Click ⬇️ start game button to start a new game.');
      }, 3000);
    }

    milliseconds -= 1000;
  }, delayInMilliseconds);
};

/**
 * Create all the board elements that will go on the screen.
 * @returns The built board
 */
const buildBoardElements = () => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // add area for state of game information
  const stateOfGameElement = document.createElement('div');
  stateOfGameElement.setAttribute('id', 'game-state');
  stateOfGameElement.classList.add('game-state');
  stateOfGameElement.innerText = 'Click ⬇️ start game button to start a new game.';
  boardElement.appendChild(stateOfGameElement);

  // add area for buttons
  const buttonsElement = document.createElement('div');
  buttonsElement.classList.add('buttons');

  // add start game button
  const startButtonElement = document.createElement('button');
  startButtonElement.innerText = 'Start Game';
  startButtonElement.setAttribute('id', 'start-button');
  startButtonElement.classList.add('button');
  startButtonElement.addEventListener('click', () => startGame());
  buttonsElement.appendChild(startButtonElement);

  // add reset game button
  const resetButtonElement = document.createElement('button');
  resetButtonElement.innerText = 'Reset Game';
  resetButtonElement.setAttribute('id', 'reset-button');
  resetButtonElement.classList.add('button');
  resetButtonElement.addEventListener('click', () => resetGame());
  resetButtonElement.disabled = 'disabled';
  buttonsElement.appendChild(resetButtonElement);

  boardElement.appendChild(buttonsElement);

  // add area for scores
  const scoresElement = document.createElement('div');
  scoresElement.setAttribute('id', 'scores');
  scoresElement.innerText = 'Score: 0';
  boardElement.appendChild(scoresElement);

  // add area for timer
  const timerElement = document.createElement('div');
  timerElement.setAttribute('id', 'timer');
  timerElement.innerText = `Time: ${changeTimeFormat(threeminutes)}`;
  boardElement.appendChild(timerElement);

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      const card = document.createElement('div');
      card.classList.add('card');

      // set the click event
      // eslint-disable-next-line
      card.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        cardClick(event.currentTarget, i, j);
      });

      closeCard(card);

      rowElement.appendChild(card);
    }

    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

/**
 * Make a new card deck.
 * @returns An array of cards
 */
const makeDeck = () => {
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

/**
 * Ask for player's name.
 */
const askName = () => {
  // TODO: replace prompt with something more elegant
  let name = prompt('What is your name?');
  if ((name === null) || (name.trim() === '')) name = 'Player';

  const nameInfoElement = document.createElement('div');
  nameInfoElement.classList.add('name');
  nameInfoElement.innerText = `Welcome to the Match Game, ${name}!`;
  document.body.appendChild(nameInfoElement);
};

/**
 * Initialize game.
 */
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

  // disable card clicks initially
  setCardClickable(false);
};

askName();
initGame();
