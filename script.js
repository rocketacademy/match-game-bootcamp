// Global Variables
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

// Timer Fucntion
const timerSetForGame = () => {
  console.log("Timer StaRTED");
  setTimeout(() => {
    console.log("Reload");
    showMsgFunc("Your time has ended. Goodbye!", "red");
  }, 5000);
  setInterval(() => {
    location.reload();
  }, 10000);
};

// Flip Card Function
const flipCard = (squareContainer, squareInner) => {
  squareContainer.classList.add("clicked");
  squareInner.classList.add("clicked");
  setTimeout(() => {
    squareContainer.classList.remove("clicked");
    squareInner.classList.remove("clicked");
  }, 1500);
};

// Match Message Fucntion
const showMsgFunc = (msg, color) => {
  // Get the root element to append message
  const root = document.getElementById("root");
  const msgDiv = document.createElement("div");
  msgDiv.style.zIndex = 100;
  msgDiv.classList.add("msg-div");

  const msgHeader = document.createElement("h3");
  msgHeader.style.color = color;
  msgHeader.innerText = msg;
  msgDiv.appendChild(msgHeader);
  document.body.insertAdjacentElement("beforebegin", msgDiv);

  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 3000);
};

// Start Game / Enter name funciton
const startButton = document.querySelector(".start-button");
startButton.addEventListener("click", (e) => {
  const nameOutput = document.querySelector(".enter-name");
  // GET PARAGRAPH TAG TO INSERT NAME && INPUT VALUE
  const paraName = document.querySelector(".player-name");
  const playerInputValue = document.getElementById("player-input").value;
  playerInputValue
    ? (paraName.innerHTML = ` Hello ${playerInputValue}!`)
    : (paraName.innerHTML = "Hello! Let's begin!");
  nameOutput.style.display = "none";
  initGame();
  timerSetForGame();
});

// RESET GAME BUTTON

const resetButton = document.querySelector(".reset-button");
const mainContainer = document.querySelector(".main-container");
resetButton.addEventListener("click", (e) => {
  mainContainer.style.display = "none";
  resetButton.style.display = "none";
  showMsgFunc("You are about to leave game!", "red");
  setTimeout(() => {
    location.reload();
  }, 4000);
});

//  ********* GAMEPLAY LOGIC *********
const squareClick = (
  squareBackName,
  squareBackSuit,
  squareInner,
  squareContainer,
  column,
  row
) => {
  // console.log("FIRST CARD ELEMENT ->>>", firstCardElement);
  // console.log("THIS IS squareBackName", squareBackName.innerText);
  // console.log("THIS IS squareBackSuit", squareBackSuit);
  // console.log("FIRST CARD DOM ELEMENT", firstCard);
  // console.log("BOARD CLICKED CARD", board[column][row]);
  // console.log("Weird boardcol", board[column][row]);
  if (firstCard === null) {
    // This equals an object of one card
    firstCard = board[column][row];
    console.log("FIRSTCARD --->> ", firstCard);
    squareBackName.innerText = firstCard.name;
    squareBackSuit.innerText = firstCard.suit;

    // hold onto this for later when it may not match
    firstCardElement = board[column][row];
    flipCard(squareContainer, squareInner);
  } else if (
    board[column][row].name === firstCard.name &&
    board[column][row].suit === firstCard.suit
  ) {
    console.log("match");
    showMsgFunc("Match! Well Done!", "green");

    // turn this card over
    squareBackName.innerText = board[column][row].name;
    squareBackSuit.innerText = board[column][row].suit;
    console.log("LINE 50 SCRIPTJS SUITS - >> ", board[column][row].suit);
    flipCard(squareContainer, squareInner);
    firstCard = null;
    firstCardElement = "";
  } else {
    console.log("NOT a match");
    firstCard = null;

    // firstCardElement.innerText = "";
    firstCardElement = "";
    flipCard(squareContainer, squareInner);
  }
};
