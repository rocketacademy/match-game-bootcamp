// Please implement exercise logic here

// ### DOM SELECTORS ###
const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modal-container");
const content = document.querySelector(".content");
const formPlayerName = document.querySelector("#form-player-name");
const formGridSize = document.querySelector("#form-grid-size");
const formTimeSelection = document.querySelector(
  "#form-time-selection"
);
const formSubmitBtn = document.querySelector(".form-submit");

// ### GLOBAL VARIABLES ###
let deck
let playerName
let gridSize
let timer
let board = []
let winCounter = 0
let numOfGames = 0

// DOM ELEMENTS


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

  // Hide modal
  modal.classList.add("hide");
  modalContainer.classList.add("hide");

  //other functionalities
  alert(playerName)
  }
}

// ### EVENT LISTENERS ###
formSubmitBtn.addEventListener("click", initGame);
