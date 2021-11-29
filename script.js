// Please implement exercise logic here

// Matrix creation
// const grid = [
//   ['A', 'B'],
//   ['Y', 'Z'],
// ];

// const upperLeftPosition = grid[0][0]; // 'A'
// const upperRightPosition = grid[0][1]; // 'B'
// const lowerLeftPosition = grid[1][0]; // 'Y'
// const lowerRightPosition = grid[1][1]; // 'Z'

// Global Variables
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
const gameInfo = document.createElement("div");
gameInfo.id - "gameInfo";
let currentScore = 0;
const maxScore = boardSize * 2;

const cardRankEmojiMap = {
  1: "🅰",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
  9: "9️⃣",
  10: "🔟",
  11: "👑👶",
  12: "👑👩",
  13: "👑👨",
};

const cardNameMap = {
  1: "Ace",
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: "Jack",
  12: "Queen",
  13: "King",
};

const winMessage = document.createElement("div");
winMessage.id = "winMessage";
winMessage.innerText = "You've Won!\n✨✨✨✨✨";
// i can't actually figure out how to make this look more like an annoying popup message
// but whatever

// Gameplay Logic
const squareClick = (cardElement, column, row) => {
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
    console.log("first turn");
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.cardRankEmoji;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log("second turn");
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      // console.log("match");
      currentScore++;
      gameInfo.innerText = `A Match! Continue opening your cards.\nYour current score is ${currentScore}. `;
      setTimeout(() => {
        gameInfo.innerText = '"Pick a card, any (closed) card..."';
      }, 1000);

      // turn this card over
      cardElement.innerText = clickedCard.cardRankEmoji;
    } else {
      // console.log("NOT a match");

      // show card to user for 3 seconds before turning over
      gameInfo.innerText =
        "Not a Match - Cards will be turned over again in 3 seconds!";
      cardElement.innerText = clickedCard.cardRankEmoji;
      setTimeout(() => {
        console.log("waiting 3 seconds...");
        // turn both cards back over
        firstCardElement.innerText = "";
        cardElement.innerText = "";
        gameInfo.innerText = "Pick a card, any (closed) card...";
      }, 1000);
    }

    // reset the first card
    firstCard = null;
  }
  if (currentScore == maxScore) {
    gameInfo.innerText = "Well done! You've completed the game.";
    document.body.appendChild(winMessage);
    setTimeout(() => {
      const elementsToRemove = document.getElementById("winMessage");
      elementsToRemove.remove();
    }, 5000);
  }
};

// Game Initialization Logic
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

const makeDeck = function () {
  const cardDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  let suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    let rankCounter = 1;
    while (rankCounter <= 13) {
      const cardName = cardNameMap[rankCounter];
      const cardRankEmojiTemp = cardRankEmojiMap[rankCounter];

      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        cardRankEmoji: cardRankEmojiTemp,
      };
      cardDeck.push(card);
      cardDeck.push(card);
      rankCounter += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};

const shuffleCards = function (array) {
  // based on Durstenfeld shuffle
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
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

  gameInfo.innerText = "Welcome to Match Game - click any two cards to begin~";
  gameInfo.className = "game-info";
  document.body.appendChild(gameInfo);
};

// const checkBoardCompletion = () => {
//   let boardComplete = false
//   console.log("checking board...")
//   // check every div class-'square' element in the div class="board" does not have empty innerText
//   if(document.getElementById('square').innerText.trim().length == 0) {
//     // console.log(document.getElementById('square').innerText)
//     boardComplete = true
//     // strict inequality: if there are any elements with inner text equal to ''
//     // then boardComplete is set to false
//     console.log(`boardComplete: ${boardComplete}`)
//     console.log("incomplete tiles remaining. continuing game.")
//   }
//   return boardComplete
//   // incomplete code
// }

// Main Function
initGame();
