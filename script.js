/* ##############
## GLOBAL VARIABLES ##
############## */
// boardSize has to be an even number
const boardSize = 4;
let board = [];
let boardEl;
let boardElement;
const gameInfo = document.createElement("div");
let firstCard = null;
let firstCardElement;
let cardElement;
let deck;
let square;
let squareDeco;
let overlay;
let userName;
let gridContainer;
let scoreElement;
let buttonWrapper;
let goStart;
let goReset;
let timeRemaining;
let minute = 3;
let sec = 0;
let score = 0;
let lockBoard = true; // use flag to not let user click while waiting for timeout and start game
let handle;

/* ##############
## HELPER FUNCTION ##
############## */
const makeDeck = () => {
  let newDeck = [];

  // Initialise an array of the 4 suit in our deck. We will loop over this array.
  const suit = [
    { suitsShape: "hearts", suitsSymbol: "♥️", suitsColour: "red" },
    { suitsShape: "diamond", suitsSymbol: "♦️", suitsColour: "red" },
    { suitsShape: "clubs", suitsSymbol: "♣️", suitsColour: "black" },
    { suitsShape: "spades", suitsSymbol: "♠️", suitsColour: "black" },
  ];

  // Loop over the suit array
  for (let value of suit) {
    // Store the current suit in a variable
    let currentSuit = value.suitsShape;
    let currentSymbol = value.suitsSymbol;
    let currentColour = value.suitsColour;

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter++) {
      // By default, the card name is the same as rankCounter
      let cardName = rankCounter;
      let displayName = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name, set cardValue to 10 (for jack, queen, king) or 11 (for ace)
      if (rankCounter == 1) {
        cardName = "ace";
        displayName = "A";
      } else if (rankCounter == 11) {
        cardName = "jack";
        displayName = "J";
      } else if (rankCounter == 12) {
        cardName = "queen";
        displayName = "Q";
      } else if (rankCounter == 13) {
        cardName = "king";
        displayName = "K";
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        suitSymbol: currentSymbol,
        suit: currentSuit,
        name: cardName,
        display: displayName,
        colour: currentColour,
        rank: rankCounter,
      };

      // Add the new card to the deck
      newDeck.push(card);
      newDeck.push(card);
    }
  }
  // Return the completed card deck
  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
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

//for cardBack design and flip if not matched
const cardBackDeco = () => {
  squareDeco = document.createElement("img");
  squareDeco.classList.add("card-deco");
  squareDeco.src = "assets/images/xmas.svg";
};

//for game info text
const output = (message) => {
  gameInfo.innerText = message;
};

// for timer text
const timeOutput = () => {
  timeRemaining.innerHTML = `Time \n
  ${minute}:${sec.toString().padStart(2, "0")}`;
};

const scoreOutput = () => {
  scoreElement.innerText = `Score ${score}`;
};

//timer & reset function
const countDown = () => {
  handle = setInterval(function () {
    timeOutput();
    if (minute !== 0 && sec === 0) {
      minute--;
      sec = 60;
    }
    sec--;
    //stop timer if time is out
    if (minute === 0 && sec < 0) {
      gameInfo.innerText = "Game over!";
      console.log("game is over");
      lockBoard = true;
      clearInterval(handle);
      setTimeout(gameReset, 3000);
    }
  }, 1000);
};

// function for game reset, score is kept
const gameReset = () => {
  //resetTimer
  clearInterval(handle);
  minute = 3;
  sec = 0;
  timeOutput();
  //reset start
  goStart.disabled = false;
  goStart.innerText = "Start again";
  lockBoard = true;
  board = [];
  /*reset matched card
  let elems = document.getElementsByClassName("matched");
  while (elems.length > 0) {
  elems[0].classList.remove("matched");
  }*/
  boardElement.remove();
  //init game again
  initGame();
};

/* ##############
## GAME PLAY LOGIC ##
############## */

