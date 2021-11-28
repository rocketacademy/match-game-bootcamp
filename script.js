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

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const suitSymbols = ["♥", "♦", "♣", "♠"];
  const suitColours = ["red", "red", "black", "black"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const cardSymbol = suitSymbols[suitIndex];
    const cardColour = suitColours[suitIndex];
    //console.log(`current suit: ${currentSuit}`);

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
        suitSymbol: cardSymbol,
        displayName: cardName,
        colour: cardColour,
      };

      //console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      //newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
let matchedNum = 0;
const matchedNumToWin = (boardSize * boardSize) / 2;
const gameInfo = document.createElement("div");

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

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let shuffledinitialDeck = shuffleCards(makeDeck());
  let deckSubset = [];
  for (i = 0; i < (boardSize * boardSize) / 2; i += 1) {
    let drawnCard = shuffledinitialDeck.pop();
    deckSubset.push(drawnCard);
    deckSubset.push(drawnCard);
  }
  // let doubleDeck = makeDeck();
  // let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
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

  gameInfo.innerText =
    "Welcome to Match Game! Open 2 cards to see if it matches";
  gameInfo.className = "game-info";
  document.body.appendChild(gameInfo);
};

const squareClick = (cardElement, column, row) => {
  if (canClick === true && matchedNum < matchedNumToWin) {
    canClick = false;

    // console.log(cardElement);

    // console.log("FIRST CARD DOM ELEMENT", firstCard);

    // console.log("BOARD CLICKED CARD", board[column][row]);

    const clickedCard = board[column][row];

    // the user already clicked on this square
    if (cardElement.innerText !== "") {
      canClick = true;
      return;
    }

    // first turn
    if (firstCard === null) {
      console.log("first turn");
      firstCard = clickedCard;
      // turn this card over
      cardElement.innerText = `${firstCard.name}
    ${firstCard.suitSymbol}`;

      // hold onto this for later when it may not match
      firstCardElement = cardElement;
      canClick = true;
      gameInfo.innerText = "Now open another card";
      // second turn
    } else {
      console.log("second turn");
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        matchedNum += 1;
        if (matchedNum === matchedNumToWin) {
          gameInfo.innerText = "Woohoo you matched ALL CARDS!!";
          setTimeout(() => {
            gameInfo.innerText = "";
          }, 5000);
        } else {
          console.log("match");
          gameInfo.innerText = "Wow matched! Continue opening 2 more cards";
          setTimeout(() => {
            gameInfo.innerText = "";
            canClick = true;
          }, 3000);
        }

        // turn this card over
        cardElement.innerText = `${clickedCard.name}
    ${clickedCard.suitSymbol}`;
      } else {
        console.log("NOT a match");
        cardElement.innerText = `${clickedCard.name}
    ${clickedCard.suitSymbol}`;
        gameInfo.innerText = "Oops no match, try opening 2 cards again";
        // turn this card back over after timeout
        setTimeout(() => {
          firstCardElement.innerText = "";
          cardElement.innerText = "";
          gameInfo.innerText = "";
          canClick = true;
        }, 1000);
      }

      // reset the first card
      firstCard = null;
    }
  }
};

initGame();
