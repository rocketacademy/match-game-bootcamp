import { shuffleCards, makeDeck } from "./deck.js";

// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log("FIRST CARD DOM ELEMENT", firstCard);

  console.log("BOARD CLICKED CARD", board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== "") {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log("first turn");
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.displayName;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log("second turn");
    console.log("SECOND CARD Clicked", clickedCard);

    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      console.log("match");
      cardElement.innerText = clickedCard.displayName;
      const messageDiv = document.getElementById("message-block");
      messageDiv.innerHTML = "MATCH";
      setTimeout(() => (messageDiv.innerHTML = ""), 3000);
    } else {
      console.log("NOT a match");
      // show second clicked card and then flip over after 2s
      cardElement.innerText = clickedCard.displayName;
      setTimeout(() => {
        firstCardElement.innerText = "";
        cardElement.innerText = "";
      }, 2000);
    }

    // reset the first card
    firstCard = null;
  }
};

// create all the board elements that will go on the screen
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement("div");

  // give it a class for CSS purposes
  boardElement.classList.add("board");

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement("div");

      // set a class for CSS purposes
      square.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
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

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards

  // TODO: deck subset doesnt guarantee matching pairs
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize); // 16 cards
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);

  const messageDiv = document.createElement("div");
  messageDiv.id = "message-block";
  document.body.appendChild(messageDiv);
};

initGame();
