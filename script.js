/// //////////////////////////////
// Global variables
/// //////////////////////////////

let boardSize = 0; // boardSize has to be an even number
let numMatches = 0;
let board = [];
let firstCard = null;
let firstCardElement; //used to hold first clicked square. no need global variable cos only used in squareClick?
let textArea; //p element to display msgs
let matchCounter = 0; //keep track of # of matches made, once this counter reaches 8, game over msg displays
let winCounter = 0; //keep track of # of wins
let canClick = true; //toggle to prevent user from clicking on squares when both mismatched cards are shown
let timeAvail; //actual variable used for countdown
let timeSelected; //selected time to countdown
let playerName = "";
const gamePlayArea = document.createElement("div");
document.body.append(gamePlayArea);
gamePlayArea.classList.add("gamePlayArea");
const container = document.createElement("div");
gamePlayArea.append(container);

/// //////////////////////////////
// Helper functions
/// //////////////////////////////
const makeDeck = () => {
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const suitSymbols = ["♥️", "♦", "♣", "♠"];
  const suitColors = ["red", "red", "black", "black"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    const suitSymbol = suitSymbols[suitIndex];
    const suitColor = suitColors[suitIndex];

    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let shortName = `${rankCounter}`;
      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === "1") {
        cardName = "ace";
        shortName = "A";
      } else if (cardName === "11") {
        cardName = "jack";
        shortName = "J";
      } else if (cardName === "12") {
        cardName = "queen";
        shortName = "Q";
      } else if (cardName === "13") {
        cardName = "king";
        shortName = "K";
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        suitPic: suitSymbol,
        suit: currentSuit,
        name: cardName,
        displayName: shortName,
        colour: suitColor,
        rank: rankCounter,
      };

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      // newDeck.push(card);
    }
  }

  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
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

//creating a card for display with information stored in card object
const createCard = (cardInfo) => {
  const suit = document.createElement("div");
  suit.classList.add("suit", cardInfo.colour);
  suit.innerText = cardInfo.suitPic;

  const name = document.createElement("div");
  name.classList.add("name", cardInfo.colour);
  name.innerText = cardInfo.displayName;

  const card = document.createElement("div");
  card.classList.add("card");

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

// Create a helper function for output to abstract complexity
// of DOM manipulation away from game logic
const output = (message) => {
  textArea.innerHTML = message;
};

/// //////////////////////////////
// Game play logic
/// //////////////////////////////
const squareClick = (cardElement, column, row) => {
  //cardElement refers to the clicked square HTML element
  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerHTML !== "") {
    return;
  }

  // first turn
  if (firstCard === null) {
    firstCard = clickedCard;
    cardElement.append(createCard(firstCard));
    cardElement.classList.add("squareFront");

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      console.log("match");
      cardElement.append(createCard(clickedCard));
      cardElement.classList.add("squareFront");

      matchCounter += 1;

      if (matchCounter < numMatches) {
        output("<strong>Good job, you found a match! Keeping going!</strong>");
        setTimeout(() => {
          output("");
        }, 1000);
      }
    } else {
      console.log("NOT a match");
      output("<strong>No match...keep trying!</strong>");
      canClick = false; // disallow clicking when cards are being displayed
      //still mismatched card and 1 second later, turn the card over
      cardElement.append(createCard(clickedCard));
      cardElement.classList.add("squareFront");
      // cardElement.innerText = `${clickedCard.displayName} of ${clickedCard.suitPic}`;

      setTimeout(() => {
        cardElement.innerHTML = "";
        firstCardElement.innerHTML = "";
        cardElement.classList.remove("squareFront");
        firstCardElement.classList.remove("squareFront");
        canClick = true; // allow clicking after cards disapppear
        output("");
      }, 1000);
    }

    // reset the first card
    firstCard = null;
  }
  if (matchCounter === numMatches) {
    winCounter += 1;
    output(
      "<strong>Congratulations! You've completed the game! Click reset to play again! </strong>"
    );
    container.children[0].innerHTML = `<span><strong>Welcome ${playerName}! Wins: ${winCounter}</strong>  </span> `;
  }
};

