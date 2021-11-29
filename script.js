// Please implement exercise logic here

// boardSize has to be an even number
const boardSize = 4;
const cardSize = 16;
const board = [];
let firstCard = null;
let firstCardElement;
let deck = [];
let canClick = false;
let playerName = "";
let timeLeftInSeconds = 180;
let timeInterval;
let matchedCards = 0;
let matchesWon = 0;

const grid = [
  ["A", "B"],
  ["Y", "Z"],
];

const upperLeftPosition = grid[0][0]; // 'A'
const upperRightPosition = grid[0][1]; // 'B'
const lowerLeftPosition = grid[1][0]; // 'Y'
const lowerRightPosition = grid[1][1]; // 'Z'

const cardClick = (cardElement, row, column) => {
  canClick = false;
  const clickedCard = board[row][column];

  document.getElementById(clickedCard.id).classList.toggle("is-flipped");

  // the user already clicked on this square
  // if (cardElement.innerText !== "") {
  //   return;
  // }

  // first turn
  if (firstCard === null) {
    firstCard = clickedCard;
    // turn this card over
    // cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // second turn
    canClick = true;
    document.getElementById("message").innerText = "Select the second card";
  } else {
    if (clickedCard.id === firstCard.id) {
      document.getElementById("message").innerText = "Select the first card";
      reset();
    } else if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      // turn this card over
      document.getElementById(firstCard.id).classList.toggle("orange");
      document.getElementById(clickedCard.id).classList.toggle("orange");

      matchedCards += 2;

      if (matchedCards == cardSize) {
        document.getElementById("message").innerText = "You win this round!";
        document.getElementById(
          "matchesWon"
        ).innerHTML = `<h2 class="bangers">${playerName}'s Matches Won: ${matchesWon}<h2>`;
        clearInterval(timeInterval);
        setTimeout(() => {
          resetRound();
          document.getElementById("message").innerText =
            "Press play to start round";
        }, 5000);
      } else {
        document.getElementById("message").innerText = "Card is a match!";
        matchesWon++;
        setTimeout(() => {
          reset();
          document.getElementById("message").innerText =
            "Select the first card";
        }, 3000);
      }
    } else {
      // turn this card back over
      document.getElementById("message").innerText = "Card is not a match!";
      setTimeout(() => {
        document.getElementById(firstCard.id).classList.toggle("is-flipped");
        document.getElementById(clickedCard.id).classList.toggle("is-flipped");
        // reset the first card
        reset();
        document.getElementById("message").innerText = "Select the first card";
      }, 3000);
    }
  }
};

const reset = () => {
  firstCard = null;
  canClick = true;
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
      const card = document.createElement("div");

      // set a class for CSS purposes
      card.classList.add("card");

      // set the click event
      // eslint-disable-next-line
      // card.addEventListener("click", (event) => {
      //   // we will want to pass in the card element so
      //   // that we can change how it looks on screen, i.e.,
      //   // "turn the card over"
      //   cardClick(event.currentTarget, i, j);
      // });

      const cardInner = document.createElement("div");
      cardInner.classList.add("card__inner");
      cardInner.id = board[i][j].id;
      cardInner.addEventListener("click", function (e) {
        if (canClick) {
          cardClick(e.currentTarget, i, j);
        }
      });

      const cardFaceBack = document.createElement("div");
      cardFaceBack.classList.add("card__face");
      cardFaceBack.classList.add("card__face--back");
      cardFaceBack.innerHTML = `<img src="./images/cards/back.png" class="card-pic" />`;

      const cardFaceFront = document.createElement("div");
      cardFaceFront.classList.add("card__face");
      cardFaceFront.classList.add("card__face--front");
      cardFaceFront.innerHTML = `<img src="${board[i][j].pic}" class="card-pic" />`;

      cardInner.appendChild(cardFaceBack);
      cardInner.appendChild(cardFaceFront);

      card.appendChild(cardInner);

      rowElement.appendChild(card);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const getRandomIndex = (max) => Math.floor(Math.random() * max);

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
  const colors = ["red", "red", "black", "black"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const color = colors[suitIndex];

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
        pic: `./images/cards/${cardName}_of_${currentSuit}.png`,
        color: color,
      };

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
    }
  }

  return newDeck;
};

