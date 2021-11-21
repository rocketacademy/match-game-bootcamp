/* ##############
## GLOBAL VARIABLES ##
############## */
// boardSize has to be an even number
const boardSize = 4;
const board = [];
const gameInfo = document.createElement("div");
let firstCard = null;
let firstCardElement;
let cardElement;
let deck;
let square;
let squareDeco;
let goStart;
let timeRemaining;
let minute = 3;
let sec = 0;
let lockBoard = false; // use flag to not let user click while waiting for timeout

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

//timer & reset function
const countDown = () => {
    const handle = setInterval(function() {
    timeRemaining.innerHTML =
    minute + " : " + sec.toString().padStart(2,'0');
    if (minute !==0 && sec === 0) {
      minute--;
      sec = 60;
    }
    sec--;
    if (minute === 0 && sec<0) {
      gameInfo.innerText = "Game over!";
      console.log("game is over");
      clearInterval(handle);
      setTimeout(gameOver,3000);
  }
  },1000);
};

// function for game reset
const gameOver = () => {
 location.reload();
}

/* ##############
## GAME PLAY LOGIC ##
############## */
const squareClick = (cardElement, column, row) => {
  if(lockBoard) return; // check flag
  
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

    // second turn
  } else {
    lockBoard=true;
    console.log("second turn");
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      //show message for 1.5 seconds
      firstCardElement.classList.add("matched");
      cardElement.classList.add("matched");
      output("Matched!");
      setTimeout (() => {
      //if user finish before time is out
      if (document.getElementsByClassName("matched").length === boardSize*boardSize) {
      output("You won!");
      } else {
        output("Find cards to match");
      lockBoard = false;
      }
      },1500)

      // turn this card over
      cardElement.innerText = `${clickedCard.name} \n\ ${clickedCard.suitSymbol}`;
      
    } else {
      //show message for 1.5 seconds
      output("Not a match");
      setTimeout (() => {
      output("Find cards to match");
      lockBoard = false;
      },1500)

      // turn this card over for 1.5 seconds
      cardElement.innerText = `${clickedCard.name} \n\ ${clickedCard.suitSymbol}`;
      setTimeout( () => {
        // turn this card back over with card back deco
        firstCardElement.innerText = "";
        cardBackDeco();
        firstCardElement.appendChild(squareDeco);
        cardElement.innerText = "";
        cardBackDeco();
        cardElement.appendChild(squareDeco);
      }
      ,1500);
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

const initGame = () => {
  // fill game info div with starting instructions
  gameInfo.classList.add("game-info");
  gameInfo.innerText = "Let's play";
  document.body.appendChild(gameInfo);
  //button to start timer
  goStart = document.createElement("button");
  goStart.classList.add("start-button");
  goStart.innerText = "Start";
  gameInfo.appendChild(goStart);
  goStart.addEventListener("click", () => {
    goStart.remove();
    countDown();
  });
  // set initial timer
  timeRemaining = document.createElement("span");
  timeRemaining.classList.add("time-remaining");
  timeRemaining.innerHTML = minute + " : " + sec.toString().padStart(2,'0');
  document.body.appendChild(timeRemaining);

  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset); // array cannot be reassigned thats why the global variable is still empty

  // deal the cards out to the board data structure to get pairs of each cards
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

initGame();
