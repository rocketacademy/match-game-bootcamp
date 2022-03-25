
//#################### HELPER FUNCTIONS####################//

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['♣','♦','♥','♠'];

  for(let i = 0; i <suits.length; i+=1){
    let currentSuit = suits[i];
  
    for(let rankCounter = 1; rankCounter<=13; rankCounter +=1){
      let cardName = `${rankCounter}`;
      //set cardName for J, Q, K, A 
      if (cardName === '1') {
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }
      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      }     
      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }
  return newDeck;
};

//Randomize
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

//#################### GLOBAL VARIABLES ####################//
const boardSize = 4;
const board = [];
let firstCard = null;
let cardElement;
let deck;
let canClick = false;

//#################### PLAYER ACTION CALLBACKS ####################//
const squareClick = (messageBoard, cardElement, column, row) => {
    console.log(cardElement);
    console.log('FIRST CARD DOM ELEMENT', firstCard);
    console.log('BOARD CLICKED CARD', board[column][row]);
    const clickedCard = board[column][row]; 

    // the user already clicked on this square
    if( cardElement.innerHTML !== '' ){
        return;
    }

    // first turn
    if (firstCard === null) {
      console.log('first turn');
      firstCard = clickedCard;
      // turn this card over
      cardElement.classList.add('card');
      cardElement.innerHTML = `${firstCard.name}<br>${firstCard.suit}`;
      messageBoard.innerText = 'click on another square';
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
        // turn this card over
        messageBoard.innerText = 'it is a match!';
        cardElement.classList.add('card');
        cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
      } else {
       console.log('NOT a match');
        // turn this card back over
        messageBoard.innerText = 'not a match, try again!';
        cardElement.classList.add('card');
        cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
    
      // turn both cards over after 0.5 seconds 
      setTimeout(()=>{
        firstCardElement.innerHTML = '';
        firstCardElement.className = 'square';
        cardElement.innerHTML = '';
        cardElement.className = 'square';
        firstCard = null;
        },500);
      }
        //reset the first card
        firstCard = null;
      //
    }
};

//#################### INITIALISATION ####################//
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');
  
  //message board
  const messageBoard = document.createElement('div');
  messageBoard.classList.add('messages');
  messageBoard.innerText = 'click on a square';
  boardElement.appendChild(messageBoard);

  let seconds = 10
  //set timer for 3 minutes
  const formatTime = (time) =>{
    const minutes = Math.floor(time/60)
    seconds = time%60;
    if (seconds <10){
      seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
  }
  const timeContainer = document.createElement("div");

  const ref = setInterval(() =>{
    timeContainer.innerHTML = formatTime(seconds)
  seconds-=1;
  if(seconds<0){
    clearInterval(ref);
    timeContainer.innerHTML = "Time is up";
  }
  boardElement.appendChild(timeContainer);
  },1000)

  timeContainer.classList.add("timer");
   //prevent user from clicking button

  //classList.add is added to html and call css styling "timer" accordingly
 


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
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        squareClick(messageBoard, event.currentTarget, i, j);
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
  let doubleDeck = shuffleCards(makeDeck());
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = deckSubset;

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
//#################### CALL initGame FUNCTION ####################//
initGame();