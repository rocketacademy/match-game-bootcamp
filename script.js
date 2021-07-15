// Create deck of cards
const getRandomNumber = (maxValue) => Math.floor(Math.random() * maxValue);

const shuffleCards = (cardArray) => {
  // loop over the entire cards array
  for (
    let currentIndex = 0;
    currentIndex < cardArray.length;
    currentIndex += 1
  ) {
    // select a random position from the deck
    const randomIndex = getRandomNumber(cardArray.length);
    // get the current card in the loop
    const currentItem = cardArray[currentIndex];
    // get the random card
    const randomItem = cardArray[randomIndex];
    // swap the current card and the random card
    cardArray[currentIndex] = randomItem;
    cardArray[randomIndex] = currentItem;
  }
  // give back the shuffled deck
  return cardArray;
};

// this makeDeck function creates two decks
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  // Array to store the details of the card like Suit, Symbol and Color for respective suit
  const suits = [
    ["hearts", "♥", "red"],
    ["diamonds", "♦", "red"],
    ["clubs", "♣", "black"],
    ["spades", "♠", "black"],
  ];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex][0];
    const currentSuitSymbol = suits[suitIndex][1];
    const currentCardColor = suits[suitIndex][2];

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let displayName = cardName;

      // 1, 11, 12 ,13
      if (cardName === "1") {
        cardName = "ace";
        displayName = "A";
      } else if (cardName === "11") {
        cardName = "jack";
        displayName = "J";
      } else if (cardName === "12") {
        cardName = "queen";
        displayName = "Q";
      } else if (cardName === "13") {
        cardName = "king";
        displayName = "K";
      }

      // make a single card object variable
      const card = {
        name: cardName,
        display: displayName,
        suit: currentSuit,
        suitSymbol: currentSuitSymbol,
        rank: rankCounter,
        color: currentCardColor,
        matched: false,
      };

      // add the card to the deck
      newDeck.push(card);
      // Cards are duplicated - for matching cards
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Store player's name
let playerName = "";
const playerNameTag = document.querySelector("input");
const submitNameTag = document.querySelector(".submit-btn");

// Showing different divs
const inputDiv = document.querySelector(".name-div");
const gameControlsDiv = document.querySelector(".game-controls");
// Game controls are set to hidden by default

const startBtnTag = document.querySelector(".start-btn");
const replayBtnTag = document.querySelector(".replay-btn");
const endBtnTag = document.querySelector(".end-btn");

// Display instructions to user
const instructions = document.querySelector("h2.instructions-text");

// before the game starts
let gameStarted = false;

// Initialize game to begin
const initGame = () => {
  // User hasn't keyed in the name yet
  // if gameStarted is false
  inputDiv.style.display = "flex";
  if (!gameStarted) {
    gameControlsDiv.style.display = "none";
    boardTag.style.display = "none";
  }
};

// Create random board of cards
const boardSize = 4;
const boardOfCards = [];
const boardTag = document.querySelector("div.board");
let boardElement = null;

// create div to hold the cards
// all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // use the board data structure we passed in to create the correct size board
  for (let indexRow = 0; indexRow < board.length; indexRow += 1) {
    // make a var for just this row of cards
    const row = board[indexRow];

    // make an element for this row of cards
    const divRowElement = document.createElement("div");
    divRowElement.classList.add("row");

    // make all the squares for this row
    for (let indexCol = 0; indexCol < row.length; indexCol += 1) {
      // create the square element
      const divSquareElement = document.createElement("div");

      // set a class for CSS purposes
      divSquareElement.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      divSquareElement.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, indexRow, indexCol);
      });

      divRowElement.appendChild(divSquareElement);
    }
    boardTag.appendChild(divRowElement);
  }
  return boardTag;
};

// Function takes in the card position in the board & card object,
// creates element to store the card-name and card-suit
// add class name to the display card element so i can call on it later to be turned over
const displayCardElement = (cardElement, cardInfo, className) => {
  const cardRevealDiv = document.createElement("div");
  cardRevealDiv.classList.add("card-reveal");
  cardRevealDiv.classList.add(className);

  // Creating the element for storing the card display name
  // 2 Class names are applicable "name, <color>"
  const divNameElement = document.createElement("div");
  divNameElement.classList.add("card-name", cardInfo.color);
  divNameElement.innerText = cardInfo.display;

  // Creating the element for storing the suit symbol of the card
  // Class = "suit , <color>"
  const divSuitElement = document.createElement("div");
  divSuitElement.classList.add("card-suit", cardInfo.color);
  divSuitElement.innerText = cardInfo.suitSymbol;

  // The parent cardRevealDiv holds both the display name and suit symbol
  cardRevealDiv.appendChild(divNameElement);
  cardRevealDiv.appendChild(divSuitElement);

  // This element represents a whole single card
  cardElement.innerHTML = "";
  cardElement.appendChild(cardRevealDiv);
  // Card element is returned from this function
  return cardElement;
};

