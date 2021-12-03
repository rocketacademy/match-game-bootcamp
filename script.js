import { shuffleCards, makeDeck } from "./deck.js";
// import { userName, clearUserInput } from "./user.js";

const boardSize = 2;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let min = 2,
  sec = 59;
let interval;
let gameStarted = false;
let pairs = 0;
let sucessfulPairs = (boardSize * boardSize) / 2;
let canClick = true;
const white = "#FFFFFF";
const grey = "#808080";

const formatTimer = (m, s) => {
  // format time to mm:ss
  let minStr = m.toString();
  let secStr = s.toString();
  secStr = secStr.length > 1 ? secStr : "0" + secStr;
  minStr = minStr.length > 2 ? minStr : "0" + minStr;
  return `${minStr}:${secStr}`;
};

const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row];

  if (cardElement.innerText !== "") {
    return;
  }

  if (canClick) {
    if (firstCard === null) {
      if (!gameStarted) {
        startTimer();
      }

      firstCard = clickedCard;
      cardElement.innerHTML =
        clickedCard.displayName + "<br />" + clickedCard.suitSymbol;
      cardElement.style.background = white;
      firstCardElement = cardElement;
    } else {
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        console.log("match");
        canClick = false;
        cardElement.innerHTML =
          clickedCard.displayName + "<br />" + clickedCard.suitSymbol;
        cardElement.style.background = white;
        const messageDiv = document.getElementById("message-div");
        messageDiv.innerHTML = "MATCH";

        pairs += 1;
        if (pairs === sucessfulPairs) {
          clearInterval(interval);
          messageDiv.innerHTML = "MATCHED ALL CONGRATS!";
        } else {
          setTimeout(() => {
            messageDiv.innerHTML = "";
            canClick = true;
          }, 3000);
        }
      } else {
        console.log("NOT a match");
        // show second clicked card and then flip over after 2s
        canClick = false;
        cardElement.innerHTML =
          clickedCard.displayName + "<br />" + clickedCard.suitSymbol;
        cardElement.style.background = white;
        setTimeout(() => {
          firstCardElement.innerText = "";
          cardElement.innerText = "";
          firstCardElement.style.background = grey;
          cardElement.style.background = grey;
          canClick = true;
        }, 2000);
      }

      firstCard = null;
    }
  }
};

const buildBoardElements = (board) => {
  const boardElement = document.createElement("div");
  boardElement.classList.add("board");

  for (let i = 0; i < board.length; i += 1) {
    const row = board[i];
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    for (let j = 0; j < row.length; j += 1) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.addEventListener("click", (event) => {
        squareClick(event.currentTarget, i, j);
      });
      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const startTimer = () => {
  const timerDiv = document.getElementById("timer-div");
  const messageDiv = document.getElementById("message-div");
  interval = setInterval(() => {
    timerDiv.innerHTML = `Time Left: ${formatTimer(min, sec)}`;
    sec--;
    if (sec == 0) {
      min--;
      sec = 59;
    }
    if (min < 0) {
      clearInterval(interval);
      timerDiv.innerHTML = `Time Left: ${formatTimer(0, 0)}`;
      messageDiv.innerHTML = "TIMES UP";
    }
  }, 1000);
  gameStarted = true;
};

const resetGame = () => {
  // destroy board elements in dom
  console.log("reset");
  const boardElements = document.querySelectorAll(".board");
  boardElements.forEach((e) => e.remove());
  const squares = document.querySelectorAll(".square");
  squares.forEach((e) => e.remove());

  const messageDiv = document.getElementById("message-div");
  messageDiv.remove();

  // recreate board
  board = [];
  canClick = true;
  const m = createMessageDiv();
  const b = createBoard();
  document.body.appendChild(b);
  document.body.appendChild(m);
};

const createResetBtn = () => {
  const resetBtn = document.createElement("BUTTON");
  resetBtn.id = "reset-btn";
  resetBtn.className = "resetBtn";
  resetBtn.innerHTML = "RESET";

  resetBtn.addEventListener("click", () => resetGame());

  return resetBtn;
};

const createTimerDiv = () => {
  const timerDiv = document.createElement("div");
  timerDiv.id = "timer-div";
  timerDiv.innerHTML = `Time Left: ${formatTimer(3, 0)}`;
  // document.body.appendChild(timerDiv);
  return timerDiv;
};

const createMessageDiv = () => {
  const messageDiv = document.createElement("div");
  messageDiv.id = "message-div";
  // document.body.appendChild(messageDiv);
  return messageDiv;
};

const createBoard = () => {
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  return boardEl;
};

const createTimerButtonDiv = () => {
  const top = document.createElement("div");
  top.id = "top-div";
  top.className = "topDiv";
  return top;
};

const initGame = () => {
  const topDiv = createTimerButtonDiv();

  const t = createTimerDiv();
  const r = createResetBtn();
  const m = createMessageDiv();
  const b = createBoard();

  topDiv.appendChild(t);
  topDiv.appendChild(r);

  document.body.appendChild(topDiv);
  document.body.appendChild(b);
  document.body.appendChild(m);
};

initGame();
