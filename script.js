// Please implement exercise logic here
// boardSize has to be an even number
let boardSize;
let board = [];
let firstCard = null;
let firstCardElement;
let timer;
let countdown;
let countdownDiv;
let boardEl;
let deck;
let output;
let lockBoard = false; // locks the board during the timeout
let timeLimit = 180; // timeLimit in seconds
let numberOfMatches = 0;
let score = 0;
let inputDiv;
let playerName;

const squareClick = (cardElement, column, row) => {
  if (!lockBoard) {
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
      cardElement.innerText = firstCard.displayName;

      // hold onto this for later when it may not match
      firstCardElement = cardElement;

      // second turn
    } else {
      console.log('second turn');
      console.log(clickedCard);
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
        changeOutput("It's a match");
        // turn this card over
        cardElement.innerText = clickedCard.displayName;
        numberOfMatches += 1;
        //check if player won
        const matchesToWin = boardSize ** 2 / 2;
        if (numberOfMatches === matchesToWin) {
          endGame();
        }
      } else {
        console.log('NOT a match');
        cardElement.innerText = clickedCard.displayName;
        changeOutput("It's not a match!");
        lockBoard = true;
        // shows card for 3 seconds if its not a match
        setTimeout(() => {
          // turn both cards back over
          firstCardElement.innerText = '';
          cardElement.innerText = '';
          lockBoard = false;
        }, 500);
      }

      // reset the first card
      firstCard = null;
    }
  }
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
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

      // checks the cardName of each card and assigns their respective displayNames
      let displayName;
      switch (cardName) {
        case 'ace':
          displayName = 'A';
          break;
        case 'jack':
          displayName = 'J';
          break;
        case 'queen':
          displayName = 'Q';
          break;
        case 'king':
          displayName = 'K';
          break;
        default:
          displayName = cardName;
          break;
      }

      // checks the suits of each card and assigns their respective emoji suit
      let suitSymbol;
      switch (currentSuit) {
        case 'diamonds':
          suitSymbol = '♦️';
          break;
        case 'clubs':
          suitSymbol = '♣️';
          break;
        case 'spades':
          suitSymbol = '♠️';
          break;
        case 'hearts':
          suitSymbol = '♥️';
          break;
        default:
          console.log('weird');
      }

      let color;
      if (currentSuit === 'diamonds' || currentSuit === 'hearts') {
        color = 'red';
      } else {
        color = 'black';
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        displayName,
        suitSymbol,
        color,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

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
        console.log(i, j, 'squareclick');
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

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

const changeOutput = (input) => {
  output.innerHTML = input;
  // setTimeout(() => {
  //   output.innerHTML = '';
  // }, 3000);
};

const formatSecondsToMinutes = (seconds) => {
  const secondsLeft = seconds % 60;
  const minutesLeft = Math.floor(seconds / 60);

  return `${minutesLeft}:${secondsLeft}`;
};

const endGame = (timeOut = false) => {
  boardEl.remove();
  if (!timeOut) {
    score += 1;
    changeOutput(
      `congratulations! you won in ${formatSecondsToMinutes(
        timeLimit
      )}. Your Score is ${score} Click Reset to play again!`
    );
  } else {
    score -= 1;
    changeOutput(
      `Sorry you've run out of time! Your score is ${score} Click Reset to play again!`
    );
  }

  // clears the previous game's timeouts
  timeLimit = 180;
  clearInterval(countdown);
  clearTimeout(timer);
  countdownDiv.remove();

  const resetButton = document.createElement('button');
  resetButton.innerHTML = 'reset';
  resetButton.addEventListener('click', () => {
    resetButton.remove();
    resetGame();
  });
  document.body.appendChild(resetButton);
};

const startGame = () => {
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

  countdownDiv = document.createElement('div');
  document.body.appendChild(countdownDiv);
  // for countdown timer
  countdown = setInterval(() => {
    timeLimit -= 1;
    countdownDiv.innerHTML = formatSecondsToMinutes(timeLimit);
  }, 1000);

  // end game when countdown ends
  console.log(timeLimit, 'timelimit');
  timer = setTimeout(() => {
    endGame(true);
  }, timeLimit * 1000);

  boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
};

const resetGame = () => {
  changeOutput(`Welcome back! your current score is :${score}`);
  board = [];
  numberOfMatches = 0;
  startGame();
};

const createInputs = () => {
  inputDiv = document.createElement('div');

  const nameInput = document.createElement('input');
  nameInput.placeholder = 'name';
  const sizeInput = document.createElement('input');
  sizeInput.placeholder = 'size of board';
  const submitButton = document.createElement('button');
  submitButton.innerHTML = 'submit';

  submitButton.addEventListener('click', () => {
    playerName = nameInput.value;
    boardSize = sizeInput.value;

    if (playerName && boardSize) {
      startGame();
      inputDiv.remove()
    }
  });

  inputDiv.appendChild(nameInput);
  inputDiv.appendChild(sizeInput);
  inputDiv.appendChild(submitButton);

  document.body.append(inputDiv);
};

const initGame = () => {
  output = document.createElement('div');
  document.body.appendChild(output);

  createInputs();
};

initGame();
