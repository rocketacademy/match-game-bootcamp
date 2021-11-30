// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let cardsPerPlayer = 0;
let clickCount = 0;
let playerTurn = 1;
let player1Score = 0;
let player2Score = 0; 

const gameInfo = document.createElement('h2');
gameInfo.classList.add('game-message')
document.body.appendChild(gameInfo)

// fill game info div with starting instructions
gameInfo.innerText = "CHOOSE A CARD TO FLIP OVER ";
document.body.appendChild(gameInfo);
// for displaying output message
const output =(message) => {
  gameInfo.innerText = message;
}

//Actual parameters: event.currentTarget, i, j
//cardElement that was in the output was the div container: e.g., <div class= "square">7</div> In other words, cardElement is basically a HTML container. 
const squareClick = (cardElement, column, row, playerXScore) => {

    console.log(cardElement);
    //first turn firstCard returns null, subsequently, it takes the value of the card that was drawn on the first turn:  {name: '7', suit: 'hearts' etc.}
    console.log('FIRST CARD DOM ELEMENT', firstCard);
    //This outputs the card that was drawn. On the second turn, it pushes the card that was drawn in the first turn into firstCard and reflects only the card that was drawn
    //on the second turn. I suppose then board[column][row] selects the card from the array of array 
    console.log('BOARD CLICKED CARD', board[column][row]);
    //stores the card from the array of array into clickedCard. This is how a card gets selected. 
    const clickedCard = board[column][row]; 

    // the user already clicked on this square
    //if there's already text in the square
    if( cardElement.innerText !== '' ){
        return;
    }

    // first turn
    if (firstCard === null) {
      console.log('first turn');
      //takes the value of the card; clicked card is one card in the array
      firstCard = clickedCard;
      // turn this card over
      cardElement.innerText = firstCard.name;
      cardElement.innerText += firstCard.suitSymbol;
      output("CHOOSE ANOTHER CARD. IT MUST BE A MATCH.")
      // cardElement.innerHTML = `${createCard(clickedCard)}`;
  
      // hold onto this for later when it may not match
      //first cardElement is a global empty variable
      firstCardElement = cardElement;

    // second turn
    } else {
    
      console.log('second turn');
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        output("CONGRATS ITS A MATCH")
        console.log('match');
        playerXScore += 1;
        // turn this card over
        cardElement.innerText = clickedCard.name;
        cardElement.innerText += clickedCard.suitSymbol;
      } else {
        console.log('NOT a match');
        output("IT IS NOT A MATCH. TRY AGAIN!")
        cardElement.innerText = clickedCard.name;
        cardElement.innerText += clickedCard.suitSymbol;
         setTimeout(() => {
          cardElement.innerText = '';
          firstCardElement.innerText = '';
        }, 300);
      }

      // reset the first card
      setTimeout(() => {
          firstCard = null;
          output("CHOOSE A CARD TO FLIP OVER ")
        },500);
      
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
    //Now is this board contains 4 arrays, hence its length is 4
    const row = board[i];

    // make an element for this row of cards
    //Each array will have its own div, but all will have a className of row
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    // Remember that row is board[i], which means it takes the no. of elements within each row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element in each row
      const square = document.createElement('div');

      // set a class for CSS purposes
      // The squares are created. 
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        if (playerTurn === 1) {
          squareClick(event.currentTarget, i, j, player1Score);
          //Each Click will increase ClickCount to keep track of no of clicks
          clickCount += 1;
          playerTurnMsg();
          if (clickCount > cardsPerPlayer) {
            playerTurn = 2;
            clickCount = 0;
          }
        }
        if (playerTurn === 2) {
          squareClick(event.currentTarget, i, j, player2Score);
          //Each Click will increase ClickCount to keep track of no of clicks
          clickCount += 1;
          playerTurnMsg();
          if (clickCount > cardsPerPlayer) {
            playerTurn = 1;
            clickCount = 0;
          }
        }
      });
      //appending each square in the row div
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
    //board is an empty array, in this case pushes 3 more empty array as boardsize is 4
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      //so "board" right now contains 4 arrays with 4 cards elements in each array
      board[i].push(deck.pop());
    }
  }
