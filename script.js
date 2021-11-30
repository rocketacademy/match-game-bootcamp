// Please implement exercise logic here

// boardSize has to be an even number
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let boardFull = "";
let numberofWins = 0;
let username = "";
let minutes = 3;
const delayInMilliseconds = 60000;

//Timer
const timerOutput = document.createElement("div");
timerOutput.setAttribute("id", "timer-output");
document.body.appendChild(timerOutput);

//Number of wins tracker
const winTracker = document.createElement("div");
winTracker.setAttribute("id", "win-tracker");
document.body.appendChild(winTracker);

//components of the page
const description = document.createElement("div");
document.body.appendChild(description);
const results = document.createElement("div");
results.setAttribute("id", "results");
document.body.appendChild(results);

//inputfield
const inputDiv = document.createElement("div");
inputDiv.setAttribute("id", "input-field");
document.body.appendChild(inputDiv);

const inputDescr = document.createElement("p");
inputDescr.innerText = "Please input a username that you want to use";
inputDiv.appendChild(inputDescr);

const inputField = document.createElement("input");
inputField.setAttribute("type", "text");
inputDiv.appendChild(inputField);

const inputButton = document.createElement("button");
inputButton.innerHTML = "Submit";
inputDiv.appendChild(inputButton);

const resetResults = () => {
  results.innerText = "";
};

const checkForBoardFull = () => {
  let boardFull = true;
  let squares = document.getElementsByClassName("square");
  for (let i = 0; i < squares.length; i += 1) {
    let contents = squares[i].innerHTML;
    if (contents === "") {
      boardFull = false;
    }
  }
  return boardFull;
};

//Game play logic
const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row];
  // the user already clicked on this square
  if (cardElement.innerText !== "") {
    return;
  }

  // first turn
  if (firstCard === null) {
    results.innerText = "First Turn!";
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `<img src="${firstCard.pic}"/>`;
    firstCardElement = cardElement;
    // second turn
  } else {
    results.innerText = "Second Turn!";
    cardElement.innerHTML = `<img src="${clickedCard.pic}"/>`;
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      results.innerText = "Its a Match!";
      setTimeout(resetResults, 500);
    } else {
      results.innerText = "Its NOT a Match!";
      setTimeout(resetResults, 500);
      setTimeout(function () {
        // turn this card back over
        firstCardElement.innerHTML = "";
        cardElement.innerHTML = "";
      }, 500);
    }
    // reset the first card
    firstCard = null;
  }

  let check = checkForBoardFull();
  if (check === true) {
    results.innerText = "Congrats! You completed";
    numberofWins += 1;
    winTracker.innerText = `${username} number of wins: ${numberofWins}`;
    setTimeout(restartGame, 500);
  }
};

//Game intialisation
// create all the board elements that will go on the screen return the built board
const buildBoardElements = (board) => {
  const boardElement = document.createElement("div");
  boardElement.classList.add("board");
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
        // we will want to pass in the card element so that we can change how it looks on screen, i.e. "turn the card over"
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
  let doubleDeck = makeDeck();
  let sliceStart = getRandomIndex(53) * 2;
  sliceStart = sliceStart - boardSize * boardSize;
  let deckSubset = doubleDeck.slice(
    sliceStart,
    sliceStart + boardSize * boardSize
  );
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  boardEl.setAttribute("id", "board");
  document.body.appendChild(boardEl);
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      let cardName = `${rankCounter}`;

      if (cardName === "1") {
        cardName = "ace";
      } else if (cardName === "11") {
        cardName = "jack";
      } else if (cardName === "12") {
        cardName = "queen";
      } else if (cardName === "13") {
        cardName = "king";
      }

      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        pic: `./images/cards/${cardName}_of_${currentSuit}.png`,
      };

      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

const getRandomIndex = (max) => Math.floor(Math.random() * max);

const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];
    const currentCard = cards[currentIndex];
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  return cards;
};

// Give the user 3 minutes to complete the game. You can't display a countdown timer until we learn setInterval, so the user won't be able to see the time left.
const restartGame = () => {
  document.getElementById("board").remove();
  board = [];
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  boardEl.setAttribute("id", "board");
  document.body.appendChild(boardEl);

  minutes = 3;
  results.innerText = "Restarted Game";
};

inputButton.addEventListener("click", function () {
  username = inputField.value;
  winTracker.innerText = `${username} number of wins: ${numberofWins}`;
  inputDiv.remove();
  description.innerText =
    "You are given 3 minutes to finish matching the cards before the game will be automatically restarted.";

  //Reset button
  const resetButton = document.createElement("button");
  resetButton.innerText = "Reset";
  document.body.appendChild(resetButton);
  resetButton.addEventListener("click", restartGame);

  //Timer functions
  timerOutput.innerText = `Number of Minutes Left: ${minutes}`;

  const ref = setInterval(() => {
    console.log("starting....");
    timerOutput.innerText = `Number of Minutes Left: ${minutes}`;

    if (minutes == 0) {
      clearInterval(ref);
      restartGame();
    }

    minutes -= 1;
  }, delayInMilliseconds);

  initGame();
});
