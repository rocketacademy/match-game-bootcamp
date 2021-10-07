// Please implement exercise logic here
const grid = [
  ['A', 'B'],
  ['Y', 'Z'],
];

const upperLeftPosition = grid[0][0]; // 'A'
const upperRightPosition = grid[0][1]; // 'B'
const lowerLeftPosition = grid[1][0]; // 'Y'
const lowerRightPosition = grid[1][1]; // 'Z'

// boardSize has to be an even number
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;
let secondCard = null;
let canClick = true;
let delayInMilliSeconds = 3000;
let timeCheck = 1;
let timer = 180000;
let playerName =  '';
let winCounter = 0 ; 
let matches =  0;
const messageEl = document.createElement('p');
messageEl.className = 'message'

//create header scoreboard
const statsBoard = document.createElement('div');
const statsEl = document.createElement('p');
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset'


// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

const squareClick = (cardElement, column, row) => {

    console.log(cardElement);
    
    console.log('FIRST CARD DOM ELEMENT', firstCard);
    
    console.log('BOARD CLICKED CARD', board[column][row]);
    
    const clickedCard = board[column][row]; 

    // the user already clicked on this square or cannot click
    if( cardElement.innerText !== '' || canClick==false ){
        return;
    }

    // first turn
    if (firstCard === null) {
      console.log('first turn');
      firstCard = clickedCard;
      // turn this card over
      cardElement.innerText = firstCard.name;
  
      // hold onto this for later when it may not match
      firstCardElement = cardElement;

    // second turn
    } else {
    
      console.log('second turn');
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
        // create a message to show match and remove after 3s
        
        messageEl.innerText = 'MATCH!'
        document.body.appendChild(messageEl);
        matches += 1;
        setTimeout(()=>{
          messageEl.remove()
        },delayInMilliSeconds);
    
        // turn this card over
        cardElement.innerText = clickedCard.name;
      } else {
        console.log('NOT a match');
        secondCard = clickedCard;
        cardElement.innerText = clickedCard.name;
        
        canClick= false;
        
        


        const delayedFlip = () => {
          // turn this card back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        

        
        


        }
        setTimeout(delayedFlip,delayInMilliSeconds);
        setTimeout(()=>{
          canClick=true;
        }, delayInMilliSeconds) ;  
    
        
      }

      // reset the first card
      firstCard = null;
    }

    if (matches == 8){
      messageEl.innerText = "All matches found! Win"
      winCounter +=1 ;
      statsEl.innerText = `${playerName}'s Match Game! Current wins:${winCounter}`
    }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');

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

const resetGame =()=>{
  let numEle = document.body.childNodes.length;
  for (let i = numEle-1; i>1;  i-=1){
    document.body.childNodes[i].remove();
  }
  board = [];
  matches = 0;
  initGame();
}

const initGame = () => {
  // insert scoreboard elements
  statsEl.innerText = `${playerName}'s Match Game! Current wins:${winCounter}`
  statsBoard.appendChild(statsEl);
  statsBoard.appendChild(resetButton);
  document.body.appendChild(statsBoard);
  resetButton.addEventListener('click',resetGame);
  
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
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

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
      if (cardName === '1') {
        cardName = 'ace';
      } else if (cardName === '11') {
        cardName = 'jack';
      } else if (cardName === '12') {
        cardName = 'queen';
      } else if (cardName === '13') {
        cardName = 'king';
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



const enterName = ()=>{
  const inputField = document.createElement('input');
  const submitButton = document.createElement('button');
  const submitName = () => {
    playerName = inputField.value;
    messageEl.remove();
    inputField.remove();
    submitButton.remove();
    initGame();
  }
  if (playerName==''){
    messageEl.innerText = 'Please enter your name to start'
    document.body.appendChild(messageEl);
    submitButton.innerText = 'Submit';
    document.body.appendChild(inputField);
    document.body.appendChild(submitButton);
    submitButton.addEventListener('click',submitName);

  }else{
    initGame();
  }

  
}

enterName();