6
  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suitInfo = [
    { suitsShape: "hearts", suitsSymbol: "♥️", suitsColour: "red" },
    { suitsShape: "diamond", suitsSymbol: "♦️", suitsColour: "red" },
    { suitsShape: "clubs", suitsSymbol: "♣️", suitsColour: "black" },
    { suitsShape: "spades", suitsSymbol: "♠️", suitsColour: "black" },
  ];

  for (let suitIndex = 0; suitIndex < suitInfo.length; suitIndex += 1) {
    // make a variable of the current suit
    let currentSuit = suitInfo[suitIndex].suitsShape;
    let currentSymbol = suitInfo[suitIndex].suitsSymbol;
    let currentColour = suitInfo[suitIndex].suitsColour;

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        displayName = "A";
      } else if (cardName === '11') {
        cardName = 'jack';
        displayName = "J";
      } else if (cardName === '12') {
        cardName = 'queen';
        displayName = "Q";
      } else if (cardName === '13') {
        cardName = 'king';
        displayName = "K";
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        display: displayName,      //1,2,J,K
        colour: currentColour,     //red,black
        suitSymbol: currentSymbol, //"♥️"
      };

      // add the card to the deck
      newDeck.push(card); 
      // add double the cards to the deck
      // because we are not calling makeDeck function twice, but pushing, twice, they are ordered in the deck. 
      newDeck.push(card);
    }
  }

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

const createCard = (cardInfo) => {
  // Suit Div will contain suitsymbol "♥️"
  const suit = document.createElement('div');
  // Adding a classname called suit; this is necessary for CSS styling 
  suit.classList.add('suit');
  // Displaying the selected card's suitsymbol "♥️"
  suit.innerText = cardInfo.suitSymbol;
  // Name Div will contain suitName and suitColour 
  const name = document.createElement('div');
  // Const name, a div would have the class names of 'name' and then 'red/black'; this is necessary for CSS styling 
  name.classList.add('name', cardInfo.colour);
  // Displaying the selected card's displayname
  name.innerText = cardInfo.display;
  // const card is a div that will contain all the internal elements (i.e., suit, displayname and colour)
  const card = document.createElement('div');
  // Adding a classname called card; this is necessary for CSS styling
  card.classList.add('card');
  // Storing the internal elements of the card (i.e., suit, displayname and colour) into card div
  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

// const displayCard = (cardInfo, cardContainer) => {
//     const cardElement = createCard(cardInfo);
//     cardContainer.appendChild(cardElement);
//   };


const createInput = () => {
  const divCreateInput = document.createElement("div")
  divCreateInput.innerHTML = "Enter number of Cards drawn! "
  
  const inputCardNo = document.createElement("INPUT");
  inputCardNo.id = "myNumber"
  inputCardNo.setAttribute("type", "number")
  divCreateInput.appendChild(inputCardNo)

  const submitButton = document.createElement("button");
  submitButton.id = "myButton"
  submitButton.innerHTML = "submit"
  divCreateInput.appendChild(submitButton)

  document.body.appendChild(divCreateInput)

  submitButton.addEventListener("click", ()=> {
  cardsPerPlayer = inputCardNo.value;

  // const divMsg = document.createElement("div")
  divCreateInput.innerHTML += `<br> Each player will open ${cardsPerPlayer} cards!`
  })
}

  const divCreatePlayerTurn = document.createElement("div");
  divCreatePlayerTurn.className = "playerTurn";
  document.body.appendChild(divCreatePlayerTurn)

const playerTurnMsg = () => {

  if (playerTurn === 1) {
    divCreatePlayerTurn.innerHTML = `It's player 1's turn! Player 1's click remaining: ${cardsPerPlayer - clickCount}`
  }
  else if (playerTurn === 2) {
    divCreatePlayerTurn.innerHTML = `It's player 2's turn! Player 2's click remaining: ${cardsPerPlayer - clickCount}`;
  }
}

createInput();
initGame();
