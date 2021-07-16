// Please implement exercise logic here
// boardSize has to be an even number
const boardSize = 2;
let board = [];
let firstCard = null;
let firstCardElement;
let deck;

const outputContainer = document.createElement('div');
const winContainer = document.createElement('span');
let canClick = true;
const timeLag = 1000;
let winRecord = 0;
let winGames=0;
let lostGames=0;
const timer = document.createElement('div');
const totalMatches = boardSize * boardSize / 2;

let username = 'You';

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

const output = (message) =>
{
  outputContainer.innerText = message;
};
const winsOutput = (winRecord,totalMatches) =>
{
  
  console.log(`Wins: ${winRecord}/${totalMatches}  `)
  winContainer.innerText = `Wins: ${winRecord}/${totalMatches}  Win games: ${winGames}  Loss games: ${lostGames}`;
  setTimeout(() => {
       
        if (winRecord === totalMatches)
        {
          gameState='win';
          winFunc();
        }
        // else output('first turn');
       }, timeLag);

};
const winFunc=()=>
{
   output(`${username} Win! 🎉`);
  //  document.body.removeChild(timer);
}
const flipCardClose=(card)=>{
  card.classList.remove('openCard');
  card.innerText = '';
}
const flipCardOpen=(cardDom, cardObj)=>
{
  cardDom.innerText=`${cardObj.displayName}\n${cardObj.suitSymbol}`;
  cardDom.classList.add(cardObj.colour, 'openCard');
}
const squareClick = (cardElement, column, row) => {
  let gameState= 'in progress';
  const clickedCard = board[column][row];
  if (cardElement.innerText !== '') {
    return;
  }
  // first turn
  if (firstCard === null && canClick) {
    output('first turn');
    firstCard = clickedCard;
    // turn this card over
    flipCardOpen(cardElement,firstCard)
    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    // second turn
  } else if (canClick) {
    flipCardOpen(cardElement,clickedCard)
    output('second turn');
    if (
      clickedCard.name === firstCard.name
    ) {
      winRecord += 1;
      console.log(winRecord)
      winsOutput(winRecord,totalMatches);
       setTimeout(() => { 
            output('match');
      }, timeLag);
  
      

      // turn this card over
    } else {
      canClick = false;
      
      setTimeout(() => { 
        output('NOT a match');
        flipCardClose(firstCardElement);
        flipCardClose(cardElement);
        canClick = true;
      }, timeLag);
    }
    // reset the first card
    firstCard = null;
  }
  return gameState;
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
   board=[]
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
const startWithName = () => {
  const inputName = document.createElement('input');
  const inputButton = document.createElement('button');

  inputName.type = 'text';
  inputName.placeholder = 'Your name';
  inputButton.innerText = 'Submit';
  document.body.appendChild(inputName);
  document.body.appendChild(inputButton);
  output(`Please enter your name`);
  inputButton.addEventListener('click', () =>
  {
    username = inputName.value;
    console.log(username);
    document.body.removeChild(inputName);
    document.body.removeChild(inputButton);
    output(`Game start: ${username} can start matching!`);
  });
  return startTable();
};
const endGameByTimer=(duration, domToRemove)=>
{
  const durationMs = duration*1000;
  setTimeout(() => {
    endGame(domToRemove)
  }, durationMs);
}
const endGame=(domToRemove)=>{
    document.body.removeChild(domToRemove);
    if (winRecord === totalMatches)
    {
      winFunc();
      winGames+=1;
    }
    else {
      output('GAME OVER 👿');
      lostGames+=1;
    }
    winRecord=0;
    resetGame();
}
const hoursMinSecFromMs=(s)=>{
  let hours= Math.floor(s/3600);
  let minutes = Math.floor((s-hours*3600)/60);
  let secs = s-minutes*60-hours*3600;
  // let ms= miliSec-secs*1000-minutes*60000-hours*3600000
  return `${hours}hours ${minutes}mins ${secs}s left`;
}
const resetGame=()=>{
  
  setTimeout(()=>{
    canClick=true;
    clearBody();
    initGame();
  },3000)
      
     
}
const createTimerToEnd=(duration, domToRemove)=>{
  timer.innerHTML='';
  const delayInMilliseconds = 1000;
  const timerOutput=document.createElement('span');
  timerOutput.innerText = hoursMinSecFromMs(duration)

  const pauseButton= document.createElement('button');
  pauseButton.innerText='pause';
  let isPaused=false;

  const ref = setInterval(() => {
    
    timerOutput.innerText =  hoursMinSecFromMs(duration);
    if (duration <= 0) {
      clearInterval(ref);
      endGame(domToRemove);
    }
    duration -= 1;
  }, delayInMilliseconds);

  pauseButton.addEventListener('click', ()=>{
    
    if(!isPaused){
      clearInterval(ref)
      isPaused=true;
      pauseButton.innerText='un-pause';
    }
    else{
        const ref2 = setInterval(() => {
        timerOutput.innerText =  hoursMinSecFromMs(duration);
        if (duration <= 0) {
           clearInterval(ref2);
           endGame(domToRemove);

        }
        duration -= 1;
  }, delayInMilliseconds);
      pauseButton.innerText='pause';
      isPaused=false;
    }
    

  });
  timer.appendChild(timerOutput);
  timer.appendChild(pauseButton);
  return timer;
}
const initGame = () => {
  // ASK FOR USERNAME
  winRecord=0;
  winsOutput(winRecord,totalMatches);
  console.log(winRecord)
  const sweHeader= document.createElement('div');
  sweHeader.id='header'
  sweHeader.innerHTML='<h1 id="header">SWE101! 🚀</h1>'
 
  document.body.appendChild(sweHeader);
  const boardEl = startWithName();
  document.body.appendChild(boardEl);
  document.body.appendChild(outputContainer);
  console.log(winContainer)
  document.body.appendChild(winContainer);
  const timer = createTimerToEnd(5, boardEl);
  //upthere is functionality where timer is removed when player win on matching
  //However, if timer is created here and above, the document is able to remove the timer. is this like the issue of prototypes in C?
  document.body.appendChild(timer);  

 
};
const clearBody=()=>{
  document.body.innerHTML=''
}
initGame();
