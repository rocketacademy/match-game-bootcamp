// Please implement exercise logic here

// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

//Game play logic
const squareClick = (cardElement, column, row) => {
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
      // turn this card over
      cardElement.innerText = clickedCard.name;
    } else {
      console.log("NOT a match");
      // turn this card back over
      firstCardElement.innerText = "";
    }
    // reset the first card
    firstCard = null;
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
  document.body.appendChild(boardEl);
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

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

initGame();
