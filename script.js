// Please implement exercise logic here
// ### DOM SELECTORS ###
// from modal
const modal = document.querySelector(".modal")
const modalContainer = document.querySelector(".modal-container")
const content = document.querySelector(".content")
const formPlayerName = document.querySelector("#form-player-name")
const formBoardSize = document.querySelector("#form-board-size")
const formTimeSelection = document.querySelector(
  "#form-time-selection"
)
const formSubmitBtn = document.querySelector(".form-submit")

// from main container
const container = document.getElementById("main-container")
const playerMessage = document.getElementById("game-title")
const playerWinMessage = document.getElementById("player-wins")
const playerWinRate = document.getElementById("player-win-rate")
const playerTimer = document.getElementById("player-timer")
const boardElement = document.getElementsByClassName("board-container")[0]
const outputMessage = document.getElementById("output-message")
const resetBoard = document.getElementById("reset")
const resetGame = document.getElementById("total-reset")

// ### GLOBAL VARIABLES ###
let playerName
let boardSize
let timer
let firstCard =  null
let firstCardElement = null
let deck =[]
let board = []
let canClick = true
let matchedPairs = 0
let totalPairs = 0
let winCounter = 0
let numOfGames = -1

// ### CARD FUNCTIONS ### 
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

const generateCard = (cardRank, suit) => {
  const symbols = ['♥', '♦', '♣', '♠'];
  let cardName = '';
  switch (cardRank) {
    case 1:
    cardName = 'A';
    break;
    case 11:
    cardName = 'J';
    break;
    case 12:
    cardName = 'Q';
    break;
    case 13:
    cardName = 'K';
    break;
    default:
    cardName = cardRank;
    }
            
   const card = {
      suit: symbols[suit],
      name: cardName,
      colour: suit < 2 ? 'red' : 'black',
      rank: cardRank,
    };
  return card;
};
          
// generate the deck for gameplay
const makeDeck = () => {
  const tempDeck = [];
  for (let i = 1; i <= 13; i += 1){
    for (let j = 0; j < 4; j += 1){
    // generates cards and inserts randomly to get a 52-card deck
      tempDeck.splice(getRandomIndex(tempDeck.length + 1), 0, generateCard(i, j));
    }
  }
  
  // get random cards from the tempdeck and insert 2 of it randomly into deck
  for (let k = 0; k < totalPairs; k += 1) {
    const randCard = tempDeck.pop();
    deck.splice(getRandomIndex(deck.length + 1), 0, randCard);
    deck.splice(getRandomIndex(deck.length + 1), 0, randCard);
  }
};

// ### HELPER FUNCTIONS ###
//win rate calculator
const winRate = (numberOfWins,numberOfGames) => {
  if (numberOfGames == 0) {
    return 0
  }
  else {
    return ((numberOfWins/numberOfGames)*100).toFixed(2)
  }
}

//display output message
const printMessage = message => {
  outputMessage.innerHTML = message
}

//reset game
const resetGameFunction = () => {
  if (confirm("Reset Game? Your data will be erased.")) {
    window.location = window.location;
  } else {
    alert('Game reset fail.')
  }
}

//reset board
const resetBoardFunction = () => {
  board = [];
  firstCard = null;
  firstCardElement = null;
  deck = [];
  canClick = true;
  totalPairs = 0;
  matchedPairs = 0;
}
// Check win 
const checkWin = () => {
  if (matchedPairs == totalPairs) {
    printMessage('You win!!!<br> Hit Reset Board to play again.')
  }
}
// Create the appearance of a card by adding name and suit to the existing face-down cards
const createCardUI = (card, cardElement) => {
  const suit = document.createElement('div');
  suit.classList.add('suit', card.colour);
  suit.innerText = card.suit;

  const name = document.createElement('div');
  name.classList.add('name', card.colour);
  name.innerText = card.name;

  cardElement.appendChild(name);
  cardElement.appendChild(suit);
  cardElement.classList.add('face-up');
};

