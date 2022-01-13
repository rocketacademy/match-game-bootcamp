/* <----- CSS Class Names ----> */

const CLASS_CARD_ITEMS = `match-card-items`;

const CLASS_CARD_ROW = `match-card-row`;
const CLASS_CARD = `match-card`;
const CLASS_CARD_SUIT = `match-card-suit`;
const CLASS_CARD_NAME = `match-card-name`;

const CLASS_BANNER = `match-banner`;

const CLASS_GAME_DESC = `match-game-desc`;

/* <----- CONFIG ----> */

const BOARD_SIDE = 6;
const FREEZE_TIME = 3000;

/* <----- CARDS ----> */

const shuffleCards = (cards) => {
  const length = cards.length;
  for (let i = 0; i < length; i += 1) {
    const j = Math.floor(Math.random() * (length - i)) + i;
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

const MAX_RANK = 13;
const SUITS = ["❤️", "💎", "♣️", "♠️"];

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

    newDeck.push(card); // same obj ref
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
  const board = [];
  for (let i = 0; i < height; i += 1) {
    const row = [];
    for (let j = 0; j < width; j += 1) {
      row.push(cards.pop());
    }
    board.push(row);
  }
  return [board, boardSize];
};

/* <----- UI Helpers ----> */

const setBackGroundColor = (element, color) =>
  (element.style.backgroundColor = color);

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

// TODO move addEventListener to new helper
const newElementCard = (cardItem, game) => {
  const element = document.createElement(`div`);
  element.className += ` ${CLASS_CARD}`;
  element.addEventListener(`click`, () => {
    if (cardItem.faceUp) {
      console.warn(`already face up.....`);
      return;
    }
    if (isGameFreeze(game)) {
      console.warn(`Game is frozen`);
      return;
    }
    flipUp(cardItem);
    addActiveCardItem(game, cardItem);

    const activeCardsLength = getActiveCardsLength(game);
    if (activeCardsLength === 2) {
      settle(game);
    }
  });
  cardItem.element = element;
  return element;
};

/* <----- Logic Helpers ----> */

const isGameFreeze = ({ state }) => state.isFreeze;
const setGameFreeze = (game) => {
  console.log(`game freeze`);
  game.state.isFreeze = true;
};
const setGameUnFreeze = (game) => {
  console.log(`game unfreeze`);
  game.state.isFreeze = false;
};
const isAllPairsMatch = (game) => game.state.unMatchedCardsCount === 0;

const getActiveCardsLength = (game) => game.state.activeCardItemsFlipped.length;

const isMatchingCards = (cardA, cardB) => cardA === cardB;

// Called when pair matches.
const registerMatchingPair = (game) => {
  game.state.unMatchedCardsCount -= 2; //
};

/* <----- UI-Logic Helpers ----> */

const flipDown = (cardItem) => {
  const { element } = cardItem;
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
  setBackGroundColor(element, ``);
  cardItem.faceUp = false;
};

const flipUp = (cardItem) => {
  const { element, value } = cardItem;
  const { suit, name } = value;
  const elementCardSuit = newElementCardSuit(suit);
  const elementCardName = newElementCardName(name);
  setBackGroundColor(element, `white`);
  element.replaceChildren(elementCardName, elementCardSuit);
  cardItem.faceUp = true;
};

const unflipActiveCards = (cardItems) => {
  for (const cardItem of cardItems) {
    const { element } = cardItem;
    flipDown(cardItem);
  }
};

const addActiveCardItem = (game, cardItem) => {
  const { element } = cardItem;
  element.style.border = `1px solid #9acd32`;
  game.state.activeCardItemsFlipped.push(cardItem);
};

// Reconciliation after every two clicks.
const settle = (game) => {
  console.group(`[settle] Two cards clicked.`);
  const { state } = game;
  const { activeCardItemsFlipped } = state;
  // activeCardItemsFlipped.length === 2;

  const [cardItemA, cardItemB] = activeCardItemsFlipped;

  if (isMatchingCards(cardItemA.value, cardItemB.value)) {
    console.log(`Matching!`);
    registerMatchingPair(game);
    deactiveActiveCardItems(game);
  } else {
    console.log(`Not Matching!`);
    setGameFreeze(game);
    setTimeout(() => {
      setGameUnFreeze(game);
      unflipActiveCards(activeCardItemsFlipped);
      deactiveActiveCardItems(game);
    }, FREEZE_TIME);
  }

  if (isAllPairsMatch(game)) {
    console.log(`WIN`);

    document.getElementById(
      `header`
    ).innerHTML = ` 🔥🚀🔥🚀🔥 ON FIRE 🔥🚀🔥🚀🔥 `;
    setGameFreeze(game);
  }

  console.groupEnd();
};

// Clean up function after every two clicks
const deactiveActiveCardItems = (game) => {
  const activeCardsItem = game.state.activeCardItemsFlipped;
  for (const cardItem of activeCardsItem) {
    const { element } = cardItem;
    element.style.border = `1px solid black`;
  }
  game.state.activeCardItemsFlipped = [];
};

/* <----- DRIVER ----> */

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

  const elementGameDesc = document.createElement(`div`);
  elementGameDesc.innerHTML = `Click two cards, you will have a short viewing time if cards are not matching. Game ends when all cards open. glhf!`;
  elementGameDesc.className += ` ${CLASS_GAME_DESC}`;
  elementRoot.appendChild(elementCardItems);
  elementRoot.appendChild(elementGameDesc);
};
const main = (boardSide, elementRoot) => {
  const [cardGridValues, cardsCount] = newCardGrid(boardSide);
  const game = {
    cardItems: cardGridValues.map((row) => {
      return row.map((value) => {
        return { value, faceUp: false };
      });
    }),
    state: {
      isFreeze: false,
      activeCardItemsFlipped: [],
      unMatchedCardsCount: cardsCount,
    },
  };

  initGame(game, elementRoot);
};

const elementRoot = document.body;
main(BOARD_SIDE, elementRoot);
