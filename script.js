// Please implement exercise logic here
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let secondCard = "";
let firstCardElement;
let deck;
const timer = document.createElement("p");
document.body.appendChild(timer);
const gameInfo = document.createElement("p");
document.body.appendChild(gameInfo);
let canClick = true;
let cardsLeft = boardSize * boardSize;
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  console.log("FIRST CARD DOM ELEMENT", firstCard);
  console.log("BOARD CLICKED CARD", board[column][row]);

  // FIRST CLICK
  if (firstCard === null && canClick) {
    firstCard = board[column][row];
    // turn this card over
    cardElement.innerText = `${firstCard.name},${firstCard.suit}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement; //correspond to line 34 where you can flip back the first card
    console.log(canClick);

    // SECOND CLICK
  } else if (
    canClick &&
    board[column][row].name === firstCard.name &&
    board[column][row].suit === firstCard.suit
  ) {
    console.log("match");
    // turn this card over and print card name on the square
    cardElement.innerText = `${board[column][row].name},${board[column][row].suit}`;
    //code added in by me so that numbers clicked will continue to be displayed for both cards and not just the first card
    firstCard = null;
    gameInfo.innerText = "It is a match";
    setTimeout(function () {
      gameInfo.innerText = "";
    }, 3000);
    console.log(canClick);
    cardsLeft = cardsLeft - 2;
  } else if (canClick) {
    console.log("NOT a match");
    canClick = false;
    secondCard = board[column][row];
    cardElement.innerText = `${secondCard.name},${secondCard.suit}`;
    firstCard = null;
    const flipCards = () => {
      canClick = true;
      firstCardElement.innerText = "";
      cardElement.innerText = "";
    };
    setTimeout(flipCards, 3000);
    console.log(canClick);
  }
  if (cardsLeft === 0) {
    clearInterval(timerCountDown);
    timer.innerText = "Congrats, You Won";
  }
};

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["♥", "♢", "♣", "♠"];

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
        cardName = "ace";
      } else if (cardName === "11") {
        cardName = "jack";
      } else if (cardName === "12") {
        cardName = "queen";
      } else if (cardName === "13") {
        cardName = "king";
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

const shuffleCards = (deck) => {
  numberOfCards = deck.length;
  for (i = 0; i < deck.length; i++) {
    const randomIndex = Math.floor(Math.random() * numberOfCards);
    const originalCard = deck[i];
    const newCard = deck[randomIndex];
    deck[i] = newCard;
    deck[randomIndex] = originalCard;
  }
  return deck;
};
let timerCountDown = null;
const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let currentTime = 20;
  timerCountDown = setInterval(() => {
    currentTime = currentTime - 1;
    timer.innerText = `Seconds Left: ${currentTime}`;
    if (currentTime === 0) {
      timer.innerText = `Time's Up, You Lose`;
      clearInterval(timerCountDown);
      const squares = document.querySelectorAll(".square");
      for (i = 0; i < squares.length; i++) {
        squares[i].innerHTML = "";
      }
    }
  }, 1000);
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  console.log(deck);
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  console.log(board);
  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

initGame();