/// //////////////////////////////
// Game initialisation logic
/// //////////////////////////////
// create all the board elements that will go on the screen
// return the built board
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
      square.classList.add("squareBack");

      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        if (timeAvail <= 0) {
          canClick = false;
        }
        canClick === true ? squareClick(event.currentTarget, i, j) : ""; //will only call squareClick if canClick!
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// laying out elements for game set up
(() => {
  const inputLabel = document.createElement("label");
  container.append(inputLabel);
  inputLabel.innerHTML = "<strong>Please enter your name: </strong>";
  const nameInput = document.createElement("input");
  container.append(nameInput);
  nameInput.placeholder = "John Doe";

  const sizeSelectLabel = document.createElement("label");
  container.append(sizeSelectLabel);
  sizeSelectLabel.innerHTML = "<strong>  Select board size: </strong>";
  const boardSizeSelect = document.createElement("select");
  container.append(boardSizeSelect);
  for (let i = 0; i < 4; i += 1) {
    const sizeOptions = [2, 4, 6, 8];
    const option = document.createElement("option");
    option.value = sizeOptions[i];
    option.text = sizeOptions[i];
    boardSizeSelect.append(option);
  }

  const timeSelectLabel = document.createElement("label");
  container.append(timeSelectLabel);
  timeSelectLabel.innerHTML = "<strong>  Select time limit : </strong>";
  const timeSelect = document.createElement("select");
  container.append(timeSelect);
  for (let i = 0; i < 4; i += 1) {
    const timeOptions = [20, 60, 90, 120];
    const option = document.createElement("option");
    option.value = timeOptions[i];
    option.text = `${timeOptions[i]} seconds`;
    timeSelect.append(option);
  }

  const playBtn = document.createElement("button");
  container.append(playBtn);
  playBtn.innerHTML = "Play Game!";

  // interactive part of game set up

  playBtn.addEventListener("click", () => {
    timeSelected = timeSelect.value;
    boardSize = boardSizeSelect.value;
    playerName = nameInput.value;
    gameInit();
  });
})();

//initialise game
const gameInit = () => {
  container.innerHTML = `<span><strong>Welcome ${playerName}! Wins: ${winCounter}</strong>  </span>`;
  const resetBtn = document.createElement("button");
  resetBtn.innerHTML = "Reset Game";
  container.append(resetBtn);
  resetBtn.addEventListener("click", () => {
    gamePlayArea.innerHTML = "";
    gameReInit();
  });

  const baseDeck = shuffleCards(makeDeck());
  numMatches = (boardSize * boardSize) / 2;
  const interimDeck = baseDeck.slice(0, numMatches);
  const playDeck = shuffleCards(interimDeck.concat(interimDeck));

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(playDeck.pop());
    }
  }

  const timerDisplayBox = document.createElement("div");
  gamePlayArea.append(timerDisplayBox);
  timerDisplayBox.classList.add("timerDisplayBox");

  const timerDisplay = document.createElement("span");
  timerDisplayBox.append(timerDisplay);
  timerDisplay.innerHTML = `<strong>Time left: ---</strong>`;

  timeAvail = timeSelected;

  const countdown = setInterval(() => {
    console.log(`Time avail inside setInterval: ${timeAvail}`);
    timeAvail -= 1;
    timerDisplay.innerHTML = `<strong>Time left: ${timeAvail}s</strong>`;
    if (timeAvail <= 0) {
      output("<strong>Time's up! Click reset to try again.</strong>");
      clearInterval(countdown);
    }
    if (matchCounter === numMatches) {
      clearInterval(countdown);
      timerDisplay.innerHTML = "<strong>Time left: ---</strong>";
    }
  }, 1000);

  const boardEl = buildBoardElements(board);

  gamePlayArea.appendChild(boardEl);

  textArea = document.createElement("p");
  textArea.classList.add("msg");
  gamePlayArea.append(textArea);
  output(
    "<ol> <strong> <li>Click on any one of the boxes above to reveal a card.</li><li>Select any other empty box to find a match!</li> </strong></ol> "
  );
};

const gameReInit = () => {
  board = [];
  firstCard = null;
  matchCounter = 0;
  canClick = true;
  gamePlayArea.append(container);
  gameInit();
};
