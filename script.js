// Card Match Game V4

/* The user turns cards over one at a time to find
the matching pair of two identical cards. */

// Global Variables
let deck;
const board = [];
const boardSize = 4; // Has to be an even number.
let firstCard = null; // Will be assigned a Card object.
let firstCardElement = null; // Will be assigned a <div> tag element representing card.
let secondCard = null;

// Included for V3
let playerPoints = 0;
const MAX_POINTS = (boardSize * boardSize) / 2;
const MATCHING_MESSAGE = ' 🎉  GREAT YOU FOUND MATCHING CARDS!  🎉 ';
const WINNING_MESSAGE = 'WINNER! YOU MATCHED EVERYTHING!! 🎖';

// Included for V4
let canClick = true;
const START_MESSAGE = 'YOU HAVE 1 MIN TO FIND ALL PAIRS!⏱';
const ENTER_NAME_MESSAGE = 'TIME STARTS AFTER NAME IS KEYED IN..';

const outputMatchMsg = (message, cssClass) => {
  const outputDiv = document.createElement('div');
  outputDiv.classList.add(cssClass);
  outputDiv.innerHTML = message;

  return outputDiv;
};

const buttonElement = () => {
  const button = document.createElement('button');
  button.innerHTML = 'PLAY AGAIN?';
  button.classList.add('reset-button');
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    window.location.reload(true);
  });

  return button;
};

// Callback function that will be attached to each Square of the Board.
const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row]; // This is a Card object.

  if (canClick === false) {
    return;
  }

  // Set firstCard as the clickedCard (this resets every 2 clicks).
  if (firstCard === null) {
    firstCard = clickedCard;
    firstCardElement = cardElement;
    // Turn card over.
    cardElement.innerText = firstCard.name; // Example of cardElement: <div class="square">5</div>
    console.log('First Card: ', firstCard);
  // Set secondCard as the clickedCard
  } else {
    secondCard = clickedCard;
    if (secondCard.name === firstCard.name) {
      playerPoints += 1;
      console.log('MATCHED');

      // Reveal second card (assign secondCard's name to event.target)
      cardElement.innerText = secondCard.name;

      // Change the colors permantly when guessed correctly.
      firstCardElement.className = 'cards-match';
      cardElement.className = 'cards-match';

      // Output MATCH message.
      if (playerPoints !== MAX_POINTS) {
        const output = outputMatchMsg(MATCHING_MESSAGE, 'match-msg');
        document.body.appendChild(output);

        setTimeout(() => {
          output.innerText = '';
        }, 3000);
      } else if (playerPoints === MAX_POINTS) {
        // Output winning message when last click of game happens
        const output = outputMatchMsg(WINNING_MESSAGE, 'win-msg');
        document.body.appendChild(output);
        setTimeout(() => {
          output.innerText = '';
        }, 5000);

        // Include Reset Button
        setTimeout(() => {
          buttonElement();
        }, 5010);
      }
    } else {
      console.log('NOT MATCHED');
      // Reveal second card
      cardElement.innerText = secondCard.name;
      // Disallow player to click before turning cards face down;
      canClick = false;
      // Since cards don't match, proceed to turn them face down after 2 sec.
      setTimeout(() => {
        cardElement.innerText = '';
        firstCardElement.innerText = '';
        canClick = true;
      }, 2000);
    }
    // Reset firstCard to null; this enters squareClick()'s first condition
    firstCard = null;
  }
};

// Create all board elements (with CSS) that will go on the screen (this is called in initGame())
const buildBoardElements = (populatedBoard) => {
  // Create <div> element where everything will be stored
  const boardElement = document.createElement('div');
  boardElement.classList.add('board');

  // Use board data structure we passed in to create correct size board
  for (let i = 0; i < populatedBoard.length; i += 1) {
    // Create a row of cards
    const row = populatedBoard[i];

    // Create a <div> element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // Make all the squares for each row
    for (let j = 0; j < row.length; j += 1) {
      // Create square element
      const squareCard = document.createElement('div');
      squareCard.classList.add('square');

      // Add click event to every squareCard element.
      squareCard.addEventListener('click', (event) => {
        // Whatever card selected, apply squareClick() function to it.
        const cardElement = event.currentTarget; // Example output: <div class="square">5</div>
        if (event.detail === 1) {
          squareClick(cardElement, i, j);
        } else {
          console.log('Double-clicked.');
        }
      });
      // Render each squareCard element to the DOM.
      rowElement.appendChild(squareCard);
    }
    // Render whole board along with each row to DOM.
    boardElement.appendChild(rowElement);
  }
  return boardElement;
};

const getRandomIndex = (arraySize) => Math.floor(Math.random() * arraySize);

const shuffleCards = (cards) => {
  // Loop over all the cards
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random position in the deck
    const randomIndex = getRandomIndex(cards.length);

    // Create variable for random & current card
    const currentItem = cards[currentIndex];
    const randomItem = cards[randomIndex];

    // Swap current card with random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;
  }
  // Return the shuffled deck of cards
  return cards;
};

// Produce an array of 104x Card objects for Match Game.
const makeDeck = () => {
  // Create deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit (rank 1-13)
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

      // Make a single Card object variable.
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the same card 2x to the deck.
      newDeck.push(card);
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Initialise Game
const initGame = () => {
  const gameInfo = document.createElement('div');
  gameInfo.classList.add('game-info');
  document.body.appendChild(gameInfo);

  const playerInfo = document.createElement('p');
  playerInfo.classList.add('player-info');

  const startMsg = outputMatchMsg(START_MESSAGE, 'start-msg');
  const enterName = outputMatchMsg(ENTER_NAME_MESSAGE, 'start-msg');

  // Create input & button
  const inputElement = document.createElement('input');
  inputElement.id = 'input-name';
  const submitButton = document.createElement('button');
  submitButton.id = 'submit-button';
  submitButton.innerText = 'SUBMIT';

  // Add eventListener to submit button to get name
  submitButton.addEventListener('click', () => {
    const name = document.getElementById('input-name').value;
    gameInfo.innerHTML = `WELCOME ${name}! `;
  });

  let counter = 0;
  const delay = 4000;
  const startRef = setInterval(() => {
    if (counter === 0) {
      gameInfo.appendChild(startMsg);
    }

    counter += 1;

    if (counter === 3) {
      startMsg.remove();
      gameInfo.appendChild(enterName);
    }

    if (counter > 5) {
      enterName.remove();
      gameInfo.appendChild(inputElement);
      gameInfo.appendChild(submitButton);
      clearInterval(startRef);
    }
  }, delay);

  // Create a 104-card deck (2x decks combined, i.e. 52 + 52).
  const doubleDeck = makeDeck();

  // Extract a subset of cards according to the boardSize (squared).
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);

  // Shuffle this extracted subset of cards (containing duplicates).
  deck = shuffleCards(deckSubset);

  // Deal cards out to the Board data structure.
  for (let i = 0; i < boardSize; i += 1) {
    // Create 4x empty arrays for card Object to be stored.
    board.push([]);
    // For each empty array (ROW), push 4x Card objects to each ROW.
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  // Render the 4x4 grid of cards populated in the double for-loop to the DOM.
  const boardEle = buildBoardElements(board);
  document.body.appendChild(boardEle);
};

initGame();
