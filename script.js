// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitSymbols = ['♥', '♦', '♣', '♠'];

  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    const currentSuitSym = suitSymbols[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let dispName = `${rankCounter}`;
      let suitColor = 'black';

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        dispName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        dispName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        dispName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        dispName = 'K';
      }
      if (currentSuit === 'hearts' || currentSuit === 'diamonds')
      {
        suitColor = 'red';
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        suitSymbol: currentSuitSym,
        suit: currentSuit,
        name: cardName,
        displayName: dispName,
        colour: suitColor,
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
const outputContainer = document.createElement('span');
const winContainer = document.createElement('span');
let canClick = true;
const timeLag = 1000;
let winRecord = 0;
const totalMatches = boardSize * boardSize / 2;
const timer = document.createElement('div');
let username = 'you';
const output = (message) =>
{
  outputContainer.innerText = message;
};
const winsOutput = () =>
{
  winContainer.innerText = `Wins: ${winRecord}/${totalMatches}  `;
};
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null && canClick) {
    output('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = `${firstCard.displayName}\n${firstCard.suitSymbol}`;
    cardElement.classList.add(firstCard.colour, 'openCard');
    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else if (canClick) {
    cardElement.innerText = `${clickedCard.displayName}\n${clickedCard.suitSymbol}`;
    cardElement.classList.add(clickedCard.colour, 'openCard');
    output('second turn');

    if (
      clickedCard.name === firstCard.name

    ) {
      output('match');
      winRecord += 1;
      winsOutput();
      setTimeout(() => {
        if (winRecord === totalMatches)
        {
          output('You Win! 🎉');
          document.body.removeChild(timer);
        }
        else output('first turn'); }, timeLag);

      // turn this card over
    } else {
      canClick = false;
      output('NOT a match');
      setTimeout(() => { firstCardElement.classList.remove('openCard');
        cardElement.classList.remove('openCard');

        // turn this card back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        canClick = true;
      }, timeLag);
    }
    // reset the first card
    firstCard = null;
  }
};
// Blank card
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (refBoard) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < refBoard.length; i += 1) {
    // make a var for just this row of cards
    const row = refBoard[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');
      // const square = createCard(refCard);

      // set a class for CSS purposes
      square.classList.add('square');
      // square.appendChild(createCard(refCard));

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
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

const startTable = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  console.log('a');
  console.log(username);
  output(`Game start: ${username} can start matching!`);
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

  const boardEl = buildBoardElements(board);
  return boardEl;
};
const askForUsername = () => {
  const inputName = document.createElement('input');
  const inputButton = document.createElement('button');

  inputName.type = 'text';
  inputName.placeholder = 'Your name';
  inputButton.innerText = 'Submit';
  document.body.appendChild(inputName);
  document.body.appendChild(inputButton);

  inputButton.addEventListener('click', () =>
  {
    username = inputName.value;
    console.log(username);
    document.body.removeChild(inputName);
    document.body.removeChild(inputButton);
    return true;
  });
  return false;
};
const initGame = () => {
  // ASK FOR USER
  askForUsername();
  const boardEl = startTable();

  document.body.appendChild(boardEl);
  document.body.appendChild(outputContainer);
  document.body.appendChild(winContainer);

  // END GAME FUNCTION THAT ENDS GAME IN 3MIN
  let seconds = 180;
  const delayInMilliseconds = 1000;

  timer.innerText = seconds;
  document.body.appendChild(timer);

  const ref = setInterval(() => {
    timer.innerText = `${seconds}s left`;

    if (seconds <= 0) {
      clearInterval(ref);
    }
    seconds -= 1;
  }, delayInMilliseconds);

  const threeMinMs = 180000;
  setTimeout(() => {
    document.body.removeChild(boardEl);
    if (winRecord === totalMatches)
    {
      output('You Win! 🎉');
    }
    else {
      output('GAME OVER 👿');
    }
  }, threeMinMs);
};
initGame();
