// Please implement exercise logic here
// ### DOM SELECTORS ###

// from modal
const modal = document.querySelector(".modal")
const modalContainer = document.querySelector(".modal-container")
const content = document.querySelector(".content")
const formPlayerName = document.querySelector("#form-player-name")
const formGridSize = document.querySelector("#form-grid-size")
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
const outputMessage = document.getElementById("output-message")
const resetBoard = document.getElementById("reset")
const resetGame = document.getElementById("total-reset")

// ### GLOBAL VARIABLES ###
let playerName
let gridSize
let timer
let firstCard =  null
let firstCardElement = null
let deck =[]
let board = []
let canClick = true
let matchedPairs = 0
let totalPairs = 0
let winCounter = 0
let numOfGames = 0

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
  return (numberOfWins/numberOfGames)*100
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


// ### INITIALISE GAME PROPER ###
const initGame = () => {
  if (formPlayerName.value.length < 1) {
    alert('Please input your name')
  }
  else {
  // Assignment of variables
  playerName = formPlayerName.value
  gridSize = formGridSize.value
  timer = formTimeSelection.value
  
  // Change texts based on inputs
  playerMessage.textContent=`${playerName}'s Match Game!`
  playerWinMessage.textContent =`Total Wins: ${winCounter}`
  winCounter =1
  numOfGames = 1
  playerWinRate.textContent = `Win Rate: ${winRate(winCounter,numOfGames)}%`
  playerTimer.textContent = `Timer: ${timer}:00`
  // Hide modal & unhide container
  modal.classList.add("hide")
  modalContainer.classList.add("hide")
  container.classList.remove("hide")
}
}

// ### EVENT LISTENERS ###
formSubmitBtn.addEventListener("click", initGame)
resetGame.addEventListener("click",resetGameFunction)