const setUIEffects = (clickedCard, cardElement) => {
  const match = clickedCard.name === firstCard.name && clickedCard.suit === firstCard.suit;
  if (match) {
    matchedPairs += 1;
    let message = `It's a match!`;
    cardElement.classList.add('match');
    firstCardElement.classList.add('match');
    if (matchedPairs === totalPairs) {
      // This means user won, clear timer
      winCounter +=1
      message += '<br>You win!!!';
      clearInterval(timer);
    }
    printMessage(message);
  } else {
    cardElement.classList.add('no-match');
    firstCardElement.classList.add('no-match');
    printMessage(`No match! Try again.`);
  }

  setTimeout(() => {
    // The effects set above last for 1 sec and will be removed here
    cardElement.classList.remove('match');
    firstCardElement.classList.remove('match');
    cardElement.classList.remove('no-match');
    firstCardElement.classList.remove('no-match');

    if (matchedPairs === totalPairs) { resetBoardFunction(); }
    else if (!match) {
      cardElement.innerHTML = '';
      firstCardElement.innerHTML = '';
      cardElement.classList.remove('face-up');
      firstCardElement.classList.remove('face-up');
    }
    firstCard = null;
    canClick = true;
    printMessage(`Find the Pairs.`);
  }, 1000);
};

const cardClick = (cardElement, row, column) => {
  if (canClick) {
    const clickedCard = board[row][column];
    // the user already clicked on this card
    if (cardElement.innerHTML !== '') {
      return;
    }
    // first turn
    if (firstCard === null) {
      firstCard = clickedCard;
      // turn this card over
      createCardUI(firstCard, cardElement);
      // hold onto this for later when it may not match
      firstCardElement = cardElement;
      // second turn
    } else {
      // don't allow the user to click until the ui effects are done
      canClick = false;
      createCardUI(clickedCard, cardElement);
      setUIEffects(clickedCard, cardElement);
    }
  }
};

// Create all the board elements that will go on the screen
const buildBoardElements = () => {
  for (let i = 0; i < board.length; i += 1) {
    // make a container for a row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the cards for this row
    for (let j = 0; j < board[i].length; j += 1) {
      // create the card element
      const card = document.createElement('div');
      card.classList.add('card', 'face-down');

      card.addEventListener('click', (event) => {
        cardClick(event.currentTarget, i, j);
      });
      rowElement.appendChild(card);
    }
    boardElement.appendChild(rowElement);
  }
};

const initBoard = () => {
  numOfGames += 1
  // Assignment of variables
  playerName = formPlayerName.value
  boardSize = formBoardSize.value
  
  // Change texts based on inputs
  playerMessage.textContent=`${playerName}'s Match Game!`
  playerWinMessage.textContent =`Total Wins: ${winCounter}`
  playerWinRate.textContent = `Win Rate: ${winRate(winCounter,numOfGames)}%`

  boardElement.innerHTML =""
  boardSize = formBoardSize.value
  totalPairs = (boardSize * boardSize) / 2;
  makeDeck();
  
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  buildBoardElements(board);
};

const initTimer = () => {
  const minutes = formTimeSelection.value ;
  let seconds = minutes * 60;
  playerTimer.innerText = `${minutes}:00`;
  timer = setInterval(() => {
    seconds -= 1;
    const secondsLeft = seconds % 60;
    const minutesLeft = Math.floor(seconds / 60);

    if (secondsLeft >= 10) {
      playerTimer.innerText = `${minutesLeft}:${secondsLeft}`;
    } else {
      playerTimer.innerText = `${minutesLeft}:0${secondsLeft}`;
    }

    if (seconds <= 0) {
      clearInterval(timer);
      canClick = false;
      printMessage("Time's up! You lose.");
      setTimeout(resetBoardFunction, 1000);
    }
  }, 1000);
};


// ### INITIALISE GAME PROPER ###
const initGame = () => {
  if (formPlayerName.value.length < 1 || formPlayerName.value == " ") {
    alert('Please input your name')
  }
  else {

   // Hide modal & unhide container
  modal.classList.add("hide")
  modalContainer.classList.add("hide")
  container.classList.remove("hide")

  //Initialise Board and Timer
  initBoard()
  initTimer()
  }
}

// ### EVENT LISTENERS ###
formSubmitBtn.addEventListener("click", initGame)
resetGame.addEventListener("click",resetGameFunction)
resetBoard.addEventListener("click",() => {
  clearInterval(timer)
  resetBoardFunction()
  initTimer()
  initBoard()
})