// takes card object and shows that card have been matched
// changes the card to "matched = true" so that users cannot click on it again
// leaves is on display, don't turn the card back down
const changeMatchedCardsDisplay = (cardObj) => {
  // since div now exists (after displayCardElement function), I can pick it again
  const cardNameDiv = document.querySelector(".card-name");
  cardNameDiv.innerHTML = "🎉";

  const cardSuitDiv = document.querySelector(".card-suit");
  cardSuitDiv.innerHTML = "👏";
  cardObj.matched = true;
};

// store card element of the first card
let firstCard = null;
let firstCardElement;

// set a mode so that the user can click on the cards
let canClick = true;

// cardElement ==> currently clicked square element for the card
// When card element is clicked (column & row = location of the card on the board)
const squareClick = (cardElement, column, row) => {
  const currentCard = boardOfCards[column][row];
  console.log(cardElement);

  // the user cannot do anything if we set canClick to false
  if (canClick === false) {
    return;
  }

  // When we have the first card already and we click on the same card
  if (firstCard !== null && currentCard.matched === true) {
    canClick = true;
    console.log(`you can't click on the same card`);
  }

  // We don't have a first card yet
  if (firstCard === null) {
    // First card is chosen to be the current card
    firstCard = currentCard;
    console.log(`first card is `, firstCard);
    // mark the first card as matched (although we do this again in changeMatchedCardsDisplay, it's to prevent the user from clicking on itself)
    firstCard.matched = true;

    // hold onto this for later when it may not match
    // firstCardElement = cardElement;

    // turn this card over by displaying the text, leave it open for 3000 milliseconds
    displayCardElement(cardElement, firstCard, "first-card");
    instructions.innerHTML = "Pick another card.";

    // When we are considering two cards for matching, leave the first card to be open for 3 seconds
    // it will automatically disappear if the second card doesnt match
    setTimeout(() => {
      // turn this card back over
      const firstCardRevealDiv = document.querySelector(".first-card");
      firstCardRevealDiv.style.display = "none";
      console.log(`the first card disappears`);
      console.log(`first card inside here is `, firstCard);
    }, 3000);
  }

  // Conditions for matching
  else if (
    currentCard.name === firstCard.name &&
    currentCard.suit === firstCard.suit
  ) {
    // turn this card over & create the divs
    // leave the cards are revealed
    displayCardElement(cardElement, currentCard, "second-card");
    changeMatchedCardsDisplay(firstCard);
    changeMatchedCardsDisplay(currentCard);
    console.log("i matched using ", firstCard, "currentCard");

    instructions.innerHTML = "🎉 You found a pair!";
    // Allow the user to continue the game
    canClick = true;
    // reset the first card to null again, because i am going to look for a new pair
    firstCard = null;

    // We have the first card already
  } else {
    // show the card that has just been clicked, two cards are open now
    displayCardElement(cardElement, currentCard, "second-card");
    console.log(currentCard, `does not match first card`);

    // we disable clicking before the second card disappears
    canClick = false;

    // If the 2 selected cards are not matching
    instructions.innerHTML = "Try again 💫";

    // After second card has been picked (currentCard), we leave 1 second to display before we turn it back over
    setTimeout(() => {
      const secondCardRevealDiv = document.querySelector(".second-card");
      secondCardRevealDiv.style.display = "none";
      canClick = true;
      firstCard = null;
      console.log(`the cards don't match and delay has happened`);
    }, 1000);
  }
};

const startGame = () => {
  gameControlsDiv.style.display = "none";
  boardTag.style.display = "inline-block";

  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    boardOfCards.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      boardOfCards[i].push(deck.pop());
    }
  }
  boardElement = buildBoardElements(boardOfCards);
  return boardElement;
};

// =========== GAME BEGINS ==========

initGame();

// Store player's name then show game controls
submitNameTag.addEventListener("click", () => {
  // If there is a name
  if (playerNameTag.value) {
    playerName = playerNameTag.value;
    instructions.innerHTML = `Nice to meet you, ${playerName}! <br>Wanna match the card pairs?`;
    inputDiv.style.display = "none";
    gameControlsDiv.style.display = "flex";
    replayBtnTag.style.display = "none";
  } else {
    playerNameTag.placeholder = "Don't forget to tell us your name :( ";
  }
  // Signal that the game has started
  gameStarted = true;
});

// When user starts the game, deal the cards to the grid
startBtnTag.addEventListener("click", () => {
  if (gameStarted) {
    startGame();
  }
});

// When user runs out of time or ends the game, ask to replay the game
endBtnTag.addEventListener("click", () => {
  gameStarted = false;
  boardTag.style.display = "none";
  endBtnTag.style.display = "none";
  startBtnTag.style.display = "none";
  replayBtnTag.style.display = "block";
  instructions.innerHTML = `Sorry to see you go, ${playerName}!<br>`;
});

replayBtnTag.addEventListener("click", () => {
  console.log("game will replay");
  instructions.innerHTML = `What's your name, new player?`;
  initGame();
});
