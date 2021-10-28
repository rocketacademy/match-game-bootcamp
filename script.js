// Please implement exercise logic here
/*
** GLOBALS
**
*/
// boardSize has to be an even number
const boardSize = 4;
const GAMEBOARD = [];
let username = '';
let firstCard = null;
let firstCardElement;
let deck;
// Boolean handler for timeout to prevent subsequent clicks
// while showing both unmatched cards
let canClick = true;
// Time to complete the game (in seconds)
const timeToCompleteGame = 180;
let timer = timeToCompleteGame;
const secondsInMinute = 60;
let minutes;
let seconds;
// initialize timeout and interval variables
let displayMatchMessageTimeout;
let timerInterval;
// Other timers (in milliseconds)
const matchMessageDisplayMs = 3000;
const flipUnmatchedCardsMs = matchMessageDisplayMs;
// Number of wins
let wins = 0;

/**
 * HELPER FUNCTIONS
 * Helper functions for game logic
 */
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

// set minutes and seconds in mm:ss format
const setMinutesAndSeconds = () => {
  minutes = Math.floor(timer / secondsInMinute);
  if (minutes.toString().length < 2) {
    minutes = `0${minutes}`;
  }
  seconds = timer % secondsInMinute;
  if (seconds.toString().length < 2) {
    seconds = `0${seconds}`;
  }
};

/*
** NAMED TIMEOUT FUNCTIONS AND HELPERS
**
*/

const hideMatchMessages = () => {
  const matchMessageInstances = document.querySelectorAll('.matchMessage');

  for (let i = 0; i < matchMessageInstances.length; i += 1) {
    matchMessageInstances[i].remove();
  }
};

const showMatchMessage = (card1, card2, success) => {
  const matchMessageParagraph = document.createElement('p');
  matchMessageParagraph.className += 'matchMessage match-message';
  if (success) {
    matchMessageParagraph.innerText = `${username}, you have matched a pair of ${card1.name} of ${card1.suit}!`;
  } else {
    matchMessageParagraph.innerText = `${username}, you have opened a ${card1.name} of ${card1.suit}, and a ${card2.name} of ${card2.suit}. It's not a match! Please wait ${flipUnmatchedCardsMs / 1000} seconds for the unmatched cards to close before opening new cards.`;
  }

  document.body.appendChild(matchMessageParagraph);
};

const handleMatchMessage = (card1, card2, success) => {
  clearTimeout(displayMatchMessageTimeout);
  hideMatchMessages();
  showMatchMessage(card1, card2, success);
  displayMatchMessageTimeout = setTimeout(() => {
    hideMatchMessages();
  }, matchMessageDisplayMs);
};

/*
** GAMEPLAY LOGIC
**
*/
const addResetGameLink = (el) => {
  const resetGameLink = document.createElement('a');
  resetGameLink.classList.add('resetGameLink');
  resetGameLink.href = '#';
  resetGameLink.innerText = 'Reset Game?';
  // eslint-disable-next-line no-use-before-define
  resetGameLink.addEventListener('click', resetGame);
  el.appendChild(resetGameLink);
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', GAMEBOARD[column][row]);

  const clickedCard = GAMEBOARD[column][row];

  // the user already clicked on this square
  // or canClick is false (timeout for closing cards not up)
  if (cardElement.innerHTML !== '' || !canClick) {
    return;
  }

  // first turn
  if (firstCard === null && canClick) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `<div>${firstCard.displayName}</div><div>${firstCard.suitSymbol}</div>`;
    if (firstCard.suit === 'hearts' || firstCard.suit === 'diamonds') {
      cardElement.innerHTML = `<div class="red">${firstCard.displayName}</div><div class="red">${firstCard.suitSymbol}</div>`;
    }

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    const nextClickHintParagraph = document.createElement('p');
    nextClickHintParagraph.classList.add('nextClickHintParagraph');
    nextClickHintParagraph.innerText = 'Please click on another card to see if it matches!';
    document.body.appendChild(nextClickHintParagraph);

    // second turn
  } else {
    console.log('second turn');
    const nextClickHintParagraph = document.querySelector('.nextClickHintParagraph');
    nextClickHintParagraph.remove();
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      handleMatchMessage(firstCard, clickedCard, true);

      // turn this card over
      cardElement.innerHTML = `<div>${clickedCard.displayName}</div><div>${clickedCard.suitSymbol}</div>`;
      if (clickedCard.suit === 'diamonds' || clickedCard.suit === 'hearts') {
        cardElement.innerHTML = `<div class="red">${clickedCard.displayName}</div><div class="red">${clickedCard.suitSymbol}</div>`;
      }

      // remove 'unmatched' classname from cards
      firstCardElement.classList.remove('unmatched');
      cardElement.classList.remove('unmatched');

      // win condition met if no unmatched cards left
      if (document.querySelectorAll('.unmatched').length === 0) {
        clearInterval(timerInterval);
        wins += 1;
        const timerParagraph = document.querySelector('.timerParagraph');
        timerParagraph.innerText = `${username}, you have matched all of the cards! You have won the round! You have now won ${wins} round(s). `;
        canClick = false;
        addResetGameLink(timerParagraph);
      }
    } else {
      console.log('NOT a match');
      // prevent user from clicking additional cards
      // while both unmatched cards are showing
      canClick = false;
      cardElement.innerHTML = `<div>${clickedCard.displayName}</div><div>${clickedCard.suitSymbol}</div>`;
      if (clickedCard.suit === 'diamonds' || clickedCard.suit === 'hearts') {
        cardElement.innerHTML = `<div class="red">${clickedCard.displayName}</div><div class="red">${clickedCard.suitSymbol}</div>`;
      }

      handleMatchMessage(firstCard, clickedCard, false);

      setTimeout(() => {
        // turn both cards back over
        firstCardElement.innerHTML = '';
        cardElement.innerHTML = '';
        // set canClick back to true
        if (timer > 0) {
          canClick = true;
        }
      }, flipUnmatchedCardsMs);
    }

    // reset the first card
    firstCard = null;
  }
};