const cutDeck = () => {
  const singleDeck = shuffleCards(makeDeck());
  const boardLength = (boardSize * boardSize) / 2;
  let id = 0;

  for (let i = 0; i < boardLength; i++) {
    const cardToPush = singleDeck.pop();
    const cardToPush2 = { ...cardToPush };

    cardToPush.id = id++;
    cardToPush2.id = id++;

    deck.push(cardToPush);
    deck.push(cardToPush2);
  }

  deck = shuffleCards(deck);
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  cutDeck();

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  const message = document.createElement("h2");
  message.id = "message";
  message.classList.add("bangers");
  message.innerText = "Select the first card";

  if (playerName.length == 0) {
    const nameDiv = document.createElement("div");
    nameDiv.id = "name";

    const matchesWonDiv = document.createElement("div");
    matchesWonDiv.id = "matchesWon";
    matchesWonDiv.style.display = "none";
    document.body.appendChild(matchesWonDiv);

    const nameMessage = document.createElement("h2");
    nameMessage.classList.add("bangers");
    nameMessage.innerText = "Enter your name and press enter";
    nameDiv.appendChild(nameMessage);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name-input";
    nameInput.classList.add("name-input");
    nameDiv.appendChild(nameInput);

    document.body.appendChild(nameDiv);
  }

  const gameDiv = document.createElement("div");
  gameDiv.id = "game";
  if (playerName.length == 0) {
    gameDiv.style.display = "none";
  }

  const timeDiv = document.createElement("div");
  timeDiv.style.display = "flex";
  timeDiv.style.justifyContent = "center";

  const timeMessage = document.createElement("h2");
  timeMessage.classList.add("bangers");
  timeMessage.id = "timeMessage";
  timeMessage.innerText = "3:00";
  timeDiv.appendChild(timeMessage);

  const startButton = document.createElement("img");
  startButton.classList.add("start-button");
  startButton.src = "./images/play.png";
  startButton.addEventListener("click", () => {
    startRound();
  });
  timeDiv.appendChild(startButton);

  const resetButton = document.createElement("img");
  resetButton.classList.add("reset-button");
  resetButton.src = "./images/undo.png";
  resetButton.addEventListener("click", () => {
    resetRound();
  });

  timeDiv.appendChild(resetButton);
  gameDiv.appendChild(timeDiv);

  gameDiv.appendChild(message);
  gameDiv.appendChild(boardEl);

  document.body.appendChild(gameDiv);
};

const resetRound = () => {
  timeLeftInSeconds = 180;
  clearInterval(timeInterval);

  board.length = 0;
  deck.length = 0;
  firstCard = null;
  canClick = false;
  matchedCards = 0;

  document.getElementById("game").remove();

  initGame();
};

const startRound = () => {
  canClick = true;
  document.getElementById("message").innerHTML = `Select the first card`;

  timeInterval = setInterval(function () {
    refreshTimer();
  }, 1000);
};

const refreshTimer = () => {
  if (timeLeftInSeconds > 1) {
    timeLeftInSeconds--;
    const secondsDisplay = ("0" + (timeLeftInSeconds % 60)).slice(-2);
    const minutesDisplay = Math.floor(timeLeftInSeconds / 60);

    document.getElementById(
      "timeMessage"
    ).innerHTML = `${minutesDisplay}:${secondsDisplay}`;
  } else {
    clearInterval(timeInterval);
  }
};

document.addEventListener("keydown", function (event) {
  if (event.key == "Enter" && playerName.length == 0) {
    playerName = document.getElementById("name-input").value;
    document.getElementById(
      "matchesWon"
    ).innerHTML = `<h2 class="bangers">${playerName}'s Matches Won: ${matchesWon}<h2>`;

    document.getElementById("message").innerHTML = `Press play to start round`;

    document.getElementById("name").style.display = "none";
    document.getElementById("game").style.display = "";
    document.getElementById("matchesWon").style.display = "";
  }
});

initGame();
