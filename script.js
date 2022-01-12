const CLASS_CARD_ITEMS = `match-card-items`;
const CLASS_CARD_ROW = `match-card-row`;
const CLASS_CARD = `match-card`;
const CLASS_CARD_SUIT = `match-card-suit`;
const CLASS_CARD_NAME = `match-card-name`;

const CLASS_BANNER = `match-banner`;

const SUITS = ["❤️", "💎", "♣️", "♠️"];

const shuffleCards = (cards) => {
  const length = cards.length;
  for (let i = 0; i < length; i += 1) {
    const j = Math.floor(Math.random() * (length - i)) + i;
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

const MAX_RANK = 13;

/**
 *
 * @param {*} noOfPairs Number of pairs. This method generates a total of (noOfPairs * 2) cards.
 * @param {*} shuffle Shuffle if true.
 * @returns
 */
const makeShuffledDeck = (noOfPairs, shuffle = true) => {
  const newDeck = [];

  const lengthSuit = SUITS.length;

  let suitIndex = 0;
  let pairIndex = 0;
  while (pairIndex < noOfPairs) {
    suitIndex += 1;
    suitIndex %= lengthSuit;
    const currentSuit = SUITS[suitIndex];
    const rankCounter = pairIndex % MAX_RANK;
    let cardName = ``;
    if (rankCounter === 1) {
      cardName = `A`;
    } else if (rankCounter === 11) {
      cardName = `J`;
    } else if (rankCounter === 12) {
      cardName = `👸`;
    } else if (rankCounter === 0) {
      cardName = `👑`;
    } else {
      cardName = `${rankCounter}`;
    }
    const card = {
      name: cardName,
      suit: currentSuit,
      rank: rankCounter,
    };
    newDeck.push(card);
    newDeck.push(card);

    pairIndex += 1;
  }

  if (shuffle) {
    shuffleCards(newDeck);
  }

  return newDeck;
};

const FACE_DOWN_DESC = ``;
const newCardGrid = (boardSide) => {
  const height = (width = boardSide);
  const boardSize = height * width;
  // boardSize % 2 === 0;
  const pairs = boardSize / 2;
  const cards = makeShuffledDeck(pairs);
  console.log(cards);
  const board = [];
  for (let i = 0; i < height; i += 1) {
    const row = [];
    for (let j = 0; j < width; j += 1) {
      row.push(cards.pop());
    }
    board.push(row);
  }
  return board;
};

const flipDown = (cardItem) => {
  const { element } = cardItem;
  while (element.firstChild) {
    element.removeChild(myNode.lastChild);
  }
  cardItem.faceUp = false;
};

const newElementCardSuit = (suit) => {
  const element = document.createElement(`div`);
  element.innerText = `${suit}`;
  element.className += ` ${CLASS_CARD_SUIT}`;
  return element;
};

const newElementCardName = (suit) => {
  const element = document.createElement(`div`);
  element.innerText = `${suit}`;
  element.className += ` ${CLASS_CARD_NAME}`;
  return element;
};
const flipUp = (cardItem) => {
  const { element, value } = cardItem;
  console.log(cardItem);
  const { suit, name } = value;
  const elementCardSuit = newElementCardSuit(suit);
  const elementCardName = newElementCardName(name);

  element.replaceChildren(elementCardName, elementCardSuit);
  cardItem.faceUp = true;
};

const isGameFreeze = ({ state }) => {
  return state.isFreeze;
};

const setGameFreeze = (game) => {
  console.log(`game freeze`);

  game.state.isFreeze = true;
};
const setGameUnFreeze = (game) => (game.state.isFreeze = false);
const newElementCard = (cardItem, game) => {
  const element = document.createElement(`div`);
  element.className += ` ${CLASS_CARD}`;
  element.addEventListener(`click`, () => {
    if (cardItem.faceUp) {
      console.log(`already face up.....`);
      return;
    }
    if (isGameFreeze(game)) {
      console.log(`Game is frozen`);
      return;
    }

    setGameFreeze(game);
    setTimeout(() => {
      setGameUnFreeze(game);
    }, 3000);

    flipUp(cardItem);
  });
  cardItem.element = element;
  return element;
};

const initGame = (game, elementRoot) => {
  const { cardItems } = game;

  const elementCardItems = document.createElement(`div`);
  elementCardItems.className += ` ${CLASS_CARD_ITEMS}`;

  for (const cardRow of cardItems) {
    const elementCardRow = document.createElement(`div`);
    elementCardRow.className += ` ${CLASS_CARD_ROW}`;
    for (const cardItem of cardRow) {
      const elementCard = newElementCard(cardItem, game);
      elementCardRow.appendChild(elementCard);
    }
    elementCardItems.appendChild(elementCardRow);
  }
  elementRoot.appendChild(elementCardItems);
};
const main = (boardSide, elementRoot) => {
  const cardGridValues = newCardGrid(boardSide);
  const game = {
    cardItems: cardGridValues.map((row) => {
      return row.map((value) => {
        return { value, faceUp: false };
      });
    }),
    state: { isFreeze: false, activeCardsFlipped: [] },
  };

  initGame(game, elementRoot);
};

const BOARD_SIDE = 6;
const elementRoot = document.body;
main(BOARD_SIDE, elementRoot);
