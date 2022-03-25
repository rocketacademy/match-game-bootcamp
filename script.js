// Please implement exercise logic here


// =====GLOBAL VARIABLES=====

const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement; 
let deck;

const delayInMilliseconds = 1000; // this is 1 second
let minutes = 2; // setting 3 minutes for the game
let seconds = 11;
let firstTurn = true;
let endOfGame = false; // to signify end of game

const timerContainer = document.createElement('div');
if (seconds >= 10 ) {
timerContainer.innerText = 'Timer: ' + minutes+ ':' + seconds;
} else {
  timerContainer.innerText = 'Timer: ' + minutes+ ':0' + seconds;
}
document.body.appendChild(timerContainer)

const messageBoard = document.createElement('div');
messageBoard.classList.add('messages');

// =====HELPER FUNCTIONS=====

const makeDeck = (cardAmount) => {
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];

    let currentSymbol;

    if (currentSuit === 'hearts') {
      currentSymbol = '♥️';
    } else if (currentSuit === 'diamonds') {
      currentSymbol = '♦️';
    } else if (currentSuit === 'clubs') {
      currentSymbol = '♣️';
    } else {
      currentSymbol = '♠️'
    }

    let currentColour;
    if (currentSuit === 'hearts' || currentSuit === 'diamonds') {
      currentColour = 'red';
    } else {
      currentColour = 'black';
    }


    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      let cardName = `${rankCounter}`;

      if (cardName === 1) {
        cardName = 'A';
      } else if (cardName === 11) {
        cardName = 'J';
      } else if (cardName === 12) {
        cardName = 'Q';
      } else if (cardName === 13) {
        cardName = 'K';
      }

      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        symbol: currentSymbol,
        colour: currentColour,
      }

      newDeck.push(card);
      newDeck.push(card); // to double the cards to the deck
    }
  }
  return newDeck;
};

// shuffle cards
const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];
    const currentCard = cards[currentIndex];

    //swap current card and random card position
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  return cards;
}

function setTimer() {
  
  const ref = setInterval(() => {
    timerContainer.innerText = 'Timer: ' + minutes+ ':' + seconds; 
    console.log('seconds: ', seconds);
    
    if (seconds >= 0 && seconds <= 9) { // to display 2 digits for seconds
      timerContainer.innerText = 'Timer: ' + minutes+ ':0' + seconds;
      if (seconds === 0 && minutes >= 1)  {
        minutes -= 1;
        seconds = 60;
     }
   }
   
    if (minutes === 0 & seconds === 0) {
      clearInterval(ref);  
      messageBoard.innerText = 'You ran out of time!'
      endOfGame = true;
    }
    seconds -= 1;

  }, delayInMilliseconds);
  
};




// =====GAME PLAY LOGIC=====

// game play logic for clicking onto square

const squareClick = (cardElement, row, column) => {

  // very first turn to start timer
  if (firstTurn) {
    setTimer();
    firstTurn = false;
  }

  if (endOfGame === false) {

    // click on first card

    const clickedCard = board[row][column];

    // if user has already clicked on the same card
    if (cardElement.innerText !== '') {
      return;
    }

    // turn over first card
    if (firstCard === null) {
    
      console.log('first turn');
    
      firstCard = clickedCard;
      // turn card over
      cardElement.classList.add('card');
      cardElement.innerText = `${firstCard.name}${firstCard.symbol}`;

      // leave card open and store it somewhere
      firstCardElement = cardElement; 
      messageBoard.innerText = "click second card";
    } else {
      // turn over second card
      console.log('second turn');
      cardElement.innerText = `${clickedCard.name}${clickedCard.symbol}`;

      // if second card matches the first card
      if (clickedCard.name === firstCard.name && clickedCard.suit === firstCard.suit) {
        console.log('match');
        messageBoard.innerText = "It's a match!";
      } else {
        console.log('NOT a match');
        messageBoard.innerText = "Not a match! Try again.";

        // if second card does not match the first card
        // turn both cards over

        setTimeout( () => {
        firstCardElement.innerText = '';
        cardElement.innerText = ''; 
        }, 1500);
      }

      // end of turn
      // reset both cards input so that squareClick can run again
      setTimeout( () => {
        messageBoard.innerText = 'click on another card';
      }, 1500);
      firstCard = null;
    }
  }
};


// =====GAME INITIALISATION LOGIC======

// creating a board of size x by x
const buildBoardElements = (board) => {


  // create a board
  const boardElement = document.createElement('div')
  boardElement.classList.add('board');

  // create each row on the board
  for (let i = 0; i < board.length; i += 1) {
    const row = board[i];
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // create each square on each row of the board
    for (let j = 0; j < board.length; j += 1) {
      const square = document.createElement('div');
      square.classList.add('square');

      // add event listener for each square
      square.addEventListener('click', (event) => {
        // turning the card over
        squareClick(event.currentTarget, i, j)
      });
      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }
  return boardElement;
}


const initGame = () => {
  
  messageBoard.innerText = "click on square to start. You have 3 mins to finish the game";
  document.body.appendChild(messageBoard);

  let doubleDeck = makeDeck()
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // set up game by putting a "card" on each square
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
}

// start the game
initGame();