/*
** BUILD BOARD ELEMENTS
**
*/
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
      // CX: also set a class 'unmatched' for win condition checking
      square.classList.add('unmatched');

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

/*
** MAKE NEW DECK
** Double of each card is added to the deck
*/
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);
    // CX: Setting of suit symbol as well as card colors
    let suitSymbol = '';
    let colour = '';

    switch (currentSuit) {
      case 'hearts':
        suitSymbol = '♥';
        colour = 'red';
        break;
      case 'diamonds':
        suitSymbol = '♦️';
        colour = 'red';
        break;
      case 'clubs':
        suitSymbol = '♣';
        colour = 'black';
        break;
      case 'spades':
      default:
        suitSymbol = '♠';
        colour = 'black';
        break;
    }

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      // CX: Setting of display name
      let displayName = cardName;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        displayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        displayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        displayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        displayName = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol,
        displayName,
        colour,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

/*
** GAME INITIALISATION LOGIC
**
*/

const initTimer = (timerEl) => {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timer <= 0) {
      timerEl.innerText = `${username}, time is up! `;
      canClick = false;
      addResetGameLink(timerEl);
      clearInterval(timerInterval);
    } else {
      timer -= 1;
      setMinutesAndSeconds();
      timerEl.innerHTML = `${username}, you have won ${wins} round(s) so far.<br/>You have ${minutes}:${seconds} remaining for this round!`;
    }
  }, 1000);
};

const initGame = () => {
  // remove name and buttons and feedback from username setting state
  const nameInput = document.querySelector('.nameInput');
  if (nameInput) {
    nameInput.remove();
  }
  const nameButton = document.querySelector('.nameButton');
  if (nameButton) {
    nameButton.remove();
  }
  const nameFeedback = document.querySelector('.nameFeedback');
  if (nameFeedback) {
    nameFeedback.remove();
  }

  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    GAMEBOARD.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      GAMEBOARD[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(GAMEBOARD);

  document.body.appendChild(boardEl);

  const timerParagraph = document.createElement('p');
  timerParagraph.classList.add('timerParagraph');
  setMinutesAndSeconds();
  timerParagraph.innerHTML = `${username}, you have won ${wins} round(s) so far.<br/>You have ${minutes}:${seconds} remaining for this round!`;
  document.body.insertBefore(timerParagraph, boardEl);
  initTimer(timerParagraph);
};

const resetGame = (event) => {
  event.preventDefault();
  // reset canClick
  canClick = true;
  // reset timer
  timer = timeToCompleteGame;
  setMinutesAndSeconds();
  // empty GAMEBOARD
  GAMEBOARD.splice(0, GAMEBOARD.length);
  // remove all elements on the page
  const allPara = document.querySelectorAll('p');
  for (let i = 0; i < allPara.length; i += 1) {
    allPara[i].remove();
  }
  const currentBoard = document.querySelector('.board');
  currentBoard.remove();
  initGame();
};

const initUserState = () => {
  const input = document.createElement('input');
  input.classList.add('nameInput');
  input.placeholder = 'Please enter a name';
  document.body.appendChild(input);

  const button = document.createElement('button');
  button.classList.add('nameButton');
  button.innerText = 'Submit';
  button.addEventListener('click', () => {
    const nameInput = document.querySelector('.nameInput');
    if (nameInput.value.trim() !== '') {
      username = nameInput.value.trim();
      initGame();
    } else {
      const prevNameFeedback = document.querySelector('.nameFeedback');
      if (!prevNameFeedback) {
        const nameFeedback = document.createElement('p');
        nameFeedback.classList.add('nameFeedback');
        nameFeedback.innerText = 'Please enter a valid name!';
        document.body.appendChild(nameFeedback);
      }
    }
  });
  document.body.appendChild(button);
};

initUserState();
