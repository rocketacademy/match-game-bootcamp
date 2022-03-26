// Please implement exercise logic here


// =====GLOBAL VARIABLES=====

const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let secondCard = null;
let secondCardElement; 
let deck;
let boardEl;
let winCount = 0;
let matchedSets = 0;
let winMessageTimer = 0;

const delayInMilliseconds = 1000; // this is 1 second
let minutes = 1; // setting 3 minutes for the game
let seconds = 0;
let firstTurn = true;
let endOfGame = false; // to signify end of game

const timerContainer = document.createElement('div');

const messageBoard = document.createElement('div');
messageBoard.classList.add('messages');

const inputName = document.createElement('input');
document.body.appendChild(inputName);
const submitButton = document.createElement('button');
submitButton.innerText = 'Submit';
document.body.appendChild(submitButton);

const resetButton = document.createElement('button');
resetButton.innerText = "Reset";
document.body.appendChild(resetButton);

const winCounter = document.createElement('div');

// setting up message to input player name
messageBoard.innerText = "Please input your name.";
document.body.appendChild(messageBoard);


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
    //console.log('seconds: ', seconds);
    
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
      seconds += 1 // to make sure that seconds remain at 0 when game ends
      
      setTimeout( () => {
        resetGame();
     },5000);
  }

    if (matchedSets === boardSize * boardSize / 2) {
      clearInterval(ref);  
      //messageBoard.innerText = 'Congratulations, you won! Click reset to play again!'
      endOfGame = true;
      seconds += 1 // to make sure that seconds remain at 0 when game ends

      const ref2 = setInterval( () => {
        messageBoard.innerText = 'Congratulations, You won!' 
        winMessageTimer += 1;
        console.log('winMessageTimer: ', winMessageTimer);

        if(winMessageTimer >= 5) {
          clearInterval(ref2);
          //messageBoard.innerText = 'Click on reset button to play again'
          resetGame();
      }
    }, 1000);
  }

    seconds -= 1;

  }, delayInMilliseconds);
  
};

// reset game
const resetGame = () => {
  board = [];
  firstCard = null;
  firstCardElement = "";
  secondCard = null;
  secondCardElement = "";
  deck = "";
  matchedSets = 0;
  winMessageTimer = 0;
  
  minutes = 1;
  seconds = 0;
  firstTurn = true;
  endOfGame = false;

  boardEl.innerText = "";
  initGame();

}



// =====GAME PLAY LOGIC=====

// game play logic for clicking onto square

const squareClick = (cardElement, row, column) => {

  // very first turn to start timer
  if (firstTurn) {
    setTimer();
    firstTurn = false;
  }

  // if timer has not run out
  if (endOfGame === false) {

    // click on first card

    const clickedCard = board[row][column];
    //console.log('clickedCard', clickedCard);

    // if user has already clicked on the same card
    if (cardElement.innerText !== '') {
      return;
    }

    // turn over first card
    if (firstCard === null && secondCard === null) {
    
      console.log('first turn');
    
      firstCard = clickedCard;
      // turn card over
      cardElement.classList.add('card');
      cardElement.innerText = `${firstCard.name}${firstCard.symbol}`;

      // leave card open and store it somewhere
      firstCardElement = cardElement; 
      messageBoard.innerText = "click second card";

    } else if (firstCard !== null && secondCard === null) {
      
      console.log('second turn');
      secondCard = clickedCard;
      // turn over second card
      cardElement.classList.add('card')
      cardElement.innerText = `${clickedCard.name}${clickedCard.symbol}`;
      secondCardElement = cardElement;

      // if second card matches the first card
      if (secondCard.name === firstCard.name && secondCard.suit === firstCard.suit) {
        console.log('match');
        messageBoard.innerText = "It's a match!";
        matchedSets += 1;

        // when this is the last set of cards to match, player wins
        if (matchedSets === boardSize * boardSize / 2) {
          winCount += 1;
          winCounter.innerText = 'Win Count: ' + winCount;
    
        }

      } else {
        console.log('NOT a match');
        messageBoard.innerText = "Not a match! Try again.";


        // if second card does not match the first card
        // turn both cards over
        //console.log('first and second card', firstCard, secondCard);
        setTimeout( () => {
        firstCardElement.innerText = '';
        secondCardElement.innerText = ''; 
        cardElement.innerText = '';
        }, 1500);
      }
      //twoCardsDrawn = true;
      // end of turn
      // reset both cards input so that squareClick can run again
      // this only happens if all cards have not been matched

      if (matchedSets !== boardSize * boardSize / 2) {
        setTimeout( () => {
          if (seconds !== 0 && minutes !== 0) {
            messageBoard.innerText = 'click on another card';
          }
          firstCard = null
          secondCard = null;
        }, 1500);
    }
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
  


  submitButton.addEventListener('click', () => {
  messageBoard.innerText = "Hello " + inputName.value + "! Click on square to start. You have 3 minutes to finish the game."
})

  // setting up timer display before timer starts
  if (seconds >= 10 ) {
  timerContainer.innerText = 'Timer: ' + minutes+ ':' + seconds;
  } else {
    timerContainer.innerText = 'Timer: ' + minutes+ ':0' + seconds;
  }
  document.body.appendChild(timerContainer);

  // setting up reset button
  resetButton.addEventListener('click', () => resetGame());

  // setting up win counter display
  winCounter.innerText = 'Win Count: ' + winCount;
  document.body.appendChild(winCounter);

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
  boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
}

// start the game
initGame();