/*===============================================================
=====================GLOBAL FUNCTIONS---=========================
=================================================================*/
// boardSize has to be an even number
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
const gameInfo = document.createElement("div");
canClick = true; //determines if player functions can work or not. true means can click. false means cannot click
let matchedCards = 0;
let boardEl;
let timeSecond;
let doubleDeck;
let deckSubset;
let cardElement;
let countDown;

//message output
const output = (message) => {
  gameInfo.innerText = message;
};

/*===============================================================
=====================BUTTONS=====================================
=================================================================*/

//Textbox for inputing name and reset button.
const textBox = document.createElement("div");
const innerBox = document.createElement("input");
innerBox.placeholder = `Please input name!`;
textBox.appendChild(innerBox);
const submitButton = document.createElement("button");
submitButton.innerText = "submit";
textBox.appendChild(submitButton);
const resetButton = document.createElement("button");
resetButton.innerText = `Reset Button`;

/*===============================================================
=====================HELPER FUNCTION----=========================
=================================================================*/
//Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === "1") {
        cardName = "A";
      } else if (cardName === "11") {
        cardName = "J";
      } else if (cardName === "12") {
        cardName = "Q";
      } else if (cardName === "13") {
        cardName = "K";
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

//function for players to input name. Also initialises the countdown and generation of the board once user click on the name submit button
const inputName = () => {
  playerName = innerBox.value;
  textBox.innerHTML = `Welcome to a Match Game, ${playerName}!<br>Please click on any of the titles to begin the match game!<br>You have 3 minutes to complete the game!`;
  document.body.appendChild(resetButton);
  document.body.appendChild(boardEl);

  //function to create a countdown timer
  const timeH = document.querySelector("h2");
  //determins how long, in this case 180 seconds = 3 minutes
  timeSecond = 180;

  countDown = setInterval(() => {
    timeSecond--;
    displayTime(timeSecond);
    if (timeSecond <= 0 || timeSecond < 1) clearInterval(countDown);
  }, 1000);

  function displayTime(second) {
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    timeH.innerHTML = `${min < 10 ? "0" : ""}${min}:${
      sec < 10 ? "0" : ""
    }${sec} `;

    //if function to display a loss message when player fails to complete the game in 3 minutes. canClick set to falst so player cannot click on any of the tiles.
    if (timeSecond === 0) {
      canClick = false;
      document.body.appendChild(gameInfo);
      output(`Times up! Please Click reset to start a new game!`);
    }
  }
  displayTime(timeSecond);
};
submitButton.addEventListener("click", inputName);

//click
const squareClick = (cardElement, row, column) => {
  console.log(cardElement);

  console.log("FIRST CARD DOM ELEMENT", firstCard);

  console.log("BOARD CLICKED CARD", board[row][column]);

  const clickedCard = board[row][column];

  if (canClick === false) {
    return;
  }

  // the user already clicked on this square
  if (cardElement.innerText !== "") {
    return;
  }
  document.body.appendChild(gameInfo);
  // first turn
  if (firstCard === null) {
    console.log("first turn");
    firstCard = clickedCard;
    // turn this card over showing front
    cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // second turn
  } else {
    console.log("second turn");
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      console.log("match");
      output(`Its a match! On to the next set!`);
      // turn this second card over showing front
      cardElement.innerText = clickedCard.name;
      matchedCards += 2;
    } else {
      console.log("NOT a match");
      canClick = false;
      cardElement.innerText = clickedCard.name;
      //if tiles are not a match player waits 3 seconds before being being able to click on a tile.
      setTimeout(() => {
        //turn the first card over showing back
        firstCardElement.innerText = "";
        //turn the second card over showing back
        cardElement.innerText = "";
        canClick = true;
      }, 3000);
      output(`Oh no! that was not a match please try again!`);
      setTimeout(() => {
        output(``);
      }, 3000);
    }
    // reset the first card
    firstCard = null;
  }
  //if function to determine win state once player mathes all tiles. As there is 16 tiles, if player score 16th points matching the number of tiles, player wins
  if (matchedCards === boardSize * boardSize) {
    output(`YOU ARE A MEMORY CHAMPION!`);
    clearInterval(countDown);
    setTimeout(() => {
      output(``);
    }, 5000);
  }
};

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

/*===============================================================
=====================GAME INITIALISATION=========================
=================================================================*/
const initGame = () => {
  doubleDeck = makeDeck();
  deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  boardEl = buildBoardElements(board);
  document.body.appendChild(textBox);
};

/*===============================================================
=====================RESET FUNCTION==============================
=================================================================*/
const resetEvent = () => {
  //clears the 3 minute timer upon reset bring clicked
  clearInterval(countDown);
  firstCard = null;
  //Gather all the tiles (clicked and unclicked) and resets all.
  const squares = document.getElementsByClassName("square");
  for (let j = 0; j < squares.length; j += 1) {
    squares[j].innerText = "";
  }
  //empty the board
  board = [];

  //rebuild a new board upon reset
  doubleDeck = makeDeck();
  deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  boardEl = buildBoardElements(board);
  //clicking enabled upon reset
  canClick = true;

  //same timer countdown function replicated from earlier code. As ClearInterval is initiated at the top line 280 clearing the time, the code below will reset the time to 3 minuites as per line 306.
  const timeH = document.querySelector("h2");
  timeSecond = 180;

  countDown = setInterval(() => {
    timeSecond--;
    displayTime(timeSecond);
    if (timeSecond <= 0 || timeSecond < 1) clearInterval(countDown);
  }, 1000);

  function displayTime(second) {
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    timeH.innerHTML = `${min < 10 ? "0" : ""}${min}:${
      sec < 10 ? "0" : ""
    }${sec} `;
    if (timeSecond === 0) {
      canClick = false;
      document.body.appendChild(gameInfo);
      output(`Times up! Please Click reset to start a new game!`);
    }
  }
  displayTime(timeSecond);
};

resetButton.addEventListener("click", resetEvent);

initGame();
//CHNAGES 2.0
