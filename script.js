
// boardSize has to be an even number
const boardSize = 4;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;

const container =  document.querySelector(".container")


//0 means can flip first card , 1 means 2nd card  
let gameState= 0

//Part 1: you need a deck of cards, 2 cards each from each deck, say if u need 16 cards, 1 card each from 
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitsPic = ["❤️", "♦️", "♣", "♠"]

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const currentSuitsPic=suitsPic[suitIndex]
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
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
        suitPic: currentSuitsPic,
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
  let boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  boardElement.innerHTML =""

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    console.log("row",row)

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

        console.log(event.currentTarget)

      });

    
      rowElement.appendChild(square)
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};


const getRandomIndex = (max) => Math.floor(Math.random() * max);

//get randomEvenIndex from 0 to 87 

const getRandomEven = (max) => 
{let number
  do{
    number = Math.floor(Math.random() * max)
} while (number%2 ===1)

return number}
                  

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

const initGame = () => {

// create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
let evenNumber = getRandomEven(87)
console.log(evenNumber)
  let deckSubset = doubleDeck.slice(evenNumber, (boardSize * boardSize + evenNumber));


  console.log(deckSubset)
  deck = shuffleCards(deckSubset);
  board =[]
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  console.log(board)
  container.innerHTML =""

  const timerBorderDiv = document.createElement("div")
  timerBorderDiv.classList.add("timer-border")

  const timeDiv = document.createElement("div")
  timeDiv.classList.add("timer")
 const boardEl = buildBoardElements(board);
timerBorderDiv.appendChild(timeDiv)
 container.appendChild(timerBorderDiv)
 container.appendChild(boardEl);

 timer()
document.getElementById("play-btn").disabled = true;

};


//function to show match message 
const showMatchMsg = () =>
{ 
const messageDiv = document.querySelector(".message")
messageDiv.innerHTML =`It is a match!`

setTimeout(()=>{
messageDiv.innerHTML =""
gameState=0
},1000)
}



const squareClick = (cardElement, column, row) => {

    console.log(cardElement);
    
    console.log('FIRST CARD DOM ELEMENT', firstCard);
    
    console.log('BOARD CLICKED CARD', board[column][row]);
    
    const clickedCard = board[column][row]; 

    // the user already clicked on this square
    if( cardElement.innerText !== ''){
        return;
    }

   
    // first turn
    if (firstCard === null) {
       if (gameState===0){
     
      console.log('first turn');
      firstCard = clickedCard;
      // turn this card over
      
      cardElement.classList.add('flip')
      cardElement.innerText = firstCard.name;
      cardElement.innerHTML += `<br> ${firstCard.suitPic}`
  
      // hold onto this for later when it may not match
      firstCardElement = cardElement;
       gameState +=1 
       console.log(gameState)

    // second turn
    } }
    else {
      console.log('second turn');
    if (gameState === 1){
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {

        console.log('match');
        // turn this card over

      cardElement.classList.add('flip')
        cardElement.innerText = clickedCard.name;
        cardElement.innerHTML += `<br>${clickedCard.suitPic}`
        showMatchMsg()
        

      } else {
        console.log('NOT a match');

      cardElement.classList.add('flip')
        cardElement.innerText = clickedCard.name;
        cardElement.innerHTML += `<br>${clickedCard.suitPic}`
        setTimeout(()=>{
        firstCardElement.innerText = ''
         cardElement.innerText = ''
         cardElement.classList.remove('flip')
         firstCardElement.classList.remove('flip')
           gameState=0
        ;},1000)

      }
  
      // reset the first card
      firstCard = null;
    }
  }
};

const playBtn = document.querySelector("#play-btn")


playBtn.addEventListener("click", initGame)


// want to display the timer as mm:ss, say starting from 3 minutes, then would be 03:00

const formatTime = (time) =>{
  const minutes = Math.floor(time/60)

  let seconds = time%60;
  if (seconds <10){
    seconds = `0${seconds}`
  }
  return `${minutes}:${seconds}`
}

//et timer
const timer = () =>{
const timerDiv = document.querySelector(".timer")
//count down by 1 seconds
const delayInMilliseconds = 1000;

//start timer from 3minutes
let seconds = 180
console.log(timerDiv)

const ref = setInterval(() =>{
  //to show timer (starting from 3minutes)
  timerDiv.innerText = formatTime(seconds)
if(seconds<=0){
  document.getElementById("play-btn").disabled = false;
  clearInterval(ref)
  container.innerHTML=""
}
seconds-=1
},delayInMilliseconds)

}