const squareClick = (cardElement, column, row) => {
  if (lockBoard) return; // check flag

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
    output("Find another card to match");
    console.log("first turn");
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = `${firstCard.name} \n\ ${firstCard.suitSymbol}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
  } // second turn
  else {
    lockBoard = true;
    console.log("second turn");
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      //show message for 1 second
      firstCardElement.classList.add("matched");
      cardElement.classList.add("matched");
      output("Matched!");
      setTimeout(() => {
        //if user finish before time is out
        if (
          document.getElementsByClassName("matched").length ===
          boardSize * boardSize
        ) {
          output("You won!");
          score += 1;
          scoreOutput();
          clearInterval(handle);
          setTimeout(gameReset, 5000);
        } else {
          output("Find cards to match");
          lockBoard = false;
        }
      }, 1000);

      // turn this card over
      cardElement.innerText = `${clickedCard.name} \n\ ${clickedCard.suitSymbol}`;
    } else {
      //show message for 1 seconds
      output("Not a match");
      setTimeout(() => {
        output("Find cards to match");
        lockBoard = false;
      }, 1000);

      // turn this card over for 1 seconds
      cardElement.innerText = `${clickedCard.name} \n\ ${clickedCard.suitSymbol}`;
      setTimeout(() => {
        // turn this card back over with card back deco
        firstCardElement.innerText = "";
        cardBackDeco();
        firstCardElement.appendChild(squareDeco);
        cardElement.innerText = "";
        cardBackDeco();
        cardElement.appendChild(squareDeco);
      }, 1000);
    }
    // reset the first card
    firstCard = null;
  }
};

/* ##############
## GAME INITIALISATION LOGIC ##
############## */
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  boardElement = document.createElement("div");

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
      square = document.createElement("div");

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

      cardBackDeco();
      square.appendChild(squareDeco);

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const buildOtherElements = () => {
  // fill game info div with starting instructions
  gameInfo.classList.add("game-info");
  gameInfo.innerText = `Let's play !`;
  document.body.appendChild(gameInfo);

  //create overlay
  overlay = document.createElement("div");
  overlay.classList.add("overlay-text", "visible");
  overlay.innerHTML = "Enter your name here and press Enter";
  document.body.appendChild(overlay);

  //create userName field
  userName = document.createElement("input");
  userName.classList.add("input");
  userName.autofocus = true;
  overlay.appendChild(userName);
  userName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      userName = userName.value;
      overlay.classList.remove("visible");
      output(`Let's play, ${userName}!`);
    } else return null;
  });

  //grid container for time and score
  gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  document.body.appendChild(gridContainer);

  // set initial timer
  timeRemaining = document.createElement("span");
  timeRemaining.classList.add("time-remaining");
  timeOutput();
  gridContainer.appendChild(timeRemaining);

  // set initial score
  scoreElement = document.createElement("span");
  scoreElement.classList.add("score");
  scoreOutput();
  gridContainer.appendChild(scoreElement);

  //button wrapper
  buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");
  document.body.appendChild(buttonWrapper);

  //button to start timer
  goStart = document.createElement("button");
  goStart.classList.add("button");
  goStart.innerText = "Start";
  buttonWrapper.appendChild(goStart);
  goStart.addEventListener("click", () => {
    lockBoard = false;
    gameInfo.innerText = "Match all cards";
    goStart.disabled = true;
    countDown();
  });

  goReset = document.createElement("button");
  goReset.classList.add("button");
  goReset.innerText = "Reset";
  buttonWrapper.appendChild(goReset);
  goReset.addEventListener("click", gameReset);
};

buildOtherElements();

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // slice is done randomly
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let sliceStart = 2 * Math.round(getRandomIndex(88) / 2);
  let deckSubset = doubleDeck.slice(
    sliceStart,
    sliceStart + boardSize * boardSize
  );
  deck = shuffleCards(deckSubset); // array cannot be reassigned thats why the global variable is still empty

  // deal the cards out to the board data structure to get pairs of each cards
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

initGame();
