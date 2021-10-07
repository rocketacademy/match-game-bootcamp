/// //////////////////////////////
// Global variables
/// //////////////////////////////

const boardSize = 4; // boardSize has to be an even number
const board = [];
let firstCard = null;
let firstCardElement; //used to hold first clicked square. no need global variable cos only used in squareClick?
let deck;
let textArea; //p element to display msgs
let timerDisplay; //h1 element to display countdown
let matchCounter = 0; //keep track of # of matches made, once this counter reaches 8, game over msg displays
let canClick = true; //toggle to prevent user from clicking on squares when both mismatched cards are shown
let timeAvail; //time to countdown
let countdown; //countdown timer function

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
      newDeck.push(card);
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
  if (cardElement.innerText !== "") {
    return;
  }

  // first turn
  if (firstCard === null) {
    firstCard = clickedCard;
    cardElement.innerText = `${firstCard.displayName} of ${firstCard.suitPic}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      cardElement.innerText = `${firstCard.displayName} of ${firstCard.suitPic}`;
      console.log("match");
      output("<strong>Good job, you found a match! Keeping going!</strong>");
      setTimeout(() => {
        output("");
      }, 1000);

      matchCounter += 1;
    } else {
      console.log("NOT a match");
      output("<strong>No match...keep trying!</strong>");
      canClick = false; // disallow clicking when cards are being displayed
      //still mismatched card and 1 second later, turn the card over
      cardElement.innerText = `${clickedCard.displayName} of ${clickedCard.suitPic}`;

      setTimeout(() => {
        cardElement.innerText = "";
        firstCardElement.innerText = "";
        canClick = true; // allow clicking after cards disapppear
        output("");
      }, 1000);
    }

    // reset the first card
    firstCard = null;
  }
  if (matchCounter === 8) {
    setTimeout(() => {
      output(
        "<strong>Congratulations! You've completed the game! Click reset to play again! </strong>"
      );
    }, 1000);
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
      square.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        if (timeAvail <= 0) {
          canClick = false;
        }
        canClick === true ? squareClick(event.currentTarget, i, j) : "'"; //will only call squareClick if canClick!
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// IIFE so game will be initialised without having to call the function
const gameInit = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  // doubleDeck created such tt 2 similar cards are always side-by-side, so cut off a portion of doubleDeck to use first before shuffling it
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  matchCounter = 0;

  timerDisplay = document.createElement("h1");
  document.body.append(timerDisplay);
  timeAvail = 100;
  let countdown = setInterval(function () {
    timeAvail--;
    timerDisplay.innerHTML = `Time left: ${timeAvail}s`;
    if (timeAvail <= 0) {
      output("<strong>Time's up! Click reset to try again.</strong>");
      clearInterval(countdown);
    }
    if (matchCounter === 8) {
      clearInterval(countdown);
      timerDisplay.innerHTML = "Time left: 00000000";
    }
  }, 1000);

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);

  textArea = document.createElement("p");
  textArea.classList.add("msg");
  document.body.append(textArea);
  output(
    "<ol> <strong> <li>Click on any one of the boxes above to reveal a card.</li><li>Select any other empty box to find a match!</li> </strong></ol> "
  );
};

gameInit();
